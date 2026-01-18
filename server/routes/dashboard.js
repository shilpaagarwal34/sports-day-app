const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database');

// GET dashboard statistics
router.get('/', (req, res) => {
  const db = getDatabase();
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }

  // Get game statistics with player counts
  // Use PostgreSQL-compatible query (works with both SQLite and PostgreSQL)
  const isPostgres = process.env.DATABASE_URL;
  const query = isPostgres ? `
    SELECT 
      g.id,
      g.name,
      g.date,
      g.team_composition,
      COUNT(gp.player_id) as assigned_players,
      CASE 
        WHEN g.team_composition LIKE '%All Players%' THEN 999
        WHEN g.team_composition LIKE '%Players%' THEN 
          CAST(SUBSTRING(g.team_composition FROM '^(\d+)') AS INTEGER)
        ELSE NULL
      END as required_players
    FROM games g
    LEFT JOIN game_players gp ON g.id = gp.game_id
    GROUP BY g.id, g.name, g.date, g.team_composition
    ORDER BY g.date, g.name
  ` : `
    SELECT 
      g.id,
      g.name,
      g.date,
      g.team_composition,
      COUNT(gp.player_id) as assigned_players,
      CASE 
        WHEN g.team_composition LIKE '%All Players%' THEN 999
        WHEN g.team_composition LIKE '%Players%' THEN CAST(SUBSTR(g.team_composition, 1, INSTR(g.team_composition || ' ', ' ')) AS INTEGER)
        ELSE NULL
      END as required_players
    FROM games g
    LEFT JOIN game_players gp ON g.id = gp.game_id
    GROUP BY g.id, g.name, g.date, g.team_composition
    ORDER BY g.date, g.name
  `;

  db.all(query, [], (err, gameStats) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Get player statistics with game counts
    db.all(`
      SELECT 
        p.id,
        p.name,
        p.gender,
        p.age_category,
        COUNT(gp.game_id) as games_count
      FROM players p
      LEFT JOIN game_players gp ON p.id = gp.player_id
      GROUP BY p.id, p.name, p.gender, p.age_category
      ORDER BY games_count DESC, p.name
    `, [], (err, playerStats) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Process game stats to calculate remaining players
      const processedGameStats = gameStats.map(game => {
        let required = game.required_players;
        
        // Handle "All Players" - set to 13 (max players)
        if (game.team_composition?.includes('All Players') || game.team_composition?.includes('All players')) {
          required = 13; // Max players is 13
        } else if (!required || required === 999) {
          // Try to extract number from composition text (e.g., "4 Players", "9 Players")
          const match = game.team_composition?.match(/(\d+)\s*Players?/i);
          if (match) {
            required = parseInt(match[1]);
          } else {
            required = null; // Unknown requirement
          }
        }

        return {
          ...game,
          assigned_players: game.assigned_players || 0,
          required_players: required,
          remaining_players: required ? Math.max(0, required - (game.assigned_players || 0)) : null
        };
      });

      res.json({
        games: processedGameStats,
        players: playerStats
      });
    });
  });
});

module.exports = router;
