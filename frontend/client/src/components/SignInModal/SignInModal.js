import React, { useState } from 'react';
import './SignInModal.css';

function SignInModal({ onClose, onSignUpSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        favorites: []
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                //credentials: 'include'
            });

            const data = await response.json();
            
            if (response.ok) {
                onSignUpSuccess(data.user);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Sign Up</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Sign Up</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignInModal;