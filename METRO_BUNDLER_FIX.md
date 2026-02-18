# Metro Bundler Fix

## Error: "No bundle URL present"

This error occurs when the app can't connect to Metro bundler (the JavaScript packager).

## Solution

### Option 1: Start Metro Bundler (Recommended)

**In a separate terminal window**, run:

```bash
cd /Users/nikhilpal/Documents/SchoolProject/mobile
npx expo start
```

Then:
1. Keep that terminal running (Metro bundler)
2. In Xcode, press `Cmd + R` again to reload the app
3. The app should now connect to Metro and load

### Option 2: Use Expo CLI to Build and Run

Instead of building in Xcode, use:

```bash
cd /Users/nikhilpal/Documents/SchoolProject/mobile
npx expo run:ios
```

This automatically:
- Starts Metro bundler
- Builds the app
- Launches it in simulator

### Option 3: Configure for Production Build

If you want to build without Metro (production mode), you need to create a JavaScript bundle:

```bash
cd mobile
npx expo export --platform ios
```

Then configure Xcode to use the bundle instead of Metro.

## Quick Fix

1. **Open a new terminal**
2. **Run:** `cd /Users/nikhilpal/Documents/SchoolProject/mobile && npx expo start`
3. **Wait for Metro to start** (you'll see "Metro waiting on...")
4. **In Xcode, press Cmd + R** to reload the app

The app should now load successfully!
