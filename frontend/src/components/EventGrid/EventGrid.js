import React from 'react';
import './EventGrid.css';
import EventCard from '../EventCard/EventCard';

function EventGrid({ events, user, loading }) {
    if (loading) {
        return (
            <div className="event-grid-loading">
                <div className="loading-spinner-large"></div>
                <p>Loading amazing events...</p>
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="event-grid-empty">
                <span className="empty-icon">🎭</span>
                <h3>No Events Found</h3>
                <p>Try adjusting your search filters or search for something else</p>
            </div>
        );
    }

    return (
        <div className="event-grid-container">
            <div className="event-grid-header">
                <h2>Discover Events</h2>
                <p className="event-count">Found {events.length} events</p>
            </div>
            
            <div className="event-grid">
                {events.map((event) => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        user={user}
                    />
                ))}
            </div>
        </div>
    );
}

export default EventGrid;