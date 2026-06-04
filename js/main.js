document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const htmlEl = document.documentElement;
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            htmlEl.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
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
            setTimeout(typeText, typingDelay);
        } else {
            setTimeout(eraseText, newTextDelay);
        }
    }

    function eraseText() {
        if (charIndex > 0) {
            typewriterEl.textContent = textsToType[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseText, erasingDelay);
        } else {
            textIndex++;
            if (textIndex >= textsToType.length) textIndex = 0;
            setTimeout(typeText, typingDelay + 500);
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

    // 4. Random Speaker Widget
    const randomBtn = document.getElementById('random-speaker-btn');
    const randomToast = document.getElementById('random-result');
    const members = ['曾英棋', '梁砾俊', '张鹏晖'];
    let isSpinning = false;

    randomBtn.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        
        // Add spin animation to icon
        const icon = randomBtn.querySelector('i');
        icon.classList.add('fa-spin');
        
        let count = 0;
        const maxCount = 15; // Flashing effect
        
        const interval = setInterval(() => {
            const randomMember = members[Math.floor(Math.random() * members.length)];
            randomToast.textContent = `🎲 抽取中: ${randomMember}`;
            randomToast.classList.add('show');
            count++;
            
            if (count >= maxCount) {
                clearInterval(interval);
                const finalMember = members[Math.floor(Math.random() * members.length)];
                randomToast.innerHTML = `🎉 恭喜 <strong>${finalMember}</strong> 成为天选发言人！`;
                icon.classList.remove('fa-spin');
                isSpinning = false;
                
                // Hide toast after 3 seconds
                setTimeout(() => {
                    randomToast.classList.remove('show');
                }, 3000);
            }
        }, 100);
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
    }
});
