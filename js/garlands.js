// Управление гирляндами
import { getRandomElement } from './utils.js';
import { randomBrightColor } from './utils.js';

let garlandAmplitude = 40;
let resizeTimeout;

// Функция для расчета оптимального количества символов
function calculateSymbolCount() {
    const screenWidth = window.innerWidth;
    // Примерно один символ каждые 40 пикселей
    return Math.floor(screenWidth / 40);
}

// Функция генерации символов
function generateSymbols(count) {
    const chars = ['❇', '✿', '❄', '⭐', '✨', '🎄', '🎁', '🔔', '✦'];
    const arr = [];
    for (let i=0; i<count; i++) {
        const el = document.createElement('span');
        el.textContent = getRandomElement(chars);
        el.style.color = randomBrightColor();
        el.style.fontSize = Math.random() < 0.5 ? '20px' : '30px';
        el.style.textShadow = `0 0 5px ${el.style.color}`;
        arr.push(el);
    }
    return arr;
}

// Располагаем символы дугой
function positionArcSymbols(container, symbols, arcDirection='down') {
    // arcDirection = 'down' для верхней дуги, 'up' для нижней
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.height = '80px';
    container.style.width = '100%';
    container.style.overflow = 'visible';
    container.style.pointerEvents = 'none';
    container.style.position = 'fixed';

    const count = symbols.length;
    const containerWidth = window.innerWidth;
    // Базовый уровень и амплитуда дуги
    let baseY = 0;

    // Количество дуг (нечётное число)
    const numArcs = 5;

    for (let i = 0; i < count; i++) {
        const symbol = symbols[i];
        const norm = i / (count - 1);

        // Определяем, к какой дуге относится символ
        const arcIndex = Math.floor(norm * numArcs);
        // Нормализованная позиция внутри текущей дуги
        const arcNorm = (norm * numArcs) % 1;

        // Синусоида с несколькими периодами
        const sineVal = Math.sin(Math.PI * arcNorm);

        let topPos;
        if (arcDirection === 'down') {
            topPos = baseY + garlandAmplitude * sineVal;
        } else {
            topPos = baseY - garlandAmplitude * sineVal;
        }

        const segmentWidth = containerWidth / numArcs;
        const leftPos = (arcIndex * segmentWidth) + (arcNorm * segmentWidth);

        symbol.style.position = 'absolute';
        symbol.style.top = topPos + 'px';
        symbol.style.left = leftPos + 'px';
        container.appendChild(symbol);
    }
}

// Функция обновления гирлянд
export function updateGarlands() {
    const topDec = document.getElementById('topDecoration');
    const bottomDec = document.getElementById('bottomDecoration');
    if (!topDec || !bottomDec) return;

    const symbolCount = calculateSymbolCount();
    const topSymbols = generateSymbols(symbolCount);
    const bottomSymbols = generateSymbols(symbolCount);

    // Очищаем существующие символы
    topDec.innerHTML = '';
    bottomDec.innerHTML = '';

    // Располагаем новые символы
    positionArcSymbols(topDec, topSymbols, 'down');
    positionArcSymbols(bottomDec, bottomSymbols, 'up');
}

// Увеличение амплитуды гирлянд
export function increaseGarlandsBend() {
    garlandAmplitude += 10;
    if (garlandAmplitude > 120) garlandAmplitude = 40;
    updateGarlands();
}

// Инициализация гирлянд
export function initGarlands() {
    updateGarlands();
    window.addEventListener('resize', () => {
        // Используем debounce для оптимизации производительности
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateGarlands, 250);
    });
} 