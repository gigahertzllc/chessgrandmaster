import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helpers
export const auth = {
  signUp: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.auth.signUp({ email, password });
  },
  
  signIn: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.auth.signInWithPassword({ email, password });
  },
  
  signOut: async () => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.auth.signOut();
  },
  
  getUser: async () => {
    if (!supabase) return { data: { user: null } };
    return supabase.auth.getUser();
  },
  
  onAuthStateChange: (callback) => {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Imported games
  saveImportedGame: async (userId, game) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('imported_games').insert({
      user_id: userId,
      white: game.white,
      black: game.black,
      white_elo: game.whiteElo,
      black_elo: game.blackElo,
      result: game.result,
      date: game.date,
      event: game.event,
      opening: game.opening,
      pgn: game.pgn
    }).select().single();
  },
  
  saveImportedGames: async (userId, games) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    const rows = games.map(game => ({
      user_id: userId,
      white: game.white,
      black: game.black,
      white_elo: game.whiteElo,
      black_elo: game.blackElo,
      result: game.result,
      date: game.date,
      event: game.event,
      opening: game.opening,
      pgn: game.pgn
    }));
    return supabase.from('imported_games').insert(rows).select();
  },
  
  getImportedGames: async (userId) => {
    if (!supabase) return { data: [], error: null };
    return supabase.from('imported_games')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
  
  deleteImportedGame: async (id) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('imported_games').delete().eq('id', id);
  },

  // Favorite games
  saveFavoriteGame: async (userId, game) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('favorite_games').insert({
      user_id: userId,
      game_id: game.id,
      white: game.white,
      black: game.black,
      result: game.result,
      pgn: game.pgn,
      source: game.source,
      notes: game.notes || null
    });
  },
  
  getFavoriteGames: async (userId) => {
    if (!supabase) return { data: [], error: null };
    return supabase.from('favorite_games')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
  
  removeFavoriteGame: async (id) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('favorite_games').delete().eq('id', id);
  },
  
  // Game notes
  saveGameNote: async (userId, gameId, note) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('game_notes').upsert({
      user_id: userId,
      game_id: gameId,
      note
    });
  },
  
  // User preferences
  savePreferences: async (userId, preferences) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('user_preferences').upsert({
      user_id: userId,
      ...preferences
    });
  },
  
  getPreferences: async (userId) => {
    if (!supabase) return { data: null, error: null };
    return supabase.from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
  }
};
