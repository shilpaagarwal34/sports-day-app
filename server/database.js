const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Check if using PostgreSQL (Supabase/Railway PostgreSQL)
const DATABASE_URL = process.env.DATABASE_URL;
const usePostgreSQL = !!DATABASE_URL;

let db = null;
let pgPool = null;

// Database adapter to provide consistent interface
class DatabaseAdapter {
  constructor(dbInstance, isPostgres = false) {
    this.db = dbInstance;
    this.isPostgres = isPostgres;
  }

  // Execute query and return all rows
  all(query, params, callback) {
    if (this.isPostgres) {
      // Convert SQLite ? placeholders to PostgreSQL $1, $2, etc.
      const pgQuery = this.convertQuery(query, params);
      this.db.query(pgQuery.text, pgQuery.values, (err, result) => {
        if (err) return callback(err);
        callback(null, result.rows);
      });
    } else {
      this.db.all(query, params, callback);
    }
  }

  // Execute query and return single row
  get(query, params, callback) {
    if (this.isPostgres) {
      const pgQuery = this.convertQuery(query, params);
      this.db.query(pgQuery.text, pgQuery.values, (err, result) => {
        if (err) return callback(err);
        callback(null, result.rows[0] || null);
      });
    } else {
      this.db.get(query, params, callback);
    }
  }

  // Execute query (INSERT/UPDATE/DELETE)
  run(query, params, callback) {
    if (this.isPostgres) {
      // For INSERT queries, add RETURNING id to get the inserted ID
      let pgQuery = this.convertQuery(query, params);
      if (query.trim().toUpperCase().startsWith('INSERT') && !pgQuery.text.includes('RETURNING')) {
        pgQuery.text += ' RETURNING id';
      }
      
      this.db.query(pgQuery.text, pgQuery.values, (err, result) => {
        if (err) {
          // Call callback with error, but still set this context
          const resultObj = { lastID: null, changes: 0 };
          return callback.call(resultObj, err);
        }
        // Create a result object similar to SQLite's this context
        const resultObj = {
          lastID: result.rows[0]?.id || null,
          changes: result.rowCount || 0
        };
        // Call callback with this context set to resultObj, only pass err (null)
        callback.call(resultObj, null);
      });
    } else {
      this.db.run(query, params, callback);
    }
  }

  // Convert SQLite query to PostgreSQL
  convertQuery(query, params) {
    if (!params || params.length === 0) {
      return { text: query, values: [] };
    }

    let paramIndex = 1;
    const values = [];
    const text = query.replace(/\?/g, () => {
      values.push(params[paramIndex - 1]);
      return `$${paramIndex++}`;
    });

    return { text, values };
  }

  // Serialize operations (for SQLite compatibility)
  serialize(callback) {
    if (this.isPostgres) {
      // PostgreSQL doesn't need serialization, just run callback
      callback();
    } else {
      this.db.serialize(callback);
    }
  }

  // Prepare statement (for SQLite compatibility)
  prepare(query) {
    if (this.isPostgres) {
      // Return a mock prepared statement that works with PostgreSQL
      return {
        run: (...args) => {
          const values = args.slice(0, -1);
          const callback = args[args.length - 1];
          let finalQuery = this.convertQuery(query, values);
          
          // For INSERT queries, add RETURNING id
          if (query.trim().toUpperCase().startsWith('INSERT') && !finalQuery.text.includes('RETURNING')) {
            finalQuery.text += ' RETURNING id';
          }
          
          this.db.query(finalQuery.text, finalQuery.values, (err, result) => {
            if (callback) {
              const resultObj = {
                lastID: result?.rows[0]?.id || null,
                changes: result?.rowCount || 0
              };
              callback.call(resultObj, err, resultObj);
            }
          });
        },
        finalize: (callback) => {
          if (callback) callback(null);
        }
      };
    } else {
      return this.db.prepare(query);
    }
  }
}

// Initialize PostgreSQL
async function initPostgreSQL() {
  try {
    // Validate DATABASE_URL format
    if (!DATABASE_URL || typeof DATABASE_URL !== 'string') {
      throw new Error('DATABASE_URL is not a valid string');
    }
    
    // Remove any whitespace/newlines that might cause issues
    const cleanUrl = DATABASE_URL.trim();
    
    // Basic validation - should start with postgresql:// or postgres://
    if (!cleanUrl.startsWith('postgresql://') && !cleanUrl.startsWith('postgres://')) {
      console.error('[DATABASE] Invalid DATABASE_URL format. Should start with postgresql:// or postgres://');
      console.error('[DATABASE] URL starts with:', cleanUrl.substring(0, 20));
      throw new Error('DATABASE_URL must start with postgresql:// or postgres://');
    }
    
    // Check if URL is valid (basic check)
    try {
      new URL(cleanUrl); // This will throw if URL is invalid
    } catch (urlError) {
      console.error('[DATABASE] Invalid URL format:', urlError.message);
      console.error('[DATABASE] URL length:', cleanUrl.length);
      console.error('[DATABASE] URL preview (first 50 chars):', cleanUrl.substring(0, 50));
      throw new Error(`Invalid DATABASE_URL format: ${urlError.message}`);
    }
    
    console.log('[DATABASE] DATABASE_URL format validated successfully');
    console.log('[DATABASE] URL preview:', cleanUrl.substring(0, 30) + '...' + cleanUrl.substring(cleanUrl.length - 20));
    
    pgPool = new Pool({
      connectionString: cleanUrl,
      ssl: cleanUrl.includes('supabase') ? { rejectUnauthorized: false } : false
    });

    // Test connection
    console.log('[DATABASE] Testing PostgreSQL connection...');
    const client = await pgPool.connect();
    await client.query('SELECT NOW()');
    client.release();

    console.log('[DATABASE] ✅ Connected to PostgreSQL database');
    db = new DatabaseAdapter(pgPool, true);
    return db;
  } catch (err) {
    console.error('[DATABASE] ❌ PostgreSQL connection error:', err.message);
    console.error('[DATABASE] Error code:', err.code);
    throw err;
  }
}

// Initialize SQLite
function initSQLite() {
  return new Promise((resolve, reject) => {
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
    const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_ENVIRONMENT_NAME;

    let DB_PATH;
    if (isVercel) {
      DB_PATH = path.join('/tmp', 'sports_day.db');
    } else if (isRailway) {
      const dataDir = '/data';
      if (!fs.existsSync(dataDir)) {
        if (fs.existsSync('/persist')) {
          DB_PATH = path.join('/persist', 'sports_day.db');
        } else {
          console.warn('Warning: /data volume not found. Using project directory (data will be lost on restart).');
          DB_PATH = path.join(__dirname, 'sports_day.db');
        }
      } else {
        DB_PATH = path.join(dataDir, 'sports_day.db');
      }
    } else {
      DB_PATH = path.join(__dirname, 'sports_day.db');
    }

    console.log('Using SQLite database at:', DB_PATH);

    const sqliteDb = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening SQLite database:', err);
        reject(err);
        return;
      }
      db = new DatabaseAdapter(sqliteDb, false);
      resolve(db);
    });
  });
}

// Initialize database
async function initDatabase() {
  console.log('[DATABASE] Starting database initialization...');
  console.log('[DATABASE] usePostgreSQL:', usePostgreSQL);
  console.log('[DATABASE] DATABASE_URL:', DATABASE_URL ? DATABASE_URL.substring(0, 20) + '...' : 'not set');
  
  if (usePostgreSQL) {
    try {
      console.log('[DATABASE] Attempting PostgreSQL connection...');
      return await initPostgreSQL();
    } catch (err) {
      console.error('[DATABASE] ❌ PostgreSQL initialization failed');
      console.error('[DATABASE] Error:', err.message);
      console.error('[DATABASE] Error code:', err.code);
      // Don't fall back automatically - let the error propagate
      // This helps identify configuration issues
      throw err;
    }
  } else {
    console.log('[DATABASE] Using SQLite (no DATABASE_URL set)');
    try {
      return await initSQLite();
    } catch (err) {
      console.error('[DATABASE] ❌ SQLite initialization failed');
      console.error('[DATABASE] Error:', err.message);
      throw err;
    }
  }
}

// Create tables
async function createTables() {
  if (!db) {
    throw new Error('Database not initialized');
  }

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Teams table
      const teamsTable = usePostgreSQL ? `
        CREATE TABLE IF NOT EXISTS teams (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          color TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      ` : `
        CREATE TABLE IF NOT EXISTS teams (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          color TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      db.run(teamsTable, [], (err) => {
        if (err) {
          console.error('Error creating teams table:', err);
          reject(err);
          return;
        }

        // Players table
        const playersTable = usePostgreSQL ? `
          CREATE TABLE IF NOT EXISTS players (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            team_id INTEGER,
            gender TEXT CHECK(gender IN ('Male', 'Female', NULL)),
            age_category TEXT CHECK(age_category IN ('Adult', 'Kid', '50+', '65+', NULL)),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (team_id) REFERENCES teams(id)
          )
        ` : `
          CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            team_id INTEGER,
            gender TEXT CHECK(gender IN ('Male', 'Female', NULL)),
            age_category TEXT CHECK(age_category IN ('Adult', 'Kid', '50+', '65+', NULL)),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (team_id) REFERENCES teams(id)
          )
        `;

        db.run(playersTable, [], (err) => {
          if (err) {
            console.error('Error creating players table:', err);
            reject(err);
            return;
          }

          // Games table
          const gamesTable = usePostgreSQL ? `
            CREATE TABLE IF NOT EXISTS games (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              game_rules TEXT,
              team_composition TEXT,
              format TEXT,
              date DATE,
              team1_id INTEGER,
              team2_id INTEGER,
              winner_id INTEGER,
              status TEXT DEFAULT 'scheduled',
              scheduled_time TIMESTAMP,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (team1_id) REFERENCES teams(id),
              FOREIGN KEY (team2_id) REFERENCES teams(id),
              FOREIGN KEY (winner_id) REFERENCES teams(id)
            )
          ` : `
            CREATE TABLE IF NOT EXISTS games (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT,
              game_rules TEXT,
              team_composition TEXT,
              format TEXT,
              date DATE,
              team1_id INTEGER,
              team2_id INTEGER,
              winner_id INTEGER,
              status TEXT DEFAULT 'scheduled',
              scheduled_time DATETIME,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (team1_id) REFERENCES teams(id),
              FOREIGN KEY (team2_id) REFERENCES teams(id),
              FOREIGN KEY (winner_id) REFERENCES teams(id)
            )
          `;

          db.run(gamesTable, [], (err) => {
            if (err) {
              console.error('Error creating games table:', err);
              reject(err);
              return;
            }

            // Game Players junction table
            const gamePlayersTable = usePostgreSQL ? `
              CREATE TABLE IF NOT EXISTS game_players (
                id SERIAL PRIMARY KEY,
                game_id INTEGER NOT NULL,
                player_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
                FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
                UNIQUE(game_id, player_id)
              )
            ` : `
              CREATE TABLE IF NOT EXISTS game_players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                game_id INTEGER NOT NULL,
                player_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
                FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
                UNIQUE(game_id, player_id)
              )
            `;

            db.run(gamePlayersTable, [], (err) => {
              if (err) {
                console.error('Error creating game_players table:', err);
                reject(err);
                return;
              }
              resolve();
            });
          });
        });
      });
    });
  });
}

// Seed database
function seedDatabase() {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    db.serialize(() => {
      db.get('SELECT COUNT(*) as count FROM teams', [], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count > 0) {
          console.log('Database already seeded');
          // Check if players are seeded
          db.get('SELECT COUNT(*) as count FROM players', [], (err, playerRow) => {
            if (err) {
              reject(err);
              return;
            }
            if (playerRow.count === 0) {
              seedPlayers().then(resolve).catch(reject);
            } else {
              resolve();
            }
          });
          return;
        }

        // Insert sample teams
        const teams = [
          { name: 'Red Team', color: '#FF0000' },
          { name: 'Blue Team', color: '#0000FF' },
          { name: 'Green Team', color: '#00FF00' },
          { name: 'Yellow Team', color: '#FFFF00' }
        ];

        const teamsStmt = db.prepare('INSERT INTO teams (name, color) VALUES (?, ?)');
        
        teams.forEach(team => {
          teamsStmt.run(team.name, team.color, () => {});
        });
        
        teamsStmt.finalize((err) => {
          if (err) {
            reject(err);
            return;
          }
          console.log('Sample teams seeded');

          // Insert games
          const games = [
            {
              name: 'Shoot the Ball - Basket Ball',
              description: 'Basketball shooting competition',
              date: '2026-01-26',
              format: 'Highest baskets wins',
              team_composition: 'All Players',
              game_rules: '1. Each player will be given 2 chances.\n2. The team scoring the highest number of baskets wins.\n3. If any player is not available, their chance cannot be taken by anyone else.'
            },
            {
              name: 'Grand Rally - Pickleball',
              description: 'Pickleball tournament',
              date: '2026-01-26',
              format: 'Two Groups Round Robin, Final and Bronze Match',
              team_composition: "1. Men's Doubles\n2. Women Doubles\n3. Mixed doubles\n4. Adult & Kid pairing (A player can only play in 2 categories maximum)",
              game_rules: "1. One game consists of 21 points.\n2. Each team needs to retire compulsorily after accumulating 5 points (e.g., scores like 3-2, 4-1, 2-3, 1-4, 5-0, 0-5).\n3. The team scoring 21 points first wins.\n4. All basic pickleball rules apply. Captains will be responsible for teaching the game rules to their players."
            },
            {
              name: 'Pitthu',
              description: 'Pitthu game competition',
              date: '2026-01-26',
              format: 'Two Groups Round Robin, Final and Bronze Match',
              team_composition: '7 Players (2 Women players and 2 Kids compulsory)',
              game_rules: "1. The rings will be scattered at different pre-defined corners of the ground.\n2. The team managing to stack a higher number of rings wins without getting their players bowled out.\n3. No fielder will be allowed to stand inside a demarcated area where the rings would be required to stack.\n4. Pushing an opponent player will be considered a foul, and the offender will not be allowed to participate in that game.\n5. Tie breaker: hit and maximum tiles displaced."
            },
            {
              name: 'Lemon and Spoon + Badminton/ball',
              description: 'Relay race with lemon and spoon',
              date: '2026-01-26',
              format: 'Relay Race',
              team_composition: 'All Players',
              game_rules: "1. Each team member will participate.\n2. The team finishing all their rounds first wins.\n3. The lemon has to be on the spoon at all times.\n4. If there are fewer players, a player of the same category can repeat.\n5. The racket is to be held at the handle."
            },
            {
              name: 'Hit the Stumps',
              description: 'Stumps hitting competition',
              date: '2026-01-26',
              format: 'Highest hit wins',
              team_composition: 'All Players',
              game_rules: "1. Each player will be given 2 chances.\n2. The team hitting the wickets the maximum number of times wins.\n3. If any player is not available, their chance cannot be taken by anyone else."
            },
            {
              name: 'Goal',
              description: 'Goal scoring competition',
              date: '2026-01-26',
              format: 'Highest number of goals/points wins',
              team_composition: 'All Players',
              game_rules: "1. Each player will be given 2 chances.\n2. The team scoring a goal the maximum number of times wins.\n3. If any player is not available, their chance cannot be taken by anyone else.\n4. Tie breaker: 3 players, one chance."
            },
            {
              name: 'Flash Pool',
              description: 'Pool doubles competition',
              date: '2026-01-24',
              format: 'Two Groups Round Robin, Final and Bronze Match',
              team_composition: '4 Players from each team; Two doubles matches',
              game_rules: "1. One frame comprising of only the integer marked balls will be considered per doubles match.\n2. Partners can be both Mens/womens and mixed doubles. There is no age criteria.\n3. No player can be repeated in both the sets.\n4. The higher sum of the face value of the balls taken by a team wins the set.\n5. The higher of the aggregated sum for both the sets wins the game.\n6. The same 2 players can play both games"
            },
            {
              name: 'Carrom - Pocket the Queen',
              description: 'Carrom tournament',
              date: '2026-01-24',
              format: 'Two Groups Round Robin, Final and Bronze Match',
              team_composition: '4 Players (1 female player compulsory; 1 kid; 1 50+)',
              game_rules: "1. Each player will play one set comprising of 3 coins of each colour with the queen placed in the center.\n2. The set ends when one player competes taking up his/her set of coins.\n3. No cover required for the queen.\n4. Points will be rewarded to the player finishing his/her set basis coins of opposition left on the board added by 5 pts of the queen if the winner has taken the queen as well.\n5. The team scoring higher as an aggregate of all 3 sets will win.\n6. kid to play with kid, female with female, 50+ with 50+"
            },
            {
              name: 'Cricket',
              description: 'Cricket match',
              date: '2026-01-25',
              format: 'Two Groups Round Robin, Final and Bronze Match',
              team_composition: '9 Players (2 Women players and 2 Kids compulsory)',
              game_rules: "1. Each match will be of 6 overs.\n2. One over compulsory for women/kid. Stand and throw bowling is permissable for the women/kid player.\n3. No byes or leg byes.\n4. No LBW, no retire hurt.\n5. Min 4 bowlers, each bowler can bowl max 2 overs.\n6. Ball hitting any net on the ceiling or side and crossing the boundary will be considered as 4.\n7. If ball hits net and catch is taken it is not out.\n8. No Ball: full toss above waist and with bounce above shoulder.\n9. Last man allowed.\n10. If at end of group stage, two teams are same score, then super over played"
            },
            {
              name: 'Handball',
              description: 'Handball match',
              date: '2026-01-25',
              format: 'Two Groups Round Robin, Final and Bronze Match',
              team_composition: 'All players (At a time only 4 Male, 1 Female, 1 Kid)',
              game_rules: "1. One game of 10 mins (5 mins Of one half). All players can play but only 6 players can be on the filed at onepoint of time with one complusory kid and female player on the field.\n2. Team scoring higher goal wins.\n3. The opponent team will be awarded a free throw if a player intentionally kicks the ball in play.\n4. A player can run towards any direction with the ball in hand but in an opponent touches him while the ball is in his hand then he has to give the ball away to the opponent who touches him.\n5. At one point of time only 1 player can be standing inside the D.\n6. A player can score a goal from any point of the turf.\n7. In case of draw penalty shoot out only in finals and bronze match. one shoot out per player"
            }
          ];

          const gamesStmt = db.prepare('INSERT INTO games (name, description, date, format, team_composition, game_rules, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
          
          games.forEach(game => {
            gamesStmt.run(
              game.name,
              game.description,
              game.date,
              game.format,
              game.team_composition,
              game.game_rules,
              'scheduled',
              () => {}
            );
          });
          
          gamesStmt.finalize((err) => {
            if (err) {
              reject(err);
              return;
            }
            console.log('Games seeded');
            seedPlayers().then(resolve).catch(reject);
          });
        });
      });
    });
  });
}

function seedPlayers() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM players', [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row.count > 0) {
        console.log('Players already seeded');
        resolve();
        return;
      }

      const players = [
        { name: 'Ashish Modi', gender: 'Male', age_category: 'Adult' },
        { name: 'Amit Sinha', gender: 'Male', age_category: 'Adult' },
        { name: 'Abhinav Srivastav', gender: 'Male', age_category: 'Adult' },
        { name: 'Rajat Mathur', gender: 'Male', age_category: 'Adult' },
        { name: 'Shreyas Vijay', gender: 'Male', age_category: 'Adult' },
        { name: 'Sweta Doshi', gender: 'Female', age_category: 'Adult' },
        { name: 'Shweta Thakur', gender: 'Female', age_category: 'Adult' },
        { name: 'Shilpa 501', gender: 'Female', age_category: 'Adult' },
        { name: 'Sriram', gender: 'Male', age_category: '50+' },
        { name: 'Jyoti', gender: 'Female', age_category: '50+' },
        { name: 'Vaanya', gender: null, age_category: 'Kid' },
        { name: 'Aarvi Singh', gender: null, age_category: 'Kid' },
        { name: 'Sushama Pradhan', gender: 'Female', age_category: '50+' }
      ];

      const stmt = db.prepare('INSERT INTO players (name, team_id, gender, age_category) VALUES (?, ?, ?, ?)');
      players.forEach(player => {
        stmt.run(player.name, null, player.gender, player.age_category, () => {});
      });
      stmt.finalize((err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('Sample players seeded');
        resolve();
      });
    });
  });
}

function getDatabase() {
  return db;
}

// Initialize database and create tables
async function initialize() {
  try {
    console.log('[DATABASE] initialize() called - starting full initialization...');
    await initDatabase();
    console.log('[DATABASE] Database connection established, creating tables...');
    await createTables();
    console.log('[DATABASE] ✅ Database initialized successfully');
    console.log('[DATABASE] Database object:', db ? 'present' : 'null');
    return db;
  } catch (err) {
    console.error('[DATABASE] ❌ Database initialization error in initialize():', err);
    console.error('[DATABASE] Error message:', err.message);
    console.error('[DATABASE] Error stack:', err.stack);
    throw err;
  }
}

module.exports = {
  initDatabase: initialize,
  seedDatabase,
  getDatabase
};
