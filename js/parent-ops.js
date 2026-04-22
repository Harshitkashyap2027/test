/**
 * ============================================================================
 * lvlBase - Parent Operations Controller
 * ============================================================================
 * Simulates Stripe payment handoffs, report generation, and data refreshes 
 * for the Guardian Console.
 */

const ParentOps = (function() {
    'use strict';

    // --- DOM Elements ---
    const payBtn = document.getElementById('pay-fees-btn');
    const downloadBtn = document.getElementById('download-report-btn');

    /**
     * 1. Stripe Payment Simulator
     */
    const simulatePayment = () => {
        if (!payBtn) return;
        
        const originalHtml = payBtn.innerHTML;
        
        // Loading State
        payBtn.innerHTML = `<span class="pulse-dot" style="background:#000;"></span> Redirecting to Stripe`;
        payBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            if (lvlBaseCore) lvlBaseCore.log('info', 'Secure payment handshake initiated. Waiting for clearance.');
            
            // Success Mock (In reality, this redirects to a Stripe Checkout URL)
            payBtn.innerHTML = `Payment Cleared <svg width="16" height="16" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            payBtn.style.background = '#00FFAA'; // Success green
            payBtn.style.color = '#000';
            payBtn.style.boxShadow = '0 0 20px rgba(0, 255, 170, 0.4)';
            
            // Update UI Invoice Status
            const badge = document.querySelector('.invoice-box .badge');
            if (badge) {
                badge.innerText = 'Paid';
                badge.style.background = 'rgba(0, 255, 170, 0.1)';
                badge.style.color = '#00FFAA';
                badge.style.borderColor = 'rgba(0, 255, 170, 0.3)';
            }

        }, 1500);
    };

    /**
     * 2. PDF Report Generator Simulation
     */
    const downloadReport = () => {
        if (!downloadBtn) return;

        const originalHtml = downloadBtn.innerHTML;
        
        // Processing State
        downloadBtn.innerHTML = `<span class="pulse-dot" style="background:var(--accent-primary);"></span> Compiling Data`;
        downloadBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            if (lvlBaseCore) lvlBaseCore.log('info', 'PDF Generated. Downloading Alex_Chen_Report.pdf');
            
            downloadBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Download Complete`;
            downloadBtn.style.borderColor = 'var(--accent-primary)';
            downloadBtn.style.color = 'var(--accent-primary)';

            // Reset
            setTimeout(() => {
                downloadBtn.innerHTML = originalHtml;
                downloadBtn.style.borderColor = '';
                downloadBtn.style.color = '';
                downloadBtn.style.pointerEvents = 'auto';
            }, 3000);

        }, 2000);
    };

    /**
     * 3. Entrance Animations
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

    // Public APIs
    return {
        init: () => {
            initEntranceAnimations();
            if (payBtn) payBtn.addEventListener('click', simulatePayment);
            if (downloadBtn) downloadBtn.addEventListener('click', downloadReport);
            if (lvlBaseCore) lvlBaseCore.log('info', 'Parent Operations Terminal Active.');
        }
    };

})();

// Boot on Load
document.addEventListener('DOMContentLoaded', ParentOps.init);