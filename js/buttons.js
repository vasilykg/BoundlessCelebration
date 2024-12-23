// Управление кнопками
import { shuffleArray, selfDestruct, toggleButtonState } from './utils.js';
import { addMoreStars } from './stars.js';
import { createSnowflake } from './snowflakes.js';
import { increaseGarlandsBend } from './garlands.js';
import { reverseSpinner, accelerateLoading } from './progress.js';
import { t } from './i18n/index.js';

// Счетчик нажатий на кнопку ускорения
let accelerateClickCount = 0;

// Функция для перемешивания и скрытия кнопок
export function randomizeButtons() {
    const buttonsContainer = document.getElementById('buttons-container');
    const buttons = Array.from(buttonsContainer.children);

    // Перемешиваем кнопки
    const shuffledButtons = shuffleArray(buttons);

    // Определяем количество кнопок для скрытия (треть от общего количества)
    const hideCount = Math.floor(buttons.length / 3);

    // Проверяем, будет ли скрыта accelerateBtn2
    const accelerateBtn2 = document.getElementById('accelerateBtn2');
    let wasAccelerateBtn2Hidden = false;

    // Скрываем случайные кнопки и переставляем все кнопки в случайном порядке
    shuffledButtons.forEach((button, index) => {
        // Скрываем первую треть кнопок после перемешивания
        if (index < hideCount) {
            button.style.display = 'none';
            if (button === accelerateBtn2) {
                wasAccelerateBtn2Hidden = true;
            }
        }
        // Перемещаем кнопку в конец контейнера (это изменит порядок)
        buttonsContainer.appendChild(button);
    });

    // Если accelerateBtn2 была скрыта, создаем временную кнопку
    if (wasAccelerateBtn2Hidden) {
        const tempButton = document.createElement('button');
        tempButton.className = 'custom-button blue-gradient disabled';
        tempButton.id = 'tempAccelerateBtn2';
        tempButton.innerHTML = `${t('temp.button')} <span class="countdown">60</span>`;
        tempButton.disabled = true;
        buttonsContainer.appendChild(tempButton);

        // Запускаем таймер обратного отсчета
        let timeLeft = 60;
        const countdownElement = tempButton.querySelector('.countdown');

        const countdownInterval = setInterval(() => {
            timeLeft--;
            countdownElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                // Плавно скрываем временную кнопку
                tempButton.style.animation = 'fadeOut 0.5s forwards';

                setTimeout(() => {
                    tempButton.remove();
                    // Показываем оригинальную кнопку
                    accelerateBtn2.style.display = '';
                    accelerateBtn2.style.animation = 'fadeIn 0.5s ease-out';
                }, 500);
            }
        }, 1000);
    }
}

// Функция массового создания снежинок
function spawnSnowflakes() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createSnowflake(), i * 50);
    }
}

// Инициализация обработчиков событий для кнопок
export function initButtons() {
    const accelerateBtn = document.getElementById('accelerateBtn');
    const accelerateBtn2 = document.getElementById('accelerateBtn2');
    const accelerateMsg = document.getElementById('accelerateMsg');
    const changeColorBtn = document.getElementById('changeColorBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const selfDestructBtn = document.getElementById('selfDestructBtn');
    const addStarsBtn = document.getElementById('addStarsBtn');
    const spawnSnowflakesBtn = document.getElementById('spawnSnowflakesBtn');
    const bendGarlandsBtn = document.getElementById('bendGarlandsBtn');
    const reverseSpinnerBtn = document.getElementById('reverseSpinnerBtn');

    // Обработчики для кнопок
    accelerateBtn.addEventListener('click', () => {
        accelerateMsg.style.display = 'block';
        setTimeout(() => {
            accelerateMsg.style.display = 'none';
        }, 2000);
    });

    accelerateBtn2.addEventListener('click', () => {
        accelerateClickCount++;
        // Уменьшаем эффект с каждым нажатием
        // Начинаем с 30 секунд и уменьшаем на 20% с каждым нажатием
        const baseAcceleration = 30 * 1000; // 30 секунд
        const minAcceleration = 5 * 1000;   // минимум 5 секунд
        const reduction = Math.pow(0.8, accelerateClickCount - 1); // Уменьшаем на 20% с каждым разом
        const actualAcceleration = Math.max(minAcceleration, baseAcceleration * reduction);
        
        // Применяем ускорение
        accelerateLoading(actualAcceleration);

        // Визуальный эффект уменьшения эффективности
        // Рассчитываем прозрачность на основе того, насколько близко мы к минимальному ускорению
        const button = accelerateBtn2;
        const opacityReduction = (actualAcceleration - minAcceleration) / (baseAcceleration - minAcceleration);
        button.style.opacity = Math.max(0.3, 0.3 + (opacityReduction * 0.7));
    });

    changeColorBtn.addEventListener('click', () => {
        const bar = document.getElementById('mainProgressBar');
        if (bar.classList.contains('progress-bar-green')) {
            bar.classList.replace('progress-bar-green', 'progress-bar-blue');
        } else if (bar.classList.contains('progress-bar-blue')) {
            bar.classList.replace('progress-bar-blue', 'progress-bar-yellow');
        } else if (bar.classList.contains('progress-bar-yellow')) {
            bar.classList.replace('progress-bar-yellow', 'progress-bar-red');
        } else if (bar.classList.contains('progress-bar-red')) {
            bar.classList.replace('progress-bar-red', 'progress-bar-green');
        }
    });

    jumpBtn.addEventListener('click', (e) => {
        const button = e.target;
        toggleButtonState(button, 2000);

        const elements = document.querySelectorAll('.progress-container, .loading-text, .spinner');
        elements.forEach(element => {
            element.style.animation = 'bounce 0.5s ease infinite';
            setTimeout(() => {
                element.style.animation = '';
            }, 2000);
        });
    });

    selfDestructBtn.addEventListener('click', function() {
        selfDestruct(this);
    });

    addStarsBtn.addEventListener('click', addMoreStars);
    spawnSnowflakesBtn.addEventListener('click', spawnSnowflakes);
    bendGarlandsBtn.addEventListener('click', increaseGarlandsBend);
    reverseSpinnerBtn.addEventListener('click', reverseSpinner);
} 