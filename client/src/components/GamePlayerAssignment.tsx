import React, { useState, useEffect } from 'react';
import { getPlayers, Player, addPlayerToGame, removePlayerFromGame, removeAllPlayersFromGame, Game } from '../services/api';
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
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(new Set());
  const [isAddingSelected, setIsAddingSelected] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  // Clear selections when filter changes
  useEffect(() => {
    setSelectedPlayers(new Set());
  }, [filter]);

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

  const getRequiredPlayers = (): number | null => {
    const composition = game.team_composition || '';
    
    // Check for "All Players" - no limit
    if (composition.toLowerCase().includes('all players')) {
      return null;
    }
    
    // Extract number from patterns like "4 Players", "9 Players", etc.
    const match = composition.match(/(\d+)\s+Players?/i);
    if (match) {
      return parseInt(match[1], 10);
    }
    
    return null; // Unknown requirement
  };

  const isPlayerLimitReached = (): boolean => {
    const required = getRequiredPlayers();
    if (required === null) {
      return false; // No limit
    }
    return assignedPlayers.length >= required;
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

  const handleTogglePlayerSelection = (playerId: number) => {
    setSelectedPlayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const available = getAvailablePlayers();
    const required = getRequiredPlayers();
    
    if (limitReached && required !== null) {
      return; // Can't select if limit is reached
    }
    
    let playersToSelect = available;
    if (required !== null) {
      const remaining = required - assignedPlayers.length;
      playersToSelect = available.slice(0, remaining);
    }
    
    setSelectedPlayers(new Set(playersToSelect.map(p => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedPlayers(new Set());
  };

  const handleAddSelectedPlayers = async () => {
    if (selectedPlayers.size === 0) {
      setError('Please select at least one player to add');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (isPlayerLimitReached()) {
      const required = getRequiredPlayers();
      setError(`Cannot add more players. This game requires ${required} players and all slots are filled.`);
      setTimeout(() => setError(null), 5000);
      return;
    }

    const required = getRequiredPlayers();
    if (required !== null) {
      const remaining = required - assignedPlayers.length;
      if (selectedPlayers.size > remaining) {
        setError(`You can only add ${remaining} more player(s). Please deselect some players.`);
        setTimeout(() => setError(null), 5000);
        return;
      }
    }

    try {
      setIsAddingSelected(true);
      setError(null);
      
      const playersToAdd = Array.from(selectedPlayers);
      let successCount = 0;
      let failCount = 0;

      for (const playerId of playersToAdd) {
        try {
          await addPlayerToGame(game.id, playerId);
          successCount++;
        } catch (err: any) {
          failCount++;
          console.error(`Failed to add player ${playerId}:`, err);
        }
      }

      // Clear selections after adding
      setSelectedPlayers(new Set());
      
      // Refresh the player list
      onPlayerAdded();
      
      if (failCount > 0) {
        setError(`Added ${successCount} player(s). ${failCount} failed.`);
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add selected players');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsAddingSelected(false);
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

  const handleRemovePlayerClick = (e: React.MouseEvent, playerId: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    handleRemovePlayer(playerId);
    return false;
  };


  const handleResetAllPlayers = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    if (assignedPlayers.length === 0) {
      setError('No players assigned to remove');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!window.confirm(`Are you sure you want to remove all ${assignedPlayers.length} player(s) from this game?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`[FRONTEND] Attempting to reset all players for game ${game.id}`);
      const result = await removeAllPlayersFromGame(game.id);
      console.log('[FRONTEND] Reset all players result:', result);
      
      // Clear any selected players
      setSelectedPlayers(new Set());
      
      // Refresh the player list
      onPlayerAdded();
    } catch (err: any) {
      console.error('[FRONTEND] Error removing all players:', err);
      // Extract error message more reliably
      let errorMessage = 'Failed to remove all players';
      if (err && err.message) {
        errorMessage = err.message;
      } else if (err && typeof err === 'string') {
        errorMessage = err;
      } else if (err && err.toString) {
        errorMessage = err.toString();
      }
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
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
  const requiredPlayers = getRequiredPlayers();
  const limitReached = isPlayerLimitReached();

  if (loading) {
    return <div className="assignment-loading">Loading players...</div>;
  }

  return (
    <div 
      className="game-player-assignment"
      onMouseDown={(e) => {
        // Prevent any default mouse behavior
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
      }}
      onClick={(e) => {
        // Prevent any click bubbling that might cause navigation
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {error && <div className="assignment-error">{error}</div>}

        {limitReached && requiredPlayers !== null && (
          <div className="assignment-warning">
            ⚠️ Player limit reached: {assignedPlayers.length}/{requiredPlayers} players assigned. Cannot add more players.
          </div>
        )}

        <div className="assignment-section">
        <div className="assignment-section-header">
          <h4>Assigned Players ({assignedPlayers.length}{requiredPlayers !== null ? `/${requiredPlayers}` : ''})</h4>
          {assignedPlayers.length > 0 && (
            <button
              type="button"
              className="reset-all-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleResetAllPlayers(e);
              }}
              disabled={loading}
              title="Remove all players from this game"
            >
              {loading ? 'Resetting...' : '🔄 Reset All'}
            </button>
          )}
        </div>
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
                <div
                  role="button"
                  tabIndex={0}
                  className="remove-btn"
                  onClick={(e) => handleRemovePlayerClick(e, player.id)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemovePlayer(player.id);
                    }
                  }}
                  title="Remove from game"
                  style={{ userSelect: 'none' }}
                >
                  ✕
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="assignment-section">
        <div className="assignment-section-header">
          <h4>Available Players ({availablePlayers.length})</h4>
          {availablePlayers.length > 0 && !limitReached && (
            <div className="selection-controls">
              <button
                type="button"
                className="select-all-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectAll();
                }}
                disabled={limitReached}
              >
                Select All
              </button>
              {selectedPlayers.size > 0 && (
                <button
                  type="button"
                  className="deselect-all-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeselectAll();
                  }}
                >
                  Deselect All ({selectedPlayers.size})
                </button>
              )}
              {selectedPlayers.size > 0 && (
                <button
                  type="button"
                  className="add-selected-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddSelectedPlayers();
                  }}
                  disabled={isAddingSelected || limitReached}
                >
                  {isAddingSelected ? 'Adding...' : `➕ Add Selected (${selectedPlayers.size})`}
                </button>
              )}
            </div>
          )}
        </div>
        
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
            {availablePlayers.map(player => {
              const isSelected = selectedPlayers.has(player.id);
              const canSelect = !limitReached;
              
              return (
                <div 
                  key={player.id} 
                  className={`player-item available ${isSelected ? 'selected' : ''}`}
                  onClick={(e) => {
                    // Don't toggle if clicking on checkbox (it handles its own onChange)
                    const target = e.target as HTMLElement;
                    if ((target instanceof HTMLInputElement && target.type === 'checkbox') || target.closest('.player-checkbox') || target.closest('input[type="checkbox"]')) {
                      return;
                    }
                    // Only toggle if clicking on the player name or team, not on badges
                    if (canSelect && (target.classList.contains('player-name') || target.classList.contains('player-team'))) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTogglePlayerSelection(player.id);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      // Checkbox onChange handles the toggle
                      if (canSelect) {
                        handleTogglePlayerSelection(player.id);
                      }
                    }}
                    onClick={(e) => {
                      // Stop propagation to prevent parent onClick from firing
                      e.stopPropagation();
                    }}
                    disabled={!canSelect}
                    className="player-checkbox"
                  />
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlayerAssignment;
