import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
        <div className="nav-user">
          <span className="nav-username">
            {user?.username} ({isAdmin ? 'Admin' : 'Read-only'})
          </span>
          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
