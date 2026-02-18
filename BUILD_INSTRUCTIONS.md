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

## Next Steps

1. **Test the app** - Run it on a simulator or device
2. **Configure Razorpay** - Add your Razorpay keys in the app
3. **Test payment flow** - Complete form to Step 13 and test payment
4. **Test signature** - Verify signature canvas works
