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

    // 6. Scroll Reveal Animation (Apple Style)
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', reveal);
    reveal(); // Trigger on load
});
