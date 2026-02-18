# Development Build Required

This app uses native modules that require a **development build** instead of Expo Go:

## Native Modules Used

1. **react-native-razorpay** - Payment gateway integration
2. **react-native-signature-canvas** - Signature capture (uses WebView)

## Options

### Option 1: Local Development Build (Recommended for Development)

```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

This will:
- Build the native app locally
- Install it on your device/simulator
- Enable all native modules

### Option 2: EAS Build (Recommended for Testing/Production)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login:
```bash
eas login
```

3. Configure:
```bash
eas build:configure
```

4. Build for iOS:
```bash
eas build --platform ios --profile development
```

5. Build for Android:
```bash
eas build --platform android --profile development
```

### Option 3: Use Expo Go (Limited Functionality)

The app will run in Expo Go but:
- ❌ Payment (Razorpay) will show an error message
- ❌ Signature canvas will show a placeholder

All other features will work normally.

## Current Status

The app has been updated to gracefully handle missing native modules:
- Payment button shows a helpful error message
- Signature canvas shows a placeholder with instructions

To test payment and signature features, you **must** use a development build.
