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
// Normalize line endings so regex and string match work on any platform (EAS is Linux, but npm tarball can vary)
content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
const original = content;

// 1) buildscript: add google() and AGP classpath (tolerate any whitespace)
if (!content.includes('google()')) {
  // Keep leading newline so "  }" and "  repositories {" stay on separate lines
  content = content.replace(
    /(\n\s*)repositories\s*\{\s*\n\s*mavenCentral\(\)/,
    '$1repositories {\n    google()\n    mavenCentral()'
  );
  content = content.replace(
    /(\n\s*)dependencies\s*\{\s*\n\s*classpath\("org\.jetbrains\.kotlin:kotlin-gradle-plugin:\$\{getKotlinVersion\(\)\}"\)/,
    '$1dependencies {\n    classpath("com.android.tools.build:gradle:8.1.1")\n    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${getKotlinVersion()}")'
  );
}

// 2) After buildscript, add rootProject.ext defaults for composite build
if (!content.includes('rootProject.ext.compileSdkVersion = 34')) {
  const block = `
// When used as composite build (includeBuild), root has no ext from main project; set defaults so compileSdkVersion etc. are defined
if (!rootProject.ext.has("compileSdkVersion")) {
  rootProject.ext.compileSdkVersion = 34
  rootProject.ext.minSdkVersion = 23
  rootProject.ext.targetSdkVersion = 34
}

def isExpoModulesCoreTests = {`;
  // Match 2 closing braces then "def isExpoModulesCoreTests = {" (allow any line break and optional spaces)
  const replaced = content.replace(
    /\}\s*\n\s*\}\s*\n\s*def\s+isExpoModulesCoreTests\s*=\s*\{/,
    `  }
}${block}`
  );
  if (replaced !== content) content = replaced;
  // Fallback: single } before "def"
  if (!content.includes('rootProject.ext.compileSdkVersion = 34')) {
    const rep2 = content.replace(
      /\}\s*\n\s*def\s+isExpoModulesCoreTests\s*=\s*\{/,
      `}
}${block}`
    );
    if (rep2 !== content) content = rep2;
  }
}

// 3) android block: ensure compileSdkVersion and publishing at top (so "release" component exists and compileSdkVersion is set)
if (!content.includes('  compileSdkVersion safeExtGet("compileSdkVersion", 34)\n  publishing {')) {
  const newAndroidBlock = `android {
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

  if (rootProject.hasProperty("ndkPath"))`;
  // Try exact string first (2-space indent from npm package)
  const oldAndroidBlock = `android {
  // Remove this if and it's contents, when support for SDK49 is dropped
  if (!safeExtGet("expoProvidesDefaultConfig", false)) {
    compileSdkVersion safeExtGet("compileSdkVersion", 34)

    defaultConfig {
      minSdkVersion safeExtGet("minSdkVersion", 23)
      targetSdkVersion safeExtGet("targetSdkVersion", 34)
    }

    publishing {
      singleVariant("release") {
        withSourcesJar()
      }
    }

    lintOptions {
      abortOnError false
    }
  }

  if (rootProject.hasProperty("ndkPath"))`;
  if (content.includes(oldAndroidBlock)) {
    content = content.replace(oldAndroidBlock, newAndroidBlock);
  } else {
    // Fallback: regex that allows flexible whitespace (handles EAS/npm unpack differences)
    const flexRegex = /android\s*\{\s*\n\s*\/\/ Remove this if[\s\S]*?if\s*\(\s*!safeExtGet\s*\(\s*"expoProvidesDefaultConfig"\s*,\s*false\s*\)\s*\)\s*\{\s*\n\s*compileSdkVersion safeExtGet\("compileSdkVersion",\s*34\)[\s\S]*?singleVariant\s*\(\s*"release"\s*\)[\s\S]*?withSourcesJar\s*\(\s*\)[\s\S]*?lintOptions\s*\{[\s\S]*?abortOnError\s+false\s*\n\s*\}\s*\n\s*\}\s*\n\s*if\s*\(\s*rootProject\.hasProperty\s*\(\s*"ndkPath"\s*\)\s*\)/;
    content = content.replace(flexRegex, newAndroidBlock);
  }
}

// 4) defaultConfig: ensure minSdkVersion and targetSdkVersion exist (in case they're only in the nested if)
if (content.includes('namespace "expo.modules"') && !content.includes('minSdkVersion safeExtGet("minSdkVersion", 23)')) {
  content = content.replace(
    /\s+namespace "expo\.modules"\s*\n\s*defaultConfig\s*\{\s*\n\s*consumerProguardFiles/,
    '  namespace "expo.modules"\n  defaultConfig {\n    minSdkVersion safeExtGet("minSdkVersion", 23)\n    targetSdkVersion safeExtGet("targetSdkVersion", 34)\n    consumerProguardFiles'
  );
}

fs.writeFileSync(buildGradlePath, content);

const hasGoogle = content.includes('google()');
const hasRootExt = content.includes('rootProject.ext.compileSdkVersion = 34');
const hasPublishing = content.includes('  compileSdkVersion safeExtGet("compileSdkVersion", 34)\n  publishing {');
if (hasGoogle && hasRootExt && hasPublishing) {
  console.log('patch-expo-modules-core: applied EAS composite-build fixes (google, rootProject.ext, android block)');
} else {
  const missing = [];
  if (!hasGoogle) missing.push('google()');
  if (!hasRootExt) missing.push('rootProject.ext');
  if (!hasPublishing) missing.push('android compileSdkVersion/publishing');
  console.warn('patch-expo-modules-core: incomplete – missing: ' + missing.join(', '));
}
