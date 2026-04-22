/**
 * ============================================================================
 * lvlBase - AI Brain & Vision Controller
 * ============================================================================
 * Enterprise-grade controller for the Homework Scanner feature.
 * Manages native camera APIs, image capture, OCR simulation, LLM state 
 * rendering, and integration with the Gamification Engine.
 */

const AIBrainController = (function() {
    'use strict';

    // --- Configuration & Constants ---
    const CONFIG = {
        modelName: 'Jarvis v3.5 (Vision-Language)',
        confidenceThreshold: 0.85,
        simulatedNetworkDelay: 800,
        ocrScanDuration: 2500,
        llmProcessDuration: 3000,
        maxRetries: 3
    };

    // --- State Machine ---
    const state = {
        cameraStream: null,
        currentFacingMode: 'environment', // 'user' or 'environment'
        isProcessing: false,
        hasCaptured: false,
        currentImageBlob: null,
        lightLevel: 'Optimal',
        eli5Active: false
    };

    // --- DOM Elements ---
    const elements = {
        // Camera UI
        videoElement: document.getElementById('live-camera-feed'),
        canvasElement: document.getElementById('capture-canvas'),
        captureBtn: document.getElementById('capture-btn'),
        flipBtn: document.getElementById('flip-camera-btn'),
        uploadBtn: document.getElementById('upload-img-btn'),
        fileInput: document.getElementById('file-upload-input'),
        reticle: document.querySelector('.targeting-reticle'),
        laser: document.getElementById('scan-laser'),
        lightMeter: document.getElementById('light-meter'),
        postCaptureControls: document.getElementById('post-capture-controls'),
        cameraControls: document.querySelector('.camera-controls'),
        retakeBtn: document.getElementById('retake-btn'),
        analyzeBtn: document.getElementById('analyze-btn'),
        
        // Output States
        stateIdle: document.getElementById('state-idle'),
        stateProcessing: document.getElementById('state-processing'),
        stateResult: document.getElementById('state-result'),
        
        // Processing UI
        procPercent: document.getElementById('proc-percent'),
        procStatusText: document.getElementById('proc-status-text'),
        logOcr: document.getElementById('log-ocr'),
        logMath: document.getElementById('log-math'),
        
        // Result UI
        eli5Btn: document.getElementById('explain-kid-btn'),
        eli5Box: document.getElementById('eli5-box'),
        claimXpBtn: document.querySelector('.tutor-actions .btn-primary')
    };

    /**
     * 1. Camera Hardware Initialization
     */
    const initCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            handleCameraError('Your browser does not support the native Camera API.');
            return;
        }

        try {
            // Stop existing stream if any
            if (state.cameraStream) {
                state.cameraStream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: state.currentFacingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            };

            state.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            elements.videoElement.srcObject = state.cameraStream;
            
            // Mirror front camera
            if (state.currentFacingMode === 'user') {
                elements.videoElement.style.transform = 'scaleX(-1)';
            } else {
                elements.videoElement.style.transform = 'scaleX(1)';
            }

            simulateLightMeter();
            if (lvlBaseCore) lvlBaseCore.log('info', `Camera initialized. Mode: ${state.currentFacingMode}`);
            
        } catch (err) {
            handleCameraError(err.message || 'Camera access denied or unavailable.');
        }
    };

    const handleCameraError = (msg) => {
        if (lvlBaseCore) lvlBaseCore.log('error', msg);
        elements.videoElement.style.display = 'none';
        elements.canvasElement.style.display = 'block';
        
        const ctx = elements.canvasElement.getContext('2d');
        elements.canvasElement.width = 800;
        elements.canvasElement.height = 600;
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#FF3366';
        ctx.font = '20px Fira Code';
        ctx.textAlign = 'center';
        ctx.fillText('CAMERA UNAVAILABLE.', 400, 280);
        ctx.fillText('Please use the upload button instead.', 400, 320);
    };

    const toggleCameraMode = () => {
        state.currentFacingMode = state.currentFacingMode === 'user' ? 'environment' : 'user';
        initCamera();
    };

    /**
     * 2. Image Capture & Upload Handling
     */
    const takeSnapshot = () => {
        if (state.isProcessing || !state.cameraStream) return;
        
        state.hasCaptured = true;
        
        // Trigger haptic/visual feedback
        elements.videoElement.style.opacity = '0';
        setTimeout(() => { elements.videoElement.style.opacity = '1'; }, 150);

        // Draw video frame to canvas
        const canvas = elements.canvasElement;
        const video = elements.videoElement;
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (state.currentFacingMode === 'user') {
            // Handle mirroring for front camera
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to Blob for theoretical backend upload
        canvas.toBlob(blob => {
            state.currentImageBlob = blob;
            if (lvlBaseCore) lvlBaseCore.log('info', 'Image blob generated.', { size: blob.size });
        }, 'image/jpeg', 0.9);

        // Update UI States
        elements.videoElement.style.display = 'none';
        elements.canvasElement.style.display = 'block';
        elements.cameraControls.style.display = 'none';
        elements.postCaptureControls.style.display = 'flex';
        elements.reticle.classList.add('scanning');
        elements.laser.style.display = 'block';
    };

    const retakeSnapshot = () => {
        state.hasCaptured = false;
        state.currentImageBlob = null;
        
        elements.canvasElement.style.display = 'none';
        elements.videoElement.style.display = 'block';
        elements.cameraControls.style.display = 'flex';
        elements.postCaptureControls.style.display = 'none';
        elements.reticle.classList.remove('scanning');
        elements.laser.style.display = 'none';
        
        // Reset Right Panel
        switchUIState('idle');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files;
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = elements.canvasElement;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                state.hasCaptured = true;
                state.currentImageBlob = file;
                
                elements.videoElement.style.display = 'none';
                elements.canvasElement.style.display = 'block';
                elements.cameraControls.style.display = 'none';
                elements.postCaptureControls.style.display = 'flex';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    /**
     * 3. Environmental Simulators
     */
    const simulateLightMeter = () => {
        if(!elements.lightMeter) return;
        setInterval(() => {
            if (state.hasCaptured) return;
            const variance = Math.random();
            if (variance > 0.8) {
                elements.lightMeter.innerText = "ISO: 800 (Low Light)";
                elements.lightMeter.style.color = "var(--accent-yellow)";
            } else {
                elements.lightMeter.innerText = "ISO: 200 (Optimal)";
                elements.lightMeter.style.color = "var(--accent-primary)";
            }
        }, 2000);
    };

    /**
     * 4. UI State Machine
     */
    const switchUIState = (targetState) => {
        // Hide all
        elements.stateIdle.style.display = 'none';
        elements.stateProcessing.style.display = 'none';
        elements.stateResult.style.display = 'none';

        // Show target
        if (targetState === 'idle') {
            elements.stateIdle.style.display = 'flex';
            elements.stateIdle.style.animation = 'fade-in-up 0.4s ease-out';
        } 
        else if (targetState === 'processing') {
            elements.stateProcessing.style.display = 'flex';
        } 
        else if (targetState === 'result') {
            elements.stateResult.style.display = 'flex';
        }
    };

    /**
     * 5. The AI Processing Engine (Simulation)
     * Orchestrates the transition from an image to the solved mathematical steps.
     */
    const startAnalysis = () => {
        if (!state.currentImageBlob) return;

        state.isProcessing = true;
        elements.analyzeBtn.disabled = true;
        elements.retakeBtn.disabled = true;
        elements.analyzeBtn.innerHTML = `<span class="pulse-dot" style="background:#000;"></span> Processing`;

        switchUIState('processing');

        // Phase 1: OCR Extraction
        elements.procStatusText.innerText = "Extracting Optical Data...";
        elements.logOcr.style.display = 'block';
        elements.logMath.style.display = 'none';
        
        let percent = 0;
        const progressInterval = setInterval(() => {
            percent += Math.floor(Math.random() * 5) + 2;
            if (percent > 45) {
                clearInterval(progressInterval);
                elements.procPercent.innerText = "45%";
                elements.logOcr.innerHTML = `> OCR extraction complete. <span style="color: var(--accent-primary);">[120ms]</span>`;
                startLLMAnalysis();
            } else {
                elements.procPercent.innerText = `${percent}%`;
            }
        }, 100);
    };

    const startLLMAnalysis = () => {
        // Phase 2: LLM Logic Parsing
        elements.procStatusText.innerText = "Mapping Mathematical Nodes...";
        elements.logMath.style.display = 'block';

        let percent = 45;
        const progressInterval = setInterval(() => {
            percent += Math.floor(Math.random() * 8) + 1;
            if (percent >= 100) {
                clearInterval(progressInterval);
                elements.procPercent.innerText = "100%";
                elements.logMath.innerHTML = `> Algebraic steps resolved. Rendering UI... <span style="color: var(--accent-primary);">[OK]</span>`;
                
                // Draw bounding box on image to show what AI "saw"
                const bbox = document.getElementById('bounding-box');
                if (bbox) {
                    bbox.style.display = 'block';
                    bbox.style.top = '40%';
                    bbox.style.left = '30%';
                    bbox.style.width = '40%';
                    bbox.style.height = '15%';
                }

                setTimeout(() => finalizeAnalysis(), 600);
            } else {
                elements.procPercent.innerText = `${percent}%`;
            }
        }, 150);
    };

    const finalizeAnalysis = () => {
        state.isProcessing = false;
        elements.analyzeBtn.disabled = false;
        elements.retakeBtn.disabled = false;
        elements.analyzeBtn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h4l2-9 5 18 2-9h5"/></svg> Analyze with AI`;

        switchUIState('result');

        if (lvlBaseCore) lvlBaseCore.log('info', 'AI Vision processing complete. Rendering quadratic solution protocol.');
    };

    /**
     * 6. Tutor Interactions
     */
    const toggleELI5 = () => {
        state.eli5Active = !state.eli5Active;
        
        if (state.eli5Active) {
            elements.eli5Btn.classList.add('active');
            elements.eli5Btn.style.background = 'rgba(176,38,255,0.2)';
            elements.eli5Btn.style.borderColor = 'var(--accent-purple)';
            elements.eli5Box.style.display = 'flex';
        } else {
            elements.eli5Btn.classList.remove('active');
            elements.eli5Btn.style.background = '';
            elements.eli5Btn.style.borderColor = '';
            elements.eli5Box.style.display = 'none';
        }
    };

    const claimReward = () => {
        // Integrate with Gamification.js
        if (typeof GamificationEngine !== 'undefined') {
            // Base XP 50, Diff level 3, On time true
            const awarded = GamificationEngine.awardXP(50, 3, true);
            
            // Visual Update
            elements.claimXpBtn.innerHTML = `Claimed +${awarded} XP <svg width="16" height="16" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
            elements.claimXpBtn.style.background = 'var(--accent-primary)';
            elements.claimXpBtn.style.pointerEvents = 'none';

            // Show a floating XP notification
            if (lvlBaseCore) lvlBaseCore.log('info', `Student claimed ${awarded} XP via AI Vision Tool.`);
            
            setTimeout(() => {
                window.location.href = '../services/student/dashboard.html';
            }, 2000);
        } else {
            // Fallback if gamification.js isn't loaded
            elements.claimXpBtn.innerText = "Claimed!";
        }
    };

    /**
     * 7. Event Binding & Initialization
     */
    const bindEvents = () => {
        if (elements.captureBtn) elements.captureBtn.addEventListener('click', takeSnapshot);
        if (elements.retakeBtn) elements.retakeBtn.addEventListener('click', retakeSnapshot);
        if (elements.flipBtn) elements.flipBtn.addEventListener('click', toggleCameraMode);
        
        if (elements.uploadBtn && elements.fileInput) {
            elements.uploadBtn.addEventListener('click', () => elements.fileInput.click());
            elements.fileInput.addEventListener('change', handleFileUpload);
        }

        if (elements.analyzeBtn) elements.analyzeBtn.addEventListener('click', startAnalysis);
        if (elements.eli5Btn) elements.eli5Btn.addEventListener('click', toggleELI5);
        if (elements.claimXpBtn) elements.claimXpBtn.addEventListener('click', claimReward);
    };

    // --- Public API ---
    return {
        init: () => {
            if (lvlBaseCore) lvlBaseCore.log('info', 'AI Brain & Hardware Interfaces Mounting...');
            bindEvents();
            initCamera();
        },
        destroy: () => {
            if (state.cameraStream) {
                state.cameraStream.getTracks().forEach(track => track.stop());
            }
        }
    };

})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', AIBrainController.init);

// Ensure camera turns off if user navigates away
window.addEventListener('beforeunload', AIBrainController.destroy);