/**
 * usePreferences Hook
 * Handles all user preferences:
 * - App theme
 * - Board theme
 * - Local storage persistence
 * - Supabase sync (when logged in)
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, db } from '../supabase.js';

const DEFAULT_THEME = 'gallery';
const DEFAULT_BOARD_THEME = 'classic';

export function usePreferences(userId) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('cm-theme') || DEFAULT_THEME;
  });
  
  const [boardThemeId, setBoardThemeId] = useState(() => {
    return localStorage.getItem('cm-board-theme') || DEFAULT_BOARD_THEME;
  });
  
  const [loaded, setLoaded] = useState(false);

  // Load preferences from Supabase when user logs in
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!userId || !supabase) {
        setLoaded(true);
        return;
      }
      
      try {
        const { data: prefs } = await db.getPreferences(userId);
        
        if (prefs) {
          if (prefs.app_theme) {
            setThemeId(prefs.app_theme);
            localStorage.setItem('cm-theme', prefs.app_theme);
          }
          if (prefs.board_theme) {
            setBoardThemeId(prefs.board_theme);
            localStorage.setItem('cm-board-theme', prefs.board_theme);
          }
        }
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
      
      setLoaded(true);
    };
    
    loadFromSupabase();
  }, [userId]);

  // Save to Supabase when preferences change
  const saveToSupabase = useCallback(async (prefs) => {
    if (!userId || !supabase) return;
    
    try {
      await db.savePreferences(userId, prefs);
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }, [userId]);

  // Set app theme
  const setTheme = useCallback((newThemeId) => {
    setThemeId(newThemeId);
    localStorage.setItem('cm-theme', newThemeId);
    saveToSupabase({ app_theme: newThemeId });
  }, [saveToSupabase]);

  // Set board theme
  const setBoardTheme = useCallback((newBoardThemeId) => {
    setBoardThemeId(newBoardThemeId);
    localStorage.setItem('cm-board-theme', newBoardThemeId);
    saveToSupabase({ board_theme: newBoardThemeId });
  }, [saveToSupabase]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setTheme(DEFAULT_THEME);
    setBoardTheme(DEFAULT_BOARD_THEME);
  }, [setTheme, setBoardTheme]);

  return {
    themeId,
    boardThemeId,
    loaded,
    setTheme,
    setBoardTheme,
    resetToDefaults,
    DEFAULT_THEME,
    DEFAULT_BOARD_THEME
  };
}

export default usePreferences;
