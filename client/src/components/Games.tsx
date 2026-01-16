import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGames, Game, getGamePlayers, Player } from '../services/api';
import './Games.css';
import GamePlayerAssignment from './GamePlayerAssignment';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [showAssignment, setShowAssignment] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      loadGamePlayers(selectedGame);
    }
  }, [selectedGame]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await getGames();
      setGames(data);
      setError(null);
    } catch (err) {
      setError('Failed to load games. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const loadGamePlayers = async (gameId: number) => {
    try {
      const players = await getGamePlayers(gameId);
      setGamePlayers(players);
    } catch (err) {
      console.error('Failed to load game players:', err);
    }
  };

  const handleToggleAssignment = (gameId: number) => {
    if (selectedGame === gameId && showAssignment) {
      setShowAssignment(false);
      setSelectedGame(null);
    } else {
      setSelectedGame(gameId);
      setShowAssignment(true);
    }
  };

  const handlePlayerAdded = async () => {
    if (selectedGame) {
      await loadGamePlayers(selectedGame);
      await loadGames();
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading games...</div>
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
        <h1>Games</h1>
      </div>

      <div className="games-list">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <div className="game-header">
              <h2>{game.name}</h2>
              <span className={`status-badge status-${game.status}`}>
                {game.status}
              </span>
            </div>

            {game.date && (
              <div className="game-info-item">
                <span className="info-label">📅 Date:</span>
                <span className="info-value">{new Date(game.date).toLocaleDateString()}</span>
              </div>
            )}

            {game.format && (
              <div className="game-info-item">
                <span className="info-label">📋 Format:</span>
                <span className="info-value">{game.format}</span>
              </div>
            )}

            {game.team_composition && (
              <div className="game-info-item">
                <span className="info-label">👥 Team Composition:</span>
                <div className="info-value multi-line">{game.team_composition.split('\n').map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}</div>
              </div>
            )}

            {game.description && (
              <p className="game-description">{game.description}</p>
            )}

            {game.game_rules && (
              <div className="game-rules">
                <h3>📜 Game Rules:</h3>
                <div className="rules-content">
                  {game.game_rules.split('\n').map((rule, idx) => (
                    <div key={idx} className="rule-item">{rule}</div>
                  ))}
                </div>
              </div>
            )}

            {game.player_count !== undefined && (
              <div className="player-count">
                <span className="info-label">Players Assigned:</span>
                <span className="info-value">{game.player_count}</span>
              </div>
            )}

            <button 
              className="assign-players-btn"
              onClick={() => handleToggleAssignment(game.id)}
            >
              {selectedGame === game.id && showAssignment ? '▼ Hide Player Assignment' : '▶ Add Players'}
            </button>

            {selectedGame === game.id && showAssignment && (
              <GamePlayerAssignment
                game={game}
                assignedPlayers={gamePlayers}
                onPlayerAdded={handlePlayerAdded}
              />
            )}

            <div className="game-teams">
              {game.team1_name && (
                <div className="team-info" style={{ borderLeftColor: game.team1_color || '#ccc' }}>
                  <span className="team-label">Team 1:</span>
                  <span className="team-name">{game.team1_name}</span>
                </div>
              )}

              {game.team2_name && (
                <div className="team-info" style={{ borderLeftColor: game.team2_color || '#ccc' }}>
                  <span className="team-label">Team 2:</span>
                  <span className="team-name">{game.team2_name}</span>
                </div>
              )}
            </div>

            {game.winner_name && (
              <div className="winner">
                🏆 Winner: {game.winner_name}
              </div>
            )}
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="empty-state">No games found. Games will appear here once they are created.</div>
      )}
    </div>
  );
};

export default Games;
