import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Login.css';
import logo from '../assets/Screenshot 2024-10-16 101238.png';

function Login() {
  const { setUser } = useContext(UserContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(''); // New state for email warning
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsAdminLogin(false);
    resetForm();
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setIsSignUp(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setEmailError(''); // Reset email warning
  };

  // Email validation function
  const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Password validation function
  const isPasswordValid = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(isEmailValid(e.target.value) ? '' : 'Invalid email format'); // Check email format
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords don't match");
        return;
      }
      if (!isPasswordValid(password)) {
        setErrorMessage(
          'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        );
        return;
      }
      if (!isEmailValid(email)) {
        setEmailError('Invalid email format');
        return;
      }
    }
    
    setErrorMessage('');

    const endpoint = isAdminLogin
      ? 'http://localhost:5000/api/admin/login'
      : isSignUp
      ? 'http://localhost:5000/api/signup'
      : 'http://localhost:5000/api/login';
      
    const body = JSON.stringify({ email, password });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'An error occurred');
      } else {
        setUser(email);

        if (isAdminLogin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
        
        resetForm();
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className={`login-container ${isSignUp ? 'sign-up-mode' : ''} ${isAdminLogin ? 'admin-login-mode' : ''}`}>
      <div className="login-left">
        <img src={logo} alt="BoroSell Logo" className="logo" />
        <div className="welcome-wrapper-login">
          <h1 className="welcome-message-login">
            {isAdminLogin
              ? 'Admin Login'
              : isSignUp
              ? 'Join BoroSell Today!'
              : 'Welcome to BoroSell!'}
          </h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>{isAdminLogin ? 'Admin Login' : isSignUp ? 'Sign Up' : 'Login'}</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {emailError && <div className="warning-message">{emailError}</div>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-block">
              {isAdminLogin ? 'Admin Login' : isSignUp ? 'Sign Up' : 'Login'}
            </button>
            {!isAdminLogin && (
              <button type="button" className="btn btn-signup" onClick={toggleForm}>
                {isSignUp ? 'Go to Login' : 'Sign Up'}
              </button>
            )}
            {!isSignUp && (
              <button type="button" className="btn btn-admin-login" onClick={toggleAdminLogin}>
                {isAdminLogin ? 'Go to User Login' : 'Admin Login'}
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="login-right">
        <img
          src={
            isSignUp
              ? require('../assets/wolfgang-hasselmann-VMK_DnJg48A-unsplash.jpg')
              : isAdminLogin
              ? require('../assets/patrick-langwallner-nLhAXKQAp6A-unsplash.jpg')
              : require('../assets/patrick-langwallner-nLhAXKQAp6A-unsplash.jpg')
          }
          alt="Visual"
        />
      </div>
    </div>
  );
}

export default Login;
