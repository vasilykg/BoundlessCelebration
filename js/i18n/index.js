import { translations as ruTranslations } from './ru.js';
import { translations as enTranslations } from './en.js';
import { translations as arTranslations } from './ar.js';
import { translations as tlhTranslations } from './tlh.js';
import { translations as dovahTranslations } from './dovah.js';
import { translations as mordorTranslations } from './mordor.js';

const translations = {
    'ru': ruTranslations,
    'en': enTranslations,
    'ar': arTranslations,
    'tlh': tlhTranslations,
    'dovah': dovahTranslations,
    'mordor': mordorTranslations
};

// Сопоставление локалей браузера с нашими языками
const localeMapping = {
    'ru': ['ru', 'ru-RU', 'ru-BY', 'ru-KZ', 'ru-UA'],
    'en': ['en', 'en-US', 'en-GB', 'en-AU', 'en-CA'],
    'ar': ['ar', 'ar-SA', 'ar-AE', 'ar-QA', 'ar-BH', 'ar-EG']
};

/**
 * Определить язык на основе локали браузера
 * @returns {string} Код языка
 */
function detectLanguage() {
    // Если язык уже был выбран пользователем
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        return savedLanguage;
    }

    // Получаем предпочитаемые языки браузера
    const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];

    // Проходим по всем предпочитаемым языкам
    for (const browserLang of browserLanguages) {
        const langCode = browserLang.toLowerCase();
        
        // Проверяем каждый поддерживаемый язык
        for (const [supportedLang, locales] of Object.entries(localeMapping)) {
            if (locales.some(locale => langCode.startsWith(locale.toLowerCase()))) {
                return supportedLang;
            }
        }
    }

    // Если не нашли подходящий язык, возвращаем английский
    return 'en';
}

// Текущий язык
let currentLanguage = detectLanguage();

// Текущие переводы
let currentTranslations = translations[currentLanguage];

/**
 * Получить текст по ключу
 * @param {string} key - Ключ перевода
 * @param {Object} [params] - Параметры для подстановки в текст
 * @returns {string} Переведенный текст
 */
export function t(key, params = {}) {
    const text = currentTranslations[key];
    if (!text) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
    }

    if (Array.isArray(text)) {
        return text;
    }

    // Заменяем все параметры в тексте
    return text.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
    });
}

/**
 * Изменить язык
 * @param {string} lang - Код языка ('ru', 'en', 'ar', 'tlh', 'dovah', 'mordor')
 */
export function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language ${lang} not supported`);
        return;
    }

    currentLanguage = lang;
    currentTranslations = translations[lang];
    localStorage.setItem('language', lang);

    // Устанавливаем направление текста для арабского языка
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Устанавливаем специальные стили для мемных языков
    document.body.classList.remove('lang-dovah', 'lang-mordor');
    if (lang === 'dovah') {
        document.body.classList.add('lang-dovah');
    } else if (lang === 'mordor') {
        document.body.classList.add('lang-mordor');
    }
    
    updatePageText();
}

/**
 * Получить текущий язык
 * @returns {string} Код текущего языка
 */
export function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Обновить текст всех элементов на странице
 */
export function updatePageText() {
    // Обновляем все элементы с атрибутом data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    // Обновляем все placeholder'ы с атрибутом data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
} 