/**
 * ChessGrandmaster 2026 - Refactored
 * Version: 3.0.0
 * 
 * Clean architecture with CSS-based theming.
 * Same HTML structure renders differently based on theme class.
 * 
 * Theme classes: .theme-modern or .theme-classic
 * Color mode: .dark or .light
 */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Chess } from "chess.js";
import Board from "./components/Board.jsx";
import BotSelector from "./components/BotSelector.jsx";
import PlayVsBot from "./components/PlayVsBot.jsx";
import ZoneMode from "./components/ZoneMode.jsx";
import PlayerProfile from "./components/PlayerProfile.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import { ChessCoach } from "./coaching/index.js";
import { personalities } from "./engine/personalities.js";
import { FAMOUS_GAMES, GAME_CATEGORIES, getGamesByCategory, searchGames } from "./data/famousGames.js";
import { supabase, auth, db } from "./supabase.js";
import { parsePGN, MASTER_COLLECTIONS } from "./data/pgnParser.js";
import { PLAYERS, getPlayer } from "./data/playerInfo.js";
import { getGamesByMaster } from "./data/mastersDatabase.js";
import { listBoardThemes } from "./components/cm-board/themes/boardThemes.js";
import useResponsive from "./hooks/useResponsive.js";
import "./styles/themes.css";

const APP_VERSION = "3.0.1";

// ═══════════════════════════════════════════════════════════════════════════
// THEME ICONS - Each theme has its own icon set
// ═══════════════════════════════════════════════════════════════════════════

const ICONS = {
  modern: {
    nav: { library: "📚", play: "♟️", coach: "🎓", zone: "🎯" },
    source: { classics: "👑", masters: "🏆", lichess: "🐴", chesscom: "♟", imported: "📁" },
    action: { settings: "⚙️", close: "✕", search: "🔍" },
    player: {
      morphy: "👑", steinitz: "🎩", lasker: "🧠", capablanca: "🎭", alekhine: "⚔️",
      tal: "🔮", fischer: "🦅", kasparov: "🔥", karpov: "🐍", kramnik: "🏰",
      anand: "🐅", carlsen: "🧊", caruana: "🇺🇸", ding: "🐉", modern: "⭐"
    }
  },
  classic: {
    nav: { library: "◎", play: "▶", coach: "△", zone: "◇" },
    source: { classics: "♔", masters: "★", lichess: "♞", chesscom: "♟", imported: "▤" },
    action: { settings: "Settings", close: "×", search: "Search" },
    player: {
      morphy: "I", steinitz: "II", lasker: "III", capablanca: "IV", alekhine: "V",
      tal: "VI", fischer: "VII", kasparov: "VIII", karpov: "IX", kramnik: "X",
      anand: "XI", carlsen: "XII", caruana: "XIII", ding: "XIV", modern: "◆"
    }
  }
};

const SOURCES = [
  { id: "classics", name: "Classics" },
  { id: "masters", name: "Masters" },
  { id: "lichess", name: "Lichess" },
  { id: "chesscom", name: "Chess.com" },
  { id: "imported", name: "My Games" }
];

const NAV_ITEMS = [
  { id: "library", label: "Library", classicLabel: "Library" },
  { id: "play", label: "Play", classicLabel: "Play" },
  { id: "coach", label: "Coach", classicLabel: "Learn" },
  { id: "zone", label: "Zone", classicLabel: "Focus" }
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  // Theme state
  const [skin, setSkin] = useState(() => localStorage.getItem("cm-skin") || "classic");
  const [colorMode, setColorMode] = useState(() => localStorage.getItem("cm-mode") || "dark");
  const [boardThemeId, setBoardThemeId] = useState(() => localStorage.getItem("cm-board-theme") || "classic_wood");
  
  // Responsive
  const viewport = useResponsive();
  const { isMobile, isTablet, isDesktop } = viewport;
  
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState("library");
  const [showSettings, setShowSettings] = useState(false);
  const [showZoneMode, setShowZoneMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showChessCoach, setShowChessCoach] = useState(false);
  
  // Library state
  const [source, setSource] = useState("classics");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [masterGames, setMasterGames] = useState([]);
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showPlayerProfile, setShowPlayerProfile] = useState(null);
  
  // Game viewer state
  const [libraryChess] = useState(() => new Chess());
  const [libraryFen, setLibraryFen] = useState(new Chess().fen());
  const [libraryMoveIndex, setLibraryMoveIndex] = useState(0);
  const [libraryMoves, setLibraryMoves] = useState([]);
  const [libraryOrientation, setLibraryOrientation] = useState("w");
  
  // Play state
  const [selectedBotId, setSelectedBotId] = useState("carlsen");
  const [grandmasterView, setGrandmasterView] = useState("select");

  // Derived values
  const icons = ICONS[skin] || ICONS.modern;
  const isClassic = skin === "classic";
  const themeClass = `theme-${skin} ${colorMode}`;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PERSISTENCE
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    localStorage.setItem("cm-skin", skin);
  }, [skin]);
  
  useEffect(() => {
    localStorage.setItem("cm-mode", colorMode);
  }, [colorMode]);
  
  useEffect(() => {
    localStorage.setItem("cm-board-theme", boardThemeId);
  }, [boardThemeId]);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    
    // Get initial user
    auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      setAuthLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleSignIn = async () => {
    setAuthError(null);
    try {
      const { error } = await auth.signIn(authEmail, authPassword);
      if (error) throw error;
      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
    } catch (e) {
      setAuthError(e.message);
    }
  };
  
  const handleSignUp = async () => {
    setAuthError(null);
    try {
      const { error } = await auth.signUp(authEmail, authPassword);
      if (error) throw error;
      setAuthError("Check your email for confirmation!");
    } catch (e) {
      setAuthError(e.message);
    }
  };
  
  const handleSignOut = async () => {
    await auth.signOut();
    setShowSettings(false);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LIBRARY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    if (source === "classics") {
      const results = searchGames(searchQuery);
      setGames(results);
      setSelectedCategory(null);
    } else if (source === "lichess") {
      setLoadingGames(true);
      try {
        // Fetch user games from Lichess API
        const response = await fetch(
          `https://lichess.org/api/games/user/${encodeURIComponent(searchQuery)}?max=20&pgnInJson=true`,
          { headers: { 'Accept': 'application/x-ndjson' } }
        );
        if (!response.ok) throw new Error("User not found");
        
        const text = await response.text();
        const lines = text.trim().split('\n').filter(l => l);
        const fetchedGames = lines.map((line, idx) => {
          const g = JSON.parse(line);
          return {
            id: g.id || `lichess-${idx}`,
            white: g.players?.white?.user?.name || "White",
            black: g.players?.black?.user?.name || "Black",
            whiteElo: g.players?.white?.rating,
            blackElo: g.players?.black?.rating,
            result: g.winner === "white" ? "1-0" : g.winner === "black" ? "0-1" : "1/2-1/2",
            year: new Date(g.createdAt).getFullYear(),
            event: g.perf?.charAt(0).toUpperCase() + g.perf?.slice(1) || "Game",
            opening: g.opening?.name || "",
            pgn: g.pgn
          };
        });
        setGames(fetchedGames);
      } catch (e) {
        console.error("Lichess fetch error:", e);
        setGames([]);
      }
      setLoadingGames(false);
    } else if (source === "chesscom") {
      setLoadingGames(true);
      try {
        // Chess.com requires fetching archives first
        const archivesRes = await fetch(
          `https://api.chess.com/pub/player/${encodeURIComponent(searchQuery.toLowerCase())}/games/archives`
        );
        if (!archivesRes.ok) throw new Error("User not found");
        const { archives } = await archivesRes.json();
        
        if (archives && archives.length > 0) {
          // Get most recent month
          const latestArchive = archives[archives.length - 1];
          const gamesRes = await fetch(latestArchive);
          const { games: chesscomGames } = await gamesRes.json();
          
          const fetchedGames = (chesscomGames || []).slice(-20).reverse().map((g, idx) => ({
            id: g.uuid || `chesscom-${idx}`,
            white: g.white?.username || "White",
            black: g.black?.username || "Black",
            whiteElo: g.white?.rating,
            blackElo: g.black?.rating,
            result: g.white?.result === "win" ? "1-0" : g.black?.result === "win" ? "0-1" : "1/2-1/2",
            year: new Date(g.end_time * 1000).getFullYear(),
            event: g.time_class?.charAt(0).toUpperCase() + g.time_class?.slice(1) || "Game",
            opening: g.eco ? `ECO: ${g.eco}` : "",
            pgn: g.pgn
          }));
          setGames(fetchedGames);
        }
      } catch (e) {
        console.error("Chess.com fetch error:", e);
        setGames([]);
      }
      setLoadingGames(false);
    }
  }, [searchQuery, source]);
  
  const selectCategory = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    const categoryGames = getGamesByCategory(categoryId);
    setGames(categoryGames);
    setSelectedGame(null);
  }, []);
  
  const loadMaster = useCallback((masterId) => {
    setSelectedMaster(masterId);
    const games = getGamesByMaster(masterId);
    setMasterGames(games);
  }, []);
  
  const selectGame = useCallback((game) => {
    setSelectedGame(game);
    if (game?.pgn) {
      try {
        libraryChess.loadPgn(game.pgn);
        const history = libraryChess.history();
        setLibraryMoves(history);
        libraryChess.reset();
        setLibraryFen(libraryChess.fen());
        setLibraryMoveIndex(0);
      } catch (e) {
        console.error("Failed to load game:", e);
      }
    }
  }, [libraryChess]);
  
  const goToMove = useCallback((index) => {
    libraryChess.reset();
    for (let i = 0; i <= index && i < libraryMoves.length; i++) {
      libraryChess.move(libraryMoves[i]);
    }
    setLibraryFen(libraryChess.fen());
    setLibraryMoveIndex(index);
  }, [libraryChess, libraryMoves]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Full-screen modes
  if (showZoneMode) {
    return (
      <div className={themeClass}>
        <ZoneMode
          onClose={() => setShowZoneMode(false)}
          boardThemeId={boardThemeId}
          themeId={isClassic ? "classic-dark" : colorMode}
        />
      </div>
    );
  }
  
  if (showChessCoach) {
    return (
      <div className={themeClass}>
        <ChessCoach
          onClose={() => setShowChessCoach(false)}
          boardTheme={boardThemeId}
        />
      </div>
    );
  }
  
  if (showAdminPanel) {
    return (
      <div className={themeClass}>
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          user={user}
        />
      </div>
    );
  }

  return (
    <div className={`${themeClass} app ${isMobile ? "has-mobile-nav" : ""}`}>
      
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">♛</span>
            <span className="logo-text">ChessGrandmaster</span>
          </div>
          
          {!isMobile && (
            <nav className="nav">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => {
                    if (item.id === "zone") setShowZoneMode(true);
                    else if (item.id === "coach") setShowChessCoach(true);
                    else setActiveTab(item.id);
                  }}
                >
                  {isClassic ? item.classicLabel : item.label}
                </button>
              ))}
            </nav>
          )}
          
          <div className="header-actions">
            <button className="settings-btn" onClick={() => setShowSettings(true)}>
              {icons.action.settings}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════════════════ */}
      <main className="main">
        
        {/* LIBRARY VIEW */}
        {activeTab === "library" && (
          <>
            {/* Hero (Classic only, desktop only) */}
            {!isMobile && (
              <div className="library-hero">
                <h1>Game Library</h1>
                <p>
                  Explore chess masterpieces from history's greatest players.
                  Study their strategies, learn their techniques, master their art.
                </p>
              </div>
            )}
            
            {/* Source Tabs */}
            <div className="source-tabs">
              {SOURCES.map(s => (
                <button
                  key={s.id}
                  className={`source-tab ${source === s.id ? "active" : ""}`}
                  onClick={() => setSource(s.id)}
                >
                  <span className="source-tab-icon">{icons.source[s.id]}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
            
            {/* Search Bar */}
            {source !== "imported" && source !== "masters" && (
              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder={source === "classics" ? "Search games, players, openings..." : "Enter username..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>
                  {icons.action.search}
                </button>
              </div>
            )}
            
            {/* Category Filters (Classics) */}
            {source === "classics" && (
              <div className="category-filters">
                {Object.entries(GAME_CATEGORIES).map(([id, cat]) => (
                  <button
                    key={id}
                    className={`category-btn ${selectedCategory === id ? "active" : ""}`}
                    onClick={() => selectCategory(id)}
                  >
                    <span className="category-icon">{icons.player[id]}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Loading State */}
            {loadingGames && (
              <div className="loading">Loading games...</div>
            )}
            
            {/* Game List - for classics, lichess, chesscom */}
            {!loadingGames && (source === "classics" || source === "lichess" || source === "chesscom") && games.length > 0 && (
              <div className="game-list">
                {games.map(game => (
                  <article
                    key={game.id}
                    className={`game-card ${selectedGame?.id === game.id ? "active" : ""}`}
                    onClick={() => selectGame(game)}
                  >
                    <div className="game-info">
                      <h3 className="game-title">
                        {game.title || `${game.white} vs ${game.black}`}
                      </h3>
                      <p className="game-players">{game.white} — {game.black}</p>
                    </div>
                    <div className="game-meta">
                      <span className="game-opening">{game.opening || game.event}</span>
                      <span className="game-year">{game.year}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            {/* Player Grid (Masters) */}
            {source === "masters" && (
              <>
                <div className="library-hero">
                  <h2>Chess Legends</h2>
                  <p>Curated collections from the greatest players in chess history.</p>
                </div>
                <div className="player-grid">
                  {Object.entries(PLAYERS).map(([id, player]) => {
                    const gameCount = getGamesByMaster(id).length;
                    return (
                      <article
                        key={id}
                        className={`player-card ${selectedMaster === id ? "active" : ""}`}
                        onClick={() => {
                          loadMaster(id);
                          setShowPlayerProfile(id);
                        }}
                        style={{
                          backgroundImage: player.imageUrl ? `url(${player.imageUrl})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center top'
                        }}
                      >
                        <div className="player-card-overlay">
                          <span className="player-icon">{icons.player[id] || "◆"}</span>
                          <div className="player-info">
                            <h3 className="player-name">{player.name}</h3>
                            <span className="player-era">{player.era}</span>
                            <span className="player-games">{gameCount} games</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
            
            {/* Game Viewer - shows when a game is selected */}
            {selectedGame && (
              <div className="game-viewer" style={{ marginTop: 32 }}>
                <div className="game-board-section">
                  <Board 
                    fen={libraryFen}
                    orientation={libraryOrientation}
                    size={Math.min(500, window.innerWidth - 48)}
                    themeId={boardThemeId}
                  />
                  <div className="game-controls" style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                    <button 
                      className="control-btn"
                      onClick={() => goToMove(-1)}
                      disabled={libraryMoveIndex < 0}
                    >⏮</button>
                    <button 
                      className="control-btn"
                      onClick={() => goToMove(Math.max(-1, libraryMoveIndex - 1))}
                      disabled={libraryMoveIndex < 0}
                    >◀</button>
                    <button 
                      className="control-btn"
                      onClick={() => goToMove(Math.min(libraryMoves.length - 1, libraryMoveIndex + 1))}
                      disabled={libraryMoveIndex >= libraryMoves.length - 1}
                    >▶</button>
                    <button 
                      className="control-btn"
                      onClick={() => goToMove(libraryMoves.length - 1)}
                      disabled={libraryMoveIndex >= libraryMoves.length - 1}
                    >⏭</button>
                    <button 
                      className="control-btn"
                      onClick={() => setLibraryOrientation(o => o === 'w' ? 'b' : 'w')}
                    >🔄</button>
                  </div>
                </div>
                <div className="game-info-section" style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 8 }}>{selectedGame.title || `${selectedGame.white} vs ${selectedGame.black}`}</h3>
                  <p style={{ color: 'var(--ink-muted)', marginBottom: 16 }}>
                    {selectedGame.event} • {selectedGame.year} • {selectedGame.result}
                  </p>
                  <div className="move-list" style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: 13, 
                    lineHeight: 2,
                    maxHeight: 300,
                    overflowY: 'auto'
                  }}>
                    {libraryMoves.map((move, i) => (
                      <span
                        key={i}
                        className={`move ${libraryMoveIndex === i ? 'active' : ''}`}
                        onClick={() => goToMove(i)}
                        style={{
                          cursor: 'pointer',
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: libraryMoveIndex === i ? 'var(--accent)' : 'transparent',
                          color: libraryMoveIndex === i ? 'var(--accent-text)' : 'inherit'
                        }}
                      >
                        {i % 2 === 0 ? `${Math.floor(i/2) + 1}. ` : ''}{move}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {source === "classics" && games.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">♛</div>
                <h3 className="empty-title">Select a Collection</h3>
                <p className="empty-text">Choose a player or category above to explore their games.</p>
              </div>
            )}
          </>
        )}
        
        {/* PLAY VIEW */}
        {activeTab === "play" && (
          <div>
            {grandmasterView === "select" ? (
              <BotSelector
                selectedBotId={selectedBotId}
                onSelect={setSelectedBotId}
                onPlay={() => setGrandmasterView("playing")}
              />
            ) : (
              <PlayVsBot
                profile={personalities[selectedBotId]}
                onBack={() => setGrandmasterView("select")}
              />
            )}
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE NAVIGATION
          ═══════════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <nav className="mobile-nav">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id || 
              (item.id === "zone" && showZoneMode) || 
              (item.id === "coach" && showChessCoach);
            return (
              <button
                key={item.id}
                className={`mobile-nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (item.id === "zone") setShowZoneMode(true);
                  else if (item.id === "coach") setShowChessCoach(true);
                  else setActiveTab(item.id);
                }}
              >
                <span className="mobile-nav-icon">{icons.nav[item.id]}</span>
                <span className="mobile-nav-label">
                  {isClassic ? item.classicLabel : item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SETTINGS PANEL
          ═══════════════════════════════════════════════════════════════════════ */}
      {showSettings && (
        <>
          <div className="overlay" onClick={() => setShowSettings(false)} />
          <aside className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Settings</h2>
              <button className="panel-close" onClick={() => setShowSettings(false)}>
                {icons.action.close}
              </button>
            </div>
            <div className="panel-content">
              {/* Theme Selection */}
              <div className="form-group">
                <label className="form-label">Theme</label>
                <div className="theme-buttons">
                  <button
                    className={`theme-btn ${skin === "modern" ? "active" : ""}`}
                    onClick={() => setSkin("modern")}
                  >
                    Modern
                  </button>
                  <button
                    className={`theme-btn ${skin === "classic" ? "active" : ""}`}
                    onClick={() => setSkin("classic")}
                  >
                    Classic
                  </button>
                </div>
              </div>
              
              {/* Color Mode */}
              <div className="form-group">
                <label className="form-label">Color Mode</label>
                <div className="theme-buttons">
                  <button
                    className={`theme-btn ${colorMode === "dark" ? "active" : ""}`}
                    onClick={() => setColorMode("dark")}
                  >
                    Dark
                  </button>
                  <button
                    className={`theme-btn ${colorMode === "light" ? "active" : ""}`}
                    onClick={() => setColorMode("light")}
                  >
                    Light
                  </button>
                </div>
              </div>
              
              {/* Board Theme */}
              <div className="form-group">
                <label className="form-label">Board Theme</label>
                <select
                  className="form-select"
                  value={boardThemeId}
                  onChange={(e) => setBoardThemeId(e.target.value)}
                >
                  {listBoardThemes().map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Admin Panel */}
              <button className="btn" onClick={() => { setShowAdminPanel(true); setShowSettings(false); }}>
                Admin Panel
              </button>
              
              {/* Auth */}
              {supabase && (
                user ? (
                  <button className="btn" onClick={handleSignOut}>
                    Sign Out ({user.email?.split("@")[0]})
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => { setShowAuthModal(true); setShowSettings(false); }}>
                    Sign In
                  </button>
                )
              )}
            </div>
          </aside>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          AUTH MODAL
          ═══════════════════════════════════════════════════════════════════════ */}
      {showAuthModal && (
        <>
          <div className="overlay" onClick={() => setShowAuthModal(false)} />
          <aside className="panel">
            <div className="panel-header">
              <h2 className="panel-title">{authMode === "login" ? "Sign In" : "Sign Up"}</h2>
              <button className="panel-close" onClick={() => setShowAuthModal(false)}>
                {icons.action.close}
              </button>
            </div>
            <div className="panel-content">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="search-input"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="search-input"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {authError && (
                <p style={{ color: "var(--error)", marginBottom: 16, fontSize: 14 }}>{authError}</p>
              )}
              <button
                className="btn btn-primary"
                onClick={authMode === "login" ? handleSignIn : handleSignUp}
              >
                {authMode === "login" ? "Sign In" : "Sign Up"}
              </button>
              <button
                className="btn"
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              >
                {authMode === "login" ? "Need an account? Sign Up" : "Have an account? Sign In"}
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Player Profile Modal */}
      {showPlayerProfile && (
        <PlayerProfile
          playerId={showPlayerProfile}
          onClose={() => setShowPlayerProfile(null)}
        />
      )}

      {/* Version */}
      <div style={{
        position: "fixed",
        bottom: 8,
        right: 12,
        fontSize: 10,
        color: "var(--ink-faint)",
        fontFamily: "var(--font-mono)",
        opacity: 0.6,
        pointerEvents: "none",
        zIndex: 50
      }}>
        v{APP_VERSION}
      </div>
    </div>
  );
}
