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