/* ============================================================
   HACKIM PORTFOLIO — JAVASCRIPT
   Handles: Loading, Custom Cursor, Scroll Animations,
   Text Reveals, Testimonial Slider, Smooth Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== CRT TV LOADING SCREEN ====================
    // ==================== CRT TV LOADING SCREEN & DOM VARIABLES ====================
    const loader = document.getElementById('loader');
    const loaderNumber = document.getElementById('loaderNumber');
    const header = document.getElementById('header');
    const cursor = document.getElementById('cursor');
    const loaderNoticeBox = document.getElementById('loaderNoticeBox');
    const enterBtn = document.getElementById('enterBtn');
    const bgAudio = document.getElementById('bgAudio');
    const musicToggle = document.getElementById('musicToggle');
    const sfxToggle = document.getElementById('sfxToggle');

    let loadProgress = 0;
    let isMusicOn = false;
    let isSfxOn = false;
    document.body.classList.add('is-loading');

    function enterExperience() {
        if (!loader || loader.classList.contains('is-hidden')) return;
        loader.classList.add('is-hidden');
        document.body.classList.remove('is-loading');

        // Autoplay background music right upon entering and activate SFX
        isMusicOn = true;
        isSfxOn = true;
        if (musicToggle) musicToggle.classList.add('is-playing');
        if (sfxToggle) sfxToggle.classList.add('is-playing');
        if (bgAudio) {
            bgAudio.volume = 1.0;
            bgAudio.play().catch(err => console.log('Audio playback prevented:', err));
        }

        // Show custom cursor after loading
        if (cursor && window.innerWidth > 768) {
            cursor.classList.remove('is-loading-hidden');
            document.body.classList.add('custom-cursor-active');
        }
        
        // Show header
        setTimeout(() => {
            if (header) header.classList.add('is-visible');
        }, 300);

        // Trigger hero animations
        setTimeout(() => {
            try {
                const heroEl = document.querySelector('.hero');
                if (heroEl) heroEl.classList.add('in-view');
                if (typeof animateHero === 'function') animateHero();
            } catch (err) { console.error(err); }
        }, 450);

        // Start observing scroll animations
        setTimeout(() => {
            try {
                if (typeof initScrollAnimations === 'function') initScrollAnimations();
            } catch (err) { console.error(err); }
        }, 650);
    }

    if (enterBtn) {
        const handleEnter = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            enterExperience();
        };
        enterBtn.addEventListener('click', handleEnter);
        enterBtn.addEventListener('touchend', handleEnter, { passive: false });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && loader && !loader.classList.contains('is-hidden') && loaderNoticeBox && loaderNoticeBox.classList.contains('is-visible')) {
            enterExperience();
        }
    });

    function finishLoader() {
        if (!loader || loader.classList.contains('is-switching')) return;
        loader.classList.add('is-switching');
        
        setTimeout(() => {
            loader.classList.add('show-real-logo');
            // Hide counter and show notice + Enter button right below the filled logo!
            const loaderCounter = document.getElementById('loaderCounter');
            if (loaderCounter) {
                loaderCounter.style.opacity = '0';
                loaderCounter.style.pointerEvents = 'none';
            }
            if (loaderNoticeBox) {
                loaderNoticeBox.classList.add('is-visible');
            }
        }, 220); // Beam flashes across, solid WordMark and notice appear!
    }

    window.__finishLoader = finishLoader;
    if (window.__loaderDone) {
        finishLoader();
    } else {
        document.body.classList.remove('is-loading');
        if (cursor && window.innerWidth > 768) {
            cursor.classList.remove('is-loading-hidden');
            document.body.classList.add('custom-cursor-active');
        }
        if (header) {
            header.classList.add('is-visible');
            header.style.transform = 'translateY(0)';
        }
        
        // Autoplay background music for loader-less pages (like portfolio.html)
        isMusicOn = true;
        isSfxOn = true;
        if (musicToggle) musicToggle.classList.add('is-playing');
        if (sfxToggle) sfxToggle.classList.add('is-playing');
        if (bgAudio) {
            const attemptPlay = () => {
                bgAudio.play().then(() => {
                    isMusicOn = true;
                    if (musicToggle) musicToggle.classList.add('is-playing');
                    document.removeEventListener('click', attemptPlay);
                    document.removeEventListener('touchstart', attemptPlay);
                }).catch(err => {
                    console.log('Autoplay blocked. Waiting for user interaction.');
                    isMusicOn = false;
                    if (musicToggle) musicToggle.classList.remove('is-playing');
                });
            };
            attemptPlay();
            document.addEventListener('click', attemptPlay);
            document.addEventListener('touchstart', attemptPlay);
        }

        setTimeout(() => {
            try {
                if (typeof initScrollAnimations === 'function') initScrollAnimations();
            } catch (err) { console.error(err); }
        }, 200);
    }

    // ==================== LENIS SMOOTH SCROLL ====================
    function initSmoothScroll() {
        if (typeof Lenis !== 'undefined' && window.innerWidth > 768) {
            const lenis = new Lenis({
                duration: 1.15,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential decay for buttery momentum
                direction: 'vertical',
                gestureDirection: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1.0,
                smoothTouch: false, // Keep native touch physics on mobile/tablets
                touchMultiplier: 2
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            // Connect smooth scroll to anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    if (targetId && targetId !== '#') {
                        const targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            e.preventDefault();
                            lenis.scrollTo(targetEl, { offset: -40, duration: 1.2 });
                        }
                    }
                });
            });
        } else {
            // Fallback native smooth scroll for anchor links if mobile/tablet
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    if (targetId && targetId !== '#') {
                        const targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            e.preventDefault();
                            targetEl.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
        }
    }

    initSmoothScroll();

    // ==================== SMART SCROLL AUTO-HIDE FOR HEADER & FLOATING BUTTONS ====================
    let lastScrollY = window.scrollY || 0;
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY || 0;
                const headerEl = document.getElementById('header');
                const audioControlsEl = document.querySelector('.floating-audio-controls');
                const backToTopBtn = document.getElementById('backToTopBtn');
                const heroEl = document.querySelector('.hero');
                const heroHeight = heroEl ? heroEl.offsetHeight * 0.7 : 450;

                // 1. If at top inside Hero section -> Hide Floating Buttons (Music, SFX, Back To Top)
                if (currentScrollY <= heroHeight) {
                    if (audioControlsEl) {
                        audioControlsEl.classList.remove('is-visible');
                        audioControlsEl.classList.add('scroll-hidden');
                    }
                    if (backToTopBtn) {
                        backToTopBtn.classList.remove('is-visible');
                        backToTopBtn.classList.add('scroll-hidden');
                    }
                    if (headerEl) headerEl.classList.remove('scroll-hidden');
                } else {
                    // 2. Past Hero section -> React to Scroll Direction
                    if (currentScrollY > lastScrollY + 5) {
                        // Scrolling DOWN -> Hide Header & Floating Buttons
                        if (headerEl && headerEl.classList.contains('is-visible')) headerEl.classList.add('scroll-hidden');
                        if (audioControlsEl) audioControlsEl.classList.add('scroll-hidden');
                        if (backToTopBtn) backToTopBtn.classList.add('scroll-hidden');
                    } else if (currentScrollY < lastScrollY - 5) {
                        // Scrolling UP -> Show Header & Floating Buttons
                        if (headerEl) headerEl.classList.remove('scroll-hidden');
                        if (audioControlsEl) {
                            audioControlsEl.classList.add('is-visible');
                            audioControlsEl.classList.remove('scroll-hidden');
                        }
                        if (backToTopBtn) {
                            backToTopBtn.classList.add('is-visible');
                            backToTopBtn.classList.remove('scroll-hidden');
                        }
                    }
                }
                
                lastScrollY = currentScrollY;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });


    // ==================== CUSTOM CURSOR ====================
    if (cursor && window.innerWidth > 768) {
        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorRing = cursor.querySelector('.cursor-ring');
        const cursorLabel = document.getElementById('cursorLabel');
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
            // Dot follows almost instantly
            const dotVx = mouseX - dotX;
            const dotVy = mouseY - dotY;
            dotX += dotVx * 0.4;
            dotY += dotVy * 0.4;

            // Ring follows with lag for dynamic elastic chase
            const ringVx = mouseX - ringX;
            const ringVy = mouseY - ringY;
            ringX += ringVx * 0.14;
            ringY += ringVy * 0.14;

            // Calculate velocity vector length
            const velocity = Math.sqrt(ringVx * ringVx + ringVy * ringVy);

            // Calculate trajectory angle (in radians then degrees) when moving
            if (velocity > 0.5) {
                ringAngle = Math.atan2(ringVy, ringVx) * (180 / Math.PI);
            }

            // Velocity stretch & squash capped at ~20% for elegant motion without oval distortion
            const stretch = Math.min(1.22, 1 + velocity * 0.005);
            const squeeze = Math.max(0.82, 1 - velocity * 0.004);

            // Subtle stretch for dot as well
            const dotStretch = Math.min(1.08, 1 + velocity * 0.002);
            const dotSqueeze = Math.max(0.92, 1 - velocity * 0.002);

            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            cursorDot.style.transform = `translate(-50%, -50%) rotate(${ringAngle}deg) scale(${dotStretch}, ${dotSqueeze})`;

            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            cursorRing.style.transform = `translate(-50%, -50%) rotate(${ringAngle}deg) scale(${stretch}, ${squeeze})`;

            if (cursorLabel) {
                cursorLabel.style.left = ringX + 'px';
                cursorLabel.style.top = ringY + 'px';
                cursorLabel.style.transform = `translate(-50%, -50%)`;
            }

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

    // Check if device is touch / mobile / tablet (up to 1024px)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);

    // Hover effects (only grow cursor ring by 10% on actual links and buttons)
    const hoverElements = document.querySelectorAll('a, button, .project-card, .social-link');
    hoverElements.forEach(el => {
        if (cursor && !isTouchDevice) {
            el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
        }
    });

    // Hold / Tap to color profile card interaction
    const holdZones = document.querySelectorAll('.hold-to-color-zone');
        holdZones.forEach(zone => {
            const profileHintText = zone.querySelector('#profileHintText') || zone.querySelector('.hint-text');
            if (profileHintText && isTouchDevice) {
                profileHintText.textContent = 'Tap to colorize';
            }

            const startHolding = (x, y) => {
                const rect = zone.getBoundingClientRect();
                const safeX = (typeof x === 'number' && !isNaN(x)) ? x : (rect.width / 2 || 150);
                const safeY = (typeof y === 'number' && !isNaN(y)) ? y : (rect.height / 2 || 150);

                const colorImg = zone.querySelector('.about-profile-color');
                if (colorImg) colorImg.style.transition = 'none';
                zone.style.setProperty('--color-x', `${safeX}px`);
                zone.style.setProperty('--color-y', `${safeY}px`);
                requestAnimationFrame(() => { if (colorImg) colorImg.style.transition = ''; });

                zone.classList.add('is-holding');
                if (!isTouchDevice) {
                    cursor.classList.add('is-hold-active');
                    if (cursorLabel) cursorLabel.style.opacity = '0';
                }
            };

            const stopHolding = () => {
                zone.classList.remove('is-holding');
                if (!isTouchDevice) {
                    cursor.classList.remove('is-hold-active');
                    if (cursorLabel) cursorLabel.style.opacity = '';
                }
            };

            zone.addEventListener('contextmenu', (e) => e.preventDefault());

            if (!isTouchDevice) {
                zone.addEventListener('mouseenter', () => {
                    cursor.classList.add('is-hold-mode');
                    if (cursorLabel) cursorLabel.textContent = zone.getAttribute('data-cursor-text') || 'Hold';
                });

                zone.addEventListener('mouseleave', () => {
                    cursor.classList.remove('is-hold-mode');
                    if (cursorLabel) cursorLabel.textContent = '';
                    stopHolding();
                });

                zone.addEventListener('mousedown', (e) => {
                    const rect = zone.getBoundingClientRect();
                    startHolding(e.clientX - rect.left, e.clientY - rect.top);
                });

                window.addEventListener('mouseup', () => {
                    if (zone.classList.contains('is-holding')) stopHolding();
                });

                zone.addEventListener('mousemove', (e) => {
                    if (!zone.classList.contains('is-holding')) {
                        const rect = zone.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        zone.style.setProperty('--color-x', `${x}px`);
                        zone.style.setProperty('--color-y', `${y}px`);
                    }
                });
            } else {
                // Mobile Touch & Tap Toggle Support (`Tap to colorize`)
                let isHandled = false;
                const toggleColorize = (e) => {
                    if (isHandled) return;
                    isHandled = true;
                    setTimeout(() => { isHandled = false; }, 300);

                    const rect = zone.getBoundingClientRect();
                    let clientX = rect.width / 2;
                    let clientY = rect.height / 2;

                    if (e.changedTouches && e.changedTouches[0]) {
                        clientX = e.changedTouches[0].clientX - rect.left;
                        clientY = e.changedTouches[0].clientY - rect.top;
                    } else if (typeof e.clientX === 'number' && !isNaN(e.clientX) && e.clientX !== 0) {
                        clientX = e.clientX - rect.left;
                        clientY = e.clientY - rect.top;
                    }

                    if (zone.classList.contains('is-holding')) {
                        stopHolding();
                        if (profileHintText) profileHintText.textContent = 'Tap to colorize';
                    } else {
                        startHolding(clientX, clientY);
                        if (profileHintText) profileHintText.textContent = 'Colorized ✨';
                    }
                };

                zone.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    toggleColorize(e);
                });

                zone.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleColorize(e);
                });
            }
        });

        // Mobile Double-Tap / Hover Toggle for Cards and Interactive Items
        const mobileHoverCards = document.querySelectorAll('.project-card, .skill-row, .process-step, .history-row, .testimonial-card, .client-row, .social-link');
        mobileHoverCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const isMobileOrTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);
                if (!isMobileOrTouch) return;

                // Check if clicking inside profile hint / zone (ignore)
                if (card.closest('.hold-to-color-zone')) return;

                if (!card.classList.contains('is-mobile-active')) {
                    // First tap: show hover state, prevent navigation if link
                    if (card.querySelector('a') || card.tagName.toLowerCase() === 'a') e.preventDefault();
                    // Dismiss other open cards
                    mobileHoverCards.forEach(c => {
                        if (c !== card) {
                            c.classList.remove('is-mobile-active');
                            c.classList.remove('is-flipped');
                        }
                    });
                    card.classList.add('is-mobile-active');
                    if (card.classList.contains('text-flip-zone')) {
                        triggerZoneFlip(card);
                    }
                } else {
                    // Second tap: if it's not a link or tapped again, remove active state
                    if (!card.querySelector('a') && card.tagName.toLowerCase() !== 'a') {
                        card.classList.remove('is-mobile-active');
                        card.classList.remove('is-flipped');
                    }
                }
            });
        });

        // Tap outside to close active mobile hover items
        document.addEventListener('click', (e) => {
            const isMobileOrTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);
            if (!isMobileOrTouch) return;

            if (!e.target.closest('.project-card, .skill-row, .process-step, .history-row, .testimonial-card, .client-row, .social-link, .hold-to-color-zone, .text-flip-zone')) {
                document.querySelectorAll('.is-mobile-active, .is-flipped').forEach(c => {
                    c.classList.remove('is-mobile-active');
                    c.classList.remove('is-flipped');
                });
            }
        });

        // Universal Text Flip Button & Zone Interaction (for Hero, About me, Experience, Selected work, How I work, Contact, Social Links)
        const triggerZoneFlip = (zone) => {
            if (!zone) return;
            zone.classList.add('is-flipped');
            zone.classList.add('is-mobile-active');
            if (zone._flipTimer) clearTimeout(zone._flipTimer);
            zone._flipTimer = setTimeout(() => {
                zone.classList.remove('is-flipped');
                zone.classList.remove('is-mobile-active');
            }, 3500);
        };

        const textFlipButtons = document.querySelectorAll('.text-flip-btn');
        textFlipButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const zone = btn.closest('.text-flip-zone');
                triggerZoneFlip(zone);
            });
        });

        const textFlipZones = document.querySelectorAll('.text-flip-zone');
        textFlipZones.forEach(zone => {
            zone.addEventListener('click', (e) => {
                const isMobileOrTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);
                if (!isMobileOrTouch) return;
                if (e.target.closest('.text-flip-btn')) return;
                triggerZoneFlip(zone);
            });
        });

        // Magnetic pull effect for menu links, history rows, and buttons
        const magneticItems = document.querySelectorAll('.magnetic-item, .nav-link, .history-row');
        magneticItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
                if (item.classList.contains('hero-scroll')) {
                    item.style.transform = `translate(calc(-50% + ${x}px), ${y}px)`;
                } else {
                    item.style.transform = `translate(${x}px, ${y}px)`;
                }
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
        });


    // ==================== HERO ANIMATIONS ====================
    function animateHero() {
        // Animate subtitle
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            subtitle.classList.add('is-revealed');
        }

        // Animate hero lines (character by character for LTR English, word-by-word for RTL Arabic to keep cursive letters connected!)
        const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
        const heroLines = document.querySelectorAll('.hero-line');
        heroLines.forEach((line, lineIndex) => {
            const text = line.textContent;
            const strong = line.querySelector('strong');
            const baseDelay = (lineIndex + 1) * 150;

            if (isRTL) {
                // For RTL Arabic, animate whole lines directly without splitting into inline-block word spans!
                // This eliminates GPU layer slicing and hairline seams on custom Arabic display fonts.
                line.classList.add('char');
                line.style.transitionDelay = (baseDelay) + 'ms';
            } else {
                if (strong) {
                    const strongText = strong.textContent;
                    line.innerHTML = '';
                    const strongEl = document.createElement('strong');
                    let charCount = 0;
                    strongText.split(/(\s+)/).forEach(w => {
                        if (!w) return;
                        if (/\s+/.test(w)) {
                            strongEl.appendChild(document.createTextNode(' '));
                            charCount++;
                        } else {
                            const wordSpan = document.createElement('span');
                            wordSpan.className = 'hero-word';
                            wordSpan.style.display = 'inline-block';
                            wordSpan.style.whiteSpace = 'nowrap';
                            [...w].forEach(char => {
                                const span = document.createElement('span');
                                span.className = 'char';
                                span.textContent = char;
                                span.style.transitionDelay = (baseDelay + charCount * 40) + 'ms';
                                wordSpan.appendChild(span);
                                charCount++;
                            });
                            strongEl.appendChild(wordSpan);
                        }
                    });
                    line.appendChild(strongEl);
                } else {
                    line.innerHTML = '';
                    let charCount = 0;
                    text.split(/(\s+)/).forEach(w => {
                        if (!w) return;
                        if (/\s+/.test(w)) {
                            line.appendChild(document.createTextNode(' '));
                            charCount++;
                        } else {
                            const wordSpan = document.createElement('span');
                            wordSpan.className = 'hero-word';
                            wordSpan.style.display = 'inline-block';
                            wordSpan.style.whiteSpace = 'nowrap';
                            [...w].forEach(char => {
                                const span = document.createElement('span');
                                span.className = 'char';
                                span.textContent = char;
                                span.style.transitionDelay = (baseDelay + charCount * 40) + 'ms';
                                wordSpan.appendChild(span);
                                charCount++;
                            });
                            line.appendChild(wordSpan);
                        }
                    });
                }
            }

            // Trigger reveal
            setTimeout(() => {
                line.querySelectorAll('.char').forEach(char => {
                    char.classList.add('is-revealed');
                });
            }, 100);
        });
    }

    // Initialize hero text animation on load
    animateHero();


    // ==================== SCROLL ANIMATIONS ====================
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    
                    // For staggered children
                    const children = entry.target.querySelectorAll('.history-row, .project-card');
                    children.forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add('is-revealed');
                        }, i * 150);
                    });
                }
            });
        }, observerOptions);

        // Observe section labels and cinematic reveal texts
        document.querySelectorAll('.section-label, .reveal-text').forEach(el => observer.observe(el));

        // Split section description texts into visual lines for line-by-line scroll reveal
        // Split section description texts into inline-block words for staggered scroll reveal without trapping orphan lines or stripping strong tags
        function initWordByWordReveal() {
            if (document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar') return;
            const revealTexts = document.querySelectorAll('.scroll-reveal-text');
            revealTexts.forEach(el => {
                if (el.classList.contains('words-split') || el.querySelector('.reveal-word')) return;
                el.classList.add('words-split');

                const childNodes = Array.from(el.childNodes);
                el.innerHTML = '';
                let wordIndex = 0;

                childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const words = node.textContent.split(/(\s+)/);
                        words.forEach(w => {
                            if (!w) return;
                            if (/\s+/.test(w)) {
                                el.appendChild(document.createTextNode(' '));
                            } else {
                                const outer = document.createElement('span');
                                outer.className = 'reveal-word';
                                const inner = document.createElement('span');
                                inner.className = 'reveal-word-inner';
                                inner.style.transitionDelay = `${Math.min(wordIndex * 0.02, 0.45)}s`;
                                inner.textContent = w;
                                outer.appendChild(inner);
                                el.appendChild(outer);
                                wordIndex++;
                            }
                        });
                    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'STRONG') {
                        const strongWords = node.textContent.split(/(\s+)/);
                        strongWords.forEach(w => {
                            if (!w) return;
                            if (/\s+/.test(w)) {
                                el.appendChild(document.createTextNode(' '));
                            } else {
                                const outer = document.createElement('strong');
                                outer.className = 'reveal-word reveal-word--strong';
                                const inner = document.createElement('span');
                                inner.className = 'reveal-word-inner';
                                inner.style.transitionDelay = `${Math.min(wordIndex * 0.02, 0.45)}s`;
                                inner.textContent = w;
                                outer.appendChild(inner);
                                el.appendChild(outer);
                                wordIndex++;
                            }
                        });
                    } else {
                        el.appendChild(node.cloneNode(true));
                    }
                });
            });
        }

        initWordByWordReveal();

        // Observe scroll reveal text
        document.querySelectorAll('.scroll-reveal-text').forEach(el => observer.observe(el));

        // Observe history rows
        document.querySelectorAll('.history-row').forEach(el => observer.observe(el));

        // Observe project cards
        document.querySelectorAll('.project-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const cards = document.querySelectorAll('.project-card');
                    const cardIndex = Array.from(cards).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, (cardIndex % 2) * 200);
                    projectObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.project-card').forEach(el => projectObserver.observe(el));



        // Observe motto elements
        const mottoLabel = document.querySelector('.motto-label');
        const mottoHeading = document.querySelector('.motto-heading');
        const mottoAuthor = document.querySelector('.motto-author');

        if (mottoLabel) {
            mottoLabel.style.opacity = '0';
            mottoLabel.style.transform = 'translateY(20px)';
            mottoLabel.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        }
        if (mottoHeading) {
            mottoHeading.style.opacity = '0';
            mottoHeading.style.transform = 'translateY(30px)';
            mottoHeading.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s';
        }
        if (mottoAuthor) {
            mottoAuthor.style.opacity = '0';
            mottoAuthor.style.transform = 'translateY(15px)';
            mottoAuthor.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s';
        }

        const mottoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (mottoLabel) { mottoLabel.style.opacity = '1'; mottoLabel.style.transform = 'translateY(0)'; }
                    if (mottoHeading) { mottoHeading.style.opacity = '1'; mottoHeading.style.transform = 'translateY(0)'; }
                    if (mottoAuthor) { mottoAuthor.style.opacity = '1'; mottoAuthor.style.transform = 'translateY(0)'; }
                    mottoObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });

        const mottoSection = document.querySelector('.motto');
        if (mottoSection) mottoObserver.observe(mottoSection);
    }


    // ==================== SCROLL-LINKED SECTION CIRCLE REVEAL (of Skin and Souls) ====================
    function initSectionCircleReveal() {
        const circleSections = document.querySelectorAll('.motto, .about, .work, .clients, .showreel, .process, .contact');
        if (!circleSections.length) return;

        circleSections.forEach(sec => sec.classList.add('circle-reveal-section'));

        function updateCircleReveals() {
            const windowHeight = window.innerHeight;

            circleSections.forEach(sec => {
                const rect = sec.getBoundingClientRect();

                // When section enters from the bottom up toward center
                if (rect.top <= windowHeight && rect.top >= -rect.height) {
                    let progress = (windowHeight - rect.top) / (windowHeight * 0.72);
                    progress = Math.max(0, Math.min(1, progress));

                    // Circle starts right in center at 28% radius and expands up to 158% across scroll
                    const radius = 28 + progress * 130;
                    sec.style.setProperty('--circle-radius', `${radius}%`);
                } else if (rect.top > windowHeight) {
                    sec.style.setProperty('--circle-radius', `28%`);
                } else {
                    sec.style.setProperty('--circle-radius', `158%`);
                }
            });
        }

        window.addEventListener('scroll', updateCircleReveals, { passive: true });
        updateCircleReveals();
    }

    initSectionCircleReveal();





    // ==================== SMOOTH SCROLL NAV & HERO SCROLL BUTTON ====================
    document.querySelectorAll('a[href^="#"], .hero-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href') || '#about';
            const target = document.querySelector(targetId);
            if (target) {
                if (typeof lenis !== 'undefined') {
                    lenis.scrollTo(target, { duration: 1.3, offset: 0 });
                } else {
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // ==================== PARALLAX EFFECTS ====================
    let ticking = false;

    function updateParallax() {
        const scrollY = window.pageYOffset;

        // BATCH ALL DOM READS FIRST (prevents forced layout reflow)
        const heroEl = document.querySelector('.hero');
        const mottoEl = document.querySelector('.motto');
        const expEl = document.querySelector('.experience');
        const showreelEl = document.querySelector('.showreel');

        const heroBg = document.querySelector('.hero-bg-img');
        const mottoBg = document.querySelector('.motto-bg-img');
        const expBg = document.querySelector('.experience-bg-img');
        const showreelBg = document.querySelector('.showreel-img');

        const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
        const mottoRect = mottoEl ? mottoEl.getBoundingClientRect() : null;
        const expRect = expEl ? expEl.getBoundingClientRect() : null;
        const showreelRect = showreelEl ? showreelEl.getBoundingClientRect() : null;

        // BATCH ALL DOM WRITES SECOND
        if (heroBg && heroRect && heroRect.bottom > 0) {
            heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.15}px)`;
        }
        if (mottoBg && mottoRect && mottoRect.top < window.innerHeight && mottoRect.bottom > 0) {
            const progress = (window.innerHeight - mottoRect.top) / (window.innerHeight + mottoRect.height);
            mottoBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 80}px)`;
        }
        if (expBg && expRect && expRect.top < window.innerHeight && expRect.bottom > 0) {
            const progress = (window.innerHeight - expRect.top) / (window.innerHeight + expRect.height);
            expBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 60}px)`;
        }
        if (showreelBg && showreelRect && showreelRect.top < window.innerHeight && showreelRect.bottom > 0) {
            const progress = (window.innerHeight - showreelRect.top) / (window.innerHeight + showreelRect.height);
            showreelBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 80}px)`;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });


    // ==================== BACK-TO-TOP SCROLL BEHAVIOR ====================
    const backToTopBtn = document.getElementById('backToTopBtn');

    function scrollToTopSmooth(e) {
        if (e) e.preventDefault();
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, { duration: 1.3 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTopSmooth);
    document.querySelectorAll('.footer-back-top, .header-logo').forEach(el => el.addEventListener('click', scrollToTopSmooth));


    // ==================== GENERATIVE CINEMATIC SOUNDSCAPE (WEB AUDIO API) ====================
    let audioCtx = null;
    let droneOsc1 = null;
    let droneOsc2 = null;
    let droneGain = null;
    let filter = null;

    function startSoundscape() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Create warm cinematic sub-drone (55Hz sub A1 and 82.5Hz fifth E2)
        droneOsc1 = audioCtx.createOscillator();
        droneOsc2 = audioCtx.createOscillator();
        droneGain = audioCtx.createGain();
        filter = audioCtx.createBiquadFilter();

        droneOsc1.type = 'sine';
        droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

        droneOsc2.type = 'triangle';
        droneOsc2.frequency.setValueAtTime(82.5, audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(240, audioCtx.currentTime);

        // Smooth fade-in over 2 seconds
        droneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 2);

        droneOsc1.connect(filter);
        droneOsc2.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(audioCtx.destination);

        droneOsc1.start();
        droneOsc2.start();
    }

    function stopSoundscape() {
        if (droneGain && audioCtx) {
            droneGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
            setTimeout(() => {
                if (droneOsc1) { droneOsc1.stop(); droneOsc1.disconnect(); }
                if (droneOsc2) { droneOsc2.stop(); droneOsc2.disconnect(); }
            }, 1200);
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            isMusicOn = !isMusicOn;
            musicToggle.classList.toggle('is-playing', isMusicOn);
            const bgAudio = document.getElementById('bgAudio');
            if (isMusicOn) {
                if (bgAudio) {
                    bgAudio.play().catch(err => console.log('Audio playback prevented:', err));
                }
            } else {
                if (bgAudio) {
                    bgAudio.pause();
                }
            }
        });
    }

    if (sfxToggle) {
        sfxToggle.addEventListener('click', () => {
            isSfxOn = !isSfxOn;
            sfxToggle.classList.toggle('is-playing', isSfxOn);
        });
    }


    // ==================== INTERACTIVE HOVER & CLICK SOUND EFFECTS (click.ogg / close.ogg) ====================
    function initInteractiveSoundFX() {
        const clickAudioPath = 'audio/click.ogg';
        const closeAudioPath = 'audio/close.ogg';

        const clickPool = [];
        const closePool = [];
        const POOL_SIZE = 6;

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
            if (!isSfxOn && !document.body.classList.contains('is-loading')) return;
            const now = Date.now();
            if (now - lastSoundTime < 35) return;
            lastSoundTime = now;

            const sound = clickPool[clickIndex];
            sound.currentTime = 0;
            sound.play().catch(() => {});
            clickIndex = (clickIndex + 1) % POOL_SIZE;
        }

        function playCloseSound() {
            if (!isSfxOn && !document.body.classList.contains('is-loading')) return;
            const now = Date.now();
            if (now - lastCloseTime < 35) return;
            lastCloseTime = now;

            const sound = closePool[closeIndex];
            sound.currentTime = 0;
            sound.play().catch(() => {});
            closeIndex = (closeIndex + 1) % POOL_SIZE;
        }

        const hoverSelector = [
            '.project-card',
            '.portfolio-card',
            '.skill-row',
            '.process-step',
            '.history-row',
            '.client-row',
            '.testimonial-slide',
            '.nav-link',
            '.social-link',
            '.text-flip-btn',
            '.filter-btn',
            '.enter-btn',
            '.floating-sound-btn',
            '.back-to-top-btn',
            'a[href]',
            'button'
        ].join(', ');

        const hoverElements = document.querySelectorAll(hoverSelector);
        hoverElements.forEach(el => {
            if (el._soundBound) return;
            el._soundBound = true;

            el.addEventListener('mouseenter', () => {
                playClickSound();
            });

            el.addEventListener('mouseleave', () => {
                playCloseSound();
            });
        });

        const clickSelector = [
            'a[href]',
            'button',
            '.enter-btn',
            '.filter-btn',
            '.text-flip-btn',
            '.floating-sound-btn',
            '.back-to-top-btn'
        ].join(', ');

        const clickElements = document.querySelectorAll(clickSelector);
        clickElements.forEach(el => {
            if (el._clickSoundBound) return;
            el._clickSoundBound = true;

            el.addEventListener('click', () => {
                playClickSound();
            });
        });
    }

    initInteractiveSoundFX();


    // ==================== ARTEFAKT WORKS CINEMATIC HOVER & PAN ====================
    function initArtefaktWorksHover() {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) / (rect.width / 2);
                const deltaY = (e.clientY - centerY) / (rect.height / 2);

                const panX = deltaX * -14;
                const panY = deltaY * -14;

                card.style.setProperty('--pan-x', `${panX}px`);
                card.style.setProperty('--pan-y', `${panY}px`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--pan-x', `0px`);
                card.style.setProperty('--pan-y', `0px`);
            });
        });
    }

    initArtefaktWorksHover();





    // ==================== PROJECT CARD IMAGE TILT ====================
    if (window.innerWidth > 768) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                const img = card.querySelector('.project-image');
                if (img) {
                    img.style.transform = `scale(1.08) translate(${x * 10}px, ${y * 10}px)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('.project-image');
                if (img) {
                    img.style.transform = 'scale(1)';
                }
            });
        });
    }


    // ==================== SHOWREEL VIDEO MODAL & AUDIO FADE ====================
    const showreelPlayBtn = document.getElementById('showreelPlay');
    const showreelContainer = document.getElementById('showreelContainer');
    const videoModal = document.getElementById('videoModal');
    const videoModalClose = document.getElementById('videoModalClose');
    const videoModalBg = document.getElementById('videoModalBg');
    const showreelVideo = document.getElementById('showreelVideo');
    let fadeOutInterval = null;
    let fadeInInterval = null;

    if (showreelContainer && showreelPlayBtn) {
        showreelContainer.addEventListener('mousemove', (e) => {
            const rect = showreelContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            showreelPlayBtn.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
        });
    }

    if (videoModal) {
        const openVideoModal = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            videoModal.classList.add('is-active');
            if (typeof lenis !== 'undefined') lenis.stop();
            
            // Fade out background music smoothly
            if (fadeInInterval) clearInterval(fadeInInterval);
            const bgAudio = document.getElementById('bgAudio');
            if (bgAudio && !bgAudio.paused) {
                let vol = bgAudio.volume || 1.0;
                fadeOutInterval = setInterval(() => {
                    vol -= 0.06;
                    if (vol <= 0) {
                        bgAudio.volume = 0;
                        bgAudio.pause();
                        clearInterval(fadeOutInterval);
                    } else {
                        bgAudio.volume = vol;
                    }
                }, 35);
            }

            if (showreelVideo) {
                if (showreelVideo.tagName.toLowerCase() === 'iframe') {
                    const dataSrc = showreelVideo.getAttribute('data-src');
                    if (dataSrc) showreelVideo.src = dataSrc;
                } else {
                    showreelVideo.currentTime = 0;
                    showreelVideo.play().catch(err => console.log('Video autoplay prevented by browser:', err));
                }
            }
        };

        const closeVideoModal = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            videoModal.classList.remove('is-active');
            if (typeof lenis !== 'undefined') lenis.start();
            if (showreelVideo) {
                if (showreelVideo.tagName.toLowerCase() === 'iframe') {
                    showreelVideo.src = '';
                } else {
                    showreelVideo.pause();
                }
            }

            // Fade background music back in if sound is enabled
            if (fadeOutInterval) clearInterval(fadeOutInterval);
            const bgAudio = document.getElementById('bgAudio');
            if (bgAudio && isMusicOn) {
                bgAudio.volume = 0;
                bgAudio.play().catch(err => console.log('Audio resume prevented:', err));
                let vol = 0;
                fadeInInterval = setInterval(() => {
                    vol += 0.05;
                    if (vol >= 1.0) {
                        bgAudio.volume = 1.0;
                        clearInterval(fadeInInterval);
                    } else {
                        bgAudio.volume = vol;
                    }
                }, 35);
            }
        };

        if (showreelPlayBtn) showreelPlayBtn.addEventListener('click', openVideoModal);
        if (showreelContainer) showreelContainer.addEventListener('click', openVideoModal);

        if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
        if (videoModalBg) videoModalBg.addEventListener('click', closeVideoModal);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('is-active')) {
                closeVideoModal();
            }
        });
    }



    // ==================== ABOUT ME 3D LOGO (GLB MODEL + SCROLL & MOUSE INTERACTION) ====================
    const initAbout3DLogo = () => {
        const container = document.getElementById('about3dContainer');
        const canvas = document.getElementById('about3dCanvas');
        if (!container || !canvas || typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined' || window.innerWidth <= 768) return;

        // Scene setup
        const scene = new THREE.Scene();
        
        // Camera setup with clean field of view and plenty of clearance to prevent clipping
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 5.2);

        // Renderer setup with transparent background and high DPI rendering
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
        if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35;

        // ==================== 3-POINT STUDIO LIGHTING FOR HIGH-CONTRAST SHADES & DEPTH ====================
        // Low ambient light so shadows are rich, deep, and defined (not flat uniform gray!)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(ambientLight);

        // Key Light: Blazing warm gold highlight from top-right front
        const keyLight = new THREE.DirectionalLight(0xfebd43, 4.5);
        keyLight.position.set(4, 5, 6);
        scene.add(keyLight);

        // Rim Light: Crisp cool steel outline separating extruded depth sides from dark background
        const rimLight = new THREE.DirectionalLight(0xe2e2e2, 2.8);
        rimLight.position.set(-6, -2, -4);
        scene.add(rimLight);

        // Fill Light: Deep red/orange shadow fill inside the curves
        const fillLight = new THREE.PointLight(0xdc4232, 2.2, 12);
        fillLight.position.set(0, -3, 3);
        scene.add(fillLight);

        let logoModel = null;
        const logoGroup = new THREE.Group();
        scene.add(logoGroup);

        let targetRotationY = 0;
        let targetRotationX = 0;
        let currentRotationY = 0;
        let currentRotationX = 0;
        let mouseX = 0;
        let mouseY = 0;

        // Load GLB Model (supports instant local memory base64 without CORS/file fetch errors!)
        const setupModel = (gltf) => {
            logoModel = gltf.scene;

            // 1. Center the geometry vertices directly so the anchor point (pivot) is right in the exact center of the physical element (`في نص العنصر نفسه`)!
            logoModel.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) {
                        child.geometry.computeBoundingBox();
                        child.geometry.center(); // Moves geometry center to (0,0,0) of the mesh
                    }

                    // 2. Upgrade material to Premium Studio Metallic Shader with brilliant highlights & deep shades
                    child.material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(0xd69f3d), // Rich golden metallic base
                        roughness: 0.22, // High gloss for sharp specular reflections and defined edges
                        metalness: 0.88, // Deep metallic sheen
                        side: THREE.DoubleSide
                    });
                }
            });

            // Re-check bounding box of centered meshes inside logoModel and normalize to origin
            const box = new THREE.Box3().setFromObject(logoModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            logoModel.position.x = -center.x;
            logoModel.position.y = -center.y;
            logoModel.position.z = -center.z;

            // 3. Exact Upright Right-Side Up Correction: Top rectangular bar at the top, curved leg below it standing upright exactly like Image #2!
            logoModel.rotation.x = Math.PI / 2;
            logoModel.rotation.y = 0;
            logoModel.rotation.z = 0;

            // 4. Safe scale (2.0 / maxDim) guarantees the logo NEVER clips (`مقصوص`) outside canvas bounds when spinning or floating
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = (2.0 / (maxDim || 1));
            logoModel.scale.set(scale, scale, scale);

            logoGroup.add(logoModel);
        };

        const loader = new THREE.GLTFLoader();
        if (window.HACKIM_3D_LOGO_BASE64) {
            try {
                const base64Data = window.HACKIM_3D_LOGO_BASE64.replace(/^data:.*,/, '');
                const binaryString = window.atob(base64Data);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                loader.parse(bytes.buffer, '', setupModel, (err) => {
                    console.error('Error parsing inline GLB buffer, falling back to fetch:', err);
                    loader.load('Hackim-3d-icon.glb', setupModel);
                });
            } catch (e) {
                console.error('Base64 decode error, falling back to fetch:', e);
                loader.load('Hackim-3d-icon.glb', setupModel);
            }
        } else {
            loader.load('Hackim-3d-icon.glb', setupModel, undefined, (error) => {
                console.error('Error loading 3D Logo GLB:', error);
            });
        }

        // Track mouse movement over the window for gentle parallax tilt
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.35;
        });

        // Handle Resize
        window.addEventListener('resize', () => {
            if (!container || !renderer || !camera) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        // Optimization: Observe visibility to pause 3D Logo rendering when offscreen
        let is3DVisible = true;
        if ('IntersectionObserver' in window && container) {
            const observer3D = new IntersectionObserver((entries) => {
                entries.forEach(entry => { is3DVisible = entry.isIntersecting; });
            });
            observer3D.observe(container);
        }

        // Animation Loop tied to Scroll Progress & Mouse Parallax
        const animate3D = () => {
            requestAnimationFrame(animate3D);
            if (!is3DVisible) return;

            const aboutSection = document.getElementById('about');
            if (aboutSection && logoGroup && logoModel) {
                const rect = aboutSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Progress from 0 (entering bottom of screen) to 1 (leaving top of screen)
                const totalTravel = windowHeight + rect.height;
                const traveled = windowHeight - rect.top;
                const progress = Math.max(0, Math.min(1, traveled / totalTravel));

                // Restricted scroll rotation: smoothly turns from -45 degrees to +45 degrees ONLY (front face always readable, zero 180 flip!)
                const minAngle = -Math.PI / 4; // -45 degrees
                const rangeAngle = Math.PI / 2;  // 90 degrees total span (-45 to +45)
                targetRotationY = minAngle + progress * rangeAngle + mouseX;
                targetRotationX = Math.sin(progress * Math.PI) * 0.08 + mouseY;

                // Smooth lerp for fluid motion
                currentRotationY += (targetRotationY - currentRotationY) * 0.08;
                currentRotationX += (targetRotationX - currentRotationX) * 0.08;

                logoGroup.rotation.y = currentRotationY;
                logoGroup.rotation.x = currentRotationX;
                
                // Gentle vertical floating hover (safely within canvas clearance so zero clipping occurs)
                logoGroup.position.y = Math.sin(Date.now() * 0.0018) * 0.1;
            }

            renderer.render(scene, camera);
        };

        animate3D();
    };

    // ==================== INTERACTIVE WEBGL 3D MESH BENDING (COPIED FROM PORTFOLIO.HTML) ====================
    const initWebGLImageLensEffect = () => {
        if (typeof THREE === 'undefined' || window.innerWidth <= 768) return;

        const meshBendingVertexShader = `
            uniform vec2 uMouse;
            uniform float uHover;
            uniform float uIntensity;
            uniform float uRadius;
            varying vec2 vUv;

            void main() {
                vUv = uv;
                vec3 pos = position;

                vec2 m = uMouse;
                float dist = distance(vUv, m);

                if (dist < uRadius && uHover > 0.001) {
                    float factor = (1.0 - dist / uRadius);
                    float bend = sin(factor * 3.14159265) * 0.45 * uHover * uIntensity;
                    pos.z += bend;
                }

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;

        const meshBendingFragmentShader = `
            uniform sampler2D uTexture;
            uniform vec2 uMouse;
            uniform float uHover;
            uniform float uIntensity;
            uniform float uRadius;
            varying vec2 vUv;

            void main() {
                vec2 uv = vUv;
                vec2 m = uMouse;
                float dist = distance(uv, m);

                if (dist < uRadius && uHover > 0.001) {
                    float factor = (1.0 - dist / uRadius);
                    float disp = sin(factor * 3.14159265) * 0.065 * uHover * uIntensity;
                    vec2 dir = normalize(uv - m + vec2(0.0001));
                    uv -= dir * disp;
                }

                // GLSL SDF Rounded Box Corner Clipping (100% exact frame fit with smooth rounded corners!)
                vec2 p = vUv - vec2(0.5);
                vec2 d = abs(p) - vec2(0.5) + vec2(0.04);
                float sdf = min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - 0.04;
                if (sdf > 0.0) {
                    discard;
                }

                vec4 color = texture2D(uTexture, uv);
                gl_FragColor = color;
            }
        `;

        const textureLoader = new THREE.TextureLoader();

        // 1. Setup project image wraps in Selected Work and Showreel poster
        const interactiveWraps = document.querySelectorAll('.project-card .project-image-wrap, .showreel-poster');
        interactiveWraps.forEach((wrap) => {
            const img = wrap.querySelector('.project-image, .showreel-img');
            if (!img) return;

            // Remove any previous canvas
            const oldCanvas = wrap.querySelector('.webgl-lens-canvas');
            if (oldCanvas) oldCanvas.remove();

            const canvasEl = document.createElement('canvas');
            canvasEl.className = 'webgl-lens-canvas';
            canvasEl.style.opacity = '0';
            canvasEl.style.transition = 'opacity 0.4s ease';
            wrap.appendChild(canvasEl);

            setupCanvasLens(canvasEl, wrap, img);
        });

        function setupCanvasLens(canvasEl, containerEl, imgEl) {
            let width = containerEl.clientWidth || 400;
            let height = containerEl.clientHeight || 225;

            canvasEl.width = width;
            canvasEl.height = height;

            // Showreel poster gets 50% effect intensity (0.5) and small radius (0.28). Project cards get full (1.0) and wide radius (0.65).
            const isShowreel = containerEl.classList.contains('showreel-poster') || containerEl.closest('.showreel-inner') !== null;
            const effectIntensity = isShowreel ? 0.5 : 1.0;
            const effectRadius = isShowreel ? 0.28 : 0.65;

            let aspect = width / height;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
            camera.position.z = 2.414;

            const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

            const shaderMat = new THREE.ShaderMaterial({
                vertexShader: meshBendingVertexShader,
                fragmentShader: meshBendingFragmentShader,
                uniforms: {
                    uTexture: { value: null },
                    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                    uHover: { value: 0.0 },
                    uIntensity: { value: effectIntensity },
                    uRadius: { value: effectRadius }
                },
                side: THREE.DoubleSide,
                transparent: true
            });

            const planeGeom = new THREE.PlaneGeometry(2 * aspect, 2.0, 32, 32);
            const mesh = new THREE.Mesh(planeGeom, shaderMat);
            scene.add(mesh);

            textureLoader.load(imgEl.src, (loadedTex) => {
                if (THREE.sRGBEncoding) loadedTex.encoding = THREE.sRGBEncoding;
                loadedTex.needsUpdate = true;
                shaderMat.uniforms.uTexture.value = loadedTex;
                canvasEl.style.opacity = '1';
                imgEl.style.opacity = '0'; // Seamless takeover by 3D WebGL Canvas
            });

            let targetHover = 0.0;
            let currentHover = 0.0;
            let targetMouse = new THREE.Vector2(0.5, 0.5);
            let currentMouse = new THREE.Vector2(0.5, 0.5);
            let isLensVisible = true;

            if ('IntersectionObserver' in window) {
                const lensObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => { isLensVisible = entry.isIntersecting; });
                });
                lensObserver.observe(containerEl);
            }

            const parentCard = containerEl.closest('.project-card, .showreel-inner, .showreel') || containerEl;

            function onPointerMove(e) {
                const rect = containerEl.getBoundingClientRect();
                if (rect.width <= 0 || rect.height <= 0) return;
                const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                const mouseY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

                targetMouse.x = mouseX / rect.width;
                targetMouse.y = 1.0 - (mouseY / rect.height);
                targetHover = 1.0;
            }

            parentCard.addEventListener('mousemove', onPointerMove);
            parentCard.addEventListener('mouseleave', () => { targetHover = 0.0; });

            function renderLoop() {
                requestAnimationFrame(renderLoop);

                if (!isLensVisible) return;
                if (targetHover === 0 && currentHover < 0.002) {
                    if (currentHover > 0) {
                        currentHover = 0;
                        shaderMat.uniforms.uHover.value = 0;
                        renderer.render(scene, camera);
                    }
                    return;
                }

                const currentW = containerEl.clientWidth;
                const currentH = containerEl.clientHeight;
                if (currentW > 0 && currentH > 0 && (currentW !== width || currentH !== height)) {
                    width = currentW;
                    height = currentH;
                    aspect = width / height;
                    camera.aspect = aspect;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                    mesh.geometry.dispose();
                    mesh.geometry = new THREE.PlaneGeometry(2 * aspect, 2.0, 32, 32);
                }

                currentMouse.lerp(targetMouse, 0.14);

                shaderMat.uniforms.uHover.value = currentHover;
                shaderMat.uniforms.uMouse.value.copy(currentMouse);

                if (shaderMat.uniforms.uTexture.value) {
                    renderer.render(scene, camera);
                }
            }
            renderLoop();
        }
    };

    // Expose 3D init functions as globals for lazy-loader to call after Three.js is loaded
    window.__init3DLogo = function() {
        if (typeof THREE !== 'undefined') initAbout3DLogo();
    };
    window.__initWebGLLens = function() {
        if (typeof THREE !== 'undefined') initWebGLImageLensEffect();
    };

    // Initialize immediately if THREE is already loaded (e.g. non-lazy path)
    if (typeof THREE !== 'undefined') {
        initAbout3DLogo();
        initWebGLImageLensEffect();
    }
});
