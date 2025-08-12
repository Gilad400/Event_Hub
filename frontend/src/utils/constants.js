export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    
    // Events
    SEARCH_EVENTS: '/events/search',
    GET_EVENT: (id) => `/events/${id}`,
    
    // User
    GET_FAVORITES: (userId) => `/users/${userId}/favorites`,
    ADD_FAVORITE: (userId) => `/users/${userId}/favorites`,
    REMOVE_FAVORITE: (userId, eventId) => `/users/${userId}/favorites/${eventId}`,
};

export const EVENT_SEGMENTS = [
    { value: '', label: 'All Categories' },
    { value: 'Music', label: 'Music' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Arts & Theatre', label: 'Arts & Theatre' },
    { value: 'Film', label: 'Film' },
    { value: 'Miscellaneous', label: 'Miscellaneous' }
];

export const MESSAGES = {
    LOGIN_SUCCESS: 'Successfully logged in!',
    LOGIN_ERROR: 'Failed to login. Please check your credentials.',
    REGISTER_SUCCESS: 'Account created successfully!',
    REGISTER_ERROR: 'Failed to create account. Please try again.',
    FAVORITE_ADDED: 'Event added to favorites!',
    FAVORITE_REMOVED: 'Event removed from favorites!',
    SEARCH_ERROR: 'Failed to search events. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.'
};