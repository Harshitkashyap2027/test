/**
 * ============================================================================
 * lvlBase - Integrations & Webhooks Controller
 * ============================================================================
 * Handles live filtering of integration cards, simulated OAuth connections,
 * and the real-time Webhook terminal firehose.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements: Integrations Panel ---
    const searchInput = document.getElementById('int-search');
    const categoryBtns = document.querySelectorAll('.int-category-list li');
    const intCards = document.querySelectorAll('.int-card');
    const toggleSwitches = document.querySelectorAll('.int-card .switch input');
    const configureBtns = document.querySelectorAll('.configure-btn');

    // --- DOM Elements: Webhook Terminal ---
    const terminalBody = document.getElementById('webhook-logs');
    const clearLogsBtn = document.getElementById('clear-logs');
    const testBtns = document.querySelectorAll('.trigger-test');

    // --- State ---
    let currentFilter = {
        text: '',
        category: 'all'
    };

    let webhookInterval;

    /**
     * 1. Filter Engine for Integration Cards
     */
    const filterIntegrations = () => {
        let visibleCount = 0;

        intCards.forEach(card => {
            const title = card.querySelector('.int-title').innerText.toLowerCase();
            const desc = card.querySelector('.int-desc').innerText.toLowerCase();
            const category = card.getAttribute('data-cat');

            const matchesText = currentFilter.text === '' || 
                                title.includes(currentFilter.text) || 
                                desc.includes(currentFilter.text);
            
            const matchesCategory = currentFilter.category === 'all' || 
                                    category === currentFilter.category;

            if (matchesText && matchesCategory) {
                card.style.display = 'flex';
                // Small trick to re-trigger opacity transition
                setTimeout(() => { card.style.opacity = '1'; }, 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });

        if (lvlBaseCore && visibleCount === 0) {
            lvlBaseCore.log('warn', 'No integrations match current filter criteria.');
        }
    };

    // Text Search Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilter.text = e.target.value.toLowerCase();
            filterIntegrations();
        });
    }

    // Category Click Listener
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter.category = btn.getAttribute('data-cat');
            filterIntegrations();
        });
    });

    /**
     * 2. Simulated OAuth Connection Toggle
     * Animates the connection state visually when a user toggles an integration.
     */
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function(e) {
            const card = this.closest('.int-card');
            const statusIndicator = card.querySelector('.connection-status');
            const primaryBtn = card.querySelector('.int-footer .btn');
            const title = card.querySelector('.int-title').innerText;

            if (this.checked) {
                // Connecting State
                statusIndicator.className = 'connection-status';
                statusIndicator.innerText = 'Connecting...';
                statusIndicator.style.background = 'rgba(255,255,255,0.1)';
                statusIndicator.style.color = '#fff';
                statusIndicator.style.borderColor = 'transparent';
                
                primaryBtn.innerText = 'Configuring';
                primaryBtn.className = 'btn btn-outline btn-small configure-btn';
                
                // Simulate Network Delay
                setTimeout(() => {
                    statusIndicator.className = 'connection-status connected';
                    statusIndicator.innerText = 'Connected';
                    statusIndicator.style.background = ''; // Reset to CSS class styles
                    statusIndicator.style.color = '';
                    statusIndicator.style.borderColor = '';
                    
                    primaryBtn.innerText = 'Configure';
                    
                    if (lvlBaseCore) lvlBaseCore.log('info', `Successfully connected to ${title} API.`);
                }, 1500);

            } else {
                // Disconnecting State
                statusIndicator.className = 'connection-status not-connected';
                statusIndicator.innerText = 'Not Connected';
                
                primaryBtn.innerText = 'Connect';
                primaryBtn.className = 'btn btn-primary btn-small';
                
                if (lvlBaseCore) lvlBaseCore.log('warn', `Disconnected from ${title} API.`);
            }
        });
    });

    /**
     * 3. Webhook Terminal Firehose Simulator
     * Continuously injects mock JSON payloads to simulate system activity.
     */
    
    // Helper to format timestamps
    const getTimestamp = () => {
        const now = new Date();
        return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    };
    
    const getISOString = () => new Date().toISOString();

    const mockPayloads = [
        {
            endpoint: '/xp.granted',
            method: 'POST',
            status: '200 OK',
            statusClass: 'success',
            generateBody: () => `{
  "event": "xp.granted",
  "data": {
    "user_id": "usr_${Math.floor(Math.random() * 90000) + 10000}",
    "amount": ${Math.floor(Math.random() * 500) + 50},
    "source": "quest_completion"
  },
  "timestamp": "${getISOString()}"
}`
        },
        {
            endpoint: '/guild.mission_complete',
            method: 'POST',
            status: '200 OK',
            statusClass: 'success',
            generateBody: () => `{
  "event": "guild.mission_complete",
  "data": {
    "guild_id": "gld_engineering",
    "mission_id": "msn_q3_sprint",
    "total_xp_rewarded": 15000
  },
  "timestamp": "${getISOString()}"
}`
        },
        {
            endpoint: '/user.login_anomaly',
            method: 'POST',
            status: '403 FORBIDDEN',
            statusClass: 'error',
            generateBody: () => `{
  "event": "sec.anomaly_detected",
  "data": {
    "ip_address": "192.168.1.${Math.floor(Math.random() * 255)}",
    "reason": "Failed JWT signature validation",
    "action": "IP_BLOCKED"
  },
  "timestamp": "${getISOString()}"
}`
        }
    ];

    const appendLog = (endpoint, method, status, statusClass, bodyText) => {
        if (!terminalBody) return;

        // Create Header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'log-entry';
        headerDiv.innerHTML = `
            <span class="log-time">${getTimestamp()}</span>
            <span class="log-method post">${method}</span>
            <span class="log-endpoint">${endpoint}</span>
            <span class="log-status ${statusClass}">${status}</span>
        `;

        // Create Body
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'log-payload';
        if (statusClass === 'error') bodyDiv.style.borderLeftColor = 'var(--accent-red)';
        bodyDiv.innerHTML = `<pre><code>${bodyText}</code></pre>`;

        // Append and Scroll
        terminalBody.appendChild(headerDiv);
        terminalBody.appendChild(bodyDiv);

        terminalBody.scrollTo({
            top: terminalBody.scrollHeight,
            behavior: 'smooth'
        });

        // Memory Management: Keep only last 20 elements (10 logs)
        while (terminalBody.children.length > 40) {
            terminalBody.removeChild(terminalBody.firstChild);
        }
    };

    const startFirehose = () => {
        webhookInterval = setInterval(() => {
            // Randomly decide whether to fire a webhook this tick (adds realistic delay)
            if (Math.random() > 0.6) {
                const randomPayload = mockPayloads[Math.floor(Math.random() * mockPayloads.length)];
                appendLog(
                    randomPayload.endpoint, 
                    randomPayload.method, 
                    randomPayload.status, 
                    randomPayload.statusClass, 
                    randomPayload.generateBody()
                );
            }
        }, 2500); // Check every 2.5 seconds
    };

    // Clear Logs Button
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', () => {
            terminalBody.innerHTML = '';
            appendLog('/system.terminal', 'INFO', 'CLEARED', 'success', '// Terminal history wiped by Admin.');
        });
    }

    /**
     * 4. Manual Webhook Triggers (Test Buttons)
     */
    testBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventType = btn.getAttribute('data-event');
            
            // Visual feedback on button
            const originalText = btn.innerText;
            btn.innerText = 'Firing...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerText = 'Sent!';
                btn.style.background = 'var(--accent-primary)';
                btn.style.color = '#000';
                btn.style.opacity = '1';
                
                // Inject specific payload based on button
                let payloadData = '';
                if (eventType === 'user.created') {
                    payloadData = `{
  "event": "user.created",
  "data": { "email": "new.hire@company.com", "role": "employee", "initial_rank": "E" },
  "timestamp": "${getISOString()}"
}`;
                } else if (eventType === 'quest.completed') {
                    payloadData = `{
  "event": "quest.completed",
  "data": { "quest_id": "qst_update_repo", "user_id": "usr_active", "xp_earned": 250 },
  "timestamp": "${getISOString()}"
}`;
                } else if (eventType === 'payment.success') {
                    payloadData = `{
  "event": "payment.success",
  "data": { "invoice_id": "inv_99812", "amount_usd": 299.00, "status": "cleared" },
  "timestamp": "${getISOString()}"
}`;
                }

                appendLog(`/${eventType}`, 'POST', '200 OK', 'success', payloadData);

                // Reset button
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 2000);

            }, 600);
        });
    });

    /**
     * 5. Initialize Intersection Observers (Entrance Animations)
     */
    const initEntranceAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            scrollObserver.observe(el);
        });
        
        // Slightly stagger integration cards
        intCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index); // Stagger based on index
        });
    };

    // Boot Up
    if (lvlBaseCore) lvlBaseCore.log('info', 'Integrations Hub & Webhook Engine initialized.');
    initEntranceAnimations();
    startFirehose();
});