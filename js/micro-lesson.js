/**
 * ============================================================================
 * lvlBase - Micro-Lesson & Interactive Simulation Controller
 * ============================================================================
 * Handles the physics logic for the Gravity simulation, manages the 5-minute 
 * burst timer, and validates the gamified knowledge-check quiz.
 */

const MicroLessonEngine = (function() {
    'use strict';

    // --- DOM Elements ---
    const timerDisplay = document.getElementById('lesson-timer');
    const timerFill = document.getElementById('timer-fill');
    const completeBtn = document.getElementById('complete-lesson-btn');
    
    // Simulation Elements
    const simSun = document.getElementById('sim-sun');
    const gravityWell = document.getElementById('gravity-well');
    const simOrbitPath = document.getElementById('sim-orbit-path');
    const simPlanet = document.getElementById('sim-planet');
    const velocityVector = document.querySelector('.velocity-vector');
    
    const massSlider = document.getElementById('mass-slider');
    const massValText = document.getElementById('mass-val');
    const velocitySlider = document.getElementById('velocity-slider');
    const velocityValText = document.getElementById('velocity-val');
    const simFeedback = document.getElementById('sim-feedback');

    // Quiz Elements
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizFeedback = document.getElementById('quiz-feedback');
    const fbIcon = document.getElementById('feedback-icon');
    const fbTitle = document.getElementById('feedback-title');
    const fbDesc = document.getElementById('feedback-desc');

    // --- State ---
    let totalSeconds = 300; // 5 minutes
    let timerInterval = null;
    let quizCompleted = false;

    /**
     * 1. 5-Minute Burst Timer
     */
    const startTimer = () => {
        timerInterval = setInterval(() => {
            totalSeconds--;
            
            const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            timerDisplay.innerText = `${m}:${s}`;
            
            const percentage = (totalSeconds / 300) * 100;
            timerFill.style.width = `${percentage}%`;

            if (totalSeconds <= 60) {
                timerDisplay.style.color = 'var(--accent-red)';
                timerFill.classList.add('urgent');
            }

            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                timerDisplay.innerText = "00:00";
                if (!quizCompleted) triggerFailureState();
            }
        }, 1000);
    };

    const triggerFailureState = () => {
        if (lvlBaseCore) lvlBaseCore.log('warn', 'Micro-Lesson timer expired before completion.');
        quizOptions.forEach(opt => opt.disabled = true);
        simFeedback.innerText = "Time Expired. Lesson Locked.";
        simFeedback.className = "sim-feedback danger";
    };

    /**
     * 2. Physics Simulation Logic (DOM Manipulation based on Sliders)
     */
    const updateSimulation = () => {
        const mass = parseFloat(massSlider.value);
        const velocity = parseFloat(velocitySlider.value);

        // Update Text
        massValText.innerText = `${mass.toFixed(1)}x`;
        velocityValText.innerText = `${velocity.toFixed(1)} km/s`;

        // Physics Logic (Highly simplified for UI representation)
        // A stable orbit requires a specific ratio of Velocity to Mass.
        // Let's assume ideal ratio is 1:1.
        
        const baseOrbitSize = 300;
        const baseSpeed = 6; // seconds for 1 rotation

        // Visualizing Star Mass
        const sunSize = 20 + (mass * 20); // Scale sun visual
        simSun.style.width = `${sunSize}px`;
        simSun.style.height = `${sunSize}px`;
        
        // Gravity well visual representation
        gravityWell.style.width = `${mass * 100}px`;
        gravityWell.style.height = `${mass * 100}px`;

        // Visualizing Planet Velocity
        velocityVector.style.width = `${velocity * 20}px`;
        const animationSpeed = baseSpeed / velocity;
        
        // Check Stability
        const ratio = velocity / mass;

        simOrbitPath.classList.remove('crashed');
        
        if (ratio < 0.5) {
            // Planet too slow for the mass, crash into star
            simOrbitPath.classList.add('crashed');
            simFeedback.innerText = "CRITICAL: Velocity too low. Orbit decayed.";
            simFeedback.className = "sim-feedback danger";
            // Stop orbit animation
            simOrbitPath.style.animationDuration = '0s';
            velocityVector.style.display = 'none';
        } else if (ratio > 2.0) {
            // Planet too fast, escape velocity
            simOrbitPath.style.width = '1000px';
            simOrbitPath.style.height = '1000px';
            simFeedback.innerText = "WARNING: Escape velocity reached. Planet lost.";
            simFeedback.className = "sim-feedback danger";
            simOrbitPath.style.animationDuration = `${animationSpeed}s`;
            velocityVector.style.display = 'block';
        } else {
            // Stable Orbit
            const orbitSize = baseOrbitSize * (velocity / mass);
            simOrbitPath.style.width = `${orbitSize}px`;
            simOrbitPath.style.height = `${orbitSize}px`;
            simFeedback.innerText = "Stable Orbit Achieved";
            simFeedback.className = "sim-feedback";
            simOrbitPath.style.animationDuration = `${animationSpeed}s`;
            velocityVector.style.display = 'block';
        }
    };

    /**
     * 3. Knowledge Check (Quiz) Validation
     */
    const handleQuizInteraction = (e) => {
        if (quizCompleted || totalSeconds <= 0) return;
        
        const selectedBtn = e.currentTarget;
        const isCorrect = selectedBtn.getAttribute('data-correct') === 'true';

        // Disable all options
        quizOptions.forEach(btn => {
            btn.disabled = true;
            if (btn.getAttribute('data-correct') === 'true') {
                // Always highlight the correct answer
                btn.classList.add('correct');
            }
        });

        quizFeedback.style.display = 'flex';

        if (isCorrect) {
            quizCompleted = true;
            clearInterval(timerInterval); // Stop timer
            
            selectedBtn.classList.add('correct');
            
            quizFeedback.className = "quiz-feedback success";
            fbIcon.innerText = "🎉";
            fbTitle.innerText = "Excellent Deduction!";
            fbDesc.innerText = "Because the gravitational pull (Mass) increased but the forward momentum (Velocity) stayed the same, the planet can no longer resist the pull and crashes.";
            
            // Enable Complete Button
            completeBtn.disabled = false;
            completeBtn.innerHTML = `Claim XP & Return <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            
            // Integrate with Gamification Engine if available
            if (typeof GamificationEngine !== 'undefined') {
                GamificationEngine.awardXP(250, 2, true);
                if (lvlBaseCore) lvlBaseCore.log('info', 'Micro-Lesson completed successfully. +250 XP awarded.');
            }
        } else {
            selectedBtn.classList.add('incorrect');
            
            quizFeedback.className = "quiz-feedback error";
            fbIcon.innerText = "❌";
            fbTitle.innerText = "Incorrect Hypothesis";
            fbDesc.innerText = "If mass increases without an increase in velocity, the gravitational pull overcomes the planet's momentum. Try the simulation again by increasing Mass to 4.0 and leaving Velocity at 2.0.";
            
            if (lvlBaseCore) lvlBaseCore.log('warn', 'Student failed micro-lesson check.');
        }
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

    // --- Event Listeners & Init ---
    return {
        init: () => {
            if (lvlBaseCore) lvlBaseCore.log('info', 'Micro-Lesson Physics Engine & Timer Active.');
            initEntranceAnimations();
            
            // Start components
            startTimer();
            updateSimulation();

            // Bind Sliders
            massSlider.addEventListener('input', updateSimulation);
            velocitySlider.addEventListener('input', updateSimulation);

            // Bind Quiz
            quizOptions.forEach(btn => {
                btn.addEventListener('click', handleQuizInteraction);
            });

            // Bind Exit
            completeBtn.addEventListener('click', () => {
                window.location.href = 'subjects.html';
            });
        }
    };

})();

// Boot on Load
document.addEventListener('DOMContentLoaded', MicroLessonEngine.init);