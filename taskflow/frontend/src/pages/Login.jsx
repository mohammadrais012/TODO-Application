import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, setAuthData } from '../services/api.js';

/**
 * Login Page Component
 */
function Login({ onAuthSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setIsLoading(true);
      const data = await login(email, password);

      // Store JWT token and user info
      setAuthData(data.token, data.user);

      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
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
            <h2>Organize your day with clarity.</h2>
            <p>
              A focused, distraction-free task manager built to help you track
              priorities, finish projects, and build productive habits.
            </p>
          </div>

          <div className="auth-sidebar-footer">
            <span>Simple. Reliable. Fast.</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="auth-main">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Please enter your account details to sign in</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
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
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
