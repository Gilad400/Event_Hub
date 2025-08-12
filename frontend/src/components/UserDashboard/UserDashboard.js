import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import { getFavorites, removeFromFavorites } from '../../services/userService';

function UserDashboard({ user, setUser, onClose }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('favorites');
    const [stats, setStats] = useState({
        totalFavorites: 0,
        upcomingEvents: 0,
        pastEvents: 0
    });

    // Load user favorites on mount
    useEffect(() => {
        if (user?._id) {
            loadFavorites();
        }
    }, [user]);

    // Load favorites from backend
    const loadFavorites = async () => {
        setLoading(true);
        try {
            const response = await getFavorites(user._id);
            if (response.success) {
                setFavorites(response.favorites || []);
                calculateStats(response.favorites || []);
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = (favs) => {
        const now = new Date();
        let upcoming = 0;
        let past = 0;

        favs.forEach(fav => {
            if (fav.date) {
                const eventDate = new Date(fav.date);
                if (eventDate > now) {
                    upcoming++;
                } else {
                    past++;
                }
            }
        });

        setStats({
            totalFavorites: favs.length,
            upcomingEvents: upcoming,
            pastEvents: past
        });
    };

    // Handle removing favorite
    const handleRemoveFavorite = async (eventId) => {
        if (!window.confirm('Remove this event from favorites?')) {
            return;
        }

        try {
            const response = await removeFromFavorites(user._id, eventId);
            if (response.success) {
                setFavorites(prev => prev.filter(f => f.event_id !== eventId));
                setStats(prev => ({
                    ...prev,
                    totalFavorites: prev.totalFavorites - 1
                }));
            }
        } catch (error) {
            console.error('Failed to remove favorite:', error);
            alert('Failed to remove favorite');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="dashboard-container">
            {/* Dashboard header */}
            <div className="dashboard-header">
                <div className="dashboard-header-content">
                    <div className="user-profile">
                        <div className="user-avatar-large">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <h1>Welcome back, {user.username}!</h1>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <button className="btn-close-dashboard" onClick={onClose}>
                        Back to Events
                    </button>
                </div>
            </div>

            {/* Statistics cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">❤️</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalFavorites}</div>
                        <div className="stat-label">Total Favorites</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.upcomingEvents}</div>
                        <div className="stat-label">Upcoming Events</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.pastEvents}</div>
                        <div className="stat-label">Past Events</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="dashboard-tabs">
                <button 
                    className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    My Favorites
                </button>
                <button 
                    className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>

            {/* Tab content */}
            <div className="tab-content">
                {activeTab === 'favorites' && (
                    <div className="favorites-section">
                        {loading ? (
                            <div className="loading-state">
                                <div className="loading-spinner-large"></div>
                                <p>Loading your favorites...</p>
                            </div>
                        ) : favorites.length > 0 ? (
                            <div className="favorites-grid">
                                {favorites.map((favorite) => (
                                    <div key={favorite.event_id} className="favorite-card">
                                        <div className="favorite-image">
                                            <img 
                                                src={favorite.image || 'https://via.placeholder.com/300x200?text=Event'} 
                                                alt={favorite.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x200?text=Event';
                                                }}
                                            />
                                        </div>
                                        <div className="favorite-content">
                                            <h3>{favorite.name}</h3>
                                            <div className="favorite-info">
                                                <p>
                                                    <span className="info-icon">📅</span>
                                                    {formatDate(favorite.date)}
                                                </p>
                                                {favorite.venue && (
                                                    <p>
                                                        <span className="info-icon">📍</span>
                                                        {favorite.venue}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="favorite-actions">
                                                <button 
                                                    className="btn-remove"
                                                    onClick={() => handleRemoveFavorite(favorite.event_id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-favorites">
                                <span className="empty-icon">💔</span>
                                <h3>No Favorites Yet</h3>
                                <p>Start exploring events and add your favorites here!</p>
                                <button className="btn-explore" onClick={onClose}>
                                    Explore Events
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-section">
                        <div className="settings-card">
                            <h3>Account Settings</h3>
                            <div className="settings-item">
                                <label>Username</label>
                                <p>{user.username}</p>
                            </div>
                            <div className="settings-item">
                                <label>Email</label>
                                <p>{user.email}</p>
                            </div>
                            <div className="settings-item">
                                <label>Member Since</label>
                                <p>{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="settings-card danger-zone">
                            <h3>Danger Zone</h3>
                            <p>Once you delete your account, there is no going back.</p>
                            <button 
                                className="btn-danger"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to logout?')) {
                                        setUser(null);
                                        localStorage.removeItem('user');
                                        localStorage.removeItem('authToken');
                                        onClose();
                                    }
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;