/**
 * Gallery Theme - Complete App Layout
 * 
 * This is a COMPLETE replacement for the entire app UI when Gallery theme is active.
 * Features:
 * - Vertical left navigation
 * - Split-screen hero
 * - Asymmetric masonry grid for masters
 * - Custom cursor
 * - Orange accent (#FF5C00)
 * - Syne + Space Grotesk fonts
 */

import React, { useState, useEffect } from 'react';

// Gallery color palette
const GALLERY_COLORS = {
  bg: '#0C0C0C',
  bgAlt: '#111111',
  text: '#FFFFFF',
  textMuted: '#666666',
  accent: '#FF5C00',
  border: 'rgba(255,255,255,0.08)'
};

export default function GalleryLayout({
  // Data
  players,
  customPlayers,
  selectedMaster,
  masterGames,
  dbGameCounts,
  user,
  
  // Actions
  onSelectMaster,
  onSelectGame,
  onSignIn,
  onSignOut,
  onOpenSettings,
  onOpenAdmin,
  onOpenZoneMode,
  
  // Game viewer
  selectedGame,
  fen,
  moves,
  moveIndex,
  onGoToMove,
  onNextMove,
  onPrevMove,
  onFirstMove,
  onLastMove,
  onFlipBoard,
  orientation,
  
  // Board component
  BoardComponent
}) {
  const [activeSection, setActiveSection] = useState('masters'); // masters | play | zone | settings
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const allPlayers = [
    ...Object.entries(players).map(([id, p]) => ({ id, ...p })),
    ...customPlayers.map(p => ({ id: p.id, ...p, isCustom: true }))
  ];

  // Asymmetric grid sizes
  const getGridSize = (index) => {
    const sizes = [
      { col: 'span 4', row: 'span 4' },
      { col: 'span 6', row: 'span 5' },
      { col: 'span 3', row: 'span 3' },
      { col: 'span 5', row: 'span 4' },
      { col: 'span 4', row: 'span 5' },
      { col: 'span 3', row: 'span 4' },
      { col: 'span 5', row: 'span 3' },
      { col: 'span 4', row: 'span 4' },
    ];
    return sizes[index % sizes.length];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: GALLERY_COLORS.bg,
      color: GALLERY_COLORS.text,
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      {/* Custom Cursor */}
      <div 
        className="gallery-cursor"
        style={{
          position: 'fixed',
          left: cursorPos.x,
          top: cursorPos.y,
          width: cursorHover ? 60 : 20,
          height: cursorHover ? 60 : 20,
          border: `2px solid ${GALLERY_COLORS.accent}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s',
          background: cursorHover ? 'rgba(255,92,0,0.1)' : 'transparent'
        }}
      />

      {/* Vertical Left Navigation */}
      <nav style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 80,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 0',
        background: 'rgba(12,12,12,0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: `1px solid ${GALLERY_COLORS.border}`
      }}>
        {/* Logo - Vertical */}
        <div style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          fontFamily: "'Syne', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.2em',
          padding: '0 28px',
          color: GALLERY_COLORS.text
        }}>
          CHESSMASTERS
        </div>

        {/* Nav Tabs - Circular */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20
        }}>
          {[
            { id: 'masters', icon: '♛', label: 'Masters' },
            { id: 'play', icon: '♟', label: 'Play' },
            { id: 'zone', icon: '◉', label: 'Zone' },
            { id: 'settings', icon: '⚙', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'zone') onOpenZoneMode?.();
                else if (tab.id === 'settings') onOpenSettings?.();
                else setActiveSection(tab.id);
              }}
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
              title={tab.label}
              style={{
                width: 44,
                height: 44,
                background: activeSection === tab.id ? GALLERY_COLORS.accent : 'transparent',
                border: `1px solid ${activeSection === tab.id ? GALLERY_COLORS.accent : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '50%',
                color: activeSection === tab.id ? GALLERY_COLORS.text : GALLERY_COLORS.textMuted,
                fontSize: 18,
                cursor: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        {/* User / Admin */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          {user && (
            <button
              onClick={onOpenAdmin}
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
              title="Admin"
              style={{
                width: 36,
                height: 36,
                background: 'transparent',
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: '50%',
                color: GALLERY_COLORS.textMuted,
                fontSize: 14,
                cursor: 'none'
              }}
            >
              ⚡
            </button>
          )}
          <button
            onClick={user ? onSignOut : onSignIn}
            onMouseEnter={() => setCursorHover(true)}
            onMouseLeave={() => setCursorHover(false)}
            title={user ? 'Sign Out' : 'Sign In'}
            style={{
              width: 36,
              height: 36,
              background: 'transparent',
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: '50%',
              color: GALLERY_COLORS.textMuted,
              fontSize: 14,
              cursor: 'none'
            }}
          >
            {user ? '→' : '○'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ marginLeft: 80 }}>
        
        {/* MASTERS SECTION */}
        {activeSection === 'masters' && !selectedGame && (
          <>
            {/* Hero - Split Screen */}
            {!selectedMaster && (
              <section style={{
                height: '100vh',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr'
              }}>
                {/* Left - Text */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: 80
                }}>
                  <div style={{
                    fontSize: 12,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: GALLERY_COLORS.accent,
                    marginBottom: 32,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16
                  }}>
                    <span style={{ width: 40, height: 1, background: GALLERY_COLORS.accent }} />
                    LEGENDARY COLLECTION
                  </div>

                  <h1 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 'clamp(48px, 8vw, 80px)',
                    fontWeight: 800,
                    lineHeight: 0.95,
                    letterSpacing: '-0.03em',
                    marginBottom: 40
                  }}>
                    <span style={{ display: 'block' }}>STUDY THE</span>
                    <span style={{ display: 'block' }}>GREATEST</span>
                    <span style={{ display: 'block', color: GALLERY_COLORS.accent }}>MASTERS</span>
                  </h1>

                  <p style={{
                    fontSize: 18,
                    color: GALLERY_COLORS.textMuted,
                    maxWidth: 400,
                    marginBottom: 48,
                    lineHeight: 1.8
                  }}>
                    Explore curated game collections from the legends who shaped chess history. 
                    Analyze their brilliance. Learn their secrets.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <button
                      onClick={() => {
                        document.getElementById('gallery-masters-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onMouseEnter={() => setCursorHover(true)}
                      onMouseLeave={() => setCursorHover(false)}
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: GALLERY_COLORS.accent,
                        color: GALLERY_COLORS.text,
                        border: 'none',
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'none',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      EXPLORE
                    </button>

                    <span style={{
                      fontSize: 14,
                      color: GALLERY_COLORS.text,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      {allPlayers.length} Grandmasters
                      <span style={{ fontSize: 20 }}>→</span>
                    </span>
                  </div>
                </div>

                {/* Right - Featured Image */}
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: GALLERY_COLORS.bgAlt
                }}>
                  {allPlayers[0]?.imageUrl && (
                    <img
                      src={allPlayers[0].imageUrl}
                      alt="Featured Master"
                      referrerPolicy="no-referrer"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(100%)',
                        opacity: 0.7
                      }}
                    />
                  )}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(12,12,12,1) 0%, transparent 30%)'
                  }} />
                  
                  {/* Stats overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 60,
                    right: 60,
                    display: 'flex',
                    gap: 48
                  }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 48,
                        fontWeight: 700
                      }}>
                        {allPlayers.length}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: GALLERY_COLORS.textMuted,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}>
                        MASTERS
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 48,
                        fontWeight: 700
                      }}>
                        {Object.values(dbGameCounts).reduce((a, b) => a + b, 0) || '1K+'}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: GALLERY_COLORS.textMuted,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}>
                        GAMES
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Masters Grid */}
            <section 
              id="gallery-masters-grid"
              style={{
                minHeight: '100vh',
                padding: selectedMaster ? '40px 60px' : '120px 60px'
              }}
            >
              {/* Section Header */}
              {!selectedMaster && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 80
                }}>
                  <h2 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 'clamp(60px, 10vw, 120px)',
                    fontWeight: 800,
                    lineHeight: 0.9,
                    letterSpacing: '-0.03em'
                  }}>
                    <span style={{ display: 'block' }}>CHESS</span>
                    <span style={{ 
                      display: 'block',
                      WebkitTextStroke: `2px ${GALLERY_COLORS.text}`,
                      WebkitTextFillColor: 'transparent'
                    }}>MASTERS</span>
                  </h2>
                  <div style={{
                    fontSize: 14,
                    color: GALLERY_COLORS.textMuted,
                    letterSpacing: '0.2em'
                  }}>
                    {allPlayers.length} LEGENDS
                  </div>
                </div>
              )}

              {/* Back button when master selected */}
              {selectedMaster && (
                <button
                  onClick={() => onSelectMaster(null)}
                  onMouseEnter={() => setCursorHover(true)}
                  onMouseLeave={() => setCursorHover(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'transparent',
                    border: 'none',
                    color: GALLERY_COLORS.textMuted,
                    fontSize: 14,
                    marginBottom: 40,
                    cursor: 'none'
                  }}
                >
                  <span style={{ fontSize: 20 }}>←</span>
                  Back to Masters
                </button>
              )}

              {/* Asymmetric Grid */}
              {!selectedMaster && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gridAutoRows: '100px',
                  gap: 20
                }}>
                  {allPlayers.map((player, index) => {
                    const size = getGridSize(index);
                    const gameCount = dbGameCounts[player.id] || 0;

                    return (
                      <div
                        key={player.id}
                        onClick={() => onSelectMaster(player.id)}
                        onMouseEnter={() => setCursorHover(true)}
                        onMouseLeave={() => setCursorHover(false)}
                        className="gallery-card"
                        style={{
                          gridColumn: size.col,
                          gridRow: size.row,
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'none',
                          background: GALLERY_COLORS.bgAlt
                        }}
                      >
                        {player.imageUrl && (
                          <img
                            src={player.imageUrl}
                            alt={player.name}
                            referrerPolicy="no-referrer"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          />
                        )}

                        {/* Hover overlay */}
                        <div className="gallery-card-overlay" style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: 24,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                          transform: 'translateY(100%)',
                          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                          <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 24,
                            fontWeight: 700,
                            marginBottom: 4
                          }}>{player.name}</div>
                          <div style={{
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.6)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase'
                          }}>
                            {player.era || player.worldChampion || player.nationality || 'Grandmaster'}
                          </div>
                          {gameCount > 0 && (
                            <div style={{
                              marginTop: 12,
                              fontSize: 11,
                              color: GALLERY_COLORS.accent
                            }}>
                              {gameCount} games
                            </div>
                          )}
                        </div>

                        {/* Number badge */}
                        <div style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          border: '1px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'rgba(255,255,255,0.5)'
                        }}>
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Custom badge */}
                        {player.isCustom && (
                          <div style={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            padding: '4px 8px',
                            background: 'rgba(156,39,176,0.9)',
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: '0.05em'
                          }}>
                            CUSTOM
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selected Master - Games List */}
              {selectedMaster && (
                <div>
                  {/* Master Header */}
                  {(() => {
                    const master = allPlayers.find(p => p.id === selectedMaster);
                    if (!master) return null;
                    
                    return (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '300px 1fr',
                        gap: 60,
                        marginBottom: 60
                      }}>
                        {/* Image */}
                        <div style={{
                          aspectRatio: '3/4',
                          overflow: 'hidden',
                          background: GALLERY_COLORS.bgAlt
                        }}>
                          {master.imageUrl && (
                            <img
                              src={master.imageUrl}
                              alt={master.name}
                              referrerPolicy="no-referrer"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ paddingTop: 20 }}>
                          <h2 style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 64,
                            fontWeight: 800,
                            lineHeight: 0.95,
                            marginBottom: 24
                          }}>
                            {master.name?.toUpperCase()}
                          </h2>
                          
                          <div style={{
                            display: 'flex',
                            gap: 32,
                            marginBottom: 32
                          }}>
                            {master.nationality && (
                              <div>
                                <div style={{ fontSize: 12, color: GALLERY_COLORS.textMuted, marginBottom: 4 }}>NATIONALITY</div>
                                <div style={{ fontSize: 16 }}>{master.nationality}</div>
                              </div>
                            )}
                            {master.peakRating && (
                              <div>
                                <div style={{ fontSize: 12, color: GALLERY_COLORS.textMuted, marginBottom: 4 }}>PEAK RATING</div>
                                <div style={{ fontSize: 16 }}>{master.peakRating}</div>
                              </div>
                            )}
                            {master.worldChampion && (
                              <div>
                                <div style={{ fontSize: 12, color: GALLERY_COLORS.textMuted, marginBottom: 4 }}>WORLD CHAMPION</div>
                                <div style={{ fontSize: 16 }}>{master.worldChampion}</div>
                              </div>
                            )}
                          </div>

                          {master.bio && (
                            <p style={{
                              fontSize: 16,
                              color: GALLERY_COLORS.textMuted,
                              lineHeight: 1.8,
                              maxWidth: 600
                            }}>
                              {master.bio.slice(0, 300)}...
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Games List */}
                  <div>
                    <h3 style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 24,
                      fontWeight: 700,
                      marginBottom: 24,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16
                    }}>
                      <span style={{ width: 40, height: 2, background: GALLERY_COLORS.accent }} />
                      GAMES ({masterGames.length})
                    </h3>

                    {masterGames.length === 0 ? (
                      <div style={{
                        padding: 60,
                        textAlign: 'center',
                        color: GALLERY_COLORS.textMuted
                      }}>
                        No games available for this master yet.
                        <br />
                        Import games via Admin Panel.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {masterGames.map((game, i) => (
                          <div
                            key={game.id || i}
                            onClick={() => onSelectGame(game)}
                            onMouseEnter={() => setCursorHover(true)}
                            onMouseLeave={() => setCursorHover(false)}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '60px 1fr 200px 100px',
                              alignItems: 'center',
                              padding: '20px 24px',
                              background: GALLERY_COLORS.bgAlt,
                              cursor: 'none',
                              transition: 'background 0.2s'
                            }}
                          >
                            <div style={{
                              fontFamily: "'Syne', sans-serif",
                              fontSize: 20,
                              color: GALLERY_COLORS.textMuted
                            }}>
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500 }}>
                                {game.white} vs {game.black}
                              </div>
                              <div style={{ fontSize: 13, color: GALLERY_COLORS.textMuted }}>
                                {game.event || 'Game'} • {game.date || ''}
                              </div>
                            </div>
                            <div style={{ fontSize: 14, color: GALLERY_COLORS.textMuted }}>
                              {game.eco || ''}
                            </div>
                            <div style={{
                              fontFamily: "'Syne', sans-serif",
                              fontSize: 18,
                              fontWeight: 600,
                              color: game.result === '1-0' ? '#4caf50' : game.result === '0-1' ? '#f44336' : GALLERY_COLORS.textMuted
                            }}>
                              {game.result}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* GAME VIEWER */}
        {selectedGame && (
          <section style={{
            minHeight: '100vh',
            padding: '40px 60px',
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: 60
          }}>
            {/* Board */}
            <div>
              <button
                onClick={() => onSelectGame(null)}
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'transparent',
                  border: 'none',
                  color: GALLERY_COLORS.textMuted,
                  fontSize: 14,
                  marginBottom: 24,
                  cursor: 'none'
                }}
              >
                <span style={{ fontSize: 20 }}>←</span>
                Back to Games
              </button>

              <div style={{
                aspectRatio: '1',
                maxWidth: 600,
                background: GALLERY_COLORS.bgAlt
              }}>
                {BoardComponent && (
                  <BoardComponent
                    fen={fen}
                    orientation={orientation}
                    interactive={false}
                  />
                )}
              </div>

              {/* Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                marginTop: 24
              }}>
                {[
                  { icon: '⟨⟨', action: onFirstMove },
                  { icon: '⟨', action: onPrevMove },
                  { icon: '⟳', action: onFlipBoard },
                  { icon: '⟩', action: onNextMove },
                  { icon: '⟩⟩', action: onLastMove }
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    onMouseEnter={() => setCursorHover(true)}
                    onMouseLeave={() => setCursorHover(false)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'transparent',
                      border: `1px solid ${GALLERY_COLORS.border}`,
                      color: GALLERY_COLORS.text,
                      fontSize: 16,
                      cursor: 'none'
                    }}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Info */}
            <div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 8
              }}>
                {selectedGame.white} vs {selectedGame.black}
              </h2>
              <div style={{
                fontSize: 14,
                color: GALLERY_COLORS.textMuted,
                marginBottom: 32
              }}>
                {selectedGame.event} • {selectedGame.date} • {selectedGame.result}
              </div>

              {/* Moves */}
              <div style={{
                background: GALLERY_COLORS.bgAlt,
                padding: 24,
                maxHeight: 400,
                overflow: 'auto'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr 1fr',
                  gap: '4px 12px',
                  fontSize: 14
                }}>
                  {moves.filter((_, i) => i % 2 === 0).map((move, i) => (
                    <React.Fragment key={i}>
                      <div style={{ color: GALLERY_COLORS.textMuted }}>{i + 1}.</div>
                      <div
                        onClick={() => onGoToMove(i * 2 + 1)}
                        style={{
                          padding: '4px 8px',
                          background: moveIndex === i * 2 + 1 ? GALLERY_COLORS.accent : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        {move.san}
                      </div>
                      <div
                        onClick={() => moves[i * 2 + 1] && onGoToMove(i * 2 + 2)}
                        style={{
                          padding: '4px 8px',
                          background: moveIndex === i * 2 + 2 ? GALLERY_COLORS.accent : 'transparent',
                          cursor: moves[i * 2 + 1] ? 'pointer' : 'default'
                        }}
                      >
                        {moves[i * 2 + 1]?.san || ''}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PLAY SECTION */}
        {activeSection === 'play' && (
          <section style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 64,
                fontWeight: 800,
                marginBottom: 24
              }}>
                PLAY VS <span style={{ color: GALLERY_COLORS.accent }}>BOT</span>
              </h2>
              <p style={{
                fontSize: 18,
                color: GALLERY_COLORS.textMuted,
                marginBottom: 48
              }}>
                Challenge our AI opponents at various skill levels
              </p>
              <button
                onClick={() => {/* TODO: Open play vs bot */}}
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                style={{
                  padding: '20px 48px',
                  background: GALLERY_COLORS.accent,
                  border: 'none',
                  color: GALLERY_COLORS.text,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  cursor: 'none'
                }}
              >
                START GAME
              </button>
            </div>
          </section>
        )}
      </main>

      {/* CSS for hover effects */}
      <style>{`
        .gallery-card:hover img {
          transform: scale(1.1);
        }
        .gallery-card:hover .gallery-card-overlay {
          transform: translateY(0) !important;
        }
        * {
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
