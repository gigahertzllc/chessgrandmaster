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

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER GAMES (admin-managed games for players like Fischer, Carlsen, etc.)
  // ═══════════════════════════════════════════════════════════════════════════
  
  saveMasterGame: async (playerId, game) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('master_games').upsert({
      player_id: playerId,
      game_id: game.id,
      white: game.white,
      black: game.black,
      white_elo: game.whiteElo || null,
      black_elo: game.blackElo || null,
      result: game.result,
      year: game.year,
      event: game.event,
      site: game.site,
      round: game.round,
      eco: game.eco,
      pgn: game.pgn,
      title: game.title,
      description: game.description
    }, { onConflict: 'player_id,game_id' });
  },
  
  saveMasterGames: async (playerId, games) => {
    if (!supabase) return { error: { message: 'Supabase not configured' }, count: 0 };
    
    // Deduplicate games by game_id (keep first occurrence)
    const seenIds = new Set();
    const uniqueGames = [];
    for (const game of games) {
      if (!seenIds.has(game.id)) {
        seenIds.add(game.id);
        uniqueGames.push(game);
      }
    }
    
    console.log(`Deduped: ${games.length} -> ${uniqueGames.length} games`);
    
    const rows = uniqueGames.map((game, idx) => ({
      player_id: playerId,
      game_id: game.id || `${playerId}-game-${idx}`, // Fallback ID
      white: game.white,
      black: game.black,
      white_elo: game.whiteElo || null,
      black_elo: game.blackElo || null,
      result: game.result,
      year: game.year,
      event: game.event,
      site: game.site,
      round: game.round,
      eco: game.eco,
      pgn: game.pgn,
      title: game.title,
      description: game.description
    }));
    
    // Batch insert in chunks of 100
    const chunkSize = 100;
    let totalInserted = 0;
    let lastError = null;
    
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      
      // Double-check no duplicates within chunk
      const chunkIds = new Set();
      const deduplicatedChunk = chunk.filter(row => {
        if (chunkIds.has(row.game_id)) return false;
        chunkIds.add(row.game_id);
        return true;
      });
      
      const { data, error } = await supabase
        .from('master_games')
        .upsert(deduplicatedChunk, { onConflict: 'player_id,game_id' })
        .select();
      
      if (error) {
        lastError = error;
        console.error('Error inserting chunk:', error);
      } else {
        totalInserted += data?.length || 0;
      }
    }
    
    return { data: { count: totalInserted }, error: lastError };
  },
  
  getMasterGames: async (playerId, limit = 100, offset = 0) => {
    if (!supabase) return { data: [], error: null, count: 0 };
    
    const { data, error, count } = await supabase
      .from('master_games')
      .select('*', { count: 'exact' })
      .eq('player_id', playerId)
      .order('year', { ascending: false })
      .range(offset, offset + limit - 1);
    
    return { data: data || [], error, count };
  },
  
  getMasterGameCount: async (playerId) => {
    if (!supabase) return { count: 0, error: null };
    
    const { count, error } = await supabase
      .from('master_games')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', playerId);
    
    return { count: count || 0, error };
  },
  
  searchMasterGames: async (playerId, query, limit = 50) => {
    if (!supabase) return { data: [], error: null };
    
    const { data, error } = await supabase
      .from('master_games')
      .select('*')
      .eq('player_id', playerId)
      .or(`white.ilike.%${query}%,black.ilike.%${query}%,event.ilike.%${query}%`)
      .order('year', { ascending: false })
      .limit(limit);
    
    return { data: data || [], error };
  },
  
  deleteMasterGames: async (playerId) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('master_games').delete().eq('player_id', playerId);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER OVERRIDES (custom images, edited bios, etc.)
  // ═══════════════════════════════════════════════════════════════════════════
  
  savePlayerOverride: async (playerId, overrides) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('player_overrides').upsert({
      player_id: playerId,
      custom_image_url: overrides.customImageUrl || null,
      custom_bio: overrides.customBio || null,
      full_name: overrides.fullName || null,
      born: overrides.born || null,
      died: overrides.died || null,
      nationality: overrides.nationality || null,
      peak_rating: overrides.peakRating || null,
      world_champion: overrides.worldChampion || null,
      playing_style: overrides.playingStyle || null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'player_id' });
  },
  
  getPlayerOverride: async (playerId) => {
    if (!supabase) return { data: null, error: null };
    return supabase.from('player_overrides')
      .select('*')
      .eq('player_id', playerId)
      .single();
  },
  
  getAllPlayerOverrides: async () => {
    if (!supabase) return { data: [], error: null };
    return supabase.from('player_overrides').select('*');
  },
  
  deletePlayerOverride: async (playerId) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('player_overrides').delete().eq('player_id', playerId);
  },
  
  // Upload custom player image to Supabase Storage
  uploadPlayerImage: async (playerId, file) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${playerId}-${Date.now()}.${fileExt}`;
    const filePath = `player-images/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) return { error };
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);
    
    return { data: { url: publicUrl }, error: null };
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
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSTOM PLAYERS (user-created players via Admin Panel)
  // ═══════════════════════════════════════════════════════════════════════════
  
  createCustomPlayer: async (player) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('custom_players').insert({
      id: player.id,
      name: player.name,
      full_name: player.fullName,
      icon: player.icon,
      born: player.born,
      died: player.died,
      birth_place: player.birthPlace,
      nationality: player.nationality,
      titles: player.titles,
      peak_rating: player.peakRating,
      world_champion: player.worldChampion,
      image_url: player.imageUrl,
      bio: player.bio,
      playing_style: player.playingStyle,
      era: player.era
    }).select().single();
  },
  
  updateCustomPlayer: async (playerId, updates) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('custom_players').update({
      name: updates.name,
      full_name: updates.fullName,
      icon: updates.icon,
      born: updates.born,
      died: updates.died,
      birth_place: updates.birthPlace,
      nationality: updates.nationality,
      titles: updates.titles,
      peak_rating: updates.peakRating,
      world_champion: updates.worldChampion,
      image_url: updates.imageUrl,
      bio: updates.bio,
      playing_style: updates.playingStyle,
      era: updates.era,
      updated_at: new Date().toISOString()
    }).eq('id', playerId);
  },
  
  getCustomPlayers: async () => {
    if (!supabase) return { data: [], error: null };
    return supabase.from('custom_players')
      .select('*')
      .order('name');
  },
  
  getCustomPlayer: async (playerId) => {
    if (!supabase) return { data: null, error: null };
    return supabase.from('custom_players')
      .select('*')
      .eq('id', playerId)
      .single();
  },
  
  deleteCustomPlayer: async (playerId) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('custom_players').delete().eq('id', playerId);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO TRACKS (Zone Mode music uploaded via Admin Panel)
  // ═══════════════════════════════════════════════════════════════════════════
  
  uploadAudioFile: async (file, filename) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    const path = `audio/${Date.now()}_${filename}`;
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(path, file, { contentType: file.type });
    
    if (error) return { error };
    
    const { data: urlData } = supabase.storage.from('assets').getPublicUrl(path);
    return { data: { path, url: urlData.publicUrl }, error: null };
  },
  
  uploadArtwork: async (blob, trackId) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    const path = `artwork/${trackId}.jpg`;
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    
    if (error) return { error };
    
    const { data: urlData } = supabase.storage.from('assets').getPublicUrl(path);
    return { data: { path, url: urlData.publicUrl }, error: null };
  },
  
  createAudioTrack: async (track) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('audio_tracks').insert({
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      file_url: track.fileUrl,
      artwork_url: track.artworkUrl,
      tags: track.tags || [],
      modes: track.modes || ['zone']
    }).select().single();
  },
  
  getAudioTracks: async () => {
    if (!supabase) return { data: [], error: null };
    return supabase.from('audio_tracks')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
  },
  
  updateAudioTrack: async (id, updates) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('audio_tracks').update(updates).eq('id', id);
  },
  
  deleteAudioTrack: async (id) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.from('audio_tracks').delete().eq('id', id);
  },
  
  reorderAudioTracks: async (trackIds) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    // Update sort_order for each track
    const updates = trackIds.map((id, index) => 
      supabase.from('audio_tracks').update({ sort_order: index }).eq('id', id)
    );
    return Promise.all(updates);
  }
};
