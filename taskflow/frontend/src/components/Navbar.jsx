import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navbar component for authenticated pages
 * Displays the TaskFlow brand, current user's name, and a logout button
 */
function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="brand-link">
          <div className="brand-icon">✓</div>
          <span>TaskFlow</span>
        </Link>

        <div className="navbar-user">
          {user && (
            <span className="user-greeting">
              Hi, <span className="user-name-highlight">{user.name}</span>
            </span>
          )}
          <button onClick={onLogout} className="logout-btn" title="Sign out of TaskFlow">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
