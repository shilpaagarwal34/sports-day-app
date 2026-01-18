import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getSession, login as apiLogin, logout as apiLogout, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  canEdit: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionUser = await getSession();
      setUser(sessionUser);
    } catch (error) {
      console.error('Failed to check session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('[AuthContext] Login attempt for:', username);
      const user = await apiLogin(username, password);
      console.log('[AuthContext] Login successful, user set:', user);
      setUser(user);
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);
      // Re-throw the error so Login component can catch it
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'admin';
  const canEdit = isAdmin; // Only admin can edit

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, canEdit }}>
      {children}
    </AuthContext.Provider>
  );
};
