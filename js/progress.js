// Управление прогресс-баром
import { MAX_TIME, usernames } from './config.js';
import { getRandomElement } from './utils.js';
import { createInitialStars } from './stars.js';
import { t } from './i18n/index.js';

let loadingStartTime; // Время начала загрузки
let mainProgressInterval; // Интервал обновления прогресс-бара

// Основной прогресс
export function updateMainProgress() {
    const bar = document.getElementById('mainProgressBar');
    const percText = document.getElementById('mainProgressPercent');
    if (!bar || !percText) return;

    let now = Date.now();
    let elapsedTime = now - loadingStartTime;

    // Рассчитываем прогресс на основе логарифмической кривой
    let timeRatio = elapsedTime / MAX_TIME;
    if (timeRatio > 1) timeRatio = 1;

    // Используем логарифмическую функцию для более плавного замедления
    // log(x + 1) даёт нам кривую, которая быстро растёт вначале и замедляется к концу
    // Делим на log(2), чтобы нормализовать значение от 0 до 1
    let progress = Math.log(timeRatio * 9 + 1) / Math.log(10) * 99;

    // Убеждаемся, что не превысим 99%
    if (progress > 99) progress = 99;

    bar.style.width = progress + '%';
    percText.textContent = Math.floor(progress) + '%';

    if (elapsedTime > MAX_TIME) {
        // Показываем оверлей
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            createInitialStars(overlay);
        }
        clearInterval(mainProgressInterval);
        return;
    }
}

export function updateLoadingText() {
    const loadingText = document.getElementById('loading-text');
    if (!loadingText) return;

    const now = Date.now();
    if (now - loadingStartTime > MAX_TIME) {
        return;
    }

    // Выбираем рандомное время обновления от 3 до 5 сек
    const nextDelay = 3000 + Math.random() * 2000;

    let phrases = t('loading.phrases');
    let phrase = getRandomElement(phrases);
    let currentUsername = getRandomElement(usernames);
    phrase = phrase.replace('%USERNAME%', currentUsername);
    loadingText.textContent = phrase;

    // Планируем следующее обновление статуса
    setTimeout(updateLoadingText, nextDelay);
}

export function initProgress() {
    loadingStartTime = Date.now();
    mainProgressInterval = setInterval(updateMainProgress, 200);
}

// Функция для ускорения загрузки
export function accelerateLoading(timeReduction) {
    loadingStartTime -= timeReduction;
}

// Реверс спиннера
let isSpinnerReversed = false;
export function reverseSpinner() {
    const spinner = document.getElementById('spinner');
    if (!spinner) return;

    isSpinnerReversed = !isSpinnerReversed;

    if (isSpinnerReversed) {
        spinner.style.animation = 'spinReverse 1s linear infinite';
    } else {
        spinner.style.animation = 'spin 1s linear infinite';
    }

    // change spinner size to random
    let size = Math.random() * 100 + 50;
    spinner.style.width = size + 'px';
    spinner.style.height = size + 'px';

    // change spinner border width to random
    spinner.style.borderWidth = Math.random() * 10 + 5 + 'px';

    // change spinner color to random
    spinner.style.borderColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    spinner.style.color = `#${Math.floor(Math.random()*16777215).toString(16)}`;

    // change spinner border style to random
    spinner.style.borderStyle = ['dashed', 'dotted', 'groove', 'ridge', 'inset', 'outset'][Math.floor(Math.random() * 8)];

    // toggle spinner shadow
    if (Math.random() < 0.5) {
        spinner.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    } else {
        spinner.style.boxShadow = 'none';
    }
} 