/**
 * ============================================================================
 * lvlBase - Auth Controller
 * ============================================================================
 * Handles Form Toggling, Password Strength Validation, Mouse Parallax, 
 * and mock Firebase API submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const tabBtns = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const toggleBtns = document.querySelectorAll('.password-toggle');
    const regPassword = document.getElementById('reg-password');
    const parallaxArea = document.querySelector('.auth-visual-panel');
    const floatingCards = document.querySelectorAll('.mini-bento');

    /**
     * 1. Form Toggling (Login vs Register)
     */
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            // Hide all forms
            forms.forEach(f => {
                f.classList.remove('active-form');
                setTimeout(() => f.style.display = 'none', 300); // Wait for fade out
            });

            // Show selected form
            const targetFormId = btn.getAttribute('data-form') + '-form';
            const targetForm = document.getElementById(targetFormId);
            
            setTimeout(() => {
                targetForm.style.display = 'flex';
                // Trigger reflow to ensure CSS transition works
                void targetForm.offsetWidth;
                targetForm.classList.add('active-form');
            }, 300);
        });
    });

    /**
     * 2. Password Visibility Toggle
     */
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle Icon (Strike-through logic could be added here)
            if (type === 'text') {
                this.style.color = 'var(--accent-primary)';
            } else {
                this.style.color = 'var(--text-muted)';
            }
        });
    });

    /**
     * 3. Real-time Password Strength Meter (Registration)
     */
    if (regPassword) {
        regPassword.addEventListener('input', (e) => {
            const val = e.target.value;
            let strength = 0;
            
            // Basic rules
            if (val.length > 7) strength += 1;
            if (val.match(/[A-Z]/) && val.match(/[a-z]/)) strength += 1;
            if (val.match(/[0-9]/)) strength += 1;
            if (val.match(/[^a-zA-Z0-9]/)) strength += 1;

            // Update UI Bars
            const bars = [
                document.getElementById('str-1'),
                document.getElementById('str-2'),
                document.getElementById('str-3'),
                document.getElementById('str-4')
            ];
            
            const textLabel = document.getElementById('strength-text');
            
            // Reset colors
            bars.forEach(bar => bar.style.background = 'rgba(255, 255, 255, 0.1)');
            bars.forEach(bar => bar.style.boxShadow = 'none');

            // Apply strength colors
            if (val.length > 0) {
                if (strength === 1) {
                    bars.style.background = 'var(--accent-red)';
                    textLabel.textContent = 'Weak';
                    textLabel.style.color = 'var(--accent-red)';
                } else if (strength === 2) {
                    bars.style.background = 'var(--accent-yellow)';
                    bars.style.background = 'var(--accent-yellow)';
                    textLabel.textContent = 'Fair';
                    textLabel.style.color = 'var(--accent-yellow)';
                } else if (strength === 3) {
                    bars.style.background = 'var(--accent-primary)';
                    bars.style.background = 'var(--accent-primary)';
                    bars.style.background = 'var(--accent-primary)';
                    textLabel.textContent = 'Good';
                    textLabel.style.color = 'var(--accent-primary)';
                } else if (strength === 4) {
                    bars.forEach(bar => {
                        bar.style.background = 'var(--accent-primary)';
                        bar.style.boxShadow = '0 0 8px var(--accent-primary)';
                    });
                    textLabel.textContent = 'Strong (S-Rank)';
                    textLabel.style.color = 'var(--accent-primary)';
                }
            } else {
                textLabel.textContent = 'Too weak';
                textLabel.style.color = 'var(--text-muted)';
            }
        });
    }

    /**
     * 4. Mouse Parallax for Floating Bento Cards
     * (Provides depth to the left visual panel)
     */
    if (parallaxArea && window.innerWidth > 1024) {
        parallaxArea.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            floatingCards.forEach((card, index) => {
                const speed = (index + 1) * 0.5; // Different depth layers
                card.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });

        parallaxArea.addEventListener('mouseleave', () => {
            floatingCards.forEach(card => {
                card.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    /**
     * 5. Form Submission Simulation (Mock API)
     */
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const handleAuthSubmit = (e, type) => {
        e.preventDefault();
        
        const btn = e.target.querySelector('.auth-submit');
        const originalText = btn.innerHTML;
        
        // UI Loading State
        btn.innerHTML = `<span class="pulse-dot" style="background:#000; margin:0 auto;"></span>`;
        btn.style.pointerEvents = 'none';

        // Simulate Network Delay (Firebase Auth Call)
        setTimeout(() => {
            // In a real app, you would validate credentials here.
            // For now, we simulate success and route to the dashboard.
            if (lvlBaseCore) {
                lvlBaseCore.log('info', `${type.toUpperCase()} Success. Routing to internal Dashboard.`);
            }
            
            btn.innerHTML = `<span>Success</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            btn.style.background = 'var(--accent-primary)';
            btn.style.color = '#000';

            // Mock Redirect
            // window.location.href = 'dashboard.html';
            
            // Reset for demo purposes after 2 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.pointerEvents = 'auto';
                e.target.reset();
            }, 2000);

        }, 1500);
    };

    if (loginForm) loginForm.addEventListener('submit', (e) => handleAuthSubmit(e, 'login'));
    if (registerForm) registerForm.addEventListener('submit', (e) => handleAuthSubmit(e, 'register'));

});
/**
 * ============================================================================
 * lvlBase - Gateway & Routing Controller
 * ============================================================================
 * Handles UI toggling between Login/Registration states, dynamically renders
 * fields based on the selected Role (Student vs Teacher), computes password 
 * strength, and simulates Firebase routing.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const modeBtns = document.querySelectorAll('.mode-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const roleRadios = document.querySelectorAll('input[name="auth_role"]');
    
    // Dynamic Form Fields
    const studentFields = document.getElementById('student-fields');
    const teacherFields = document.getElementById('teacher-fields');
    
    // Password Elements
    const regPasswordInput = document.getElementById('reg-password');
    const strengthContainer = document.querySelector('.password-strength-container');
    const strengthText = document.getElementById('strength-text');
    const togglePassBtns = document.querySelectorAll('.password-toggle');

    // Buttons
    const loginBtn = document.getElementById('login-submit-btn');
    const registerBtn = document.getElementById('register-submit-btn');
    const googleBtn = document.getElementById('google-auth-btn');

    /**
     * 1. UI State: Toggle Login vs Register
     */
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Buttons
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');

            if (target === 'login') {
                registerForm.style.display = 'none';
                loginForm.style.display = 'flex';
                // Small animation trigger
                loginForm.style.animation = 'none';
                void loginForm.offsetWidth;
                loginForm.style.animation = 'fade-in-up 0.4s ease-out';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'flex';
                registerForm.style.animation = 'none';
                void registerForm.offsetWidth;
                registerForm.style.animation = 'fade-in-up 0.4s ease-out';
            }
        });
    });

    /**
     * 2. UI State: Dynamic Role Fields
     * Changes what the user is asked based on their role (Student needs Class, Teacher needs Subject)
     */
    roleRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const role = e.target.value;
            
            // Reset visibility
            if(studentFields) studentFields.style.display = 'none';
            if(teacherFields) teacherFields.style.display = 'none';

            if (role === 'student' && studentFields) {
                studentFields.style.display = 'flex';
            } else if (role === 'teacher' && teacherFields) {
                teacherFields.style.display = 'flex';
            }
            
            // Adjust button texts to feel more personal
            if (role === 'admin') {
                loginBtn.innerHTML = `Root Access <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
            } else {
                loginBtn.innerHTML = `Secure Login <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
            }
        });
    });

    /**
     * 3. UX: Password Visibility & Strength Meter
     */
    togglePassBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const wrapper = btn.closest('.input-wrapper');
            const input = wrapper.querySelector('input');
            
            if (input.type === 'password') {
                input.type = 'text';
                btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
            } else {
                input.type = 'password';
                btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            }
        });
    });

    if (regPasswordInput && strengthContainer) {
        regPasswordInput.addEventListener('input', (e) => {
            const val = e.target.value;
            // Clear classes
            strengthContainer.classList.remove('str-weak', 'str-fair', 'str-good', 'str-strong');
            
            if (val.length === 0) {
                strengthText.innerText = "Too weak";
            } else if (val.length < 6) {
                strengthContainer.classList.add('str-weak');
                strengthText.innerText = "Weak";
            } else if (val.length < 10 || !/\d/.test(val)) {
                strengthContainer.classList.add('str-fair');
                strengthText.innerText = "Fair";
            } else if (val.length >= 10 && /\d/.test(val) && !/[!@#$%^&*]/.test(val)) {
                strengthContainer.classList.add('str-good');
                strengthText.innerText = "Good";
            } else if (val.length >= 10 && /\d/.test(val) && /[!@#$%^&*]/.test(val)) {
                strengthContainer.classList.add('str-strong');
                strengthText.innerText = "Strong";
            }
        });
    }

    /**
     * 4. Firebase Authentication & Routing Simulation
     * This logic mimics the async calls to Firebase Auth and routes the 
     * user to their specific dashboard based on their role claim.
     */
    const handleAuthRouting = (btnElement, originalText, isRegistration) => {
        // UI Loading State
        btnElement.innerHTML = `<span class="pulse-dot" style="background:#000; margin:0 auto;"></span>`;
        btnElement.style.pointerEvents = 'none';

        // Determine target Role
        const selectedRole = document.querySelector('input[name="auth_role"]:checked').value;

        // Mock Firebase Network Delay
        setTimeout(() => {
            if (lvlBaseCore) lvlBaseCore.log('info', `Firebase Auth Handshake Successful. Role: [${selectedRole.toUpperCase()}]`);
            
            btnElement.innerHTML = `Authenticated <svg width="18" height="18" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            btnElement.style.background = 'var(--accent-primary)';
            btnElement.style.color = '#000';

            // Route based on role
            setTimeout(() => {
                if (isRegistration && selectedRole === 'student') {
                    // Students must go through the Guild Selection Initiation
                    window.location.href = 'guild-selection.html';
                } else if (selectedRole === 'student') {
                    window.location.href = 'services/student/dashboard.html';
                } else if (selectedRole === 'teacher') {
                    window.location.href = 'services/teacher/dashboard.html';
                } else if (selectedRole === 'parent') {
                    window.location.href = 'services/parent/dashboard.html';
                } else if (selectedRole === 'admin') {
                    window.location.href = 'services/admin/core.html';
                }
            }, 1000);

        }, 1500);
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuthRouting(loginBtn, loginBtn.innerHTML, false);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuthRouting(registerBtn, registerBtn.innerHTML, true);
        });
    }

    // Google Auth Simulation
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const ogHtml = googleBtn.innerHTML;
            googleBtn.innerHTML = `<span class="pulse-dot" style="background:currentColor; margin:0 auto;"></span>`;
            setTimeout(() => { handleAuthRouting(googleBtn, ogHtml, false); }, 800);
        });
    }

});