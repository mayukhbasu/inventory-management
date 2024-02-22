import React from 'react';
import './LoginPage.css';

const LoginPage = () => {

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  return (
    <div className="loginContainer" data-testid="login-page">
      <h1 className="title">Welcome to Inventory Management System</h1>
      <button className="googleButton" onClick={handleLogin}>
        Sign in with Google
      </button>
      
    </div>
  );
};

export default LoginPage;