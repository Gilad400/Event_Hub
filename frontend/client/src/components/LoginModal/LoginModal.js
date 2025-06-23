import React, { useState } from 'react';
import './LoginModal.css';

function LoginModal({ onClose, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Login successful!');
                onLoginSuccess(result.user); // Pass the user data to the parent component
                onClose(); // Close the modal after successful login
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Log In</h2>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleSubmit}>Log In</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default LoginModal;
