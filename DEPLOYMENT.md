
# Deployment Guide for VisionAuth

This guide will help you deploy your VisionAuth face recognition system to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. A modern web browser

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository `VisionAuth`
5. Make it public (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Push Your Code to GitHub

Open your terminal/command prompt and run:

```bash
# Navigate to your project directory
cd /path/to/your/VisionAuth

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit: VisionAuth face recognition system"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/VisionAuth.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### 4. Wait for Deployment

- GitHub will automatically build and deploy your site
- This usually takes 2-5 minutes
- You'll see a green checkmark when deployment is complete

### 5. Access Your Website

Your website will be available at:
```
https://YOUR_USERNAME.github.io/VisionAuth
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Testing Your Deployment

1. Visit your GitHub Pages URL
2. Click "Start Camera"
3. Grant camera permissions when prompted
4. Test face detection and recognition features

## Troubleshooting

### Camera Not Working
- Ensure you're accessing the site via HTTPS
- Check that your browser supports camera access
- Try refreshing the page
- Use Chrome, Firefox, Safari, or Edge

### Face Detection Issues
- Make sure you have good lighting
- Face the camera directly
- Check browser console for errors (F12)

### Deployment Issues
- Check the "Actions" tab in your GitHub repository
- Ensure all files are committed and pushed
- Verify the repository is public

## Custom Domain (Optional)

If you want to use a custom domain:

1. Go to your repository settings
2. Scroll to "Pages" section
3. Enter your custom domain
4. Add a CNAME record in your DNS settings
5. Wait for DNS propagation

## Security Notes

- The website requires HTTPS for camera access
- All face data is stored locally in the browser
- No data is sent to external servers
- Camera permissions are required for functionality

## Support

If you encounter issues:
1. Check the browser console for errors
2. Ensure all files are properly uploaded
3. Verify GitHub Pages is enabled
4. Test with different browsers

---

Your VisionAuth face recognition system should now be live and accessible to anyone with a webcam! 