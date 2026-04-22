/**
 * ============================================================================
 * lvlBase - Deep Features Controller
 * ============================================================================
 * Handles ScrollSpy for the feature navigation, SVG chart animations, and
 * the security data-packet visualizers.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const sections = document.querySelectorAll('.feature-block');
    const navLinks = document.querySelectorAll('.subnav-link');
    const stickyNav = document.getElementById('feature-nav');

    /**
     * 1. ScrollSpy (Sticky Navigation Highlighting)
     * Reused and optimized from solutions.js
     */
    const initScrollSpy = () => {
        if (!stickyNav || navLinks.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', 
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeId = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.subnav-link[href="#${activeId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    };

    /**
     * 2. Smooth Scrolling for Subnav Links
     */
    const initSmoothScroll = () => {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, null, targetId);
                }
            });
        });
    };

    /**
     * 3. Hide/Show Sticky Nav on Scroll
     */
    const initNavHideOnScroll = () => {
        if (!stickyNav) return;
        
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll < 200) {
                stickyNav.style.transform = 'translateY(0)';
                return;
            }
            if (currentScroll > lastScrollTop) {
                stickyNav.style.transform = `translateY(-150%)`;
            } else {
                stickyNav.style.transform = 'translateY(0)';
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }, { passive: true });
    };

    /**
     * 4. Entrance Animations
     */
    const initEntranceAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        const bentoCards = document.querySelectorAll('.bento-card');
        
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    if (el.hasAttribute('data-animate')) {
                        el.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }
                    
                    if (el.classList.contains('bento-card')) {
                        setTimeout(() => {
                            el.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0) scale(1)';
                        }, Math.random() * 200);
                    }

                    // Trigger SVG chart drawing specifically when the analytics card appears
                    if (el.querySelector('.chart-line-anim')) {
                        const lines = el.querySelectorAll('path[fill="none"]');
                        lines.forEach(line => {
                            line.style.animation = 'none'; // reset
                            void line.offsetWidth; // trigger reflow
                            // The animation is handled in CSS, we just restart it
                            line.style.animation = null; 
                        });
                    }

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        // Pre-set states
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            scrollObserver.observe(el);
        });

        bentoCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.98)';
            scrollObserver.observe(card);
        });
    };

    /**
     * 5. Security Hash Simulator
     * Rapidly changes the hex values in the data packets to simulate encryption
     */
    const initSecuritySimulator = () => {
        const hashes = document.querySelectorAll('.crypto-hash');
        if (hashes.length === 0) return;

        const generateHash = () => {
            const chars = '0123456789ABCDEF';
            let str = '0x';
            for(let i=0; i<4; i++) str += chars[Math.floor(Math.random() * chars.length)];
            str += '...';
            for(let i=0; i<4; i++) str += chars[Math.floor(Math.random() * chars.length)];
            return str;
        };

        setInterval(() => {
            hashes.forEach(hash => {
                hash.innerText = generateHash();
            });
        }, 1500); // Change every 1.5s
    };

    // Initialize all modules
    if (lvlBaseCore) lvlBaseCore.log('info', 'Features Architecture UI Engine initialized.');
    initScrollSpy();
    initSmoothScroll();
    initNavHideOnScroll();
    initEntranceAnimations();
    initSecuritySimulator();
});