const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database');

// GET all teams
router.get('/', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.all('SELECT * FROM teams ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET team by ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.get('SELECT * FROM teams WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json(row);
  });
});

// POST create new team
router.post('/', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  const { name, color } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Team name is required' });
    return;
  }

  db.run('INSERT INTO teams (name, color) VALUES (?, ?)', [name, color], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, color });
  });
});

// PUT update team
router.put('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  const { name, color } = req.body;
  
  db.run('UPDATE teams SET name = ?, color = ? WHERE id = ?', 
    [name, color, req.params.id], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Team not found' });
        return;
      }
      res.json({ id: req.params.id, name, color });
    });
});

// DELETE team
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  db.run('DELETE FROM teams WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json({ message: 'Team deleted successfully' });
  });
});

module.exports = router;
