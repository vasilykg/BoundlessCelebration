// Управление приветственным экраном
import { createInitialStars, createStar } from './stars.js';
import { createSnowflake } from './snowflakes.js';
import { randomizeButtons } from './buttons.js';
import { initProgress, updateLoadingText } from './progress.js';
import { startFireworks } from './fireworks.js';
import { t } from './i18n/index.js';

export function initWelcomeScreen() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const startButton = document.getElementById('startButton');
    const welcomeMusic = document.getElementById('welcomeMusic');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.getElementById('volumeIcon');
    const mainContent = document.querySelector('body');

    // Создаем звезды сразу при загрузке
    createInitialStars(welcomeOverlay);

    // Настройка управления звуком
    welcomeMusic.volume = volumeSlider.value / 100;

    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        welcomeMusic.volume = volume;
        // Обновляем иконку в зависимости от громкости
        volumeIcon.textContent = volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊';
    });

    volumeIcon.addEventListener('click', () => {
        if (welcomeMusic.volume > 0) {
            welcomeMusic.volume = 0;
            volumeSlider.value = 0;
            volumeIcon.textContent = '🔇';
        } else {
            welcomeMusic.volume = 0.5;
            volumeSlider.value = 50;
            volumeIcon.textContent = '🔊';
        }
    });

    // Скрываем все элементы кроме welcome overlay и звезд
    Array.from(mainContent.children).forEach(child => {
        if (child !== welcomeOverlay && !child.classList.contains('star') && !child.classList.contains('language-selector')) {
            child.style.display = 'none';
        }
    });

    startButton.addEventListener('click', function() {
        welcomeMusic.loop = true;

        // Воспроизводим музыку
        welcomeMusic.play().catch(error => {
            console.log('Автовоспроизведение заблокировано браузером');
        });

        randomizeButtons();
        setInterval(createSnowflake, 300);

        for (let i=0; i<200; i++) {
            createStar();
        }
        setInterval(createStar, 1500);

        // Инициализируем прогресс и обновление текста
        initProgress();
        updateLoadingText();

        // Скрываем приветственный оверлей
        welcomeOverlay.style.display = 'none';

        // Показываем основной контент
        Array.from(mainContent.children).forEach(child => {
            if (child !== welcomeOverlay) {
                child.style.removeProperty('display');
            }
        });

        createInitialStars(mainContent);
    });
}

// Обработчик кнопки празднования
export function initCelebrationButton() {
    const celebrateBtn = document.getElementById('celebrateBtn');
    const overlay = document.getElementById('overlay');
    
    celebrateBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('loading-text').style.display = 'none';
        document.getElementById('progress-container').style.display = 'none';
        document.getElementById('buttons-container').style.display = 'none';

        // Скрываем элементы из статус-бара
        document.querySelector('.status-text').style.display = 'none';
        document.querySelector('.volume-control').style.display = 'none';

        // Создаем бегущую строку из пожеланий
        const goodWishes = [
            "Счастливого нового года!",
            "Happy New Year!",
            "Bonne année!",
            "سنة جديدة سعيدة",
            "Срећна Нова година!",
            "¡Feliz año nuevo!",
            "Жаны жылыңар менен!",
            "Gott nytt år!",
            "CHÚC MỪNG NĂM MỚI!",
            "Selamat tahun baru!",
            "សួស្តីឆ្នាំថ្មី!",
            "Yeni iliniz mübarək!"
        ];
        const marqueeText = goodWishes.join(' ⭐ ');

        let goodWishesBlock = document.querySelector('.good-wishes');
        goodWishesBlock.style.display = 'block';
        goodWishesBlock.innerHTML = `<span class="marquee">${marqueeText}</span>`;

        startFireworks();
        document.getElementById('celebrationContainer').style.display = 'block';

        // Показываем кнопку перехода к credits
        const creditsButton = document.createElement('a');
        creditsButton.href = 'credits.html';
        creditsButton.className = 'credits-button';
        creditsButton.setAttribute('data-i18n', 'button.view_credits');
        creditsButton.textContent = t('button.view_credits');
        document.body.appendChild(creditsButton);
        creditsButton.style.display = 'block';
    });
}

// Функция для обработки таймера на кнопке
function startCelebrateBtnTimer() {
    const celebrateBtn = document.getElementById('celebrateBtn');
    let timeLeft = 3;
    celebrateBtn.disabled = true;
    celebrateBtn.classList.add('timer');
    celebrateBtn.setAttribute('data-time', `(${timeLeft})`);

    const timer = setInterval(() => {
        timeLeft--;
        celebrateBtn.setAttribute('data-time', `(${timeLeft})`);

        if (timeLeft <= 0) {
            clearInterval(timer);
            celebrateBtn.disabled = false;
            celebrateBtn.classList.remove('timer');
            celebrateBtn.removeAttribute('data-time');
        }
    }, 1000);
}

// Запускаем таймер при показе оверлея
const overlay = document.getElementById('overlay');
Object.defineProperty(overlay.style, 'display', {
    set: function(value) {
        this.cssText = `display: ${value}`;
        if (value === 'flex') {
            startCelebrateBtnTimer();
        }
    },
    get: function() {
        return this.cssText.replace('display: ', '');
    }
}); 