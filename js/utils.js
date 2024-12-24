// Вспомогательные функции

const ENCRYPTION_KEY = 'BC2025'; // Ключ шифрования

export function encryptValue(value) {
    // Преобразуем число в строку и добавляем случайную соль
    const salt = Math.random().toString(36).substring(2, 8);
    const valueWithSalt = `${value}:${salt}`;

    // Создаем контрольную сумму
    let checksum = 0;
    for (let i = 0; i < valueWithSalt.length; i++) {
        checksum = (checksum + valueWithSalt.charCodeAt(i)) % 256;
    }

    // Шифруем значение с солью и контрольной суммой
    const fullValue = `${valueWithSalt}:${checksum}`;
    let encrypted = '';
    for (let i = 0; i < fullValue.length; i++) {
        const charCode = fullValue.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        encrypted += String.fromCharCode(charCode);
    }

    return btoa(encrypted); // Кодируем в base64
}

export function decryptValue(encrypted) {
    try {
        // Декодируем из base64 и расшифровываем
        const decoded = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
            const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
            decrypted += String.fromCharCode(charCode);
        }

        // Разбиваем на компоненты
        const [value, salt, storedChecksum] = decrypted.split(':');

        // Проверяем контрольную сумму
        let checksum = 0;
        const valueWithSalt = `${value}:${salt}`;
        for (let i = 0; i < valueWithSalt.length; i++) {
            checksum = (checksum + valueWithSalt.charCodeAt(i)) % 256;
        }

        if (checksum === parseInt(storedChecksum)) {
            return parseInt(value);
        }
        return 0; // Возвращаем 0, если проверка не прошла
    } catch (e) {
        return 0; // Возвращаем 0 при любой ошибке расшифровки
    }
}

// Получение случайного элемента из массива
export function getRandomElement(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
}

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Случайный яркий цвет
export function randomBrightColor() {
    let r, g, b;
    do {
        r = Math.floor(Math.random()*256);
        g = Math.floor(Math.random()*256);
        b = Math.floor(Math.random()*256);
    } while ((r+g+b)<300); // пока сумма не будет достаточно большой (яркий цвет)
    return `rgb(${r},${g},${b})`;
}

// Функция для блокировки/разблокировки кнопки
export function toggleButtonState(button, duration) {
    button.disabled = true;
    setTimeout(() => {
        button.disabled = false;
    }, duration);
}

// Функция самоуничтожения кнопки
export function selfDestruct(button) {
    const rect = button.getBoundingClientRect();
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = (rect.left + rect.width/2) + 'px';
    explosion.style.top = (rect.top + rect.height/2) + 'px';
    document.body.appendChild(explosion);

    button.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => {
        button.remove();
        explosion.remove();
    }, 500);
}

// Функция для воспроизведения звука
export function play() {
    try {
        new Audio("https://raw.githubusercontent.com/vasilykg/BoundlessCelebration/refs/heads/main/resources/wooden-door-knock-102902.mp3").play();
    }
    catch (e) {}
}

// Функция для планирования сюрприза
export function scheduleSurprise(multiplier) {
    if (multiplier === undefined)
        multiplier = 1;
    const delay = Math.floor(Math.random() * 60_000) + 60_000 * multiplier;
    setTimeout(() => { play(); scheduleSurprise(multiplier + 2); }, delay);
} 