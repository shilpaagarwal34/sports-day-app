import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

interface GameStat {
  id: number;
  name: string;
  date: string | null;
  assigned_players: number;
  required_players: number | null;
  remaining_players: number | null;
  team_composition: string | null;
}

interface PlayerStat {
  id: number;
  name: string;
  gender: string | null;
  age_category: string | null;
  games_count: number;
}

interface DashboardData {
  games: GameStat[];
  players: PlayerStat[];
}

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      if (!response.ok) throw new Error('Failed to load dashboard data');
      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (assigned: number, required: number | null) => {
    if (required === null) return '#667eea';
    const percentage = (assigned / required) * 100;
    if (percentage >= 100) return '#28a745';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getProgressWidth = (assigned: number, required: number | null) => {
    if (required === null) return 100;
    return Math.min(100, (assigned / required) * 100);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container">
        <div className="error">{error || 'No data available'}</div>
      </div>
    );
  }

  const totalGames = data.games.length;
  const totalPlayers = data.players.length;
  const playersInGames = data.players.filter(p => p.games_count > 0).length;
  const avgGamesPerPlayer = data.players.length > 0 
    ? (data.players.reduce((sum, p) => sum + p.games_count, 0) / data.players.length).toFixed(1)
    : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h1>📊 Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">⚽</div>
          <div className="summary-content">
            <div className="summary-value">{totalGames}</div>
            <div className="summary-label">Total Games</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">👥</div>
          <div className="summary-content">
            <div className="summary-value">{totalPlayers}</div>
            <div className="summary-label">Total Players</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-value">{playersInGames}</div>
            <div className="summary-label">Players in Games</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <div className="summary-value">{avgGamesPerPlayer}</div>
            <div className="summary-label">Avg Games/Player</div>
          </div>
        </div>
      </div>

      {/* Games Section */}
      <div className="dashboard-section">
        <h2>🎮 Game Player Assignments</h2>
        <div className="games-stats">
          {data.games.map((game) => (
            <div key={game.id} className="game-stat-card">
              <div className="game-stat-header">
                <h3>{game.name}</h3>
                {game.date && (
                  <span className="game-date">{new Date(game.date).toLocaleDateString()}</span>
                )}
              </div>
              
              <div className="progress-container">
                <div className="progress-info">
                  <span className="progress-label">
                    {game.assigned_players} / {game.required_players || '∞'} players
                  </span>
                  {game.remaining_players !== null && (
                    <span className={`remaining ${game.remaining_players === 0 ? 'complete' : 'pending'}`}>
                      {game.remaining_players === 0 ? '✓ Complete' : `${game.remaining_players} remaining`}
                    </span>
                  )}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${getProgressWidth(game.assigned_players, game.required_players)}%`,
                      backgroundColor: getProgressColor(game.assigned_players, game.required_players)
                    }}
                  ></div>
                </div>
              </div>

              {game.team_composition && (
                <div className="game-composition">
                  <small>{game.team_composition}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Players Section */}
      <div className="dashboard-section">
        <h2>👤 Player Game Participation</h2>
        <div className="players-stats">
          {data.players.map((player) => (
            <div key={player.id} className="player-stat-card">
              <div className="player-stat-header">
                <h3>{player.name}</h3>
                <div className="player-badges">
                  {player.gender && (
                    <span className="badge gender">{player.gender}</span>
                  )}
                  {player.age_category && (
                    <span className="badge age">{player.age_category}</span>
                  )}
                </div>
              </div>
              <div className="player-games-count">
                <span className="count-value">{player.games_count}</span>
                <span className="count-label">
                  {player.games_count === 1 ? 'game' : 'games'}
                </span>
              </div>
              {player.games_count === 0 && (
                <span className="no-games">Not assigned to any games</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
