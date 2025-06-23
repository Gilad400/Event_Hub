import React from 'react';
import './EventGrid.css';

const EventGrid = ({ events }) => {
    return (
        <div className="event-grid">
            {events.length === 0 ? (
                <p className="no-results">No events found</p>
            ) : (
                events.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-image">
                            <img 
                                src={event.images?.[0]?.url || '/placeholder-image.jpg'} 
                                alt={event.name}
                            />
                        </div>
                        <div className="event-info">
                            <h3>{event.name}</h3>
                            <p>{new Date(event.dates?.start?.dateTime).toLocaleDateString()}</p>
                            <p>{event._embedded?.venues?.[0]?.name}</p>
                            <p className="price">
                                {event.priceRanges 
                                    ? `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`
                                    : 'Price not available'
                                }
                            </p>
                            <button 
                                className="heart-button"
                                onClick="saveForLater(event.id)"
                            ></button>
                        </div>
                        
                    </div>
                ))
            )}
        </div>
    );
};

export default EventGrid;

