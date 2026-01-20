/**
 * Admin Panel - Import games, manage player profiles, and audio
 * ALL DATA STORED IN SUPABASE - No localStorage
 */

import React, { useState, useEffect, useRef } from 'react';
import { PLAYERS } from '../data/playerInfo.js';
import { parsePGN, countGames } from '../data/pgnParser.js';
import { supabase, db } from '../supabase.js';
import { readID3Tags, formatDuration } from '../audio/id3Reader.js';

export default function AdminPanel({ theme, onClose, onPlayersUpdated }) {
  // View mode: 'players' or 'audio'
  const [viewMode, setViewMode] = useState('players');
  
  const [activeSection, setActiveSection] = useState('import');
  const [selectedPlayer, setSelectedPlayer] = useState('fischer');
  const [importStatus, setImportStatus] = useState(null);
  const [pgnContent, setPgnContent] = useState('');
  const [gameCount, setGameCount] = useState(0);
  const [previewGames, setPreviewGames] = useState([]);
  const [playerOverrides, setPlayerOverrides] = useState({});
  const [dbGameCounts, setDbGameCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0); // 0-100
  
  // Wikipedia search state (for Add New Player)
  const [wikiSearch, setWikiSearch] = useState('');
  const [wikiResults, setWikiResults] = useState([]);
  const [wikiLoading, setWikiLoading] = useState(false);
  
  // Audio state
  const [audioTracks, setAudioTracks] = useState([]);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [pendingTrack, setPendingTrack] = useState(null);
  const [editingTrack, setEditingTrack] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const audioInputRef = useRef(null);
  
  // Custom players from Supabase
  const [customPlayers, setCustomPlayers] = useState({});
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    fullName: '',
    icon: '♟️',
    born: '',
    died: '',
    birthPlace: '',
    nationality: '',
    titles: '',
    peakRating: '',
    worldChampion: '',
    bio: '',
    playingStyle: '',
    era: '',
    imageUrl: ''
  });
  
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const newPlayerImageRef = useRef(null);

  // Helper to clear import state
  const clearImportState = () => {
    setPgnContent('');
    setGameCount(0);
    setPreviewGames([]);
    setImportStatus(null);
    setImportProgress(0);
  };

  // Select player and clear import state
  const handleSelectPlayer = (playerId) => {
    if (playerId !== selectedPlayer) {
      clearImportState();
    }
    setSelectedPlayer(playerId);
    setShowAddPlayerForm(false);
  };

  // Wikipedia search for player info
  const searchWikipedia = async (query) => {
    if (!query.trim()) return;
    
    setWikiLoading(true);
    setWikiResults([]);
    
    try {
      // Search Wikipedia
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' chess player')}&format=json&origin=*&srlimit=5`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      if (searchData.query?.search?.length > 0) {
        // Get details for each result
        const results = [];
        for (const item of searchData.query.search.slice(0, 3)) {
          const pageTitle = item.title;
          
          // Get page summary and image
          const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
          try {
            const summaryRes = await fetch(summaryUrl);
            const summaryData = await summaryRes.json();
            
            results.push({
              title: summaryData.title,
              description: summaryData.description || '',
              extract: summaryData.extract || '',
              imageUrl: summaryData.thumbnail?.source || summaryData.originalimage?.source || '',
              pageUrl: summaryData.content_urls?.desktop?.page || ''
            });
          } catch (e) {
            console.warn('Failed to get Wikipedia summary:', e);
          }
        }
        setWikiResults(results);
      }
    } catch (error) {
      console.error('Wikipedia search error:', error);
    } finally {
      setWikiLoading(false);
    }
  };

  // Apply Wikipedia result to new player form
  const applyWikiResult = (result) => {
    // Extract birth info from extract
    const birthMatch = result.extract.match(/born\s+(\w+\s+\d+,?\s+\d{4})/i);
    const deathMatch = result.extract.match(/died\s+(\w+\s+\d+,?\s+\d{4})/i);
    const nationalityMatch = result.extract.match(/is\s+an?\s+(\w+)\s+chess/i) || result.extract.match(/was\s+an?\s+(\w+)\s+chess/i);
    const ratingMatch = result.extract.match(/peak.*?rating.*?(\d{4})/i) || result.extract.match(/(\d{4}).*?rating/i);
    
    setNewPlayer(prev => ({
      ...prev,
      name: result.title,
      fullName: result.title,
      bio: result.extract.slice(0, 500) + (result.extract.length > 500 ? '...' : ''),
      imageUrl: result.imageUrl,
      born: birthMatch ? birthMatch[1] : prev.born,
      died: deathMatch ? deathMatch[1] : prev.died,
      nationality: nationalityMatch ? nationalityMatch[1] : prev.nationality,
      peakRating: ratingMatch ? ratingMatch[1] : prev.peakRating
    }));
    
    setWikiResults([]);
    setWikiSearch('');
  };

  // Quick add player directly from Wikipedia - one click!
  const quickAddFromWikipedia = async (result) => {
    if (!supabase) {
      setImportStatus({ type: 'error', message: 'Supabase not configured' });
      return;
    }

    setIsLoading(true);
    setImportStatus({ type: 'loading', message: `Adding ${result.title}...` });

    try {
      // Extract data from Wikipedia
      const birthMatch = result.extract.match(/born\s+(\w+\s+\d+,?\s+\d{4})/i);
      const deathMatch = result.extract.match(/died\s+(\w+\s+\d+,?\s+\d{4})/i);
      const nationalityMatch = result.extract.match(/is\s+an?\s+(\w+)\s+chess/i) || result.extract.match(/was\s+an?\s+(\w+)\s+chess/i);
      const ratingMatch = result.extract.match(/peak.*?rating.*?(\d{4})/i) || result.extract.match(/(\d{4}).*?rating/i);
      const championMatch = result.extract.match(/World\s+(?:Chess\s+)?Champion[^\d]*(\d{4})/i);

      const playerId = generatePlayerId(result.title);
      
      // Check if exists
      if (PLAYERS[playerId] || customPlayers[playerId]) {
        setImportStatus({ type: 'error', message: `"${result.title}" already exists. Select them from the player list.` });
        setIsLoading(false);
        return;
      }

      const playerData = {
        id: playerId,
        name: result.title,
        fullName: result.title,
        icon: '♟️',
        born: birthMatch ? birthMatch[1] : null,
        died: deathMatch ? deathMatch[1] : null,
        birthPlace: null,
        nationality: nationalityMatch ? nationalityMatch[1] : null,
        titles: [],
        peakRating: ratingMatch ? parseInt(ratingMatch[1]) : null,
        worldChampion: championMatch ? championMatch[1] : null,
        bio: result.extract || null,
        playingStyle: null,
        era: null,
        imageUrl: result.imageUrl || null
      };

      const { data, error } = await db.createCustomPlayer(playerData);

      if (error) throw error;

      // Add to local state
      setCustomPlayers(prev => ({
        ...prev,
        [playerId]: { ...playerData, isCustom: true }
      }));

      // Clear search
      setWikiResults([]);
      setWikiSearch('');
      setShowAddPlayerForm(false);
      
      // Select the new player
      setSelectedPlayer(playerId);
      
      setImportStatus({ type: 'success', message: `✓ ${result.title} added! Now import their games.` });
      
      // Notify parent
      onPlayersUpdated?.();

    } catch (error) {
      console.error('Error adding player:', error);
      setImportStatus({ type: 'error', message: `Failed: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    bg: theme?.bg || '#141416',
    card: theme?.card || '#1c1c20',
    text: theme?.ink || '#e8e8e8',
    muted: theme?.inkMuted || '#888',
    accent: theme?.accent || '#4a9eff',
    border: theme?.border || 'rgba(255,255,255,0.1)',
    success: '#4caf50',
    error: '#f44336'
  };

  // Load player overrides, custom players, game counts, and audio from Supabase on mount
  useEffect(() => {
    loadPlayerData();
    loadAudioTracks();
  }, []);

  const loadAudioTracks = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await db.getAudioTracks();
      if (!error && data) {
        setAudioTracks(data);
      }
    } catch (err) {
      console.error('Failed to load audio tracks:', err);
    }
  };

  const loadPlayerData = async () => {
    if (!supabase) {
      setImportStatus({ type: 'error', message: 'Supabase not configured. Check your environment variables.' });
      return;
    }

    setIsLoading(true);
    
    try {
      // Load all player overrides
      const { data: overrides, error: overridesError } = await db.getAllPlayerOverrides();
      if (!overridesError && overrides) {
        const overridesMap = {};
        overrides.forEach(o => {
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

      // Load custom players from Supabase
      const { data: customPlayersData, error: customError } = await db.getCustomPlayers();
      if (!customError && customPlayersData) {
        const customMap = {};
        customPlayersData.forEach(p => {
          customMap[p.id] = {
            name: p.name,
            fullName: p.full_name,
            icon: p.icon || '♟️',
            born: p.born,
            died: p.died,
            birthPlace: p.birth_place,
            nationality: p.nationality,
            titles: p.titles || [],
            peakRating: p.peak_rating,
            worldChampion: p.world_champion,
            imageUrl: p.image_url,
            bio: p.bio,
            playingStyle: p.playing_style,
            era: p.era,
            isCustom: true
          };
        });
        setCustomPlayers(customMap);
      }

      // Load game counts for all players (built-in + custom)
      const counts = {};
      const allPlayerIds = [...Object.keys(PLAYERS), ...Object.keys(customPlayers)];
      for (const playerId of allPlayerIds) {
        const { count } = await db.getMasterGameCount(playerId);
        counts[playerId] = count || 0;
      }
      setDbGameCounts(counts);
      
    } catch (error) {
      console.error('Error loading player data:', error);
      setImportStatus({ type: 'error', message: `Failed to load data: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO MANAGEMENT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleAudioDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    const audioFile = files.find(f => f.type.startsWith('audio/') || f.name.endsWith('.mp3'));
    
    if (!audioFile) {
      setImportStatus({ type: 'error', message: 'Please drop an MP3 audio file' });
      return;
    }
    
    await processAudioFile(audioFile);
  };

  const processAudioFile = async (file) => {
    setUploadingAudio(true);
    setImportStatus({ type: 'loading', message: 'Reading audio metadata...' });
    
    try {
      // Read ID3 tags
      const metadata = await readID3Tags(file);
      
      // Create pending track with metadata
      setPendingTrack({
        file,
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
        artist: metadata.artist || '',
        album: metadata.album || '',
        duration: metadata.duration,
        artworkUrl: metadata.artwork, // Object URL for preview
        artworkBlob: metadata.artwork ? await fetch(metadata.artwork).then(r => r.blob()) : null,
        modes: ['zone'],
        tags: []
      });
      
      setImportStatus({ type: 'success', message: 'Metadata extracted! Review and save.' });
    } catch (err) {
      console.error('Error processing audio:', err);
      setImportStatus({ type: 'error', message: `Failed to process: ${err.message}` });
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSaveTrack = async () => {
    if (!pendingTrack || !supabase) return;
    
    setUploadingAudio(true);
    setImportStatus({ type: 'loading', message: 'Uploading audio file...' });
    
    try {
      // Upload audio file
      const { data: audioData, error: audioError } = await db.uploadAudioFile(
        pendingTrack.file, 
        pendingTrack.file.name
      );
      
      if (audioError) throw audioError;
      
      let artworkUrl = null;
      
      // Upload artwork if present
      if (pendingTrack.artworkBlob) {
        setImportStatus({ type: 'loading', message: 'Uploading album artwork...' });
        const trackId = Date.now().toString();
        const { data: artData, error: artError } = await db.uploadArtwork(
          pendingTrack.artworkBlob,
          trackId
        );
        if (!artError) {
          artworkUrl = artData.url;
        }
      }
      
      // Create track record
      setImportStatus({ type: 'loading', message: 'Saving track info...' });
      const { data: track, error: trackError } = await db.createAudioTrack({
        title: pendingTrack.title,
        artist: pendingTrack.artist,
        album: pendingTrack.album,
        duration: pendingTrack.duration,
        fileUrl: audioData.url,
        artworkUrl,
        modes: pendingTrack.modes,
        tags: pendingTrack.tags
      });
      
      if (trackError) throw trackError;
      
      // Add to local state
      setAudioTracks(prev => [...prev, track]);
      
      // Clean up
      if (pendingTrack.artworkUrl) {
        URL.revokeObjectURL(pendingTrack.artworkUrl);
      }
      setPendingTrack(null);
      
      setImportStatus({ type: 'success', message: `"${pendingTrack.title}" added successfully!` });
    } catch (err) {
      console.error('Error saving track:', err);
      setImportStatus({ type: 'error', message: `Failed to save: ${err.message}` });
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    if (!supabase) return;
    
    setIsLoading(true);
    try {
      const { error } = await db.deleteAudioTrack(trackId);
      if (error) throw error;
      
      setAudioTracks(prev => prev.filter(t => t.id !== trackId));
      setImportStatus({ type: 'success', message: 'Track deleted' });
    } catch (err) {
      setImportStatus({ type: 'error', message: `Delete failed: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTrack = async (trackId, updates) => {
    if (!supabase) return;
    
    try {
      const { error } = await db.updateAudioTrack(trackId, updates);
      if (error) throw error;
      
      setAudioTracks(prev => prev.map(t => 
        t.id === trackId ? { ...t, ...updates } : t
      ));
      setEditingTrack(null);
    } catch (err) {
      setImportStatus({ type: 'error', message: `Update failed: ${err.message}` });
    }
  };

  const toggleTrackMode = (mode) => {
    if (!pendingTrack) return;
    setPendingTrack(prev => ({
      ...prev,
      modes: prev.modes.includes(mode)
        ? prev.modes.filter(m => m !== mode)
        : [...prev.modes, mode]
    }));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER SEARCH - Search Lichess/Chess.com for players
  // ═══════════════════════════════════════════════════════════════════════════

  const searchPlayers = async () => {
    if (!playerSearch.trim()) return;
    
    setSearchLoading(true);
    setSearchResults([]);
    
    try {
      if (searchSource === 'lichess') {
        await searchLichess(playerSearch.trim());
      } else {
        await searchChessCom(playerSearch.trim());
      }
    } catch (err) {
      console.error('Search failed:', err);
      setImportStatus({ type: 'error', message: `Search failed: ${err.message}` });
    } finally {
      setSearchLoading(false);
    }
  };

  const searchLichess = async (username) => {
    // Get user profile
    const userRes = await fetch(`https://lichess.org/api/user/${encodeURIComponent(username)}`);
    if (!userRes.ok) {
      setImportStatus({ type: 'error', message: 'Player not found on Lichess' });
      return;
    }
    
    const user = await userRes.json();
    
    // Build player info
    const player = {
      source: 'lichess',
      username: user.username,
      name: user.profile?.realName || user.username,
      title: user.title || null,
      rating: user.perfs?.classical?.rating || user.perfs?.rapid?.rating || user.perfs?.blitz?.rating,
      country: user.profile?.country,
      bio: user.profile?.bio,
      playCount: user.count?.all || 0,
      url: `https://lichess.org/@/${user.username}`,
      createdAt: user.createdAt,
    };
    
    setSearchResults([player]);
    setImportStatus({ type: 'success', message: `Found: ${player.name}` });
  };

  const searchChessCom = async (username) => {
    const userRes = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(username.toLowerCase())}`);
    if (!userRes.ok) {
      setImportStatus({ type: 'error', message: 'Player not found on Chess.com' });
      return;
    }
    
    const user = await userRes.json();
    
    // Get stats
    let rating = null;
    try {
      const statsRes = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(username.toLowerCase())}/stats`);
      if (statsRes.ok) {
        const stats = await statsRes.json();
        rating = stats.chess_rapid?.last?.rating || stats.chess_blitz?.last?.rating || stats.chess_bullet?.last?.rating;
      }
    } catch {}
    
    const player = {
      source: 'chesscom',
      username: user.username,
      name: user.name || user.username,
      title: user.title || null,
      rating,
      country: user.country?.split('/').pop(),
      bio: null,
      playCount: null,
      url: user.url,
      createdAt: user.joined * 1000,
    };
    
    setSearchResults([player]);
    setImportStatus({ type: 'success', message: `Found: ${player.name}` });
  };

  const addSearchResultAsPlayer = (result) => {
    // Pre-fill the new player form with search result data
    setNewPlayer({
      name: result.name || result.username,
      fullName: result.name || '',
      icon: result.title ? '🏆' : '♟️',
      born: '',
      died: '',
      birthPlace: '',
      nationality: result.country || '',
      titles: result.title || '',
      peakRating: result.rating?.toString() || '',
      worldChampion: '',
      bio: result.bio || `${result.source === 'lichess' ? 'Lichess' : 'Chess.com'} player: ${result.url}`,
      playingStyle: '',
      era: 'Modern'
    });
    setShowAddPlayerForm(true);
    setSearchResults([]);
    setPlayerSearch('');
  };

  // Generate player ID from name
  const generatePlayerId = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
  };

  // Add new player to Supabase
  const handleAddPlayer = async () => {
    if (!newPlayer.name.trim()) {
      setImportStatus({ type: 'error', message: 'Player name is required' });
      return;
    }

    if (!supabase) {
      setImportStatus({ type: 'error', message: 'Supabase not configured' });
      return;
    }

    setIsLoading(true);
    setImportStatus({ type: 'loading', message: 'Creating player...' });

    try {
      const playerId = generatePlayerId(newPlayer.name);
      
      // Check if player ID already exists
      if (PLAYERS[playerId] || customPlayers[playerId]) {
        setImportStatus({ type: 'error', message: `Player ID "${playerId}" already exists. Choose a different name.` });
        setIsLoading(false);
        return;
      }

      const { data, error } = await db.createCustomPlayer({
        id: playerId,
        name: newPlayer.name.trim(),
        fullName: newPlayer.fullName.trim() || newPlayer.name.trim(),
        icon: newPlayer.icon || '♟️',
        born: newPlayer.born.trim() || null,
        died: newPlayer.died.trim() || null,
        birthPlace: newPlayer.birthPlace.trim() || null,
        nationality: newPlayer.nationality.trim() || null,
        titles: newPlayer.titles ? newPlayer.titles.split(',').map(t => t.trim()).filter(Boolean) : [],
        peakRating: newPlayer.peakRating ? parseInt(newPlayer.peakRating) : null,
        worldChampion: newPlayer.worldChampion.trim() || null,
        bio: newPlayer.bio.trim() || null,
        playingStyle: newPlayer.playingStyle.trim() || null,
        era: newPlayer.era.trim() || null,
        imageUrl: newPlayer.imageUrl || null
      });

      if (error) {
        throw error;
      }

      // Add to local state
      setCustomPlayers(prev => ({
        ...prev,
        [playerId]: {
          name: newPlayer.name.trim(),
          fullName: newPlayer.fullName.trim() || newPlayer.name.trim(),
          icon: newPlayer.icon || '♟️',
          born: newPlayer.born.trim(),
          died: newPlayer.died.trim(),
          birthPlace: newPlayer.birthPlace.trim(),
          nationality: newPlayer.nationality.trim(),
          titles: newPlayer.titles ? newPlayer.titles.split(',').map(t => t.trim()).filter(Boolean) : [],
          peakRating: newPlayer.peakRating ? parseInt(newPlayer.peakRating) : null,
          worldChampion: newPlayer.worldChampion.trim(),
          bio: newPlayer.bio.trim(),
          playingStyle: newPlayer.playingStyle.trim(),
          era: newPlayer.era.trim(),
          imageUrl: newPlayer.imageUrl || null,
          isCustom: true
        }
      }));

      // Reset form
      setNewPlayer({
        name: '', fullName: '', icon: '♟️', born: '', died: '', birthPlace: '',
        nationality: '', titles: '', peakRating: '', worldChampion: '', bio: '', playingStyle: '', era: '', imageUrl: ''
      });
      setShowAddPlayerForm(false);
      setSelectedPlayer(playerId);
      setImportStatus({ type: 'success', message: `Player "${newPlayer.name}" created successfully!` });
      
      // Notify parent to refresh players list
      onPlayersUpdated?.();

    } catch (error) {
      console.error('Error creating player:', error);
      setImportStatus({ type: 'error', message: `Failed to create player: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete custom player
  const handleDeletePlayer = async (playerId) => {
    if (!supabase) {
      setImportStatus({ type: 'error', message: 'Supabase not configured' });
      return;
    }

    setIsLoading(true);
    setImportStatus({ type: 'loading', message: 'Deleting player...' });

    try {
      // Delete player's games first
      await db.deleteMasterGames(playerId);
      
      // Delete the player
      const { error } = await db.deleteCustomPlayer(playerId);
      if (error) throw error;

      // Remove from local state
      setCustomPlayers(prev => {
        const updated = { ...prev };
        delete updated[playerId];
        return updated;
      });

      setSelectedPlayer('fischer');
      setImportStatus({ type: 'success', message: 'Player deleted successfully' });
      onPlayersUpdated?.();

    } catch (error) {
      console.error('Error deleting player:', error);
      setImportStatus({ type: 'error', message: `Failed to delete: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Get all players (built-in + custom)
  const getAllPlayers = () => {
    return { ...PLAYERS, ...customPlayers };
  };

  // Handle PGN file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportStatus({ type: 'loading', message: 'Reading file...' });
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setPgnContent(content);
      
      // Count and preview games
      const count = countGames(content);
      setGameCount(count);
      
      // Parse first 10 for preview
      const preview = parsePGN(content, 10);
      setPreviewGames(preview);
      
      setImportStatus({ 
        type: 'success', 
        message: `Found ${count.toLocaleString()} games in ${file.name}` 
      });
    };
    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Failed to read file' });
    };
    reader.readAsText(file);
  };

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!supabase) {
      setImportStatus({ type: 'error', message: 'Supabase not configured' });
      return;
    }

    setImportStatus({ type: 'loading', message: 'Uploading image...' });

    try {
      const { data, error } = await db.uploadPlayerImage(selectedPlayer, file);
      
      if (error) {
        throw error;
      }

      // Save the URL to player_overrides
      await db.savePlayerOverride(selectedPlayer, {
        ...playerOverrides[selectedPlayer],
        customImageUrl: data.url
      });

      // Update local state
      setPlayerOverrides(prev => ({
        ...prev,
        [selectedPlayer]: {
          ...prev[selectedPlayer],
          customImageUrl: data.url
        }
      }));

      setImportStatus({ type: 'success', message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setImportStatus({ type: 'error', message: `Upload failed: ${error.message}` });
    }
  };

  // Import games to Supabase
  const importGames = async () => {
    if (!pgnContent || gameCount === 0) {
      setImportStatus({ type: 'error', message: 'No games to import' });
      return;
    }

    if (!supabase) {
      setImportStatus({ type: 'error', message: 'Supabase not configured. Check your environment variables.' });
      return;
    }

    setImportStatus({ type: 'loading', message: 'Parsing games...' });
    setIsLoading(true);
    setImportProgress(10);

    try {
      // Parse all games
      const games = parsePGN(pgnContent, 0); // 0 = all games
      setImportProgress(30);
      
      const playerName = PLAYERS[selectedPlayer]?.name || customPlayers[selectedPlayer]?.name || selectedPlayer;
      setImportStatus({ type: 'loading', message: `Importing ${games.length} games for ${playerName}...` });

      // Save to Supabase master_games table
      setImportProgress(50);
      const { data, error } = await db.saveMasterGames(selectedPlayer, games);
      setImportProgress(80);
      
      if (error) {
        throw error;
      }

      // Refresh game count
      const { count } = await db.getMasterGameCount(selectedPlayer);
      setDbGameCounts(prev => ({
        ...prev,
        [selectedPlayer]: count || 0
      }));
      
      setImportProgress(100);

      setImportStatus({ 
        type: 'success', 
        message: `✓ Imported ${data?.count || games.length} games for ${playerName}` 
      });
      
      // Clear form after short delay to show success
      setTimeout(() => {
        clearImportState();
      }, 2000);
      
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus({ type: 'error', message: `Import failed: ${error.message}` });
      setImportProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear player games from Supabase
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const clearPlayerGames = async () => {
    if (!supabase) {
      setImportStatus({ type: 'error', message: 'Supabase not configured' });
      return;
    }

    setIsLoading(true);
    setImportStatus({ type: 'loading', message: 'Deleting games...' });

    try {
      const { error } = await db.deleteMasterGames(selectedPlayer);
      
      if (error) {
        throw error;
      }

      setDbGameCounts(prev => ({
        ...prev,
        [selectedPlayer]: 0
      }));

      setShowDeleteConfirm(false);
      setImportStatus({ type: 'success', message: 'All games deleted' });
    } catch (error) {
      setImportStatus({ type: 'error', message: `Delete failed: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Save player profile to Supabase
  const saveProfile = async (field, value) => {
    if (!supabase) {
      setImportStatus({ type: 'error', message: 'Supabase not configured' });
      return;
    }

    const current = playerOverrides[selectedPlayer] || {};
    const updated = { ...current, [field]: value };
    
    try {
      const { error } = await db.savePlayerOverride(selectedPlayer, updated);
      
      if (error) {
        throw error;
      }

      setPlayerOverrides(prev => ({
        ...prev,
        [selectedPlayer]: updated
      }));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Get player with overrides applied
  const getPlayerWithOverrides = (id) => {
    // Check if it's a custom player first
    if (customPlayers[id]) {
      const custom = customPlayers[id];
      const overrides = playerOverrides[id] || {};
      return {
        ...custom,
        imageUrl: overrides.customImageUrl || custom.imageUrl,
        bio: overrides.customBio || custom.bio,
        fullName: overrides.fullName || custom.fullName,
        born: overrides.born || custom.born,
        died: overrides.died || custom.died,
        nationality: overrides.nationality || custom.nationality,
        peakRating: overrides.peakRating || custom.peakRating,
        worldChampion: overrides.worldChampion || custom.worldChampion,
        playingStyle: overrides.playingStyle || custom.playingStyle,
        isCustom: true
      };
    }
    
    // Built-in player
    const base = PLAYERS[id] || {};
    const overrides = playerOverrides[id] || {};
    return { 
      ...base, 
      imageUrl: overrides.customImageUrl || base.imageUrl,
      bio: overrides.customBio || base.bio,
      fullName: overrides.fullName || base.fullName,
      born: overrides.born || base.born,
      died: overrides.died || base.died,
      nationality: overrides.nationality || base.nationality,
      peakRating: overrides.peakRating || base.peakRating,
      worldChampion: overrides.worldChampion || base.worldChampion,
      playingStyle: overrides.playingStyle || base.playingStyle,
      isCustom: false
    };
  };

  const currentPlayer = getPlayerWithOverrides(selectedPlayer);
  const currentGameCount = dbGameCounts[selectedPlayer] || 0;

  return (
    <div style={styles.container(colors)}>
      {/* Header */}
      <div style={styles.header(colors)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <h2 style={styles.title(colors)}>⚙️ Admin Panel</h2>
          
          {/* View Mode Tabs */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 8 }}>
            <button
              onClick={() => setViewMode('players')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 6,
                background: viewMode === 'players' ? colors.accent : 'transparent',
                color: viewMode === 'players' ? '#fff' : colors.muted,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 13,
                transition: 'all 0.2s'
              }}
            >
              ♟️ Players
            </button>
            <button
              onClick={() => setViewMode('audio')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 6,
                background: viewMode === 'audio' ? colors.accent : 'transparent',
                color: viewMode === 'audio' ? '#fff' : colors.muted,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 13,
                transition: 'all 0.2s'
              }}
            >
              🎵 Audio ({audioTracks.length})
            </button>
            <button
              onClick={() => setViewMode('system')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 6,
                background: viewMode === 'system' ? colors.accent : 'transparent',
                color: viewMode === 'system' ? '#fff' : colors.muted,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 13,
                transition: 'all 0.2s'
              }}
            >
              🔧 System
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!supabase && (
            <span style={{ color: colors.error, fontSize: 13 }}>⚠️ Supabase not configured</span>
          )}
          <button onClick={onClose} style={styles.closeBtn(colors)}>✕</button>
        </div>
      </div>

      {/* AUDIO MANAGEMENT VIEW */}
      {viewMode === 'audio' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            
            {/* Upload Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleAudioDrop}
              onClick={() => audioInputRef.current?.click()}
              style={{
                padding: 40,
                border: `2px dashed ${dragOver ? colors.accent : colors.border}`,
                borderRadius: 12,
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? `${colors.accent}10` : 'transparent',
                transition: 'all 0.2s',
                marginBottom: 24
              }}
            >
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/mp3,audio/mpeg,.mp3"
                onChange={(e) => e.target.files[0] && processAudioFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎵</div>
              <div style={{ fontWeight: 500, marginBottom: 8, color: colors.text }}>
                Drop MP3 file here or click to browse
              </div>
              <div style={{ fontSize: 13, color: colors.muted }}>
                Metadata (title, artist, album art) will be extracted automatically
              </div>
            </div>

            {/* Pending Track Preview */}
            {pendingTrack && (
              <div style={{
                background: colors.card,
                borderRadius: 12,
                padding: 20,
                marginBottom: 24,
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{ margin: '0 0 16px', color: colors.text }}>📝 New Track</h3>
                
                <div style={{ display: 'flex', gap: 20 }}>
                  {/* Album Art */}
                  <div style={{
                    width: 120,
                    height: 120,
                    borderRadius: 8,
                    background: colors.bg,
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {pendingTrack.artworkUrl ? (
                      <img src={pendingTrack.artworkUrl} alt="Album art" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.muted, fontSize: 40 }}>
                        🎵
                      </div>
                    )}
                  </div>
                  
                  {/* Track Info Form */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, color: colors.muted, display: 'block', marginBottom: 4 }}>TITLE</label>
                        <input
                          type="text"
                          value={pendingTrack.title}
                          onChange={(e) => setPendingTrack(p => ({ ...p, title: e.target.value }))}
                          style={styles.input(colors)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: colors.muted, display: 'block', marginBottom: 4 }}>ARTIST</label>
                        <input
                          type="text"
                          value={pendingTrack.artist}
                          onChange={(e) => setPendingTrack(p => ({ ...p, artist: e.target.value }))}
                          style={styles.input(colors)}
                        />
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, color: colors.muted, display: 'block', marginBottom: 4 }}>ALBUM</label>
                        <input
                          type="text"
                          value={pendingTrack.album}
                          onChange={(e) => setPendingTrack(p => ({ ...p, album: e.target.value }))}
                          style={styles.input(colors)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: colors.muted, display: 'block', marginBottom: 4 }}>DURATION</label>
                        <div style={{ padding: '10px 12px', background: colors.bg, borderRadius: 6, color: colors.text }}>
                          {formatDuration(pendingTrack.duration)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mode Selection */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 11, color: colors.muted, display: 'block', marginBottom: 8 }}>PLAY IN MODES</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['zone', 'casual', 'puzzle', 'analysis', 'menu'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => toggleTrackMode(mode)}
                            style={{
                              padding: '6px 12px',
                              border: `1px solid ${pendingTrack.modes.includes(mode) ? colors.accent : colors.border}`,
                              borderRadius: 6,
                              background: pendingTrack.modes.includes(mode) ? `${colors.accent}20` : 'transparent',
                              color: pendingTrack.modes.includes(mode) ? colors.accent : colors.muted,
                              cursor: 'pointer',
                              fontSize: 12,
                              textTransform: 'capitalize'
                            }}
                          >
                            {pendingTrack.modes.includes(mode) ? '✓ ' : ''}{mode}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={handleSaveTrack}
                        disabled={uploadingAudio || !pendingTrack.title}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          border: 'none',
                          borderRadius: 8,
                          background: uploadingAudio ? colors.muted : colors.accent,
                          color: '#fff',
                          cursor: uploadingAudio ? 'wait' : 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {uploadingAudio ? 'Uploading...' : '✓ Save Track'}
                      </button>
                      <button
                        onClick={() => {
                          if (pendingTrack.artworkUrl) URL.revokeObjectURL(pendingTrack.artworkUrl);
                          setPendingTrack(null);
                        }}
                        style={{
                          padding: '12px 20px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: 8,
                          background: 'transparent',
                          color: colors.text,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            {importStatus && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 8,
                marginBottom: 16,
                background: importStatus.type === 'error' ? `${colors.error}20` :
                           importStatus.type === 'success' ? `${colors.success}20` :
                           `${colors.accent}20`,
                color: importStatus.type === 'error' ? colors.error :
                       importStatus.type === 'success' ? colors.success :
                       colors.accent,
                fontSize: 13
              }}>
                {importStatus.type === 'loading' && '⏳ '}
                {importStatus.type === 'success' && '✓ '}
                {importStatus.type === 'error' && '✕ '}
                {importStatus.message}
              </div>
            )}

            {/* Track List */}
            <h3 style={{ margin: '0 0 16px', color: colors.text }}>
              🎶 Audio Library ({audioTracks.length} tracks)
            </h3>
            
            {audioTracks.length === 0 ? (
              <div style={{
                padding: 40,
                textAlign: 'center',
                color: colors.muted,
                background: colors.card,
                borderRadius: 12
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔇</div>
                <div>No audio tracks yet. Upload your first track above!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {audioTracks.map(track => (
                  <div
                    key={track.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: 12,
                      background: colors.card,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    {/* Artwork */}
                    <div style={{
                      width: 50,
                      height: 50,
                      borderRadius: 6,
                      background: colors.bg,
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {track.artwork_url ? (
                        <img src={track.artwork_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.muted }}>
                          🎵
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.title}
                      </div>
                      <div style={{ fontSize: 12, color: colors.muted }}>
                        {track.artist || 'Unknown Artist'} {track.album && `• ${track.album}`}
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div style={{ fontSize: 13, color: colors.muted, flexShrink: 0 }}>
                      {formatDuration(track.duration)}
                    </div>
                    
                    {/* Modes */}
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      {(track.modes || ['zone']).map(mode => (
                        <span
                          key={mode}
                          style={{
                            padding: '2px 6px',
                            fontSize: 10,
                            background: `${colors.accent}20`,
                            color: colors.accent,
                            borderRadius: 4,
                            textTransform: 'uppercase'
                          }}
                        >
                          {mode}
                        </span>
                      ))}
                    </div>
                    
                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteTrack(track.id)}
                      style={{
                        padding: '6px 10px',
                        border: `1px solid ${colors.error}40`,
                        borderRadius: 6,
                        background: 'transparent',
                        color: colors.error,
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SYSTEM DIAGNOSTICS VIEW */}
      {viewMode === 'system' && (
        <SystemDiagnostics colors={colors} />
      )}

      {/* PLAYERS MANAGEMENT VIEW */}
      {viewMode === 'players' && (
      <div style={styles.content}>
        {/* Sidebar - Player Selection */}
        <div style={styles.sidebar(colors)}>
          
          <h3 style={styles.sidebarTitle(colors)}>BUILT-IN PLAYERS</h3>
          {Object.entries(PLAYERS).map(([id, player]) => (
            <button
              key={id}
              onClick={() => handleSelectPlayer(id)}
              style={styles.playerBtn(colors, selectedPlayer === id && !showAddPlayerForm)}
            >
              <span style={{ fontSize: 20 }}>{player.icon}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{player.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  {(dbGameCounts[id] || 0).toLocaleString()} games in DB
                </div>
              </div>
            </button>
          ))}
          
          {/* Custom Players Section */}
          {Object.keys(customPlayers).length > 0 && (
            <>
              <h3 style={{ ...styles.sidebarTitle(colors), marginTop: 20 }}>CUSTOM PLAYERS</h3>
              {Object.entries(customPlayers).map(([id, player]) => (
                <button
                  key={id}
                  onClick={() => handleSelectPlayer(id)}
                  style={styles.playerBtn(colors, selectedPlayer === id && !showAddPlayerForm)}
                >
                  <span style={{ fontSize: 20 }}>{player.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{player.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                      {(dbGameCounts[id] || 0).toLocaleString()} games in DB
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}
          
          {/* Add New Player Button */}
          <button
            onClick={() => { clearImportState(); setShowAddPlayerForm(true); }}
            style={{
              ...styles.playerBtn(colors, showAddPlayerForm),
              marginTop: 20,
              background: showAddPlayerForm ? colors.accent : `${colors.accent}20`,
              borderColor: colors.accent,
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: 18, marginRight: 8 }}>➕</span>
            <span style={{ fontWeight: 600 }}>Add New Player</span>
          </button>
        </div>

        {/* Main Panel */}
        <div style={styles.mainPanel(colors)}>
          {/* Add Player Form */}
          {showAddPlayerForm ? (
            <div style={styles.section(colors)}>
              <h3 style={styles.sectionTitle(colors)}>➕ Add New Player</h3>
              
              {/* Wikipedia Search */}
              <div style={{ 
                background: `${colors.accent}15`, 
                border: `1px solid ${colors.accent}40`,
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 24 
              }}>
                <label style={{ ...styles.label(colors), color: colors.accent, marginBottom: 8, display: 'block' }}>
                  🔍 Search Wikipedia for Player Info
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={wikiSearch}
                    onChange={(e) => setWikiSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchWikipedia(wikiSearch)}
                    placeholder="Enter player name (e.g., Hikaru Nakamura)"
                    style={{ ...styles.input(colors), flex: 1 }}
                  />
                  <button
                    onClick={() => searchWikipedia(wikiSearch)}
                    disabled={wikiLoading || !wikiSearch.trim()}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 8,
                      border: 'none',
                      background: colors.accent,
                      color: '#fff',
                      fontWeight: 600,
                      cursor: wikiLoading || !wikiSearch.trim() ? 'not-allowed' : 'pointer',
                      opacity: wikiLoading || !wikiSearch.trim() ? 0.5 : 1
                    }}
                  >
                    {wikiLoading ? '...' : 'Search'}
                  </button>
                </div>
                
                {/* Wikipedia Results */}
                {wikiResults.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
                      Click "Add" to instantly add player with Wikipedia data:
                    </div>
                    {wikiResults.map((result, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: 12,
                          padding: 12,
                          background: colors.card,
                          borderRadius: 8,
                          marginBottom: 8,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {result.imageUrl && (
                          <img 
                            src={result.imageUrl} 
                            alt="" 
                            style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }}
                          />
                        )}
                        {!result.imageUrl && (
                          <div style={{ 
                            width: 70, height: 70, borderRadius: 8, 
                            background: colors.bg, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 24, color: colors.muted
                          }}>
                            {result.title?.charAt(0)}
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: colors.text, marginBottom: 2 }}>{result.title}</div>
                          <div style={{ fontSize: 11, color: colors.accent, marginBottom: 4 }}>{result.description}</div>
                          <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.4 }}>
                            {result.extract?.slice(0, 120)}...
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignSelf: 'center' }}>
                          <button
                            onClick={() => quickAddFromWikipedia(result)}
                            disabled={isLoading}
                            style={{ 
                              padding: '8px 16px', 
                              background: colors.success,
                              borderRadius: 6, 
                              border: 'none',
                              fontSize: 13, 
                              fontWeight: 600,
                              color: '#fff',
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ✓ Add
                          </button>
                          <button
                            onClick={() => applyWikiResult(result)}
                            style={{ 
                              padding: '6px 12px', 
                              background: 'transparent',
                              borderRadius: 6, 
                              border: `1px solid ${colors.border}`,
                              fontSize: 11, 
                              color: colors.muted,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Edit first
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <p style={{ fontSize: 13, color: colors.muted, marginBottom: 20 }}>
                {newPlayer.name ? 'Edit the details below or search again.' : 'Or fill in the details manually:'}
              </p>
              
              {/* Image Preview */}
              {newPlayer.imageUrl && (
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img 
                    src={newPlayer.imageUrl} 
                    alt="Player" 
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12 }}
                  />
                  <div>
                    <div style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Image from Wikipedia</div>
                    <button
                      onClick={() => setNewPlayer(p => ({ ...p, imageUrl: '' }))}
                      style={{ fontSize: 11, color: colors.error, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              
              <div style={styles.formRow}>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Name *</label>
                  <input
                    type="text"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., Hikaru Nakamura"
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Full Name</label>
                  <input
                    type="text"
                    value={newPlayer.fullName}
                    onChange={(e) => setNewPlayer(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="e.g., Hikaru Nakamura"
                    style={styles.input(colors)}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup(colors), flex: '0 0 80px' }}>
                  <label style={styles.label(colors)}>Icon</label>
                  <input
                    type="text"
                    value={newPlayer.icon}
                    onChange={(e) => setNewPlayer(p => ({ ...p, icon: e.target.value }))}
                    placeholder="♟️"
                    style={{ ...styles.input(colors), textAlign: 'center', fontSize: 20 }}
                    maxLength={2}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Nationality</label>
                  <input
                    type="text"
                    value={newPlayer.nationality}
                    onChange={(e) => setNewPlayer(p => ({ ...p, nationality: e.target.value }))}
                    placeholder="e.g., American"
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Era</label>
                  <input
                    type="text"
                    value={newPlayer.era}
                    onChange={(e) => setNewPlayer(p => ({ ...p, era: e.target.value }))}
                    placeholder="e.g., Modern"
                    style={styles.input(colors)}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Born</label>
                  <input
                    type="text"
                    value={newPlayer.born}
                    onChange={(e) => setNewPlayer(p => ({ ...p, born: e.target.value }))}
                    placeholder="e.g., December 9, 1987"
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Died (leave empty if alive)</label>
                  <input
                    type="text"
                    value={newPlayer.died}
                    onChange={(e) => setNewPlayer(p => ({ ...p, died: e.target.value }))}
                    placeholder=""
                    style={styles.input(colors)}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Birth Place</label>
                  <input
                    type="text"
                    value={newPlayer.birthPlace}
                    onChange={(e) => setNewPlayer(p => ({ ...p, birthPlace: e.target.value }))}
                    placeholder="e.g., Hirakata, Japan"
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Peak Rating</label>
                  <input
                    type="number"
                    value={newPlayer.peakRating}
                    onChange={(e) => setNewPlayer(p => ({ ...p, peakRating: e.target.value }))}
                    placeholder="e.g., 2816"
                    style={styles.input(colors)}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>World Champion Years</label>
                  <input
                    type="text"
                    value={newPlayer.worldChampion}
                    onChange={(e) => setNewPlayer(p => ({ ...p, worldChampion: e.target.value }))}
                    placeholder="e.g., 2013-2023 (leave empty if none)"
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Titles (comma separated)</label>
                  <input
                    type="text"
                    value={newPlayer.titles}
                    onChange={(e) => setNewPlayer(p => ({ ...p, titles: e.target.value }))}
                    placeholder="e.g., GM, 5x US Champion"
                    style={styles.input(colors)}
                  />
                </div>
              </div>

              <div style={styles.formGroup(colors)}>
                <label style={styles.label(colors)}>Playing Style</label>
                <input
                  type="text"
                  value={newPlayer.playingStyle}
                  onChange={(e) => setNewPlayer(p => ({ ...p, playingStyle: e.target.value }))}
                  placeholder="e.g., Aggressive, tactical, speed chess specialist"
                  style={styles.input(colors)}
                />
              </div>

              <div style={styles.formGroup(colors)}>
                <label style={styles.label(colors)}>Biography</label>
                <textarea
                  value={newPlayer.bio}
                  onChange={(e) => setNewPlayer(p => ({ ...p, bio: e.target.value }))}
                  rows={4}
                  placeholder="Write a brief biography..."
                  style={styles.textarea(colors)}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                  onClick={handleAddPlayer}
                  disabled={isLoading || !newPlayer.name.trim()}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    border: 'none',
                    borderRadius: 8,
                    backgroundColor: (!newPlayer.name.trim() || isLoading) ? colors.muted : colors.accent,
                    color: '#fff',
                    cursor: (!newPlayer.name.trim() || isLoading) ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: 15
                  }}
                >
                  {isLoading ? 'Creating...' : '✓ Create Player'}
                </button>
                <button
                  onClick={() => {
                    setShowAddPlayerForm(false);
                    setNewPlayer({
                      name: '', fullName: '', icon: '♟️', born: '', died: '', birthPlace: '',
                      nationality: '', titles: '', peakRating: '', worldChampion: '', bio: '', playingStyle: '', era: ''
                    });
                  }}
                  style={{
                    padding: '14px 20px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    backgroundColor: 'transparent',
                    color: colors.text,
                    cursor: 'pointer',
                    fontSize: 15
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Section Tabs */}
              <div style={styles.tabs(colors)}>
                {[
                  { id: 'import', label: '📥 Import Games' },
                  { id: 'profile', label: '👤 Edit Profile' },
                  { id: 'image', label: '🖼️ Custom Image' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    style={styles.tab(colors, activeSection === tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
                
                {/* Delete button for custom players */}
                {customPlayers[selectedPlayer] && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      ...styles.tab(colors, false),
                      marginLeft: 'auto',
                      color: colors.error,
                      borderColor: colors.error
                    }}
                  >
                    🗑️ Delete Player
                  </button>
                )}
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10000
                }}>
                  <div style={{
                    background: colors.card,
                    padding: 24,
                    borderRadius: 12,
                    maxWidth: 400,
                    border: `1px solid ${colors.border}`
                  }}>
                    <h3 style={{ margin: '0 0 16px', color: colors.error }}>⚠️ Confirm Delete</h3>
                    <p style={{ margin: '0 0 20px', color: colors.text }}>
                      Are you sure you want to delete <strong>{currentPlayer.name}</strong> and all their games? This cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => customPlayers[selectedPlayer] ? handleDeletePlayer(selectedPlayer) : clearPlayerGames()}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: 'none',
                          borderRadius: 8,
                          backgroundColor: colors.error,
                          color: '#fff',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: 8,
                          backgroundColor: 'transparent',
                          color: colors.text,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Games Section */}
              {activeSection === 'import' && (
                <div style={styles.section(colors)}>
                  <h3 style={styles.sectionTitle(colors)}>
                    Import PGN for {currentPlayer.name}
                  </h3>
                  
                  {/* Current player indicator */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    marginBottom: 16,
                    padding: '8px 12px',
                    background: `${colors.accent}15`,
                    borderRadius: 8,
                    border: `1px solid ${colors.accent}30`
                  }}>
                    <span style={{ fontSize: 20 }}>{currentPlayer.icon}</span>
                    <span style={{ color: colors.text }}>
                      Importing to: <strong>{currentPlayer.name}</strong>
                    </span>
                  </div>
                  
                  {/* File Upload */}
                  <div style={styles.uploadArea(colors)} onClick={() => fileInputRef.current?.click()}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pgn"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>Click to select PGN file</div>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>Games will be stored in Supabase</div>
                  </div>

                  {/* Progress Bar */}
                  {importProgress > 0 && importProgress < 100 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: 6,
                        fontSize: 12,
                        color: colors.muted
                      }}>
                        <span>Importing...</span>
                        <span>{importProgress}%</span>
                      </div>
                      <div style={{ 
                        height: 8, 
                        background: colors.border, 
                        borderRadius: 4, 
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${importProgress}%`, 
                          background: colors.accent,
                          borderRadius: 4,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Status */}
              {importStatus && (
                <div style={{
                  ...styles.status(colors, importStatus.type),
                  marginTop: 16
                }}>
                  {importStatus.type === 'loading' && '⏳ '}
                  {importStatus.type === 'success' && '✅ '}
                  {importStatus.type === 'error' && '❌ '}
                  {importStatus.message}
                </div>
              )}

              {/* Preview */}
              {previewGames.length > 0 && (
                <div style={styles.preview(colors)}>
                  <h4 style={{ margin: '0 0 12px 0' }}>Preview ({gameCount.toLocaleString()} games total)</h4>
                  <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {previewGames.map((game, i) => (
                      <div key={i} style={styles.previewGame(colors)}>
                        <span style={{ fontWeight: 500 }}>{game.white}</span>
                        <span style={{ opacity: 0.6 }}> vs </span>
                        <span style={{ fontWeight: 500 }}>{game.black}</span>
                        <span style={{ marginLeft: 8, opacity: 0.6 }}>
                          {game.result} ({game.year || '?'})
                        </span>
                      </div>
                    ))}
                    {gameCount > 10 && (
                      <div style={{ opacity: 0.5, fontStyle: 'italic', marginTop: 8 }}>
                        ... and {(gameCount - 10).toLocaleString()} more
                      </div>
                    )}
                  </div>
                  
                  {/* Import Button */}
                  <button 
                    onClick={importGames} 
                    disabled={isLoading || !supabase}
                    style={{
                      ...styles.importBtn(colors),
                      opacity: (isLoading || !supabase) ? 0.5 : 1,
                      cursor: (isLoading || !supabase) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isLoading ? 'Importing...' : `Import ${gameCount.toLocaleString()} Games for ${currentPlayer.name}`}
                  </button>
                  
                  {/* Clear Button */}
                  <button
                    onClick={clearImportState}
                    style={{
                      marginTop: 8,
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: 'transparent',
                      color: colors.muted,
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Current Games in DB */}
              <div style={styles.currentGames(colors)}>
                <h4 style={{ margin: '0 0 8px 0' }}>Games in Database</h4>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  {currentPlayer.name} has <strong>{currentGameCount.toLocaleString()}</strong> games stored in Supabase.
                </p>
                {currentGameCount > 0 && (
                  <button 
                    onClick={clearPlayerGames} 
                    disabled={isLoading || !supabase}
                    style={styles.clearBtn(colors)}
                  >
                    🗑️ Delete All Games
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Edit Profile Section */}
          {activeSection === 'profile' && (
            <div style={styles.section(colors)}>
              <h3 style={styles.sectionTitle(colors)}>
                Edit Profile: {currentPlayer.name}
              </h3>
              
              <div style={styles.formGroup(colors)}>
                <label style={styles.label(colors)}>Full Name</label>
                <input
                  type="text"
                  defaultValue={currentPlayer.fullName}
                  onBlur={(e) => saveProfile('fullName', e.target.value)}
                  style={styles.input(colors)}
                />
              </div>

              <div style={styles.formGroup(colors)}>
                <label style={styles.label(colors)}>Bio (saved to Supabase)</label>
                <textarea
                  defaultValue={currentPlayer.bio}
                  rows={6}
                  onBlur={(e) => saveProfile('customBio', e.target.value)}
                  style={styles.textarea(colors)}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Born</label>
                  <input
                    type="text"
                    defaultValue={currentPlayer.born}
                    onBlur={(e) => saveProfile('born', e.target.value)}
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Died</label>
                  <input
                    type="text"
                    defaultValue={currentPlayer.died || ''}
                    placeholder="Still active"
                    onBlur={(e) => saveProfile('died', e.target.value || null)}
                    style={styles.input(colors)}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Peak Rating</label>
                  <input
                    type="number"
                    defaultValue={currentPlayer.peakRating || ''}
                    onBlur={(e) => saveProfile('peakRating', parseInt(e.target.value) || null)}
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>World Champion</label>
                  <input
                    type="text"
                    defaultValue={currentPlayer.worldChampion || ''}
                    onBlur={(e) => saveProfile('worldChampion', e.target.value)}
                    style={styles.input(colors)}
                  />
                </div>
              </div>

              <div style={{ marginTop: 16, padding: 12, background: `${colors.accent}15`, borderRadius: 8, fontSize: 13 }}>
                💾 Changes are automatically saved to Supabase when you leave each field.
              </div>
            </div>
          )}

          {/* Custom Image Section */}
          {activeSection === 'image' && (
            <div style={styles.section(colors)}>
              <h3 style={styles.sectionTitle(colors)}>
                Custom Image: {currentPlayer.name}
              </h3>
              
              <div style={styles.imageSection}>
                {/* Current Image */}
                <div style={styles.imagePreview(colors)}>
                  <h4 style={{ margin: '0 0 12px 0' }}>Current Image</h4>
                  <img
                    src={currentPlayer.imageUrl}
                    alt={currentPlayer.name}
                    style={styles.previewImg}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
                    {playerOverrides[selectedPlayer]?.customImageUrl ? '✅ Custom (Supabase Storage)' : '📷 Wikipedia default'}
                  </div>
                </div>

                {/* Upload New */}
                <div style={styles.uploadSection}>
                  <div 
                    style={styles.uploadArea(colors)} 
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>Upload Custom Image</div>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>Stored in Supabase Storage</div>
                  </div>

                  {/* Fetch from Wikipedia button */}
                  <button
                    onClick={async () => {
                      setImportStatus({ type: 'loading', message: 'Fetching from Wikipedia...' });
                      try {
                        const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(currentPlayer.name)}`;
                        const res = await fetch(searchUrl);
                        const data = await res.json();
                        
                        if (data.thumbnail?.source || data.originalimage?.source) {
                          const imageUrl = data.thumbnail?.source || data.originalimage?.source;
                          
                          // Update in database if custom player
                          if (customPlayers[selectedPlayer]) {
                            await db.updateCustomPlayer(selectedPlayer, {
                              ...customPlayers[selectedPlayer],
                              imageUrl: imageUrl
                            });
                            setCustomPlayers(prev => ({
                              ...prev,
                              [selectedPlayer]: { ...prev[selectedPlayer], image_url: imageUrl, imageUrl: imageUrl }
                            }));
                          }
                          
                          setImportStatus({ type: 'success', message: 'Image updated from Wikipedia!' });
                          onPlayersUpdated?.();
                        } else {
                          setImportStatus({ type: 'error', message: 'No image found on Wikipedia' });
                        }
                      } catch (e) {
                        setImportStatus({ type: 'error', message: 'Failed to fetch from Wikipedia' });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 8,
                      border: `1px solid ${colors.accent}40`,
                      background: `${colors.accent}15`,
                      color: colors.accent,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      marginTop: 12
                    }}
                  >
                    🔄 Fetch Image from Wikipedia
                  </button>

                  {playerOverrides[selectedPlayer]?.customImageUrl && (
                    <button
                      onClick={async () => {
                        await db.savePlayerOverride(selectedPlayer, {
                          ...playerOverrides[selectedPlayer],
                          customImageUrl: null
                        });
                        setPlayerOverrides(prev => {
                          const updated = { ...prev };
                          if (updated[selectedPlayer]) {
                            delete updated[selectedPlayer].customImageUrl;
                          }
                          return updated;
                        });
                        setImportStatus({ type: 'success', message: 'Reverted to Wikipedia image' });
                      }}
                      style={styles.revertBtn(colors)}
                    >
                      ↩️ Revert to Wikipedia Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM DIAGNOSTICS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function SystemDiagnostics({ colors }) {
  const [status, setStatus] = useState({
    ai: { status: 'checking', message: 'Checking...' },
    supabase: { status: 'checking', message: 'Checking...' },
    stockfish: { status: 'checking', message: 'Checking...' },
    audio: { status: 'checking', message: 'Checking...' },
    voice: { status: 'checking', message: 'Checking...' },
    storage: { status: 'checking', message: 'Checking...' }
  });
  const [isChecking, setIsChecking] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  // Run all checks
  const runDiagnostics = async () => {
    setIsChecking(true);
    
    // Reset all to checking
    setStatus({
      ai: { status: 'checking', message: 'Checking...' },
      supabase: { status: 'checking', message: 'Checking...' },
      stockfish: { status: 'checking', message: 'Checking...' },
      audio: { status: 'checking', message: 'Checking...' },
      voice: { status: 'checking', message: 'Checking...' },
      storage: { status: 'checking', message: 'Checking...' }
    });

    // Check AI (Claude API via /api/coach)
    try {
      const aiRes = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: 'Say "OK" if you can hear me.',
          maxTokens: 10 
        })
      });
      
      if (aiRes.ok) {
        const data = await aiRes.json();
        if (data.text) {
          setStatus(s => ({ ...s, ai: { status: 'ok', message: 'Connected' } }));
        } else {
          setStatus(s => ({ ...s, ai: { status: 'warning', message: 'Empty response' } }));
        }
      } else {
        const err = await aiRes.json().catch(() => ({}));
        if (err.message?.includes('API key')) {
          setStatus(s => ({ ...s, ai: { status: 'error', message: 'API key missing' } }));
        } else {
          setStatus(s => ({ ...s, ai: { status: 'error', message: 'Connection failed' } }));
        }
      }
    } catch (e) {
      if (e.message?.includes('Failed to fetch')) {
        setStatus(s => ({ ...s, ai: { status: 'warning', message: 'Not available locally' } }));
      } else {
        setStatus(s => ({ ...s, ai: { status: 'error', message: 'Error' } }));
      }
    }

    // Check Supabase
    try {
      if (typeof supabase !== 'undefined' && supabase) {
        const { data, error } = await supabase.from('chess_games').select('id').limit(1);
        if (error) {
          if (error.message.includes('does not exist')) {
            setStatus(s => ({ ...s, supabase: { status: 'warning', message: 'Tables not created' } }));
          } else {
            setStatus(s => ({ ...s, supabase: { status: 'error', message: 'Connection error' } }));
          }
        } else {
          setStatus(s => ({ ...s, supabase: { status: 'ok', message: 'Connected' } }));
        }
      } else {
        setStatus(s => ({ ...s, supabase: { status: 'error', message: 'Not configured' } }));
      }
    } catch (e) {
      setStatus(s => ({ ...s, supabase: { status: 'error', message: 'Error' } }));
    }

    // Check Stockfish
    try {
      const stockfishUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';
      const sfRes = await fetch(stockfishUrl, { method: 'HEAD' });
      if (sfRes.ok) {
        setStatus(s => ({ ...s, stockfish: { status: 'ok', message: 'Ready' } }));
      } else {
        setStatus(s => ({ ...s, stockfish: { status: 'error', message: 'CDN error' } }));
      }
    } catch (e) {
      setStatus(s => ({ ...s, stockfish: { status: 'warning', message: 'Cannot verify' } }));
    }

    // Check Audio API
    try {
      if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        setStatus(s => ({ ...s, audio: { status: 'ok', message: 'Supported' } }));
      } else {
        setStatus(s => ({ ...s, audio: { status: 'error', message: 'Not supported' } }));
      }
    } catch (e) {
      setStatus(s => ({ ...s, audio: { status: 'error', message: 'Error' } }));
    }

    // Check Voice Synthesis
    try {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setStatus(s => ({ ...s, voice: { status: 'ok', message: `${voices.length || '✓'} voices` } }));
      } else {
        setStatus(s => ({ ...s, voice: { status: 'error', message: 'Not supported' } }));
      }
    } catch (e) {
      setStatus(s => ({ ...s, voice: { status: 'error', message: 'Error' } }));
    }

    // Check LocalStorage
    try {
      localStorage.setItem('_test_', '1');
      localStorage.removeItem('_test_');
      setStatus(s => ({ ...s, storage: { status: 'ok', message: 'Available' } }));
    } catch (e) {
      setStatus(s => ({ ...s, storage: { status: 'error', message: 'Blocked' } }));
    }

    setIsChecking(false);
  };

  // Run on mount
  useEffect(() => {
    runDiagnostics();
  }, []);

  // Count statuses
  const counts = Object.values(status).reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const services = [
    { key: 'ai', name: 'AI Coach', sub: 'Claude API' },
    { key: 'supabase', name: 'Database', sub: 'Supabase' },
    { key: 'stockfish', name: 'Engine', sub: 'Stockfish' },
    { key: 'audio', name: 'Audio', sub: 'Web Audio' },
    { key: 'voice', name: 'Voice', sub: 'TTS' },
    { key: 'storage', name: 'Storage', sub: 'Local' }
  ];

  const statusColors = {
    ok: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    checking: '#6b7280'
  };

  return (
    <div style={{ 
      flex: 1, 
      overflow: 'auto', 
      padding: '32px 24px',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        
        {/* Summary Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 32
        }}>
          <div>
            <div style={{ 
              fontSize: 13, 
              color: colors.muted, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 4
            }}>
              System Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {counts.ok > 0 && (
                <span style={{ color: statusColors.ok, fontSize: 14, fontWeight: 500 }}>
                  {counts.ok} operational
                </span>
              )}
              {counts.warning > 0 && (
                <span style={{ color: statusColors.warning, fontSize: 14, fontWeight: 500 }}>
                  {counts.warning} warning
                </span>
              )}
              {counts.error > 0 && (
                <span style={{ color: statusColors.error, fontSize: 14, fontWeight: 500 }}>
                  {counts.error} issue{counts.error > 1 ? 's' : ''}
                </span>
              )}
              {counts.checking > 0 && (
                <span style={{ color: statusColors.checking, fontSize: 14 }}>
                  checking...
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={runDiagnostics}
            disabled={isChecking}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: isChecking ? colors.muted : colors.text,
              border: `1px solid ${colors.border || 'rgba(255,255,255,0.15)'}`,
              borderRadius: 6,
              cursor: isChecking ? 'not-allowed' : 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s',
              opacity: isChecking ? 0.5 : 1
            }}
          >
            {isChecking ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        {/* Status Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1,
          background: colors.border || 'rgba(255,255,255,0.08)',
          borderRadius: 12,
          overflow: 'hidden'
        }}>
          {services.map((service, i) => {
            const s = status[service.key];
            const isLast = i >= services.length - 2;
            
            return (
              <div 
                key={service.key}
                style={{
                  background: colors.bg || '#1a1a1a',
                  padding: '20px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                {/* Status Dot */}
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: statusColors[s?.status] || statusColors.checking,
                  boxShadow: s?.status === 'ok' ? `0 0 8px ${statusColors.ok}` : 'none',
                  flexShrink: 0
                }} />
                
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    color: colors.text, 
                    fontSize: 14, 
                    fontWeight: 500,
                    marginBottom: 2
                  }}>
                    {service.name}
                  </div>
                  <div style={{ 
                    color: colors.muted, 
                    fontSize: 12,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {s?.message || service.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Setup Section - Collapsible */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => setShowSetup(!showSetup)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${colors.border || 'rgba(255,255,255,0.08)'}`,
              borderRadius: 8,
              color: colors.muted,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s'
            }}
          >
            <span>Setup Guide</span>
            <span style={{ 
              transform: showSetup ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
              ▼
            </span>
          </button>
          
          {showSetup && (
            <div style={{
              marginTop: 8,
              padding: 16,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 8,
              border: `1px solid ${colors.border || 'rgba(255,255,255,0.08)'}`,
              fontSize: 13,
              color: colors.muted,
              lineHeight: 1.8
            }}>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: colors.text }}>AI Coach</strong>
                <br />
                Add <code style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '2px 6px', 
                  borderRadius: 4,
                  fontSize: 12
                }}>ANTHROPIC_API_KEY</code> in Vercel → Settings → Environment Variables
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: colors.text }}>Database</strong>
                <br />
                Add <code style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '2px 6px', 
                  borderRadius: 4,
                  fontSize: 12
                }}>VITE_SUPABASE_URL</code> and <code style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '2px 6px', 
                  borderRadius: 4,
                  fontSize: 12
                }}>VITE_SUPABASE_ANON_KEY</code>
              </div>
              <div style={{ color: colors.muted, opacity: 0.7 }}>
                Engine, Audio, Voice, and Storage require no setup.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 32,
          textAlign: 'center',
          color: colors.muted,
          fontSize: 12,
          opacity: 0.5
        }}>
          ChessGrandmaster v2.2.0
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: (colors) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.bg,
    color: colors.text
  }),
  
  header: (colors) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: colors.card,
    borderBottom: `1px solid ${colors.border}`
  }),
  
  title: (colors) => ({
    margin: 0,
    fontSize: 22,
    fontWeight: 600
  }),
  
  closeBtn: (colors) => ({
    background: 'none',
    border: 'none',
    color: colors.muted,
    fontSize: 20,
    cursor: 'pointer',
    padding: '4px 8px'
  }),
  
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  
  sidebar: (colors) => ({
    width: 220,
    backgroundColor: colors.card,
    borderRight: `1px solid ${colors.border}`,
    padding: 16,
    overflowY: 'auto'
  }),
  
  sidebarTitle: (colors) => ({
    margin: '0 0 16px 0',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    opacity: 0.7
  }),
  
  playerBtn: (colors, active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '10px 12px',
    marginBottom: 8,
    border: active ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
    borderRadius: 8,
    backgroundColor: active ? `${colors.accent}20` : 'transparent',
    color: colors.text,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  }),
  
  mainPanel: (colors) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }),
  
  tabs: (colors) => ({
    display: 'flex',
    gap: 8,
    padding: 16,
    borderBottom: `1px solid ${colors.border}`
  }),
  
  tab: (colors, active) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: 8,
    backgroundColor: active ? colors.accent : 'transparent',
    color: active ? '#fff' : colors.text,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 14,
    transition: 'all 0.2s'
  }),
  
  section: (colors) => ({
    flex: 1,
    padding: 24,
    overflowY: 'auto'
  }),
  
  sectionTitle: (colors) => ({
    margin: '0 0 20px 0',
    fontSize: 18,
    fontWeight: 600
  }),
  
  uploadArea: (colors) => ({
    border: `2px dashed ${colors.border}`,
    borderRadius: 12,
    padding: 40,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: `${colors.accent}05`
  }),
  
  status: (colors, type) => ({
    padding: '12px 16px',
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: type === 'error' ? `${colors.error}20` : 
                     type === 'success' ? `${colors.success}20` : 
                     `${colors.accent}20`,
    color: type === 'error' ? colors.error : 
           type === 'success' ? colors.success : 
           colors.text
  }),
  
  preview: (colors) => ({
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    border: `1px solid ${colors.border}`
  }),
  
  previewGame: (colors) => ({
    padding: '8px 0',
    borderBottom: `1px solid ${colors.border}`,
    fontSize: 13
  }),
  
  importBtn: (colors) => ({
    width: '100%',
    marginTop: 16,
    padding: '14px 20px',
    border: 'none',
    borderRadius: 8,
    backgroundColor: colors.accent,
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 15
  }),
  
  currentGames: (colors) => ({
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    border: `1px solid ${colors.border}`
  }),
  
  clearBtn: (colors) => ({
    marginTop: 12,
    padding: '8px 16px',
    border: `1px solid ${colors.error}`,
    borderRadius: 6,
    backgroundColor: 'transparent',
    color: colors.error,
    cursor: 'pointer',
    fontSize: 13
  }),
  
  formGroup: (colors) => ({
    marginBottom: 16,
    flex: 1
  }),
  
  formRow: {
    display: 'flex',
    gap: 16
  },
  
  label: (colors) => ({
    display: 'block',
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 500,
    opacity: 0.8
  }),
  
  input: (colors) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    backgroundColor: colors.bg,
    color: colors.text,
    fontSize: 14,
    outline: 'none'
  }),
  
  textarea: (colors) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    backgroundColor: colors.bg,
    color: colors.text,
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  }),
  
  imageSection: {
    display: 'flex',
    gap: 24
  },
  
  imagePreview: (colors) => ({
    flex: 1,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    textAlign: 'center'
  }),
  
  previewImg: {
    maxWidth: '100%',
    maxHeight: 300,
    borderRadius: 8,
    objectFit: 'cover'
  },
  
  uploadSection: {
    flex: 1
  },
  
  revertBtn: (colors) => ({
    marginTop: 16,
    padding: '10px 16px',
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: colors.text,
    cursor: 'pointer',
    fontSize: 13,
    width: '100%'
  })
};
