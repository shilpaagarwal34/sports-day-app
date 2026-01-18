import React, { useState, useEffect } from 'react';
import { getDashboard } from '../services/api';
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
      const dashboardData = await getDashboard();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (assigned: number, required: number | null) => {
    const maxPlayers = required ?? 13; // Use 13 as max for "All Players" games
    const percentage = (assigned / maxPlayers) * 100;
    if (percentage >= 100) return '#28a745';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getProgressWidth = (assigned: number, required: number | null) => {
    const maxPlayers = required ?? 13; // Use 13 as max for "All Players" games
    return Math.min(100, (assigned / maxPlayers) * 100);
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
  // Ensure games_count is a number (parse from string if needed)
  const playersWithNumericCounts = data.players.map(p => ({
    ...p,
    games_count: typeof p.games_count === 'string' ? parseInt(p.games_count, 10) : (p.games_count || 0)
  }));
  const playersInGames = playersWithNumericCounts.filter(p => p.games_count > 0).length;
  // Calculate average games per player - only for players who are in at least one game
  const playersWithGames = playersWithNumericCounts.filter(p => p.games_count > 0);
  const totalGamesCount = playersWithGames.reduce((sum, p) => sum + p.games_count, 0);
  const avgGamesPerPlayer = playersWithGames.length > 0 
    ? (totalGamesCount / playersWithGames.length).toFixed(1)
    : '0.0';

  return (
      <div className="page-container">
        <div className="page-header">
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
                    {game.assigned_players} / {game.required_players ?? 13} players
                  </span>
                  {game.remaining_players !== null && (
                    <span className={`remaining ${game.remaining_players === 0 ? 'complete' : 'pending'}`}>
                      {game.remaining_players === 0 ? '✓ Complete' : `${game.remaining_players} remaining`}
                    </span>
                  )}
                  {game.remaining_players === null && (
                    <span className="remaining pending">
                      {Math.max(0, 13 - game.assigned_players)} remaining
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
          {playersWithNumericCounts.map((player) => (
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
