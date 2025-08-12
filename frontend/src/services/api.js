import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.data);
            
            if (error.response.status === 401) {
                // Unauthorized - clear auth and redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            
            throw error.response.data;
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.request);
            throw { error: 'Network error. Please check your connection.' };
        } else {
            // Something else happened
            console.error('Error:', error.message);
            throw { error: error.message };
        }
    }
);

export default api;