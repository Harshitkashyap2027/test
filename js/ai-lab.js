/**
 * ============================================================================
 * lvlBase - AI Lab Controller (Jarvis Interface)
 * ============================================================================
 * Manages the mock chat terminal, voice button interactions, and dynamic 
 * updates to the predictive analytics cards.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements: Jarvis Terminal ---
    const chatContainer = document.getElementById('chat-container');
    const commandInput = document.getElementById('ai-command-input');
    const sendBtn = document.getElementById('send-command');
    const voiceBtn = document.getElementById('voice-trigger');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // --- Jarvis Logic State ---
    let isProcessing = false;

    // Mock Responses Library
    const aiResponses = {
        "dropout risk": "Generating Attrition Report... I found 14 anomalies in the B-Tech 3rd year cluster. The primary indicator is a 40% drop in Quest completion. I have generated a draft email to their respective Guild Leaders. Shall I send it?",
        "route power": "Executing command. Rerouting 20% compute capacity to Tenant A. Server load balanced. New latency is <12ms.",
        "approve": "Accessing HRMS Module... 12 Rank-C leave requests found. Validating against current sprint capacity... All approved. Organization databases synced.",
        "default": "Command parsed. Analyzing request against current multi-tenant data sets. To execute complex operations, please specify the exact Module (e.g., Academic, Finance, or Gamification) you wish to modify."
    };

    /**
     * UI Helper: Scroll to bottom of chat
     */
    const scrollToBottom = () => {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    };

    /**
     * Build User Message HTML
     */
    const addUserMessage = (text) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message user-msg';
        msgDiv.innerHTML = `
            <div class="msg-avatar">U</div>
            <div class="msg-content">
                <p>${text}</p>
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    };

    /**
     * Build AI Message HTML with typing simulation
     */
    const addAIMessage = (text) => {
        isProcessing = true;
        
        // Show Typing Indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message system-msg temp-typing';
        typingDiv.innerHTML = `
            <div class="msg-avatar">🤖</div>
            <div class="msg-content">
                <div class="typing-indicator"><span></span><span></span><span></span></div>
            </div>
        `;
        chatContainer.appendChild(typingDiv);
        scrollToBottom();

        // Simulate network/thinking delay
        setTimeout(() => {
            // Remove typing indicator
            const temp = document.querySelector('.temp-typing');
            if (temp) temp.remove();

            // Add actual response
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message system-msg';
            
            // Highlight specific keywords in the response for visual flair
            let formattedText = text.replace(/14 anomalies/g, '<code style="color: var(--accent-red);">14 anomalies</code>')
                                    .replace(/20% compute capacity/g, '<code>20% compute capacity</code>')
                                    .replace(/All approved/g, '<code style="color: var(--accent-primary);">All approved</code>');

            msgDiv.innerHTML = `
                <div class="msg-avatar" style="box-shadow: 0 0 15px rgba(0,255,136,0.3); border-color: var(--accent-primary);">🤖</div>
                <div class="msg-content">
                    <p>${formattedText}</p>
                </div>
            `;
            chatContainer.appendChild(msgDiv);
            scrollToBottom();
            isProcessing = false;
        }, 1200);
    };

    /**
     * Process Command Logic
     */
    const processCommand = (command) => {
        if (!command.trim() || isProcessing) return;
        
        // 1. Add User Msg
        addUserMessage(command);
        commandInput.value = '';

        // 2. Determine Response
        const lowerCmd = command.toLowerCase();
        let response = aiResponses["default"];

        if (lowerCmd.includes("dropout") || lowerCmd.includes("risk")) {
            response = aiResponses["dropout risk"];
        } else if (lowerCmd.includes("power") || lowerCmd.includes("route")) {
            response = aiResponses["route power"];
        } else if (lowerCmd.includes("approve") || lowerCmd.includes("leave")) {
            response = aiResponses["approve"];
        }

        // 3. Trigger AI Reply
        addAIMessage(response);
    };

    // --- Event Listeners for Terminal ---
    
    // Send Button
    sendBtn.addEventListener('click', () => processCommand(commandInput.value));

    // Enter Key
    commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processCommand(commandInput.value);
    });

    // Suggestion Chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const text = chip.innerText.replace(/"/g, ''); // Remove quotes
            processCommand(text);
        });
    });

    // Mock Voice Button Interaction
    voiceBtn.addEventListener('click', () => {
        if (isProcessing) return;
        
        voiceBtn.classList.toggle('recording');
        
        if (voiceBtn.classList.contains('recording')) {
            commandInput.placeholder = "Listening... Speak now.";
            // Auto stop recording simulation
            setTimeout(() => {
                if (voiceBtn.classList.contains('recording')) {
                    voiceBtn.classList.remove('recording');
                    commandInput.placeholder = "Type a command or ask a question to the system...";
                    processCommand("Show me the dropout risk report"); // Simulate recognized speech
                }
            }, 3000);
        } else {
            commandInput.placeholder = "Type a command or ask a question to the system...";
        }
    });

    /**
     * ========================================================================
     * Dynamic Live Updates (Section 2 - Analytics)
     * Simulates the AI continuously optimizing the system in the background
     * ========================================================================
     */
    const initLiveAnalytics = () => {
        const riskBar = document.querySelector('.risk-bar-fill');
        const riskValText = document.querySelector('.risk-value');
        const economyBars = document.querySelectorAll('.bar-actual');

        if (!riskBar) return;

        // Randomly fluctuate data to feel "alive"
        setInterval(() => {
            // Risk Fluctuation
            const currentRisk = parseInt(riskBar.style.width);
            const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            let newRisk = currentRisk + fluctuation;
            
            // Clamp values
            if (newRisk > 90) newRisk = 90;
            if (newRisk < 40) newRisk = 40;

            riskBar.style.width = `${newRisk}%`;
            
            // Keep the HTML structure intact when updating text
            riskValText.innerHTML = `${newRisk}% <span class="trend ${fluctuation >= 0 ? 'up' : ''}" style="${fluctuation < 0 ? 'color: var(--accent-primary); background: rgba(0,255,136,0.1);' : ''}">${fluctuation >= 0 ? '↑' : '↓'} ${Math.abs(fluctuation)}% this hr</span>`;

            // Economy Graph Fluctuation
            economyBars.forEach(bar => {
                const currentH = parseInt(bar.style.height);
                const varH = Math.floor(Math.random() * 6) - 3;
                let newH = currentH + varH;
                if (newH > 100) newH = 100;
                if (newH < 20) newH = 20;
                bar.style.height = `${newH}%`;
            });

        }, 4000); // Update every 4 seconds
    };

    // Boot up the live modules
    if (lvlBaseCore) lvlBaseCore.log('info', 'AI Neural Core scripts loaded successfully.');
    initLiveAnalytics();
});