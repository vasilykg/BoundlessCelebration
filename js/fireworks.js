// Управление фейерверками
let fireworks = [];
let lastTime = 0;
let ctx;
let fireworksCanvas;

function randomColor() {
    const r = Math.floor(Math.random()*255);
    const g = Math.floor(Math.random()*255);
    const b = Math.floor(Math.random()*255);
    return `rgb(${r},${g},${b})`;
}

function createFirework() {
    if (!fireworksCanvas) return;
    const x = Math.random()*fireworksCanvas.width;
    const y = Math.random()*fireworksCanvas.height/2;
    const particles = [];
    for (let i=0;i<30;i++){
        particles.push({
            x:x,
            y:y,
            vx: (Math.random()-0.5)*4,
            vy: (Math.random()-0.5)*4,
            color: randomColor(),
            life: 100
        });
    }
    fireworks.push(particles);
}

function updateFireworks() {
    if (!ctx || !fireworksCanvas) return;
    ctx.clearRect(0,0,fireworksCanvas.width, fireworksCanvas.height);
    for (let i=0;i<fireworks.length;i++){
        const particles = fireworks[i];
        for (const element of particles) {
            const p = element;
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 5, 5); // Увеличил размер частиц с 2x2 до 5x5 пикселей
        }
        fireworks[i] = particles.filter(p=>p.life>0);
    }
    fireworks = fireworks.filter(f=>f.length>0);
}

function loopFireworks(timestamp) {
    if (!ctx) return;
    if (!lastTime) lastTime=timestamp;
    const delta = timestamp - lastTime;
    if (delta > 500) { // новый фейерверк каждые 0.5 сек
        createFirework();
        lastTime=timestamp;
    }
    updateFireworks();
    requestAnimationFrame(loopFireworks);
}

export function startFireworks() {
    fireworksCanvas = document.getElementById('fireworksCanvas');
    if (!fireworksCanvas) return;
    ctx = fireworksCanvas.getContext('2d');
    fireworksCanvas.style.display = 'block';
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    requestAnimationFrame(loopFireworks);
}

export function initFireworksCanvas() {
    fireworksCanvas = document.getElementById('fireworksCanvas');
    if (!fireworksCanvas) return;
    window.addEventListener('resize', () => {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    });
} 