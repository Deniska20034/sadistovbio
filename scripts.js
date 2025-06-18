const canvas = document.getElementById('dots-bg');
const isMobile = window.innerWidth <= 700;

if (!isMobile && canvas) {
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const DOTS = 30;
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
            r: random(1.5, 3.5),
            alpha: 0,
            pulse: random(0, Math.PI * 2)
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
                    ctx.globalAlpha = (1 - dist / 140) * Math.min(dots[i].alpha, dots[j].alpha);
                    ctx.strokeStyle = `rgba(0,234,255,0.8)`;
                    ctx.shadowColor = "#00eaff";
                    ctx.shadowBlur = 8;
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
            const pulse = Math.sin(Date.now() / 900 + dots[i].pulse) * 0.8;
            ctx.arc(dots[i].x, dots[i].y, dots[i].r + pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,234,255,${0.7 * dots[i].alpha})`;
            ctx.shadowColor = '#00eaff';
            ctx.shadowBlur = 18 + 8 * Math.abs(pulse);
            ctx.globalAlpha = 0.85 * dots[i].alpha;
            ctx.fill();
            ctx.restore();
        }
    }

    function update() {
        for (let i = 0; i < DOTS; i++) {
            dots[i].x += dots[i].vx;
            dots[i].y += dots[i].vy;

            if (dots[i].alpha < 1) dots[i].alpha += 0.015;

            if (dots[i].x < 0) { dots[i].x = 0; dots[i].vx *= -1.1; }
            if (dots[i].x > width) { dots[i].x = width; dots[i].vx *= -1.1; }
            if (dots[i].y < 0) { dots[i].y = 0; dots[i].vy *= -1.1; }
            if (dots[i].y > height) { dots[i].y = height; dots[i].vy *= -1.1; }
        }
    }

    canvas.addEventListener('mousemove', e => {
        const mx = e.offsetX, my = e.offsetY;
        for (let i = 0; i < DOTS; i++) {
            const dx = dots[i].x - mx;
            const dy = dots[i].y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
                dots[i].vx += dx / dist * 0.7 * Math.random();
                dots[i].vy += dy / dist * 0.7 * Math.random();
                dots[i].alpha = Math.min(1.2, dots[i].alpha + 0.15);
            }
        }
    });

    let lastFrame = 0;
    function animate(now) {
        if (!lastFrame || now - lastFrame > 33) {
            update();
            draw();
            lastFrame = now;
        }
        window.requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    window.requestAnimationFrame(animate);
} else if (canvas) {
    canvas.style.display = 'none';
}

(function() {
    const discordBtn = document.getElementById('discord-btn');
    const telegramBtn = document.getElementById('telegram-btn');
    const feedback = document.getElementById('discord-copied');
    let feedbackTimer = null;

    function showFeedback() {
        if (!feedback) return;
        feedback.classList.add('show');
        feedback.style.display = 'block';
        if (feedbackTimer) clearTimeout(feedbackTimer);
        feedbackTimer = setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => { feedback.style.display = 'none'; }, 300);
        }, 1200);
    }

    if (discordBtn && feedback) {
        discordBtn.addEventListener('click', function() {
            const text = 'no6.6';
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(showFeedback);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showFeedback();
                } catch (err) {}
                document.body.removeChild(textarea);
            }
        });
    }
    if (telegramBtn) {
        telegramBtn.addEventListener('click', function() {
            window.open('http://t.me/attacksadistov', '_blank');
        });
    }
})();
