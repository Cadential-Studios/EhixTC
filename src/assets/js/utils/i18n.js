export const translations = {
    en: {
        BEGIN: 'Begin',
    },
    es: {
        BEGIN: 'Comenzar',
    }
};

export let currentLang = 'en';
export function t(key) {
    return translations[currentLang][key] || key;
}
