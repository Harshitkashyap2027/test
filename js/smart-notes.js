/**
 * ============================================================================
 * lvlBase - Smart Notes & AI Extractor Controller
 * ============================================================================
 * Handles tab switching, drag-and-drop file inputs, text character counting,
 * and simulates the LLM pipeline generating markdown summaries and flashcards.
 */

const SmartNotesEngine = (function() {
    'use strict';

    // --- DOM Elements ---
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    const textArea = document.getElementById('source-text');
    const charCounter = document.getElementById('char-counter');
    
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    
    const generateBtn = document.getElementById('generate-notes-btn');
    
    // Output States
    const stateIdle = document.getElementById('output-idle');
    const stateProc = document.getElementById('output-processing');
    const stateRes = document.getElementById('output-result');
    const procStatusText = document.getElementById('proc-status');
    
    // Result Render Targets
    const resTypeTag = document.getElementById('res-type-tag');
    const markdownContainer = document.getElementById('markdown-content');
    const copyBtn = document.getElementById('copy-btn');

    /**
     * 1. Input UI Logic (Tabs & Counters)
     */
    const bindInputUI = () => {
        // Tab Switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const target = tab.getAttribute('data-tab');
                document.getElementById(`tab-${target}`).classList.add('active');
            });
        });

        // Character Counter
        if (textArea) {
            textArea.addEventListener('input', () => {
                const len = textArea.value.length;
                charCounter.innerText = len.toLocaleString();
                if (len > 15000) charCounter.style.color = 'var(--accent-red)';
                else charCounter.style.color = '';
            });
        }

        // Drag & Drop File Upload Simulation
        if (dropzone) {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
            ['dragleave', 'dragend'].forEach(type => {
                dropzone.addEventListener(type, () => dropzone.classList.remove('dragover'));
            });
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
                if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files);
            });
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length) handleFile(e.target.files);
            });
        }
    };

    const handleFile = (file) => {
        dropzone.innerHTML = `
            <div class="drop-icon" style="background: rgba(0,255,136,0.1);"><svg width="40" height="40" fill="none" stroke="#00FF88" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            <h4 style="color: #00FF88;">File Loaded</h4>
            <p>${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
            <button class="btn btn-ghost btn-small mt-3" onclick="document.getElementById('file-input').click()">Change File</button>
        `;
        if (lvlBaseCore) lvlBaseCore.log('info', `File securely buffered: ${file.name}`);
    };

    /**
     * 2. AI Processing Simulation
     */
    const startExtraction = () => {
        const selectedFormat = document.querySelector('input[name="out_format"]:checked').value;
        const hasText = textArea.value.trim().length > 10;
        
        // In a real app, we'd check if a file was uploaded too.
        if (!hasText && document.getElementById('tab-text').classList.contains('active')) {
            textArea.style.borderColor = 'var(--accent-red)';
            setTimeout(() => textArea.style.borderColor = '', 1000);
            return;
        }

        // UI State: Processing
        generateBtn.disabled = true;
        generateBtn.innerHTML = `<span class="pulse-dot" style="background:#000;"></span> Analyzing`;
        
        stateIdle.style.display = 'none';
        stateRes.style.display = 'none';
        stateProc.style.display = 'flex';
        
        // Progress Texts
        const statuses = [
            "Initializing Language Model...",
            "Sanitizing Input Text...",
            "Extracting Key Entities...",
            "Generating Logical Hierarchy...",
            "Formatting Output..."
        ];
        
        let step = 0;
        const statusInterval = setInterval(() => {
            procStatusText.innerText = statuses[step];
            step++;
            if (step >= statuses.length) clearInterval(statusInterval);
        }, 600);

        // Finish
        setTimeout(() => {
            renderOutput(selectedFormat);
        }, 3500);
    };

    /**
     * 3. Markdown Rendering (Simulated Outputs based on Format)
     */
    const renderOutput = (format) => {
        // UI State: Result
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"></path></svg> Synthesize Knowledge`;
        
        stateProc.style.display = 'none';
        stateRes.style.display = 'flex';
        
        let contentHtml = '';

        if (format === 'summary') {
            resTypeTag.innerText = "Detailed Summary";
            contentHtml = `
                <h1>The Core Principles of Thermodynamics</h1>
                <p>Based on your input, here is a synthesized breakdown of the core laws governing energy and heat transfer.</p>
                
                <h3>1. Zeroth Law (Thermal Equilibrium)</h3>
                <p>If two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with each other. This establishes temperature as a fundamental and measurable property.</p>
                
                <h3>2. First Law (Conservation of Energy)</h3>
                <blockquote>"Energy cannot be created or destroyed, only transformed."</blockquote>
                <p>The change in internal energy of a closed system is equal to the heat added to the system minus the work done by the system. Formula: <code>ΔU = Q - W</code></p>
                
                <h3>3. Second Law (Entropy)</h3>
                <p>The total entropy of an isolated system can never decrease over time. Heat flows spontaneously from a hotter body to a colder body, establishing the "arrow of time."</p>
            `;
        } else if (format === 'bullets') {
            resTypeTag.innerText = "Actionable Bullets";
            contentHtml = `
                <h1>Thermodynamics: Quick Review</h1>
                <ul>
                    <li><strong>Zeroth Law:</strong> Establishes the concept of temperature (A = B, B = C, therefore A = C).</li>
                    <li><strong>First Law:</strong> Conservation of energy. Energy transforms, never vanishes. Equation: <code>ΔU = Q - W</code>.</li>
                    <li><strong>Second Law:</strong> Entropy (disorder) in an isolated system always increases. Heat moves hot → cold.</li>
                    <li><strong>Third Law:</strong> As temperature approaches absolute zero (0 Kelvin), the entropy of a system approaches a constant minimum.</li>
                </ul>
            `;
        } else if (format === 'flashcards') {
            resTypeTag.innerText = "Flashcard Deck";
            resTypeTag.style.background = "rgba(255,214,0,0.15)";
            resTypeTag.style.color = "var(--accent-yellow)";
            resTypeTag.style.borderColor = "var(--accent-yellow)";
            
            contentHtml = `
                <div class="flashcard-grid">
                    <div class="fc-item">
                        <div class="fc-q">Q: What does the First Law of Thermodynamics state?</div>
                        <div class="fc-a">Energy cannot be created or destroyed, only transformed (Conservation of Energy).</div>
                    </div>
                    <div class="fc-item">
                        <div class="fc-q">Q: Formula for the First Law?</div>
                        <div class="fc-a">ΔU = Q - W</div>
                    </div>
                    <div class="fc-item">
                        <div class="fc-q">Q: What concept does the Second Law introduce?</div>
                        <div class="fc-a">Entropy. The disorder of an isolated system always increases over time.</div>
                    </div>
                    <div class="fc-item">
                        <div class="fc-q">Q: What happens at Absolute Zero according to the Third Law?</div>
                        <div class="fc-a">System entropy approaches a constant minimum.</div>
                    </div>
                </div>
            `;
        }

        // Inject Content
        markdownContainer.innerHTML = contentHtml;
        if (lvlBaseCore) lvlBaseCore.log('info', `AI Synthesis complete. Rendered as [${format.toUpperCase()}]`);
    };

    /**
     * 4. Utilities
     */
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const ogHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="#00FF88" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            copyBtn.style.borderColor = '#00FF88';
            setTimeout(() => {
                copyBtn.innerHTML = ogHtml;
                copyBtn.style.borderColor = '';
            }, 2000);
        });
    }

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

    // Public API
    return {
        init: () => {
            bindInputUI();
            if (generateBtn) generateBtn.addEventListener('click', startExtraction);
            initEntranceAnimations();
            if (lvlBaseCore) lvlBaseCore.log('info', 'Smart Notes LLM Pipeline Initialized.');
        }
    };

})();

// Boot on Load
document.addEventListener('DOMContentLoaded', SmartNotesEngine.init);