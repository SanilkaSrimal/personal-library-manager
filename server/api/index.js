// Vercel serverless function entry point
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// For Vercel serverless, we need to handle the base path
// When Vercel rewrites /api/* to this function, the path includes /api

// Middleware - CORS
// Allow all origins in production for monorepo deployment
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // In production, allow all origins (for monorepo same-domain deployment)
    // In development, allow localhost
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? true  // Allow all in production
      : ['http://localhost:3000', 'http://localhost:5000'];
    
    if (allowedOrigins === true || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(null, true); // Still allow for now to debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    query: req.query
  });
  next();
});

// Routes
// When Vercel rewrites /api/* to this function, Express receives the full path including /api
// So /api/auth/signup becomes req.path = /api/auth/signup
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/books', require('../routes/bookRoutes'));

// Also handle paths without /api prefix (for flexibility)
app.use('/auth', require('../routes/authRoutes'));
app.use('/books', require('../routes/bookRoutes'));

// Root test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Server is running',
    timestamp: new Date().toISOString(),
    path: req.path,
    originalUrl: req.originalUrl
  });
});

// Health check route - handle both paths
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    path: req.path,
    originalUrl: req.originalUrl
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    path: req.path,
    originalUrl: req.originalUrl
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
