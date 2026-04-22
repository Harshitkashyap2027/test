/**
 * ============================================================================
 * lvlBase - Core Gamification Engine (School Module)
 * ============================================================================
 * Handles the proprietary E-to-S rank progression, Power Score calculation, 
 * Loot Box drop rates, and the 7-Day "Power Mode" Secret Unlock.
 */

const GamificationEngine = (function() {
    'use strict';

    // --- Configuration & Constants ---
    const CONSTANTS = {
        MAX_LEVEL: 100,
        BASE_MULTIPLIER: 1.15,
        RANKS: {
            E: { min: 0, max: 5000, name: "Initiate", color: "#A0A0A5", multi: 1.0 },
            D: { min: 5000, max: 15000, name: "Apprentice", color: "#0088FF", multi: 1.1 },
            C: { min: 15000, max: 40000, name: "Adept", color: "#00FF88", multi: 1.25 },
            B: { min: 40000, max: 100000, name: "Elite", color: "#FF3366", multi: 1.5 },
            A: { min: 100000, max: 250000, name: "Master", color: "#B026FF", multi: 2.0 },
            S: { min: 250000, max: 1000000, name: "Supreme", color: "#FFD700", multi: 3.0 },
            SS: { min: 1000000, max: 5000000, name: "National", color: "#FF5F56", multi: 5.0 }
        },
        LOOT_RATES: {
            COMMON: 0.60,   // 60%
            RARE: 0.25,     // 25%
            EPIC: 0.12,     // 12%
            LEGENDARY: 0.03 // 3%
        }
    };

    // --- Player State Mock ---
    // In production, this syncs with Firebase Firestore
    let playerState = {
        uid: "std_49102",
        name: "Alex Chen",
        totalXP: 84500,
        streakDays: 14,
        metrics: {
            accuracy: 85, // out of 100
            speed: 65,    // out of 100
            consistency: 90 // out of 100
        },
        powerModeUnlocked: false
    };

    /**
     * 1. Rank & Level Calculation
     * Determines current Rank (E -> S) and Level (1 -> 100) based on Total XP.
     */
    const calculateRank = (xp) => {
        let currentRank = 'E';
        for (const [rank, data] of Object.entries(CONSTANTS.RANKS)) {
            if (xp >= data.min && xp < data.max) {
                currentRank = rank;
                break;
            }
            if (xp >= CONSTANTS.RANKS.SS.min) {
                currentRank = 'SS'; // Cap out
            }
        }
        return {
            id: currentRank,
            details: CONSTANTS.RANKS[currentRank]
        };
    };

    const calculateLevel = (xp) => {
        // Non-linear level scaling (RPG style)
        // Level 1 = 0 XP, Level 100 = 1,000,000 XP
        const level = Math.floor(Math.pow((xp / 100), 0.5)); 
        return Math.min(level, CONSTANTS.MAX_LEVEL);
    };

    /**
     * 2. Power Score Generator ⚡
     * This replaces traditional "Marks". It creates an overall strength metric.
     */
    const calculatePowerScore = (accuracy, speed, consistency) => {
        // Weighted algorithm prioritizing accuracy and consistency over pure speed
        const weightAcc = 0.50;
        const weightCons = 0.35;
        const weightSpd = 0.15;

        const baseScore = (accuracy * weightAcc) + (consistency * weightCons) + (speed * weightSpd);
        
        // Multiply by Rank Multiplier to give high rankers a visibly massive Power Score
        const rankData = calculateRank(playerState.totalXP);
        const finalPower = Math.round(baseScore * 100 * rankData.details.multi);
        
        return finalPower;
    };

    /**
     * 3. Quest XP Yield Algorithm
     * Evaluates how much XP a student gets for completing homework/quizzes.
     */
    const calculateQuestYield = (baseXP, difficultyLevel, completedOnTime) => {
        // Difficulty scales the XP (e.g., Diff 5 is much harder than Diff 1)
        let multiplier = Math.pow(CONSTANTS.BASE_MULTIPLIER, difficultyLevel);
        
        // Rank multiplier bonus
        const rankData = calculateRank(playerState.totalXP);
        multiplier *= rankData.details.multi;

        // Streak bonus
        if (playerState.streakDays >= 7) multiplier *= 1.2; // 20% Boost for 7+ day streaks
        if (playerState.streakDays >= 30) multiplier *= 1.5; // 50% Boost for 30+ day streaks

        // Penalty for late submission
        if (!completedOnTime) multiplier *= 0.5;

        return Math.round(baseXP * multiplier);
    };

    /**
     * 4. Secret Weapon: Power Mode Unlock 💣
     * If a student hits a 7-day streak, the UI injects a premium stylesheet 
     * and triggers advanced particle effects.
     */
    const checkPowerMode = () => {
        if (playerState.streakDays >= 7 && !playerState.powerModeUnlocked) {
            unlockPowerMode();
        } else if (playerState.streakDays < 7 && playerState.powerModeUnlocked) {
            revokePowerMode();
        }
    };

    const unlockPowerMode = () => {
        playerState.powerModeUnlocked = true;
        
        // 1. Inject Premium CSS Class to Body
        document.body.classList.add('power-mode-active');
        
        // 2. Trigger UI Celebration (Generic DOM manipulation so no external libs needed)
        const announcement = document.createElement('div');
        announcement.className = 'power-mode-alert glass-panel';
        announcement.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">🔥</div>
            <h2 style="color: var(--accent-primary); text-transform: uppercase; font-weight: 900; letter-spacing: 2px;">Power Mode Unlocked!</h2>
            <p style="color: var(--text-secondary);">7-Day Streak Achieved. 20% XP Bonus Active. Premium UI Enabled.</p>
        `;
        
        // Style the alert dynamically
        Object.assign(announcement.style, {
            position: 'fixed',
            top: '20px', left: '50%',
            transform: 'translateX(-50%) translateY(-100px)',
            zIndex: '9999', padding: '24px 48px',
            textAlign: 'center', border: '2px solid var(--accent-primary)',
            boxShadow: '0 0 50px rgba(0, 255, 136, 0.4)',
            borderRadius: 'var(--radius-lg)', opacity: '0',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
        });

        document.body.appendChild(announcement);

        // Animate In
        setTimeout(() => {
            announcement.style.transform = 'translateX(-50%) translateY(0)';
            announcement.style.opacity = '1';
        }, 100);

        // Animate Out
        setTimeout(() => {
            announcement.style.transform = 'translateX(-50%) translateY(-100px)';
            announcement.style.opacity = '0';
            setTimeout(() => announcement.remove(), 600);
        }, 5000);

        // Apply Premium CSS Rules dynamically to the page
        const style = document.createElement('style');
        style.id = 'power-mode-styles';
        style.innerHTML = `
            .power-mode-active .bento-card { border-color: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
            .power-mode-active .streak-pill { background: linear-gradient(90deg, rgba(255, 51, 102, 0.2), rgba(255, 140, 0, 0.2)); border-color: #FF3366; }
            .power-mode-active .power-score-pill { box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
            .power-mode-active .dashboard-topbar { border-bottom: 1px solid rgba(255, 51, 102, 0.3); }
        `;
        document.head.appendChild(style);

        if (lvlBaseCore) lvlBaseCore.log('info', 'Power Mode Initiated. Premium UI injected.');
    };

    const revokePowerMode = () => {
        playerState.powerModeUnlocked = false;
        document.body.classList.remove('power-mode-active');
        const style = document.getElementById('power-mode-styles');
        if (style) style.remove();
    };

    /**
     * 5. UI Synchronization
     * Binds the calculated math directly to the dashboard DOM elements.
     */
    const syncDashboardUI = () => {
        // Update Power Score
        const powerScoreEl = document.querySelector('.power-score-pill .stat-value');
        if (powerScoreEl) {
            const pScore = calculatePowerScore(playerState.metrics.accuracy, playerState.metrics.speed, playerState.metrics.consistency);
            powerScoreEl.innerText = pScore.toLocaleString();
        }

        // Update Progress Bar
        const xpFill = document.querySelector('.xp-fill');
        const xpNumbers = document.querySelector('.xp-numbers');
        const rankData = calculateRank(playerState.totalXP);
        
        if (xpFill && xpNumbers) {
            const currentMin = rankData.details.min;
            const currentMax = rankData.details.max;
            const progress = ((playerState.totalXP - currentMin) / (currentMax - currentMin)) * 100;
            
            xpFill.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
            xpNumbers.innerHTML = `<span style="color: #fff;">${playerState.totalXP.toLocaleString()}</span> / ${currentMax.toLocaleString()} XP`;
        }

        // Check Power Mode Status
        checkPowerMode();
    };

    // --- Public API ---
    return {
        init: () => {
            syncDashboardUI();
            if (lvlBaseCore) lvlBaseCore.log('info', 'Gamification Engine Mounted.');
        },
        awardXP: (baseAmount, diff, onTime) => {
            const yieldXP = calculateQuestYield(baseAmount, diff, onTime);
            playerState.totalXP += yieldXP;
            syncDashboardUI();
            return yieldXP;
        },
        getState: () => playerState,
        getRank: () => calculateRank(playerState.totalXP),
        getPowerScore: () => calculatePowerScore(playerState.metrics.accuracy, playerState.metrics.speed, playerState.metrics.consistency)
    };

})();

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', GamificationEngine.init);