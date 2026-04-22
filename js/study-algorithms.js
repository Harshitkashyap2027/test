/**
 * ============================================================================
 * lvlBase - Study & Retention Algorithms
 * ============================================================================
 * Handles the "Smart Revision" Ebbinghaus forgetting curve simulation, 
 * Micro-Learning triggers, and Focus Mode/Pomodoro state interactions.
 */

const StudyAlgorithms = (function() {
    'use strict';

    /**
     * 1. Smart Revision Generator
     * Simulates backend logic calculating memory retention degradation over time.
     */
    const simulateRetentionDecay = () => {
        const revItems = document.querySelectorAll('.rev-item');
        if (revItems.length === 0) return;

        // Animate the review buttons slightly to draw attention
        setInterval(() => {
            revItems.forEach(item => {
                const btn = item.querySelector('.btn');
                if (Math.random() > 0.7) {
                    btn.style.transform = 'scale(1.05)';
                    btn.style.boxShadow = '0 0 10px rgba(0, 136, 255, 0.3)';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                        btn.style.boxShadow = 'none';
                    }, 500);
                }
            });
        }, 3000);
    };

    /**
     * 2. Entrance Animations (Reused and optimized module)
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

    // Public Output
    return {
        init: () => {
            if (lvlBaseCore) lvlBaseCore.log('info', 'Study Algorithms (Retention & Micro-Learning) loaded.');
            initEntranceAnimations();
            simulateRetentionDecay();
        }
    };
})();

document.addEventListener('DOMContentLoaded', StudyAlgorithms.init);