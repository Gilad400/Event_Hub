import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const login = async (email, password) => {
    try {
        const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
        
        // Store auth token if provided
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }
        
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await api.post(API_ENDPOINTS.REGISTER, {
            username,
            email,
            password
        });
        
        // Store auth token if provided
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }
        
        return response;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const getFavorites = async (userId) => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_FAVORITES(userId));
        return response;
    } catch (error) {
        console.error('Get favorites error:', error);
        throw error;
    }
};

export const addToFavorites = async (userId, eventData) => {
    try {
        const response = await api.post(API_ENDPOINTS.ADD_FAVORITE(userId), {
            event: eventData
        });
        return response;
    } catch (error) {
        console.error('Add favorite error:', error);
        throw error;
    }
};

export const removeFromFavorites = async (userId, eventId) => {
    try {
        const response = await api.delete(API_ENDPOINTS.REMOVE_FAVORITE(userId, eventId));
        return response;
    } catch (error) {
        console.error('Remove favorite error:', error);
        throw error;
    }
};