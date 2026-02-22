#!/usr/bin/env bash
# Build Android AAB locally. Requires JDK 17.
# Creates release.keystore and android/keystore.properties if missing.

set -e
MOBILE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_ROOT="$MOBILE_ROOT/android"
APP_ROOT="$ANDROID_ROOT/app"
KEYSTORE="$APP_ROOT/release.keystore"
KEYSTORE_PROPS="$ANDROID_ROOT/keystore.properties"
KEYSTORE_PASS="releasepass"

# Force project-local Gradle cache so builds work in restricted environments (e.g. Cursor sandbox)
export GRADLE_USER_HOME="$ANDROID_ROOT/.gradle-user-home"

# Prefer JDK 17 (system java_home or Homebrew)
if [ -z "$JAVA_HOME" ] && command -v /usr/libexec/java_home &>/dev/null; then
  for v in 17 21 11; do
    if JAVA_HOME=$(/usr/libexec/java_home -v "$v" 2>/dev/null); then
      export JAVA_HOME
      break
    fi
  done
fi
if [ -z "$JAVA_HOME" ]; then
  for dir in /usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home; do
    if [ -d "$dir" ]; then
      export JAVA_HOME="$dir"
      break
    fi
  done
fi

if [ -z "$JAVA_HOME" ] || ! "$JAVA_HOME/bin/keytool" -help &>/dev/null; then
  echo "JDK not found. Install JDK 17: brew install openjdk@17"
  echo "Then run: export JAVA_HOME=\$(/usr/libexec/java_home -v 17)"
  exit 1
fi

# Create keystore if missing
if [ ! -f "$KEYSTORE" ]; then
  echo "Creating release keystore at $KEYSTORE ..."
  "$JAVA_HOME/bin/keytool" -genkeypair -v -storetype PKCS12 \
    -keystore "$KEYSTORE" -alias release -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$KEYSTORE_PASS" -keypass "$KEYSTORE_PASS" \
    -dname "CN=Helpdesk, OU=Dev, O=App, L=City, ST=State, C=US"
fi

# Create keystore.properties if missing
if [ ! -f "$KEYSTORE_PROPS" ]; then
  echo "Creating $KEYSTORE_PROPS ..."
  cat > "$KEYSTORE_PROPS" << EOF
MYAPP_RELEASE_STORE_FILE=release.keystore
MYAPP_RELEASE_STORE_PASSWORD=$KEYSTORE_PASS
MYAPP_RELEASE_KEY_ALIAS=release
MYAPP_RELEASE_KEY_PASSWORD=$KEYSTORE_PASS
EOF
fi

echo "Building release AAB ..."
mkdir -p "$GRADLE_USER_HOME"
cd "$ANDROID_ROOT"
GRADLE_USER_HOME="$GRADLE_USER_HOME" ./gradlew --no-daemon bundleRelease

AAB="$APP_ROOT/build/outputs/bundle/release/app-release.aab"
echo "Done. AAB: $AAB"
