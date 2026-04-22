/**
 * ============================================================================
 * lvlBase UNI - Credit & CGPA Engine
 * ============================================================================
 * Handles the calculation of university-level metrics (CGPA, Credits) and
 * initializes the dynamic radar chart and progress bars.
 */

const CreditEngine = (function() {
    'use strict';

    // --- Simulated Database State ---
    const academicState = {
        studentId: "hk_99201",
        cgpa: 8.54,
        totalCreditsEarned: 98,
        totalCreditsRequired: 160,
        creditsByType: {
            core: 72,
            elective: 16,
            project: 10
        },
        requirements: {
            core: 80,
            elective: 40,
            project: 40
        }
    };

    /**
     * 1. Initialize Credit Progress Bars
     */
    const renderCreditTracker = () => {
        const fillCore = document.querySelector('.credit-fill.core');
        const fillElective = document.querySelector('.credit-fill.elective');
        const fillProject = document.querySelector('.credit-fill.project');

        if (!fillCore || !fillElective || !fillProject) return;

        // Calculate percentages based on total REQUIRED credits for the degree
        const corePercent = (academicState.creditsByType.core / academicState.totalCreditsRequired) * 100;
        const electivePercent = (academicState.creditsByType.elective / academicState.totalCreditsRequired) * 100;
        const projectPercent = (academicState.creditsByType.project / academicState.totalCreditsRequired) * 100;

        // Trigger CSS Transitions
        setTimeout(() => {
            fillCore.style.width = `${corePercent}%`;
            fillElective.style.width = `${electivePercent}%`;
            fillProject.style.width = `${projectPercent}%`;
        }, 300);
    };

    /**
     * 2. Entrance Animations (UI Polish)
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

    /**
     * 3. CGPA SVG Circle Animation
     */
    const animateCGPA = () => {
        const circle = document.querySelector('.cgpa-circle .fill');
        if (!circle) return;

        // Formula: Dash offset = Circumference - (Circumference * (CGPA / 10))
        // Circumference of r=45 is ~283
        const percentage = academicState.cgpa / 10.0;
        const offset = 283 - (283 * percentage);

        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 500);
    };

    // Public API
    return {
        init: () => {
            if (typeof lvlBaseCore !== 'undefined') {
                lvlBaseCore.log('info', 'University Credit Engine Mounted. Calculating CGPA metrics.');
            }
            renderCreditTracker();
            animateCGPA();
            initEntranceAnimations();
        }
    };

})();

// Boot on Load
document.addEventListener('DOMContentLoaded', CreditEngine.init);