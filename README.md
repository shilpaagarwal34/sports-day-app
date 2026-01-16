# Sports Day Management App

A full-stack application for managing sports day events, including teams, players, and games.

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Deployment**: Vercel

## Local Development

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Setup

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

3. Start the development server:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React frontend on `http://localhost:3000`

## Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

Follow the prompts and select:
- Link to existing project or create new
- Configure settings as needed

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - **Root Directory**: Leave as root
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install && cd client && npm install`
5. Add Environment Variable (optional):
   - `REACT_APP_API_URL`: `/api` (defaults to this in production)

6. Deploy!

## Project Structure

```
sports-day-app/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   └── services/    # API service layer
│   └── public/          # Static files
├── server/              # Express backend
│   ├── routes/          # API routes
│   └── database.js      # Database setup
└── api/                 # Vercel serverless functions
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/teams` - List all teams
- `GET /api/players` - List all players
- `GET /api/games` - List all games
- `GET /api/dashboard` - Dashboard statistics

## Notes

- Database file (`sports_day.db`) is automatically created in the `server` directory for local development
- On Vercel, the database is stored in `/tmp` (ephemeral storage)
- For production with persistent data, consider migrating to a cloud database service
