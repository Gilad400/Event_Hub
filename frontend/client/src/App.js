import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import UserBox from './components/UserBox/UserBox';
import UserDashboard from './components/UserDashboard';
import SearchBar from './components/SearchBar/SearchBar';
import SignInModal from './components/SignInModal/SignInModal';
import LoginModal from './components/LoginModal/LoginModal';

function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser({
      _id: userData._id,
      username: userData.username,
      favorites: userData.favorites || []
    });
    setIsLoginOpen(false);
  };

  const handleSignUpSuccess = (userData) => {
    setUser({
      _id: userData._id,
      username: userData.username,
      favorites: userData.favorites || []
    });
    setIsSignInOpen(false);
  };

  return (
    <div className="App">
      <Header />
      <UserBox user={user} />
      <SearchBar />
      {user ? (
        <UserDashboard user={user} setUser={setUser} />
      ) : (
        <div className="auth-buttons">
          <button onClick={() => setIsSignInOpen(true)}>Sign Up</button>
          <button onClick={() => setIsLoginOpen(true)}>Log In</button>
        </div>
      )}

      {isSignInOpen && (
        <SignInModal 
          onClose={() => setIsSignInOpen(false)} 
          onSignUpSuccess={handleSignUpSuccess}
        />
      )}
      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;