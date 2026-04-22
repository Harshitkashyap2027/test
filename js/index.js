/**
 * ============================================================================
 * lvlBase - Homepage Interaction & Animation Controller
 * ============================================================================
 * Manages Intersection Observers for scroll animations, Trust Bar counters,
 * Hero 3D Parallax, and AI Lab typing simulations.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /**
     * 1. High-Performance Scroll Animations (Intersection Observer)
     */
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if (!('IntersectionObserver' in window)) {
            // Fallback for extremely old browsers
            animatedElements.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const animationType = el.getAttribute('data-animate');
                    
                    // Apply explicit CSS logic based on animation type
                    el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
                    
                    if (animationType === 'fade-up') {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    } else if (animationType === 'fade-left') {
                        el.style.opacity = '1';
                        el.style.transform = 'translateX(0)';
                    }

                    // Unobserve after animating to save memory
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        // Pre-set styles before observing
        animatedElements.forEach(el => {
            const animationType = el.getAttribute('data-animate');
            el.style.opacity = '0';
            
            if (animationType === 'fade-up') {
                el.style.transform = 'translateY(40px)';
            } else if (animationType === 'fade-left') {
                el.style.transform = 'translateX(40px)';
            }
            
            scrollObserver.observe(el);
        });
    };

    /**
     * 2. Hero Section 3D Mouse Parallax
     */
    const initHeroParallax = () => {
        const heroSection = document.querySelector('.hero-section');
        const dashboardMockup = document.querySelector('.main-dashboard');
        
        if (!heroSection || !dashboardMockup || window.innerWidth < 1024) return;

        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            
            // Adjust the 3D rotation dynamically based on cursor position
            // Base rotation is rotateY(-15deg) rotateX(10deg)
            dashboardMockup.style.transform = `rotateY(${-15 + xAxis}deg) rotateX(${10 + yAxis}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            // Reset to default on mouse leave
            dashboardMockup.style.transform = `rotateY(-15deg) rotateX(10deg)`;
        });
    };

    /**
     * 3. Trust Bar Animated Counters
     */
    const initCounters = () => {
        const trustSection = document.querySelector('.trust-section');
        const counters = document.querySelectorAll('.metric-number');
        
        if (!trustSection || counters.length === 0) return;

        let hasAnimated = false;

        const animateValue = (obj, start, end, duration, format) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                // Ease out quad formula
                const easeProgress = progress * (2 - progress);
                const currentVal = Math.floor(easeProgress * (end - start) + start);
                
                if (format === 'k') {
                    obj.innerHTML = currentVal + 'K+';
                } else if (format === 'plus') {
                    obj.innerHTML = currentVal + '+';
                } else if (format === 'percent') {
                    // For percentages, we handle decimals
                    const decimalVal = (easeProgress * (end - start) + start).toFixed(1);
                    obj.innerHTML = decimalVal + '%';
                } else {
                    obj.innerHTML = currentVal; // Fallback for strings like "Zero"
                }

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            if (entries.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                
                counters.forEach((counter, index) => {
                    const text = counter.innerText;
                    
                    if (text.includes('10K+')) {
                        animateValue(counter, 0, 10, 2000, 'k');
                    } else if (text.includes('500+')) {
                        animateValue(counter, 0, 500, 2500, 'plus');
                    } else if (text.includes('99.9%')) {
                        animateValue(counter, 90.0, 99.9, 3000, 'percent');
                    }
                    // The "Zero" text doesn't need animation, it stays static
                });
            }
        }, { threshold: 0.5 });

        counterObserver.observe(trustSection);
    };

    /**
     * 4. AI Lab Terminal Simulation (Section 6)
     */
    const initAITerminal = () => {
        const terminalSection = document.querySelector('.ai-power-section');
        const terminalLines = document.querySelectorAll('.code-lines code');
        
        if (!terminalSection || terminalLines.length === 0) return;

        let hasExecuted = false;

        const executeTerminal = () => {
            // Hide all lines initially
            terminalLines.forEach(line => {
                line.style.opacity = '0';
                line.style.transform = 'translateY(10px)';
                line.style.transition = 'all 0.3s ease';
            });

            // Reveal them sequentially
            terminalLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateY(0)';
                    
                    // Add syntax highlight glow effect momentarily
                    line.style.textShadow = '0 0 8px rgba(255,255,255,0.4)';
                    setTimeout(() => {
                        line.style.textShadow = 'none';
                    }, 500);

                }, index * 800); // 800ms delay between each line
            });
        };

        const terminalObserver = new IntersectionObserver((entries) => {
            if (entries.isIntersecting && !hasExecuted) {
                hasExecuted = true;
                executeTerminal();
            }
        }, { threshold: 0.4 });

        terminalObserver.observe(terminalSection);
    };

    /**
     * 5. Sparkline Graph Generator Logic (Section 1)
     */
    const initSparkline = () => {
        const sparklinePath = document.querySelector('.sparkline path');
        if (!sparklinePath) return;

        // Animate the stroke dash array to create a drawing effect
        const length = sparklinePath.getTotalLength();
        sparklinePath.style.strokeDasharray = length;
        sparklinePath.style.strokeDashoffset = length;

        setTimeout(() => {
            sparklinePath.style.transition = 'stroke-dashoffset 2.5s ease-in-out';
            sparklinePath.style.strokeDashoffset = '0';
        }, 500); // Trigger shortly after load
    };

    // Execute Homepage Modules
    lvlBaseCore.log('info', 'Initializing Homepage Animations...');
    initScrollAnimations();
    initHeroParallax();
    initCounters();
    initAITerminal();
    initSparkline();
});