import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

// Normalized user type for the app
interface AppUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to normalize user from different sources
const normalizeUser = (userData: any, source: 'supabase' | 'express'): AppUser | null => {
  if (!userData) return null;

  if (source === 'supabase') {
    return {
      id: userData.id,
      email: userData.email || '',
      name: userData.user_metadata?.name || userData.email?.split('@')[0] || 'User',
      role: userData.user_metadata?.role || 'user',
    };
  }

  // Express API user
  return {
    id: userData.id,
    email: userData.email || '',
    name: userData.name || 'User',
    role: userData.role || 'user',
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      // Supabase auth
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(normalizeUser(session?.user, 'supabase'));
        setToken(session?.access_token ?? null);
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(normalizeUser(session?.user, 'supabase'));
          setToken(session?.access_token ?? null);
          setIsLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Express API auth (fallback)
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(normalizeUser(JSON.parse(storedUser), 'express'));
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } else {
      // Express API fallback
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(normalizeUser(data.user, 'express'));
      } else {
        throw new Error(data.message || 'Login failed');
      }
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      session,
      login,
      logout,
      isAuthenticated: !!token || !!session,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
