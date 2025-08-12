import React, { useState } from 'react';
import './SearchBar.css';
import { searchEvents } from '../../services/eventService';
import { EVENT_SEGMENTS } from '../../utils/constants';

function SearchBar({ onSearchResults, onSearchError, loading, setLoading }) {
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        city: '',
        stateCode: '',
        startDate: '',
        endDate: '',
        segment: ''
    });
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate at least one search parameter
        const hasSearchParams = Object.values(searchParams).some(value => value.trim() !== '');
        if (!hasSearchParams) {
            onSearchError('Please enter at least one search parameter');
            return;
        }

        setLoading(true);
        
        try {
            const results = await searchEvents(searchParams);
            onSearchResults(results.events || []);
        } catch (error) {
            onSearchError(error.error || 'Failed to search events');
        } finally {
            setLoading(false);
        }
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchParams({
            keyword: '',
            city: '',
            stateCode: '',
            startDate: '',
            endDate: '',
            segment: ''
        });
        onSearchResults([]);
    };

    // Get today's date for date input min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                {/* Main search bar */}
                <div className="main-search">
                    <div className="search-input-group">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            name="keyword"
                            value={searchParams.keyword}
                            onChange={handleInputChange}
                            placeholder="Search for events, artists, venues..."
                            className="main-search-input"
                        />
                    </div>
                    
                    <button
                        type="button"
                        className="btn-advanced"
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    >
                        <span className="filter-icon">⚙️</span>
                        Advanced
                    </button>

                    <button 
                        type="submit" 
                        className="btn-search"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Searching...
                            </>
                        ) : (
                            <>
                                <span className="search-btn-icon">🎯</span>
                                Search Events
                            </>
                        )}
                    </button>
                </div>

                {/* Advanced search options */}
                {isAdvancedOpen && (
                    <div className="advanced-search">
                        <div className="search-grid">
                            {/* Location inputs */}
                            <div className="search-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={searchParams.city}
                                    onChange={handleInputChange}
                                    placeholder="e.g., New York"
                                    className="search-input"
                                />
                            </div>

                            <div className="search-group">
                                <label htmlFor="stateCode">State Code</label>
                                <input
                                    type="text"
                                    id="stateCode"
                                    name="stateCode"
                                    value={searchParams.stateCode}
                                    onChange={handleInputChange}
                                    placeholder="e.g., NY"
                                    maxLength="2"
                                    className="search-input"
                                />
                            </div>

                            {/* Date inputs */}
                            <div className="search-group">
                                <label htmlFor="startDate">Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={searchParams.startDate}
                                    onChange={handleInputChange}
                                    min={today}
                                    className="search-input"
                                />
                            </div>

                            <div className="search-group">
                                <label htmlFor="endDate">End Date</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={searchParams.endDate}
                                    onChange={handleInputChange}
                                    min={searchParams.startDate || today}
                                    className="search-input"
                                />
                            </div>

                            {/* Category selector */}
                            <div className="search-group search-group-full">
                                <label htmlFor="segment">Category</label>
                                <select
                                    id="segment"
                                    name="segment"
                                    value={searchParams.segment}
                                    onChange={handleInputChange}
                                    className="search-input"
                                >
                                    {EVENT_SEGMENTS.map(segment => (
                                        <option key={segment.value} value={segment.value}>
                                            {segment.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="search-actions">
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="btn-clear"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </form>

            {/* Active filters display */}
            {Object.entries(searchParams).some(([key, value]) => value) && (
                <div className="active-filters">
                    <span className="filters-label">Active filters:</span>
                    {Object.entries(searchParams).map(([key, value]) => {
                        if (!value) return null;
                        return (
                            <span key={key} className="filter-tag">
                                {key}: {value}
                                <button
                                    onClick={() => handleInputChange({ 
                                        target: { name: key, value: '' } 
                                    })}
                                    className="filter-remove"
                                >
                                    ×
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SearchBar;