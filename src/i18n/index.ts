import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import ml from './locales/ml.json';

// Initialize i18n with error handling
try {
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: {
        en: { translation: en },
        ml: { translation: ml },
      },
      lng: Localization.locale?.split('-')[0] || 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
} catch (error) {
  console.error('Failed to initialize i18n:', error);
  // Fallback initialization
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      ml: { translation: ml },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
