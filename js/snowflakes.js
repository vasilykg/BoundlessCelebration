// Управление снежинками
import { INACTIVITY_DELAY } from './config.js';
import { encryptValue, decryptValue } from './utils.js';

// Инициализация начального значения
const storedValue = localStorage.getItem('snowflakeCountX');
let snowflakeCount = storedValue ? decryptValue(storedValue) : 0;

let lastSnowflakeTime = Date.now();
let inactivityTimeout;

export function initSnowflakes() {
    updateSnowflakeCountUI();

    // Запускаем первичную проверку неактивности
    inactivityTimeout = setTimeout(checkSnowflakeInactivity, INACTIVITY_DELAY);
}

export function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄';

    const size = Math.random() * 40 + 10;
    snowflake.style.fontSize = size + 'px';
    const left = Math.random() * 100;
    snowflake.style.left = left + 'vw';
    const duration = Math.random() * 20 + 5;
    snowflake.style.animationDuration = duration + 's';

    snowflake.addEventListener('click', () => {
        const rect = snowflake.getBoundingClientRect();
        snowflake.remove();
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        explosion.style.left = rect.left + rect.width/2 + 'px';
        explosion.style.top = rect.top + rect.height/2 + 'px';
        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 500);
        updateSnowflakeCount();
    });

    document.body.appendChild(snowflake);
    setTimeout(() => {
        if (snowflake.parentNode) snowflake.remove();
    }, duration * 1000);
}

function checkSnowflakeInactivity() {
    const snowflakeCounter = document.querySelector('.snowflake-counter');
    const now = Date.now();
    if (now - lastSnowflakeTime > INACTIVITY_DELAY) {
        snowflakeCounter.classList.add('inactive');
    }
}

function updateSnowflakeCount() {
    const snowflakeCounter = document.querySelector('.snowflake-counter');
    const snowflakeCountElement = document.getElementById('snowflakeCount');

    snowflakeCount++;
    updateSnowflakeCountUI();

    // Сохраняем зашифрованное значение в localStorage
    localStorage.setItem('snowflakeCountX', encryptValue(snowflakeCount));

    // Обновляем время последней активности
    lastSnowflakeTime = Date.now();

    // Убираем класс неактивности
    snowflakeCounter.classList.remove('inactive');

    // Сбрасываем и устанавливаем новый таймер неактивности
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(checkSnowflakeInactivity, INACTIVITY_DELAY);

    // Анимация счетчика
    snowflakeCountElement.classList.remove('count-pop');
    void snowflakeCountElement.offsetWidth; // Сброс анимации
    snowflakeCountElement.classList.add('count-pop');
}

function updateSnowflakeCountUI() {
    const snowflakeCountElement = document.getElementById('snowflakeCount');
    const userScoreSpan = document.getElementById('userScore');
    
    snowflakeCountElement.textContent = snowflakeCount;
    userScoreSpan.textContent = snowflakeCount;
}

export function getSnowflakeCount() {
    return snowflakeCount;
}

export function setSnowflakeCount(count) {
    snowflakeCount = count;
    updateSnowflakeCountUI();
} 