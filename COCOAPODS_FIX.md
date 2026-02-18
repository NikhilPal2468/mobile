# CocoaPods Installation Fix

## Problem
CocoaPods is trying to use JRuby (via RVM), which is incompatible. CocoaPods requires standard Ruby (MRI).

## ✅ Quick Fix - Use the Fixed Script

Instead of `npx expo run:ios`, use:

```bash
cd mobile
./run-ios-fixed.sh
```

This script will:
1. Unset RVM/JRuby environment
2. Use Homebrew Ruby (Ruby 4.0.1) or system Ruby
3. Install CocoaPods if needed
4. Run Expo iOS build

## Alternative Solutions

### Option 1: Manual Fix (One-time setup)

```bash
# Add Homebrew Ruby to PATH permanently
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Install CocoaPods
gem install cocoapods

# Then run Expo normally
npx expo run:ios
```

### Option 2: Use Expo Prebuild (No CocoaPods setup needed)

```bash
# Generate iOS folder
npx expo prebuild

# Then open in Xcode
open ios/*.xcworkspace
```

### Option 3: Temporarily Disable RVM

```bash
# In your terminal, before running expo
unset GEM_HOME GEM_PATH
export PATH="/usr/local/opt/ruby/bin:$PATH"

# Install CocoaPods if needed
gem install cocoapods

npx expo run:ios
```

## Why This Happens

RVM is configured to use JRuby by default, but CocoaPods requires standard Ruby (MRI). The fix script automatically switches to the correct Ruby version.
