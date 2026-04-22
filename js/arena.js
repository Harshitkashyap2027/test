/**
 * ============================================================================
 * lvlBase - Arena & Combat Controller
 * ============================================================================
 * Handles the Matchmaking Radar, UI transitions to the VS screen, and the 
 * countdown logic simulating socket connections.
 */

const ArenaEngine = (function() {
    'use strict';

    // --- DOM Elements ---
    const mmModal = document.getElementById('matchmaking-modal');
    const vsModal = document.getElementById('match-found-modal');
    const timerEl = document.getElementById('match-timer');
    const statusText = document.getElementById('match-status-text');
    const opponentContainer = document.getElementById('opponent-nodes-container');
    const countdownEl = document.getElementById('battle-countdown');
    
    // --- State ---
    let matchTimer = null;
    let secondsElapsed = 0;
    let isMatchmaking = false;

    /**
     * 1. Dynamic Arena Background Particles
     */
    const initParticles = () => {
        const container = document.getElementById('arena-particles');
        if (!container) return;

        for (let i = 0; i < 15; i++) {
            const p = document.createElement('div');
            p.className = 'arena-particle';
            
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.animationDuration = `${Math.random() * 5 + 3}s`;
            p.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(p);
        }
    };

    /**
     * 2. The Matchmaking Radar
     */
    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const spawnEnemyBlips = () => {
        if (!isMatchmaking) return;

        const blip = document.createElement('div');
        blip.className = 'enemy-blip';
        
        // Random position within radar circle (radius 150px)
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 130; 
        
        const x = 150 + radius * Math.cos(angle) - 6; // 150 is center, 6 is half blip width
        const y = 150 + radius * Math.sin(angle) - 6;

        blip.style.left = `${x}px`;
        blip.style.top = `${y}px`;

        opponentContainer.appendChild(blip);

        // Fade in
        setTimeout(() => blip.classList.add('visible'), 50);

        // Fade out and remove
        setTimeout(() => {
            blip.classList.remove('visible');
            setTimeout(() => blip.remove(), 500);
        }, 1500);

        // Spawn another randomly if still searching
        if (isMatchmaking) {
            setTimeout(spawnEnemyBlips, Math.random() * 800 + 400);
        }
    };

    const initiateMatchmaking = (mode) => {
        if (lvlBaseCore) lvlBaseCore.log('info', `Initiating matchmaking for mode: ${mode}`);
        
        isMatchmaking = true;
        secondsElapsed = 0;
        timerEl.innerText = "00:00";
        statusText.innerText = "Scanning for players in Rank B...";
        opponentContainer.innerHTML = '';
        
        document.body.style.overflow = 'hidden';
        mmModal.classList.add('open');

        // Timer Loop
        matchTimer = setInterval(() => {
            secondsElapsed++;
            timerEl.innerText = formatTime(secondsElapsed);
            
            // Dynamic text updates
            if (secondsElapsed === 2) statusText.innerText = "Expanding search criteria...";
            if (secondsElapsed === 4) statusText.innerText = "Opponent found. Establishing secure socket...";
            
            // Simulate Match Found after 5 seconds
            if (secondsElapsed >= 5) {
                matchFound();
            }
        }, 1000);

        // Start radar blips
        spawnEnemyBlips();
    };

    const cancelMatchmaking = () => {
        isMatchmaking = false;
        clearInterval(matchTimer);
        mmModal.classList.remove('open');
        document.body.style.overflow = '';
        if (lvlBaseCore) lvlBaseCore.log('warn', 'Matchmaking cancelled by user.');
    };

    /**
     * 3. VS Screen & Transition
     */
    const matchFound = () => {
        isMatchmaking = false;
        clearInterval(matchTimer);
        
        // Hide Radar, Show VS Screen
        mmModal.classList.remove('open');
        vsModal.classList.add('open');

        if (lvlBaseCore) lvlBaseCore.log('info', 'Match established. Initializing Combat UI.');

        // Trigger Countdown
        let count = 3;
        countdownEl.style.opacity = '1';
        countdownEl.innerText = count;

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.style.transform = 'translateX(-50%) scale(1.5)';
                countdownEl.innerText = count;
                setTimeout(() => { countdownEl.style.transform = 'translateX(-50%) scale(1)'; }, 100);
            } else {
                clearInterval(countdownInterval);
                countdownEl.innerText = "FIGHT!";
                countdownEl.style.color = "var(--accent-red)";
                countdownEl.style.textShadow = "0 0 50px var(--accent-red)";
                
                // Redirect to actual live battle UI (Placeholder for next phase)
                setTimeout(() => {
                    // window.location.href = 'live-battle.html';
                    if (lvlBaseCore) lvlBaseCore.log('info', 'Redirecting to live socket arena...');
                    
                    // Demo reset
                    vsModal.classList.remove('open');
                    countdownEl.style.opacity = '0';
                    document.body.style.overflow = '';
                    countdownEl.style.color = "";
                }, 1000);
            }
        }, 1000);
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

    // --- Public API ---
    return {
        init: () => {
            initParticles();
            initEntranceAnimations();
            if (lvlBaseCore) lvlBaseCore.log('info', 'Arena Combat Engine Loaded.');
        },
        initiateMatchmaking,
        cancelMatchmaking
    };

})();

// Init on Load
document.addEventListener('DOMContentLoaded', ArenaEngine.init);