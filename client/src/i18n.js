import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';

i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
        de: { translation: de },
        es: { translation: es },
      },
      lng: 'fr', // Langue par défaut
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
      debug: true, // Activez le mode debug pour obtenir des messages d'erreur détaillés
    });
