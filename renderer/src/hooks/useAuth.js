/**
 * useAuth Hook
 * Handles authentication state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, auth } from '../supabase.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (e) {
        console.error('Auth init error:', e);
        setError(e.message);
      }
      setLoading(false);
    };
    
    initAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (event === 'SIGNED_OUT') {
        // Clear any sensitive local data
        localStorage.removeItem('cm-imported-games');
      }
    });
    
    return () => subscription?.unsubscribe();
  }, []);

  // Sign in with email
  const signInWithEmail = useCallback(async (email, password) => {
    setError(null);
    
    try {
      const result = await auth.signInWithEmail(email, password);
      if (result.error) throw result.error;
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  }, []);

  // Sign up with email
  const signUpWithEmail = useCallback(async (email, password) => {
    setError(null);
    
    try {
      const result = await auth.signUpWithEmail(email, password);
      if (result.error) throw result.error;
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    
    try {
      const result = await auth.signInWithGoogle();
      if (result.error) throw result.error;
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setError(null);
    
    try {
      await auth.signOut();
      setUser(null);
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    userId: user?.id,
    email: user?.email,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    clearError
  };
}

export default useAuth;
