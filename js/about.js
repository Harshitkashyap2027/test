/**
 * ============================================================================
 * lvlBase - About & Brand Story Controller
 * ============================================================================
 * Handles the animated number counters for the stats section, the scroll-tied
 * fill effect for the vertical timeline, and general entrance animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const counters = document.querySelectorAll('.counter-val');
    const timelineContainer = document.querySelector('.story-timeline-container');
    const timelineLineFill = document.querySelector('.story-line-fill');
    const timelineNodes = document.querySelectorAll('.story-node');

    /**
     * 1. Animated Stat Counters
     */
    const initCounters = () => {
        if (counters.length === 0) return;

        let hasAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            if (entries.isIntersecting && !hasAnimated) {
                hasAnimated = true;

                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const startTime = performance.now();

                    const updateCounter = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease Out Expo
                        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        const currentVal = Math.floor(easeOut * target);
                        
                        counter.innerText = currentVal;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    requestAnimationFrame(updateCounter);
                });
            }
        }, { threshold: 0.5 });

        observer.observe(document.querySelector('.philosophy-section'));
    };

    /**
     * 2. Scroll-Linked Timeline Animation
     */
    const initTimeline = () => {
        if (!timelineContainer || !timelineLineFill || window.innerWidth <= 1024) return;

        window.addEventListener('scroll', () => {
            // Calculate scroll progress through the timeline container
            const containerRect = timelineContainer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Start filling when the top of the container hits the middle of the screen
            const startPoint = containerRect.top - (viewportHeight / 2);
            // End when the bottom of the container hits the middle of the screen
            const endPoint = containerRect.bottom - (viewportHeight / 2);
            
            const totalScrollDistance = endPoint - startPoint;
            let progress = (0 - startPoint) / totalScrollDistance;
            
            // Clamp between 0 and 1
            progress = Math.max(0, Math.min(1, progress));
            
            // Update line height
            timelineLineFill.style.height = `${progress * 100}%`;

            // Activate nodes based on progress
            timelineNodes.forEach((node, index) => {
                // Determine roughly where this node sits (e.g., 0%, 33%, 66%, 100%)
                const nodeTriggerPoint = index / (timelineNodes.length - 1) - 0.1; // slight offset
                
                if (progress >= nodeTriggerPoint) {
                    node.classList.add('active-node');
                } else {
                    node.classList.remove('active-node');
                }
            });
        }, { passive: true });
    };

    /**
     * 3. Standard Entrance Animations
     */
    const initEntranceAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                    el.style.opacity = '1';
                    
                    if (el.classList.contains('bento-card')) {
                        el.style.transform = 'translateY(0) scale(1)';
                    } else {
                        el.style.transform = 'translateY(0)';
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            if (el.classList.contains('bento-card')) {
                el.style.transform = 'translateY(30px) scale(0.98)';
            } else {
                el.style.transform = 'translateY(30px)';
            }
            scrollObserver.observe(el);
        });
    };

    if (lvlBaseCore) lvlBaseCore.log('info', 'About & Timeline Engine initialized.');
    initCounters();
    initTimeline();
    initEntranceAnimations();
});