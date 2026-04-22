/**
 * ============================================================================
 * lvlBase - Contact & Lead Routing Controller
 * ============================================================================
 * Handles robust form validation, dynamic error states, scheduling UI mocks,
 * and simulated Firebase submission logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const contactForm = document.getElementById('enterprise-contact-form');
    const inputs = contactForm ? contactForm.querySelectorAll('.bento-input') : [];
    const submitBtn = document.getElementById('submit-contact');
    const timeBtns = document.querySelectorAll('.time-btn:not(.disabled)');

    /**
     * 1. Form Validation Engine
     */
    const validateInput = (input) => {
        const group = input.closest('.input-group');
        let isValid = true;

        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
        }

        if (input.type === 'email' && input.value.trim()) {
            // Basic email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
                group.querySelector('.error-msg').innerText = "Please enter a valid email format.";
            }
        }

        if (!isValid) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }

        return isValid;
    };

    // Live validation on blur
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            // Remove error state as soon as user starts typing
            input.closest('.input-group').classList.remove('error');
        });
    });

    /**
     * 2. Form Submission (Simulated Firebase Hook)
     */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) isFormValid = false;
            });

            if (!isFormValid) {
                if (lvlBaseCore) lvlBaseCore.log('warn', 'Form submission halted. Validation errors present.');
                return;
            }

            // Extract Data
            const formData = {
                firstName: document.getElementById('fname').value,
                lastName: document.getElementById('lname').value,
                email: document.getElementById('email').value,
                orgType: document.querySelector('input[name="org_type"]:checked').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            // UI Loading State
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span class="pulse-dot" style="background:#000; margin:0 auto;"></span>`;
            submitBtn.style.pointerEvents = 'none';

            // Simulate Network Request to backend (Firebase)
            setTimeout(() => {
                if (lvlBaseCore) {
                    lvlBaseCore.log('info', 'Lead data securely transmitted to CRM node.', formData);
                }
                
                // Success State
                submitBtn.innerHTML = `<span>Transmission Received</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                submitBtn.style.background = 'var(--accent-primary)';
                submitBtn.style.color = '#000';
                
                // Reset Form
                contactForm.reset();
                
                // Restore button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.style.pointerEvents = 'auto';
                }, 3000);

            }, 1800);
        });
    }

    /**
     * 3. Interactive Scheduling UI Logic
     */
    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deselect all
            timeBtns.forEach(b => b.classList.remove('selected'));
            // Select current
            btn.classList.add('selected');
            
            // Update confirm button text
            const confirmBtn = document.querySelector('.booking-card .btn-secondary');
            if(confirmBtn) {
                confirmBtn.innerText = `Confirm ${btn.innerText} Demo`;
                
                // Add a quick pulse effect to confirm button
                confirmBtn.style.transform = 'scale(0.98)';
                setTimeout(() => { confirmBtn.style.transform = 'scale(1)'; }, 150);
            }
        });
    });

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

    if (lvlBaseCore) lvlBaseCore.log('info', 'Contact & Routing Engine initialized.');
    initEntranceAnimations();
});