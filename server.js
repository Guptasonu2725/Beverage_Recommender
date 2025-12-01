const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const beverageRoutes = require('./routes/beverageRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Beverage Recommendation API is running',
    timestamp: new Date().toISOString(),
    serverTime: new Date().toLocaleString()
  });
});

// API Routes
app.use('/api/beverage', beverageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🍹 Beverage API: http://localhost:${PORT}/api/beverage/recommend`);
  console.log(`⏰ Server time: ${new Date().toLocaleString()}`);
});

module.exports = app;
