import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlayers, Player } from '../services/api';
import './Players.css';

const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await getPlayers();
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load players. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="players-page">
        <div className="loading">Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="players-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="players-page">
      <div className="players-header">
        <h1>Players ({players.length})</h1>
      </div>

      <div className="players-content">
        <div className="players-grid">
          {players.map((player) => (
            <div key={player.id} className="player-card">
              <div className="player-avatar">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="player-info">
                <h3>{player.name}</h3>
                <div className="player-meta">
                  {player.team_name ? (
                    <div className="player-team">
                      <span 
                        className="team-color-dot" 
                        style={{ backgroundColor: player.team_color || '#ccc' }}
                      ></span>
                      <span>{player.team_name}</span>
                    </div>
                  ) : (
                    <div className="player-team no-team">No team</div>
                  )}
                </div>
                <div className="player-badges">
                  {player.gender && (
                    <span className="player-badge gender">{player.gender}</span>
                  )}
                  {player.age_category && (
                    <span className="player-badge age">{player.age_category}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {players.length === 0 && (
        <div className="empty-state">No players found. Players will appear here once they are created.</div>
      )}
    </div>
  );
};

export default Players;
