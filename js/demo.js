/**
 * ============================================================================
 * lvlBase - Interactive Demo Controller
 * ============================================================================
 * Handles the OS role switching logic, updating the sidebar context, and 
 * resetting animations when views change.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const roleBtns = document.querySelectorAll('.role-btn');
    const views = {
        admin: document.getElementById('view-admin'),
        teacher: document.getElementById('view-teacher'),
        student: document.getElementById('view-student')
    };
    const sidebarProfile = document.getElementById('demo-user-profile');
    
    // Role Profiles Context
    const profiles = {
        admin: `
            <div class="avatar admin-avatar">A</div>
            <div class="user-info">
                <h4>System Admin</h4>
                <span>Root Access</span>
            </div>
        `,
        teacher: `
            <div class="avatar teacher-avatar">T</div>
            <div class="user-info">
                <h4>Mr. Davis</h4>
                <span>Class 10-A Manager</span>
            </div>
        `,
        student: `
            <div class="avatar student-avatar">B</div>
            <div class="user-info">
                <h4>Alex Chen</h4>
                <span>Rank B (Elite)</span>
            </div>
        `
    };

    /**
     * Role Switcher Logic
     */
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Update Button States
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedRole = btn.getAttribute('data-role');

            // 2. Hide all views
            Object.values(views).forEach(view => {
                if(view) view.style.display = 'none';
            });

            // 3. Show Target View & Trigger CSS Animations
            const targetView = views[selectedRole];
            if (targetView) {
                targetView.style.display = 'block';
                
                // Re-trigger SVG draw animations if they exist in the view
                const drawAnim = targetView.querySelector('.draw-anim');
                if (drawAnim) {
                    drawAnim.style.animation = 'none';
                    void drawAnim.offsetWidth; // Trigger reflow
                    drawAnim.style.animation = null; 
                }
            }

            // 4. Update Sidebar Context
            if (sidebarProfile) {
                // Quick fade effect
                sidebarProfile.style.opacity = '0';
                setTimeout(() => {
                    sidebarProfile.innerHTML = profiles[selectedRole];
                    sidebarProfile.style.opacity = '1';
                }, 200);
            }
        });
    });

    /**
     * Interactive Quest Toggling (Student View)
     */
    const initQuestInteractions = () => {
        const quests = document.querySelectorAll('.quest-item:not(.completed)');
        
        quests.forEach(quest => {
            quest.addEventListener('click', function() {
                const check = this.querySelector('.quest-check');
                const title = this.querySelector('h4');
                const reward = this.querySelector('.quest-reward');
                const status = this.querySelector('span');

                if (!this.classList.contains('just-completed')) {
                    // Mark as complete
                    this.classList.add('just-completed');
                    this.style.opacity = '0.6';
                    
                    check.classList.add('checked');
                    check.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
                    
                    title.style.textDecoration = 'line-through';
                    status.innerText = "Completed just now";
                    reward.style.color = "var(--text-muted)";
                    reward.innerText = "XP Claimed";

                    // Trigger a tiny generic confetti or glow effect
                    this.style.boxShadow = '0 0 20px rgba(0,255,136,0.3)';
                    setTimeout(() => { this.style.boxShadow = 'none'; }, 500);
                }
            });
        });
    };

    if (lvlBaseCore) lvlBaseCore.log('info', 'Demo Sandbox OS loaded. Awaiting user interaction.');
    initQuestInteractions();
});