/**
 * ChessGrandmaster 2026
 * Version: 1.5.4
 * Last Updated: January 17, 2026
 * 
 * v1.5.4 - Audio Management in Admin Panel
 *   - Drag & drop audio upload in Admin Panel
 *   - Automatic ID3 tag reading (title, artist, album, artwork)
 *   - Audio stored in Supabase Storage
 *   - Track metadata in audio_tracks table
 *   - Mode assignment (zone, casual, puzzle, analysis, menu)
 *   - AudioManager loads from Supabase first, fallback to static files
 * 
 * v1.5.3 - Real Add Player Feature
 * v1.5.2 - Audio & Migration Fixes
 * v1.5.1 - Supabase Storage & Pixabay Audio
 * v1.5.0 - Admin Panel & Board Theme Fixes
 * v1.4.0 - Player Profiles with Wikipedia Images
 * v1.3.0 - Player Info System
 * v1.2.0 - Masters Database
 * v1.1.0 - Layout fixes
 * v1.0.0 - Initial release
 */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Chess } from "chess.js";
import Board from "./components/Board.jsx";
import BotSelector from "./components/BotSelector.jsx";
import PlayVsBot from "./components/PlayVsBot.jsx";
import ZoneMode from "./components/ZoneMode.jsx";
import PlayerProfile from "./components/PlayerProfile.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import { personalities } from "./engine/personalities.js";
import { FAMOUS_GAMES, GAME_CATEGORIES, getGamesByCategory, searchGames } from "./data/famousGames.js";
import { supabase, auth, db } from "./supabase.js";
import { parsePGN, MASTER_COLLECTIONS } from "./data/pgnParser.js";
import { PLAYERS, getPlayer } from "./data/playerInfo.js";
import { listBoardThemes } from "./components/cm-board/themes/boardThemes.js";

// ═══════════════════════════════════════════════════════════════════════════
// APP VERSION - Update this when deploying new versions
// ═══════════════════════════════════════════════════════════════════════════
const APP_VERSION = "1.5.4";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Inspired by Panneau, Roger Black typography
// ═══════════════════════════════════════════════════════════════════════════

const THEMES = {
  light: {
    id: "light", name: "Light",
    bg: "#FAFAF8", bgAlt: "#F5F5F3",
    card: "rgba(255, 255, 255, 0.95)", cardHover: "#fff",
    ink: "#1a1a1a", inkMuted: "#666", inkFaint: "#999",
    accent: "#1a1a1a", accentSoft: "rgba(26,26,26,0.08)",
    success: "#2E7D32", error: "#C62828",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.15)",
    shadow: "0 4px 24px rgba(0,0,0,0.06)", shadowStrong: "0 12px 48px rgba(0,0,0,0.12)",
  },
  dark: {
    id: "dark", name: "Dark",
    bg: "#141416", bgAlt: "#1c1c20",
    card: "rgba(28,28,32,0.95)", cardHover: "rgba(36,36,42,1)",
    ink: "#FAFAF8", inkMuted: "#a0a0a0", inkFaint: "#666",
    accent: "#D4AF37", accentSoft: "rgba(212,175,55,0.12)",
    success: "#4CAF50", error: "#EF5350",
    border: "rgba(255,255,255,0.06)", borderStrong: "rgba(255,255,255,0.12)",
    shadow: "0 4px 24px rgba(0,0,0,0.4)", shadowStrong: "0 12px 48px rgba(0,0,0,0.6)",
  },
  sepia: {
    id: "sepia", name: "Sepia",
    bg: "#F5F0E6", bgAlt: "#EDE5D8",
    card: "rgba(255,252,245,0.95)", cardHover: "#FFFCF5",
    ink: "#3D3429", inkMuted: "#6B5D4D", inkFaint: "#998B7A",
    accent: "#8B4513", accentSoft: "rgba(139,69,19,0.1)",
    success: "#558B2F", error: "#BF360C",
    border: "rgba(61,52,41,0.1)", borderStrong: "rgba(61,52,41,0.2)",
    shadow: "0 4px 24px rgba(61,52,41,0.08)", shadowStrong: "0 12px 48px rgba(61,52,41,0.15)",
  },
  midnight: {
    id: "midnight", name: "Midnight",
    bg: "#0D1B2A", bgAlt: "#1B263B",
    card: "rgba(27,38,59,0.95)", cardHover: "rgba(35,48,72,1)",
    ink: "#E0E1DD", inkMuted: "#8D99AE", inkFaint: "#5C677D",
    accent: "#00B4D8", accentSoft: "rgba(0,180,216,0.12)",
    success: "#06D6A0", error: "#EF476F",
    border: "rgba(224,225,221,0.06)", borderStrong: "rgba(224,225,221,0.12)",
    shadow: "0 4px 24px rgba(0,0,0,0.5)", shadowStrong: "0 12px 48px rgba(0,0,0,0.7)",
  }
};

const SOURCES = {
  classics: { id: "classics", name: "Classics", icon: "👑" },
  masters: { id: "masters", name: "Masters", icon: "🏆" },
  lichess: { id: "lichess", name: "Lichess", icon: "🐴" },
  chesscom: { id: "chesscom", name: "Chess.com", icon: "♟" },
  imported: { id: "imported", name: "My Games", icon: "📁" }
};

const LICHESS_PLAYERS = [
  { username: "DrNykterstein", name: "Magnus Carlsen" },
  { username: "Hikaru", name: "Hikaru Nakamura" },
  { username: "Firouzja2003", name: "Alireza Firouzja" },
];

const CHESSCOM_PLAYERS = [
  { username: "MagnusCarlsen", name: "Magnus Carlsen" },
  { username: "Hikaru", name: "Hikaru Nakamura" },
  { username: "GothamChess", name: "Levy Rozman" },
];

const transition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
const fonts = {
  display: '"Playfair Display", Georgia, serif',
  body: '"Inter", -apple-system, sans-serif',
  mono: '"SF Mono", monospace'
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  // ═══════════════════════════════════════════════════════════════════════════
  // ALL STATE DECLARATIONS FIRST
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Theme state
  const [themeId, setThemeId] = useState(() => localStorage.getItem("cm-theme") || "dark");
  const [boardThemeId, setBoardThemeId] = useState(() => localStorage.getItem("cm-board-theme") || "classic_wood");
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  
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
  
  // Library state
  const [source, setSource] = useState("classics");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [masterGames, setMasterGames] = useState([]);
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showPlayerProfile, setShowPlayerProfile] = useState(null); // Player ID to show profile for
  const [libraryChess] = useState(() => new Chess());
  const [libraryFen, setLibraryFen] = useState(new Chess().fen());
  const [libraryMoveIndex, setLibraryMoveIndex] = useState(0);
  const [libraryMoves, setLibraryMoves] = useState([]);
  const [libraryOrientation, setLibraryOrientation] = useState("w");
  
  // Import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importedGames, setImportedGames] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  
  // Play state
  const [selectedBotId, setSelectedBotId] = useState("carlsen");
  const [grandmasterView, setGrandmasterView] = useState("select");

  // ═══════════════════════════════════════════════════════════════════════════
  // DERIVED STATE & MEMOS
  // ═══════════════════════════════════════════════════════════════════════════
  
  const theme = THEMES[themeId] || THEMES.dark;
  const selectedBot = personalities[selectedBotId] || personalities.carlsen;

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const loadImportedGames = async (userId) => {
    try {
      const { data: gamesData, error } = await db.getImportedGames(userId);
      if (error) throw error;
      if (gamesData) {
        setImportedGames(gamesData.map(g => ({
          id: g.id, white: g.white, black: g.black, result: g.result, date: g.date, event: g.event, pgn: g.pgn
        })));
      }
    } catch (e) { console.error(e); }
  };

  const loadPreferences = async (userId) => {
    try {
      const { data: prefs } = await db.getPreferences(userId);
      if (prefs) {
        if (prefs.app_theme && THEMES[prefs.app_theme]) {
          setThemeId(prefs.app_theme);
          localStorage.setItem("cm-theme", prefs.app_theme);
        }
        if (prefs.board_theme) {
          setBoardThemeId(prefs.board_theme);
          localStorage.setItem("cm-board-theme", prefs.board_theme);
        }
      }
      setPrefsLoaded(true);
    } catch (e) { console.error(e); }
  };

  const savePrefsToSupabase = async (userId, prefs) => {
    if (!supabase || !userId) return;
    try {
      await db.savePreferences(userId, {
        app_theme: prefs.appTheme || themeId,
        board_theme: prefs.boardTheme || boardThemeId,
        updated_at: new Date().toISOString()
      });
    } catch (e) { console.error("Failed to save preferences:", e); }
  };

  const changeTheme = (newThemeId) => {
    setThemeId(newThemeId);
    localStorage.setItem("cm-theme", newThemeId);
    if (user) {
      savePrefsToSupabase(user.id, { appTheme: newThemeId });
    }
  };

  const changeBoardTheme = (newBoardThemeId) => {
    setBoardThemeId(newBoardThemeId);
    localStorage.setItem("cm-board-theme", newBoardThemeId);
    if (user) {
      savePrefsToSupabase(user.id, { boardTheme: newBoardThemeId });
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  // Theme effect
  useEffect(() => {
    localStorage.setItem("cm-theme", themeId);
    document.body.style.background = theme.bg;
    document.body.style.color = theme.ink;
  }, [themeId, theme]);

  // Auth effect
  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) { setAuthLoading(false); return; }
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        if (currentUser) {
          loadImportedGames(currentUser.id);
          loadPreferences(currentUser.id);
        }
      } catch (e) { console.error(e); }
      setAuthLoading(false);
    };
    checkUser();
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          loadImportedGames(session.user.id);
          if (event === 'SIGNED_IN') {
            loadPreferences(session.user.id);
          }
        } else {
          setImportedGames([]);
          setPrefsLoaded(false);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleSignIn = async (e) => {
    e.preventDefault(); setAuthError(null);
    try {
      const { error } = await auth.signIn(authEmail, authPassword);
      if (error) throw error;
      setShowAuthModal(false); setAuthEmail(""); setAuthPassword("");
    } catch (e) { setAuthError(e.message); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); setAuthError(null);
    try {
      const { error } = await auth.signUp(authEmail, authPassword);
      if (error) throw error;
      setAuthError("Check your email for confirmation!");
    } catch (e) { setAuthError(e.message); }
  };

  const handleSignOut = async () => { await auth.signOut(); setImportedGames([]); };

  // Library
  const searchLichess = async (query) => {
    if (!query.trim()) return;
    setLoadingGames(true); setError(null); setGames([]);
    try {
      const res = await fetch(`https://lichess.org/api/games/user/${encodeURIComponent(query)}?max=20&pgnInJson=true`, { headers: { Accept: "application/x-ndjson" } });
      if (!res.ok) throw new Error("Player not found");
      const text = await res.text();
      const parsed = text.trim().split("\n").filter(Boolean).map(line => {
        const g = JSON.parse(line);
        return {
          id: g.id, white: g.players?.white?.user?.name || "?", black: g.players?.black?.user?.name || "?",
          result: g.status === "draw" ? "½-½" : g.winner === "white" ? "1-0" : g.winner === "black" ? "0-1" : "*",
          date: new Date(g.createdAt).toLocaleDateString(), event: g.speed || "Game", pgn: g.pgn, url: `https://lichess.org/${g.id}`
        };
      });
      setGames(parsed); setCurrentPlayer(query);
    } catch (e) { setError(e.message); }
    setLoadingGames(false);
  };

  const searchChessCom = async (query) => {
    if (!query.trim()) return;
    setLoadingGames(true); setError(null); setGames([]);
    try {
      const archivesRes = await fetch(`https://api.chess.com/pub/player/${query.toLowerCase()}/games/archives`);
      if (!archivesRes.ok) throw new Error("Player not found");
      const { archives } = await archivesRes.json();
      if (!archives?.length) throw new Error("No games");
      const latestRes = await fetch(archives[archives.length - 1]);
      const { games: monthGames } = await latestRes.json();
      const parsed = monthGames.slice(-20).reverse().map(g => ({
        id: g.uuid, white: g.white?.username || "?", black: g.black?.username || "?",
        result: g.pgn?.includes("1-0") ? "1-0" : g.pgn?.includes("0-1") ? "0-1" : "½-½",
        date: new Date(g.end_time * 1000).toLocaleDateString(), event: g.time_class || "Game", pgn: g.pgn, url: g.url
      }));
      setGames(parsed); setCurrentPlayer(query);
    } catch (e) { setError(e.message); }
    setLoadingGames(false);
  };

  const handleSearch = () => {
    if (source === "classics") { setSearchResults(searchGames(searchQuery)); setSelectedCategory(null); }
    else if (source === "lichess") searchLichess(searchQuery);
    else if (source === "chesscom") searchChessCom(searchQuery);
  };

  const selectCategory = (catId) => { setSelectedCategory(catId); setSearchResults([]); setGames(getGamesByCategory(catId)); };

  const loadMaster = async (masterId) => {
    setSelectedMaster(masterId);
    setLoadingGames(true);
    setError(null);
    try {
      const collection = MASTER_COLLECTIONS[masterId];
      if (!collection) throw new Error("Unknown master");
      const response = await fetch(collection.file);
      if (!response.ok) throw new Error("Failed to load PGN");
      const text = await response.text();
      const parsed = parsePGN(text);
      setMasterGames(parsed);
      setGames(parsed);
    } catch (e) {
      console.error("Error loading master PGN:", e);
      setError("Failed to load games");
      setGames([]);
    }
    setLoadingGames(false);
  };

  useEffect(() => {
    if (source === "classics") { setGames([]); setSearchResults([]); setSelectedCategory(null); }
    else if (source === "masters") { setGames([]); setMasterGames([]); setSelectedMaster(null); }
    else if (source === "imported") { setGames(importedGames); }
    else { setGames([]); }
    setCurrentPlayer(null);
  }, [source, importedGames]);

  const selectGame = useCallback((game) => {
    if (!game?.pgn) return;
    setSelectedGame(game);
    try {
      libraryChess.reset();
      libraryChess.loadPgn(game.pgn, { strict: false });
      setLibraryMoves(libraryChess.history());
      libraryChess.reset();
      setLibraryFen(libraryChess.fen());
      setLibraryMoveIndex(0);
    } catch { setLibraryMoves([]); }
  }, [libraryChess]);

  const goToMove = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, libraryMoves.length));
    setLibraryMoveIndex(clamped);
    libraryChess.reset();
    for (let i = 0; i < clamped; i++) { try { libraryChess.move(libraryMoves[i]); } catch { break; } }
    setLibraryFen(libraryChess.fen());
  }, [libraryMoves, libraryChess]);

  const capturedPieces = useMemo(() => {
    const init = { w: { p: 8, n: 2, b: 2, r: 2, q: 1 }, b: { p: 8, n: 2, b: 2, r: 2, q: 1 } };
    const cur = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
    libraryChess.board().flat().filter(Boolean).forEach(p => { if (cur[p.color][p.type] !== undefined) cur[p.color][p.type]++; });
    return {
      byWhite: Object.entries(init.b).flatMap(([t, c]) => Array(c - cur.b[t]).fill(t)),
      byBlack: Object.entries(init.w).flatMap(([t, c]) => Array(c - cur.w[t]).fill(t))
    };
  }, [libraryFen]);

  const handleImportPGN = async () => {
    if (!importText.trim() || !user) return;
    setImportLoading(true);
    try {
      const pgnBlocks = importText.split(/\n\n(?=\[Event)/);
      const parsed = pgnBlocks.map(pgn => {
        const temp = new Chess();
        try { temp.loadPgn(pgn, { strict: false }); } catch { return null; }
        const h = temp.header();
        return { white: h.White || "?", black: h.Black || "?", result: h.Result || "*", date: h.Date, event: h.Event || "Imported", pgn };
      }).filter(Boolean);
      if (!parsed.length) throw new Error("No valid PGN");
      const { data: saved, error } = await db.saveImportedGames(user.id, parsed);
      if (error) throw error;
      if (saved) {
        setImportedGames(prev => [...saved.map(g => ({ id: g.id, white: g.white, black: g.black, result: g.result, date: g.date, event: g.event, pgn: g.pgn })), ...prev]);
      }
      setShowImportModal(false); setImportText("");
    } catch (e) { alert(e.message); }
    setImportLoading(false);
  };

  const deleteImportedGame = async (id) => {
    try {
      const { error } = await db.deleteImportedGame(id);
      if (error) throw error;
      setImportedGames(prev => prev.filter(g => g.id !== id));
      if (selectedGame?.id === id) setSelectedGame(null);
    } catch (e) { alert(e.message); }
  };

  const displayGames = source === "classics" ? (searchResults.length > 0 ? searchResults : games) : games;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink, fontFamily: fonts.body, transition }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `linear-gradient(to bottom, ${theme.bg} 0%, ${theme.bg}ee 100%)`,
        backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>♛</span>
            <span style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 500 }}>ChessGrandmaster</span>
          </div>

          <nav style={{ display: "flex", gap: 32 }}>
            {[{ id: "library", label: "Library" }, { id: "play", label: "Play" }, { id: "training", label: "Training" }].map(tab => (
              <button key={tab.id} onClick={() => tab.id === "training" ? setShowZoneMode(true) : (setActiveTab(tab.id), tab.id === "play" && setGrandmasterView("select"))}
                style={{
                  background: "none", border: "none", fontFamily: fonts.body, fontSize: 12, fontWeight: 500,
                  letterSpacing: "0.1em", textTransform: "uppercase", color: theme.ink,
                  opacity: activeTab === tab.id ? 1 : 0.5, cursor: "pointer", padding: "8px 0", position: "relative", transition,
                }}>
                {tab.label}
                {activeTab === tab.id && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: theme.accent, borderRadius: 1 }} />}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowSettings(!showSettings)} style={{
                background: theme.accentSoft, border: `1px solid ${theme.border}`, borderRadius: 8,
                padding: "8px 14px", cursor: "pointer", color: theme.ink, fontSize: 14, transition,
              }}>⚙</button>
              {showSettings && (
                <div style={{
                  position: "absolute", top: "100%", right: 0, marginTop: 8, background: theme.card,
                  border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, boxShadow: theme.shadowStrong,
                  zIndex: 200, minWidth: 220,
                }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: theme.inkMuted, marginBottom: 12 }}>APP THEME</p>
                  {Object.values(THEMES).map(t => (
                    <button key={t.id} onClick={() => { changeTheme(t.id); setShowSettings(false); }}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8, border: "none",
                        background: themeId === t.id ? theme.accentSoft : "transparent", color: theme.ink,
                        cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 500,
                        display: "flex", alignItems: "center", gap: 10, marginBottom: 4, transition,
                      }}>
                      <div style={{ width: 18, height: 18, borderRadius: 9, background: t.bg, border: `2px solid ${t.ink}` }} />
                      {t.name}
                    </button>
                  ))}
                  
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: theme.inkMuted, marginBottom: 12, marginTop: 16 }}>BOARD THEME</p>
                  <select
                    value={boardThemeId}
                    onChange={(e) => { setBoardThemeId(e.target.value); localStorage.setItem("cm-board-theme", e.target.value); }}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8, 
                      border: `1px solid ${theme.border}`, background: theme.bg, color: theme.ink,
                      fontSize: 13, cursor: "pointer", marginBottom: 8
                    }}
                  >
                    {listBoardThemes().map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  
                  <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: 12, paddingTop: 12 }}>
                    <button 
                      onClick={() => { setShowAdminPanel(true); setShowSettings(false); }}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${theme.border}`,
                        background: "transparent", color: theme.ink, cursor: "pointer", textAlign: "left", 
                        fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 10
                      }}>
                      ⚙️ Admin Panel
                    </button>
                  </div>
                </div>
              )}
            </div>
            {supabase && (
              user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: theme.inkMuted }}>{user.email?.split("@")[0]}</span>
                  <button onClick={handleSignOut} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.ink, cursor: "pointer", fontSize: 13 }}>Sign Out</button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: theme.accent, color: theme.id === "light" ? "#fff" : theme.bg, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Sign In</button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Library */}
      {activeTab === "library" && (
        <main style={{ maxWidth: 1400, margin: "0 auto", padding: 32 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${theme.border}`, paddingBottom: 16 }}>
            {Object.values(SOURCES).map(s => (
              <button key={s.id} onClick={() => setSource(s.id)}
                style={{
                  padding: "10px 20px", borderRadius: 8,
                  border: source === s.id ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
                  background: source === s.id ? theme.accentSoft : "transparent", color: theme.ink,
                  cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, transition,
                }}>
                <span>{s.icon}</span>{s.name}
              </button>
            ))}
          </div>

          {source !== "imported" && source !== "masters" && (
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <input type="text" placeholder={source === "classics" ? "Search games..." : "Enter username..."}
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.card, color: theme.ink, fontSize: 14, outline: "none" }} />
              <button onClick={handleSearch} style={{ padding: "14px 28px", borderRadius: 10, border: "none", background: theme.accent, color: theme.id === "light" ? "#fff" : theme.bg, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Search</button>
            </div>
          )}

          {source === "classics" && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {Object.entries(GAME_CATEGORIES).map(([id, cat]) => (
                <button key={id} onClick={() => selectCategory(id)}
                  style={{
                    padding: "8px 16px", borderRadius: 20,
                    border: selectedCategory === id ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
                    background: selectedCategory === id ? theme.accentSoft : "transparent", color: theme.ink, cursor: "pointer", fontSize: 12, fontWeight: 500, transition,
                  }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          )}

          {source === "masters" && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: theme.inkMuted, marginBottom: 16 }}>
                Select a grandmaster to explore their game collection and biography:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {Object.entries(PLAYERS).filter(([id]) => MASTER_COLLECTIONS[id]).map(([id, player]) => (
                  <div key={id} style={{
                    backgroundColor: theme.card,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: selectedMaster === id ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
                    transition,
                    cursor: "pointer"
                  }}>
                    {/* Player Image */}
                    <div style={{ 
                      height: 180, 
                      backgroundColor: theme.bgAlt,
                      backgroundImage: `url(${player.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center top",
                      position: "relative"
                    }}>
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "40px 16px 12px",
                        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                        color: "#fff"
                      }}>
                        <div style={{ fontSize: 20, fontWeight: "bold" }}>{player.icon} {player.name}</div>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>{player.nationality} • {player.worldChampion}</div>
                      </div>
                    </div>
                    
                    {/* Player Info */}
                    <div style={{ padding: 16 }}>
                      <div style={{ fontSize: 13, color: theme.inkMuted, marginBottom: 12, lineHeight: 1.5 }}>
                        {player.bio.split('\n\n')[0].slice(0, 150)}...
                      </div>
                      
                      {/* Stats Row */}
                      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                        {player.peakRating && (
                          <span style={{ 
                            padding: "4px 8px", 
                            backgroundColor: theme.accentSoft, 
                            borderRadius: 4, 
                            fontSize: 11,
                            color: theme.accent,
                            fontWeight: 500
                          }}>
                            Peak: {player.peakRating}
                          </span>
                        )}
                        {player.totalGames && (
                          <span style={{ 
                            padding: "4px 8px", 
                            backgroundColor: theme.accentSoft, 
                            borderRadius: 4, 
                            fontSize: 11,
                            color: theme.accent,
                            fontWeight: 500
                          }}>
                            {player.totalGames.toLocaleString()} games
                          </span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button 
                          onClick={() => loadMaster(id)}
                          style={{
                            flex: 1,
                            padding: "10px 16px",
                            borderRadius: 8,
                            border: "none",
                            background: theme.accent,
                            color: theme.id === "light" ? "#fff" : theme.bg,
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                            transition
                          }}>
                          📚 Browse Games
                        </button>
                        <button 
                          onClick={() => setShowPlayerProfile(id)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: 8,
                            border: `1px solid ${theme.border}`,
                            background: "transparent",
                            color: theme.ink,
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: 13,
                            transition
                          }}>
                          👤 Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(source === "lichess" || source === "chesscom") && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: theme.inkMuted, alignSelf: "center", marginRight: 8 }}>Quick:</span>
              {(source === "lichess" ? LICHESS_PLAYERS : CHESSCOM_PLAYERS).map(p => (
                <button key={p.username} onClick={() => { setSearchQuery(p.username); source === "lichess" ? searchLichess(p.username) : searchChessCom(p.username); }}
                  style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${theme.border}`, background: "transparent", color: theme.inkMuted, cursor: "pointer", fontSize: 12 }}>
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {source === "imported" && (
            <div style={{ marginBottom: 24 }}>
              {user ? (
                <button onClick={() => setShowImportModal(true)} style={{ padding: "14px 28px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.card, color: theme.ink, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>+ Import PGN</button>
              ) : (
                <p style={{ color: theme.inkMuted }}>Sign in to import games</p>
              )}
            </div>
          )}

          {loadingGames && <p style={{ color: theme.inkMuted }}>Loading...</p>}
          {error && <p style={{ color: theme.error }}>{error}</p>}

          {displayGames.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(auto, 450px) 300px", gap: 20 }}>
              {/* Games List */}
              <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: theme.inkMuted }}>
                  GAMES ({displayGames.length})
                </div>
                <div style={{ maxHeight: 600, overflowY: "auto" }}>
                  {displayGames.map((game, i) => (
                    <div key={game.id || i} onClick={() => selectGame(game)}
                      style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, cursor: "pointer", background: selectedGame?.id === game.id ? theme.accentSoft : "transparent", transition }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{game.title || `${game.white} vs ${game.black}`}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: game.result === "1-0" ? theme.success : game.result === "0-1" ? theme.error : theme.inkMuted }}>{game.result}</span>
                      </div>
                      <div style={{ fontSize: 12, color: theme.inkMuted }}>{game.event} {game.year || game.date}</div>
                      {source === "imported" && (
                        <button onClick={(e) => { e.stopPropagation(); deleteImportedGame(game.id); }}
                          style={{ marginTop: 8, padding: "4px 8px", fontSize: 11, borderRadius: 4, border: `1px solid ${theme.border}`, background: "transparent", color: theme.inkMuted, cursor: "pointer" }}>Delete</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Board */}
              <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ height: 24, marginBottom: 8, display: "flex", gap: 2, alignItems: "center", width: "100%", justifyContent: "center" }}>
                  {capturedPieces.byBlack.map((p, i) => <img key={i} src={`/pieces/classic/w${p.toUpperCase()}.svg`} alt="" style={{ width: 20, height: 20, opacity: 0.7 }} />)}
                </div>
                <div style={{ maxWidth: "100%", overflow: "hidden" }}>
                  <Board fen={libraryFen} orientation={libraryOrientation} onMove={() => {}} interactive={false} size={360} />
                </div>
                <div style={{ height: 24, marginTop: 8, display: "flex", gap: 2, alignItems: "center", width: "100%", justifyContent: "center" }}>
                  {capturedPieces.byWhite.map((p, i) => <img key={i} src={`/pieces/classic/b${p.toUpperCase()}.svg`} alt="" style={{ width: 20, height: 20, opacity: 0.7 }} />)}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                  {[
                    { l: "⏮", a: () => goToMove(0), d: libraryMoveIndex === 0 },
                    { l: "◀", a: () => goToMove(libraryMoveIndex - 1), d: libraryMoveIndex === 0 },
                    { l: "▶", a: () => goToMove(libraryMoveIndex + 1), d: libraryMoveIndex >= libraryMoves.length },
                    { l: "⏭", a: () => goToMove(libraryMoves.length), d: libraryMoveIndex >= libraryMoves.length },
                    { l: "↻", a: () => setLibraryOrientation(o => o === "w" ? "b" : "w") },
                  ].map((b, i) => (
                    <button key={i} onClick={b.a} disabled={b.d}
                      style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgAlt, color: theme.ink, cursor: b.d ? "default" : "pointer", opacity: b.d ? 0.4 : 1, fontSize: 14, transition }}>{b.l}</button>
                  ))}
                </div>
                {selectedGame && (
                  <button onClick={() => setShowZoneMode(true)}
                    style={{ width: "100%", marginTop: 16, padding: "14px", borderRadius: 10, border: "none", background: theme.accent, color: theme.id === "light" ? "#fff" : theme.bg, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                    🎯 Enter Zone Mode
                  </button>
                )}
              </div>

              {/* Info */}
              <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20, display: "flex", flexDirection: "column", maxHeight: 700 }}>
                {selectedGame ? (
                  <>
                    <h2 style={{ fontFamily: fonts.display, fontSize: 18, marginBottom: 4 }}>{selectedGame.title || `${selectedGame.white} vs ${selectedGame.black}`}</h2>
                    {selectedGame.description && <p style={{ fontSize: 13, color: theme.inkMuted, lineHeight: 1.6, marginBottom: 12 }}>{selectedGame.description}</p>}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                      <span style={{ fontSize: 11, padding: "4px 10px", background: theme.accentSoft, borderRadius: 4 }}>{selectedGame.event}</span>
                      <span style={{ fontSize: 11, padding: "4px 10px", background: theme.accentSoft, borderRadius: 4 }}>{selectedGame.result}</span>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: theme.inkMuted, marginBottom: 8 }}>MOVES ({libraryMoveIndex}/{libraryMoves.length})</div>
                    <div style={{ flex: 1, overflowY: "auto", background: theme.bgAlt, borderRadius: 10, padding: 12 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {libraryMoves.map((move, idx) => (
                          <span key={idx} onClick={() => goToMove(idx + 1)}
                            style={{ padding: "6px 10px", borderRadius: 6, background: idx + 1 === libraryMoveIndex ? theme.accent : "transparent", color: idx + 1 === libraryMoveIndex ? (theme.id === "light" ? "#fff" : theme.bg) : theme.ink, cursor: "pointer", fontSize: 13, transition }}>
                            {idx % 2 === 0 && <span style={{ opacity: 0.5, marginRight: 3 }}>{Math.floor(idx / 2) + 1}.</span>}{move}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: theme.inkMuted }}>Select a game</div>
                )}
              </div>
            </div>
          )}

          {displayGames.length === 0 && !loadingGames && !error && source === "classics" && !selectedCategory && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>👑</p>
              <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Explore Classic Games</p>
              <p style={{ color: theme.inkMuted }}>Select a player above or search</p>
            </div>
          )}
        </main>
      )}

      {/* Play */}
      {activeTab === "play" && grandmasterView === "select" && (
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: 32 }}>
          <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 24 }}>
            <BotSelector selectedBotId={selectedBotId} onSelect={setSelectedBotId} onPlay={() => setGrandmasterView("playing")} />
          </div>
        </main>
      )}
      {activeTab === "play" && grandmasterView === "playing" && selectedBot && (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
          <PlayVsBot profile={selectedBot} onBack={() => setGrandmasterView("select")} />
        </main>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: theme.card, borderRadius: 16, padding: 32, width: 400, border: `1px solid ${theme.border}`, position: "relative" }}>
            <button onClick={() => setShowAuthModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: theme.inkMuted, cursor: "pointer", fontSize: 20 }}>×</button>
            <h2 style={{ fontFamily: fonts.display, fontSize: 24, marginBottom: 24 }}>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>
            <form onSubmit={authMode === "login" ? handleSignIn : handleSignUp}>
              <input type="email" placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)}
                style={{ width: "100%", padding: "14px", marginBottom: 12, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgAlt, color: theme.ink, fontSize: 14 }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
                style={{ width: "100%", padding: "14px", marginBottom: 16, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgAlt, color: theme.ink, fontSize: 14 }} />
              {authError && <p style={{ color: authError.includes("Check") ? theme.success : theme.error, fontSize: 13, marginBottom: 12 }}>{authError}</p>}
              <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: theme.accent, color: theme.id === "light" ? "#fff" : theme.bg, cursor: "pointer", fontWeight: 600, marginBottom: 12 }}>
                {authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p style={{ textAlign: "center", fontSize: 13, color: theme.inkMuted }}>
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontWeight: 600 }}>
                {authMode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: theme.card, borderRadius: 16, padding: 32, width: 500, border: `1px solid ${theme.border}` }}>
            <h2 style={{ fontFamily: fonts.display, fontSize: 24, marginBottom: 16 }}>Import PGN</h2>
            <textarea placeholder="Paste PGN..." value={importText} onChange={(e) => setImportText(e.target.value)}
              style={{ width: "100%", height: 200, padding: 16, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgAlt, color: theme.ink, fontSize: 13, fontFamily: fonts.mono, resize: "none", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowImportModal(false)} style={{ flex: 1, padding: "14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.ink, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleImportPGN} disabled={importLoading || !importText.trim()} style={{ flex: 1, padding: "14px", borderRadius: 8, border: "none", background: theme.accent, color: theme.id === "light" ? "#fff" : theme.bg, cursor: "pointer", fontWeight: 600, opacity: importLoading ? 0.5 : 1 }}>
                {importLoading ? "..." : "Import"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zone Mode */}
      {showZoneMode && <ZoneMode initialGame={selectedGame} onClose={() => setShowZoneMode(false)} theme={theme} boardThemeId={boardThemeId} onBoardThemeChange={changeBoardTheme} />}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
          backdropFilter: "blur(4px)"
        }} onClick={() => setShowAdminPanel(false)}>
          <div style={{
            width: "100%",
            maxWidth: 1200,
            height: "90vh",
            backgroundColor: theme.bg,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: theme.shadowStrong
          }} onClick={e => e.stopPropagation()}>
            <AdminPanel 
              theme={theme}
              onClose={() => setShowAdminPanel(false)}
            />
          </div>
        </div>
      )}

      {/* Player Profile Modal */}
      {showPlayerProfile && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
          backdropFilter: "blur(4px)"
        }} onClick={() => setShowPlayerProfile(null)}>
          <div style={{
            width: "100%",
            maxWidth: 1100,
            maxHeight: "90vh",
            backgroundColor: theme.bg,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: theme.shadowStrong
          }} onClick={e => e.stopPropagation()}>
            <PlayerProfile 
              playerId={showPlayerProfile} 
              theme={theme.id}
              onClose={() => setShowPlayerProfile(null)}
              onSelectGame={(gameName) => {
                // Could search for the game in the database
                setShowPlayerProfile(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Version Display */}
      <div style={{
        position: "fixed",
        bottom: 8,
        right: 12,
        fontSize: 10,
        color: theme.inkFaint,
        fontFamily: fonts.mono,
        opacity: 0.6,
        pointerEvents: "none",
        zIndex: 50,
      }}>
        v{APP_VERSION}
      </div>
    </div>
  );
}
