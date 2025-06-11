const canvas = document.getElementById('dots-bg');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const DOTS = 60;
const dots = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

for (let i = 0; i < DOTS; i++) {
    dots.push({
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.6, 0.6),
        vy: random(-0.6, 0.6),
        r: random(1.5, 3.5)
    });
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < DOTS; i++) {
        for (let j = i + 1; j < DOTS; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.save();
                ctx.globalAlpha = 1 - dist / 140;
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    for (let i = 0; i < DOTS; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, dots[i].r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();
    }
}

function update() {
    for (let i = 0; i < DOTS; i++) {
        dots[i].x += dots[i].vx;
        dots[i].y += dots[i].vy;

        if (dots[i].x < 0 || dots[i].x > width) dots[i].vx *= -1;
        if (dots[i].y < 0 || dots[i].y > height) dots[i].vy *= -1;
    }
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

animate();
