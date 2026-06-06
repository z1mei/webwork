document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Light, Dark, Auto)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const htmlEl = document.documentElement;
    
    // Load saved theme or default to 'auto'
    let currentThemeMode = localStorage.getItem('theme') || 'auto';

    function applyTheme(mode) {
        if (mode === 'dark') {
            htmlEl.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fa-solid fa-moon';
            themeToggleBtn.setAttribute('title', '深色模式 (点击切换为自动模式)');
        } else if (mode === 'light') {
            htmlEl.removeAttribute('data-theme');
            themeIcon.className = 'fa-solid fa-sun';
            themeToggleBtn.setAttribute('title', '浅色模式 (点击切换为深色模式)');
        } else { // auto
            const hour = new Date().getHours();
            // Daytime is 6:00 to 18:00
            if (hour >= 6 && hour < 18) {
                htmlEl.removeAttribute('data-theme');
            } else {
                htmlEl.setAttribute('data-theme', 'dark');
            }
            themeIcon.className = 'fa-solid fa-circle-half-stroke';
            themeToggleBtn.setAttribute('title', '自动模式 (点击切换为浅色模式)');
        }
    }

    applyTheme(currentThemeMode);

    themeToggleBtn.addEventListener('click', () => {
        if (currentThemeMode === 'auto') {
            currentThemeMode = 'light';
        } else if (currentThemeMode === 'light') {
            currentThemeMode = 'dark';
        } else {
            currentThemeMode = 'auto';
        }
        localStorage.setItem('theme', currentThemeMode);
        applyTheme(currentThemeMode);
    });

    // 2. Typewriter Effect
    const textsToType = ["We are T-Rex Vanguard.", "我们是暴龙护卫队。"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    const typewriterEl = document.getElementById('typewriter');
    let textIndex = 0;
    let charIndex = 0;

    function typeText() {
        if (charIndex < textsToType[textIndex].length) {
            typewriterEl.textContent += textsToType[textIndex].charAt(charIndex);
            charIndex++;
            const currentDelay = textIndex === 0 ? 60 : 180;
            setTimeout(typeText, currentDelay);
        } else {
            setTimeout(eraseText, newTextDelay);
        }
    }

    function eraseText() {
        if (charIndex > 0) {
            typewriterEl.textContent = textsToType[textIndex].substring(0, charIndex - 1);
            charIndex--;
            const currentEraseDelay = textIndex === 0 ? 30 : 80;
            setTimeout(eraseText, currentEraseDelay);
        } else {
            textIndex++;
            if (textIndex >= textsToType.length) textIndex = 0;
            setTimeout(typeText, 500);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeText, 500);

    // 3. Modals Logic
    const viewDetailsBtns = document.querySelectorAll('.view-details');
    const closeBtns = document.querySelectorAll('.close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Trigger progress bar animations
            setTimeout(() => {
                const progressBars = modal.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 50);
                });
            }, 300);
        }
    }

    function closeModal() {
        modalOverlays.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = btn.getAttribute('data-target');
            openModal(targetId);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal when clicking outside
    modalOverlays.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });



    // 5. Easter Egg (T-Rex Roar)
    const footerLogo = document.getElementById('footer-logo');
    const trexContainer = document.getElementById('trex-easter-egg');
    let clickCount = 0;
    let clickTimer = null;

    footerLogo.addEventListener('click', () => {
        clickCount++;
        
        // Reset count if pauses too long between clicks (2 seconds)
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 2000);

        if (clickCount >= 5) {
            triggerEasterEgg();
            clickCount = 0;
        }
    });

    function triggerEasterEgg() {
        trexContainer.classList.add('active');
        
        // Try to play a roar sound (might be blocked by browser autoplay policy if no recent interaction, but click should allow it)
        try {
            // using a free online sound bite for demo
            const roar = new Audio('https://assets.mixkit.co/active_storage/sfx/87/87-preview.mp3');
            roar.volume = 0.5;
            roar.play();
        } catch (e) {
            console.log("Audio play failed: ", e);
        }

        // Hide after 3 seconds
        setTimeout(() => {
            trexContainer.classList.remove('active');
        }, 3000);
    } // Missing brace added here

    // Force page to top on reload and clear hash to prevent auto-scrolling down
    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
    }
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 6. Apple-style Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1, // Trigger when 10% is visible
        rootMargin: "0px 0px -100px 0px" // Require element to be 100px inside viewport before triggering
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Only remove the 'active' class if the element leaves the viewport from the BOTTOM.
                // This prevents animations from replaying when scrolling back UP the page.
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('active');
                }
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 6. Starfield + Meteor Shower Effect
    const canvas = document.getElementById('meteor-canvas');
    const ctx = canvas.getContext('2d');
    let meteors = [];
    let particles = [];
    let stars = [];
    const STAR_COUNT = 180;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // --- Static twinkling background stars ---
    function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: random(0, canvas.width),
                y: random(0, canvas.height),
                r: random(0.4, 2.2),
                twinkleSpeed: random(0.003, 0.015),
                twinkleOffset: random(0, Math.PI * 2),
                baseAlpha: random(0.2, 0.8),
            });
        }
    }

    function drawStars() {
        for (const s of stars) {
            const alpha = s.baseAlpha + Math.sin(Date.now() * s.twinkleSpeed + s.twinkleOffset) * 0.3;
            const a = Math.max(0.1, Math.min(1, alpha));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
            ctx.fill();
            // Larger stars get a subtle glow
            if (s.r > 1.3) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 250, 240, ${a * 0.15})`;
                ctx.fill();
            }
        }
    }

    // --- Meteor spawning ---
    function spawnMeteor(x, y, angle, speed, size, trailLen) {
        const hue = random(35, 55); // warm white → golden, like real meteors
        const sat = random(5, 30);  // low saturation = mostly white
        meteors.push({
            x: x !== undefined ? x : random(canvas.width * 0.05, canvas.width * 0.95),
            y: y !== undefined ? y : random(-80, canvas.height * 0.15),
            vx: Math.cos(angle || random(Math.PI * 0.62, Math.PI * 0.88)) * (speed || random(3, 6)),
            vy: Math.sin(angle || random(Math.PI * 0.62, Math.PI * 0.88)) * (speed || random(3, 6)),
            size: size || random(1.2, 3.5),
            trail: trailLen || random(100, 280),
            hue: hue,
            sat: sat,
            life: 1,
            decay: random(0.003, 0.007),
        });
    }

    function spawnMeteorShower() {
        const count = Math.floor(random(3, 7));
        const baseAngle = random(Math.PI * 0.65, Math.PI * 0.85);
        const baseSpeed = random(3.5, 5.5);
        const originX = random(canvas.width * 0.1, canvas.width * 0.9);
        const originY = random(-40, canvas.height * 0.1);
        for (let i = 0; i < count; i++) {
            const angle = baseAngle + random(-0.12, 0.12);
            const speed = baseSpeed + random(-1, 1);
            const offsetX = random(-60, 60);
            const offsetY = random(-30, 30);
            spawnMeteor(originX + offsetX, originY + offsetY, angle, speed, random(1, 2.8), random(80, 220));
        }
    }

    function spawnParticles(x, y, hue, count) {
        for (let i = 0; i < (count || 5); i++) {
            particles.push({
                x: x,
                y: y,
                vx: random(-1.2, 1.2),
                vy: random(-1.2, 1.2),
                life: 1,
                decay: random(0.015, 0.05),
                size: random(0.6, 1.8),
                hue: hue,
            });
        }
    }

    // --- Drawing ---
    function drawMeteor(m) {
        const headX = m.x;
        const headY = m.y;
        const dirX = m.vx / Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        const dirY = m.vy / Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        const tailX = headX - dirX * m.trail;
        const tailY = headY - dirY * m.trail;

        const alpha = m.life;

        // Outer glow trail (wider, softer)
        const gradOuter = ctx.createLinearGradient(headX, headY, tailX, tailY);
        gradOuter.addColorStop(0, `hsla(${m.hue}, ${m.sat}%, 95%, ${alpha})`);
        gradOuter.addColorStop(0.3, `hsla(${m.hue}, ${m.sat}%, 80%, ${alpha * 0.5})`);
        gradOuter.addColorStop(1, `hsla(${m.hue}, ${m.sat}%, 40%, 0)`);

        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradOuter;
        ctx.lineWidth = m.size * 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Inner core trail (bright, sharp)
        const gradInner = ctx.createLinearGradient(headX, headY, tailX, tailY);
        gradInner.addColorStop(0, `hsla(45, 10%, 100%, ${alpha})`);
        gradInner.addColorStop(0.4, `hsla(${m.hue}, ${m.sat}%, 90%, ${alpha * 0.6})`);
        gradInner.addColorStop(1, `hsla(${m.hue}, ${m.sat}%, 50%, 0)`);

        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradInner;
        ctx.lineWidth = m.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Head: bright white core
        ctx.beginPath();
        ctx.arc(headX, headY, m.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Head: warm halo
        const haloGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, m.size * 3.5);
        haloGrad.addColorStop(0, `rgba(255, 250, 235, ${alpha * 0.9})`);
        haloGrad.addColorStop(0.3, `rgba(255, 220, 150, ${alpha * 0.4})`);
        haloGrad.addColorStop(1, `rgba(255, 180, 80, 0)`);
        ctx.beginPath();
        ctx.arc(headX, headY, m.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 20%, 90%, ${p.life})`;
        ctx.fill();
    }

    // --- Animation loop ---
    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw starfield background
        drawStars();

        // Update and draw meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            m.x += m.vx;
            m.y += m.vy;
            m.life -= m.decay;

            // Spawn trail particles along the tail
            if (Math.random() < 0.6) {
                spawnParticles(m.x, m.y, m.hue, 4);
            }

            if (m.life <= 0 || m.x < -300 || m.y > canvas.height + 300) {
                meteors.splice(i, 1);
            } else {
                drawMeteor(m);
            }
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
            } else {
                drawParticle(p);
            }
        }

        // Special asteroid event (drawn on top of regular meteors)
        if (specialEvent) {
            updateSpecialEvent(timestamp);
        }

        requestAnimationFrame(animate);
    }

    // --- Scheduler: frequent solo meteors + occasional showers ---
    let lastShower = 0;
    function scheduleMeteor() {
        const delay = random(400, 1800);
        setTimeout(() => {
            const now = Date.now();
            // Every ~6-10 seconds, a meteor shower
            if (now - lastShower > random(6000, 10000)) {
                spawnMeteorShower();
                lastShower = now;
            } else {
                spawnMeteor();
            }
            scheduleMeteor();
        }, delay);
    }

    // Kickstart: spawn several immediately for instant visual impact
    for (let i = 0; i < 3; i++) {
        spawnMeteor();
    }
    spawnMeteorShower();
    lastShower = Date.now();
    scheduleMeteor();

    requestAnimationFrame(animate);

    // 7. Special Asteroid Event (every ~60s)
    const trexEl = document.getElementById('trex-defender');
    let specialEvent = null;

    const ASTEROID_EVENT = {
        INTERVAL: 60000,        // every 60 seconds
        SCALE_START: 5.5,       // initial asteroid scale
        SCALE_END: 1.2,         // final scale before shatter
        TARGET_X: 120,          // where asteroid aims (T-Rex position)
        TARGET_Y_OFFSET: -180,  // above T-Rex
    };

    function createSpecialAsteroid() {
        const cx = canvas.width * 0.85;
        const cy = -120;
        const tx = ASTEROID_EVENT.TARGET_X;
        const ty = canvas.height + ASTEROID_EVENT.TARGET_Y_OFFSET;
        const dist = Math.sqrt((tx - cx) ** 2 + (ty - cy) ** 2);
        const duration = 4200; // ms for the flight
        const speed = dist / duration; // px/ms

        specialEvent = {
            phase: 'flying',       // flying | defending | shattering | done
            x: cx,
            y: cy,
            tx: tx,
            ty: ty,
            speed: speed,
            scale: ASTEROID_EVENT.SCALE_START,
            startTime: performance.now(),
            flightDuration: duration,
            // Sub-objects for later phases
            shockwaveRadius: 0,
            shockwaveMax: 180,
            fragments: [],
            figures: [],           // two defending figures
            figureAlpha: 0,
            trexShown: false,
            defenseStart: 0,
            shatterTime: 0,
        };
    }

    function drawAsteroid(x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // Main body — irregular rocky shape using overlapping circles
        const bodyGrad = ctx.createRadialGradient(-3, -2, 2, 0, 0, 18);
        bodyGrad.addColorStop(0, '#8a8a7a');
        bodyGrad.addColorStop(0.4, '#5c5c4f');
        bodyGrad.addColorStop(0.75, '#3d3d33');
        bodyGrad.addColorStop(1, '#1a1a14');

        ctx.beginPath();
        // Irregular rocky silhouette
        ctx.moveTo(-8, -20);
        ctx.lineTo(5, -19);
        ctx.lineTo(14, -12);
        ctx.lineTo(19, -4);
        ctx.lineTo(17, 7);
        ctx.lineTo(10, 16);
        ctx.lineTo(-3, 20);
        ctx.lineTo(-14, 13);
        ctx.lineTo(-20, 2);
        ctx.lineTo(-19, -8);
        ctx.lineTo(-14, -16);
        ctx.closePath();
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // Edge highlight
        ctx.strokeStyle = 'rgba(180, 180, 160, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Craters
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath(); ctx.ellipse(-5, -10, 4, 3, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(8, 5, 5, 3.5, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-10, 8, 3, 2.5, 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(2, -3, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();

        // Hot / glowing cracks (like it's entering atmosphere)
        ctx.strokeStyle = 'rgba(255, 140, 30, 0.5)';
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(-6, -14); ctx.lineTo(-3, -5); ctx.lineTo(-8, 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(12, -8); ctx.lineTo(8, 2); ctx.lineTo(11, 10); ctx.stroke();

        ctx.restore();
    }

    function drawShockwave(x, y, radius, alpha) {
        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 200, 50, ${alpha * 0.8})`;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 220, ${alpha * 0.5})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glow fill
        const glowGrad = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius);
        glowGrad.addColorStop(0, `rgba(255, 255, 200, ${alpha * 0.25})`);
        glowGrad.addColorStop(1, 'rgba(255, 150, 30, 0)');
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
    }

    function drawFigure(x, y, alpha, facing) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);

        // Aura glow
        const auraGrad = ctx.createRadialGradient(0, -3, 2, 0, -3, 22);
        auraGrad.addColorStop(0, 'rgba(100, 200, 255, 0.6)');
        auraGrad.addColorStop(1, 'rgba(100, 200, 255, 0)');
        ctx.beginPath();
        ctx.arc(0, -3, 22, 0, Math.PI * 2);
        ctx.fillStyle = auraGrad;
        ctx.fill();

        const dir = facing || 1;
        // Body
        ctx.fillStyle = '#c8e6ff';
        ctx.strokeStyle = '#7bb3db';
        ctx.lineWidth = 1.5;

        // Head
        ctx.beginPath(); ctx.arc(0, -18, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Torso
        ctx.beginPath();
        ctx.moveTo(0, -13);
        ctx.lineTo(dir * 3, -3);
        ctx.lineTo(0, 5);
        ctx.lineTo(dir * -3, -3);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Arms outstretched (casting shockwave)
        ctx.beginPath();
        ctx.moveTo(dir * 3, -3);
        ctx.lineTo(dir * 16, -12);
        ctx.moveTo(dir * -3, -3);
        ctx.lineTo(dir * -14, -14);
        ctx.strokeStyle = '#c8e6ff';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        // Legs
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(-3, 14);
        ctx.moveTo(0, 5);
        ctx.lineTo(3, 14);
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    // Helper: draw and update the special asteroid event
    function updateSpecialEvent(now) {
        const se = specialEvent;

        if (se.phase === 'flying') {
            const elapsed = now - se.startTime;
            const progress = Math.min(elapsed / se.flightDuration, 1);

            // Move asteroid from start to target
            se.x = canvas.width * 0.85 + (se.tx - canvas.width * 0.85) * progress;
            se.y = -120 + (se.ty - (-120)) * progress;
            // Shrink as it approaches
            se.scale = ASTEROID_EVENT.SCALE_START + (ASTEROID_EVENT.SCALE_END - ASTEROID_EVENT.SCALE_START) * progress;

            // Show T-Rex when asteroid is ~40% through
            if (progress > 0.4 && !se.trexShown) {
                se.trexShown = true;
                trexEl.classList.add('visible');
            }

            // Enter defending phase when asteroid is close to target (~85%)
            if (progress > 0.85) {
                se.phase = 'defending';
                se.defenseStart = now;
                se.figures = [
                    { x: se.tx + 50, y: se.ty + 90, alpha: 0, facing: 1 },
                    { x: se.tx - 30, y: se.ty + 80, alpha: 0, facing: -1 },
                ];
                trexEl.classList.add('roaring');
                setTimeout(() => trexEl.classList.remove('roaring'), 500);
            }

            drawAsteroid(se.x, se.y, se.scale);

        } else if (se.phase === 'defending') {
            const dElapsed = now - se.defenseStart;
            // Asteroid hovers near target, small movements
            const hoverX = se.tx + Math.sin(dElapsed * 0.003) * 8;
            const hoverY = se.ty + Math.cos(dElapsed * 0.004) * 5;
            se.x = hoverX;
            se.y = hoverY;
            se.scale = ASTEROID_EVENT.SCALE_END + Math.sin(dElapsed * 0.005) * 0.1;

            // Fade in figures
            const figAlpha = Math.min(dElapsed / 600, 1);
            se.figures[0].alpha = figAlpha;
            se.figures[1].alpha = figAlpha;

            drawAsteroid(se.x, se.y, se.scale);

            // Draw figures
            for (const f of se.figures) {
                drawFigure(f.x, f.y, f.alpha, f.facing);
            }

            // After figures appear, trigger shatter
            if (dElapsed > 1200) {
                se.phase = 'shattering';
                se.shatterTime = now;
                se.shockwaveRadius = 0;

                // Generate fragments (asteroid chunks)
                const cx = se.x, cy = se.y;
                for (let i = 0; i < 28; i++) {
                    const angle = random(0, Math.PI * 2);
                    const spd = random(2, 10);
                    se.fragments.push({
                        x: cx,
                        y: cy,
                        vx: Math.cos(angle) * spd,
                        vy: Math.sin(angle) * spd,
                        size: random(3, 14),
                        life: 1,
                        decay: random(0.006, 0.018),
                        hue: random(25, 45),
                    });
                }
                // Screen shake flash particles
                for (let i = 0; i < 40; i++) {
                    particles.push({
                        x: cx, y: cy,
                        vx: random(-4, 4), vy: random(-4, 4),
                        life: 1, decay: random(0.03, 0.08),
                        size: random(1.5, 4),
                        hue: random(35, 55),
                    });
                }
            }

        } else if (se.phase === 'shattering') {
            const sElapsed = now - se.shatterTime;

            // Expanding shockwave
            se.shockwaveRadius = Math.min(sElapsed * 0.25, se.shockwaveMax);
            const swAlpha = Math.max(0, 1 - sElapsed / 1500);

            if (swAlpha > 0) {
                drawShockwave(se.tx, se.ty - 20, se.shockwaveRadius, swAlpha);
            }

            // Draw figures still visible
            for (const f of se.figures) {
                const fade = Math.max(0, 1 - sElapsed / 1000);
                drawFigure(f.x, f.y, fade, f.facing);
            }

            // Update and draw fragments
            for (let i = se.fragments.length - 1; i >= 0; i--) {
                const f = se.fragments[i];
                f.x += f.vx;
                f.y += f.vy;
                f.life -= f.decay;
                if (f.life <= 0) {
                    se.fragments.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.globalAlpha = f.life;
                    // Small rocky fragment
                    ctx.fillStyle = `hsl(${f.hue}, 15%, ${random(25, 45)}%)`;
                    ctx.beginPath();
                    ctx.moveTo(f.x - f.size, f.y - f.size * 0.6);
                    ctx.lineTo(f.x + f.size * 0.3, f.y - f.size);
                    ctx.lineTo(f.x + f.size, f.y + f.size * 0.2);
                    ctx.lineTo(f.x + f.size * 0.4, f.y + f.size);
                    ctx.lineTo(f.x - f.size * 0.5, f.y + f.size * 0.7);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();

                    // Trail spark
                    if (Math.random() < 0.3 && f.life > 0.3) {
                        particles.push({
                            x: f.x, y: f.y,
                            vx: random(-0.5, 0.5), vy: random(-0.5, 0.5),
                            life: 0.6, decay: random(0.04, 0.1),
                            size: random(0.8, 2),
                            hue: f.hue,
                        });
                    }
                }
            }

            // Fade out T-Rex after shatter
            if (sElapsed > 2000 && trexEl.classList.contains('visible')) {
                trexEl.classList.remove('visible');
            }

            // Event fully done
            if (sElapsed > 3500 && se.fragments.length === 0) {
                specialEvent = null;
            }
        }
    }

    // --- Special asteroid scheduler ---
    function scheduleSpecialAsteroid() {
        // First asteroid after 60 seconds
        const initialDelay = 60000;
        setTimeout(() => {
            if (!specialEvent) {
                createSpecialAsteroid();
            }
            // Then every 60 seconds after
            setInterval(() => {
                if (!specialEvent) {
                    createSpecialAsteroid();
                }
            }, ASTEROID_EVENT.INTERVAL);
        }, initialDelay);
    }
    scheduleSpecialAsteroid();
});
