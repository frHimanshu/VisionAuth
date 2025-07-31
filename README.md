# VisionAuth - Real-time Face Analysis System

A modern, web-based face analysis system that detects human faces and provides real-time emotion and age analysis based on facial expressions.

## 🌟 Features

- **Real-time Face Detection**: Uses MediaPipe for accurate face detection via webcam
- **Emotion Detection**: Detects 7 emotions (Happy, Sad, Neutral, Surprised, Angry, Confused, Disgusted)
- **Age Estimation**: Estimates approximate age based on facial features and expressions
- **Gender Recognition**: Estimates gender from facial characteristics
- **Expression Analysis**: Analyzes facial expressions in real-time
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Updates**: Continuous analysis as facial expressions change

## 🚀 Live Demo

Visit the live website: [VisionAuth on GitHub Pages](https://yourusername.github.io/VisionAuth)

## 🛠️ Technologies Used

- **HTML5**: Modern semantic markup
- **CSS3**: Advanced styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Modern JavaScript with classes and async/await
- **MediaPipe**: Google's face detection library
- **TensorFlow.js**: Machine learning capabilities for face analysis

## 📋 Prerequisites

- Modern web browser with camera access
- HTTPS connection (required for camera access)
- Webcam or camera device

## 🎯 How to Use

1. **Start the Camera**: Click the "Start Camera" button to begin face detection
2. **Face Detection**: The system automatically detects faces in the camera view
3. **Real-time Analysis**: View age, gender, emotion, and expression estimates
4. **Expression Changes**: Results update continuously as you change facial expressions
5. **Analysis Details**: See detailed breakdown of facial features and confidence levels

## 🔧 Installation & Deployment

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/VisionAuth.git
cd VisionAuth
```

2. Open `index.html` in a modern web browser
3. Grant camera permissions when prompted

### GitHub Pages Deployment

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to your GitHub repository settings
3. Scroll down to "GitHub Pages" section
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

Your website will be available at: `https://yourusername.github.io/VisionAuth`

## 📁 Project Structure

```
VisionAuth/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── LICENSE             # License file
```

## 🔒 Privacy & Security

- **No Data Storage**: No face data is stored or transmitted
- **Real-time Only**: All analysis happens in real-time without saving
- **Camera Access**: Only requests camera access when needed
- **HTTPS Required**: Modern browsers require HTTPS for camera access

## 🎨 Features in Detail

### Face Detection
- Real-time detection using MediaPipe
- Green bounding boxes around detected faces
- High accuracy with configurable confidence thresholds

### Emotion Detection
- Detects 7 different emotions
- Real-time emotion analysis
- Color-coded emotion indicators
- Based on facial expressions and landmarks

### Age Estimation
- Analyzes facial proportions and features
- Uses heuristic algorithms
- Provides age range estimates
- Considers facial structure and expressions

### Expression Analysis
- Real-time facial expression detection
- Maps expressions to emotions
- Continuous updates as expressions change

## 🐛 Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS
- Check camera permissions
- Try refreshing the page
- Use a modern browser (Chrome, Firefox, Safari, Edge)

### Face Detection Issues
- Ensure good lighting
- Face the camera directly
- Check browser console for errors

### Performance Issues
- Close other camera-using applications
- Reduce browser tabs
- Check system resources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MediaPipe for face detection capabilities
- TensorFlow.js for machine learning features
- Google Fonts for typography
- Modern CSS techniques for beautiful UI

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Ensure your browser supports all required features

---

**Note**: This is a demonstration project focused on real-time face analysis. For production use, consider implementing more robust emotion and age detection algorithms.