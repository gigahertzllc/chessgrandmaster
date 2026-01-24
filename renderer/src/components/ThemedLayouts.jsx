/**
 * ChessGrandmaster 2026 - Themed Masters Layouts
 * Each theme has a completely unique layout structure
 * Inspired by CSS Zen Garden approach
 */

import React from "react";

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY THEME LAYOUT - Vertical nav, asymmetric grid, experimental
// ═══════════════════════════════════════════════════════════════════════════

export function GalleryMastersLayout({ 
  players, 
  customPlayers, 
  selectedMaster, 
  onSelectMaster,
  onShowBiography,
  theme,
  dbGameCounts 
}) {
  // Gallery uses asymmetric masonry-style grid
  // Large featured cards mixed with smaller ones
  const allPlayers = [...Object.entries(players), ...customPlayers.map(p => [p.id, p])];
  
  return (
    <div className="gallery-masters">
      {/* Gallery Header - Massive split typography */}
      <div className="gallery-header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 80,
        paddingRight: 40
      }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(60px, 10vw, 120px)",
          fontWeight: 800,
          lineHeight: 0.9,
          letterSpacing: "-0.03em"
        }}>
          <span style={{ display: "block" }}>CHESS</span>
          <span style={{ 
            display: "block",
            WebkitTextStroke: `2px ${theme.ink}`,
            WebkitTextFillColor: "transparent"
          }}>MASTERS</span>
        </h1>
        <div style={{
          fontSize: 14,
          color: theme.inkMuted,
          letterSpacing: "0.2em",
          textTransform: "uppercase"
        }}>
          {allPlayers.length} LEGENDS
        </div>
      </div>

      {/* Gallery Grid - Asymmetric layout */}
      <div className="gallery-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridAutoRows: "100px",
        gap: 20
      }}>
        {allPlayers.map(([id, player], index) => {
          // Vary sizes for visual interest
          const sizes = [
            { col: "span 4", row: "span 4" },  // Medium
            { col: "span 6", row: "span 5" },  // Large
            { col: "span 3", row: "span 3" },  // Small
            { col: "span 5", row: "span 4" },  // Medium-wide
            { col: "span 4", row: "span 5" },  // Tall
          ];
          const size = sizes[index % sizes.length];
          const gameCount = dbGameCounts[id] || 0;
          
          return (
            <div
              key={id}
              className={`gallery-item ${selectedMaster === id ? 'active' : ''}`}
              onClick={() => onSelectMaster(id)}
              style={{
                gridColumn: size.col,
                gridRow: size.row,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                background: theme.card
              }}
            >
              {player.imageUrl && (
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              
              {/* Hover overlay with info */}
              <div className="gallery-item-info" style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 24,
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                transform: "translateY(100%)",
                transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 4,
                  color: "#fff"
                }}>{player.name}</div>
                <div style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12
                }}>
                  {player.era || player.worldChampion || "Grandmaster"}
                </div>
                
                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectMaster(id); }}
                    style={{
                      padding: "8px 16px",
                      background: theme.accent,
                      border: "none",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {gameCount > 0 ? `${gameCount} Games` : "View Games"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onShowBiography(id); }}
                    style={{
                      padding: "8px 16px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "#fff",
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    Biography
                  </button>
                </div>
              </div>

              {/* Number indicator */}
              <div style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: `1px solid rgba(255,255,255,0.2)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)"
              }}>
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Selection indicator */}
              {selectedMaster === id && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  border: `3px solid ${theme.accent}`,
                  pointerEvents: "none"
                }} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        .gallery-item:hover .gallery-item-info {
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHIC THEME LAYOUT - Bold type, numbered list, horizontal scroll
// ═══════════════════════════════════════════════════════════════════════════

export function TypographicMastersLayout({ 
  players, 
  customPlayers, 
  selectedMaster, 
  onSelectMaster,
  onShowBiography,
  theme,
  dbGameCounts 
}) {
  const allPlayers = [...Object.entries(players), ...customPlayers.map(p => [p.id, p])];
  const isLight = theme.id?.includes('light');
  
  return (
    <div className="typo-masters">
      {/* Massive Section Title */}
      <div style={{
        marginBottom: 60,
        overflow: "hidden"
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: "clamp(80px, 15vw, 200px)",
          lineHeight: 0.85,
          letterSpacing: "-0.02em",
          color: theme.ink
        }}>
          THE <span style={{ color: theme.accent }}>MASTERS</span>
        </h1>
      </div>

      {/* Running Marquee */}
      <div style={{
        overflow: "hidden",
        marginBottom: 60,
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        padding: "16px 0"
      }}>
        <div className="typo-marquee" style={{
          display: "flex",
          gap: 48,
          animation: "marquee 30s linear infinite",
          whiteSpace: "nowrap"
        }}>
          {[...allPlayers, ...allPlayers].map(([id, player], i) => (
            <span key={`${id}-${i}`} style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 24,
              color: theme.inkMuted,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              {player.name} •
            </span>
          ))}
        </div>
      </div>

      {/* Numbered Player List */}
      <div className="typo-player-list">
        {allPlayers.map(([id, player], index) => {
          const gameCount = dbGameCounts[id] || 0;
          const isSelected = selectedMaster === id;
          
          return (
            <div
              key={id}
              className={`typo-player-row ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectMaster(id)}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 200px 180px",
                alignItems: "center",
                padding: "32px 0",
                borderBottom: `1px solid ${theme.border}`,
                cursor: "pointer",
                transition: "all 0.3s",
                background: isSelected ? theme.accentSoft : "transparent"
              }}
            >
              {/* Number */}
              <div style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 48,
                color: isSelected ? theme.accent : theme.inkMuted,
                fontWeight: 400
              }}>
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Name & Info */}
              <div>
                <div style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: 36,
                  letterSpacing: "0.02em",
                  marginBottom: 4
                }}>
                  {player.name.toUpperCase()}
                </div>
                <div style={{
                  fontSize: 13,
                  color: theme.inkMuted,
                  letterSpacing: "0.05em"
                }}>
                  {player.era || player.nationality || ""}
                  {player.peakRating && ` • Peak ${player.peakRating}`}
                </div>
              </div>

              {/* Image */}
              <div style={{
                width: 120,
                height: 80,
                overflow: "hidden",
                filter: isSelected ? "grayscale(0%)" : "grayscale(100%)",
                transition: "filter 0.4s"
              }}>
                {player.imageUrl && (
                  <img
                    src={player.imageUrl}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onSelectMaster(id); }}
                  style={{
                    padding: "8px 16px",
                    background: theme.accent,
                    border: "none",
                    color: "#fff",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 14,
                    letterSpacing: "0.05em",
                    cursor: "pointer"
                  }}
                >
                  {gameCount > 0 ? `${gameCount}G` : "GAMES"}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onShowBiography(id); }}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    border: `1px solid ${theme.border}`,
                    color: theme.ink,
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 14,
                    letterSpacing: "0.05em",
                    cursor: "pointer"
                  }}
                >
                  BIO
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .typo-player-row:hover {
          background: ${theme.accentSoft} !important;
        }
        .typo-player-row:hover img {
          filter: grayscale(0%) !important;
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// EDITORIAL THEME LAYOUT - Magazine style, vertical cards, elegant typography
// ═══════════════════════════════════════════════════════════════════════════

export function EditorialMastersLayout({ 
  players, 
  customPlayers, 
  selectedMaster, 
  onSelectMaster,
  onShowBiography,
  theme,
  dbGameCounts 
}) {
  const allPlayers = [...Object.entries(players), ...customPlayers.map(p => [p.id, p])];
  
  return (
    <div className="editorial-masters">
      {/* Editorial Header */}
      <div style={{
        textAlign: "center",
        marginBottom: 80,
        padding: "40px 0"
      }}>
        <div style={{
          fontSize: 14,
          color: theme.inkMuted,
          marginBottom: 16,
          textTransform: "uppercase",
          letterSpacing: "0.15em"
        }}>
          The Definitive Collection
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(48px, 8vw, 72px)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginBottom: 16
        }}>
          Chess <span style={{
            background: `linear-gradient(90deg, ${theme.accent}, #E8D48A)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Grandmasters</span>
        </h1>
        <p style={{
          fontSize: 18,
          color: theme.inkMuted,
          maxWidth: 500,
          margin: "0 auto",
          lineHeight: 1.6
        }}>
          Explore the brilliant minds who shaped the royal game through centuries of innovation.
        </p>
      </div>

      {/* Editorial Card Grid - 3:4 aspect ratio vertical cards */}
      <div className="editorial-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 24
      }}>
        {allPlayers.map(([id, player], index) => {
          const gameCount = dbGameCounts[id] || 0;
          const isSelected = selectedMaster === id;
          
          return (
            <div
              key={id}
              className={`editorial-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectMaster(id)}
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                borderRadius: 20,
                overflow: "hidden",
                cursor: "pointer",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {/* Background Image */}
              <div className="editorial-card-image" style={{
                position: "absolute",
                inset: 0
              }}>
                {player.imageUrl ? (
                  <img
                    src={player.imageUrl}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)",
                      transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    background: theme.bgAlt,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <span style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 120,
                      color: theme.border,
                      fontWeight: 600
                    }}>
                      {player.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Gradient overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)",
                opacity: 0,
                transition: "opacity 0.4s"
              }} className="editorial-card-overlay" />

              {/* Info (shows on hover) */}
              <div className="editorial-card-info" style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 30,
                opacity: 0,
                transform: "translateY(20px)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 4
                }}>
                  {player.name}
                </div>
                <div style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 16
                }}>
                  {player.worldChampion ? `World Champion ${player.worldChampion}` : 
                   player.era || player.nationality || "Grandmaster"}
                </div>
                
                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectMaster(id); }}
                    style={{
                      padding: "8px 16px",
                      background: theme.accent,
                      border: "none",
                      borderRadius: 20,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {gameCount > 0 ? `${gameCount} Games` : "View Games"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onShowBiography(id); }}
                    style={{
                      padding: "8px 16px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 20,
                      color: "#fff",
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    Biography
                  </button>
                </div>
              </div>

              {/* Large initial letter watermark */}
              <div style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 180,
                fontWeight: 700,
                color: "rgba(255,255,255,0.03)",
                lineHeight: 1,
                pointerEvents: "none"
              }}>
                {player.name.charAt(0)}
              </div>

              {/* Selection border */}
              {isSelected && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  border: `3px solid ${theme.accent}`,
                  borderRadius: 20,
                  pointerEvents: "none"
                }} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .editorial-card:hover {
          transform: scale(1.02) !important;
          z-index: 10;
        }
        .editorial-card:hover .editorial-card-image img {
          filter: grayscale(0%) !important;
          transform: scale(1.1);
        }
        .editorial-card:hover .editorial-card-overlay {
          opacity: 1 !important;
        }
        .editorial-card:hover .editorial-card-info {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// CLASSIC THEME LAYOUT - The existing vertical card layout
// ═══════════════════════════════════════════════════════════════════════════

export function ClassicMastersLayout({ 
  players, 
  customPlayers, 
  selectedMaster, 
  onSelectMaster,
  onShowBiography,
  theme,
  dbGameCounts,
  isMobile,
  isTablet 
}) {
  const allPlayers = [...Object.entries(players), ...customPlayers.map(p => [p.id, p])];
  
  return (
    <div className="classic-masters">
      {/* Classic Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ 
          fontFamily: "'Playfair Display', Georgia, serif", 
          fontSize: isMobile ? 20 : 24, 
          marginBottom: 8, 
          color: theme.ink 
        }}>
          Chess Legends
        </h2>
        <p style={{ 
          fontSize: isMobile ? 13 : 14, 
          color: theme.inkMuted, 
          maxWidth: 600, 
          lineHeight: 1.5 
        }}>
          Explore curated game collections from the greatest players in chess history.
        </p>
      </div>

      {/* Classic Grid - Vertical 3:4 cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        gap: isMobile ? 12 : 20
      }}>
        {allPlayers.map(([id, player]) => {
          const gameCount = dbGameCounts[id] || 0;
          const isSelected = selectedMaster === id;
          
          return (
            <div
              key={id}
              className={`classic-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectMaster(id)}
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                backgroundColor: theme.card,
                overflow: "hidden",
                border: isSelected ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
                cursor: "pointer",
                transition: "border-color 0.3s ease"
              }}
            >
              {/* Full background image */}
              {player.imageUrl && (
                <img
                  className="classic-card-img"
                  src={player.imageUrl}
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    filter: "grayscale(100%)",
                    transition: "filter 0.3s ease"
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}

              {/* Gradient overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                zIndex: 1
              }} />

              {/* Info at bottom */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: isMobile ? 12 : 16,
                zIndex: 2
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: isMobile ? 14 : 18,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 4
                }}>
                  {player.name}
                </div>
                <div style={{
                  fontSize: isMobile ? 10 : 12,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 12
                }}>
                  {player.era || player.worldChampion || "Grandmaster"}
                </div>
                
                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectMaster(id); }}
                    style={{
                      flex: 1,
                      padding: isMobile ? "6px 10px" : "8px 12px",
                      background: theme.accent,
                      border: "none",
                      color: "#fff",
                      fontSize: isMobile ? 10 : 11,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {gameCount > 0 ? `${gameCount} Games` : "Games"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onShowBiography(id); }}
                    style={{
                      padding: isMobile ? "6px 10px" : "8px 12px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "#fff",
                      fontSize: isMobile ? 10 : 11,
                      cursor: "pointer"
                    }}
                  >
                    Bio
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .classic-card:hover {
          border-color: ${theme.accent}60 !important;
        }
        .classic-card:hover .classic-card-img {
          filter: grayscale(0%) !important;
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MODERN THEME LAYOUT - Horizontal cards (original default)
// ═══════════════════════════════════════════════════════════════════════════

export function ModernMastersLayout({ 
  players, 
  customPlayers, 
  selectedMaster, 
  onSelectMaster,
  onShowBiography,
  theme,
  dbGameCounts,
  isMobile,
  isTablet 
}) {
  const allPlayers = [...Object.entries(players), ...customPlayers.map(p => [p.id, p])];
  
  return (
    <div className="modern-masters">
      {/* Modern Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ 
          fontFamily: "'Playfair Display', Georgia, serif", 
          fontSize: isMobile ? 20 : 24, 
          marginBottom: 8, 
          color: theme.ink 
        }}>
          Chess Legends
        </h2>
        <p style={{ 
          fontSize: isMobile ? 13 : 14, 
          color: theme.inkMuted, 
          maxWidth: 600, 
          lineHeight: 1.5 
        }}>
          Explore curated game collections from the greatest players in chess history.
        </p>
      </div>

      {/* Modern Grid - Horizontal cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(auto-fill, minmax(280px, 1fr))" : "repeat(auto-fill, minmax(320px, 1fr))",
        gap: isMobile ? 12 : 20
      }}>
        {allPlayers.map(([id, player]) => {
          const gameCount = dbGameCounts[id] || 0;
          const isSelected = selectedMaster === id;
          
          return (
            <div
              key={id}
              className={`modern-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectMaster(id)}
              style={{
                backgroundColor: theme.card,
                borderRadius: isMobile ? 12 : 16,
                overflow: "hidden",
                border: isSelected ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
                transition: "all 0.2s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Top Section - Image + Basic Info */}
              <div style={{ 
                display: "flex", 
                height: isMobile ? 100 : 140 
              }}>
                {/* Player Image */}
                <div style={{ 
                  width: isMobile ? 100 : 140,
                  minWidth: isMobile ? 100 : 140,
                  backgroundColor: theme.bgAlt,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {player.imageUrl ? (
                    <img 
                      src={player.imageUrl}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top"
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ 
                      width: isMobile ? 50 : 70, 
                      height: isMobile ? 50 : 70, 
                      borderRadius: "50%", 
                      background: theme.accentSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMobile ? 20 : 28,
                      color: theme.accent
                    }}>
                      {player.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* Quick Info */}
                <div style={{ 
                  flex: 1, 
                  padding: isMobile ? 12 : 16, 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center" 
                }}>
                  <h3 style={{ 
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: isMobile ? 16 : 20, 
                    fontWeight: 600, 
                    marginBottom: 4,
                    color: theme.ink 
                  }}>
                    {player.name}
                  </h3>
                  <div style={{ 
                    fontSize: isMobile ? 11 : 12, 
                    color: theme.inkMuted, 
                    marginBottom: 8 
                  }}>
                    {player.era || player.worldChampion || "Grandmaster"}
                  </div>
                  {gameCount > 0 && (
                    <div style={{
                      fontSize: isMobile ? 10 : 11,
                      color: theme.accent,
                      fontWeight: 500
                    }}>
                      {gameCount} games available
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom Section - Bio + Actions */}
              <div style={{ 
                padding: isMobile ? 12 : 16, 
                borderTop: `1px solid ${theme.border}`, 
                display: "flex", 
                flexDirection: "column" 
              }}>
                {/* Bio Excerpt */}
                <p style={{ 
                  fontSize: isMobile ? 12 : 13, 
                  color: theme.inkMuted, 
                  lineHeight: 1.5, 
                  marginBottom: 12,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {player.bio?.slice(0, 120) || "Explore this chess legend's games."}...
                </p>
                
                {/* Action Row */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectMaster(id); }}
                    style={{ 
                      flex: 1,
                      padding: isMobile ? "8px 12px" : "10px 16px", 
                      borderRadius: 8, 
                      border: "none", 
                      background: theme.accent, 
                      color: theme.id === "light" ? "#fff" : theme.bg, 
                      cursor: "pointer",
                      fontWeight: 600, 
                      fontSize: isMobile ? 12 : 13
                    }}>
                    View Games
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onShowBiography(id); }}
                    style={{ 
                      padding: isMobile ? "8px 12px" : "10px 16px", 
                      borderRadius: 8, 
                      border: `1px solid ${theme.border}`, 
                      background: "transparent", 
                      color: theme.ink, 
                      cursor: "pointer",
                      fontWeight: 500, 
                      fontSize: isMobile ? 12 : 13
                    }}>
                    Biography
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .modern-card:hover {
          border-color: ${theme.accent}60 !important;
          transform: translateY(-2px);
          box-shadow: ${theme.shadow};
        }
      `}</style>
    </div>
  );
}
