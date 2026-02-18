# Troubleshooting Guide

## "EMFILE: too many open files" Error

This is a common macOS issue. Fix it by:

### Temporary Fix (Current Session)
```bash
ulimit -n 10240
npx expo start
```

### Permanent Fix
Add to your `~/.zshrc` or `~/.bash_profile`:
```bash
ulimit -n 10240
```

Then reload:
```bash
source ~/.zshrc
```

### Alternative: Use the Fix Script
```bash
source ./fix-file-limit.sh && npx expo start
```

## Package Version Warnings

If you see version compatibility warnings, update packages:
```bash
npm install react-native@0.73.6 expo-localization@~14.8.4
```

## Other Common Issues

### Metro Bundler Cache Issues
```bash
npx expo start -c
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### iOS Simulator Not Opening
- Make sure Xcode is installed
- Run: `xcode-select --install` if needed
- Try: `npx expo start --ios`

### Android Emulator Not Opening
- Make sure Android Studio is installed
- Start an emulator from Android Studio first
- Then run: `npx expo start --android`
