# Mobile App Assets

The mobile app references the following asset files that need to be created:

## Required Assets

1. **assets/icon.png** - App icon (1024x1024px recommended)
2. **assets/splash.png** - Splash screen (1242x2436px for iOS, 1080x1920px for Android)
3. **assets/adaptive-icon.png** - Android adaptive icon (1024x1024px)
4. **assets/favicon.png** - Web favicon (48x48px)

## Creating Assets

You can use tools like:
- Figma
- Adobe XD
- Canva
- Online icon generators

Or use Expo's asset generation:
```bash
npx expo-asset-generator
```

## Temporary Solution

For development, you can use placeholder images or Expo's default assets. The app will work without these, but you'll see warnings.
