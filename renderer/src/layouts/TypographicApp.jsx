/**
 * TypographicApp - Complete Typographic Theme Layout
 * 
 * Features:
 * - Massive Bebas Neue headers (200px+)
 * - Numbered player list
 * - Running marquee
 * - Grayscale to color on hover
 * - Mix-blend-mode navigation
 */

import React, { useState } from 'react';

// Typographic color palette (light background)
const COLORS = {
  bg: '#F0EDE6',
  bgAlt: '#E8E5DE',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#666666',
  accent: '#FF4D00',
  border: 'rgba(0,0,0,0.1)'
};

export default function TypographicApp({
  players,
  customPlayers,
  selectedMaster,
  masterGames,
  onSelectMaster,
  onSelectGame,
  dbGameCounts,
  activeSection,
  onSectionChange,
  onOpenSettings,
  onOpenAdmin,
  onStartZoneMode,
  user
}) {
  const allPlayers = [
    ...Object.entries(players || {}),
    ...(customPlayers || []).map(p => [p.id, p])
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Navigation - Minimal top line with mix-blend-mode */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mixBlendMode: 'difference'
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 24,
          color: '#fff',
          letterSpacing: '0.05em'
        }}>
          CHESSMASTERS
        </div>
        
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { id: 'masters', label: 'MASTERS' },
            { id: 'play', label: 'PLAY' },
            { id: 'zone', label: 'ZONE' },
            { id: 'settings', label: 'SETTINGS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'settings') onOpenSettings?.();
                else if (tab.id === 'zone') onStartZoneMode?.();
                else onSectionChange?.(tab.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                position: 'relative',
                paddingBottom: 4
              }}
            >
              {tab.label}
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: activeSection === tab.id ? '100%' : 0,
                height: 2,
                background: '#fff',
                transition: 'width 0.3s'
              }} />
            </button>
          ))}
        </div>
      </nav>

      {/* Masters Section */}
      {activeSection === 'masters' && (
        <>
          {/* Hero - Massive Typography */}
          <section style={{
            minHeight: '100vh',
            padding: '120px 40px 80px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'end'
          }}>
            <div style={{ paddingBottom: 80 }}>
              <h1 style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 'clamp(100px, 15vw, 180px)',
                lineHeight: 0.85,
                letterSpacing: '-0.02em',
                marginBottom: 40
              }}>
                <span style={{ display: 'block' }}>THE</span>
                <span style={{ display: 'block', color: COLORS.accent }}>MASTERS</span>
              </h1>
              
              <p style={{
                fontSize: 18,
                color: COLORS.textMuted,
                maxWidth: 400,
                lineHeight: 1.8,
                marginBottom: 40
              }}>
                Study the games of history's greatest chess players. 
                Every move tells a story.
              </p>
              
              <button
                onClick={() => document.getElementById('typo-list')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '16px 40px',
                  background: COLORS.text,
                  color: COLORS.bg,
                  border: 'none',
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: 18,
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}
              >
                VIEW ALL {allPlayers.length} PLAYERS →
              </button>
            </div>
            
            {/* Featured image */}
            <div style={{
              position: 'relative',
              height: '80vh'
            }}>
              {allPlayers[0]?.[1]?.imageUrl && (
                <img
                  src={allPlayers[0][1].imageUrl}
                  alt="Featured"
                  referrerPolicy="no-referrer"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)'
                  }}
                />
              )}
              <div style={{
                position: 'absolute',
                bottom: 40,
                left: 40,
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 24,
                letterSpacing: '0.05em'
              }}>
                {allPlayers[0]?.[1]?.name?.toUpperCase()}
              </div>
            </div>
          </section>

          {/* Running Marquee */}
          <div style={{
            overflow: 'hidden',
            borderTop: `1px solid ${COLORS.border}`,
            borderBottom: `1px solid ${COLORS.border}`,
            padding: '16px 0'
          }}>
            <div style={{
              display: 'flex',
              gap: 48,
              animation: 'marquee 30s linear infinite',
              whiteSpace: 'nowrap'
            }}>
              {[...allPlayers, ...allPlayers, ...allPlayers].map(([id, player], i) => (
                <span key={`${id}-${i}`} style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: 24,
                  color: COLORS.textMuted,
                  letterSpacing: '0.05em'
                }}>
                  {player.name?.toUpperCase()} •
                </span>
              ))}
            </div>
          </div>

          {/* Numbered Player List */}
          <section id="typo-list" style={{ padding: '80px 40px' }}>
            {allPlayers.map(([id, player], index) => {
              const gameCount = dbGameCounts?.[id] || 0;
              const isSelected = selectedMaster === id;
              
              return (
                <div
                  key={id}
                  onClick={() => onSelectMaster?.(id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr 200px 100px',
                    alignItems: 'center',
                    padding: '32px 0',
                    borderBottom: `1px solid ${COLORS.border}`,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255,77,0,0.05)' : 'transparent',
                    transition: 'background 0.3s'
                  }}
                  className="typo-row"
                >
                  {/* Number */}
                  <div style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: 48,
                    color: isSelected ? COLORS.accent : COLORS.textMuted
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Name & Info */}
                  <div>
                    <div style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: 36,
                      letterSpacing: '0.02em'
                    }}>
                      {player.name?.toUpperCase()}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: COLORS.textMuted,
                      letterSpacing: '0.05em'
                    }}>
                      {player.era || player.nationality || ''}
                      {player.peakRating && ` • Peak ${player.peakRating}`}
                    </div>
                  </div>

                  {/* Image */}
                  <div style={{
                    width: 120,
                    height: 80,
                    overflow: 'hidden'
                  }}>
                    {player.imageUrl && (
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        referrerPolicy="no-referrer"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: isSelected ? 'grayscale(0%)' : 'grayscale(100%)',
                          transition: 'filter 0.4s'
                        }}
                        className="typo-img"
                      />
                    )}
                  </div>

                  {/* Game count */}
                  <div style={{
                    textAlign: 'right',
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: 24,
                    color: gameCount > 0 ? COLORS.accent : COLORS.textMuted
                  }}>
                    {gameCount > 0 ? `${gameCount}G` : '—'}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Selected Master Games */}
          {selectedMaster && masterGames?.length > 0 && (
            <section style={{
              padding: '80px 40px',
              background: COLORS.bgAlt
            }}>
              <h3 style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 48,
                marginBottom: 40
              }}>
                GAMES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {masterGames.slice(0, 20).map((game, i) => (
                  <div
                    key={game.id || i}
                    onClick={() => onSelectGame?.(game)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 100px',
                      padding: '20px',
                      background: COLORS.card,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: 20,
                      color: COLORS.textMuted
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontWeight: 500 }}>
                      {game.white} vs {game.black}
                    </span>
                    <span style={{
                      textAlign: 'right',
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      color: COLORS.accent
                    }}>
                      {game.result}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Play Section */}
      {activeSection === 'play' && (
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 40px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(80px, 20vw, 200px)',
              lineHeight: 0.85,
              marginBottom: 40
            }}>
              PLAY VS<br/><span style={{ color: COLORS.accent }}>STOCKFISH</span>
            </h1>
            <button style={{
              padding: '20px 60px',
              background: COLORS.text,
              color: COLORS.bg,
              border: 'none',
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 24,
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}>
              START GAME
            </button>
          </div>
        </section>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .typo-row:hover {
          background: rgba(255,77,0,0.05) !important;
        }
        .typo-row:hover .typo-img {
          filter: grayscale(0%) !important;
        }
      `}</style>
    </div>
  );
}
