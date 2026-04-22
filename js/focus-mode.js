/**
 * ============================================================================
 * lvlBase - Deep Focus Mode Controller
 * ============================================================================
 * Handles the Pomodoro state machine (Focus / Break cycles), dynamic SVG 
 * ring animation, Task list CRUD, and simulated Audio Mixer UI.
 */

const FocusEngine = (function() {
    'use strict';

    // --- State ---
    const STATE = {
        mode: 'focus', // 'focus', 'short-break', 'long-break'
        timeLengths: {
            'focus': 25 * 60,
            'short-break': 5 * 60,
            'long-break': 15 * 60
        },
        timeLeft: 25 * 60,
        isRunning: false,
        timerInterval: null,
        sessionCount: 1,
        maxSessions: 4
    };

    // --- DOM Elements ---
    const els = {
        body: document.querySelector('.focus-body'),
        statusDot: document.getElementById('status-dot'),
        statusText: document.getElementById('status-text'),
        
        // Timer
        timeDisplay: document.getElementById('time-left'),
        progressRing: document.getElementById('timer-progress-ring'),
        toggleBtn: document.getElementById('timer-toggle-btn'),
        resetBtn: document.getElementById('timer-reset-btn'),
        modeBtns: document.querySelectorAll('.t-mode-btn'),
        
        // Tasks
        taskInput: document.getElementById('new-task-input'),
        addTaskBtn: document.getElementById('add-task-btn'),
        taskList: document.getElementById('task-list'),
        currentTaskLabel: document.getElementById('current-task-label'),
        sessionTracker: document.getElementById('session-count'),
        
        // Audio Mixer
        soundToggles: document.querySelectorAll('.sound-toggle'),
        soundSliders: document.querySelectorAll('.sound-slider')
    };

    /**
     * 1. Timer Core Logic
     */
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const updateTimerUI = () => {
        // Text
        els.timeDisplay.innerText = formatTime(STATE.timeLeft);
        
        // SVG Ring Calculation (circumference = 283)
        const total = STATE.timeLengths[STATE.mode];
        const percentage = STATE.timeLeft / total;
        const offset = 283 - (283 * percentage);
        els.progressRing.style.strokeDashoffset = offset;
    };

    const setMode = (modeStr) => {
        if (STATE.isRunning) toggleTimer(); // Pause if switching modes
        
        STATE.mode = modeStr;
        STATE.timeLeft = STATE.timeLengths[modeStr];
        
        // Update Buttons
        els.modeBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.t-mode-btn[data-mode="${modeStr}"]`).classList.add('active');
        
        // Update Body State for CSS Glows
        els.body.className = `dark-theme bento-body focus-body state-${modeStr === 'focus' ? 'idle' : 'break'}`;

        updateTimerUI();
    };

    const timerTick = () => {
        STATE.timeLeft--;
        updateTimerUI();

        if (STATE.timeLeft <= 0) {
            clearInterval(STATE.timerInterval);
            STATE.isRunning = false;
            handleSessionEnd();
        }
    };

    const toggleTimer = () => {
        if (STATE.isRunning) {
            // Pause
            clearInterval(STATE.timerInterval);
            STATE.isRunning = false;
            
            els.toggleBtn.innerText = "Resume Focus";
            els.statusText.innerText = "Paused";
            els.statusDot.className = "pulse-dot";
            els.statusDot.style.background = "var(--text-muted)";
            els.body.classList.remove('state-focus');
            
        } else {
            // Start
            STATE.timerInterval = setInterval(timerTick, 1000);
            STATE.isRunning = true;
            
            els.toggleBtn.innerText = "Pause Timer";
            els.statusText.innerText = STATE.mode === 'focus' ? "Deep Focus Active" : "On Break";
            els.statusDot.className = `pulse-dot active-${STATE.mode === 'focus' ? 'focus' : 'break'}`;
            
            if (STATE.mode === 'focus') els.body.classList.add('state-focus');
        }
    };

    const handleSessionEnd = () => {
        // Play sound (simulated)
        if (lvlBaseCore) lvlBaseCore.log('info', 'Session ended. Chime played.');

        if (STATE.mode === 'focus') {
            // Complete Focus -> Move to Break
            STATE.sessionCount++;
            
            if (STATE.sessionCount > STATE.maxSessions) {
                STATE.sessionCount = 1;
                setMode('long-break');
            } else {
                setMode('short-break');
            }
            
            els.sessionTracker.innerText = `${STATE.sessionCount}/${STATE.maxSessions}`;
            
            // Mark current task as done if exists
            const activeTask = document.querySelector('.active-task');
            if (activeTask) {
                activeTask.classList.remove('active-task');
                activeTask.classList.add('completed');
                updateCurrentTaskLabel();
            }

            // Gamification hook
            if (typeof GamificationEngine !== 'undefined') {
                GamificationEngine.awardXP(100, 1, true); // Award XP for completing a pomodoro
            }

        } else {
            // Complete Break -> Move to Focus
            setMode('focus');
        }
        
        els.toggleBtn.innerText = "Start " + (STATE.mode === 'focus' ? "Focus" : "Break");
    };

    /**
     * 2. Task Management Logic
     */
    const addTask = () => {
        const text = els.taskInput.value.trim();
        if (!text) return;

        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-radio"></div>
            <span class="task-name">${text}</span>
            <button class="delete-task"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        `;
        
        els.taskList.appendChild(li);
        els.taskInput.value = '';
        
        bindTaskEvents(li);
        
        // If no active task, make this active
        if (!document.querySelector('.active-task')) {
            li.classList.add('active-task');
            updateCurrentTaskLabel();
        }
    };

    const bindTaskEvents = (item) => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.delete-task')) {
                item.remove();
                updateCurrentTaskLabel();
                return;
            }

            if (item.classList.contains('completed')) return;

            // Set as active
            document.querySelectorAll('.task-item').forEach(t => t.classList.remove('active-task'));
            item.classList.add('active-task');
            updateCurrentTaskLabel();
        });
    };

    const updateCurrentTaskLabel = () => {
        const active = document.querySelector('.active-task .task-name');
        if (active) {
            els.currentTaskLabel.innerText = active.innerText;
        } else {
            els.currentTaskLabel.innerText = "No active task selected";
        }
    };

    /**
     * 3. Ambient Audio Mixer (Simulation UI)
     */
    const bindAudioMixer = () => {
        els.soundToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const isActive = toggle.classList.contains('active');
                const controls = toggle.nextElementSibling;
                const slider = controls.querySelector('input');
                const readout = controls.querySelector('.vol-readout');

                if (isActive) {
                    toggle.classList.remove('active');
                    slider.disabled = true;
                    readout.innerText = "0%";
                } else {
                    toggle.classList.add('active');
                    slider.disabled = false;
                    slider.value = 50;
                    readout.innerText = "50%";
                }
            });
        });

        els.soundSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const val = e.target.value;
                const readout = e.target.parentElement.querySelector('.vol-readout');
                readout.innerText = `${val}%`;
            });
        });
    };

    /**
     * 4. Init
     */
    const init = () => {
        // Bind Mode Buttons
        els.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => setMode(btn.getAttribute('data-mode')));
        });

        // Bind Timer Controls
        els.toggleBtn.addEventListener('click', toggleTimer);
        els.resetBtn.addEventListener('click', () => setMode(STATE.mode));

        // Bind Tasks
        els.addTaskBtn.addEventListener('click', addTask);
        els.taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
        document.querySelectorAll('.task-item').forEach(bindTaskEvents);

        // Bind Mixer
        bindAudioMixer();

        // Initial UI Set
        setMode('focus');
        updateCurrentTaskLabel();

        // Entrance Animation
        document.querySelectorAll('.bento-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });

        if (lvlBaseCore) lvlBaseCore.log('info', 'Deep Focus Engine Active.');
    };

    return { init };

})();

document.addEventListener('DOMContentLoaded', FocusEngine.init);