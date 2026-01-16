import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGames, Game, getGamePlayers, Player } from '../services/api';
import './Games.css';
import GamePlayerAssignment from './GamePlayerAssignment';
import Modal from './Modal';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await getGames();
      setGames(data);
      setError(null);
    } catch (err) {
      setError('Failed to load games. Please check your connection.');
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

  const handleGameClick = async (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
    await loadGamePlayers(game.id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handlePlayerAdded = async () => {
    if (selectedGame) {
      // Update game players without page refresh
      await loadGamePlayers(selectedGame.id);
      // Update games list to refresh player counts
      await loadGames();
    }
  };

  if (loading) {
    return (
      <div className="games-page">
        <div className="loading">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="games-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="games-page">
      <div className="games-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h1>🎮 Games ({games.length})</h1>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => handleGameClick(game)}
          >
            <div className="game-card-header">
              <h3>{game.name}</h3>
              <span className={`status-badge status-${game.status}`}>
                {game.status}
              </span>
            </div>

            {game.date && (
              <div className="game-card-info">
                <span className="game-card-icon">📅</span>
                <span>{new Date(game.date).toLocaleDateString()}</span>
              </div>
            )}

            <div className="game-card-info">
              <span className="game-card-icon">👥</span>
              <span>
                {game.player_count || 0} {game.player_count === 1 ? 'player' : 'players'} assigned
              </span>
            </div>

            {game.format && (
              <div className="game-card-info">
                <span className="game-card-icon">📋</span>
                <span className="game-card-text-truncate">{game.format}</span>
              </div>
            )}

            {game.description && (
              <p className="game-card-description">{game.description}</p>
            )}

            <div className="game-card-footer">
              <button className="game-card-btn">
                Manage Players →
              </button>
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="empty-state">No games found. Games will appear here once they are created.</div>
      )}

      {selectedGame && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedGame.name}
        >
          <div className="modal-game-info">
            {selectedGame.date && (
              <div className="modal-info-item">
                <strong>Date:</strong> {new Date(selectedGame.date).toLocaleDateString()}
              </div>
            )}
            {selectedGame.format && (
              <div className="modal-info-item">
                <strong>Format:</strong> {selectedGame.format}
              </div>
            )}
            {selectedGame.team_composition && (
              <div className="modal-info-item">
                <strong>Team Composition:</strong>
                <div className="modal-multiline">{selectedGame.team_composition}</div>
              </div>
            )}
            {selectedGame.game_rules && (
              <div className="modal-info-item">
                <strong>Game Rules:</strong>
                <div className="modal-rules">
                  {selectedGame.game_rules.split('\n').map((rule, idx) => (
                    <div key={idx} className="modal-rule-item">{rule}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <GamePlayerAssignment
            game={selectedGame}
            assignedPlayers={gamePlayers}
            onPlayerAdded={handlePlayerAdded}
          />
        </Modal>
      )}
    </div>
  );
};

export default Games;
