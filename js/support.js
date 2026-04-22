/**
 * ============================================================================
 * lvlBase - Help Center & Support Controller
 * ============================================================================
 * Handles ticket form simulation, the Jarvis support chatbot interactions,
 * and entrance animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const ticketForm = document.getElementById('ticket-form');
    const submitBtn = document.getElementById('submit-ticket-btn');
    const chatInput = document.getElementById('support-chat-input');
    const chatSend = document.getElementById('support-chat-send');
    const chatBox = document.getElementById('support-chat-box');
    const promptChips = document.querySelectorAll('.prompt-chip');

    /**
     * 1. Ticket Submission Simulation
     */
    if (ticketForm) {
        ticketForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic UI State Loading
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span class="pulse-dot" style="background:#000; margin:0 auto;"></span>`;
            submitBtn.style.pointerEvents = 'none';

            // Simulate Network Request to backend
            setTimeout(() => {
                if (lvlBaseCore) {
                    lvlBaseCore.log('info', 'Support ticket successfully securely routed to helpdesk node.');
                }
                
                // Success State
                submitBtn.innerHTML = `<span>Ticket Submitted</span> <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                submitBtn.style.background = 'var(--accent-primary)';
                submitBtn.style.color = '#000';
                
                // Reset Form
                ticketForm.reset();
                
                // Restore button
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.style.pointerEvents = 'auto';
                }, 3000);

            }, 1500);
        });
    }

    /**
     * 2. AI Support Chatbot Logic (Jarvis Lite)
     */
    let isProcessing = false;

    // Mock Knowledge Base Responses
    const kbResponses = {
        "reset": "To reset a user's rank, navigate to the **Directory > User Profile**. Under the Gamification tab, click 'Override XP' and set the value to 0. This will automatically demote them to Rank E. Note: Requires Root Admin access.",
        "stripe": "Your Stripe API keys are configured in the **Integrations Hub**. Go to Settings > Integrations > Payments. You will need both your Publishable Key and Secret Key to finalize the connection.",
        "gamification": "The gamification engine uses a dynamic multiplier. Base XP is multiplied by `1.15^Difficulty`. Ranks progress from E (0 XP) up to S (250,000+ XP). You can tweak the base multipliers in the Gamification Settings module.",
        "default": "I understand you need assistance. Based on the documentation, I recommend checking the Settings panel or submitting a Support Ticket above if this requires developer intervention."
    };

    const scrollToBottom = () => {
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    };

    const addUserMessage = (text) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-msg';
        msgDiv.innerHTML = `<div class="msg-avatar">U</div><div class="msg-bubble">${text}</div>`;
        chatBox.appendChild(msgDiv);
        scrollToBottom();
    };

    const addAIMessage = (text) => {
        isProcessing = true;
        
        // Typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-msg temp-typing';
        typingDiv.innerHTML = `
            <div class="msg-avatar">🤖</div>
            <div class="msg-bubble" style="display:flex; align-items:center; gap:4px; padding: 16px;">
                <span class="dot" style="background:var(--text-muted); width:6px; height:6px; animation: pulse-glow 1s infinite alternate;"></span>
                <span class="dot" style="background:var(--text-muted); width:6px; height:6px; animation: pulse-glow 1s infinite alternate 0.2s;"></span>
                <span class="dot" style="background:var(--text-muted); width:6px; height:6px; animation: pulse-glow 1s infinite alternate 0.4s;"></span>
            </div>
        `;
        chatBox.appendChild(typingDiv);
        scrollToBottom();

        // Delay for realism
        setTimeout(() => {
            const temp = document.querySelector('.temp-typing');
            if (temp) temp.remove();

            // Simple markdown bold parsing for UI
            const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent-primary);">$1</strong>')
                                      .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:4px; font-family:monospace; color:var(--accent-secondary);">$1</code>');

            const msgDiv = document.createElement('div');
            msgDiv.className = 'message ai-msg';
            msgDiv.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble">${formattedText}</div>`;
            
            chatBox.appendChild(msgDiv);
            scrollToBottom();
            isProcessing = false;
        }, 1000);
    };

    const processChat = (text) => {
        if (!text.trim() || isProcessing) return;
        
        addUserMessage(text);
        if (chatInput) chatInput.value = '';

        const lowerTxt = text.toLowerCase();
        let reply = kbResponses["default"];

        if (lowerTxt.includes("reset") || lowerTxt.includes("rank")) reply = kbResponses["reset"];
        else if (lowerTxt.includes("stripe") || lowerTxt.includes("key")) reply = kbResponses["stripe"];
        else if (lowerTxt.includes("gamification") || lowerTxt.includes("math")) reply = kbResponses["gamification"];

        addAIMessage(reply);
    };

    // Chat Event Listeners
    if (chatSend && chatInput) {
        chatSend.addEventListener('click', () => processChat(chatInput.value));
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') processChat(chatInput.value);
        });
    }

    // Quick Prompts
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            processChat(chip.innerText);
        });
    });

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

    if (lvlBaseCore) lvlBaseCore.log('info', 'Help Center UI & Ticketing engine active.');
    initEntranceAnimations();
});