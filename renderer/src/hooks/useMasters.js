/**
 * useMasters Hook
 * Handles all player/masters functionality:
 * - Loading built-in players with overrides
 * - Loading custom players from Supabase
 * - Selecting players and loading their games
 * - Game counts
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PLAYERS } from '../data/playerInfo.js';
import { getGamesByMaster } from '../data/mastersDatabase.js';
import { db } from '../supabase.js';

export function useMasters() {
  // State
  const [customPlayers, setCustomPlayers] = useState([]);
  const [playerOverrides, setPlayerOverrides] = useState({});
  const [dbGameCounts, setDbGameCounts] = useState({});
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [masterGames, setMasterGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load custom players from Supabase
  const loadCustomPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: dbError } = await db.getCustomPlayers();
      if (dbError) throw dbError;
      setCustomPlayers(data || []);
      
      // Also load game counts
      const allPlayerIds = [...Object.keys(PLAYERS), ...(data || []).map(p => p.id)];
      const counts = {};
      
      for (const playerId of allPlayerIds) {
        const { count } = await db.getMasterGameCount(playerId);
        if (count > 0) counts[playerId] = count;
      }
      
      setDbGameCounts(counts);
    } catch (e) {
      console.error("Error loading custom players:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load player overrides (custom images, etc.)
  const loadPlayerOverrides = useCallback(async () => {
    try {
      const { data, error: dbError } = await db.getAllPlayerOverrides();
      if (dbError) throw dbError;
      
      if (data) {
        const overridesMap = {};
        data.forEach(o => {
          overridesMap[o.player_id] = {
            customImageUrl: o.custom_image_url,
            customBio: o.custom_bio,
            fullName: o.full_name,
            born: o.born,
            died: o.died,
            nationality: o.nationality,
            peakRating: o.peak_rating,
            worldChampion: o.world_champion,
            playingStyle: o.playing_style
          };
        });
        setPlayerOverrides(overridesMap);
      }
    } catch (e) {
      console.error("Error loading player overrides:", e);
    }
  }, []);

  // Compute players with overrides applied
  const playersWithOverrides = useMemo(() => {
    const result = {};
    Object.entries(PLAYERS).forEach(([id, basePlayer]) => {
      const override = playerOverrides[id] || {};
      result[id] = {
        ...basePlayer,
        imageUrl: override.customImageUrl || basePlayer.imageUrl,
        bio: override.customBio || basePlayer.bio,
        fullName: override.fullName || basePlayer.fullName,
        born: override.born || basePlayer.born,
        died: override.died || basePlayer.died,
        nationality: override.nationality || basePlayer.nationality,
        peakRating: override.peakRating || basePlayer.peakRating,
        worldChampion: override.worldChampion || basePlayer.worldChampion,
        playingStyle: override.playingStyle || basePlayer.playingStyle
      };
    });
    return result;
  }, [playerOverrides]);

  // Select a master and load their games
  const selectMaster = useCallback(async (masterId) => {
    setSelectedMaster(masterId);
    setMasterGames([]);
    
    // Try to load from local data first
    const localGames = getGamesByMaster(masterId);
    if (localGames.length > 0) {
      setMasterGames(localGames);
      return;
    }
    
    // Try to load from Supabase
    try {
      const { data, error: dbError } = await db.getMasterGames(masterId, 50);
      if (dbError) throw dbError;
      
      if (data && data.length > 0) {
        const formattedGames = data.map(g => ({
          id: g.id,
          white: g.white,
          black: g.black,
          result: g.result,
          date: g.date,
          event: g.event,
          eco: g.eco,
          pgn: g.pgn,
          source: 'supabase'
        }));
        setMasterGames(formattedGames);
      }
    } catch (e) {
      console.error("Error loading master games:", e);
    }
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedMaster(null);
    setMasterGames([]);
  }, []);

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([loadCustomPlayers(), loadPlayerOverrides()]);
  }, [loadCustomPlayers, loadPlayerOverrides]);

  // Get game count for a player
  const getGameCount = useCallback((playerId) => {
    return dbGameCounts[playerId] || getGamesByMaster(playerId).length || 0;
  }, [dbGameCounts]);

  return {
    // Data
    players: playersWithOverrides,
    customPlayers,
    playerOverrides,
    selectedMaster,
    masterGames,
    dbGameCounts,
    
    // State
    loading,
    error,
    
    // Actions
    loadCustomPlayers,
    loadPlayerOverrides,
    selectMaster,
    clearSelection,
    refresh,
    getGameCount
  };
}

export default useMasters;
