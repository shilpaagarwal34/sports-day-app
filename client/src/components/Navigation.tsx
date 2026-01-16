import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          🏃 Sports Day
        </Link>
        <div className="nav-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link 
            to="/players" 
            className={`nav-link ${isActive('/players') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Players</span>
          </Link>
          <Link 
            to="/games" 
            className={`nav-link ${isActive('/games') ? 'active' : ''}`}
          >
            <span className="nav-icon">⚽</span>
            <span className="nav-text">Games</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
