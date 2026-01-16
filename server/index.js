const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase, seedDatabase } = require('./database');
const gameRoutes = require('./routes/games');
const playerRoutes = require('./routes/players');
const teamRoutes = require('./routes/teams');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initDatabase().then(() => {
  return seedDatabase();
}).then(() => {
  console.log('Database initialized and seeded successfully');
}).catch((err) => {
  console.error('Database initialization error:', err);
});

// Root route - can serve HTML or JSON based on Accept header
app.get('/', (req, res) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  
  if (acceptsHtml) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sports Day Management API</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-top: 0;
          }
          .endpoint {
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #007bff;
            border-radius: 4px;
          }
          .endpoint h3 {
            margin: 0 0 10px 0;
            color: #007bff;
          }
          .method {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            margin-right: 8px;
          }
          .url {
            font-family: 'Courier New', monospace;
            color: #333;
          }
          .status {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🏃 Sports Day Management API</h1>
          <p>Welcome to the Sports Day Management API. Use the following endpoints to interact with the system.</p>
          
          <div class="endpoint">
            <h3><span class="method">GET</span> <span class="url">/api/health</span></h3>
            <p>Check API health status</p>
          </div>
          
          <div class="endpoint">
            <h3><span class="method">GET</span> <span class="url">/api/teams</span></h3>
            <p>Get all teams</p>
          </div>
          
          <div class="endpoint">
            <h3><span class="method">GET</span> <span class="url">/api/players</span></h3>
            <p>Get all players</p>
          </div>
          
          <div class="endpoint">
            <h3><span class="method">GET</span> <span class="url">/api/games</span></h3>
            <p>Get all games</p>
          </div>
          
          <div class="status">✓ API Server Running on Port 5000</div>
        </div>
      </body>
      </html>
    `);
  } else {
    // Pretty print JSON with indentation
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 
      message: 'Sports Day Management API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        teams: '/api/teams',
        players: '/api/players',
        games: '/api/games',
        dashboard: '/api/dashboard'
      }
    }, null, 2));
  }
});

app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sports Day Management API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server accessible at http://localhost:${PORT}`);
});

// Handle uncaught errors to prevent server crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
