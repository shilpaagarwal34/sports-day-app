const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database');

// GET all players
router.get('/', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.all(`
    SELECT p.*, t.name as team_name, t.color as team_color 
    FROM players p 
    LEFT JOIN teams t ON p.team_id = t.id 
    ORDER BY p.name
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET games for a specific player
// IMPORTANT: This route must come BEFORE /:id to avoid route conflicts
router.get('/:id/games', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }

  const playerId = parseInt(req.params.id, 10);
  if (isNaN(playerId)) {
    res.status(400).json({ error: 'Invalid player ID' });
    return;
  }

  db.all(`
    SELECT g.*
    FROM games g
    INNER JOIN game_players gp ON g.id = gp.game_id
    WHERE gp.player_id = ?
    ORDER BY COALESCE(g.date, g.scheduled_time, g.created_at) DESC, g.name
  `, [playerId], (err, games) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(games);
  });
});

// GET player by ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.get(`
    SELECT p.*, t.name as team_name, t.color as team_color 
    FROM players p 
    LEFT JOIN teams t ON p.team_id = t.id 
    WHERE p.id = ?
  `, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    res.json(row);
  });
});

// POST create new player
router.post('/', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  const { name, team_id, gender, age_category } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Player name is required' });
    return;
  }

  db.run('INSERT INTO players (name, team_id, gender, age_category) VALUES (?, ?, ?, ?)', 
    [name, team_id || null, gender || null, age_category || null], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, team_id, gender, age_category });
    });
});

// PUT update player
router.put('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  const { name, team_id, gender, age_category } = req.body;
  
  db.run('UPDATE players SET name = ?, team_id = ?, gender = ?, age_category = ? WHERE id = ?', 
    [name, team_id, gender || null, age_category || null, req.params.id], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      res.json({ id: req.params.id, name, team_id, gender, age_category });
    });
});

// DELETE player
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.run('DELETE FROM players WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    res.json({ message: 'Player deleted successfully' });
  });
});

module.exports = router;
