import React, { useState } from 'react';
import SignInModal from '../SignInModal/SignInModal';
import LoginModal from '../LoginModal/LoginModal';
import './UserBox.css';

function UserBox() {
    const [user, setUser] = useState(null);
    const [showSignIn, setShowSignIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleSignIn = (userInfo) => {
        setUser(userInfo);
        setShowSignIn(false);
    };

    const handleLogin = (username) => {
        setUser({ username });
        setShowLogin(false);
    };

    return (
        <div className="user-box">
            {user ? (
                <div className="user-info">
                    Hi, {user.username}
                </div>
            ) : (
                <div className="guest-box">
                    Hi, guest
                    <button onClick={() => setShowSignIn(true)}>Sign In</button>
                    <button onClick={() => setShowLogin(true)}>Log In</button>
                </div>
            )}

            {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} onSignIn={handleSignIn} />}
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
        </div>
    );
}

export default UserBox;
