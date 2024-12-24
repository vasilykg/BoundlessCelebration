// Управление таблицей лидеров
import { getSnowflakeCount, setSnowflakeCount } from './snowflakes.js';
import { t } from './i18n/index.js';

let currentUsername = localStorage.getItem('snowflakeUsernameX');
let updateCountdown = 10;
let previousSnowflakeCount = 0;

// Обновление UI на основе наличия имени пользователя
function updateUIForUser() {
    const joinButton = document.getElementById('joinButton');
    const currentScore = document.getElementById('currentScore');
    
    if (!joinButton || !currentScore) return;
    
    if (currentUsername) {
        joinButton.style.display = 'none';
        currentScore.style.display = 'block';
    } else {
        joinButton.style.display = 'block';
        currentScore.style.display = 'none';
    }
}

// Показать диалог присоединения
function showJoinDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>${t('join.title')}</h3>
            <p>${t('join.description')}</p>
            <input type="text" id="usernameInput" placeholder="${t('join.placeholder')}" maxlength="30">
            <div>
                <button class="confirm">${t('join.confirm')}</button>
                <button class="cancel">${t('join.cancel')}</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    const input = dialog.querySelector('input');
    const confirmBtn = dialog.querySelector('.confirm');
    const cancelBtn = dialog.querySelector('.cancel');

    input.focus();

    confirmBtn.addEventListener('click', () => {
        const username = input.value.trim();
        if (username) {
            currentUsername = username;
            localStorage.setItem('snowflakeUsernameX', username);
            updateUIForUser();
            dialog.remove();
            previousSnowflakeCount = getSnowflakeCount();
            postUserScore();
            fetchLeaders();
        }
    });

    cancelBtn.addEventListener('click', () => dialog.remove());

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') confirmBtn.click();
    });
}

function updateCountdownTimer() {
    const updateCountdownElement = document.getElementById('updateCountdown');
    if (!updateCountdownElement) return;
    
    updateCountdown--;
    if (updateCountdown <= 0) {
        updateCountdownElement.textContent = t('leaderboard.updating');
    }
    else {
        updateCountdownElement.textContent = t('leaderboard.update', { seconds: updateCountdown });
    }
}

// API functions
async function fetchLeaders() {
    try {
        const response = await fetch('https://functions.yandexcloud.net/d4edu2a1bae56j6aldbs');
        if (!response.ok) {
            console.log('Error fetching leaders:', response.status, response);
            return;
        }
        const leaders = await response.json();
        updateLeaderboard(leaders);
        updateCountdown = 10;
    } catch (error) {
        console.error('Error fetching leaders:', error);
    }
}

async function fetchTotalSnowflakes() {
    try {
        const response = await fetch('https://functions.yandexcloud.net/d4e5qu6kvkae75r0e7qt');
        if (!response.ok) {
            console.log('Error fetching total snowflakes:', response.status, response);
            return;
        }
        const total = await response.json();
        const totalSnowflakesSpan = document.getElementById('totalSnowflakes');
        totalSnowflakesSpan.textContent = total.toLocaleString();
    } catch (error) {
        console.error('Error fetching total snowflakes:', error);
    }
}

async function postUserScore() {
    if (!currentUsername) return;

    const currentCount = getSnowflakeCount();
    if (currentCount > previousSnowflakeCount) {
        try {
            const response = await fetch('https://functions.yandexcloud.net/d4ecqkmrugqls3jbh3f6', {
                method: 'POST',
                body: JSON.stringify({
                    name: currentUsername,
                    score: currentCount
                })
            });
            if (!response.ok) {
                console.log('Error posting score:', response.status, response);
                return;
            }
            previousSnowflakeCount = currentCount;
        } catch (error) {
            console.error('Error posting score:', error);
        }
    }
}

async function fetchUserScore() {
    if (!currentUsername) return;

    try {
        const response = await fetch('https://functions.yandexcloud.net/d4eg7hdbc3d5vf9seb1o', {
            method: 'POST',
            body: JSON.stringify({
                name: currentUsername
            })
        });
        if (!response.ok) {
            console.log('Error fetching user score:', response.status, response);
            return;
        }
        const score = await response.json();

        if (score && score.score && score.score > getSnowflakeCount()) {
            setSnowflakeCount(score.score);
        }
    } catch (error) {
        console.error('Error fetching user score:', error);
    }
}

function updateLeaderboard(leaders) {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList || !Array.isArray(leaders)) return;
    
    leaderboardList.innerHTML = '';
    leaders.forEach((leader, index) => {
        if (!leader || typeof leader !== 'object') return;
        
        const li = document.createElement('li');
        li.className = 'leaderboard-item';
        if (leader.name === currentUsername) {
            li.classList.add('current-user');
        }

        // Добавляем медали для первых трех мест
        let position = (index + 1).toString();
        if (index === 0) position += ' 🥇';
        else if (index === 1) position += ' 🥈';
        else if (index === 2) position += ' 🥉';

        li.innerHTML = `
            <span class="position">${position}</span>
            <span class="name">${leader.name}</span>
            <span class="score">${leader.score} ❄</span>
        `;
        leaderboardList.appendChild(li);
    });
}

export function initLeaderboard() {
    const leaderboard = document.querySelector('.leaderboard');
    const leaderboardToggle = document.querySelector('.leaderboard-toggle');
    const joinButton = document.getElementById('joinButton');

    // Toggle leaderboard
    leaderboardToggle.addEventListener('click', () => {
        leaderboard.classList.toggle('collapsed');
        leaderboardToggle.textContent = leaderboard.classList.contains('collapsed') ? '◀' : '▶';
    });

    // Join button click handler
    joinButton.addEventListener('click', showJoinDialog);

    // Initial setup
    updateUIForUser();
    fetchLeaders();
    fetchTotalSnowflakes();
    fetchUserScore();
    postUserScore();

    // Start updates
    setInterval(fetchUserScore, 5000);
    setInterval(postUserScore, 5000);
    setInterval(updateCountdownTimer, 1000);
    setInterval(() => {
        fetchLeaders();
        fetchTotalSnowflakes();
    }, 10000);

    // On mobile devices, start with collapsed leaderboard
    if (window.innerWidth <= 768) {
        leaderboard.classList.add('collapsed');
        leaderboardToggle.textContent = '▶';
    }
} 