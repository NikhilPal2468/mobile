# Expo Go Compatibility Issues

## Problem
The app is failing to load in Expo Go with:
- `"main" has not been registered` error
- SecurityException about DETECT_SCREEN_CAPTURE (Android permission warning)

## Root Cause
Some native modules or imports are failing during initialization, preventing the app from registering properly.

## Solutions

### Option 1: Use Development Build (Recommended)

Since you've already run `npx expo prebuild`, you should use a development build instead of Expo Go:

```bash
# Build and run on iOS
npx expo run:ios

# Build and run on Android  
npx expo run:android
```

### Option 2: Fix for Expo Go (Limited Functionality)

If you want to test in Expo Go, you need to:

1. **Remove or conditionally load native modules:**
   - `react-native-razorpay` - Not available in Expo Go
   - `react-native-signature-canvas` - Not available in Expo Go
   - These are already conditionally imported

2. **Check for other failing imports:**
   - Make sure all imports are available in Expo Go
   - Check console for specific module errors

3. **Restart Metro with cache clear:**
   ```bash
   npx expo start --clear
   ```

### Option 3: Check Console for Specific Errors

The actual error might be in the console. Look for:
- Module not found errors
- Import errors
- Initialization failures

## Current Status

The app has been updated with:
- ✅ Error handling in App.tsx
- ✅ Error handling in i18n initialization
- ✅ Async auth loading with error handling
- ✅ Conditional native module imports

Try restarting the app with `npx expo start --clear` and check the console for the specific error.
