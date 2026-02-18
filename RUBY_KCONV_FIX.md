# Ruby 4.0 kconv Issue Fix

## Problem
Ruby 4.0 removed the `kconv` standard library that CocoaPods requires, causing:
```
cannot load such file -- kconv (LoadError)
```

## Solution Options

### Option 1: Use Ruby 3.1 (Recommended)

Ruby 3.1 still includes `kconv`. Install it via Homebrew:

```bash
# Install Ruby 3.1
brew install ruby@3.1

# Add to PATH
echo 'export PATH="/usr/local/opt/ruby@3.1/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Install CocoaPods
gem install cocoapods

# Then run Expo
npx expo run:ios
```

### Option 2: Use Expo Prebuild (No CocoaPods needed)

```bash
# Generate iOS folder
npx expo prebuild

# Then open in Xcode
open ios/*.xcworkspace
```

### Option 3: Use EAS Build (Cloud-based)

```bash
# Install EAS CLI
npm install -g eas-cli

# Build in the cloud (no local CocoaPods needed)
eas build --platform ios
```

## Why This Happens

Ruby 4.0 removed several deprecated standard libraries including `kconv`. CocoaPods hasn't been updated to work without it yet. Using Ruby 3.1 is the most reliable solution until CocoaPods is updated.
