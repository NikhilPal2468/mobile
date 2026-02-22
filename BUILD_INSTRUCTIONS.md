# Building the iOS App

## ✅ Prebuild Complete

The iOS native project has been generated using `npx expo prebuild`. You can now build and run the app.

## Option 1: Build with Xcode (Recommended)

1. **Open the workspace in Xcode:**
   ```bash
   cd mobile
   open ios/*.xcworkspace
   ```
   (Note: Open `.xcworkspace`, not `.xcodeproj`)

2. **In Xcode:**
   - Select your target device (simulator or physical device)
   - Click the Play button or press `Cmd + R` to build and run

## Option 2: Build from Command Line

```bash
cd mobile

# Build and run on iOS simulator
npx expo run:ios

# Or build for a specific simulator
npx expo run:ios --simulator="iPhone 15 Pro"
```

## Option 3: Use Expo Development Build

```bash
# Start Expo dev server
npx expo start --dev-client

# Then scan QR code with Expo Go (for JS changes)
# Or build development client for native changes
```

## Native Modules Included

The following native modules are now available:
- ✅ `react-native-razorpay` - Payment gateway
- ✅ `react-native-signature-canvas` - Signature capture
- ✅ `react-native-webview` - WebView support
- ✅ `@react-native-picker/picker` - Native picker
- ✅ All Expo modules

## Device testing (API URL)

When running the app on a **physical device** or **simulator**, API calls (including PDF fetch) use `EXPO_PUBLIC_API_URL`. The default `http://localhost:3001` only works when the app runs on the same machine as the backend. For device testing:

1. Copy `.env.example` to `.env` in the `mobile` folder.
2. Set `EXPO_PUBLIC_API_URL` to your machine's IP or a tunnel URL, e.g. `http://192.168.1.5:3001`.
3. Ensure the backend is running and reachable at that URL (same network or tunnel).

## Troubleshooting

### If build fails:
1. Clean build folder: In Xcode, `Product > Clean Build Folder` (Shift+Cmd+K)
2. Reinstall pods: `cd ios && pod install && cd ..`
3. Clear Metro cache: `npx expo start --clear`

### If native modules don't work:
- Make sure you're using a development build, not Expo Go
- Run `npx expo prebuild --clean` to regenerate native folders

---

# Building Android AAB for Play Console

The app uses **application ID** `com.rzwan.helpdesk` (aligned with `app.json`). Use one of the options below to produce a signed AAB for upload to Google Play.

## Option A: EAS Build (recommended)

1. **Prerequisites:** Expo account, EAS CLI (`npm install -g eas-cli`), and `eas login`.
2. **Build AAB:**
   ```bash
   cd mobile
   eas build --platform android --profile production
   ```
3. On first run, choose to let EAS **generate and store** a new Android keystore, or upload your own. Back up the keystore from [Expo dashboard](https://expo.dev) → project → Credentials → Android if EAS generates it.
4. **Download the AAB** from the build page when the build finishes.
5. **Production API URL:** Set `EXPO_PUBLIC_API_URL` in EAS secrets (or in `.env` before building) so the production build uses your live backend.

Optional: submit from the CLI with `eas submit --platform android --profile production` (edit `eas.json` → `submit.production.android.track` to `internal`, `alpha`, `beta`, or `production` as needed).

## Option B: Local AAB build

1. **Create a release keystore** (one-time):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore mobile/android/app/release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
   ```
   Store the keystore and passwords securely; keep the same keystore for all future Play updates.

2. **Configure signing:** In `android/gradle.properties` (or a local file not committed), set:
   ```properties
   MYAPP_RELEASE_STORE_FILE=release.keystore
   MYAPP_RELEASE_STORE_PASSWORD=your_store_password
   MYAPP_RELEASE_KEY_ALIAS=release
   MYAPP_RELEASE_KEY_PASSWORD=your_key_password
   ```
   Do not commit real passwords. The keystore file lives in `android/app/` and is gitignored (`.keystore`).

3. **Build the AAB:** Use JDK 17 (see `android/gradle.properties`). From project root:
   ```bash
   cd mobile/android
   JAVA_HOME=$(/usr/libexec/java_home -v 17) ./gradlew bundleRelease
   ```
   Output: `mobile/android/app/build/outputs/bundle/release/app-release.aab`.

4. **Upload** this file in Play Console (see below).

## Building release APK (sideloading / testers)

To build a signed **APK** (for sideloading, direct install, or sharing with testers outside Play):

```bash
cd mobile
npm run build:apk
```

Output: `mobile/android/app/build/outputs/apk/release/app-release.apk`. Install on a device via USB (`adb install app-release.apk`) or share the file. Uses the same keystore and signing as the local AAB build.

## Upload in Play Console

1. In [Google Play Console](https://play.google.com/console), create an app (if needed) with application ID **com.rzwan.helpdesk**.
2. **Release** → choose track (e.g. Internal testing, Production) → **Create new release** → upload the `.aab`.
3. Complete required setup (store listing, content rating, privacy policy, target audience, etc.) and submit for review.
4. For later releases: bump `versionCode` (and optionally `versionName`) in `android/app/build.gradle`, then build a new AAB and upload as a new release.

---

## Next Steps

1. **Test the app** - Run it on a simulator or device
2. **Configure Razorpay** - Add your Razorpay keys in the app
3. **Test payment flow** - Complete form to Step 13 and test payment
4. **Test signature** - Verify signature canvas works
