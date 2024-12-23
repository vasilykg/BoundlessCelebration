// Управление звездами

export function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    star.style.left = x + 'vw';
    star.style.top = y + 'vh';
    const duration = (Math.random()*2+1) + 's';
    star.style.animationDuration = duration;
    document.body.appendChild(star);
    setTimeout(() => {
        if (star.parentNode) star.remove();
    }, 15000);
}

export function createInitialStars(container) {
    const numberOfStars = 200;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
    }
}

export function addMoreStars() {
    for (let i = 0; i < 20; i++) {
        createStar();
    }
} 