import React, { useState } from 'react';
import './EventCard.css';
import { addToFavorites, removeFromFavorites } from '../../services/userService';

function EventCard({ event, user }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    // Format time
    const formatTime = (timeString) => {
        if (!timeString) return '';
        // Convert 24hr to 12hr format
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Handle favorite toggle
    const handleFavoriteToggle = async () => {
        if (!user) {
            alert('Please login to add favorites');
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorite) {
                await removeFromFavorites(user._id, event.id);
                setIsFavorite(false);
            } else {
                const eventData = {
                    id: event.id,
                    name: event.name,
                    date: event.localDate,
                    venue: event.venue?.name,
                    image: event.image
                };
                await addToFavorites(user._id, eventData);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Favorite toggle error:', error);
            alert('Failed to update favorites');
        } finally {
            setIsLoading(false);
        }
    };

    // Get price display
    const getPriceDisplay = () => {
        if (!event.priceRanges || event.priceRanges.length === 0) {
            return 'Price TBD';
        }
        const range = event.priceRanges[0];
        if (range.min === range.max) {
            return `$${range.min}`;
        }
        return `$${range.min} - $${range.max}`;
    };

    return (
        <div className="event-card">
            {/* Event image with fallback */}
            <div className="event-card-image">
                <img 
                    src={event.image || 'https://via.placeholder.com/400x250?text=Event'} 
                    alt={event.name}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=Event';
                    }}
                />
                
                {/* Favorite button */}
                <button 
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavoriteToggle}
                    disabled={isLoading}
                    aria-label="Add to favorites"
                >
                    {isLoading ? '...' : (isFavorite ? '❤️' : '🤍')}
                </button>

                {/* Event category badge */}
                {event.segment && (
                    <span className="event-badge">{event.segment}</span>
                )}
            </div>

            {/* Event details */}
            <div className="event-card-content">
                <h3 className="event-title">{event.name}</h3>
                
                <div className="event-info">
                    {/* Date and time */}
                    <div className="info-item">
                        <span className="info-icon">📅</span>
                        <div>
                            <p className="info-label">Date & Time</p>
                            <p className="info-value">
                                {formatDate(event.localDate)}
                                {event.localTime && ` at ${formatTime(event.localTime)}`}
                            </p>
                        </div>
                    </div>

                    {/* Venue */}
                    {event.venue && (
                        <div className="info-item">
                            <span className="info-icon">📍</span>
                            <div>
                                <p className="info-label">Venue</p>
                                <p className="info-value">
                                    {event.venue.name}
                                    {event.venue.city && `, ${event.venue.city}`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Price */}
                    <div className="info-item">
                        <span className="info-icon">💵</span>
                        <div>
                            <p className="info-label">Price</p>
                            <p className="info-value price">{getPriceDisplay()}</p>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="event-card-actions">
                    <a 
                        href={event.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-tickets"
                    >
                        <span>Get Tickets</span>
                        <span className="btn-arrow">→</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default EventCard;