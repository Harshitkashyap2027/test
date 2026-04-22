/**
 * ============================================================================
 * lvlBase - Teacher Operations Controller
 * ============================================================================
 * Handles the creation of Quests, AI Auto-Grading simulations, and modal logic.
 */

const TeacherOps = (function() {
    'use strict';

    // DOM Elements
    const questModal = document.getElementById('create-quest-modal');
    const questForm = document.getElementById('quest-form');
    const deployBtn = document.getElementById('deploy-quest-btn');
    
    const visualizer = document.getElementById('ai-grade-visualizer');
    const queueList = document.getElementById('queue-list');
    const progressFill = document.getElementById('grade-progress-fill');
    const percentText = document.getElementById('grade-percent-text');

    /**
     * 1. Quest Deployment Logic
     */
    const openQuestModal = () => {
        document.body.style.overflow = 'hidden';
        questModal.classList.add('open');
    };

    const closeQuestModal = () => {
        questModal.classList.remove('open');
        setTimeout(() => { document.body.style.overflow = ''; }, 300);
    };

    if (questForm) {
        questForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const originalHtml = deployBtn.innerHTML;
            deployBtn.innerHTML = `<span class="pulse-dot" style="background:#000;"></span> Deploying`;
            deployBtn.style.pointerEvents = 'none';

            // Simulate Network Request to Firebase
            setTimeout(() => {
                if (lvlBaseCore) lvlBaseCore.log('info', 'Quest successfully deployed to student Arena nodes.');
                
                deployBtn.innerHTML = `Deployed <svg width="16" height="16" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                deployBtn.style.background = 'var(--accent-primary)';
                deployBtn.style.color = '#000';

                setTimeout(() => {
                    closeQuestModal();
                    questForm.reset();
                    deployBtn.innerHTML = originalHtml;
                    deployBtn.style.background = '';
                    deployBtn.style.color = '';
                    deployBtn.style.pointerEvents = 'auto';
                }, 1500);

            }, 1200);
        });
    }

    /**
     * 2. AI Auto-Grading Simulation
     */
    const triggerAutoGrade = () => {
        if (!visualizer) return;

        // Show Visualizer Overlay
        visualizer.style.display = 'flex';
        let percent = 0;
        progressFill.style.width = '0%';
        percentText.innerText = '0%';

        if (lvlBaseCore) lvlBaseCore.log('info', 'Jarvis AI Evaluation Kernel initialized.');

        // Progress Animation
        const gradeInterval = setInterval(() => {
            // Random increments for realism
            percent += Math.floor(Math.random() * 5) + 1;
            
            if (percent >= 100) {
                percent = 100;
                clearInterval(gradeInterval);
                finishAutoGrading();
            }
            
            progressFill.style.width = `${percent}%`;
            percentText.innerText = `${percent}%`;
        }, 150);
    };

    const finishAutoGrading = () => {
        const statusText = visualizer.querySelector('h4');
        statusText.innerText = "Evaluation Complete. XP Awarded.";
        statusText.style.color = "var(--accent-primary)";
        progressFill.style.background = "var(--accent-primary)";
        progressFill.style.boxShadow = "0 0 10px var(--accent-primary)";

        if (lvlBaseCore) lvlBaseCore.log('info', '42 submissions graded. 58,500 XP distributed to student nodes.');

        setTimeout(() => {
            visualizer.style.display = 'none';
            // Reset for next time
            statusText.innerText = "Jarvis AI Processing...";
            statusText.style.color = "var(--accent-purple)";
            progressFill.style.background = "var(--accent-purple)";
            progressFill.style.boxShadow = "0 0 10px var(--accent-purple)";
            
            // Empty the queue list visually
            if (queueList) {
                queueList.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-muted); opacity:0.5; padding: 40px 0;">
                        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <p style="margin-top: 16px;">Queue is empty. All caught up.</p>
                    </div>
                `;
            }

            // Update Header Badge
            const headerBadge = document.querySelector('.grading-queue-card .card-header .badge');
            if (headerBadge) {
                headerBadge.innerText = '0';
                headerBadge.style.background = 'var(--text-muted)';
            }

        }, 1500);
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

    // Public API
    return {
        init: () => {
            initEntranceAnimations();
            if (lvlBaseCore) lvlBaseCore.log('info', 'Teacher Operations Module Active.');
        },
        openQuestModal,
        closeQuestModal,
        triggerAutoGrade
    };

})();

// Boot on Load
document.addEventListener('DOMContentLoaded', TeacherOps.init);