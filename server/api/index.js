// Vercel serverless function entry point
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, 'http://localhost:3000']
  : ['http://localhost:3000', '*'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection middleware
let dbConnectionPromise = null;
app.use(async (req, res, next) => {
  try {
    // Reuse existing connection or create new one
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB();
    }
    await dbConnectionPromise;
    next();
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Reset promise to retry on next request
    dbConnectionPromise = null;
    res.status(503).json({ 
      message: 'Database connection failed. Please check your MONGO_URI and try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.method !== 'GET' ? '***' : undefined
  });
  next();
});

// Routes
// When Vercel routes /api/* to this function, the path received is without /api
// So /api/auth/signup becomes /auth/signup in the function
app.use('/auth', require('../routes/authRoutes'));
app.use('/books', require('../routes/bookRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ 
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      path: req.path 
    })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Export for Vercel serverless
module.exports = app;
