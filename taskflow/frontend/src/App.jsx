import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { getCurrentUser, clearAuthData } from './services/api.js';

/**
 * Main Application Component with React Router
 */
function App() {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  // Handle successful login or signup
  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    clearAuthData();
    setUser(null);
    navigate('/login');
  };

  return (
    <Routes>
      {/* Login Route: redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onAuthSuccess={handleAuthSuccess} />
          )
        }
      />

      {/* Signup Route: redirect to dashboard if already logged in */}
      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup onAuthSuccess={handleAuthSuccess} />
          )
        }
      />

      {/* Protected Dashboard Route: redirect to login if not authenticated */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Default Catch-all Route */}
      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}

export default App;
