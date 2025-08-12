import React, { useState } from 'react';
import './Header.css';

function Header({ user, onLoginClick, onRegisterClick, onDashboardClick, onLogout }) {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="app-header">
            <div className="header-container">
                {/* Logo and brand */}
                <div className="header-brand">
                    <div className="logo">
                        <span className="logo-icon">🎭</span>
                        <span className="logo-text">Event Hub</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="header-nav">
                    <a href="/" className="nav-link">Home</a>
                    <a href="#events" className="nav-link">Browse Events</a>
                    <a href="#about" className="nav-link">About</a>
                </nav>

                {/* User section */}
                <div className="header-user">
                    {user ? (
                        <div className="user-menu-container">
                            <button 
                                className="user-menu-trigger"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <span className="user-avatar">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                                <span className="user-name">{user.username}</span>
                                <span className="menu-arrow">▼</span>
                            </button>

                            {showUserMenu && (
                                <div className="user-menu-dropdown">
                                    <button 
                                        className="menu-item"
                                        onClick={() => {
                                            onDashboardClick();
                                            setShowUserMenu(false);
                                        }}
                                    >
                                        <span className="menu-icon">📊</span>
                                        Dashboard
                                    </button>
                                    <button 
                                        className="menu-item"
                                        onClick={() => {
                                            onDashboardClick();
                                            setShowUserMenu(false);
                                        }}
                                    >
                                        <span className="menu-icon">❤️</span>
                                        My Favorites
                                    </button>
                                    <div className="menu-divider"></div>
                                    <button 
                                        className="menu-item menu-item-danger"
                                        onClick={() => {
                                            onLogout();
                                            setShowUserMenu(false);
                                        }}
                                    >
                                        <span className="menu-icon">🚪</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button 
                                className="btn btn-outline-light"
                                onClick={onLoginClick}
                            >
                                Login
                            </button>
                            <button 
                                className="btn btn-primary-light"
                                onClick={onRegisterClick}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;