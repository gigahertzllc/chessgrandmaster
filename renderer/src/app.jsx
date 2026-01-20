/**
 * ChessGrandmaster 2026
 * Version: 2.4.2
 * Last Updated: January 20, 2026
 * 
 * v2.4.2 - Clickable Game Count in Profile
 *   - Game count in bio's "Famous Games" tab is now clickable
 *   - Clicking "X games in database → View Games" navigates to Masters section
 *   - Shows real game count from Supabase database
 *   - Falls back to local game count if not in database
 *   - Loads game counts on initial mount for all built-in players
 *
 * v2.4.1 - Image Management Fixes
 *   - Fixed "Fetch Image from Wikipedia" button with proper error handling
 *   - Added console logging for debugging image operations
 *   - Works for both custom players (updates DB) and built-in (uses overrides)
 *   - Better image preview with placeholder when no image set
 *   - Shows truncated URL for debugging
 *   - Added updateCustomPlayerImage() for cleaner image-only updates
 *
 * v2.4.0 - Distinct 3D Chess Sets
 *   - 6 unique geometry styles: Staunton, Modern, Medieval, Baroque, Abstract, Lewis
 *   - 9 material+geometry combinations with visually distinct pieces
 *   - Medieval Castle set with fortress-like chunky pieces
 *   - Lewis Viking set inspired by historic Lewis Chessmen
 *   - Abstract Geometric set with angular obelisk shapes
 *   - Each set has dramatically different piece silhouettes
 *
 * v2.3.0 - Zone Mode Fixes
 *   - Music now auto-starts when entering Zone Mode
 *   - 3D board defaults to Top Down view
 *   - Fixed 3D board orientation (white at bottom)
 *   - 3D piece sets now properly change when selected
 *   - Fixed Board3D key to include all relevant state
 *
 * v2.2.0 - Seamless Player Management
 *   - One-click "Add" from Wikipedia search results
 *   - Wikipedia image/bio automatically saved to database
 *   - Added Kramnik, Capablanca, Karpov to built-in players
 *   - "Fetch Image from Wikipedia" button for existing players
 *   - Fixed onPlayersUpdated callback for instant refresh
 *   - Custom players now properly show in Masters section
 *
 * v2.1.1 - Coaching Board Fix
 *   - Fixed piece movement in PuzzleTrainer and InteractiveLesson
 *   - Board now uses correct props (interactive, onMove) 
 *   - Fixed orientation prop ("w"/"b" instead of "white"/"black")
 *
 * v2.1.0 - Responsive Mobile UI Overhaul
 *   - Complete mobile-first responsive design
 *   - Tablet breakpoint (768px-1024px) optimization  
 *   - Mobile breakpoint (<768px) with stacked layouts
 *   - Touch-friendly buttons (min 44px height)
 *   - Horizontal scrolling game selector on mobile
 *   - Board auto-sizes to screen dimensions
 *   - Safe area support for notched phones
 *   - Mobile navigation with bottom bar
 *   - Responsive InteractiveLesson component
 *   - Responsive PuzzleTrainer component
 *   - Responsive ChessCoach home screen
 *
 * v2.0.0 - Complete Coach Overhaul
 *   - Skill assessment to establish baseline (5 questions)
 *   - Structured curriculum with beginner/intermediate/advanced modules
 *   - Training sessions: lessons, tactical puzzles, practice games
 *   - Game Analyzer: paste PGN, get move-by-move feedback
 *   - Progress tracking across 5 skill categories:
 *     - Tactics (forks, pins, skewers, discoveries, back rank, mating patterns)
 *     - Opening Principles (development, center control, king safety)
 *     - Middlegame Strategy (planning, pawn structure, piece activity, attack/defense)
 *     - Endgame Technique (basic mates, king activity, pawn/rook endings)
 *     - Calculation (depth, accuracy, visualization)
 *   - Friendly coach personality with encouraging feedback
 *   - XP-based skill leveling system (levels 1-5 per skill)
 *   - Rating projection based on skill levels
 * 
 * v1.6.5 - Stockfish CDN Integration
 *   - Restored Stockfish engine via CDN (cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2)
 *   - ~3000+ ELO strength at max skill level
 *   - Skill levels 1-20 map to Stockfish's UCI Skill Level option
 *   - Replaced JavaScript minimax engine with real Stockfish
 * 
 * v1.6.4 - Improved Chess Engine (deprecated)
 *   - JavaScript minimax with alpha-beta pruning (replaced by Stockfish)
 *   - Skill levels now meaningful:
 *     - 1-5: Beginner (depth 2, makes mistakes)
 *     - 6-10: Casual (depth 3)
 *     - 11-15: Intermediate (depth 4)
 *     - 16-18: Advanced (depth 5)
 *     - 19-20: Expert (depth 6)
 * 
 * v1.6.3 - PGN Import Duplicate Fix
 *   - FIXED: "ON CONFLICT" error when importing PGN with duplicate entries
 *   - Game IDs now include: players + date + ECO + round + index + move hash
 *   - Deduplication before database insert
 *   - Better handling of PGN files with unknown dates/rounds
 * 
 * v1.6.2 - Masters Section Redesign
 *   - Complete visual redesign with larger, cleaner cards (320px min)
 *   - Horizontal card layout: image on left, info on right
 *   - No emojis - clean text-based design
 *   - Shows bio excerpt, peak rating, champion years
 *   - Avatar fallback shows player initial letter
 *   - "Chess Legends" header with description
 *   - Custom players clearly marked with "CUSTOM" badge
 *   - Hover effects on cards
 * 
 * v1.6.1 - Admin Panel Improvements
 *   - FIXED: Switching players now clears pending import (no accidental imports)
 *   - Added visual progress bar during game import
 *   - Added Wikipedia search for new player creation (auto-fills profile)
 *   - Import section shows current target player clearly
 *   - Removed confusing Lichess/Chess.com search from sidebar
 *   - Added "Clear" button to cancel pending imports
 * 
 * v1.6.0 - Critical PGN Parser Fix
 *   - FIXED: PGN parser now stores full PGN (headers + moves)
 *   - Previously only stored moves, causing chess.js loadPgn() to fail
 *   - Added buildPGN() to reconstruct valid PGN from parsed headers
 *   - Better line ending handling (Windows/Unix)
 *   - Improved game splitting regex for various PGN formats
 *   - Added debug logging for PGN loading issues
 *   - NOTE: Re-import games via Admin Panel to fix existing data
 * 
 * v1.5.9 - Layout & Masters Section Fixes
 *   - Chess Classics: Narrower games list (220px), wider board area
 *   - Info panel: Compact layout (280px) with better move display
 *   - Masters section: Shows ALL built-in players (not just those with PGN files)
 *   - Games without moves now show "No moves available" message
 *   - Games list shows warning icon for games missing PGN data
 *   - Player cards: "Has Games" badge for players with game collections
 *   - Custom players from admin marked with purple "Custom" badge
 * 
 * v1.5.8 - Masters Section + Layout Fixes
 *   - Masters section now shows custom players from Supabase
 *   - Games grid: narrower first column (280px), wider board area
 *   - Board size increased from 360px to 420px
 *   - Master games load from Supabase first, then fall back to PGN files
 *   - Fixed player cards to show icon when image unavailable
 *   - Custom players marked with green "Custom" badge
 * 
 * v1.5.7 - Multiple 3D Piece Sets + Camera Options
 *   - 7 piece set styles: Ebony/Ivory, Modern Matte, Boxwood/Rosewood,
 *     Marble, Gold/Silver, Jade/Obsidian, Crystal Glass
 *   - 3 geometry styles: Staunton Classic, Modern Minimal, Baroque Ornate
 *   - 3 camera presets: Straight On (default), 3/4 Angled, Top Down
 *   - Default view: Straight on from white's side
 *   - Settings panel shows piece set/camera when in 3D mode
 * 
 * v1.5.6 - WCAG AAA Accessibility + UI Polish
 *   - Zone Mode: App theme selector in settings dropdown
 *   - Zone Mode: Music toast follows current theme (light/dark)
 *   - Zone Mode: High contrast moves list (7:1 ratio)
 *   - Zone Mode: Responsive 2D board (scales to fit)
 *   - Zone Mode: Distinct play button (larger, colored, shadows)
 *   - All controls have proper aria-labels
 *   - Light themes properly supported throughout
 * 
 * v1.5.5 - Zone Mode Redesign + Player Search
 *   - Zone Mode: Large board on left, sidebar on right
 *   - Zone Mode: Track toast notification when songs change
 *   - Zone Mode: Settings panel for 2D/3D, themes, music
 *   - Admin Panel: Search Lichess/Chess.com for players
 *   - Admin Panel: Add found players as custom players
 * 
 * v1.5.4 - Audio Management in Admin Panel
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
import { ChessCoach } from "./coaching/index.js";
import { personalities } from "./engine/personalities.js";
import { FAMOUS_GAMES, GAME_CATEGORIES, getGamesByCategory, searchGames } from "./data/famousGames.js";
import { supabase, auth, db } from "./supabase.js";
import { parsePGN, MASTER_COLLECTIONS } from "./data/pgnParser.js";
import { PLAYERS, getPlayer } from "./data/playerInfo.js";
import { getGamesByMaster } from "./data/mastersDatabase.js";
import { listBoardThemes } from "./components/cm-board/themes/boardThemes.js";
import useResponsive, { getBoardSize, getSpacing } from "./hooks/useResponsive.js";
import "./styles/responsive.css";

// ═══════════════════════════════════════════════════════════════════════════
// APP VERSION - Update this when deploying new versions
// ═══════════════════════════════════════════════════════════════════════════
const APP_VERSION = "2.4.2";

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
  
  // Responsive viewport
  const viewport = useResponsive();
  const { isMobile, isTablet, isDesktop } = viewport;
  const spacing = getSpacing(viewport);
  
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
  const [coachingProfile, setCoachingProfile] = useState(null);
  
  // Library state
  const [source, setSource] = useState("classics");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [masterGames, setMasterGames] = useState([]);
  const [customPlayers, setCustomPlayers] = useState([]);
  const [customPlayersLoading, setCustomPlayersLoading] = useState(false);
  const [dbGameCounts, setDbGameCounts] = useState({}); // Game counts from Supabase
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

  // Load custom players from Supabase
  const loadCustomPlayers = async () => {
    setCustomPlayersLoading(true);
    try {
      const { data, error } = await db.getCustomPlayers();
      if (error) throw error;
      setCustomPlayers(data || []);
      
      // Also load game counts for all players
      const allPlayerIds = [...Object.keys(PLAYERS), ...(data || []).map(p => p.id)];
      const counts = {};
      for (const playerId of allPlayerIds) {
        const { count } = await db.getMasterGameCount(playerId);
        if (count > 0) counts[playerId] = count;
      }
      setDbGameCounts(counts);
    } catch (e) {
      console.error("Error loading custom players:", e);
    }
    setCustomPlayersLoading(false);
  };

  // Load custom players when source changes to "masters"
  useEffect(() => {
    if (source === "masters") {
      loadCustomPlayers();
    }
  }, [source]);

  // Load game counts on initial mount for profile display
  useEffect(() => {
    const loadGameCounts = async () => {
      try {
        const allPlayerIds = Object.keys(PLAYERS);
        const counts = {};
        for (const playerId of allPlayerIds) {
          const { count } = await db.getMasterGameCount(playerId);
          if (count > 0) counts[playerId] = count;
        }
        setDbGameCounts(prev => ({ ...prev, ...counts }));
      } catch (e) {
        console.error("Error loading game counts:", e);
      }
    };
    loadGameCounts();
  }, []);

  const loadMaster = async (masterId) => {
    setSelectedMaster(masterId);
    setLoadingGames(true);
    setError(null);
    
    try {
      // First try to load from Supabase (custom player games)
      const { data: dbGames, error: dbError, count } = await db.getMasterGames(masterId, 200, 0);
      
      if (!dbError && dbGames && dbGames.length > 0) {
        // Games found in Supabase
        const formatted = dbGames.map(g => ({
          id: g.game_id || g.id,
          white: g.white,
          black: g.black,
          whiteElo: g.white_elo,
          blackElo: g.black_elo,
          result: g.result,
          year: g.year,
          event: g.event,
          site: g.site,
          round: g.round,
          eco: g.eco,
          pgn: g.pgn,
          title: g.title || `${g.white} vs ${g.black}`,
          description: g.description
        }));
        setMasterGames(formatted);
        setGames(formatted);
        setLoadingGames(false);
        return;
      }
      
      // Fall back to local PGN file
      const collection = MASTER_COLLECTIONS[masterId];
      if (collection?.file) {
        const response = await fetch(collection.file);
        if (!response.ok) throw new Error("Failed to load PGN");
        const text = await response.text();
        const parsed = parsePGN(text);
        setMasterGames(parsed);
        setGames(parsed);
      } else {
        // Check mastersDatabase.js for built-in games
        const builtIn = getGamesByMaster(masterId);
        if (builtIn && builtIn.length > 0) {
          setMasterGames(builtIn);
          setGames(builtIn);
        } else {
          setGames([]);
          setMasterGames([]);
        }
      }
    } catch (e) {
      console.error("Error loading master games:", e);
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
    setSelectedGame(game);
    if (!game?.pgn) {
      console.warn("Game has no PGN data:", game?.title || game?.id);
      setLibraryMoves([]);
      setLibraryFen(new Chess().fen());
      setLibraryMoveIndex(0);
      return;
    }
    try {
      libraryChess.reset();
      // Try loading the PGN - works with full PGN or just moves
      let success = libraryChess.loadPgn(game.pgn, { strict: false });
      let history = libraryChess.history();
      
      // If loadPgn didn't get moves, try parsing as just moves text
      if (history.length === 0 && game.pgn) {
        libraryChess.reset();
        // Extract just the moves (remove move numbers, results, etc.)
        const moveText = game.pgn
          .replace(/\[[^\]]*\]/g, '')  // Remove headers
          .replace(/\{[^}]*\}/g, '')   // Remove comments
          .replace(/\d+\.\s*/g, '')    // Remove move numbers
          .replace(/1-0|0-1|1\/2-1\/2|\*/g, '') // Remove results
          .trim()
          .split(/\s+/)
          .filter(m => m && /^[KQRBNP]?[a-h]?[1-8]?x?[a-h][1-8](=[QRBN])?[+#]?$|^O-O(-O)?[+#]?$/i.test(m));
        
        for (const move of moveText) {
          try {
            libraryChess.move(move, { sloppy: true });
          } catch {
            // Stop if we hit an invalid move
            break;
          }
        }
        history = libraryChess.history();
      }
      
      setLibraryMoves(history);
      libraryChess.reset();
      setLibraryFen(libraryChess.fen());
      setLibraryMoveIndex(0);
      
      if (history.length === 0 && game.pgn) {
        console.warn("Could not extract moves from PGN:", game.pgn?.slice(0, 200));
      }
    } catch (err) { 
      console.error("Error loading PGN:", err, game.pgn?.slice(0, 200));
      setLibraryMoves([]); 
      setLibraryFen(new Chess().fen());
      setLibraryMoveIndex(0);
    }
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
    } catch (e) { setError(e.message); }
    setImportLoading(false);
  };

  const deleteImportedGame = async (id) => {
    try {
      const { error } = await db.deleteImportedGame(id);
      if (error) throw error;
      setImportedGames(prev => prev.filter(g => g.id !== id));
      if (selectedGame?.id === id) setSelectedGame(null);
    } catch (e) { setError(e.message); }
  };

  const displayGames = source === "classics" ? (searchResults.length > 0 ? searchResults : games) : games;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: theme.bg, 
      color: theme.ink, 
      fontFamily: fonts.body, 
      transition,
      paddingBottom: isMobile ? "calc(80px + env(safe-area-inset-bottom, 0))" : 0
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(26, 26, 26, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "12px 16px",
          paddingTop: "calc(12px + env(safe-area-inset-top, 0))",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>♛</span>
            <span style={{ fontWeight: 600, fontSize: 16 }}>ChessGrandmaster</span>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: "transparent", border: "none", color: theme.ink,
              padding: 8, cursor: "pointer", fontSize: 20
            }}
          >⚙️</button>
        </header>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: `linear-gradient(to bottom, ${theme.bg} 0%, ${theme.bg}ee 100%)`,
          backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{ 
            maxWidth: 1400, margin: "0 auto", 
            padding: isTablet ? "14px 24px" : "16px 32px", 
            display: "flex", justifyContent: "space-between", alignItems: "center" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: isTablet ? 28 : 32 }}>♛</span>
              <span style={{ fontFamily: fonts.display, fontSize: isTablet ? 18 : 22, fontWeight: 500 }}>ChessGrandmaster</span>
            </div>

            <nav style={{ display: "flex", gap: isTablet ? 20 : 32 }}>
              {[{ id: "library", label: "Library" }, { id: "play", label: "Play" }, { id: "coach", label: "Coach" }, { id: "training", label: "Zone" }].map(tab => (
                <button key={tab.id} onClick={() => {
                  if (tab.id === "training") setShowZoneMode(true);
                  else if (tab.id === "coach") setShowChessCoach(true);
                  else { setActiveTab(tab.id); if (tab.id === "play") setGrandmasterView("select"); }
                }}
                  style={{
                    background: "none", border: "none", fontFamily: fonts.body, fontSize: isTablet ? 11 : 12, fontWeight: 500,
                    letterSpacing: "0.1em", textTransform: "uppercase", color: theme.ink,
                    opacity: activeTab === tab.id ? 1 : 0.5, cursor: "pointer", padding: "8px 0", position: "relative", transition,
                  }}>
                  {tab.label}
                  {activeTab === tab.id && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: theme.accent, borderRadius: 1 }} />}
                </button>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: isTablet ? 10 : 16 }}>
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
              {supabase && !isTablet && (
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
      )}

      {/* Mobile Settings Panel */}
      {isMobile && showSettings && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200
        }} onClick={() => setShowSettings(false)}>
          <div style={{
            position: "absolute", top: 60, right: 16, background: theme.card,
            border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16,
            boxShadow: theme.shadowStrong, minWidth: 260, maxWidth: "calc(100vw - 32px)"
          }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: theme.inkMuted, marginBottom: 12 }}>APP THEME</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
              {Object.values(THEMES).map(t => (
                <button key={t.id} onClick={() => { changeTheme(t.id); }}
                  style={{
                    padding: "12px", borderRadius: 8, border: themeId === t.id ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
                    background: themeId === t.id ? theme.accentSoft : "transparent", color: theme.ink,
                    cursor: "pointer", textAlign: "center", fontSize: 12, fontWeight: 500,
                  }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: t.bg, border: `2px solid ${t.ink}`, margin: "0 auto 6px" }} />
                  {t.name}
                </button>
              ))}
            </div>
            
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: theme.inkMuted, marginBottom: 8 }}>BOARD THEME</p>
            <select
              value={boardThemeId}
              onChange={(e) => { setBoardThemeId(e.target.value); localStorage.setItem("cm-board-theme", e.target.value); }}
              style={{
                width: "100%", padding: "12px", borderRadius: 8, 
                border: `1px solid ${theme.border}`, background: theme.bg, color: theme.ink,
                fontSize: 14, marginBottom: 12
              }}
            >
              {listBoardThemes().map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            
            <button 
              onClick={() => { setShowAdminPanel(true); setShowSettings(false); }}
              style={{
                width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${theme.border}`,
                background: "transparent", color: theme.ink, cursor: "pointer",
                fontSize: 13, fontWeight: 500, marginBottom: 8
              }}>
              ⚙️ Admin Panel
            </button>
            
            {supabase && (
              user ? (
                <button onClick={handleSignOut} style={{
                  width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${theme.border}`,
                  background: "transparent", color: theme.ink, cursor: "pointer", fontSize: 13
                }}>Sign Out ({user.email?.split("@")[0]})</button>
              ) : (
                <button onClick={() => { setShowAuthModal(true); setShowSettings(false); }} style={{
                  width: "100%", padding: "12px", borderRadius: 8, border: "none",
                  background: theme.accent, color: theme.id === "light" ? "#fff" : theme.bg,
                  cursor: "pointer", fontWeight: 600, fontSize: 14
                }}>Sign In</button>
              )
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && !showZoneMode && !showChessCoach && !showAdminPanel && (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(26, 26, 26, 0.98)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderTop: `1px solid ${theme.border}`,
          padding: "8px 8px",
          paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0))",
          display: "flex", justifyContent: "space-around"
        }}>
          {[
            { id: "library", label: "Library", icon: "📚" },
            { id: "play", label: "Play", icon: "♟️" },
            { id: "coach", label: "Coach", icon: "🎓" },
            { id: "zone", label: "Zone", icon: "🎯" }
          ].map(tab => {
            const isActive = activeTab === tab.id || (tab.id === "zone" && showZoneMode) || (tab.id === "coach" && showChessCoach);
            return (
              <button key={tab.id} onClick={() => {
                if (tab.id === "zone") setShowZoneMode(true);
                else if (tab.id === "coach") setShowChessCoach(true);
                else { setActiveTab(tab.id); if (tab.id === "play") setGrandmasterView("select"); }
              }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "8px 16px", background: "none", border: "none",
                  color: isActive ? "#4CAF50" : "rgba(255,255,255,0.5)",
                  cursor: "pointer"
                }}>
                <span style={{ fontSize: 22 }}>{tab.icon}</span>
                <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Library */}
      {activeTab === "library" && (
        <main style={{ 
          maxWidth: 1400, margin: "0 auto", 
          padding: isMobile ? 16 : isTablet ? 24 : 32 
        }}>
          {/* Source tabs - scrollable on mobile */}
          <div style={{ 
            display: "flex", gap: 8, marginBottom: isMobile ? 16 : 24, 
            borderBottom: `1px solid ${theme.border}`, paddingBottom: isMobile ? 12 : 16,
            overflowX: isMobile ? "auto" : "visible",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none"
          }}>
            {Object.values(SOURCES).map(s => (
              <button key={s.id} onClick={() => setSource(s.id)}
                style={{
                  padding: isMobile ? "10px 16px" : "10px 20px", borderRadius: 8,
                  border: source === s.id ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
                  background: source === s.id ? theme.accentSoft : "transparent", color: theme.ink,
                  cursor: "pointer", fontSize: isMobile ? 12 : 13, fontWeight: 500, 
                  display: "flex", alignItems: "center", gap: 8, transition,
                  whiteSpace: "nowrap", flexShrink: 0
                }}>
                <span>{s.icon}</span>{isMobile ? null : s.name}
              </button>
            ))}
          </div>

          {source !== "imported" && source !== "masters" && (
            <div style={{ display: "flex", gap: isMobile ? 8 : 12, marginBottom: isMobile ? 16 : 24, flexDirection: isMobile ? "column" : "row" }}>
              <input type="text" placeholder={source === "classics" ? "Search games..." : "Enter username..."}
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ flex: 1, padding: isMobile ? "12px 16px" : "14px 20px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.card, color: theme.ink, fontSize: 14, outline: "none" }} />
              <button onClick={handleSearch} style={{ padding: isMobile ? "12px 20px" : "14px 28px", borderRadius: 10, border: "none", background: theme.accent, color: theme.id === "light" ? "#fff" : theme.bg, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Search</button>
            </div>
          )}

          {source === "classics" && (
            <div style={{ 
              display: "flex", gap: 8, flexWrap: "wrap", marginBottom: isMobile ? 16 : 24,
              overflowX: isMobile ? "auto" : "visible",
              WebkitOverflowScrolling: "touch",
              paddingBottom: isMobile ? 8 : 0
            }}>
              {Object.entries(GAME_CATEGORIES).map(([id, cat]) => (
                <button key={id} onClick={() => selectCategory(id)}
                  style={{
                    padding: isMobile ? "6px 12px" : "8px 16px", borderRadius: 20,
                    border: selectedCategory === id ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
                    background: selectedCategory === id ? theme.accentSoft : "transparent", color: theme.ink, 
                    cursor: "pointer", fontSize: isMobile ? 11 : 12, fontWeight: 500, transition,
                    whiteSpace: "nowrap", flexShrink: 0
                  }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          )}

          {source === "masters" && (
            <div style={{ marginBottom: 24 }}>
              {/* Header */}
              <div style={{ marginBottom: isMobile ? 16 : 24 }}>
                <h2 style={{ fontFamily: fonts.display, fontSize: isMobile ? 20 : 24, marginBottom: 8, color: theme.ink }}>
                  Chess Legends
                </h2>
                <p style={{ fontSize: isMobile ? 13 : 14, color: theme.inkMuted, maxWidth: 600, lineHeight: 1.5 }}>
                  Explore curated game collections from the greatest players in chess history.
                </p>
              </div>
              
              {customPlayersLoading && (
                <div style={{ padding: 20, textAlign: "center", color: theme.inkMuted }}>
                  Loading players...
                </div>
              )}
              
              {/* Player Grid - Responsive */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile 
                  ? "1fr" 
                  : isTablet 
                    ? "repeat(auto-fill, minmax(280px, 1fr))" 
                    : "repeat(auto-fill, minmax(320px, 1fr))", 
                gap: isMobile ? 12 : 20 
              }}>
                {/* Built-in players */}
                {Object.entries(PLAYERS).map(([id, player]) => {
                  const gameCount = getGamesByMaster(id).length;
                  const hasGames = MASTER_COLLECTIONS[id] || gameCount > 0;
                  
                  return (
                    <div 
                      key={id} 
                      onClick={() => loadMaster(id)} 
                      style={{
                        backgroundColor: theme.card,
                        borderRadius: isMobile ? 12 : 16,
                        overflow: "hidden",
                        border: selectedMaster === id ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column"
                      }}
                      onMouseOver={(e) => { if (selectedMaster !== id && !isMobile) e.currentTarget.style.borderColor = theme.accent + "60"; }}
                      onMouseOut={(e) => { if (selectedMaster !== id && !isMobile) e.currentTarget.style.borderColor = theme.border; }}
                    >
                      {/* Top Section - Image + Basic Info */}
                      <div style={{ display: "flex", height: isMobile ? 100 : 140 }}>
                        {/* Player Image */}
                        <div style={{ 
                          width: isMobile ? 100 : 140,
                          minWidth: isMobile ? 100 : 140,
                          backgroundColor: theme.bgAlt,
                          backgroundImage: player.imageUrl ? `url(${player.imageUrl})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center top",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {!player.imageUrl && (
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
                        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: theme.ink, marginBottom: 4, lineHeight: 1.2 }}>
                            {player.name}
                          </div>
                          <div style={{ fontSize: 12, color: theme.inkMuted, marginBottom: 8 }}>
                            {player.nationality}
                          </div>
                          
                          {/* Key Stats */}
                          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                            {player.peakRating && (
                              <div>
                                <div style={{ color: theme.inkMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Peak</div>
                                <div style={{ color: theme.ink, fontWeight: 600 }}>{player.peakRating}</div>
                              </div>
                            )}
                            {player.worldChampion && (
                              <div>
                                <div style={{ color: theme.inkMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Champion</div>
                                <div style={{ color: theme.ink, fontWeight: 600 }}>{player.worldChampion}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Section - Bio + Actions */}
                      <div style={{ padding: 16, borderTop: `1px solid ${theme.border}`, flex: 1, display: "flex", flexDirection: "column" }}>
                        {/* Bio Excerpt */}
                        <p style={{ 
                          fontSize: 13, 
                          color: theme.inkMuted, 
                          lineHeight: 1.5, 
                          marginBottom: 16,
                          flex: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}>
                          {player.bio?.split('\n\n')[0]?.slice(0, 120)}...
                        </p>
                        
                        {/* Action Row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); loadMaster(id); }}
                            style={{ 
                              flex: 1,
                              padding: "10px 16px", 
                              borderRadius: 8, 
                              border: "none", 
                              background: hasGames ? theme.accent : theme.bgAlt, 
                              color: hasGames ? (theme.id === "light" ? "#fff" : theme.bg) : theme.inkMuted, 
                              cursor: hasGames ? "pointer" : "default",
                              fontWeight: 600, 
                              fontSize: 13,
                              transition 
                            }}>
                            {hasGames ? "View Games" : "No Games Yet"}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowPlayerProfile(id); }}
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
                            Biography
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Custom players from Supabase */}
                {customPlayers.map(player => (
                  <div 
                    key={player.id} 
                    onClick={() => loadMaster(player.id)} 
                    style={{
                      backgroundColor: theme.card,
                      borderRadius: 16,
                      overflow: "hidden",
                      border: selectedMaster === player.id ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative"
                    }}
                  >
                    {/* Custom Badge */}
                    <div style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      padding: "4px 8px",
                      background: "rgba(156,39,176,0.9)",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#fff",
                      zIndex: 1
                    }}>
                      CUSTOM
                    </div>
                    
                    {/* Top Section - Image + Basic Info */}
                    <div style={{ display: "flex", height: 140 }}>
                      {/* Player Image */}
                      <div style={{ 
                        width: 140,
                        minWidth: 140,
                        backgroundColor: theme.bgAlt,
                        backgroundImage: player.image_url ? `url(${player.image_url})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {!player.image_url && (
                          <div style={{ 
                            width: 70, 
                            height: 70, 
                            borderRadius: "50%", 
                            background: "rgba(156,39,176,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            color: "#9C27B0"
                          }}>
                            {player.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Info */}
                      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: theme.ink, marginBottom: 4, lineHeight: 1.2 }}>
                          {player.name}
                        </div>
                        <div style={{ fontSize: 12, color: theme.inkMuted, marginBottom: 8 }}>
                          {player.nationality || "Unknown"}
                        </div>
                        
                        {/* Key Stats */}
                        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                          {player.peak_rating && (
                            <div>
                              <div style={{ color: theme.inkMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Peak</div>
                              <div style={{ color: theme.ink, fontWeight: 600 }}>{player.peak_rating}</div>
                            </div>
                          )}
                          {player.world_champion && (
                            <div>
                              <div style={{ color: theme.inkMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Champion</div>
                              <div style={{ color: theme.ink, fontWeight: 600 }}>{player.world_champion}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Section - Bio + Actions */}
                    <div style={{ padding: 16, borderTop: `1px solid ${theme.border}`, flex: 1, display: "flex", flexDirection: "column" }}>
                      {/* Bio Excerpt */}
                      <p style={{ 
                        fontSize: 13, 
                        color: theme.inkMuted, 
                        lineHeight: 1.5, 
                        marginBottom: 16,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {player.bio?.slice(0, 120) || "Custom player added via Admin Panel."}...
                      </p>
                      
                      {/* Action Row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); loadMaster(player.id); }}
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
                          View Games
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
            <div style={{ 
              display: isMobile ? "flex" : "grid", 
              flexDirection: "column",
              gridTemplateColumns: isTablet ? "1fr 1fr" : "220px 1fr 280px", 
              gap: isMobile ? 12 : 16 
            }}>
              {/* Mobile: Show Board first, then game selector */}
              {/* Desktop: Show games list first */}
              
              {/* Games List - On mobile shows as horizontal scroll or collapsible */}
              <div style={{ 
                background: theme.card, 
                borderRadius: isMobile ? 12 : 16, 
                border: `1px solid ${theme.border}`, 
                overflow: "hidden",
                order: isMobile ? 2 : 1
              }}>
                <div style={{ 
                  padding: isMobile ? "10px 14px" : "12px 16px", 
                  borderBottom: `1px solid ${theme.border}`, 
                  fontSize: 10, 
                  fontWeight: 600, 
                  letterSpacing: "0.12em", 
                  color: theme.inkMuted,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>GAMES ({displayGames.length})</span>
                </div>
                <div style={{ 
                  maxHeight: isMobile ? 200 : 600, 
                  overflowY: "auto",
                  overflowX: isMobile ? "auto" : "hidden",
                  display: isMobile ? "flex" : "block",
                  flexDirection: isMobile ? "row" : "column",
                  gap: isMobile ? 8 : 0,
                  padding: isMobile ? 8 : 0
                }}>
                  {displayGames.map((game, i) => (
                    <div key={game.id || i} onClick={() => selectGame(game)}
                      style={{ 
                        padding: isMobile ? "10px 12px" : "12px 16px", 
                        borderBottom: isMobile ? "none" : `1px solid ${theme.border}`,
                        borderRadius: isMobile ? 8 : 0,
                        border: isMobile ? `1px solid ${theme.border}` : "none",
                        cursor: "pointer", 
                        background: selectedGame?.id === game.id ? theme.accentSoft : isMobile ? theme.bgAlt : "transparent", 
                        transition,
                        minWidth: isMobile ? 180 : "auto",
                        flexShrink: 0
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: isMobile ? 11 : 12, lineHeight: 1.3 }}>
                          {game.title || `${game.white} vs ${game.black}`}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: isMobile ? 10 : 11, color: theme.inkMuted }}>
                          {game.event?.slice(0, isMobile ? 15 : 20)} {game.year || game.date}
                        </span>
                        <span style={{ 
                          fontSize: isMobile ? 10 : 11, 
                          fontWeight: 600, 
                          color: game.result === "1-0" ? theme.success : game.result === "0-1" ? theme.error : theme.inkMuted 
                        }}>{game.result}</span>
                      </div>
                      {!game.pgn && <span style={{ fontSize: 10, color: theme.error }}>⚠ No moves</span>}
                      {source === "imported" && !isMobile && (
                        <button onClick={(e) => { e.stopPropagation(); deleteImportedGame(game.id); }}
                          style={{ marginTop: 6, padding: "3px 6px", fontSize: 10, borderRadius: 4, border: `1px solid ${theme.border}`, background: "transparent", color: theme.inkMuted, cursor: "pointer" }}>Delete</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Board */}
              <div style={{ 
                background: theme.card, 
                borderRadius: isMobile ? 12 : 16, 
                border: `1px solid ${theme.border}`, 
                padding: isMobile ? 12 : 16, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                order: isMobile ? 1 : 2,
                gridColumn: isTablet ? "span 2" : "auto"
              }}>
                <div style={{ height: 24, marginBottom: 8, display: "flex", gap: 2, alignItems: "center", width: "100%", justifyContent: "center" }}>
                  {capturedPieces.byBlack.map((p, i) => <img key={i} src={`/pieces/classic/w${p.toUpperCase()}.svg`} alt="" style={{ width: isMobile ? 16 : 20, height: isMobile ? 16 : 20, opacity: 0.7 }} />)}
                </div>
                <div style={{ maxWidth: "100%", overflow: "hidden" }}>
                  <Board 
                    fen={libraryFen} 
                    orientation={libraryOrientation} 
                    onMove={() => {}} 
                    interactive={false} 
                    size={isMobile ? Math.min(viewport.width - 56, 360) : isTablet ? 400 : 420} 
                  />
                </div>
                <div style={{ height: 24, marginTop: 8, display: "flex", gap: 2, alignItems: "center", width: "100%", justifyContent: "center" }}>
                  {capturedPieces.byWhite.map((p, i) => <img key={i} src={`/pieces/classic/b${p.toUpperCase()}.svg`} alt="" style={{ width: isMobile ? 16 : 20, height: isMobile ? 16 : 20, opacity: 0.7 }} />)}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 6 : 8, marginTop: isMobile ? 12 : 16, flexWrap: "wrap" }}>
                  {[
                    { l: "⏮", a: () => goToMove(0), d: libraryMoveIndex === 0 },
                    { l: "◀", a: () => goToMove(libraryMoveIndex - 1), d: libraryMoveIndex === 0 },
                    { l: "▶", a: () => goToMove(libraryMoveIndex + 1), d: libraryMoveIndex >= libraryMoves.length },
                    { l: "⏭", a: () => goToMove(libraryMoves.length), d: libraryMoveIndex >= libraryMoves.length },
                    { l: "↻", a: () => setLibraryOrientation(o => o === "w" ? "b" : "w") },
                  ].map((b, i) => (
                    <button key={i} onClick={b.a} disabled={b.d}
                      style={{ 
                        padding: isMobile ? "10px 14px" : "8px 14px", 
                        borderRadius: 8, 
                        border: `1px solid ${theme.border}`, 
                        background: theme.bgAlt, 
                        color: theme.ink, 
                        cursor: b.d ? "default" : "pointer", 
                        opacity: b.d ? 0.4 : 1, 
                        fontSize: isMobile ? 16 : 14, 
                        transition,
                        minHeight: isMobile ? 44 : "auto"
                      }}>{b.l}</button>
                  ))}
                </div>
                {selectedGame && (
                  <button onClick={() => setShowZoneMode(true)}
                    style={{ 
                      width: "100%", 
                      marginTop: isMobile ? 12 : 16, 
                      padding: isMobile ? "16px" : "14px", 
                      borderRadius: 10, 
                      border: "none", 
                      background: theme.accent, 
                      color: theme.id === "light" ? "#fff" : theme.bg, 
                      cursor: "pointer", 
                      fontWeight: 600, 
                      fontSize: isMobile ? 15 : 14,
                      minHeight: isMobile ? 48 : "auto"
                    }}>
                    🎯 Enter Zone Mode
                  </button>
                )}
              </div>

              {/* Info - Moves Panel */}
              <div style={{ 
                background: theme.card, 
                borderRadius: isMobile ? 12 : 16, 
                border: `1px solid ${theme.border}`, 
                padding: isMobile ? 12 : 16, 
                display: "flex", 
                flexDirection: "column", 
                maxHeight: isMobile ? 300 : 700,
                order: 3,
                gridColumn: isTablet ? "span 2" : "auto"
              }}>
                {selectedGame ? (
                  <>
                    <h2 style={{ fontFamily: fonts.display, fontSize: isMobile ? 15 : 16, marginBottom: 4, lineHeight: 1.3 }}>
                      {selectedGame.title || `${selectedGame.white} vs ${selectedGame.black}`}
                    </h2>
                    {selectedGame.description && !isMobile && (
                      <p style={{ fontSize: 12, color: theme.inkMuted, lineHeight: 1.5, marginBottom: 10 }}>{selectedGame.description}</p>
                    )}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: isMobile ? 8 : 12 }}>
                      <span style={{ fontSize: isMobile ? 9 : 10, padding: "3px 8px", background: theme.accentSoft, borderRadius: 4 }}>{selectedGame.event}</span>
                      <span style={{ fontSize: isMobile ? 9 : 10, padding: "3px 8px", background: theme.accentSoft, borderRadius: 4 }}>{selectedGame.result}</span>
                      {selectedGame.year && <span style={{ fontSize: isMobile ? 9 : 10, padding: "3px 8px", background: theme.accentSoft, borderRadius: 4 }}>{selectedGame.year}</span>}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: theme.inkMuted, marginBottom: 6 }}>
                      MOVES ({libraryMoveIndex}/{libraryMoves.length})
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", background: theme.bgAlt, borderRadius: 10, padding: isMobile ? 8 : 10 }}>
                      {libraryMoves.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 2 : 3 }}>
                          {libraryMoves.map((move, idx) => (
                            <span key={idx} onClick={() => goToMove(idx + 1)}
                              style={{ 
                                padding: isMobile ? "4px 6px" : "5px 8px", 
                                borderRadius: 5, 
                                background: idx + 1 === libraryMoveIndex ? theme.accent : "transparent", 
                                color: idx + 1 === libraryMoveIndex ? (theme.id === "light" ? "#fff" : theme.bg) : theme.ink, 
                                cursor: "pointer", 
                                fontSize: isMobile ? 11 : 12, 
                                transition 
                              }}>
                              {idx % 2 === 0 && <span style={{ opacity: 0.5, marginRight: 2 }}>{Math.floor(idx / 2) + 1}.</span>}{move}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", padding: isMobile ? 16 : 20, color: theme.inkMuted }}>
                          <p style={{ fontSize: 24, marginBottom: 8 }}>📋</p>
                          <p style={{ fontSize: 12 }}>No moves available</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: theme.inkMuted, flexDirection: "column" }}>
                    <p style={{ fontSize: 32, marginBottom: 8 }}>♟️</p>
                    <p style={{ fontSize: 13 }}>Select a game</p>
                  </div>
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
      {showZoneMode && <ZoneMode initialGame={selectedGame} onClose={() => setShowZoneMode(false)} theme={theme} themeId={themeId} onThemeChange={changeTheme} boardThemeId={boardThemeId} onBoardThemeChange={changeBoardTheme} />}

      {/* Chess Coach Modal */}
      {showChessCoach && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: theme.bg,
          zIndex: 1000,
          overflow: "auto"
        }}>
          <ChessCoach
            userProfile={coachingProfile}
            onUpdateProfile={setCoachingProfile}
            onBack={() => setShowChessCoach(false)}
          />
        </div>
      )}

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
              onPlayersUpdated={loadCustomPlayers}
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
              gameCount={dbGameCounts[showPlayerProfile] || getGamesByMaster(showPlayerProfile).length}
              onClose={() => setShowPlayerProfile(null)}
              onSelectGame={(gameName) => {
                // Could search for the game in the database
                setShowPlayerProfile(null);
              }}
              onViewGames={(playerId) => {
                // Navigate to Masters section and select this player
                setSource("masters");
                setSelectedMaster(playerId);
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
