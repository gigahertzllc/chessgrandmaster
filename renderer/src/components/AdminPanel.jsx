/**
 * Admin Panel - Import games and manage player profiles
 * Access via /admin or admin button in settings
 */

import React, { useState, useEffect, useRef } from 'react';
import { PLAYERS, getPlayer } from '../data/playerInfo.js';
import { parsePGN, countGames } from '../data/pgnParser.js';

export default function AdminPanel({ theme, onClose }) {
  const [activeSection, setActiveSection] = useState('import');
  const [selectedPlayer, setSelectedPlayer] = useState('fischer');
  const [importStatus, setImportStatus] = useState(null);
  const [pgnContent, setPgnContent] = useState('');
  const [gameCount, setGameCount] = useState(0);
  const [previewGames, setPreviewGames] = useState([]);
  const [customImage, setCustomImage] = useState(null);
  const [playerOverrides, setPlayerOverrides] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cgm-player-overrides') || '{}');
    } catch { return {}; }
  });
  
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

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

  // Save overrides to localStorage
  useEffect(() => {
    localStorage.setItem('cgm-player-overrides', JSON.stringify(playerOverrides));
  }, [playerOverrides]);

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

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCustomImage(dataUrl);
      
      // Save to overrides
      setPlayerOverrides(prev => ({
        ...prev,
        [selectedPlayer]: {
          ...prev[selectedPlayer],
          customImage: dataUrl
        }
      }));
      
      setImportStatus({ type: 'success', message: 'Image uploaded successfully' });
    };
    reader.readAsDataURL(file);
  };

  // Import games to player
  const importGames = () => {
    if (!pgnContent || gameCount === 0) {
      setImportStatus({ type: 'error', message: 'No games to import' });
      return;
    }

    setImportStatus({ type: 'loading', message: 'Importing games...' });

    try {
      // Parse all games
      const games = parsePGN(pgnContent, 0); // 0 = all games
      
      // Save to localStorage (in production, this would go to a database)
      const storageKey = `cgm-games-${selectedPlayer}`;
      const existingGames = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Merge, avoiding duplicates by ID
      const existingIds = new Set(existingGames.map(g => g.id));
      const newGames = games.filter(g => !existingIds.has(g.id));
      const merged = [...existingGames, ...newGames];
      
      localStorage.setItem(storageKey, JSON.stringify(merged));
      
      // Update player game count override
      setPlayerOverrides(prev => ({
        ...prev,
        [selectedPlayer]: {
          ...prev[selectedPlayer],
          totalGames: merged.length
        }
      }));

      setImportStatus({ 
        type: 'success', 
        message: `Imported ${newGames.length} new games (${merged.length} total for ${PLAYERS[selectedPlayer]?.name})` 
      });
      
      // Clear
      setPgnContent('');
      setGameCount(0);
      setPreviewGames([]);
      
    } catch (error) {
      setImportStatus({ type: 'error', message: `Import failed: ${error.message}` });
    }
  };

  // Clear player games
  const clearPlayerGames = () => {
    if (!confirm(`Are you sure you want to clear all imported games for ${PLAYERS[selectedPlayer]?.name}?`)) {
      return;
    }
    
    localStorage.removeItem(`cgm-games-${selectedPlayer}`);
    setPlayerOverrides(prev => {
      const updated = { ...prev };
      if (updated[selectedPlayer]) {
        delete updated[selectedPlayer].totalGames;
      }
      return updated;
    });
    
    setImportStatus({ type: 'success', message: 'Games cleared' });
  };

  // Get player with overrides
  const getPlayerWithOverrides = (id) => {
    const base = PLAYERS[id];
    const overrides = playerOverrides[id] || {};
    return { ...base, ...overrides };
  };

  const currentPlayer = getPlayerWithOverrides(selectedPlayer);

  return (
    <div style={styles.container(colors)}>
      {/* Header */}
      <div style={styles.header(colors)}>
        <h2 style={styles.title(colors)}>⚙️ Admin Panel</h2>
        <button onClick={onClose} style={styles.closeBtn(colors)}>✕</button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Sidebar - Player Selection */}
        <div style={styles.sidebar(colors)}>
          <h3 style={styles.sidebarTitle(colors)}>Select Player</h3>
          {Object.entries(PLAYERS).map(([id, player]) => (
            <button
              key={id}
              onClick={() => setSelectedPlayer(id)}
              style={styles.playerBtn(colors, selectedPlayer === id)}
            >
              <span style={{ fontSize: 20 }}>{player.icon}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{player.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  {playerOverrides[id]?.totalGames || player.totalGames || 0} games
                </div>
              </div>
            </button>
          ))}
          
          <div style={{ marginTop: 20, padding: 12, borderTop: `1px solid ${colors.border}` }}>
            <button
              onClick={() => {
                if (confirm('Add a new player profile?')) {
                  alert('New player creation will be available in v1.5.0');
                }
              }}
              style={styles.addPlayerBtn(colors)}
            >
              + Add New Player
            </button>
          </div>
        </div>

        {/* Main Panel */}
        <div style={styles.mainPanel(colors)}>
          {/* Section Tabs */}
          <div style={styles.tabs(colors)}>
            {[
              { id: 'import', label: '📥 Import Games', icon: '📥' },
              { id: 'profile', label: '👤 Edit Profile', icon: '👤' },
              { id: 'image', label: '🖼️ Custom Image', icon: '🖼️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                style={styles.tab(colors, activeSection === tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

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
                <div style={{ fontSize: 13, opacity: 0.7 }}>or drag and drop</div>
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
                  <button onClick={importGames} style={styles.importBtn(colors)}>
                    Import {gameCount.toLocaleString()} Games
                  </button>
                </div>
              )}

              {/* Current Games */}
              <div style={styles.currentGames(colors)}>
                <h4 style={{ margin: '0 0 8px 0' }}>Current Games</h4>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  {currentPlayer.name} has {(playerOverrides[selectedPlayer]?.totalGames || currentPlayer.totalGames || 0).toLocaleString()} games in the database.
                </p>
                <button onClick={clearPlayerGames} style={styles.clearBtn(colors)}>
                  Clear All Games
                </button>
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
                  onChange={(e) => setPlayerOverrides(prev => ({
                    ...prev,
                    [selectedPlayer]: { ...prev[selectedPlayer], fullName: e.target.value }
                  }))}
                  style={styles.input(colors)}
                />
              </div>

              <div style={styles.formGroup(colors)}>
                <label style={styles.label(colors)}>Bio</label>
                <textarea
                  defaultValue={currentPlayer.bio}
                  rows={6}
                  onChange={(e) => setPlayerOverrides(prev => ({
                    ...prev,
                    [selectedPlayer]: { ...prev[selectedPlayer], bio: e.target.value }
                  }))}
                  style={styles.textarea(colors)}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Born</label>
                  <input
                    type="text"
                    defaultValue={currentPlayer.born}
                    onChange={(e) => setPlayerOverrides(prev => ({
                      ...prev,
                      [selectedPlayer]: { ...prev[selectedPlayer], born: e.target.value }
                    }))}
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>Died</label>
                  <input
                    type="text"
                    defaultValue={currentPlayer.died || ''}
                    placeholder="Still active"
                    onChange={(e) => setPlayerOverrides(prev => ({
                      ...prev,
                      [selectedPlayer]: { ...prev[selectedPlayer], died: e.target.value || null }
                    }))}
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
                    onChange={(e) => setPlayerOverrides(prev => ({
                      ...prev,
                      [selectedPlayer]: { ...prev[selectedPlayer], peakRating: parseInt(e.target.value) || null }
                    }))}
                    style={styles.input(colors)}
                  />
                </div>
                <div style={styles.formGroup(colors)}>
                  <label style={styles.label(colors)}>World Champion</label>
                  <input
                    type="text"
                    defaultValue={currentPlayer.worldChampion || ''}
                    onChange={(e) => setPlayerOverrides(prev => ({
                      ...prev,
                      [selectedPlayer]: { ...prev[selectedPlayer], worldChampion: e.target.value }
                    }))}
                    style={styles.input(colors)}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setImportStatus({ type: 'success', message: 'Profile saved' });
                  setTimeout(() => setImportStatus(null), 2000);
                }}
                style={styles.saveBtn(colors)}
              >
                💾 Save Profile
              </button>
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
                    src={playerOverrides[selectedPlayer]?.customImage || currentPlayer.imageUrl}
                    alt={currentPlayer.name}
                    style={styles.previewImg}
                    onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
                  />
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
                    {playerOverrides[selectedPlayer]?.customImage ? 'Custom image' : 'Wikipedia image'}
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
                    <div style={{ fontSize: 13, opacity: 0.7 }}>PNG, JPG, or WebP</div>
                  </div>

                  {playerOverrides[selectedPlayer]?.customImage && (
                    <button
                      onClick={() => {
                        setPlayerOverrides(prev => {
                          const updated = { ...prev };
                          if (updated[selectedPlayer]) {
                            delete updated[selectedPlayer].customImage;
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
  
  addPlayerBtn: (colors) => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px dashed ${colors.border}`,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: colors.muted,
    cursor: 'pointer',
    fontSize: 13
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
  
  saveBtn: (colors) => ({
    padding: '12px 24px',
    border: 'none',
    borderRadius: 8,
    backgroundColor: colors.accent,
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14
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
