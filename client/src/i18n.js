import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json'; // Ton fichier de traduction anglais
import fr from './locales/fr.json'; // Ton fichier de traduction français
import de from './locales/de.json'; // Ton fichier de traduction allemand
import es from './locales/es.json'; // Ton fichier de traduction espagnol

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
    });

export default i18n;
