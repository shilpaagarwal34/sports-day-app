import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGames, Game, getGamePlayers, Player, getPlayers, addPlayerToGame } from '../services/api';
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
  const [isAddingAll, setIsAddingAll] = useState(false);

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

  const handleAddAllPlayersToAllGames = async () => {
    if (isAddingAll) return;
    
    try {
      setIsAddingAll(true);
      const allPlayers = await getPlayers();
      let successCount = 0;
      let failCount = 0;

      for (const game of games) {
        // Get current players for this game
        const currentPlayers = await getGamePlayers(game.id);
        const currentPlayerIds = new Set(currentPlayers.map(p => p.id));
        
        // Get required players count
        const composition = game.team_composition || '';
        let requiredPlayers = null;
        if (!composition.toLowerCase().includes('all players')) {
          const match = composition.match(/(\d+)\s+Players?/i);
          if (match) {
            requiredPlayers = parseInt(match[1], 10);
          }
        }

        // Determine which players to add
        let playersToAdd = allPlayers.filter(p => !currentPlayerIds.has(p.id));
        
        if (requiredPlayers !== null) {
          const remaining = requiredPlayers - currentPlayers.length;
          if (remaining > 0) {
            playersToAdd = playersToAdd.slice(0, remaining);
          } else {
            continue; // Game already full
          }
        }

        // Add players to this game
        for (const player of playersToAdd) {
          try {
            await addPlayerToGame(game.id, player.id);
            successCount++;
          } catch (err: any) {
            failCount++;
            console.error(`Failed to add ${player.name} to ${game.name}:`, err);
          }
        }
      }

      // Refresh games list
      await loadGames();
      
      if (selectedGame) {
        await loadGamePlayers(selectedGame.id);
      }

      alert(`Successfully added players to games!\n${successCount} players added.${failCount > 0 ? `\n${failCount} failed.` : ''}`);
    } catch (err: any) {
      alert(`Error: ${err.message || 'Failed to add players to games'}`);
    } finally {
      setIsAddingAll(false);
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
        <div className="games-header-top">
          <button
            type="button"
            className="add-all-games-btn"
            onClick={handleAddAllPlayersToAllGames}
            disabled={isAddingAll || games.length === 0}
          >
            {isAddingAll ? '⏳ Adding Players...' : '➕ Add All Players to All Games'}
          </button>
        </div>
        <h1>🎮 Games ({games.length})</h1>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={(e) => {
              e.preventDefault();
              handleGameClick(game);
            }}
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
              <button 
                type="button"
                className="game-card-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleGameClick(game);
                }}
              >
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
