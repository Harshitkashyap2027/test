/**
 * ============================================================================
 * lvlBase - Global Ecosystem Core
 * ============================================================================
 * Handles Firebase initialization, global authentication state, theme 
 * management, and core utility functions required across all pages.
 */

const lvlBaseCore = (function() {
    'use strict';

    // --- Configuration & Environment ---
    const CONFIG = {
        version: '2.0.0',
        debugMode: true,
        apiEndpoint: 'https://api.lvlbase.in/v1',
        themeKey: 'lvlBase_theme_preference',
        authKey: 'lvlBase_session_token'
    };

    // --- Firebase Configuration Mock ---
    // In production, replace with actual Firebase config object
    const firebaseConfig = {
        apiKey: "AIzaSy_MOCK_API_KEY_GENERATED_FOR_LVLBASE",
        authDomain: "lvlbase-platform.firebaseapp.com",
        projectId: "lvlbase-platform",
        storageBucket: "lvlbase-platform.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef1234567890",
        measurementId: "G-MOCKMEASURE"
    };

    // --- Core State Management ---
    const state = {
        isInitialized: false,
        user: null,
        theme: 'dark', // Default to dark for bento glassmorphism
        networkStatus: navigator.onLine ? 'online' : 'offline'
    };

    /**
     * Logger Utility for Debugging
     * @param {string} level - 'info', 'warn', 'error'
     * @param {string} message - The message to log
     * @param {object} data - Additional data payload
     */
    const logger = (level, message, data = {}) => {
        if (!CONFIG.debugMode) return;
        const timestamp = new Date().toISOString();
        const prefix = `[lvlBase Core] ${timestamp} -`;
        
        switch (level) {
            case 'info':
                console.log(`%c${prefix} ${message}`, 'color: #00FF88; font-weight: bold;', data);
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`, data);
                break;
            case 'error':
                console.error(`${prefix} ${message}`, data);
                break;
            default:
                console.log(`${prefix} ${message}`, data);
        }
    };

    /**
     * Initialize the Application
     */
    const init = () => {
        if (state.isInitialized) return;
        
        logger('info', 'Initializing lvlBase Ecosystem Architecture...');
        
        // 1. Setup Theme
        initializeTheme();
        
        // 2. Setup Network Listeners
        setupNetworkListeners();
        
        // 3. Mock Firebase Initialization
        initializeFirebase();
        
        // 4. Setup Global Event Listeners
        setupGlobalListeners();

        state.isInitialized = true;
        logger('info', 'lvlBase Ecosystem Initialized Successfully. Version:', CONFIG.version);
    };

    /**
     * Theme Management (Dark Mode / Glassmorphism specific)
     */
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem(CONFIG.themeKey);
        const osPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        // We enforce dark theme as primary for the neon bento design, but allow override
        state.theme = savedTheme || 'dark'; 
        
        applyTheme(state.theme);

        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(CONFIG.themeKey)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    };

    const applyTheme = (themeName) => {
        if (themeName === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem(CONFIG.themeKey, themeName);
        state.theme = themeName;
    };

    /**
     * Network Connectivity Handlers
     */
    const setupNetworkListeners = () => {
        window.addEventListener('online', () => {
            state.networkStatus = 'online';
            logger('info', 'Network connection restored. Syncing pending XP queues.');
            document.body.classList.remove('network-offline');
        });

        window.addEventListener('offline', () => {
            state.networkStatus = 'offline';
            logger('warn', 'Network connection lost. Entering offline mode.');
            document.body.classList.add('network-offline');
            // Trigger offline UI toast notification here if needed
        });
    };

    /**
     * Firebase Mock Initialization
     */
    const initializeFirebase = () => {
        logger('info', 'Connecting to Firebase Multi-Tenant Clusters...', firebaseConfig);
        // Mock connection delay
        setTimeout(() => {
            logger('info', 'Firebase Clusters Connected. Verifying Auth State.');
            checkAuthState();
        }, 800);
    };

    /**
     * Authentication State Verification
     */
    const checkAuthState = () => {
        const token = localStorage.getItem(CONFIG.authKey);
        if (token) {
            // Mock token verification
            state.user = {
                uid: 'user_mock_99123',
                role: 'administrator',
                organizationId: 'org_lvlbase_001',
                rank: 'S'
            };
            logger('info', 'Valid session found. User authenticated.', state.user);
            updateNavigationForAuth();
        } else {
            logger('info', 'No active session. Operating in public view mode.');
        }
    };

    const updateNavigationForAuth = () => {
        const authButtons = document.querySelector('.nav-actions');
        if (authButtons && state.user) {
            authButtons.innerHTML = `
                <div class="user-profile-mini">
                    <span class="rank-badge-mini">Rank ${state.user.rank}</span>
                    <a href="dashboard.html" class="btn btn-primary bento-glow">Dashboard</a>
                </div>
            `;
        }
    };

    /**
     * Global Event Listeners (Security & Utility)
     */
    const setupGlobalListeners = () => {
        // Prevent default drag behaviors on mockups to keep UI pristine
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG' || e.target.classList.contains('bento-card')) {
                e.preventDefault();
            }
        });
    };

    // Public API exposed to other scripts
    return {
        init,
        getConfig: () => CONFIG,
        getState: () => state,
        setTheme: applyTheme,
        log: logger
    };

})();

// Boot up the core when DOM is ready
document.addEventListener('DOMContentLoaded', lvlBaseCore.init);