/**
 * Admin Panel - Import games and manage player profiles
 * ALL DATA STORED IN SUPABASE - No localStorage
 */

import React, { useState, useEffect, useRef } from 'react';
import { PLAYERS } from '../data/playerInfo.js';
import { parsePGN, countGames } from '../data/pgnParser.js';
import { supabase, db } from '../supabase.js';

export default function AdminPanel({ theme, onClose, onPlayersUpdated }) {
  const [activeSection, setActiveSection] = useState('import');
  const [selectedPlayer, setSelectedPlayer] = useState('fischer');
  const [importStatus, setImportStatus] = useState(null);
  const [pgnContent, setPgnContent] = useState('');
  const [gameCount, setGameCount] = useState(0);
  const [previewGames, setPreviewGames] = useState([]);
  const [playerOverrides, setPlayerOverrides] = useState({});
  const [dbGameCounts, setDbGameCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
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
    era: ''
  });
  
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const newPlayerImageRef = useRef(null);

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

  // Load player overrides, custom players, and game counts from Supabase on mount
  useEffect(() => {
    loadPlayerData();
  }, []);

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
        era: newPlayer.era.trim() || null
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
          isCustom: true
        }
      }));

      // Reset form
      setNewPlayer({
        name: '', fullName: '', icon: '♟️', born: '', died: '', birthPlace: '',
        nationality: '', titles: '', peakRating: '', worldChampion: '', bio: '', playingStyle: '', era: ''
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

    try {
      // Parse all games
      const games = parsePGN(pgnContent, 0); // 0 = all games
      
      setImportStatus({ type: 'loading', message: `Importing ${games.length} games to Supabase...` });

      // Save to Supabase master_games table
      const { data, error } = await db.saveMasterGames(selectedPlayer, games);
      
      if (error) {
        throw error;
      }

      // Refresh game count
      const { count } = await db.getMasterGameCount(selectedPlayer);
      setDbGameCounts(prev => ({
        ...prev,
        [selectedPlayer]: count || 0
      }));

      setImportStatus({ 
        type: 'success', 
        message: `Imported ${data?.count || games.length} games for ${PLAYERS[selectedPlayer]?.name}` 
      });
      
      // Clear form
      setPgnContent('');
      setGameCount(0);
      setPreviewGames([]);
      
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus({ type: 'error', message: `Import failed: ${error.message}` });
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
        <h2 style={styles.title(colors)}>⚙️ Admin Panel</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!supabase && (
            <span style={{ color: colors.error, fontSize: 13 }}>⚠️ Supabase not configured</span>
          )}
          <button onClick={onClose} style={styles.closeBtn(colors)}>✕</button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Sidebar - Player Selection */}
        <div style={styles.sidebar(colors)}>
          <h3 style={styles.sidebarTitle(colors)}>BUILT-IN PLAYERS</h3>
          {Object.entries(PLAYERS).map(([id, player]) => (
            <button
              key={id}
              onClick={() => { setSelectedPlayer(id); setShowAddPlayerForm(false); }}
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
                  onClick={() => { setSelectedPlayer(id); setShowAddPlayerForm(false); }}
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
            onClick={() => setShowAddPlayerForm(true)}
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
              <p style={{ fontSize: 13, color: colors.muted, marginBottom: 20 }}>
                Create a new player profile. All data is stored in Supabase.
              </p>
              
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

                  {/* Status */}
              {importStatus && (
                <div style={styles.status(colors, importStatus.type)}>
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
                    {isLoading ? 'Importing...' : `Import ${gameCount.toLocaleString()} Games to Supabase`}
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
