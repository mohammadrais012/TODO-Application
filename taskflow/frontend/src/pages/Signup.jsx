import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, setAuthData } from '../services/api.js';

/**
 * Signup Page Component
 */
function Signup({ onAuthSuccess }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validations
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter a valid email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const data = await signup(name.trim(), email.trim(), password);

      // Store JWT token and user info
      setAuthData(data.token, data.user);

      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        {/* Left Side: Branding & Subtle Motivation */}
        <div className="auth-sidebar">
          <div className="auth-sidebar-brand">
            <div className="brand-icon">✓</div>
            <span>TaskFlow</span>
          </div>

          <div className="auth-sidebar-content">
            <h2>Start getting more things done.</h2>
            <p>
              Join TaskFlow to streamline your daily workflow, categorize tasks
              by priority, and keep your focus where it matters most.
            </p>
          </div>

          <div className="auth-sidebar-footer">
            <span>Free. Simple. Practical.</span>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="auth-main">
          <div className="auth-header">
            <h1>Create an account</h1>
            <p>Sign up to start tracking your daily tasks</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <input
                id="signup-confirm-password"
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
