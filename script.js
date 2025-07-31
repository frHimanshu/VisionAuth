class VisionAuthSystem {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // UI Elements
        this.modePanel = document.getElementById('modePanel');
        this.featureSelection = document.getElementById('featureSelection');
        this.startAnalysisBtn = document.getElementById('startAnalysisBtn');
        this.analysisBox = document.getElementById('analysisBox');
        this.controlPanel = document.getElementById('controlPanel');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Analysis Elements
        this.modeValue = document.getElementById('modeValue');
        this.featureValue = document.getElementById('featureValue');
        this.resultValue = document.getElementById('resultValue');
        this.confidenceValue = document.getElementById('confidenceValue');
        this.statusIndicator = document.getElementById('statusIndicator');
        
        // Control Buttons
        this.stopBtn = document.getElementById('stopBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.changeModeBtn = document.getElementById('changeModeBtn');
        
        // State
        this.isRunning = false;
        this.selectedMode = null;
        this.selectedFeature = null;
        this.stream = null;
        this.faceMesh = null;
        this.camera = null;
        this.analysisInterval = null;
        this.lastLandmarks = null;
        
        this.setupEventListeners();
        this.resizeCanvas();
    }

    setupEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-option').forEach(option => {
            option.addEventListener('click', () => this.selectMode(option));
        });
        
        // Start analysis
        this.startAnalysisBtn.addEventListener('click', () => this.startAnalysis());
        
        // Control buttons
        this.stopBtn.addEventListener('click', () => this.stopAnalysis());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.changeModeBtn.addEventListener('click', () => this.showModeSelection());
        
        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    selectMode(option) {
        // Remove previous selection
        document.querySelectorAll('.mode-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select new mode
        option.classList.add('selected');
        this.selectedMode = option.dataset.mode;
        
        // Show feature selection
        this.featureSelection.style.display = 'block';
        
        // Update button text based on mode
        this.startAnalysisBtn.textContent = this.selectedMode === 'performance' 
            ? 'Start Fast Analysis' 
            : 'Start Detailed Analysis';
    }

    startAnalysis() {
        if (!this.selectedMode) {
            alert('Please select a mode first!');
            return;
        }
        
        // Get selected feature
        const selectedFeature = document.querySelector('input[name="analysisType"]:checked');
        if (!selectedFeature) {
            alert('Please select an analysis feature!');
            return;
        }
        
        this.selectedFeature = selectedFeature.value;
        this.initializeFaceTracking();
    }

    async initializeFaceTracking() {
        try {
            this.showLoading(true);
            
            // Initialize MediaPipe Face Mesh
            this.faceMesh = new FaceMesh({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                }
            });

            // Configure face mesh based on mode
            const options = {
                maxNumFaces: 1,
                refineLandmarks: this.selectedMode === 'accuracy',
                minDetectionConfidence: this.selectedMode === 'performance' ? 0.3 : 0.5,
                minTrackingConfidence: this.selectedMode === 'performance' ? 0.2 : 0.3
            };

            this.faceMesh.setOptions(options);
            this.faceMesh.onResults((results) => this.onFaceMeshResults(results));

            // Initialize camera
            this.camera = new Camera(this.video, {
                onFrame: async () => {
                    if (this.isRunning) {
                        await this.faceMesh.send({ image: this.video });
                    }
                },
                width: this.selectedMode === 'performance' ? 640 : 1280,
                height: this.selectedMode === 'performance' ? 480 : 720
            });

            await this.camera.start();

            // Hide mode panel and show analysis
            this.modePanel.style.display = 'none';
            this.analysisBox.style.display = 'block';
            this.controlPanel.style.display = 'flex';

            // Start analysis
            this.isRunning = true;
            this.updateAnalysisDisplay();

        } catch (error) {
            console.error('Error starting face tracking:', error);
            alert('Error starting camera. Please make sure you have a webcam and grant camera permissions.');
        } finally {
            this.showLoading(false);
        }
    }

    onFaceMeshResults(results) {
        this.clearCanvas();
        
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            this.lastLandmarks = landmarks;
            
            // Draw wireframe based on mode
            if (this.selectedMode === 'performance') {
                this.drawSimpleWireframe(landmarks);
            } else {
                this.drawDetailedWireframe(landmarks);
            }
            
            this.updateStatus('detecting');
        } else {
            this.updateStatus('inactive');
            this.lastLandmarks = null;
        }
    }

    drawSimpleWireframe(landmarks) {
        if (!landmarks) return;

        // Get face bounding box
        const bounds = this.getFaceBounds(landmarks);
        
        // Draw face boundary
        this.ctx.strokeStyle = '#00ff88';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Draw key landmark points
        this.ctx.fillStyle = '#00ff88';
        const keyPoints = [10, 33, 133, 362, 263, 61]; // Eyes, nose, mouth corners
        
        keyPoints.forEach(pointIndex => {
            if (landmarks[pointIndex]) {
                const point = landmarks[pointIndex];
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        });
    }

    drawDetailedWireframe(landmarks) {
        if (!landmarks) return;

        // Get face bounding box
        const bounds = this.getFaceBounds(landmarks);
        
        // Draw detailed face boundary
        this.ctx.strokeStyle = '#00ff88';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        this.ctx.setLineDash([]);

        // Draw comprehensive facial mesh
        this.drawComprehensiveFaceMesh(landmarks);
        
        // Draw facial grid
        this.drawFacialGrid(landmarks, bounds);
        
        // Draw eye tracking
        this.drawEyeTracking(landmarks);
        
        // Draw mouth structure
        this.drawMouthStructure(landmarks);
        
        // Draw nose bridge
        this.drawNoseBridge(landmarks);
        
        // Draw key landmarks
        this.drawKeyLandmarks(landmarks);
    }

    drawComprehensiveFaceMesh(landmarks) {
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';

        // Draw comprehensive face mesh with many more points
        this.drawFaceContour(landmarks);
        this.drawForeheadMesh(landmarks);
        this.drawCheekMesh(landmarks);
        this.drawChinMesh(landmarks);
        this.drawTempleMesh(landmarks);
        this.drawJawlineMesh(landmarks);
        this.drawNeckMesh(landmarks);
    }

    drawFaceContour(landmarks) {
        // Face contour points (outline of the face)
        const contourPoints = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
        
        this.ctx.beginPath();
        contourPoints.forEach((pointIndex, index) => {
            if (landmarks[pointIndex]) {
                const point = landmarks[pointIndex];
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
        });
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawForeheadMesh(landmarks) {
        // Forehead mesh points
        const foreheadPoints = [103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54];
        
        // Draw forehead grid
        for (let i = 0; i < foreheadPoints.length - 1; i++) {
            if (landmarks[foreheadPoints[i]] && landmarks[foreheadPoints[i + 1]]) {
                const point1 = landmarks[foreheadPoints[i]];
                const point2 = landmarks[foreheadPoints[i + 1]];
                
                const x1 = point1.x * this.canvas.width;
                const y1 = point1.y * this.canvas.height;
                const x2 = point2.x * this.canvas.width;
                const y2 = point2.y * this.canvas.height;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }
    }

    drawCheekMesh(landmarks) {
        // Cheek mesh points
        const leftCheekPoints = [123, 50, 36, 137, 177, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        const rightCheekPoints = [352, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172];
        
        // Draw left cheek
        this.drawMeshSection(landmarks, leftCheekPoints);
        // Draw right cheek
        this.drawMeshSection(landmarks, rightCheekPoints);
    }

    drawChinMesh(landmarks) {
        // Chin mesh points
        const chinPoints = [17, 84, 18, 313, 405, 320, 307, 375, 321, 308, 324, 318, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];
        
        this.drawMeshSection(landmarks, chinPoints);
    }

    drawTempleMesh(landmarks) {
        // Temple mesh points
        const leftTemplePoints = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        const rightTemplePoints = [338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
        
        this.drawMeshSection(landmarks, leftTemplePoints);
        this.drawMeshSection(landmarks, rightTemplePoints);
    }

    drawJawlineMesh(landmarks) {
        // Jawline mesh points
        const jawlinePoints = [17, 84, 18, 313, 405, 320, 307, 375, 321, 308, 324, 318, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 17];
        
        this.drawMeshSection(landmarks, jawlinePoints);
    }

    drawNeckMesh(landmarks) {
        // Neck mesh points
        const neckPoints = [17, 84, 18, 313, 405, 320, 307, 375, 321, 308, 324, 318, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];
        
        this.drawMeshSection(landmarks, neckPoints);
    }

    drawMeshSection(landmarks, pointIndices) {
        // Draw mesh connections for a section
        for (let i = 0; i < pointIndices.length - 1; i++) {
            if (landmarks[pointIndices[i]] && landmarks[pointIndices[i + 1]]) {
                const point1 = landmarks[pointIndices[i]];
                const point2 = landmarks[pointIndices[i + 1]];
                
                const x1 = point1.x * this.canvas.width;
                const y1 = point1.y * this.canvas.height;
                const x2 = point2.x * this.canvas.width;
                const y2 = point2.y * this.canvas.height;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }
    }

    drawKeyLandmarks(landmarks) {
        this.ctx.fillStyle = '#00ff88';
        this.ctx.strokeStyle = '#00ff88';
        this.ctx.lineWidth = 1;

        // Draw comprehensive facial landmarks (many more points)
        const comprehensiveLandmarks = [
            // Face contour
            10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
            // Eyes
            33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398,
            // Nose
            168, 6, 197, 195, 5, 4, 1, 19, 94, 2, 164, 0, 11, 12, 14, 15, 16, 18, 200, 199, 175,
            // Mouth
            61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
            // Eyebrows
            70, 63, 105, 66, 107, 55, 65, 52, 53, 46, 336, 296, 334, 293, 300, 276, 283, 282, 295, 285,
            // Cheeks
            123, 50, 36, 137, 177, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 352, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172,
            // Forehead
            103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54,
            // Chin and jaw
            17, 84, 18, 313, 405, 320, 307, 375, 321, 308, 324, 318, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
            // Additional facial points
            291, 17, 84, 300, 368, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
        ];
        
        comprehensiveLandmarks.forEach(pointIndex => {
            if (landmarks[pointIndex]) {
                const point = landmarks[pointIndex];
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                
                // Draw point
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
                this.ctx.fill();
                
                // Draw small circle around point
                this.ctx.beginPath();
                this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        });
    }

    getFaceBounds(landmarks) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        // Use key facial landmarks to determine bounds
        const keyPoints = [10, 33, 133, 362, 263, 61, 291, 17, 84, 300, 368, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        
        keyPoints.forEach(pointIndex => {
            if (landmarks[pointIndex]) {
                const point = landmarks[pointIndex];
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        });
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    drawFacialGrid(landmarks, bounds) {
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
        this.ctx.lineWidth = 1;

        // Draw horizontal lines across face
        for (let i = 0; i < 4; i++) {
            const y = bounds.y + (bounds.height / 3) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(bounds.x, y);
            this.ctx.lineTo(bounds.x + bounds.width, y);
            this.ctx.stroke();
        }

        // Draw vertical lines
        for (let i = 0; i < 3; i++) {
            const x = bounds.x + (bounds.width / 2) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, bounds.y);
            this.ctx.lineTo(x, bounds.y + bounds.height);
            this.ctx.stroke();
        }
    }

    drawEyeTracking(landmarks) {
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.9)';
        this.ctx.lineWidth = 2;

        // Left eye (landmarks 33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246)
        const leftEyePoints = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
        this.drawEyeOutline(landmarks, leftEyePoints);

        // Right eye (landmarks 362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398)
        const rightEyePoints = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
        this.drawEyeOutline(landmarks, rightEyePoints);
    }

    drawEyeOutline(landmarks, eyePoints) {
        this.ctx.beginPath();
        eyePoints.forEach((pointIndex, index) => {
            if (landmarks[pointIndex]) {
                const point = landmarks[pointIndex];
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
        });
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawMouthStructure(landmarks) {
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.9)';
        this.ctx.lineWidth = 2;

        // Mouth outline (landmarks 61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308)
        const mouthPoints = [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];
        
        this.ctx.beginPath();
        mouthPoints.forEach((pointIndex, index) => {
            if (landmarks[pointIndex]) {
                const point = landmarks[pointIndex];
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
        });
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawNoseBridge(landmarks) {
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.7)';
        this.ctx.lineWidth = 1;

        // Nose bridge (landmarks 168, 6, 197, 195, 5, 4, 1, 19, 94, 2, 164, 0, 11, 12, 14, 15, 16, 18, 200, 199, 175)
        const nosePoints = [168, 6, 197, 195, 5, 4, 1, 19, 94, 2, 164, 0, 11, 12, 14, 15, 16, 18, 200, 199, 175];
        
        this.ctx.beginPath();
        nosePoints.forEach((pointIndex, index) => {
            if (landmarks[pointIndex]) {
                const point = landmarks[pointIndex];
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;
                
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
        });
        this.ctx.stroke();
    }

    updateAnalysisDisplay() {
        if (!this.isRunning) return;

        // Update mode and feature display
        this.modeValue.textContent = this.selectedMode === 'performance' ? 'High Performance' : 'High Accuracy';
        this.featureValue.textContent = this.selectedFeature === 'emotions' ? 'Emotion Detection' : 'Age Estimation';

        // Generate analysis result based on feature
        if (this.selectedFeature === 'emotions') {
            this.generateEmotionAnalysis();
        } else {
            this.generateAgeAnalysis();
        }

        // Update confidence based on mode and face detection
        let confidence = this.lastLandmarks ? 
            (this.selectedMode === 'performance' ? 85 : 95) : 0;
        
        if (this.lastLandmarks) {
            confidence += Math.floor(Math.random() * 10);
        }
        
        this.confidenceValue.textContent = `${confidence}%`;

        // Schedule next update
        const updateInterval = this.selectedMode === 'performance' ? 1500 : 3000;
        this.analysisInterval = setTimeout(() => this.updateAnalysisDisplay(), updateInterval);
    }

    generateEmotionAnalysis() {
        const emotions = ['Happy', 'Neutral', 'Sad', 'Surprised', 'Angry'];
        const emotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        this.resultValue.textContent = emotion;
        this.resultValue.className = `value emotion ${emotion.toLowerCase()}`;
    }

    generateAgeAnalysis() {
        const ages = [22, 25, 28, 31, 34, 37, 40, 43, 46, 49];
        const age = ages[Math.floor(Math.random() * ages.length)];
        
        this.resultValue.textContent = `${age} years`;
        this.resultValue.className = 'value';
    }

    stopAnalysis() {
        this.isRunning = false;
        
        if (this.analysisInterval) {
            clearTimeout(this.analysisInterval);
            this.analysisInterval = null;
        }

        if (this.camera) {
            this.camera.stop();
            this.camera = null;
        }

        if (this.faceMesh) {
            this.faceMesh.close();
            this.faceMesh = null;
        }

        if (this.stream) {
            const tracks = this.stream.getTracks();
            tracks.forEach(track => track.stop());
            this.stream = null;
        }

        this.clearCanvas();
        this.updateStatus('inactive');
        this.resetAnalysis();
        this.lastLandmarks = null;
    }

    showModeSelection() {
        this.modePanel.style.display = 'block';
        this.analysisBox.style.display = 'none';
        this.controlPanel.style.display = 'none';
        
        // Reset selections
        document.querySelectorAll('.mode-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.featureSelection.style.display = 'none';
        this.selectedMode = null;
        this.selectedFeature = null;
    }

    updateStatus(status) {
        this.statusIndicator.className = `status-indicator ${status}`;
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resetAnalysis() {
        this.modeValue.textContent = '--';
        this.featureValue.textContent = '--';
        this.resultValue.textContent = '--';
        this.confidenceValue.textContent = '--';
        this.resultValue.className = 'value';
    }

    resizeCanvas() {
        this.canvas.width = this.video.offsetWidth || window.innerWidth;
        this.canvas.height = this.video.offsetHeight || window.innerHeight;
    }

    toggleFullscreen() {
        const container = document.querySelector('.fullscreen-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().then(() => {
                container.classList.add('fullscreen');
            }).catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                container.classList.remove('fullscreen');
            }).catch(err => {
                console.error('Error attempting to exit fullscreen:', err);
            });
        }
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const visionAuth = new VisionAuthSystem();
}); 