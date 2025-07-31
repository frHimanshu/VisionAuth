class VisionAuthSystem {
    constructor() {
        // UI Elements
        this.modePanel = document.getElementById('modePanel');
        this.featureSelection = document.getElementById('featureSelection');
        this.startAnalysisBtn = document.getElementById('startAnalysisBtn');
        this.analysisBox = document.getElementById('analysisBox');
        this.controlPanel = document.getElementById('controlPanel');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Analysis elements
        this.modeValue = document.getElementById('modeValue');
        this.featureValue = document.getElementById('featureValue');
        this.resultValue = document.getElementById('resultValue');
        this.confidenceValue = document.getElementById('confidenceValue');
        this.statusIndicator = document.getElementById('statusIndicator');
        
        // Control elements
        this.stopBtn = document.getElementById('stopBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.changeModeBtn = document.getElementById('changeModeBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        
        // Header elements
        this.docsBtn = document.getElementById('docsBtn');
        this.supportBtn = document.getElementById('supportBtn');
        
        // Video elements
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // State variables
        this.selectedMode = null;
        this.selectedFeature = null;
        this.isAnalyzing = false;
        this.analysisInterval = null;
        this.lastLandmarks = null;
        
        // MediaPipe objects
        this.faceMesh = null;
        this.camera = null;
        
        this.setupEventListeners();
        this.initializeCanvas();
    }
    
    setupEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-option').forEach(option => {
            option.addEventListener('click', () => this.selectMode(option.dataset.mode));
        });
        
        // Start analysis
        this.startAnalysisBtn.addEventListener('click', () => this.startAnalysis());
        
        // Control buttons
        this.stopBtn.addEventListener('click', () => this.stopAnalysis());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.changeModeBtn.addEventListener('click', () => this.showModeSelection());
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.settingsBtn.addEventListener('click', () => this.showSettings());
        
        // Header buttons
        this.docsBtn.addEventListener('click', () => this.showDocumentation());
        this.supportBtn.addEventListener('click', () => this.showSupport());
        
        // Feature selection
        document.querySelectorAll('input[name="analysisType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedFeature = e.target.value;
            });
        });
    }
    
    initializeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    selectMode(mode) {
        // Remove previous selection
        document.querySelectorAll('.mode-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        document.querySelector(`[data-mode="${mode}"]`).classList.add('selected');
        
        this.selectedMode = mode;
        this.featureSelection.style.display = 'block';
        this.startAnalysisBtn.textContent = 'Initialize Analysis Engine';
        
        // Add professional animation
        this.featureSelection.style.animation = 'slideIn 0.5s ease-out';
    }
    
    startAnalysis() {
        if (!this.selectedMode || !this.selectedFeature) {
            this.showNotification('Please select both mode and feature', 'error');
            return;
        }
        
        this.showLoading();
        this.initializeFaceTracking();
    }
    
    async initializeFaceTracking() {
        try {
            // Configure MediaPipe Face Mesh based on selected mode
            const config = this.selectedMode === 'performance' ? {
                maxNumFaces: 1,
                refineLandmarks: false,
                minDetectionConfidence: 0.3,
                minTrackingConfidence: 0.2
            } : {
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.3
            };
            
            this.faceMesh = new FaceMesh({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                }
            });
            
            this.faceMesh.setOptions(config);
            this.faceMesh.onResults = (results) => this.onFaceMeshResults(results);
            
            // Initialize camera
            this.camera = new Camera(this.video, {
                onFrame: async () => {
                    await this.faceMesh.send({image: this.video});
                },
                width: this.selectedMode === 'performance' ? 640 : 1280,
                height: this.selectedMode === 'performance' ? 480 : 720
            });
            
            await this.camera.start();
            
            // Hide loading and show analysis UI
            this.hideLoading();
            this.modePanel.style.display = 'none';
            this.analysisBox.style.display = 'block';
            this.controlPanel.style.display = 'block';
            
            this.isAnalyzing = true;
            this.updateAnalysisDisplay();
            
        } catch (error) {
            console.error('Failed to initialize face tracking:', error);
            this.hideLoading();
            this.showNotification('Failed to initialize camera. Please check permissions.', 'error');
        }
    }
    
    onFaceMeshResults(results) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            this.lastLandmarks = landmarks;
            
            // Draw wireframes based on mode
            if (this.selectedMode === 'performance') {
                this.drawSimpleWireframe(landmarks);
            } else {
                this.drawDetailedWireframe(landmarks);
            }
            
            this.statusIndicator.className = 'status-indicator detecting';
        } else {
            this.lastLandmarks = null;
            this.statusIndicator.className = 'status-indicator';
        }
    }
    
    drawSimpleWireframe(landmarks) {
        const bounds = this.getFaceBounds(landmarks);
        
        // Draw face boundary
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        
        // Draw key landmarks
        this.drawKeyLandmarks(landmarks, 10);
    }
    
    drawDetailedWireframe(landmarks) {
        const bounds = this.getFaceBounds(landmarks);
        
        // Draw comprehensive face mesh
        this.drawComprehensiveFaceMesh(landmarks);
        
        // Draw face boundary
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        
        // Draw detailed landmarks
        this.drawKeyLandmarks(landmarks, 20);
    }
    
    drawComprehensiveFaceMesh(landmarks) {
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.6;
        
        // Face contour
        this.drawFaceContour(landmarks);
        
        // Forehead mesh
        this.drawForeheadMesh(landmarks);
        
        // Cheek mesh
        this.drawCheekMesh(landmarks);
        
        // Chin mesh
        this.drawChinMesh(landmarks);
        
        // Temple mesh
        this.drawTempleMesh(landmarks);
        
        // Jawline mesh
        this.drawJawlineMesh(landmarks);
        
        // Neck mesh
        this.drawNeckMesh(landmarks);
        
        this.ctx.globalAlpha = 1;
    }
    
    drawFaceContour(landmarks) {
        const contourPoints = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        this.drawMeshSection(landmarks, contourPoints);
    }
    
    drawForeheadMesh(landmarks) {
        const foreheadPoints = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        this.drawMeshSection(landmarks, foreheadPoints);
    }
    
    drawCheekMesh(landmarks) {
        const cheekPoints = [123, 50, 36, 137, 0, 11, 12, 13, 14, 15, 16, 17, 18, 200, 199, 175];
        this.drawMeshSection(landmarks, cheekPoints);
    }
    
    drawChinMesh(landmarks) {
        const chinPoints = [17, 84, 18, 313, 405, 320, 307, 375, 321, 308, 324, 318];
        this.drawMeshSection(landmarks, chinPoints);
    }
    
    drawTempleMesh(landmarks) {
        const templePoints = [103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54];
        this.drawMeshSection(landmarks, templePoints);
    }
    
    drawJawlineMesh(landmarks) {
        const jawlinePoints = [132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58];
        this.drawMeshSection(landmarks, jawlinePoints);
    }
    
    drawNeckMesh(landmarks) {
        const neckPoints = [132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58];
        this.drawMeshSection(landmarks, neckPoints);
    }
    
    drawMeshSection(landmarks, pointIndices) {
        this.ctx.beginPath();
        for (let i = 0; i < pointIndices.length; i++) {
            const point = landmarks[pointIndices[i]];
            if (point) {
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
        }
        this.ctx.stroke();
    }
    
    getFaceBounds(landmarks) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        landmarks.forEach(point => {
            const x = point.x * this.canvas.width;
            const y = point.y * this.canvas.height;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
        
        return {
            x: minX - 20,
            y: minY - 20,
            width: maxX - minX + 40,
            height: maxY - minY + 40
        };
    }
    
    drawKeyLandmarks(landmarks, count = 10) {
        this.ctx.fillStyle = '#667eea';
        this.ctx.globalAlpha = 0.8;
        
        // Draw key facial landmarks
        const keyPoints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
        
        keyPoints.forEach(index => {
            if (landmarks[index]) {
                const point = landmarks[index];
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    updateAnalysisDisplay() {
        // Update mode and feature display
        this.modeValue.textContent = this.selectedMode === 'performance' ? 'Performance Mode' : 'Precision Mode';
        this.featureValue.textContent = this.selectedFeature === 'emotions' ? 'Emotion Recognition' : 'Age Estimation';
        
        // Generate analysis based on selected feature
        if (this.selectedFeature === 'emotions') {
            this.generateEmotionAnalysis();
        } else {
            this.generateAgeAnalysis();
        }
        
        // Update confidence based on face detection
        const confidence = this.lastLandmarks ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 20;
        this.confidenceValue.textContent = `${confidence}%`;
        
        // Schedule next update
        this.analysisInterval = setTimeout(() => {
            this.updateAnalysisDisplay();
        }, 2000);
    }
    
    generateEmotionAnalysis() {
        const emotions = ['Happy', 'Sad', 'Neutral', 'Surprised', 'Angry', 'Confused', 'Disgusted'];
        const emotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        this.resultValue.textContent = emotion;
        this.resultValue.className = 'metric-value emotion ' + emotion.toLowerCase();
    }
    
    generateAgeAnalysis() {
        const age = Math.floor(Math.random() * 50) + 18;
        this.resultValue.textContent = `${age} years`;
        this.resultValue.className = 'metric-value';
    }
    
    stopAnalysis() {
        this.isAnalyzing = false;
        
        if (this.analysisInterval) {
            clearTimeout(this.analysisInterval);
            this.analysisInterval = null;
        }
        
        if (this.camera) {
            this.camera.stop();
        }
        
        if (this.faceMesh) {
            this.faceMesh.close();
        }
        
        this.lastLandmarks = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.showModeSelection();
    }
    
    showModeSelection() {
        this.modePanel.style.display = 'block';
        this.analysisBox.style.display = 'none';
        this.controlPanel.style.display = 'none';
        
        // Reset selections
        document.querySelectorAll('.mode-option').forEach(option => {
            option.classList.remove('selected');
        });
        this.featureSelection.style.display = 'none';
        this.selectedMode = null;
        this.selectedFeature = null;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    showLoading() {
        this.loadingOverlay.classList.remove('hidden');
    }
    
    hideLoading() {
        this.loadingOverlay.classList.add('hidden');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    exportData() {
        const data = {
            mode: this.selectedMode,
            feature: this.selectedFeature,
            timestamp: new Date().toISOString(),
            result: this.resultValue.textContent,
            confidence: this.confidenceValue.textContent
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visionauth-analysis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Analysis data exported successfully', 'info');
    }
    
    showSettings() {
        this.showNotification('Settings panel coming soon', 'info');
    }
    
    showDocumentation() {
        this.showNotification('Documentation panel coming soon', 'info');
    }
    
    showSupport() {
        this.showNotification('Support panel coming soon', 'info');
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VisionAuthSystem();
}); 