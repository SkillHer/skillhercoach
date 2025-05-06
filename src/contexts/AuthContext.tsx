
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import getSupabaseClient from '../services/supabaseClient';
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: any | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('Error fetching initial session:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized'), data: null };
    }

    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (result.error) throw result.error;
      
      return { error: null, data: result.data };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { error, data: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized'), data: null };
    }

    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) throw result.error;
      
      return { error: null, data: result.data };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state after signout
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
