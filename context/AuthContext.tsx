import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginAsGuest: () => void;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  loginAsGuest: () => {},
  isMock: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    // If Supabase is not configured, simulate a logged-in mock user for demo purposes
    if (!supabase) {
      console.warn("Supabase not configured. Using Mock Auth.");
      setIsMock(true);
      // Simulate a small delay
      setTimeout(() => {
        const mockUser: any = {
          id: 'mock-user-123',
          email: 'alex.design@example.com',
          user_metadata: { full_name: 'Alex Johnson' }
        };
        setUser(mockUser);
        setSession({ user: mockUser, access_token: 'mock-token' } as Session);
        setLoading(false);
      }, 500);
      return;
    }

    // Real Supabase Auth Logic
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (isMock) {
      setUser(null);
      setSession(null);
      // reload to reset state for demo
      window.location.reload();
      return;
    }
    if (supabase) await supabase.auth.signOut();
  };

  const loginAsGuest = () => {
    setIsMock(true);
    setLoading(true);
    setTimeout(() => {
        const guestUser: any = {
            id: 'guest-user-' + Math.random().toString(36).substr(2, 9),
            email: 'guest@aim-ai.com',
            user_metadata: { full_name: 'Guest Student' }
        };
        setUser(guestUser);
        setSession({ user: guestUser, access_token: 'mock-guest-token' } as Session);
        setLoading(false);
    }, 800);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, loginAsGuest, isMock }}>
      {children}
    </AuthContext.Provider>
  );
};