/**
 * ============================================================================
 * lvlBase - Admin ERP Services Controller
 * ============================================================================
 * Handles the multi-step user provisioning modal, simulated Firebase 
 * telemetry generation in the terminal, and charting animations.
 */

const AdminOps = (function() {
    'use strict';

    // DOM Elements
    const addUserModal = document.getElementById('add-user-modal');
    const termBody = document.getElementById('admin-terminal');
    const nextStepBtn = document.getElementById('next-step-btn');

    /**
     * 1. Multi-Step Modal Logic (Mocked for Demo)
     */
    const openAddUserModal = () => {
        document.body.style.overflow = 'hidden';
        addUserModal.classList.add('open');
    };

    const closeAddUserModal = () => {
        addUserModal.classList.remove('open');
        setTimeout(() => { 
            document.body.style.overflow = ''; 
            // Reset to Step 1 visually if needed
            nextStepBtn.innerHTML = 'Continue to Details';
            nextStepBtn.classList.remove('ready');
        }, 300);
    };

    const simulateNextStep = () => {
        const originalHtml = nextStepBtn.innerHTML;
        nextStepBtn.innerHTML = `<span class="pulse-dot" style="background:#000;"></span> Validating`;
        nextStepBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            nextStepBtn.innerHTML = `Provision User <svg width="16" height="16" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            nextStepBtn.style.background = 'var(--accent-primary)';
            nextStepBtn.style.color = '#000';
            nextStepBtn.classList.add('ready');

            // Fast forward simulation to complete
            setTimeout(() => {
                if (lvlBaseCore) lvlBaseCore.log('info', 'New user successfully provisioned in Firebase Auth & Firestore.');
                closeAddUserModal();
            }, 1500);

        }, 800);
    };

    /**
     * 2. Firebase Telemetry Terminal Simulator
     */
    const startTerminalFirehose = () => {
        if (!termBody) return;

        const logMessages = [
            "> Re-indexing user shards... <span style='color: #00FF88;'>[DONE]</span>",
            "> Cleaning up orphaned WebSockets... <span style='color: #00FF88;'>[CLEARED 14]</span>",
            "> <span style='color: var(--accent-yellow);'>[WARN] API Rate Limit approaching for Azure Guild node.</span>",
            "> Syncing offline Stripe payments... <span style='color: #00FF88;'>[SYNCED]</span>",
            "> Backing up Firestore node cluster-A..."
        ];

        setInterval(() => {
            if (Math.random() > 0.6) { // 40% chance to log every tick
                const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
                const line = document.createElement('div');
                line.className = 'term-line';
                line.innerHTML = msg;
                termBody.appendChild(line);
                
                termBody.scrollTo({ top: termBody.scrollHeight, behavior: 'smooth' });

                // Keep memory clean
                if (termBody.children.length > 20) {
                    termBody.removeChild(termBody.firstChild);
                }
            }
        }, 3000);
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

        // Trigger CSS Bar Chart animation
        setTimeout(() => {
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                const targetHeight = bar.style.height;
                bar.style.height = '0%';
                setTimeout(() => { bar.style.height = targetHeight; }, 100);
            });
        }, 500);
    };

    // Public API
    return {
        init: () => {
            initEntranceAnimations();
            startTerminalFirehose();
            if (lvlBaseCore) lvlBaseCore.log('info', 'Admin ERP Services & Telemetry Active.');
        },
        openAddUserModal,
        closeAddUserModal,
        simulateNextStep
    };

})();

// Boot on Load
document.addEventListener('DOMContentLoaded', AdminOps.init);