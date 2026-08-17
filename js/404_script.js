/* ============================================================
   HACKIM PORTFOLIO — 404 PAGE SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');
    const musicToggle = document.getElementById('musicToggle');
    const sfxToggle = document.getElementById('sfxToggle');
    const bgAudio = document.getElementById('bgAudio');

    let isMusicOn = true; // Set music to on by default for autoplay!
    let isSfxOn = true; // SFX on by default for immediate hover feedback!

    if (musicToggle) {
        musicToggle.classList.toggle('is-playing', isMusicOn);
    }
    if (sfxToggle) {
        sfxToggle.classList.toggle('is-playing', isSfxOn);
    }

    // Autoplay background music immediately on load
    if (bgAudio) {
        const attemptPlay = () => {
            bgAudio.play().then(() => {
                // Success: remove fallbacks
                document.removeEventListener('click', attemptPlay);
                document.removeEventListener('touchstart', attemptPlay);
            }).catch(err => {
                console.log('Autoplay blocked by browser. Waiting for user interaction.');
            });
        };

        // Try playing immediately
        attemptPlay();

        // Fallback: play on first user interaction anywhere on the page
        document.addEventListener('click', attemptPlay);
        document.addEventListener('touchstart', attemptPlay);
    }

    // ==================== CUSTOM CURSOR ====================
    if (cursor && window.innerWidth > 768) {
        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorRing = cursor.querySelector('.cursor-ring');
        document.body.classList.add('custom-cursor-active');
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let dotX = mouseX, dotY = mouseY;
        let ringX = mouseX, ringY = mouseY;
        let ringAngle = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const dotVx = mouseX - dotX;
            const dotVy = mouseY - dotY;
            dotX += dotVx * 0.4;
            dotY += dotVy * 0.4;

            const ringVx = mouseX - ringX;
            const ringVy = mouseY - ringY;
            ringX += ringVx * 0.14;
            ringY += ringVy * 0.14;

            const velocity = Math.sqrt(ringVx * ringVx + ringVy * ringVy);

            if (velocity > 0.5) {
                ringAngle = Math.atan2(ringVy, ringVx) * (180 / Math.PI);
            }

            const stretch = Math.min(1.22, 1 + velocity * 0.005);
            const squeeze = Math.max(0.82, 1 - velocity * 0.004);

            const dotStretch = Math.min(1.08, 1 + velocity * 0.002);
            const dotSqueeze = Math.max(0.92, 1 - velocity * 0.002);

            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            cursorDot.style.transform = `translate(-50%, -50%) rotate(${ringAngle}deg) scale(${dotStretch}, ${dotSqueeze})`;

            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            cursorRing.style.transform = `translate(-50%, -50%) rotate(${ringAngle}deg) scale(${stretch}, ${squeeze})`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

    // Hover effects (only grow cursor ring by 10% on actual links and buttons)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);
    const hoverElements = document.querySelectorAll('a, button, .magnetic-item');
    hoverElements.forEach(el => {
        if (cursor && !isTouchDevice) {
            el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
        }
    });

    // ==================== AUDIO TOGGLES ====================
    if (musicToggle && bgAudio) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering page click listener
            isMusicOn = !isMusicOn;
            musicToggle.classList.toggle('is-playing', isMusicOn);
            if (isMusicOn) {
                bgAudio.play().catch(err => console.log('Audio playback prevented:', err));
            } else {
                bgAudio.pause();
            }
        });
    }

    if (sfxToggle) {
        sfxToggle.addEventListener('click', () => {
            isSfxOn = !isSfxOn;
            sfxToggle.classList.toggle('is-playing', isSfxOn);
        });
    }

    // ==================== INTERACTIVE HOVER SOUND EFFECTS ====================
    const clickAudioPath = '/audio/click.ogg';
    const closeAudioPath = '/audio/close.ogg';

    const clickPool = [];
    const closePool = [];
    const POOL_SIZE = 4;

    for (let i = 0; i < POOL_SIZE; i++) {
        const clickSound = new Audio(clickAudioPath);
        clickSound.volume = 0.55;
        clickSound.preload = 'auto';
        clickPool.push(clickSound);

        const closeSound = new Audio(closeAudioPath);
        closeSound.volume = 0.45;
        closeSound.preload = 'auto';
        closePool.push(closeSound);
    }

    let clickIndex = 0;
    let closeIndex = 0;
    let lastSoundTime = 0;
    let lastCloseTime = 0;

    function playClickSound() {
        if (!isSfxOn) return;
        const now = Date.now();
        if (now - lastSoundTime < 35) return;
        lastSoundTime = now;

        const sound = clickPool[clickIndex];
        sound.currentTime = 0;
        sound.play().catch(() => {});
        clickIndex = (clickIndex + 1) % POOL_SIZE;
    }

    function playCloseSound() {
        if (!isSfxOn) return;
        const now = Date.now();
        if (now - lastCloseTime < 35) return;
        lastCloseTime = now;

        const sound = closePool[closeIndex];
        sound.currentTime = 0;
        sound.play().catch(() => {});
        closeIndex = (closeIndex + 1) % POOL_SIZE;
    }

    // Bind sounds to all links, buttons, and magnetic items
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            playClickSound();
        });
        el.addEventListener('mouseleave', () => {
            playCloseSound();
        });
    });

    // ==================== MAGNETIC EFFECT FOR BUTTONS ====================
    const magneticItems = document.querySelectorAll('.magnetic-item');
    if (window.innerWidth > 768 && magneticItems.length > 0) {
        magneticItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
                item.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
    }
});
