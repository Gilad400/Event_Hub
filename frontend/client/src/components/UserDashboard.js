import React, { useState } from 'react';
import { addToFavorites, removeFromFavorites } from '../services/userService';
//import './UserDashboard.css';

function UserDashboard({ user, setUser }) {
    const [favoriteInput, setFavoriteInput] = useState('');
    const [error, setError] = useState('');

    const handleAddFavorite = async (e) => {
        e.preventDefault();
        if (!favoriteInput.trim()) return;

        try {
            const success = await addToFavorites(user._id, favoriteInput.trim());
            if (success) {
                setUser(prev => ({
                    ...prev,
                    favorites: [...prev.favorites, favoriteInput.trim()]
                }));
                setFavoriteInput('');
                setError('');
            }
        } catch (err) {
            setError('Failed to add favorite');
        }
    };

    const handleRemoveFavorite = async (favorite) => {
        try {
            const success = await removeFromFavorites(user._id, favorite);
            if (success) {
                setUser(prev => ({
                    ...prev,
                    favorites: prev.favorites.filter(f => f !== favorite)
                }));
                setError('');
            }
        } catch (err) {
            setError('Failed to remove favorite');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="user-info">
                <h2>Welcome, {user.username}!</h2>
                <button onClick={() => setUser(null)} className="logout-button">
                    Log Out
                </button>
            </div>

            <div className="favorites-section">
                <h3>Your Favorites</h3>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleAddFavorite} className="add-favorite-form">
                    <input
                        type="text"
                        value={favoriteInput}
                        onChange={(e) => setFavoriteInput(e.target.value)}
                        placeholder="Add a favorite"
                    />
                    <button type="submit">Add</button>
                </form>

                {user.favorites.length > 0 ? (
                    <ul className="favorites-list">
                        {user.favorites.map((favorite, index) => (
                            <li key={index} className="favorite-item">
                                <span>{favorite}</span>
                                <button 
                                    onClick={() => handleRemoveFavorite(favorite)}
                                    className="remove-button"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No favorites added yet</p>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;