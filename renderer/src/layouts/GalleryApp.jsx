/**
 * GalleryApp - Complete Gallery Theme Layout
 * 
 * This is a COMPLETE app layout, not just a component.
 * Features:
 * - Vertical left navigation
 * - Split-screen hero
 * - Asymmetric masonry grid for masters
 * - Custom cursor
 * - Syne + Space Grotesk fonts
 * - Orange accent (#FF5C00)
 */

import React, { useState, useEffect } from 'react';

// Gallery color palette
const COLORS = {
  bg: '#0C0C0C',
  bgAlt: '#111111',
  card: '#1A1A1A',
  text: '#FFFFFF',
  textMuted: '#666666',
  accent: '#FF5C00',
  border: 'rgba(255,255,255,0.08)'
};

export default function GalleryApp({
  // Data from hooks
  players,
  customPlayers,
  selectedMaster,
  masterGames,
  onSelectMaster,
  onSelectGame,
  dbGameCounts,
  // Navigation
  activeSection,
  onSectionChange,
  // Settings
  onOpenSettings,
  onOpenAdmin,
  onStartZoneMode,
  // Auth
  user,
  onSignIn,
  onSignOut
}) {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const allPlayers = [
    ...Object.entries(players || {}),
    ...(customPlayers || []).map(p => [p.id, p])
  ];

  // Grid size patterns for asymmetric layout
  const gridSizes = [
    { col: 'span 4', row: 'span 4' },
    { col: 'span 6', row: 'span 5' },
    { col: 'span 3', row: 'span 3' },
    { col: 'span 5', row: 'span 4' },
    { col: 'span 4', row: 'span 5' },
    { col: 'span 3', row: 'span 4' },
    { col: 'span 5', row: 'span 3' },
    { col: 'span 4', row: 'span 4' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      {/* Custom Cursor */}
      <div style={{
        width: cursorHover ? 60 : 20,
        height: cursorHover ? 60 : 20,
        border: `2px solid ${COLORS.accent}`,
        borderRadius: '50%',
        position: 'fixed',
        left: cursorPos.x,
        top: cursorPos.y,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.3s, height 0.3s',
        background: cursorHover ? 'rgba(255,92,0,0.1)' : 'transparent'
      }} />

      {/* Vertical Navigation */}
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
        background: 'rgba(12,12,12,0.9)',
        backdropFilter: 'blur(20px)',
        borderRight: `1px solid ${COLORS.border}`
      }}>
        {/* Logo - Vertical */}
        <div style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.2em',
          padding: '0 30px'
        }}>
          CHESSMASTERS
        </div>

        {/* Nav Tabs - Circular buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24
        }}>
          {[
            { id: 'masters', icon: '♔' },
            { id: 'play', icon: '▶' },
            { id: 'zone', icon: '◉' },
            { id: 'settings', icon: '⚙' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'settings') onOpenSettings?.();
                else if (tab.id === 'zone') onStartZoneMode?.();
                else onSectionChange?.(tab.id);
              }}
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
              style={{
                width: 40,
                height: 40,
                background: activeSection === tab.id ? COLORS.accent : 'transparent',
                border: `1px solid ${activeSection === tab.id ? COLORS.accent : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '50%',
                color: activeSection === tab.id ? COLORS.text : COLORS.textMuted,
                fontSize: 16,
                cursor: 'pointer',
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

        {/* Bottom - Admin */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <button
            onClick={onOpenAdmin}
            onMouseEnter={() => setCursorHover(true)}
            onMouseLeave={() => setCursorHover(false)}
            style={{
              width: 32,
              height: 32,
              background: 'transparent',
              border: 'none',
              color: COLORS.textMuted,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            ⊕
          </button>
          <div style={{
            writingMode: 'vertical-rl',
            fontSize: 11,
            color: COLORS.textMuted,
            padding: '0 30px'
          }}>
            v3.5.0
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ marginLeft: 80 }}>
        {/* Masters Section */}
        {activeSection === 'masters' && (
          <>
            {/* Hero - Split Screen */}
            <section style={{
              height: '100vh',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr'
            }}>
              {/* Left - Content */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 80
              }}>
                {/* Label */}
                <div style={{
                  fontSize: 12,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: COLORS.accent,
                  marginBottom: 32,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}>
                  <span style={{
                    width: 40,
                    height: 1,
                    background: COLORS.accent
                  }} />
                  Chess Grandmasters
                </div>

                {/* Title */}
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
                  <span style={{ display: 'block', color: COLORS.accent }}>MASTERS</span>
                </h1>

                {/* Description */}
                <p style={{
                  fontSize: 18,
                  color: COLORS.textMuted,
                  maxWidth: 400,
                  marginBottom: 48,
                  lineHeight: 1.8
                }}>
                  Explore curated game collections from the greatest players in chess history. 
                  Learn their strategies, study their brilliance.
                </p>

                {/* CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                  <button
                    onClick={() => {
                      document.getElementById('gallery-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onMouseEnter={() => setCursorHover(true)}
                    onMouseLeave={() => setCursorHover(false)}
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      background: COLORS.accent,
                      color: COLORS.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    EXPLORE
                  </button>
                  <span style={{
                    fontSize: 14,
                    color: COLORS.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    {allPlayers.length} Legends →
                  </span>
                </div>
              </div>

              {/* Right - Featured Image */}
              <div style={{
                position: 'relative',
                overflow: 'hidden'
              }}>
                {allPlayers[0]?.[1]?.imageUrl && (
                  <img
                    src={allPlayers[0][1].imageUrl}
                    alt="Featured Master"
                    referrerPolicy="no-referrer"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                {/* Gradient overlay */}
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
                      color: COLORS.textMuted,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}>
                      Masters
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 48,
                      fontWeight: 700
                    }}>
                      {Object.values(dbGameCounts || {}).reduce((a, b) => a + b, 0).toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: COLORS.textMuted,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}>
                      Games
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery Grid */}
            <section id="gallery-grid" style={{
              minHeight: '100vh',
              padding: '120px 80px'
            }}>
              {/* Section Header */}
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
                    WebkitTextStroke: `2px ${COLORS.text}`,
                    WebkitTextFillColor: 'transparent'
                  }}>MASTERS</span>
                </h2>
                <div style={{
                  fontSize: 14,
                  color: COLORS.textMuted,
                  letterSpacing: '0.2em'
                }}>
                  {allPlayers.length} LEGENDS
                </div>
              </div>

              {/* Asymmetric Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridAutoRows: '100px',
                gap: 20
              }}>
                {allPlayers.map(([id, player], index) => {
                  const size = gridSizes[index % gridSizes.length];
                  const gameCount = dbGameCounts?.[id] || 0;
                  const isSelected = selectedMaster === id;

                  return (
                    <div
                      key={id}
                      onClick={() => onSelectMaster?.(id)}
                      onMouseEnter={() => setCursorHover(true)}
                      onMouseLeave={() => setCursorHover(false)}
                      style={{
                        gridColumn: size.col,
                        gridRow: size.row,
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: COLORS.card
                      }}
                    >
                      {/* Image */}
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
                          className="gallery-img"
                        />
                      )}

                      {/* Hover Info */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 24,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                        transform: 'translateY(100%)',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} className="gallery-info">
                        <div style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 24,
                          fontWeight: 700,
                          marginBottom: 4
                        }}>
                          {player.name}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.6)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
                        }}>
                          {player.era || player.worldChampion || 'Grandmaster'}
                        </div>
                        {gameCount > 0 && (
                          <div style={{
                            marginTop: 12,
                            fontSize: 11,
                            color: COLORS.accent
                          }}>
                            {gameCount} games
                          </div>
                        )}
                      </div>

                      {/* Number */}
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

                      {/* Selection */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          border: `3px solid ${COLORS.accent}`,
                          pointerEvents: 'none'
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Selected Master Games */}
            {selectedMaster && masterGames?.length > 0 && (
              <section style={{
                padding: '80px',
                borderTop: `1px solid ${COLORS.border}`
              }}>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  marginBottom: 40
                }}>
                  {players[selectedMaster]?.name || 'Selected'} — Games
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 16
                }}>
                  {masterGames.slice(0, 20).map((game, i) => (
                    <div
                      key={game.id || i}
                      onClick={() => onSelectGame?.(game)}
                      onMouseEnter={() => setCursorHover(true)}
                      onMouseLeave={() => setCursorHover(false)}
                      style={{
                        padding: 20,
                        background: COLORS.card,
                        border: `1px solid ${COLORS.border}`,
                        cursor: 'pointer',
                        transition: 'border-color 0.3s'
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>
                        {game.white} vs {game.black}
                      </div>
                      <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                        {game.event} • {game.date} • {game.result}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Play Section Placeholder */}
        {activeSection === 'play' && (
          <section style={{
            height: '100vh',
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
                PLAY VS <span style={{ color: COLORS.accent }}>BOT</span>
              </h2>
              <p style={{ color: COLORS.textMuted, marginBottom: 40 }}>
                Challenge Stockfish at various skill levels
              </p>
              <button
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                style={{
                  padding: '20px 48px',
                  background: COLORS.accent,
                  border: 'none',
                  color: COLORS.text,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}
              >
                START GAME
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Hover styles */}
      <style>{`
        .gallery-img:hover {
          transform: scale(1.1);
        }
        *:hover > .gallery-info {
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
