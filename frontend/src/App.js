import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import EventGrid from './components/EventGrid/EventGrid';
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import UserDashboard from './components/UserDashboard/UserDashboard';

function App() {
    // State management
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const [searchParams, setSearchParams] = useState({});
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to load user data');
                localStorage.removeItem('user');
            }
        }
    }, []);

    // Handle user login
    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowLogin(false);
        setError(null);
    };

    // Handle user registration
    const handleRegister = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowRegister(false);
        setError(null);
    };

    // Handle logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setShowDashboard(false);
        setEvents([]);
    };

    // Handle search results
    const handleSearchResults = (searchResults) => {
        setEvents(searchResults);
        setError(null);
    };

    // Handle search error
    const handleSearchError = (errorMessage) => {
        setError(errorMessage);
        setEvents([]);
    };

    return (
        <div className="App">
            {/* Header with user info and navigation */}
            <Header 
                user={user}
                onLoginClick={() => setShowLogin(true)}
                onRegisterClick={() => setShowRegister(true)}
                onDashboardClick={() => setShowDashboard(true)}
                onLogout={handleLogout}
            />

            {/* Main content area */}
            <main className="main-content">
                {!showDashboard ? (
                    <>
                        {/* Search section */}
                        <section className="hero-section">
                            <div className="hero-content">
                                <h1 className="hero-title">
                                    Discover Amazing Events Near You
                                </h1>
                                <p className="hero-subtitle">
                                    Find concerts, sports, theater, and more
                                </p>
                            </div>
                        </section>

                        {/* Search bar */}
                        <SearchBar 
                            onSearchResults={handleSearchResults}
                            onSearchError={handleSearchError}
                            loading={loading}
                            setLoading={setLoading}
                        />

                        {/* Error display */}
                        {error && (
                            <div className="error-banner">
                                <p>{error}</p>
                                <button onClick={() => setError(null)}>✕</button>
                            </div>
                        )}

                        {/* Events grid */}
                        {events.length > 0 && (
                            <EventGrid 
                                events={events}
                                user={user}
                                loading={loading}
                            />
                        )}

                        {/* Empty state */}
                        {!loading && events.length === 0 && !error && (
                            <div className="empty-state">
                                <h2>Start Your Event Discovery</h2>
                                <p>Use the search bar above to find exciting events</p>
                            </div>
                        )}
                    </>
                ) : (
                    // User dashboard
                    <UserDashboard 
                        user={user}
                        setUser={setUser}
                        onClose={() => setShowDashboard(false)}
                    />
                )}
            </main>

            {/* Modals */}
            {showLogin && (
                <LoginModal 
                    onClose={() => setShowLogin(false)}
                    onSuccess={handleLogin}
                />
            )}

            {showRegister && (
                <RegisterModal 
                    onClose={() => setShowRegister(false)}
                    onSuccess={handleRegister}
                />
            )}

            {/* Footer */}
            <footer className="app-footer">
                <p>© 2024 Event Hub - Your Gateway to Amazing Events</p>
            </footer>
        </div>
    );
}

export default App;