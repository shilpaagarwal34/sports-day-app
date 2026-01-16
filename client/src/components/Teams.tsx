import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeams, Team } from '../services/api';
import './Teams.css';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setTeams(data);
      setError(null);
    } catch (err) {
      setError('Failed to load teams. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading teams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h1>Teams</h1>
      </div>

      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <div 
              className="team-color-bar" 
              style={{ backgroundColor: team.color }}
            ></div>
            <div className="team-content">
              <h2>{team.name}</h2>
              <div className="team-details">
                <span className="color-label">Color:</span>
                <span 
                  className="color-swatch" 
                  style={{ backgroundColor: team.color }}
                ></span>
                <span className="color-code">{team.color}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="empty-state">No teams found. Teams will appear here once they are created.</div>
      )}
    </div>
  );
};

export default Teams;
