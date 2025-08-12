import React, { useState } from 'react';
import './Auth.css';
import { login } from '../../services/userService';
import { MESSAGES } from '../../utils/constants';

function LoginModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await login(formData.email, formData.password);
            
            if (response.success && response.user) {
                onSuccess(response.user);
                // Show success message
                alert(MESSAGES.LOGIN_SUCCESS);
            } else {
                setError(response.error || MESSAGES.LOGIN_ERROR);
            }
        } catch (err) {
            setError(err.error || MESSAGES.LOGIN_ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>Welcome Back!</h2>
                    <p>Login to your Event Hub account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-alert">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

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
                            placeholder="Enter your password"
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
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>

                    <div className="form-footer">
                        <p>
                            Don't have an account? 
                            <button 
                                type="button"
                                className="link-button"
                                onClick={() => {
                                    // Switch to register modal
                                    onClose();
                                    // Parent should handle showing register modal
                                }}
                            >
                                Sign up here
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;