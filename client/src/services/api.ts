const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api');

export interface Team {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Player {
  id: number;
  name: string;
  team_id: number | null;
  gender?: 'Male' | 'Female' | null;
  age_category?: 'Adult' | 'Kid' | '50+' | '65+' | null;
  team_name?: string;
  team_color?: string;
  created_at: string;
}

export interface Game {
  id: number;
  name: string;
  description: string | null;
  game_rules?: string | null;
  team_composition?: string | null;
  format?: string | null;
  date?: string | null;
  team1_id: number | null;
  team2_id: number | null;
  winner_id: number | null;
  status: string;
  scheduled_time: string | null;
  team1_name?: string;
  team1_color?: string;
  team2_name?: string;
  team2_color?: string;
  winner_name?: string;
  player_count?: number;
  created_at: string;
}

// Teams API
export const getTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${API_BASE_URL}/teams`);
  if (!response.ok) throw new Error('Failed to fetch teams');
  return response.json();
};

export const getTeam = async (id: number): Promise<Team> => {
  const response = await fetch(`${API_BASE_URL}/teams/${id}`);
  if (!response.ok) throw new Error('Failed to fetch team');
  return response.json();
};

export const createTeam = async (team: Omit<Team, 'id' | 'created_at'>): Promise<Team> => {
  const response = await fetch(`${API_BASE_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  });
  if (!response.ok) throw new Error('Failed to create team');
  return response.json();
};

// Players API
export const getPlayers = async (): Promise<Player[]> => {
  const response = await fetch(`${API_BASE_URL}/players`);
  if (!response.ok) throw new Error('Failed to fetch players');
  return response.json();
};

export const getPlayer = async (id: number): Promise<Player> => {
  const response = await fetch(`${API_BASE_URL}/players/${id}`);
  if (!response.ok) throw new Error('Failed to fetch player');
  return response.json();
};

export const createPlayer = async (player: Omit<Player, 'id' | 'created_at' | 'team_name' | 'team_color'>): Promise<Player> => {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player),
  });
  if (!response.ok) throw new Error('Failed to create player');
  return response.json();
};

// Games API
export const getGames = async (): Promise<Game[]> => {
  const response = await fetch(`${API_BASE_URL}/games`);
  if (!response.ok) throw new Error('Failed to fetch games');
  return response.json();
};

export const getGame = async (id: number): Promise<Game> => {
  const response = await fetch(`${API_BASE_URL}/games/${id}`);
  if (!response.ok) throw new Error('Failed to fetch game');
  return response.json();
};

export const createGame = async (game: Omit<Game, 'id' | 'created_at' | 'team1_name' | 'team1_color' | 'team2_name' | 'team2_color' | 'winner_name' | 'player_count'>): Promise<Game> => {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game),
  });
  if (!response.ok) throw new Error('Failed to create game');
  return response.json();
};

// Game Players API
export const getGamePlayers = async (gameId: number): Promise<Player[]> => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/players`);
  if (!response.ok) throw new Error('Failed to fetch game players');
  return response.json();
};

export const addPlayerToGame = async (gameId: number, playerId: number): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player_id: playerId }),
  });
  if (!response.ok) throw new Error('Failed to add player to game');
  return response.json();
};

export const removePlayerFromGame = async (gameId: number, playerId: number): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/players/${playerId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove player from game');
  return response.json();
};

export const removeAllPlayersFromGame = async (gameId: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/players`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      let errorMessage = `Failed to remove all players from game (${response.status})`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        // If response is not JSON, try to get text
        try {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        } catch (textError) {
          // Keep the default error message
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (err: any) {
    // Re-throw with better error message
    if (err.message) {
      throw err;
    }
    throw new Error(`Network error: ${err.message || 'Failed to connect to server'}`);
  }
};

// Dashboard API
export interface DashboardGameStat {
  id: number;
  name: string;
  date: string | null;
  assigned_players: number;
  required_players: number | null;
  remaining_players: number | null;
  team_composition: string | null;
}

export interface DashboardPlayerStat {
  id: number;
  name: string;
  gender: string | null;
  age_category: string | null;
  games_count: number;
}

export interface DashboardData {
  games: DashboardGameStat[];
  players: DashboardPlayerStat[];
}

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return response.json();
};
