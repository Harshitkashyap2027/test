/**
 * ============================================================================
 * lvlBase - Core Authentication & Role Router
 * ============================================================================
 * Manages Firebase Auth states, enforces Zero-Trust redirects, and 
 * routes users to Student, Teacher, or Admin services based on claims.
 */

const lvlBaseCore = (function() {
    'use strict';

    // --- Environment Config ---
    const CONFIG = {
        appName: 'lvlBase OS',
        version: '3.0.0-school',
        debug: true,
        sessionKey: 'lvl_tenant_session'
    };

    // --- Mock Firebase Auth State ---
    const authState = {
        isAuthenticated: false,
        user: null,
        token: null
    };

    /**
     * Logger Utility for Debugging (Matches standard OS output)
     */
    const logger = (level, message, data = {}) => {
        if (!CONFIG.debug) return;
        const ts = new Date().toISOString().split('T').slice(0, -1);
        const prefix = `[${CONFIG.appName}] [${ts}]`;
        
        switch (level) {
            case 'info': console.log(`%c${prefix} [INFO] ${message}`, 'color: #00FF88;', data); break;
            case 'warn': console.warn(`${prefix} [WARN] ${message}`, data); break;
            case 'error': console.error(`${prefix} [ERROR] ${message}`, data); break;
            default: console.log(`${prefix} ${message}`, data);
        }
    };

    /**
     * 1. Initialize Session
     */
    const init = () => {
        logger('info', 'Booting Core Authentication Architecture...');
        checkSession();
        setupGlobalSecurityListeners();
    };

    /**
     * 2. Session Verification & Routing
     */
    const checkSession = () => {
        const storedSession = localStorage.getItem(CONFIG.sessionKey);
        
        // For Sandbox/Demo purposes, we will mock a student session if we are on a dashboard page
        // In production, this strictly verifies Firebase JWT tokens.
        if (window.location.pathname.includes('/services/')) {
            mockValidSession();
        } else {
            logger('info', 'Public route detected. No strict auth required.');
        }
    };

    const mockValidSession = () => {
        // Mocking a payload that Firebase would return
        authState.isAuthenticated = true;
        authState.user = {
            uid: "std_49102",
            email: "alex.c@school.edu",
            role: "student", // Could be 'teacher', 'admin', 'parent'
            guild: "azure",
            tenantId: "tnt_omega_high"
        };
        
        logger('info', `Session verified. Role: [${authState.user.role.toUpperCase()}]. Tenant: [${authState.user.tenantId}]`);
        enforceRoleAccess();
    };

    /**
     * 3. Zero-Trust Role Enforcer
     * Prevents a Student from accessing the Admin or Teacher directories.
     */
    const enforceRoleAccess = () => {
        const currentPath = window.location.pathname;
        
        // If user is a student, but path contains /admin/ or /teacher/
        if (authState.user.role === 'student' && (currentPath.includes('/admin/') || currentPath.includes('/teacher/'))) {
            logger('error', 'SECURITY VIOLATION: Unauthorized Role Access Attempt.');
            document.body.innerHTML = `
                <div style="height:100vh; display:flex; align-items:center; justify-content:center; background:#050505; color:#FF3366; font-family:monospace; flex-direction:column;">
                    <h1 style="font-size:4rem;">403 FORBIDDEN</h1>
                    <p>Zero-Trust Security Protocol triggered. Role [STUDENT] cannot access this module.</p>
                    <a href="../student/dashboard.html" style="margin-top:20px; color:#fff; text-decoration:underline;">Return to safe zone</a>
                </div>
            `;
            // window.location.href = '../student/dashboard.html'; // Auto redirect in prod
        }
    };

    /**
     * 4. Login Simulator (For Auth.html)
     */
    const simulateLogin = (email, password) => {
        logger('info', 'Authenticating payload against Firebase Nodes...');
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    // Save mock token
                    localStorage.setItem(CONFIG.sessionKey, 'mock_jwt_token_8f9a');
                    resolve({ status: 'success', role: 'student' });
                } else {
                    reject({ status: 'error', message: 'Invalid Credentials' });
                }
            }, 1200);
        });
    };

    /**
     * 5. Security Context Listeners
     */
    const setupGlobalSecurityListeners = () => {
        // Prevent devtools inspecting sensitive elements in production
        document.addEventListener('contextmenu', e => {
            if (e.target.classList.contains('secure-data')) {
                e.preventDefault();
                logger('warn', 'Context menu blocked on secured element.');
            }
        });
    };

    // Expose Public Methods
    return {
        init,
        log: logger,
        login: simulateLogin,
        getUser: () => authState.user,
        logout: () => {
            localStorage.removeItem(CONFIG.sessionKey);
            window.location.href = '../../auth.html';
        }
    };

})();

// Initialize Core Auth
document.addEventListener('DOMContentLoaded', lvlBaseCore.init);