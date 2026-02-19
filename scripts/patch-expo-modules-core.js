#!/usr/bin/env node
/**
 * EAS Build fix: apply composite-build defaults to expo-modules-core/android/build.gradle
 * so "compileSdkVersion is not specified" and "release" SoftwareComponent errors are resolved.
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

// 1) buildscript: add google() and AGP classpath
if (!content.includes('google()')) {
  content = content.replace(
    '  repositories {\n    mavenCentral()\n  }',
    '  repositories {\n    google()\n    mavenCentral()\n  }'
  );
  content = content.replace(
    '  dependencies {\n    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${getKotlinVersion()}")',
    '  dependencies {\n    classpath("com.android.tools.build:gradle:8.1.1")\n    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${getKotlinVersion()}")'
  );
}

// 2) After buildscript, add rootProject.ext defaults for composite build
if (!content.includes('rootProject.ext.compileSdkVersion = 34')) {
  content = content.replace(
    '}\n\ndef isExpoModulesCoreTests = {',
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

// 3) android block: add compileSdkVersion and publishing at top; remove duplicate from inside if
if (!content.includes('  compileSdkVersion safeExtGet("compileSdkVersion", 34)\n  publishing {')) {
  content = content.replace(
    'android {\n  // Remove this if and it\'s contents, when support for SDK49 is dropped\n  if (!safeExtGet("expoProvidesDefaultConfig", false)) {\n    compileSdkVersion safeExtGet("compileSdkVersion", 34)\n\n    defaultConfig {\n      minSdkVersion safeExtGet("minSdkVersion", 23)\n      targetSdkVersion safeExtGet("targetSdkVersion", 34)\n    }\n\n    publishing {\n      singleVariant("release") {\n        withSourcesJar()\n      }\n    }\n\n    lintOptions {\n      abortOnError false\n    }\n  }',
    'android {\n  compileSdkVersion safeExtGet("compileSdkVersion", 34)\n  publishing {\n    singleVariant("release") {\n      withSourcesJar()\n    }\n  }\n  // Remove this if and it\'s contents, when support for SDK49 is dropped\n  if (!safeExtGet("expoProvidesDefaultConfig", false)) {\n    lintOptions {\n      abortOnError false\n    }\n  }'
  );
}

// 4) defaultConfig: add minSdkVersion and targetSdkVersion after "defaultConfig {"
if (content.includes('namespace "expo.modules"') && !content.includes('    minSdkVersion safeExtGet("minSdkVersion", 23)')) {
  content = content.replace(
    '  namespace "expo.modules"\n  defaultConfig {\n    consumerProguardFiles',
    '  namespace "expo.modules"\n  defaultConfig {\n    minSdkVersion safeExtGet("minSdkVersion", 23)\n    targetSdkVersion safeExtGet("targetSdkVersion", 34)\n    consumerProguardFiles'
  );
}

fs.writeFileSync(buildGradlePath, content);
console.log('patch-expo-modules-core: applied EAS composite-build fixes');
