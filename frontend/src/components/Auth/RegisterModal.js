import React, { useState } from 'react';
import './Auth.css';
import { register } from '../../services/userService';
import { MESSAGES } from '../../utils/constants';

function RegisterModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    // Validate form
    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return false;
        }

        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await register(
                formData.username,
                formData.email,
                formData.password
            );
            
            if (response.success && response.user) {
                onSuccess(response.user);
                // Show success message
                alert(MESSAGES.REGISTER_SUCCESS);
            } else {
                setError(response.error || MESSAGES.REGISTER_ERROR);
            }
        } catch (err) {
            setError(err.error || MESSAGES.REGISTER_ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>Create Account</h2>
                    <p>Join Event Hub to discover amazing events</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-alert">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Creating account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </div>

                    <div className="form-footer">
                        <p>
                            Already have an account? 
                            <button 
                                type="button"
                                className="link-button"
                                onClick={() => {
                                    // Switch to login modal
                                    onClose();
                                    // Parent should handle showing login modal
                                }}
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterModal;