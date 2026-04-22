/**
 * ============================================================================
 * lvlBase - Solutions Architecture Controller
 * ============================================================================
 * Handles ScrollSpy for the sticky navigation, intersection observers for 
 * section reveals, and dynamic data simulations for the pure CSS mockups.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const sections = document.querySelectorAll('.industry-block');
    const navLinks = document.querySelectorAll('.subnav-link');
    const stickyNav = document.getElementById('solution-nav');

    /**
     * 1. ScrollSpy (Sticky Navigation Highlighting)
     */
    const initScrollSpy = () => {
        if (!stickyNav || navLinks.length === 0) return;

        const observerOptions = {
            root: null,
            // Offset to trigger when section is roughly in the middle of the screen
            rootMargin: '-20% 0px -70% 0px', 
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active to current
                    const activeId = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.subnav-link[href="#${activeId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    };

    /**
     * 2. Smooth Scrolling for Subnav Links
     */
    const initSmoothScroll = () => {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Scroll into view with smooth behavior
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    };

    /**
     * 3. Hide/Show Sticky Nav on Scroll direction
     * (Hides when scrolling down to maximize reading space, shows when scrolling up)
     */
    const initNavHideOnScroll = () => {
        if (!stickyNav) return;
        
        let lastScrollTop = 0;
        const navHeight = stickyNav.offsetHeight;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Don't hide if we are at the very top
            if (currentScroll < 200) {
                stickyNav.style.transform = 'translateY(0)';
                return;
            }

            if (currentScroll > lastScrollTop) {
                // Scrolling down
                stickyNav.style.transform = `translateY(-150%)`;
            } else {
                // Scrolling up
                stickyNav.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
        }, { passive: true });
    };

    /**
     * 4. Entrance Animations for Bento Blocks
     */
    const initEntranceAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        const bentoCards = document.querySelectorAll('.bento-card');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Handle explicit data-animate attributes
                    if (el.hasAttribute('data-animate')) {
                        el.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }
                    
                    // Handle automatic staggering for bento cards inside a grid
                    if (el.classList.contains('bento-card')) {
                        setTimeout(() => {
                            el.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0) scale(1)';
                        }, Math.random() * 200); // Random slight stagger for organic feel
                    }

                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        // Pre-set states
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            scrollObserver.observe(el);
        });

        bentoCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.98)';
            scrollObserver.observe(card);
        });
    };

    /**
     * 5. Dynamic Mockup Simulations (Making the UI feel alive)
     */
    const initMockupSimulations = () => {
        // 5a. University Enrollment Counter Update
        const enrollmentCounter = document.querySelector('#university h4');
        if (enrollmentCounter && enrollmentCounter.innerText.includes('24,500')) {
            setInterval(() => {
                // Occasionally add a student to simulate live registration
                if (Math.random() > 0.7) {
                    let currentVal = parseInt(enrollmentCounter.innerText.replace(/,/g, ''));
                    currentVal += 1;
                    enrollmentCounter.innerText = currentVal.toLocaleString();
                    
                    // Add a tiny green flash effect
                    enrollmentCounter.style.color = 'var(--accent-primary)';
                    setTimeout(() => { enrollmentCounter.style.color = ''; }, 500);
                }
            }, 3000);
        }

        // 5b. Corporate Kanban Board "Live" Updates
        // Simulates a user moving a ticket from "To Do" to "In Progress" visually
        const kanbanBoard = document.querySelector('#company .mockup-container');
        if (kanbanBoard) {
            const availableQuests = kanbanBoard.querySelectorAll('div[style*="border-left: 3px"]');
            
            // After 5 seconds, simulate a ticket update
            setTimeout(() => {
                if (availableQuests.length > 0) {
                    const targetQuest = availableQuests; // The "+500 XP" one
                    
                    // Add a glow
                    targetQuest.style.transition = 'all 0.5s';
                    targetQuest.style.boxShadow = '0 0 15px rgba(176,38,255,0.4)';
                    targetQuest.style.transform = 'translateY(-5px)';
                    
                    setTimeout(() => {
                        // Change status text
                        const xpSpan = targetQuest.querySelector('span');
                        if(xpSpan) {
                            xpSpan.innerText = "Assigned via AI";
                            xpSpan.style.color = "var(--text-muted)";
                        }
                        
                        targetQuest.style.boxShadow = 'none';
                        targetQuest.style.transform = 'translateY(0)';
                        targetQuest.style.opacity = '0.5'; // Dim it out to show it's claimed
                    }, 1000);
                }
            }, 5000);
        }
    };

    // Initialize all modules
    if (lvlBaseCore) lvlBaseCore.log('info', 'Solutions Architecture UI Engine initialized.');
    initScrollSpy();
    initSmoothScroll();
    initNavHideOnScroll();
    initEntranceAnimations();
    initMockupSimulations();
});