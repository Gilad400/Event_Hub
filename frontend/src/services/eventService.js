import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const searchEvents = async (searchParams) => {
    try {
        // Filter out empty parameters
        const params = Object.entries(searchParams)
            .filter(([key, value]) => value && value.toString().trim() !== '')
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        const response = await api.get(API_ENDPOINTS.SEARCH_EVENTS, { params });
        return response;
    } catch (error) {
        console.error('Event search error:', error);
        throw error;
    }
};

export const getEventById = async (eventId) => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_EVENT(eventId));
        return response;
    } catch (error) {
        console.error('Get event error:', error);
        throw error;
    }
};