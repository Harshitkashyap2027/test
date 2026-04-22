/**
 * ============================================================================
 * lvlBase - Daily Challenge Controller
 * ============================================================================
 * Acts as a 3-stage state machine (Briefing -> Combat -> Results).
 * Integrates with GamificationEngine to calculate dynamic XP and Speed bonuses.
 */

const DailyChallengeEngine = (function() {
    'use strict';

    // --- State Machine ---
    const STATE = {
        currentQuestionIndex: 0,
        score: 0,
        timePerQuestion: 60, // seconds
        currentTime: 60,
        timerInterval: null,
        totalTimeTaken: 0,
        questions: [
            {
                subject: "Mathematics • Calculus",
                text: "If f(x) = 3x² - 4x + 2, what is the derivative f'(x)?",
                options: [
                    { id: 'A', text: "6x - 4", correct: true },
                    { id: 'B', text: "3x - 4", correct: false },
                    { id: 'C', text: "6x² - 4", correct: false },
                    { id: 'D', text: "x - 4", correct: false }
                ]
            },
            {
                subject: "Mathematics • Algebra",
                text: "What are the roots of the equation x² - 5x + 6 = 0?",
                options: [
                    { id: 'A', text: "x = 1, x = 6", correct: false },
                    { id: 'B', text: "x = 2, x = 3", correct: true },
                    { id: 'C', text: "x = -2, x = -3", correct: false },
                    { id: 'D', text: "x = 0, x = 6", correct: false }
                ]
            }
            // In a real app, these are fetched from the backend via the Weakness Detection API
        ]
    };

    // --- DOM Elements ---
    const els = {
        // States
        briefing: document.getElementById('state-briefing'),
        combat: document.getElementById('state-combat'),
        results: document.getElementById('state-results'),
        
        // Buttons
        startBtn: document.getElementById('start-challenge-btn'),
        
        // Combat UI
        qCurrent: document.getElementById('q-current'),
        qText: document.getElementById('question-text'),
        optionsGrid: document.getElementById('options-grid'),
        timerText: document.getElementById('timer-text'),
        timerCircle: document.getElementById('timer-circle'),
        
        // Results UI
        resIcon: document.getElementById('result-icon'),
        resTitle: document.getElementById('result-title'),
        resDesc: document.getElementById('result-desc'),
        resAcc: document.getElementById('res-accuracy'),
        resSpeed: document.getElementById('res-speed'),
        resTotal: document.getElementById('res-total-xp'),
        newXpBar: document.getElementById('new-xp-bar')
    };

    /**
     * 1. State Transitions
     */
    const switchState = (targetState) => {
        els.briefing.style.display = 'none';
        els.combat.style.display = 'none';
        els.results.style.display = 'none';
        
        targetState.style.display = 'flex';
        // Re-trigger animation
        targetState.style.animation = 'none';
        void targetState.offsetWidth;
        targetState.style.animation = 'fade-in-scale 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards';
    };

    /**
     * 2. Combat Engine (Quiz Loop)
     */
    const startCombat = () => {
        switchState(els.combat);
        STATE.currentQuestionIndex = 0;
        STATE.score = 0;
        STATE.totalTimeTaken = 0;
        loadQuestion();
    };

    const loadQuestion = () => {
        const q = STATE.questions[STATE.currentQuestionIndex];
        els.qCurrent.innerText = STATE.currentQuestionIndex + 1;
        document.querySelector('.subject-tag').innerText = q.subject;
        els.qText.innerText = q.text;

        // Render Options
        els.optionsGrid.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'combat-option';
            btn.innerHTML = `
                <span class="opt-letter">${opt.id}</span>
                <span class="opt-text">${opt.text}</span>
            `;
            btn.onclick = () => handleAnswer(btn, opt.correct);
            els.optionsGrid.appendChild(btn);
        });

        // Reset and Start Timer
        STATE.currentTime = STATE.timePerQuestion;
        updateTimerUI();
        clearInterval(STATE.timerInterval);
        STATE.timerInterval = setInterval(timerTick, 1000);
    };

    const timerTick = () => {
        STATE.currentTime--;
        STATE.totalTimeTaken++;
        updateTimerUI();

        if (STATE.currentTime <= 0) {
            clearInterval(STATE.timerInterval);
            // Auto fail question if time runs out
            handleAnswer(null, false); 
        }
    };

    const updateTimerUI = () => {
        els.timerText.innerText = STATE.currentTime;
        
        // Calculate circle dash offset (283 is approx circumference of r=45)
        const percentage = STATE.currentTime / STATE.timePerQuestion;
        const offset = 283 - (283 * percentage);
        els.timerCircle.style.strokeDashoffset = offset;

        // Color shifts based on time
        if (percentage > 0.5) els.timerCircle.style.stroke = 'var(--accent-primary)';
        else if (percentage > 0.2) els.timerCircle.style.stroke = 'var(--accent-yellow)';
        else els.timerCircle.style.stroke = 'var(--accent-red)';
    };

    const handleAnswer = (selectedBtn, isCorrect) => {
        clearInterval(STATE.timerInterval);
        
        // Disable all buttons
        const allBtns = els.optionsGrid.querySelectorAll('.combat-option');
        allBtns.forEach(b => b.disabled = true);

        // Update Tracker Dot
        const dot = document.getElementById(`dot-${STATE.currentQuestionIndex + 1}`);
        
        if (isCorrect) {
            STATE.score++;
            if (selectedBtn) selectedBtn.classList.add('correct');
            if (dot) dot.classList.add('correct');
        } else {
            if (selectedBtn) selectedBtn.classList.add('incorrect');
            if (dot) dot.classList.add('incorrect');
            
            // Show correct answer if failed
            const correctOptIndex = STATE.questions[STATE.currentQuestionIndex].options.findIndex(o => o.correct);
            if(allBtns[correctOptIndex]) allBtns[correctOptIndex].classList.add('correct');
        }

        // Wait, then load next or finish
        setTimeout(() => {
            STATE.currentQuestionIndex++;
            if (STATE.currentQuestionIndex < STATE.questions.length) {
                // Activate next dot
                const nextDot = document.getElementById(`dot-${STATE.currentQuestionIndex + 1}`);
                if (nextDot) nextDot.classList.add('active');
                loadQuestion();
            } else {
                finishCombat();
            }
        }, 1500);
    };

    /**
     * 3. Results & Gamification Integration
     */
    const finishCombat = () => {
        switchState(els.results);
        
        const totalQ = STATE.questions.length;
        const accuracy = (STATE.score / totalQ) * 100;
        
        // Gamification Math
        const baseXP = STATE.score * 500; // 500 per correct answer
        
        // Speed Bonus: If average time per question is under 20s
        const avgTime = STATE.totalTimeTaken / totalQ;
        let speedBonus = 0;
        if (avgTime < 20) speedBonus = Math.round((20 - avgTime) * 20); // up to 400 extra
        
        let totalXP = baseXP + speedBonus;

        // UI Updates
        els.resAcc.innerText = `${Math.round(accuracy)}%`;
        els.resSpeed.innerText = `+${speedBonus} XP`;
        els.resTotal.innerText = `+${totalXP.toLocaleString()} XP`;

        if (accuracy >= 60) {
            // Win State
            els.resIcon.className = 'result-icon success-icon';
            els.resIcon.innerHTML = `<svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
            els.resTitle.innerText = "Challenge Cleared";
            els.resTitle.style.color = "var(--text-primary)";
            
            // Hook into external Gamification Engine if present
            if (typeof GamificationEngine !== 'undefined') {
                GamificationEngine.awardXP(totalXP, 3, true);
            }
            
            // Animate XP Bar filling
            setTimeout(() => {
                els.newXpBar.style.width = '2.4%'; // Visual mockup of adding XP to the bar
            }, 500);
            
        } else {
            // Fail State
            els.resIcon.className = 'result-icon fail-icon';
            els.resIcon.innerHTML = `<svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
            els.resTitle.innerText = "Challenge Failed";
            els.resTitle.style.color = "var(--accent-red)";
            els.resDesc.innerText = "Accuracy too low. Jarvis recommends reviewing the material before retrying tomorrow.";
            
            els.resSpeed.innerText = "0 XP";
            els.resTotal.innerText = "+100 XP (Attempt)";
            els.resTotal.style.color = "var(--text-secondary)";
            els.resTotal.classList.remove('text-gradient');
        }

        if (lvlBaseCore) lvlBaseCore.log('info', 'Daily Challenge Completed. Metrics logged.');
    };

    // --- Init ---
    return {
        init: () => {
            if (els.startBtn) els.startBtn.addEventListener('click', startCombat);
            if (lvlBaseCore) lvlBaseCore.log('info', 'Daily Challenge / AI Quiz Generator Ready.');
        }
    };

})();

document.addEventListener('DOMContentLoaded', DailyChallengeEngine.init);