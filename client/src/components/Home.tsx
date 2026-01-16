import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="home-container">
        <h1>🏃 Sports Day Management</h1>
        <p className="subtitle">Manage teams, players, and games for your sports day event</p>
        
        <div className="navigation-cards">
          <Link to="/dashboard" className="nav-card dashboard-card">
            <div className="card-icon">📊</div>
            <h2>Dashboard</h2>
            <p>View statistics and assignments</p>
          </Link>
          
          <Link to="/players" className="nav-card players-card">
            <div className="card-icon">👤</div>
            <h2>Players</h2>
            <p>View and manage players</p>
          </Link>
          
          <Link to="/games" className="nav-card games-card">
            <div className="card-icon">⚽</div>
            <h2>Games</h2>
            <p>View and manage games</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
