import React, { useState, useEffect } from 'react';
import { getPlayers, Player, addPlayerToGame, removePlayerFromGame, Game } from '../services/api';
import './GamePlayerAssignment.css';

interface GamePlayerAssignmentProps {
  game: Game;
  assignedPlayers: Player[];
  onPlayerAdded: () => void;
}

const GamePlayerAssignment: React.FC<GamePlayerAssignmentProps> = ({ game, assignedPlayers, onPlayerAdded }) => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Male' | 'Female' | 'Adult' | 'Kid' | '50+' | '65+'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const players = await getPlayers();
      setAllPlayers(players);
      setError(null);
    } catch (err) {
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const getAvailablePlayers = () => {
    const assignedIds = new Set(assignedPlayers.map(p => p.id));
    let filtered = allPlayers.filter(p => !assignedIds.has(p.id));

    if (filter !== 'all') {
      if (filter === 'Male' || filter === 'Female') {
        filtered = filtered.filter(p => p.gender === filter);
      } else if (filter === 'Adult' || filter === 'Kid' || filter === '50+' || filter === '65+') {
        filtered = filtered.filter(p => p.age_category === filter);
      }
    }

    return filtered;
  };

  const handleAddPlayer = async (playerId: number) => {
    try {
      await addPlayerToGame(game.id, playerId);
      onPlayerAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add player');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRemovePlayer = async (playerId: number) => {
    try {
      await removePlayerFromGame(game.id, playerId);
      onPlayerAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to remove player');
      setTimeout(() => setError(null), 3000);
    }
  };

  const parseCompositionRequirements = () => {
    const composition = game.team_composition || '';
    const requirements: string[] = [];

    if (composition.includes('Women') || composition.includes('Female')) {
      requirements.push('Female');
    }
    if (composition.includes('Kid')) {
      requirements.push('Kid');
    }
    if (composition.includes('Adult')) {
      requirements.push('Adult');
    }
    if (composition.includes('50+') || composition.includes('65+')) {
      requirements.push('50+');
    }
    if (composition.includes("Men's") || composition.includes('Male')) {
      requirements.push('Male');
    }

    return requirements;
  };

  const availablePlayers = getAvailablePlayers();
  const requirements = parseCompositionRequirements();

  if (loading) {
    return <div className="assignment-loading">Loading players...</div>;
  }

  return (
    <div className="game-player-assignment">
      {error && <div className="assignment-error">{error}</div>}

      <div className="assignment-section">
        <h4>Assigned Players ({assignedPlayers.length})</h4>
        {assignedPlayers.length === 0 ? (
          <p className="no-players">No players assigned yet</p>
        ) : (
          <div className="players-list assigned">
            {assignedPlayers.map(player => (
              <div key={player.id} className="player-item assigned">
                <span className="player-name">{player.name}</span>
                {player.team_name && (
                  <span className="player-team" style={{ color: player.team_color }}>
                    {player.team_name}
                  </span>
                )}
                {player.gender && (
                  <span className="player-badge gender">{player.gender}</span>
                )}
                {player.age_category && (
                  <span className="player-badge age">{player.age_category}</span>
                )}
                <button 
                  className="remove-btn"
                  onClick={() => handleRemovePlayer(player.id)}
                  title="Remove from game"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="assignment-section">
        <h4>Available Players ({availablePlayers.length})</h4>
        
        {requirements.length > 0 && (
          <div className="requirements-hint">
            <strong>Requirements:</strong> {requirements.join(', ')}
          </div>
        )}

        <div className="filter-controls">
          <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All Players</option>
            <option value="Male">Male Only</option>
            <option value="Female">Female Only</option>
            <option value="Adult">Adult Only</option>
            <option value="Kid">Kid Only</option>
            <option value="50+">50+ Only</option>
          </select>
        </div>

        {availablePlayers.length === 0 ? (
          <p className="no-players">No available players match the criteria</p>
        ) : (
          <div className="players-list available">
            {availablePlayers.map(player => (
              <div key={player.id} className="player-item available">
                <span className="player-name">{player.name}</span>
                {player.team_name && (
                  <span className="player-team" style={{ color: player.team_color }}>
                    {player.team_name}
                  </span>
                )}
                {player.gender && (
                  <span className="player-badge gender">{player.gender}</span>
                )}
                {player.age_category && (
                  <span className="player-badge age">{player.age_category}</span>
                )}
                <button 
                  className="add-btn"
                  onClick={() => handleAddPlayer(player.id)}
                  title="Add to game"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlayerAssignment;
