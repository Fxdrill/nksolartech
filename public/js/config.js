/**
 * NK Solar Tech - Frontend Configuration
 * 
 * EDIT THIS FILE to point to your Render backend:
 * - Leave BACKEND_URL empty for local development
 * - Enter your Render URL for production (e.g., 'https://your-app.onrender.com')
 */

const CONFIG = {
    // Your Render Backend URL (leave empty for local)
    BACKEND_URL: '', // e.g., 'https://nk-solar-tech-backend.onrender.com'
    
    // For GitHub Pages deployment, enter your backend URL above
    // The frontend will automatically use this URL for all API calls
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
