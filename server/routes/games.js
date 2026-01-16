const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database');

// GET all games
router.get('/', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.all(`
    SELECT g.*, 
           t1.name as team1_name, t1.color as team1_color,
           t2.name as team2_name, t2.color as team2_color,
           w.name as winner_name,
           (SELECT COUNT(*) FROM game_players WHERE game_id = g.id) as player_count
    FROM games g
    LEFT JOIN teams t1 ON g.team1_id = t1.id
    LEFT JOIN teams t2 ON g.team2_id = t2.id
    LEFT JOIN teams w ON g.winner_id = w.id
    ORDER BY COALESCE(g.date, g.scheduled_time, g.created_at) DESC, g.created_at DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET game by ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.get(`
    SELECT g.*, 
           t1.name as team1_name, t1.color as team1_color,
           t2.name as team2_name, t2.color as team2_color,
           w.name as winner_name,
           (SELECT COUNT(*) FROM game_players WHERE game_id = g.id) as player_count
    FROM games g
    LEFT JOIN teams t1 ON g.team1_id = t1.id
    LEFT JOIN teams t2 ON g.team2_id = t2.id
    LEFT JOIN teams w ON g.winner_id = w.id
    WHERE g.id = ?
  `, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    res.json(row);
  });
});

// POST create new game
router.post('/', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  const { name, description, game_rules, team_composition, format, date, team1_id, team2_id, status, scheduled_time } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Game name is required' });
    return;
  }

  db.run('INSERT INTO games (name, description, game_rules, team_composition, format, date, team1_id, team2_id, status, scheduled_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, description || null, game_rules || null, team_composition || null, format || null, date || null, team1_id || null, team2_id || null, status || 'scheduled', scheduled_time || null], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        name, 
        description,
        game_rules,
        team_composition,
        format,
        date,
        team1_id, 
        team2_id, 
        status: status || 'scheduled',
        scheduled_time 
      });
    });
});

// PUT update game
router.put('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  const { name, description, game_rules, team_composition, format, date, team1_id, team2_id, winner_id, status, scheduled_time } = req.body;
  
  db.run('UPDATE games SET name = ?, description = ?, game_rules = ?, team_composition = ?, format = ?, date = ?, team1_id = ?, team2_id = ?, winner_id = ?, status = ?, scheduled_time = ? WHERE id = ?', 
    [name, description, game_rules || null, team_composition || null, format || null, date || null, team1_id, team2_id, winner_id, status, scheduled_time, req.params.id], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      res.json({ 
        id: req.params.id, 
        name, 
        description,
        game_rules,
        team_composition,
        format,
        date,
        team1_id, 
        team2_id, 
        winner_id,
        status,
        scheduled_time
      });
    });
});

// DELETE game
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.run('DELETE FROM games WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    res.json({ message: 'Game deleted successfully' });
  });
});

// GET players assigned to a game
router.get('/:id/players', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.all(`
    SELECT p.*, t.name as team_name, t.color as team_color
    FROM game_players gp
    JOIN players p ON gp.player_id = p.id
    LEFT JOIN teams t ON p.team_id = t.id
    WHERE gp.game_id = ?
    ORDER BY p.name
  `, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST add player to game
router.post('/:id/players', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  const { player_id } = req.body;
  
  if (!player_id) {
    res.status(400).json({ error: 'Player ID is required' });
    return;
  }

  // First, get the game to check player limit
  db.get('SELECT team_composition, (SELECT COUNT(*) FROM game_players WHERE game_id = ?) as current_count FROM games WHERE id = ?', 
    [req.params.id, req.params.id], 
    (err, game) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Check if player limit is reached
      const composition = game.team_composition || '';
      let requiredPlayers = null;
      
      // Check for "All Players" - no limit
      if (!composition.toLowerCase().includes('all players')) {
        // Extract number from patterns like "4 Players", "9 Players", etc.
        const match = composition.match(/(\d+)\s+Players?/i);
        if (match) {
          requiredPlayers = parseInt(match[1], 10);
          
          // Check if limit is reached
          if (game.current_count >= requiredPlayers) {
            res.status(400).json({ 
              error: `Cannot add more players. This game requires ${requiredPlayers} players and all slots are filled (${game.current_count}/${requiredPlayers}).` 
            });
            return;
          }
        }
      }

      // Add player if limit not reached
      db.run('INSERT INTO game_players (game_id, player_id) VALUES (?, ?)', 
        [req.params.id, player_id], 
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              res.status(400).json({ error: 'Player already assigned to this game' });
              return;
            }
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ id: this.lastID, game_id: req.params.id, player_id });
        });
    });
});

// DELETE remove all players from game
// IMPORTANT: This route must come BEFORE /:id/players/:playerId to ensure correct matching
router.delete('/:id/players', (req, res, next) => {
  console.log(`[ROUTE MATCH] DELETE /:id/players - gameId: ${req.params.id}, path: ${req.path}, originalUrl: ${req.originalUrl}`);
  next();
}, (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  
  const gameId = parseInt(req.params.id, 10);
  if (isNaN(gameId)) {
    res.status(400).json({ error: 'Invalid game ID' });
    return;
  }
  
  console.log(`[DELETE /:id/players] Attempting to remove all players from game ${gameId}`);
  
  // Use the database adapter's run method which handles both SQLite and PostgreSQL
  // Store changes in a variable that can be accessed regardless of callback context
  let changesCount = 0;
  
  db.run('DELETE FROM game_players WHERE game_id = ?', 
    [gameId], 
    function(err) {
      if (err) {
        console.error('[DELETE /:id/players] Error removing all players from game:', err);
        res.status(500).json({ error: err.message || 'Failed to remove all players from game' });
        return;
      }
      // For PostgreSQL, changes is set via callback.call, for SQLite it's this.changes
      // Try to get changes from this context (works for both SQLite and PostgreSQL adapter)
      if (this && typeof this.changes === 'number') {
        changesCount = this.changes;
      } else {
        changesCount = 0;
      }
      console.log(`[DELETE /:id/players] Successfully removed ${changesCount} player(s) from game ${gameId}`);
      res.json({ message: `All players removed from game successfully. ${changesCount} player(s) removed.` });
    });
});

// DELETE remove player from game
router.delete('/:id/players/:playerId', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.run('DELETE FROM game_players WHERE game_id = ? AND player_id = ?', 
    [req.params.id, req.params.playerId], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Player not found in game' });
        return;
      }
      res.json({ message: 'Player removed from game successfully' });
    });
});

module.exports = router;
