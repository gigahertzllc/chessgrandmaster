/**
 * PlayerProfile Component
 * Displays chess master biography with Wikipedia images
 */

import React, { useState, useEffect } from 'react';
import { PLAYERS, getPlayer } from '../data/playerInfo.js';

export default function PlayerProfile({ playerId, onSelectGame, onViewGames, onClose, theme = 'dark', gameCount = null }) {
  const [player, setPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('bio');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (playerId) {
      setPlayer(getPlayer(playerId));
      setImageLoaded(false);
      setImageError(false);
    }
  }, [playerId]);

  if (!player) {
    return (
      <div style={styles.container(theme)}>
        <div style={styles.empty}>Select a player to view their profile</div>
      </div>
    );
  }

  const themeColors = {
    dark: { bg: '#1a1a2e', card: '#16213e', text: '#e8e8e8', accent: '#4a9eff', muted: '#888' },
    light: { bg: '#f5f5f5', card: '#ffffff', text: '#333', accent: '#2563eb', muted: '#666' },
    sepia: { bg: '#f4ecd8', card: '#fffef9', text: '#5c4b37', accent: '#8b6914', muted: '#8b7355' },
    midnight: { bg: '#0d1117', card: '#161b22', text: '#c9d1d9', accent: '#58a6ff', muted: '#8b949e' }
  };
  
  const colors = themeColors[theme] || themeColors.dark;

  return (
    <div style={styles.container(colors)}>
      {/* Header with close button */}
      <div style={styles.header(colors)}>
        <h2 style={styles.headerTitle(colors)}>{player.icon} {player.name}</h2>
        {onClose && (
          <button onClick={onClose} style={styles.closeBtn(colors)}>✕</button>
        )}
      </div>

      {/* Main content */}
      <div style={styles.content}>
        {/* Left: Image and quick stats */}
        <div style={styles.sidebar(colors)}>
          {/* Player Image */}
          <div style={styles.imageContainer(colors)}>
            {!imageLoaded && !imageError && (
              <div style={styles.imagePlaceholder(colors)}>
                <span style={{ fontSize: '64px' }}>{player.icon}</span>
              </div>
            )}
            {!imageError && (
              <img
                src={player.imageUrl}
                alt={player.imageAlt}
                style={{
                  ...styles.image,
                  display: imageLoaded ? 'block' : 'none'
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
            {imageError && (
              <div style={styles.imagePlaceholder(colors)}>
                <span style={{ fontSize: '64px' }}>{player.icon}</span>
              </div>
            )}
          </div>
          <div style={styles.imageCredit(colors)}>
            📷 {player.imageCredit}
          </div>

          {/* Quick Stats */}
          <div style={styles.statsCard(colors)}>
            <h3 style={styles.statsTitle(colors)}>Quick Facts</h3>
            <div style={styles.statRow(colors)}>
              <span style={styles.statLabel(colors)}>Born:</span>
              <span>{player.born}</span>
            </div>
            {player.died && (
              <div style={styles.statRow(colors)}>
                <span style={styles.statLabel(colors)}>Died:</span>
                <span>{player.died}</span>
              </div>
            )}
            <div style={styles.statRow(colors)}>
              <span style={styles.statLabel(colors)}>Birthplace:</span>
              <span>{player.birthPlace}</span>
            </div>
            <div style={styles.statRow(colors)}>
              <span style={styles.statLabel(colors)}>Nationality:</span>
              <span>{player.nationality}</span>
            </div>
            {player.peakRating && (
              <div style={styles.statRow(colors)}>
                <span style={styles.statLabel(colors)}>Peak Rating:</span>
                <span style={{ fontWeight: 'bold', color: colors.accent }}>{player.peakRating}</span>
              </div>
            )}
            <div style={styles.statRow(colors)}>
              <span style={styles.statLabel(colors)}>World Champion:</span>
              <span style={{ color: '#ffd700' }}>{player.worldChampion}</span>
            </div>
          </div>

          {/* Titles */}
          <div style={styles.titlesCard(colors)}>
            <h3 style={styles.statsTitle(colors)}>🏆 Titles</h3>
            {player.titles.map((title, i) => (
              <div key={i} style={styles.titleItem(colors)}>{title}</div>
            ))}
          </div>
        </div>

        {/* Right: Tabs with detailed content */}
        <div style={styles.mainContent(colors)}>
          {/* Tab Navigation */}
          <div style={styles.tabs(colors)}>
            {['bio', 'style', 'games', 'quotes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={styles.tab(colors, activeTab === tab)}
              >
                {tab === 'bio' && '📖 Biography'}
                {tab === 'style' && '♟️ Playing Style'}
                {tab === 'games' && '🎯 Famous Games'}
                {tab === 'quotes' && '💬 Quotes'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent(colors)}>
            {activeTab === 'bio' && (
              <div style={styles.bioContent}>
                <h3 style={styles.sectionTitle(colors)}>{player.fullName}</h3>
                {player.bio.split('\n\n').map((paragraph, i) => (
                  <p key={i} style={styles.paragraph(colors)}>{paragraph}</p>
                ))}
              </div>
            )}

            {activeTab === 'style' && (
              <div>
                <h3 style={styles.sectionTitle(colors)}>Playing Style</h3>
                <p style={styles.paragraph(colors)}>{player.playingStyle}</p>
                <div style={styles.styleCard(colors)}>
                  <div style={styles.styleIcon}>♟️</div>
                  <div style={styles.styleText(colors)}>
                    Era: {player.era}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'games' && (
              <div>
                <h3 style={styles.sectionTitle(colors)}>Famous Games</h3>
                {player.famousGames.map((game, i) => (
                  <div 
                    key={i} 
                    style={styles.gameItem(colors)}
                    onClick={() => onSelectGame && onSelectGame(game)}
                  >
                    <span style={styles.gameNumber(colors)}>{i + 1}</span>
                    <span>{game}</span>
                  </div>
                ))}
                {(gameCount > 0 || player.totalGames) && (
                  <div 
                    style={{
                      ...styles.totalGames(colors),
                      cursor: onViewGames ? 'pointer' : 'default',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => onViewGames && onViewGames(playerId)}
                    onMouseEnter={(e) => {
                      if (onViewGames) {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.backgroundColor = `${colors.accent}30`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.backgroundColor = `${colors.accent}15`;
                    }}
                  >
                    📊 {(gameCount || player.totalGames || 0).toLocaleString()} games in database
                    {onViewGames && <span style={{ marginLeft: 8, opacity: 0.7 }}>→ View Games</span>}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'quotes' && (
              <div>
                <h3 style={styles.sectionTitle(colors)}>Notable Quotes</h3>
                {player.quotes.map((quote, i) => (
                  <blockquote key={i} style={styles.quote(colors)}>
                    "{quote}"
                    <footer style={styles.quoteAuthor(colors)}>— {player.name}</footer>
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Player Selection Grid Component
export function PlayerGrid({ onSelectPlayer, theme = 'dark' }) {
  const players = Object.values(PLAYERS);
  
  const themeColors = {
    dark: { bg: '#1a1a2e', card: '#16213e', text: '#e8e8e8', accent: '#4a9eff', muted: '#888' },
    light: { bg: '#f5f5f5', card: '#ffffff', text: '#333', accent: '#2563eb', muted: '#666' },
    sepia: { bg: '#f4ecd8', card: '#fffef9', text: '#5c4b37', accent: '#8b6914', muted: '#8b7355' },
    midnight: { bg: '#0d1117', card: '#161b22', text: '#c9d1d9', accent: '#58a6ff', muted: '#8b949e' }
  };
  
  const colors = themeColors[theme] || themeColors.dark;

  return (
    <div style={styles.playerGrid}>
      {players.map(player => (
        <div
          key={player.id}
          style={styles.playerCard(colors)}
          onClick={() => onSelectPlayer(player.id)}
        >
          <div style={styles.playerCardIcon}>{player.icon}</div>
          <div style={styles.playerCardName(colors)}>{player.name}</div>
          <div style={styles.playerCardInfo(colors)}>{player.nationality}</div>
          <div style={styles.playerCardInfo(colors)}>
            {player.worldChampion}
          </div>
          {player.totalGames && (
            <div style={styles.playerCardGames(colors)}>
              {player.totalGames.toLocaleString()} games
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: (colors) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.bg,
    color: colors.text,
    borderRadius: '12px',
    overflow: 'hidden'
  }),
  
  header: (colors) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: colors.card,
    borderBottom: `1px solid ${colors.muted}33`
  }),
  
  headerTitle: (colors) => ({
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.text
  }),
  
  closeBtn: (colors) => ({
    background: 'none',
    border: 'none',
    color: colors.muted,
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s'
  }),
  
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    gap: '20px',
    padding: '20px'
  },
  
  sidebar: (colors) => ({
    width: '280px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto'
  }),
  
  imageContainer: (colors) => ({
    width: '100%',
    aspectRatio: '3/4',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: colors.card,
    border: `2px solid ${colors.accent}33`
  }),
  
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  
  imagePlaceholder: (colors) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card
  }),
  
  imageCredit: (colors) => ({
    fontSize: '11px',
    color: colors.muted,
    textAlign: 'center'
  }),
  
  statsCard: (colors) => ({
    backgroundColor: colors.card,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${colors.muted}22`
  }),
  
  statsTitle: (colors) => ({
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }),
  
  statRow: (colors) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: '13px',
    borderBottom: `1px solid ${colors.muted}15`
  }),
  
  statLabel: (colors) => ({
    color: colors.muted,
    fontWeight: '500'
  }),
  
  titlesCard: (colors) => ({
    backgroundColor: colors.card,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${colors.muted}22`
  }),
  
  titleItem: (colors) => ({
    padding: '8px 12px',
    marginBottom: '6px',
    backgroundColor: `${colors.accent}15`,
    borderRadius: '6px',
    fontSize: '12px',
    color: colors.text
  }),
  
  mainContent: (colors) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }),
  
  tabs: (colors) => ({
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap'
  }),
  
  tab: (colors, active) => ({
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    backgroundColor: active ? colors.accent : colors.card,
    color: active ? '#fff' : colors.text,
    transition: 'all 0.2s'
  }),
  
  tabContent: (colors) => ({
    flex: 1,
    overflowY: 'auto',
    backgroundColor: colors.card,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${colors.muted}22`
  }),
  
  sectionTitle: (colors) => ({
    margin: '0 0 16px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.text
  }),
  
  paragraph: (colors) => ({
    lineHeight: '1.7',
    marginBottom: '16px',
    color: colors.text
  }),
  
  bioContent: {
    maxWidth: '700px'
  },
  
  styleCard: (colors) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: `${colors.accent}10`,
    borderRadius: '8px',
    marginTop: '16px'
  }),
  
  styleIcon: {
    fontSize: '32px'
  },
  
  styleText: (colors) => ({
    fontSize: '14px',
    color: colors.text
  }),
  
  gameItem: (colors) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    marginBottom: '8px',
    backgroundColor: `${colors.accent}10`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: `1px solid transparent`
  }),
  
  gameNumber: (colors) => ({
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    color: '#fff',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: 'bold'
  }),
  
  totalGames: (colors) => ({
    marginTop: '20px',
    padding: '12px',
    backgroundColor: `${colors.accent}15`,
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
    color: colors.accent
  }),
  
  quote: (colors) => ({
    borderLeft: `4px solid ${colors.accent}`,
    paddingLeft: '20px',
    marginBottom: '20px',
    fontStyle: 'italic',
    fontSize: '16px',
    lineHeight: '1.6',
    color: colors.text
  }),
  
  quoteAuthor: (colors) => ({
    display: 'block',
    marginTop: '8px',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: colors.muted
  }),
  
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#888'
  },
  
  // Player Grid Styles
  playerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    padding: '16px'
  },
  
  playerCard: (colors) => ({
    backgroundColor: colors.card,
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: `2px solid transparent`,
    ':hover': {
      borderColor: colors.accent
    }
  }),
  
  playerCardIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  
  playerCardName: (colors) => ({
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: '4px'
  }),
  
  playerCardInfo: (colors) => ({
    fontSize: '12px',
    color: colors.muted
  }),
  
  playerCardGames: (colors) => ({
    marginTop: '8px',
    padding: '4px 8px',
    backgroundColor: `${colors.accent}20`,
    borderRadius: '4px',
    fontSize: '11px',
    color: colors.accent,
    display: 'inline-block'
  })
};
