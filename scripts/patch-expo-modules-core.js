#!/usr/bin/env node
/**
 * EAS Build fix: apply composite-build defaults to expo-modules-core/android/build.gradle
 * so "compileSdkVersion is not specified" and "release" SoftwareComponent errors are resolved.
 * Uses regex to tolerate both 1-space and 2-space indentation (npm package vs local can differ).
 */
const fs = require('fs');
const path = require('path');

const buildGradlePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-modules-core',
  'android',
  'build.gradle'
);

if (!fs.existsSync(buildGradlePath)) {
  console.warn('patch-expo-modules-core: build.gradle not found, skipping');
  process.exit(0);
}

let content = fs.readFileSync(buildGradlePath, 'utf8');
const original = content;

// 1) buildscript: add google() and AGP classpath (tolerate any whitespace)
if (!content.includes('google()')) {
  content = content.replace(
    /\s+repositories\s*\{\s*\n\s*mavenCentral\(\)/,
    '  repositories {\n    google()\n    mavenCentral()'
  );
  content = content.replace(
    /\s+dependencies\s*\{\s*\n\s*classpath\("org\.jetbrains\.kotlin:kotlin-gradle-plugin:\$\{getKotlinVersion\(\)\}"\)/,
    '  dependencies {\n    classpath("com.android.tools.build:gradle:8.1.1")\n    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${getKotlinVersion()}")'
  );
}

// 2) After buildscript, add rootProject.ext defaults for composite build
if (!content.includes('rootProject.ext.compileSdkVersion = 34')) {
  // Match closing of buildscript (repos }, dependencies }, buildscript } then "def isExpoModulesCoreTests")
  content = content.replace(
    /\}\s*\n\s*\}\s*\n\s*\}\s*\n\s*def isExpoModulesCoreTests = \{/,
    `}

// When used as composite build (includeBuild), root has no ext from main project; set defaults so compileSdkVersion etc. are defined
if (!rootProject.ext.has("compileSdkVersion")) {
  rootProject.ext.compileSdkVersion = 34
  rootProject.ext.minSdkVersion = 23
  rootProject.ext.targetSdkVersion = 34
}

def isExpoModulesCoreTests = {`
  );
  // Fallback: single } before "def isExpoModulesCoreTests" (in case buildscript format differs)
  if (!content.includes('rootProject.ext.compileSdkVersion = 34')) {
    content = content.replace(
      /\}\s*\n\s*def isExpoModulesCoreTests = \{/,
      `}

// When used as composite build (includeBuild), root has no ext from main project; set defaults so compileSdkVersion etc. are defined
if (!rootProject.ext.has("compileSdkVersion")) {
  rootProject.ext.compileSdkVersion = 34
  rootProject.ext.minSdkVersion = 23
  rootProject.ext.targetSdkVersion = 34
}

def isExpoModulesCoreTests = {`
    );
  }
}

// 3) android block: ensure compileSdkVersion and publishing at top (so "release" component exists and compileSdkVersion is set)
// Original has nested "if (!safeExtGet(...)) { compileSdkVersion ... defaultConfig ... publishing ... lintOptions }" - we need these at top level.
if (!content.includes('  compileSdkVersion safeExtGet("compileSdkVersion", 34)\n  publishing {')) {
  // Match android { then optional whitespace/comments then "if (!safeExtGet("expoProvidesDefaultConfig"" block with compileSdkVersion, defaultConfig, publishing, lintOptions
  const androidBlockRegex = /android\s*\{\s*\n\s*\/\/ Remove this if[^]*?if \(!safeExtGet\("expoProvidesDefaultConfig", false\)\)\s*\{\s*\n\s*compileSdkVersion safeExtGet\("compileSdkVersion", 34\)\s*\n\s*\n\s*defaultConfig\s*\{[^]*?minSdkVersion safeExtGet\("minSdkVersion", 23\)\s*\n\s*targetSdkVersion safeExtGet\("targetSdkVersion", 34\)\s*\n\s*\}\s*\n\s*\n\s*publishing\s*\{[^]*?singleVariant\("release"\)[^]*?withSourcesJar\(\)\s*\n\s*\}\s*\n\s*\n\s*lintOptions\s*\{[^]*?abortOnError false\s*\n\s*\}\s*\n\s*\}/;
  content = content.replace(androidBlockRegex, `android {
  compileSdkVersion safeExtGet("compileSdkVersion", 34)
  publishing {
    singleVariant("release") {
      withSourcesJar()
    }
  }
  // Remove this if and it's contents, when support for SDK49 is dropped
  if (!safeExtGet("expoProvidesDefaultConfig", false)) {
    lintOptions {
      abortOnError false
    }
  }
`);
}

// If the above big regex didn't match (e.g. different order), try 1-space indentation variant
if (!content.includes('  compileSdkVersion safeExtGet("compileSdkVersion", 34)\n  publishing {')) {
  const androidBlockRegex1Space = /android\s*\{\s*\n\s*\/\/ Remove this if[^]*?if \(!safeExtGet\("expoProvidesDefaultConfig", false\)\)\s*\{\s*\n\s*compileSdkVersion[^]*?singleVariant\("release"\)[^]*?withSourcesJar\(\)\s*\n\s*\}\s*\n\s*\n\s*lintOptions\s*\{[^]*?abortOnError false\s*\n\s*\}\s*\n\s*\}\s*\n\s*\}/;
  content = content.replace(androidBlockRegex1Space, `android {
  compileSdkVersion safeExtGet("compileSdkVersion", 34)
  publishing {
    singleVariant("release") {
      withSourcesJar()
    }
  }
  // Remove this if and it's contents, when support for SDK49 is dropped
  if (!safeExtGet("expoProvidesDefaultConfig", false)) {
    lintOptions {
      abortOnError false
    }
  }
`);
}

// 4) defaultConfig: ensure minSdkVersion and targetSdkVersion exist (in case they're only in the nested if)
if (content.includes('namespace "expo.modules"') && !content.includes('minSdkVersion safeExtGet("minSdkVersion", 23)')) {
  content = content.replace(
    /\s+namespace "expo\.modules"\s*\n\s*defaultConfig\s*\{\s*\n\s*consumerProguardFiles/,
    '  namespace "expo.modules"\n  defaultConfig {\n    minSdkVersion safeExtGet("minSdkVersion", 23)\n    targetSdkVersion safeExtGet("targetSdkVersion", 34)\n    consumerProguardFiles'
  );
}

fs.writeFileSync(buildGradlePath, content);

const changed = content !== original;
const hasFixes = content.includes('google()') && content.includes('rootProject.ext.compileSdkVersion = 34') && content.includes('singleVariant("release")');
if (changed || hasFixes) {
  console.log('patch-expo-modules-core: applied EAS composite-build fixes');
} else {
  console.warn('patch-expo-modules-core: no changes applied (file may already be patched or format unexpected)');
}
