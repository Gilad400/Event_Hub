
const API_BASE_URL = 'http://127.0.0.1:5000';

export const searchEvents = async ({
    keyword,
    city,
    stateCode,
    startDate,
    endDate,
    segment
}) => {
    const params = new URLSearchParams();
    
    if (keyword) params.append('keyword', keyword);
    if (city) params.append('city', city);
    if (stateCode) params.append('stateCode', stateCode); 
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (segment) params.append('segment', segment);

    try {
        const response = await fetch(`${API_BASE_URL}/api/events/search?${params}`);
        //const response = await fetch(`${API_BASE_URL}/search?${params}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching events:', error);
        throw error;
    }
};

export const getEventImage = async (eventId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/events/image/${eventId}`);
        //const response = await fetch(`${API_BASE_URL}/image/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch image');
        return await response.json();
    } catch (error) {
        console.error('Error fetching event image:', error);
        throw error;
    }
};