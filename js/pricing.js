/**
 * ============================================================================
 * lvlBase - Pricing Controller
 * ============================================================================
 * Handles the animated Monthly/Annually billing toggle, updating numbers 
 * dynamically via CSS transitions, and FAQ accordion logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const toggleSwitch = document.getElementById('billing-toggle');
    const labelMonthly = document.getElementById('label-monthly');
    const labelYearly = document.getElementById('label-yearly');
    const priceAmounts = document.querySelectorAll('.amount');
    const billingTexts = document.querySelectorAll('.billing-text');
    
    // State
    let isYearly = true; // Default to yearly for the 20% discount showcase

    /**
     * 1. Animated Billing Toggle
     */
    const updatePricing = () => {
        // Toggle visual classes
        if (isYearly) {
            toggleSwitch.classList.add('yearly');
            labelYearly.classList.add('active');
            labelMonthly.classList.remove('active');
        } else {
            toggleSwitch.classList.remove('yearly');
            labelMonthly.classList.add('active');
            labelYearly.classList.remove('active');
        }

        // Animate numbers
        priceAmounts.forEach(amountEl => {
            // Only animate if it's not the "Custom" text
            if (amountEl.innerText === 'Custom') return;

            const targetValue = isYearly ? amountEl.getAttribute('data-yearly') : amountEl.getAttribute('data-monthly');
            const startValue = parseInt(amountEl.innerText);
            const endValue = parseInt(targetValue);
            
            // Skip animation if values are the same (e.g. Free plan = 0)
            if (startValue === endValue) return;

            // Fade out slightly
            amountEl.style.transition = 'opacity 0.2s';
            amountEl.style.opacity = '0.5';

            // Simple counter animation
            const duration = 300; // ms
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(startValue + (endValue - startValue) * easeOut);
                
                amountEl.innerText = currentVal;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    amountEl.innerText = endValue;
                    amountEl.style.opacity = '1';
                }
            };
            
            requestAnimationFrame(updateCounter);
        });

        // Update billing text (e.g., "/ mo, billed annually")
        billingTexts.forEach(textEl => {
            if (isYearly) {
                textEl.innerText = 'annually';
            } else {
                textEl.innerText = 'monthly';
            }
        });
    };

    // Toggle Click Event
    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', () => {
            isYearly = !isYearly;
            updatePricing();
        });
        
        // Also allow clicking labels to toggle
        labelMonthly.addEventListener('click', () => {
            if (isYearly) { isYearly = false; updatePricing(); }
        });
        
        labelYearly.addEventListener('click', () => {
            if (!isYearly) { isYearly = true; updatePricing(); }
        });

        // Initialize state on load
        updatePricing();
    }

    /**
     * 2. Re-initialize scroll animations (Entrance)
     */
    const initEntranceAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        const bentoCards = document.querySelectorAll('.pricing-tier');
        
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    if (el.hasAttribute('data-animate')) {
                        el.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }
                    
                    if (el.classList.contains('pricing-tier')) {
                        setTimeout(() => {
                            el.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                            el.style.opacity = '1';
                            // Maintain scale for popular tier
                            if (el.classList.contains('popular-tier') && window.innerWidth > 1024) {
                                el.style.transform = 'translateY(0) scale(1.03)';
                            } else {
                                el.style.transform = 'translateY(0) scale(1)';
                            }
                        }, Math.random() * 200);
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
            // Pre-scale down slightly for effect
            if (card.classList.contains('popular-tier') && window.innerWidth > 1024) {
                 card.style.transform = 'translateY(30px) scale(0.98)';
            } else {
                 card.style.transform = 'translateY(30px) scale(0.95)';
            }
            scrollObserver.observe(card);
        });
    };

    if (lvlBaseCore) lvlBaseCore.log('info', 'Pricing logic initialized.');
    initEntranceAnimations();
});