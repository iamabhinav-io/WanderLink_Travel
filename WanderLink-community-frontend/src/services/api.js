import axios from 'axios';

// Base API URL pointing to Person 1's Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout for fast hackathon fallback
});

// Request interceptor to attach JWT token if user is authenticated (Person 2's Auth)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('wanderlink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log friendly debug message for hackathon troubleshooting
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.warn('[WanderLink API] Backend unreachable, using graceful mock fallback for prototype demo.');
    }
    return Promise.reject(error);
  }
);

export default api;
