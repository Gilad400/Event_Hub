import React, { useState } from 'react';
import { searchEvents } from '../../services/eventService';
import EventGrid from '../EventGrid/EventGrid';
import './SearchBar.css';

const SearchBar = () => {
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        city: '',
        stateCode: '',
        startDate: '',
        endDate: '',
        segment: ''
    });
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const results = await searchEvents(searchParams);
            setEvents(results._embedded?.events || []);
            setShowResults(true);
        } catch (err) {
            setError('Failed to search events. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="keyword"
                        placeholder="Search events..."
                        value={searchParams.keyword}
                        onChange={handleInputChange}
                        className="search-input"
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={searchParams.city}
                            onChange={handleInputChange}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <input
                            type="text"
                            name="stateCode"
                            placeholder="State (NY, CA...)"
                            value={searchParams.stateCode}
                            onChange={handleInputChange}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <input
                            type="date"
                            name="startDate"
                            value={searchParams.startDate}
                            onChange={handleInputChange}
                            className="search-input"
                        />
                    </div>
                    
                    
                    <div className="form-group">
                        <input
                            type="date"
                            name="endDate"
                            value={searchParams.endDate}
                            onChange={handleInputChange}
                            className="search-input"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="search-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Searching...' : 'Search Events'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {showResults && (
                <div className="results-modal">
                    <div className="modal-content">
                        <button 
                            className="close-button"
                            onClick={() => setShowResults(false)}
                        >
                            ×
                        </button>
                        <EventGrid events={events} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;