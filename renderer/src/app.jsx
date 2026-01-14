import React, { useEffect, useState, useCallback } from "react";
import { Chess } from "chess.js";
import Board from "./components/Board.jsx";
import BotSelector from "./components/BotSelector.jsx";
import PlayVsBot from "./components/PlayVsBot.jsx";
import { personalities } from "./engine/personalities.js";
import { FAMOUS_GAMES, GAME_CATEGORIES, getGamesByCategory, searchGames } from "./data/famousGames.js";
import { supabase, auth, db } from "./supabase.js";

/**
 * Chessmaster 2026 - Main Application
 */

const SOURCES = {
  classics: { id: "classics", name: "Classic Games", icon: "👑", desc: "Famous games from Morphy to Carlsen" },
  lichess: { id: "lichess", name: "Lichess", icon: "🐴", desc: "Online games from lichess.org" },
  chesscom: { id: "chesscom", name: "Chess.com", icon: "♟️", desc: "Online games from chess.com" },
  imported: { id: "imported", name: "My Games", icon: "📁", desc: "Your imported PGN games" }
};

const LICHESS_PLAYERS = [
  { username: "DrNykterstein", name: "Magnus Carlsen" },
  { username: "Hikaru", name: "Hikaru Nakamura" },
  { username: "Firouzja2003", name: "Alireza Firouzja" },
  { username: "DanielNaroditsky", name: "Daniel Naroditsky" },
  { username: "penguingm1", name: "Andrew Tang" },
];

const CHESSCOM_PLAYERS = [
  { username: "MagnusCarlsen", name: "Magnus Carlsen" },
  { username: "Hikaru", name: "Hikaru Nakamura" },
  { username: "GothamChess", name: "Levy Rozman" },
  { username: "DanielNaroditsky", name: "Daniel Naroditsky" },
];

export default function App() {
  const [mode, setMode] = useState("library");

  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login or signup
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState(null);

  // Library state
  const [source, setSource] = useState("classics");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  
  const [selectedGame, setSelectedGame] = useState(null);
  const [libraryChess] = useState(() => new Chess());
  const [libraryFen, setLibraryFen] = useState(new Chess().fen());
  const [libraryMoveIndex, setLibraryMoveIndex] = useState(0);
  const [libraryMoves, setLibraryMoves] = useState([]);
  const [libraryOrientation, setLibraryOrientation] = useState("w");

  // Import modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importedGames, setImportedGames] = useState([]);
  const [importLoading, setImportLoading] = useState(false);

  // Grandmaster state
  const [selectedBotId, setSelectedBotId] = useState("carlsen");
  const [grandmasterView, setGrandmasterView] = useState("select");

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      const { data } = await auth.getUser();
      setUser(data?.user || null);
      setAuthLoading(false);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadImportedGames(session.user.id);
      } else {
        setImportedGames([]);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Load imported games when user logs in
  useEffect(() => {
    if (user) {
      loadImportedGames(user.id);
    }
  }, [user]);

  const loadImportedGames = async (userId) => {
    const { data, error } = await db.getImportedGames(userId);
    if (!error && data) {
      // Transform DB format to app format
      setImportedGames(data.map(g => ({
        id: g.id,
        white: g.white,
        black: g.black,
        whiteElo: g.white_elo,
        blackElo: g.black_elo,
        result: g.result,
        date: g.date,
        event: g.event,
        opening: g.opening,
        pgn: g.pgn,
        source: "imported"
      })));
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    
    if (authMode === "login") {
      const { error } = await auth.signIn(authEmail, authPassword);
      if (error) {
        setAuthError(error.message);
      } else {
        setShowAuthModal(false);
        setAuthEmail("");
        setAuthPassword("");
      }
    } else {
      const { error } = await auth.signUp(authEmail, authPassword);
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthError("Check your email to confirm your account!");
      }
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setImportedGames([]);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CLASSICS SEARCH
  // ═══════════════════════════════════════════════════════════════════════════
  const handleClassicsSearch = useCallback((query) => {
    if (!query || query.length < 2) {
      setGames([]);
      setSelectedCategory(null);
      return;
    }
    const results = searchGames(query);
    setGames(results);
    setSelectedCategory(null);
    setCurrentPlayer({ name: `Search: "${query}"` });
    if (results.length > 0) handleSelectGame(results[0]);
  }, []);

  const handleCategorySelect = useCallback((catId) => {
    setSelectedCategory(catId);
    const catGames = getGamesByCategory(catId);
    setGames(catGames);
    setCurrentPlayer({ name: GAME_CATEGORIES[catId]?.name || catId });
    if (catGames.length > 0) handleSelectGame(catGames[0]);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // LICHESS
  // ═══════════════════════════════════════════════════════════════════════════
  const searchLichess = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    try {
      const res = await fetch(`https://lichess.org/api/player/autocomplete?term=${encodeURIComponent(query)}&object=true`);
      if (res.ok) {
        const data = await res.json();
        return (data.result || []).map(p => ({ username: p.id, name: p.name || p.id, title: p.title, source: "lichess" }));
      }
    } catch (e) { console.error(e); }
    return [];
  }, []);

  const fetchLichessGames = useCallback(async (username) => {
    const res = await fetch(
      `https://lichess.org/api/games/user/${encodeURIComponent(username)}?max=30&pgnInJson=true&opening=true`,
      { headers: { "Accept": "application/x-ndjson" } }
    );
    if (!res.ok) throw new Error(`Player not found on Lichess`);
    const text = await res.text();
    return text.trim().split("\n").filter(l => l).map(line => {
      try {
        const g = JSON.parse(line);
        const w = g.players?.white;
        const b = g.players?.black;
        return {
          id: g.id,
          white: w?.user?.name || w?.user?.id || (w?.aiLevel ? `AI Level ${w.aiLevel}` : "Anonymous"),
          black: b?.user?.name || b?.user?.id || (b?.aiLevel ? `AI Level ${b.aiLevel}` : "Anonymous"),
          whiteElo: w?.rating, blackElo: b?.rating,
          result: g.winner === "white" ? "1-0" : g.winner === "black" ? "0-1" : "½-½",
          date: g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "",
          event: g.speed || "Online",
          opening: g.opening?.name,
          pgn: g.pgn,
          source: "lichess",
          url: `https://lichess.org/${g.id}`
        };
      } catch { return null; }
    }).filter(g => g?.pgn);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHESS.COM
  // ═══════════════════════════════════════════════════════════════════════════
  const fetchChessComGames = useCallback(async (username) => {
    const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
    if (!archivesRes.ok) throw new Error(`Player not found on Chess.com`);
    const archives = await archivesRes.json();
    const archiveUrls = archives.archives || [];
    if (archiveUrls.length === 0) throw new Error("No games found");
    const recentUrl = archiveUrls[archiveUrls.length - 1];
    const gamesRes = await fetch(recentUrl);
    if (!gamesRes.ok) throw new Error("Failed to load games");
    const gamesData = await gamesRes.json();
    return (gamesData.games || []).slice(-30).reverse().map(g => ({
      id: g.uuid || g.url,
      white: g.white?.username || "?",
      black: g.black?.username || "?",
      whiteElo: g.white?.rating, blackElo: g.black?.rating,
      result: g.white?.result === "win" ? "1-0" : g.black?.result === "win" ? "0-1" : "½-½",
      date: g.end_time ? new Date(g.end_time * 1000).toLocaleDateString() : "",
      event: g.time_class || "Online",
      opening: g.eco,
      pgn: g.pgn,
      source: "chesscom",
      url: g.url
    })).filter(g => g.pgn);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // PGN IMPORT (saves to Supabase)
  // ═══════════════════════════════════════════════════════════════════════════
  const handleImportPGN = useCallback(async () => {
    if (!importText.trim()) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setImportLoading(true);
    
    // Split by double newlines to handle multiple games
    const pgnTexts = importText.split(/\n\n(?=\[)/);
    const newGames = [];
    
    for (const pgnText of pgnTexts) {
      if (!pgnText.trim()) continue;
      
      try {
        const chess = new Chess();
        chess.loadPgn(pgnText, { strict: false });
        const headers = chess.header();
        
        newGames.push({
          white: headers.White || "?",
          black: headers.Black || "?",
          whiteElo: headers.WhiteElo ? parseInt(headers.WhiteElo) : null,
          blackElo: headers.BlackElo ? parseInt(headers.BlackElo) : null,
          result: headers.Result || "*",
          date: headers.Date || "",
          event: headers.Event || "Imported Game",
          opening: headers.Opening || headers.ECO || "",
          pgn: pgnText
        });
      } catch (e) {
        console.error("Failed to parse PGN:", e);
      }
    }
    
    if (newGames.length > 0) {
      // Save to Supabase
      const { data, error } = await db.saveImportedGames(user.id, newGames);
      
      if (error) {
        alert("Failed to save games: " + error.message);
      } else if (data) {
        // Transform and add to local state
        const savedGames = data.map(g => ({
          id: g.id,
          white: g.white,
          black: g.black,
          whiteElo: g.white_elo,
          blackElo: g.black_elo,
          result: g.result,
          date: g.date,
          event: g.event,
          opening: g.opening,
          pgn: g.pgn,
          source: "imported"
        }));
        
        setImportedGames(prev => [...savedGames, ...prev]);
        setShowImportModal(false);
        setImportText("");
        setSource("imported");
        setGames([...savedGames, ...importedGames]);
        setCurrentPlayer({ name: "My Games" });
        handleSelectGame(savedGames[0]);
      }
    } else {
      alert("Failed to parse PGN. Please check the format.");
    }
    
    setImportLoading(false);
  }, [importText, user, importedGames]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImportText(event.target?.result || "");
    reader.readAsText(file);
  }, []);

  const deleteImportedGame = useCallback(async (gameId) => {
    if (!user) return;
    
    const { error } = await db.deleteImportedGame(gameId);
    if (!error) {
      setImportedGames(prev => prev.filter(g => g.id !== gameId));
      setGames(prev => prev.filter(g => g.id !== gameId));
    }
  }, [user]);

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFIED SEARCH (for Lichess)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (source !== "lichess") return;
    const timer = setTimeout(async () => {
      if (searchQuery.length < 2) { setSearchResults([]); return; }
      const results = await searchLichess(searchQuery);
      setSearchResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, source, searchLichess]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FETCH GAMES
  // ═══════════════════════════════════════════════════════════════════════════
  const fetchGames = useCallback(async (player) => {
    setLoadingGames(true);
    setError(null);
    setGames([]);
    setSelectedGame(null);
    setCurrentPlayer(player);
    setSearchResults([]);

    try {
      let fetchedGames = [];
      if (source === "lichess") {
        fetchedGames = await fetchLichessGames(player.username);
      } else if (source === "chesscom") {
        fetchedGames = await fetchChessComGames(player.username);
      }
      setGames(fetchedGames);
      if (fetchedGames.length > 0) handleSelectGame(fetchedGames[0]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingGames(false);
    }
  }, [source, fetchLichessGames, fetchChessComGames]);

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME SELECTION & NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════
  const handleSelectGame = useCallback((game) => {
    setSelectedGame(game);
    if (!game?.pgn) {
      setLibraryMoves([]);
      setLibraryMoveIndex(0);
      libraryChess.reset();
      setLibraryFen(libraryChess.fen());
      return;
    }
    try {
      const temp = new Chess();
      temp.loadPgn(game.pgn, { strict: false });
      const moves = temp.history();
      setLibraryMoves(moves);
      setLibraryMoveIndex(0);
      libraryChess.reset();
      setLibraryFen(libraryChess.fen());
    } catch (e) {
      setLibraryMoves([]);
    }
  }, [libraryChess]);

  const goToMove = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, libraryMoves.length));
    setLibraryMoveIndex(clamped);
    libraryChess.reset();
    for (let i = 0; i < clamped; i++) {
      try { libraryChess.move(libraryMoves[i]); } catch { break; }
    }
    setLibraryFen(libraryChess.fen());
  }, [libraryMoves, libraryChess]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (mode !== "library" || !selectedGame || showImportModal || showAuthModal) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); goToMove(libraryMoveIndex - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToMove(libraryMoveIndex + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); goToMove(0); }
      else if (e.key === "ArrowDown") { e.preventDefault(); goToMove(libraryMoves.length); }
      else if (e.key === "f" || e.key === "F") { e.preventDefault(); setLibraryOrientation(o => o === "w" ? "b" : "w"); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, selectedGame, libraryMoveIndex, libraryMoves.length, goToMove, showImportModal, showAuthModal]);

  // Switch source handler
  const handleSourceChange = (newSource) => {
    setSource(newSource);
    setGames([]);
    setCurrentPlayer(null);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedCategory(null);
    setError(null);
    
    if (newSource === "imported") {
      setGames(importedGames);
      setCurrentPlayer({ name: "My Games" });
      if (importedGames.length > 0) handleSelectGame(importedGames[0]);
    }
  };

  const lastMove = libraryMoveIndex > 0 ? (() => {
    const t = new Chess();
    for (let i = 0; i < libraryMoveIndex; i++) {
      try {
        const m = t.move(libraryMoves[i]);
        if (i === libraryMoveIndex - 1) return { from: m.from, to: m.to };
      } catch { break; }
    }
    return null;
  })() : null;

  const selectedBot = personalities[selectedBotId];

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", color: "#fff" }}>
      {/* HEADER */}
      <header style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 40 }}>♛</span>
            <span style={{ fontSize: 26, fontWeight: 800 }}>Chessmaster 2026</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 4 }}>
              <button onClick={() => setMode("library")}
                style={{ padding: "16px 32px", borderRadius: 10, border: "none", background: mode === "library" ? "#4CAF50" : "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>📚</span><span>Game Library</span>
              </button>
              <button onClick={() => { setMode("grandmaster"); setGrandmasterView("select"); }}
                style={{ padding: "16px 32px", borderRadius: 10, border: "none", background: mode === "grandmaster" ? "#4CAF50" : "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>🎮</span><span>Play vs AI</span>
              </button>
            </div>
            
            {/* Auth Button */}
            {supabase && (
              user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 14, opacity: 0.7 }}>{user.email}</span>
                  <button onClick={handleSignOut}
                    style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", cursor: "pointer" }}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)}
                  style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: "#2196F3", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                  Sign In
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* LIBRARY MODE */}
      {mode === "library" && (
        <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
          {/* Source Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {Object.values(SOURCES).map(s => (
              <button key={s.id} onClick={() => handleSourceChange(s.id)}
                style={{
                  flex: "1 1 200px", padding: "16px 20px", borderRadius: 12,
                  border: source === s.id ? "2px solid #4CAF50" : "2px solid transparent",
                  background: source === s.id ? "rgba(76,175,80,0.15)" : "rgba(255,255,255,0.05)",
                  color: "#fff", cursor: "pointer", textAlign: "left"
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</span>
                  {s.id === "imported" && importedGames.length > 0 && (
                    <span style={{ fontSize: 12, background: "#4CAF50", padding: "2px 8px", borderRadius: 10 }}>{importedGames.length}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{s.desc}</div>
              </button>
            ))}
            {/* Import Button */}
            <button onClick={() => user ? setShowImportModal(true) : setShowAuthModal(true)}
              style={{
                padding: "16px 20px", borderRadius: 12, border: "2px dashed rgba(255,255,255,0.3)",
                background: "transparent", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10
              }}>
              <span style={{ fontSize: 24 }}>➕</span>
              <span style={{ fontWeight: 700 }}>{user ? "Import PGN" : "Sign in to Import"}</span>
            </button>
          </div>

          {/* CLASSICS SOURCE */}
          {source === "classics" && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <input type="text" value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); handleClassicsSearch(e.target.value); }}
                placeholder="Search classic games (e.g. Fischer, Immortal, Sicilian)..."
                style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 16 }}
              />
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10 }}>BROWSE BY PLAYER</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.entries(GAME_CATEGORIES).map(([id, cat]) => (
                  <button key={id} onClick={() => handleCategorySelect(id)}
                    style={{
                      padding: "10px 16px", borderRadius: 8, border: "none",
                      background: selectedCategory === id ? "#4CAF50" : "rgba(255,255,255,0.08)",
                      color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8
                    }}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span style={{ opacity: 0.5, fontSize: 11 }}>({getGamesByCategory(id).length})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LICHESS SOURCE */}
          {source === "lichess" && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Lichess username..."
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box" }}
                />
                {searchResults.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1e1e2e", borderRadius: 10, marginTop: 4, maxHeight: 250, overflowY: "auto", zIndex: 100, border: "1px solid rgba(255,255,255,0.1)" }}>
                    {searchResults.map((p, i) => (
                      <button key={i} onClick={() => { setSearchQuery(p.name); fetchGames(p); }}
                        style={{ width: "100%", padding: "12px 16px", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "transparent", color: "#fff", textAlign: "left", cursor: "pointer" }}>
                        {p.title && <span style={{ fontSize: 11, padding: "2px 6px", background: "rgba(255,193,7,0.3)", borderRadius: 4, color: "#ffc107", marginRight: 8 }}>{p.title}</span>}
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10 }}>TOP PLAYERS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LICHESS_PLAYERS.map(p => (
                  <button key={p.username} onClick={() => { setSearchQuery(p.name); fetchGames(p); }}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CHESS.COM SOURCE */}
          {source === "chesscom" && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchQuery && fetchGames({ username: searchQuery })}
                placeholder="Enter Chess.com username and press Enter..."
                style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 16 }}
              />
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10 }}>TOP PLAYERS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CHESSCOM_PLAYERS.map(p => (
                  <button key={p.username} onClick={() => { setSearchQuery(p.name); fetchGames(p); }}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* IMPORTED GAMES SOURCE */}
          {source === "imported" && importedGames.length === 0 && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 40, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
              <h3 style={{ margin: "0 0 8px 0" }}>No imported games yet</h3>
              <p style={{ opacity: 0.7, marginBottom: 16 }}>
                {user ? "Import PGN files to add your own games" : "Sign in to import and save your games"}
              </p>
              <button onClick={() => user ? setShowImportModal(true) : setShowAuthModal(true)}
                style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: "#4CAF50", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                {user ? "Import PGN" : "Sign In"}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(244,67,54,0.2)", border: "1px solid #f44336", borderRadius: 10, padding: 16, marginBottom: 20, color: "#ff8a80" }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loadingGames && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
              <div>Loading games...</div>
            </div>
          )}

          {/* Games Display */}
          {(games.length > 0 || (source === "classics" && selectedCategory)) && !loadingGames && (
            <div style={{ display: "grid", gridTemplateColumns: "350px 520px 1fr", gap: 20 }}>
              {/* Game list */}
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, maxHeight: 700, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: 16, opacity: 0.8 }}>
                  {currentPlayer?.name || "Games"} ({games.length})
                </h3>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                  {games.map((game, i) => (
                    <div key={game.id || i} style={{ position: "relative" }}>
                      <button onClick={() => handleSelectGame(game)}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: 10, textAlign: "left", cursor: "pointer",
                          border: selectedGame?.id === game.id ? "2px solid #4CAF50" : "2px solid transparent",
                          background: selectedGame?.id === game.id ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)",
                          color: "#fff"
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{game.white} vs {game.black}</span>
                          <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: game.result === "1-0" ? "rgba(76,175,80,0.3)" : game.result === "0-1" ? "rgba(244,67,54,0.3)" : "rgba(255,255,255,0.1)" }}>{game.result}</span>
                        </div>
                        {game.title && <div style={{ fontSize: 12, fontWeight: 600, color: "#ffc107", marginBottom: 2 }}>{game.title}</div>}
                        <div style={{ fontSize: 11, opacity: 0.6 }}>{game.opening || game.event} {game.year || game.date}</div>
                      </button>
                      {source === "imported" && user && (
                        <button onClick={() => deleteImportedGame(game.id)}
                          style={{ position: "absolute", top: 8, right: 8, background: "rgba(244,67,54,0.3)", border: "none", borderRadius: 4, color: "#fff", padding: "4px 8px", cursor: "pointer", fontSize: 10 }}>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Board */}
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Board chess={libraryChess} orientation={libraryOrientation} interactive={false} lastMove={lastMove} size={480} />
                <div style={{ display: "flex", gap: 8, marginTop: 20, width: "100%", maxWidth: 480 }}>
                  <button onClick={() => goToMove(0)} disabled={libraryMoveIndex === 0} style={{ flex: 1, padding: 14, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: libraryMoveIndex === 0 ? "default" : "pointer", opacity: libraryMoveIndex === 0 ? 0.4 : 1, fontSize: 18 }}>⏮</button>
                  <button onClick={() => goToMove(libraryMoveIndex - 1)} disabled={libraryMoveIndex === 0} style={{ flex: 1, padding: 14, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: libraryMoveIndex === 0 ? "default" : "pointer", opacity: libraryMoveIndex === 0 ? 0.4 : 1, fontSize: 18 }}>◀</button>
                  <div style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{libraryMoveIndex} / {libraryMoves.length}</div>
                  <button onClick={() => goToMove(libraryMoveIndex + 1)} disabled={libraryMoveIndex >= libraryMoves.length} style={{ flex: 1, padding: 14, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: libraryMoveIndex >= libraryMoves.length ? "default" : "pointer", opacity: libraryMoveIndex >= libraryMoves.length ? 0.4 : 1, fontSize: 18 }}>▶</button>
                  <button onClick={() => goToMove(libraryMoves.length)} disabled={libraryMoveIndex >= libraryMoves.length} style={{ flex: 1, padding: 14, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: libraryMoveIndex >= libraryMoves.length ? "default" : "pointer", opacity: libraryMoveIndex >= libraryMoves.length ? 0.4 : 1, fontSize: 18 }}>⏭</button>
                </div>
                <button onClick={() => setLibraryOrientation(o => o === "w" ? "b" : "w")} style={{ marginTop: 12, padding: "10px 20px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" }}>🔄 Flip Board (F)</button>
              </div>

              {/* Game info */}
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", maxHeight: 700 }}>
                {selectedGame ? (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <h2 style={{ margin: "0 0 4px 0", fontSize: 18 }}>{selectedGame.title || `${selectedGame.white} vs ${selectedGame.black}`}</h2>
                      {selectedGame.title && <div style={{ fontSize: 14, opacity: 0.8 }}>{selectedGame.white} vs {selectedGame.black}</div>}
                      {selectedGame.description && <p style={{ fontSize: 13, opacity: 0.7, margin: "8px 0 0 0", lineHeight: 1.5 }}>{selectedGame.description}</p>}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                        <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>{selectedGame.event}</span>
                        <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>{selectedGame.result}</span>
                        {(selectedGame.year || selectedGame.date) && <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>{selectedGame.year || selectedGame.date}</span>}
                        {selectedGame.url && (
                          <a href={selectedGame.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 6, color: "#81d4fa", textDecoration: "none" }}>
                            View online ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 8 }}>MOVES</div>
                    <div style={{ flex: 1, overflowY: "auto", background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 14 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {libraryMoves.map((move, idx) => (
                          <span key={idx} onClick={() => goToMove(idx + 1)}
                            style={{ padding: "6px 10px", borderRadius: 6, background: idx + 1 === libraryMoveIndex ? "#4CAF50" : "rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 14 }}>
                            {idx % 2 === 0 && <span style={{ opacity: 0.5, marginRight: 3 }}>{Math.floor(idx / 2) + 1}.</span>}{move}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>Select a game</div>
                )}
              </div>
            </div>
          )}

          {/* Initial state */}
          {games.length === 0 && !loadingGames && !error && source !== "imported" && (
            <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.7 }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>{SOURCES[source].icon}</div>
              <h2 style={{ margin: "0 0 10px 0" }}>{SOURCES[source].name}</h2>
              <p style={{ margin: 0, opacity: 0.7 }}>{SOURCES[source].desc}</p>
            </div>
          )}
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setShowImportModal(false)}>
          <div style={{ background: "#1e1e2e", borderRadius: 16, padding: 24, width: "90%", maxWidth: 600, maxHeight: "80vh", overflow: "auto" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Import PGN</h2>
              <button onClick={() => setShowImportModal(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>✕</button>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Upload PGN File</label>
              <input type="file" accept=".pgn" onChange={handleFileUpload}
                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff" }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Or Paste PGN Text</label>
              <textarea value={importText} onChange={(e) => setImportText(e.target.value)}
                placeholder={`[Event "Example Game"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "1-0"]\n\n1. e4 e5 2. Nf3 Nc6 ...`}
                style={{ width: "100%", height: 200, padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", fontFamily: "monospace", fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowImportModal(false)}
                style={{ flex: 1, padding: 14, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleImportPGN} disabled={importLoading}
                style={{ flex: 1, padding: 14, borderRadius: 8, border: "none", background: "#4CAF50", color: "#fff", cursor: "pointer", fontWeight: 600, opacity: importLoading ? 0.7 : 1 }}>
                {importLoading ? "Importing..." : "Import Games"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setShowAuthModal(false)}>
          <div style={{ background: "#1e1e2e", borderRadius: 16, padding: 24, width: "90%", maxWidth: 400 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>{authMode === "login" ? "Sign In" : "Create Account"}</h2>
              <button onClick={() => setShowAuthModal(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>✕</button>
            </div>
            
            {!supabase ? (
              <div style={{ textAlign: "center", padding: 20 }}>
                <p style={{ opacity: 0.7 }}>Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable auth.</p>
              </div>
            ) : (
              <form onSubmit={handleAuth}>
                {authError && (
                  <div style={{ background: authError.includes("Check your email") ? "rgba(76,175,80,0.2)" : "rgba(244,67,54,0.2)", border: `1px solid ${authError.includes("Check your email") ? "#4CAF50" : "#f44336"}`, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14 }}>
                    {authError}
                  </div>
                )}
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Email</label>
                  <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required
                    style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", boxSizing: "border-box" }}
                  />
                </div>
                
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Password</label>
                  <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required minLength={6}
                    style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", boxSizing: "border-box" }}
                  />
                </div>
                
                <button type="submit"
                  style={{ width: "100%", padding: 14, borderRadius: 8, border: "none", background: "#4CAF50", color: "#fff", cursor: "pointer", fontWeight: 600, marginBottom: 12 }}>
                  {authMode === "login" ? "Sign In" : "Create Account"}
                </button>
                
                <div style={{ textAlign: "center", fontSize: 14 }}>
                  {authMode === "login" ? (
                    <span>Don't have an account? <button type="button" onClick={() => { setAuthMode("signup"); setAuthError(null); }} style={{ background: "none", border: "none", color: "#4CAF50", cursor: "pointer", fontWeight: 600 }}>Sign up</button></span>
                  ) : (
                    <span>Already have an account? <button type="button" onClick={() => { setAuthMode("login"); setAuthError(null); }} style={{ background: "none", border: "none", color: "#4CAF50", cursor: "pointer", fontWeight: 600 }}>Sign in</button></span>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* GRANDMASTER - SELECT */}
      {mode === "grandmaster" && grandmasterView === "select" && (
        <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 24 }}>
            <BotSelector selectedBotId={selectedBotId} onSelect={setSelectedBotId} onPlay={() => setGrandmasterView("playing")} />
          </div>
        </div>
      )}

      {/* GRANDMASTER - PLAYING */}
      {mode === "grandmaster" && grandmasterView === "playing" && selectedBot && (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
          <PlayVsBot profile={selectedBot} onBack={() => setGrandmasterView("select")} />
        </div>
      )}
    </div>
  );
}
