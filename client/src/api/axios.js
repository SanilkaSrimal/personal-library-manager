import axios from 'axios';

// Determine API URL
// If REACT_APP_API_URL is set, use it
// Otherwise, if in production and on same domain, use relative path /api
// Otherwise, default to localhost
let API_URL;
if (process.env.REACT_APP_API_URL) {
  API_URL = process.env.REACT_APP_API_URL;
} else if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  // In production without explicit URL, assume monorepo deployment (same domain)
  API_URL = '/api';
} else {
  // Development default
  API_URL = 'http://localhost:5000/api';
}

// Log API URL to help debug
if (process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL) {
  console.log('🔗 API Base URL:', API_URL);
  if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ REACT_APP_API_URL not set! Using relative path:', API_URL);
    console.warn('⚠️ If backend is on separate domain, set REACT_APP_API_URL in Vercel');
  }
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request Interceptor - Attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const fullUrl = error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown';
    
    // Log error for debugging
    console.error('API Error:', {
      fullUrl: fullUrl,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      code: error.code
    });

    // Handle network errors (no response received)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. The server is taking too long to respond.';
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        error.message = `Cannot connect to backend API at ${fullUrl}. Please check:\n1. Backend is deployed and running\n2. REACT_APP_API_URL is set correctly\n3. CORS is configured properly`;
      } else if (error.code === 'ERR_BAD_REQUEST') {
        error.message = 'Invalid request. Please check the API URL configuration.';
      } else {
        error.message = `Unable to connect to server at ${fullUrl}. Please verify:\n1. Backend is deployed\n2. REACT_APP_API_URL environment variable is set\n3. Network connection is working`;
      }
      console.error('Network error details:', {
        code: error.code,
        message: error.message,
        fullUrl: fullUrl,
        apiUrl: API_URL
      });
    }

    // Handle 401 Unauthorized - Auto logout and redirect
    if (error.response && error.response.status === 401) {
      // Clear token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
