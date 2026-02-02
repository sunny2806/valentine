// Basic confetti script (simple version to avoid external dependencies for now)
const startConfetti = () => {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4d6d', '#ff8fa3', '#fff0f3'];

    for (let i = 0; i < 100; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.y += p.speed;
            p.x += Math.sin(p.angle * Math.PI / 180) * 2;

            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
};

document.addEventListener('DOMContentLoaded', () => {
    // --- STAGE 1: Runaway Button ---
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');

    const moveButton = (e) => {
        // Prevent default tap behavior on mobile


        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

        noBtn.style.position = 'fixed'; // Switch to fixed to move freely
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    };

    noBtn.addEventListener('mouseover', moveButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Stop click
        moveButton(e);
    });
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton(e); // Just in case they manage to click it
    });

    yesBtn.addEventListener('click', () => {
        goToStage(2);
    });

    // --- STAGE 2: Lock Screen ---
    const pinInput = document.getElementById('pinInput');
    const unlockBtn = document.getElementById('unlockBtn');
    const errorMsg = document.getElementById('errorMsg');

    // THE SECRET CODE (DDMMYYYY)
    const SECRET_CODE = "30092022";

    const checkPin = () => {
        if (pinInput.value === SECRET_CODE) {
            goToStage(3);
        } else {
            errorMsg.classList.remove('hidden');
            pinInput.classList.add('shake');
            setTimeout(() => {
                pinInput.classList.remove('shake');
            }, 500);
            pinInput.value = '';
        }
    };

    unlockBtn.addEventListener('click', checkPin);
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPin();
    });

    // --- STAGE 3: Timeline ---
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));
});

function goToStage(stageNum) {
    document.querySelectorAll('.stage').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    const activeStage = document.getElementById(`stage${stageNum}`);
    activeStage.classList.remove('hidden');
    activeStage.classList.add('active');

    if (stageNum === 3) {
        startConfetti();
    }
}
