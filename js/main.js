// Основной файл, инициализирующий все модули
import { initSnowflakes } from './snowflakes.js';
import { initFireworksCanvas } from './fireworks.js';
import { initGarlands } from './garlands.js';
import { initButtons } from './buttons.js';
import { initLeaderboard } from './leaderboard.js';
import { initWelcomeScreen, initCelebrationButton } from './welcome.js';
import { scheduleSurprise } from './utils.js';
import { updatePageText, setLanguage, getCurrentLanguage } from './i18n/index.js';

// Инициализация языкового селектора
function initLanguageSelector() {
    const select = document.getElementById('languageSelect');
    if (!select) return;

    const currentLang = getCurrentLanguage();
    
    // Устанавливаем текущий язык в селекторе
    select.value = currentLang;

    // Применяем стили для мемных языков при загрузке
    document.body.classList.remove('lang-dovah', 'lang-mordor');
    if (currentLang === 'dovah') {
        document.body.classList.add('lang-dovah');
    } else if (currentLang === 'mordor') {
        document.body.classList.add('lang-mordor');
    }

    // Устанавливаем направление текста для арабского языка
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // Добавляем обработчик изменения языка
    select.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
}

// Инициализация всех модулей при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем языковой селектор
    initLanguageSelector();

    // Обновляем все тексты на странице
    updatePageText();

    // Инициализируем остальные модули
    initSnowflakes();
    initFireworksCanvas();
    initGarlands();
    initButtons();
    initLeaderboard();
    initWelcomeScreen();
    initCelebrationButton();
    scheduleSurprise();
});