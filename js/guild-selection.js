/**
 * ============================================================================
 * lvlBase - Guild Selection Controller (The Initiation)
 * ============================================================================
 * Handles the mutual exclusivity of guild card selection, dynamic CSS variable 
 * overrides for the immersive glows, and the final confirmation sequence.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const gridContainer = document.querySelector('.guild-grid');
    const guildCards = document.querySelectorAll('.guild-card');
    const dynamicGlow1 = document.querySelector('.dynamic-glow-1');
    const dynamicGlow2 = document.querySelector('.dynamic-glow-2');
    const particlesContainer = document.getElementById('particles');
    
    // Action Bar Elements
    const actionBar = document.querySelector('.action-bar-container');
    const statusText = document.getElementById('selection-status');
    const confirmBtn = document.getElementById('confirm-guild-btn');
    
    // Overlay Elements
    const overlay = document.getElementById('initiation-overlay');
    const overlayIcon = document.getElementById('overlay-icon');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayText = document.getElementById('overlay-text');
    const progressBar = document.getElementById('init-progress');

    // --- State ---
    let selectedGuildData = null;

    // --- Guild Color Mapping ---
    const guildColors = {
        shadow: { hex: '#B026FF', name: 'Shadow Guild' },
        azure: { hex: '#0088FF', name: 'Azure Mind' },
        inferno: { hex: '#FF3366', name: 'Inferno Squad' },
        titan: { hex: '#00FF88', name: 'Titan Force' },
        zenith: { hex: '#FFD700', name: 'Zenith Order' }
    };

    /**
     * 1. Dynamic Particles Generator
     * Creates an immersive floating particle effect in the background
     */
    const createParticles = () => {
        if (!particlesContainer) return;
        const particleCount = window.innerWidth > 768 ? 40 : 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Randomize position, size, and animation delay
            const size = Math.random() * 4 + 1;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 10;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            particlesContainer.appendChild(particle);
        }
    };

    /**
     * 2. Hover Physics & Ambient Glow Synchronization
     */
    guildCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Only shift ambient glow if no guild is permanently selected
            if (!selectedGuildData) {
                const guildId = card.getAttribute('data-guild');
                const color = guildColors[guildId].hex;
                
                dynamicGlow1.style.background = `radial-gradient(circle, ${color}33, transparent 70%)`;
                dynamicGlow2.style.background = `radial-gradient(circle, ${color}22, transparent 70%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!selectedGuildData) {
                // Revert to neutral white glow
                dynamicGlow1.style.background = `radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)`;
                dynamicGlow2.style.background = `radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)`;
            }
        });
    });

    /**
     * 3. Selection Logic (Mutual Exclusivity)
     */
    guildCards.forEach(card => {
        card.addEventListener('click', () => {
            const guildId = card.getAttribute('data-guild');
            const color = guildColors[guildId].hex;
            const name = guildColors[guildId].name;

            // If clicking the already selected card, deselect it
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                gridContainer.classList.remove('has-selection');
                selectedGuildData = null;
                
                // Reset Action Bar
                actionBar.classList.remove('active-state');
                actionBar.style.removeProperty('--selected-color');
                actionBar.style.removeProperty('--selected-bg');
                
                statusText.innerText = "Awaiting selection...";
                statusText.classList.remove('selected');
                
                confirmBtn.classList.remove('ready');
                confirmBtn.classList.add('disabled');
                confirmBtn.innerHTML = `<span>Pledge Allegiance</span><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
                
                // Revert Background
                dynamicGlow1.style.background = `radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)`;
                dynamicGlow2.style.background = `radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)`;
                
                return;
            }

            // --- New Selection ---
            
            // Remove selection from all cards
            guildCards.forEach(c => c.classList.remove('selected'));
            
            // Apply to chosen card and container
            card.classList.add('selected');
            gridContainer.classList.add('has-selection');
            
            // Save state
            selectedGuildData = { id: guildId, color: color, name: name };
            
            // Lock Ambient Glow to chosen color
            dynamicGlow1.style.background = `radial-gradient(circle, ${color}44, transparent 70%)`;
            dynamicGlow2.style.background = `radial-gradient(circle, ${color}22, transparent 70%)`;
            
            // Update Action Bar UI
            actionBar.style.setProperty('--selected-color', color);
            actionBar.style.setProperty('--selected-bg', `${color}33`);
            actionBar.classList.add('active-state');
            
            statusText.innerText = `Selected: ${name}`;
            statusText.classList.add('selected');
            
            confirmBtn.classList.remove('disabled');
            confirmBtn.classList.add('ready');
            confirmBtn.innerHTML = `<span>Confirm ${name}</span><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        });
    });

    /**
     * 4. Confirmation Sequence (The Initiation Modal)
     */
    confirmBtn.addEventListener('click', () => {
        if (!selectedGuildData) return;

        // 1. Lock scroll and extract the SVG from the selected card
        document.body.style.overflow = 'hidden';
        const selectedCard = document.querySelector(`.guild-card[data-guild="${selectedGuildData.id}"]`);
        const svgClone = selectedCard.querySelector('svg').cloneNode(true);
        
        // 2. Setup the Overlay
        overlay.style.setProperty('--selected-color', selectedGuildData.color);
        overlayIcon.innerHTML = '';
        overlayIcon.appendChild(svgClone);
        
        overlayTitle.innerText = `Pledged to ${selectedGuildData.name}`;
        overlayText.innerText = `Syncing Rank Data...`;
        
        // 3. Trigger Overlay
        overlay.classList.add('active');

        // 4. Simulate Processing Sequence
        setTimeout(() => { progressBar.style.width = '30%'; overlayText.innerText = `Configuring Skill DNA Metrics...`; }, 500);
        setTimeout(() => { progressBar.style.width = '70%'; overlayText.innerText = `Generating Daily Quests...`; }, 1500);
        setTimeout(() => { progressBar.style.width = '100%'; overlayText.innerText = `Initiation Complete.`; }, 2500);

        // 5. Final Redirect to Dashboard
        setTimeout(() => {
            if (lvlBaseCore) {
                lvlBaseCore.log('info', `User assigned to Guild: ${selectedGuildData.name}. Routing to dashboard.`);
                // Mock saving to Firebase/Local storage
                localStorage.setItem('lvl_user_guild', selectedGuildData.id);
            }
            
            // Redirect to the student dashboard we built in the previous step
            window.location.href = 'services/student/dashboard.html';
        }, 3200);
    });

    /**
     * 5. Initialize
     */
    const init = () => {
        if (lvlBaseCore) lvlBaseCore.log('info', 'Guild Selection Engine Online.');
        createParticles();

        // Entrance animations for grid
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        const container = document.querySelector('.guild-grid-container');
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(40px)';
            scrollObserver.observe(container);
        }
    };

    init();
});