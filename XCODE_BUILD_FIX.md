# Xcode Build Fix

## ✅ Issue Fixed

The "unable to open base configuration reference" error was caused by missing CocoaPods configuration files. This has been resolved by running `pod install`.

## How to Build in Xcode

### Important: Open Workspace, NOT Project

**❌ Wrong:**
```bash
open ios/SchoolAdmission.xcodeproj
```

**✅ Correct:**
```bash
open ios/SchoolAdmission.xcworkspace
```

The `.xcworkspace` file includes CocoaPods dependencies. Opening the `.xcodeproj` directly will cause build errors.

### Steps:

1. **Open the workspace in Xcode:**
   ```bash
   cd mobile
   open ios/SchoolAdmission.xcworkspace
   ```

2. **In Xcode:**
   - Wait for indexing to complete (may take a minute)
   - Select a simulator (e.g., iPhone 15 Pro) from the device dropdown
   - Press `Cmd + R` or click the Play button to build and run

3. **If build still fails:**
   - Clean build folder: `Product > Clean Build Folder` (Shift+Cmd+K)
   - Close and reopen Xcode
   - Try building again

## Alternative: Build from Command Line

```bash
cd mobile
npx expo run:ios
```

This will automatically:
- Use the correct Ruby environment
- Build the app
- Launch in simulator

## Notes

- The warning about Rosetta2 is just informational - the build will still work
- The UUID warning is harmless and can be ignored
- Make sure you always open `.xcworkspace`, never `.xcodeproj` when using CocoaPods
