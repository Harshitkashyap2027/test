/**
 * ============================================================================
 * lvlBase - UI Components Engine
 * ============================================================================
 * Controls the interactive elements: Navigation, Accordions, Sliders, and 
 * Mobile Menus. Built purely in Vanilla JS for maximum performance.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /**
     * 1. Navigation Scroll Effect (Glassmorphism transition)
     */
    const initNavigation = () => {
        const header = document.querySelector('.glass-nav');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.padding = '0 calc(var(--space-6) - 10px)';
                header.style.background = 'rgba(10, 10, 12, 0.85)';
                header.style.boxShadow = 'var(--shadow-md)';
            } else {
                header.style.padding = '0 var(--space-6)';
                header.style.background = 'rgba(10, 10, 12, 0.7)';
                header.style.boxShadow = 'var(--shadow-sm)';
            }
        }, { passive: true });
    };

    /**
     * 2. Mobile Menu Toggle Logic
     */
    const initMobileMenu = () => {
        const menuBtn = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');

        if (!menuBtn || !navLinks) return;

        let isMenuOpen = false;

        menuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // Change Icon to Close (X)
                menuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                `;
                // Expand Menu
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = 'var(--header-height)';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(10, 10, 12, 0.95)';
                navLinks.style.backdropFilter = 'var(--blur-heavy)';
                navLinks.style.padding = 'var(--space-6) 0';
                navLinks.style.borderBottom = 'var(--border-thin)';
                navLinks.style.gap = 'var(--space-5)';
                
                if (navActions) {
                    navActions.style.display = 'flex';
                    navActions.style.position = 'absolute';
                    navActions.style.top = 'calc(var(--header-height) + 250px)';
                    navActions.style.left = '50%';
                    navActions.style.transform = 'translateX(-50%)';
                }
            } else {
                // Change Icon Back to Hamburger
                menuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    </svg>
                `;
                // Hide Menu
                navLinks.style.display = 'none';
                if (navActions) navActions.style.display = 'none';
            }
        });

        // Close menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && isMenuOpen) {
                menuBtn.click();
                navLinks.style.display = '';
                if (navActions) navActions.style.display = '';
            }
        });
    };

    /**
     * 3. FAQ Accordion Logic
     */
    const initAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const button = item.querySelector('.faq-question');
            
            button.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other accordions for clean UI
                faqItems.forEach(el => {
                    el.classList.remove('active');
                    el.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
                    el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                // Toggle current accordion
                if (!isActive) {
                    item.classList.add('active');
                    item.querySelector('.faq-answer').setAttribute('aria-hidden', 'false');
                    button.setAttribute('aria-expanded', 'true');
                }
            });
        });
    };

    /**
     * 4. Horizontal Scroll (Product Showcase Drag-to-Scroll)
     */
    const initHorizontalScroll = () => {
        const slider = document.querySelector('.horizontal-scroll-container');
        if (!slider) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            slider.scrollLeft = scrollLeft - walk;
        });

        // Initialize cursor state
        slider.style.cursor = 'grab';
    };

    // Initialize all components
    initNavigation();
    initMobileMenu();
    initAccordion();
    initHorizontalScroll();
});
/* ==========================================================================
   3D Tilt Effect Engine — Mouse-tracking perspective for .bento-card elements
   ========================================================================== */
(function initTiltEffect() {
    'use strict';

    const TILT_MAX = 12;       // Max tilt degrees
    const TILT_SCALE = 1.04;   // Scale on hover
    const EASE = 0.12;         // Lerp easing factor (spring)

    function applyTilt(card) {
        let rafId = null;
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;
        let isHovered = false;

        function lerp(a, b, t) { return a + (b - a) * t; }

        function animate() {
            currentX = lerp(currentX, targetX, EASE * 4);
            currentY = lerp(currentY, targetY, EASE * 4);

            if (Math.abs(currentX - targetX) < 0.01 && Math.abs(currentY - targetY) < 0.01) {
                currentX = targetX;
                currentY = targetY;
            }

            card.style.transform = isHovered
                ? `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(${TILT_SCALE}) translateZ(20px)`
                : `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(1) translateZ(0)`;

            if (isHovered || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
                rafId = requestAnimationFrame(animate);
            }
        }

        function onMouseMove(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            targetY =  ((x - centerX) / centerX) * TILT_MAX;
            targetX = -((y - centerY) / centerY) * TILT_MAX;
            if (!rafId) rafId = requestAnimationFrame(animate);
        }

        function onMouseEnter() {
            isHovered = true;
            card.style.willChange = 'transform';
            card.style.transition = 'none';
            if (!rafId) rafId = requestAnimationFrame(animate);
        }

        function onMouseLeave() {
            isHovered = false;
            targetX = 0;
            targetY = 0;
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            if (!rafId) rafId = requestAnimationFrame(animate);
        }

        // Touch support
        function onTouchMove(e) {
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            targetY =  ((x - centerX) / centerX) * (TILT_MAX * 0.5);
            targetX = -((y - centerY) / centerY) * (TILT_MAX * 0.5);
            if (!rafId) rafId = requestAnimationFrame(animate);
        }

        function onTouchEnd() {
            isHovered = false;
            targetX = 0;
            targetY = 0;
            if (!rafId) rafId = requestAnimationFrame(animate);
        }

        card.addEventListener('mouseenter', onMouseEnter, { passive: true });
        card.addEventListener('mousemove', onMouseMove, { passive: true });
        card.addEventListener('mouseleave', onMouseLeave, { passive: true });
        card.addEventListener('touchmove', onTouchMove, { passive: true });
        card.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    function initCards() {
        const cards = document.querySelectorAll('.bento-card, .bento-card-3d, .glass-panel.interactive');
        cards.forEach(card => {
            if (!card.dataset.tiltInit) {
                card.dataset.tiltInit = 'true';
                card.style.transformStyle = 'preserve-3d';
                applyTilt(card);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCards);
    } else {
        initCards();
    }

    // Re-init on dynamic content (e.g. after tab switch)
    const observer = new MutationObserver(() => initCards());
    observer.observe(document.body, { childList: true, subtree: true });
}());
