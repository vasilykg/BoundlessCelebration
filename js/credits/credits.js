// Создание звёзд на фоне
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 200;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Случайное положение
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Случайный размер
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Случайная длительность мерцания
        star.style.setProperty('--duration', `${Math.random() * 3 + 1}s`);

        starsContainer.appendChild(star);
    }
}

// Управление аудио
const audio = document.getElementById('bgMusic');
const audioButton = document.getElementById('audioButton');
const volumeControl = document.getElementById('volumeControl');

let currentVolume = 0.1;

function toggleAudio() {
    if (audio.paused) {
        audio.play();
        audioButton.textContent = 'Выключить музыку';
        currentVolume = audio.volume;
    } else {
        audio.pause();
        audioButton.textContent = 'Включить музыку';
        audio.volume = currentVolume;
    }
}

// Добавляем обработчик события для кнопки аудио
audioButton.addEventListener('click', toggleAudio);

// Управление громкостью
volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Инициализация звёзд при загрузке
createStars();

// Запуск анимации по нажатию кнопки
document.getElementById('startButton').addEventListener('click', function() {
    // Скрываем кнопку
    this.classList.add('hidden');

    // Показываем звёзды
    document.querySelector('.stars').style.opacity = '1';

    // Запускаем музыку
    audio.volume = 0.1;
    audio.play().catch(() => {
        console.log('Автовоспроизведение заблокировано браузером');
        audioButton.textContent = 'Включить музыку';
    });

    // Показываем аудио контролы
    document.getElementById('audio-controls').classList.add('visible');

    // Запускаем анимацию логотипа
    const logo = document.querySelector('.logo-container');
    logo.classList.add('animate');

    // Ждем окончания анимации логотипа и запускаем текст
    logo.addEventListener('animationend', () => {
        // Запускаем анимацию текста
        const crawlContainer = document.querySelector('.crawl-container');
        const crawlText = document.querySelector('.crawl-text');

        crawlContainer.classList.add('animate');
        crawlText.classList.add('animate');

        // Функция для проверки видимости элементов
        function checkElementVisibility() {
            const elements = crawlText.querySelectorAll('p, h1');
            const containerRect = crawlContainer.getBoundingClientRect();

            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                // Если элемент ушел далеко вверх (за пределы контейнера)
                if (rect.bottom < containerRect.top - 500) {
                    element.style.opacity = '0';
                } else {
                    element.style.opacity = '1';
                }
            });

            // Если все элементы исчезли, сбрасываем анимацию
            if ([...elements].every(el => el.style.opacity === '0')) {
                crawlText.classList.remove('animate');
                elements.forEach(el => el.style.opacity = '1');
                // Форсируем перерисовку
                void crawlText.offsetWidth;
                crawlText.classList.add('animate');
            }
        }

        // Запускаем проверку каждые 100ms
        setInterval(checkElementVisibility, 100);
    });
});
