require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const googleAuthApi = require('./api/google-auth');
const googleMeetApi = require('./api/google-meet');
const analyticsApi = require('./api/analytics');

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Proxy to R API server (when it's running on port 8000)
app.use('/api/r', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/r': '/api' // Remove /r prefix when forwarding to R server
  },
  onError: (err, req, res) => {
    console.log('R API Server not available:', err.message);
    res.status(503).json({ 
      error: 'R Analytics server is not running. Please start it with: cd server && Rscript R/server.R' 
    });
  }
}));

// Mount API routes
app.use('/api', analyticsApi);

// Mount Google OAuth route
app.use('/', googleAuthApi);

// Mount Google Meet API route
app.use('/api', googleMeetApi);

// Health check for Node.js server
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    server: 'Node.js',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'GetCare Backend Server',
    services: {
      'Node.js API': 'http://localhost:5000',
      'R Analytics API': 'http://localhost:8000',
      'Frontend': 'http://localhost:5173'
    },
    endpoints: {
      '/api/r/*': 'Proxy to R Analytics API',
      '/health': 'Node.js health check',
      '/api/google-auth': 'Google authentication',
      '/api/google-meet': 'Google Meet integration'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`GetCare Node.js Server running on port ${PORT}`);
  console.log(`R Analytics API should be running on port 8000`);
  console.log(`Frontend should be running on port 5173`);
});
