const API_BASE_URL = 'http://localhost:5000';

export const addToFavorites = async (userId, favorite) => {
    try {
        const response = await fetch(`${API_BASE_URL}/favorites/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Favorite added successfully!');
            return true;
        } else {
            alert(`Error: ${result.error}`);
            return false;
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        return false;
    }
};

export const removeFromFavorites = async (userId, favorite) => {
    try {
        const response = await fetch(`${API_BASE_URL}/favorites/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Favorite removed successfully!');
            return true;
        } else {
            alert(`Error: ${result.error}`);
            return false;
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        return false;
    }
};
