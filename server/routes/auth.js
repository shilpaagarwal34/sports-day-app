const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { getDatabase } = require('../database');

// POST login
router.post('/login', (req, res) => {
  console.log('[AUTH] Login request received');
  console.log('[AUTH] Request origin:', req.headers.origin);
  console.log('[AUTH] Request body:', { username: req.body?.username, password: req.body?.password ? '***' : undefined });
  
  const db = getDatabase();
  if (!db) {
    console.error('[AUTH] Database not initialized');
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('[AUTH] Database error:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    if (!user) {
      console.log('[AUTH] User not found:', username);
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    
    console.log('[AUTH] User found:', user.username, 'Role:', user.role);

    // Compare password with hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        res.status(500).json({ error: 'Error comparing passwords' });
        return;
      }

      if (!isMatch) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      console.log('[AUTH] Login successful for:', user.username);
      console.log('[AUTH] Session ID:', req.sessionID);

      res.json({
        id: user.id,
        username: user.username,
        role: user.role
      });
    });
  });
});

// POST logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Error logging out' });
      return;
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// GET current user session
router.get('/session', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      id: req.session.userId,
      username: req.session.username,
      role: req.session.role
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;
