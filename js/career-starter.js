/**
 * ============================================================================
 * lvlBase - AI Career Starter Controller
 * ============================================================================
 * Handles the state machine for the Jarvis UI sequence (Idle -> Scanning -> 
 * Results). Generates mock analysis logs dynamically.
 */

const CareerEngine = (function() {
    'use strict';

    // --- DOM Elements ---
    const analyzeBtn = document.getElementById('run-analysis-btn');
    
    // States
    const stateIdle = document.getElementById('pred-idle');
    const stateProc = document.getElementById('pred-processing');
    const stateRes = document.getElementById('pred-result');
    
    // Process UI
    const statusText = document.getElementById('scan-status-text');
    const logsContainer = document.querySelector('.processing-logs');

    /**
     * 1. State Machine Controller
     */
    const switchState = (targetState) => {
        stateIdle.style.display = 'none';
        stateProc.style.display = 'none';
        stateRes.style.display = 'none';

        targetState.style.display = 'flex';
        
        // Re-trigger entrance animation
        targetState.style.animation = 'none';
        void targetState.offsetWidth;
        targetState.style.animation = 'fade-in-up 0.5s ease-out forwards';
    };

    /**
     * 2. Execution Sequence
     */
    const initiateScan = () => {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = `<span class="pulse-dot" style="background:#000;"></span> Connecting...`;
        
        switchState(stateProc);

        if (lvlBaseCore) lvlBaseCore.log('info', 'Jarvis Predictive Engine Activated. Analyzing Student DNA.');

        // Phase 1: Log Simulation
        const logSequence = [
            "> Evaluating logic & math syntax vectors... <span style='color:#00FF88;'>[92% FIT]</span>",
            "> Cross-referencing physics problem-solving speed... <span style='color:#00FF88;'>[OK]</span>",
            "> Analyzing 'Azure Mind' guild traits... <span style='color:var(--accent-primary);'>[STRATEGIC]</span>",
            "> Querying 50,000+ modern enterprise roles... <span class='blink'>_</span>"
        ];

        logsContainer.innerHTML = '';
        
        let step = 0;
        const logInterval = setInterval(() => {
            if (step < logSequence.length) {
                const div = document.createElement('div');
                div.className = 'log-item';
                div.innerHTML = logSequence[step];
                logsContainer.appendChild(div);
                
                // Status Text updates
                if(step === 1) statusText.innerText = "Analyzing Performance DNA...";
                if(step === 3) statusText.innerText = "Computing Career Matches...";

                step++;
            } else {
                clearInterval(logInterval);
                setTimeout(finalizeResults, 1500); // Small pause for dramatic effect
            }
        }, 800);
    };

    /**
     * 3. Final Result Rendering
     */
    const finalizeResults = () => {
        analyzeBtn.innerHTML = `Scan Complete <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        analyzeBtn.style.background = 'var(--accent-primary)';
        analyzeBtn.style.color = '#000';
        
        switchState(stateRes);
        
        if (lvlBaseCore) lvlBaseCore.log('info', 'Prediction Matrix complete. 3 highly optimized paths found.');
    };

    /**
     * 4. Entrance Animations
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

    // Public API
    return {
        init: () => {
            if (analyzeBtn) analyzeBtn.addEventListener('click', initiateScan);
            initEntranceAnimations();
        }
    };

})();

// Boot on Load
document.addEventListener('DOMContentLoaded', CareerEngine.init);