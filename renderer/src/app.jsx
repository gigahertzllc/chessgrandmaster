import React, { useEffect, useState, useCallback } from "react";
import { Chess } from "chess.js";
import Board from "./components/Board.jsx";
import BotSelector from "./components/BotSelector.jsx";
import PlayVsBot from "./components/PlayVsBot.jsx";
import { personalities } from "./engine/personalities.js";

/**
 * Chessmaster 2026 - Main Application
 * 
 * Three game sources:
 * 1. Lichess Online - games played on lichess.org
 * 2. Lichess Masters - 2.5M+ historical OTB master games
 * 3. Chess.com - games played on chess.com
 */

const SOURCES = {
  lichess: { id: "lichess", name: "Lichess Online", icon: "🐴", desc: "Online games from lichess.org" },
  masters: { id: "masters", name: "Masters Database", icon: "👑", desc: "2.5M+ historical OTB games (Fischer, Morphy, Kasparov...)" },
  chesscom: { id: "chesscom", name: "Chess.com", icon: "♟️", desc: "Online games from chess.com" }
};

const FAMOUS_PLAYERS = {
  lichess: [
    { username: "DrNykterstein", name: "Magnus Carlsen" },
    { username: "Hikaru", name: "Hikaru Nakamura" },
    { username: "Firouzja2003", name: "Alireza Firouzja" },
    { username: "DanielNaroditsky", name: "Daniel Naroditsky" },
    { username: "penguingm1", name: "Andrew Tang" },
  ],
  masters: [
    { name: "Kasparov, Garry", searchName: "Kasparov" },
    { name: "Fischer, Robert James", searchName: "Fischer" },
    { name: "Carlsen, Magnus", searchName: "Carlsen" },
    { name: "Morphy, Paul", searchName: "Morphy" },
    { name: "Tal, Mikhail", searchName: "Tal" },
    { name: "Capablanca, Jose Raul", searchName: "Capablanca" },
    { name: "Anand, Viswanathan", searchName: "Anand" },
    { name: "Karpov, Anatoly", searchName: "Karpov" },
    { name: "Alekhine, Alexander", searchName: "Alekhine" },
    { name: "Spassky, Boris", searchName: "Spassky" },
    { name: "Petrosian, Tigran", searchName: "Petrosian" },
    { name: "Botvinnik, Mikhail", searchName: "Botvinnik" },
    { name: "Kramnik, Vladimir", searchName: "Kramnik" },
    { name: "Caruana, Fabiano", searchName: "Caruana" },
    { name: "Nepomniachtchi, Ian", searchName: "Nepomniachtchi" },
    { name: "Ding, Liren", searchName: "Ding" },
  ],
  chesscom: [
    { username: "MagnusCarlsen", name: "Magnus Carlsen" },
    { username: "Hikaru", name: "Hikaru Nakamura" },
    { username: "GothamChess", name: "Levy Rozman" },
    { username: "DanielNaroditsky", name: "Daniel Naroditsky" },
    { username: "Firouzja2003", name: "Alireza Firouzja" },
  ]
};

export default function App() {
  const [mode, setMode] = useState("library");

  // Library state
  const [source, setSource] = useState("masters");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
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

  // Grandmaster state
  const [selectedBotId, setSelectedBotId] = useState("carlsen");
  const [grandmasterView, setGrandmasterView] = useState("select");

  // ═══════════════════════════════════════════════════════════════════════════
  // LICHESS ONLINE SEARCH
  // ═══════════════════════════════════════════════════════════════════════════
  const searchLichess = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    try {
      const res = await fetch(`https://lichess.org/api/player/autocomplete?term=${encodeURIComponent(query)}&object=true`);
      if (res.ok) {
        const data = await res.json();
        return (data.result || []).map(p => ({
          username: p.id,
          name: p.name || p.id,
          title: p.title,
          source: "lichess"
        }));
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
          whiteElo: w?.rating,
          blackElo: b?.rating,
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
  // LICHESS MASTERS DATABASE
  // No autocomplete API - filter from famous players list
  // ═══════════════════════════════════════════════════════════════════════════
  const searchMasters = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    // Filter from our known masters list
    return FAMOUS_PLAYERS.masters
      .filter(p => p.name.toLowerCase().includes(q) || p.searchName.toLowerCase().includes(q))
      .map(p => ({ name: p.name, searchName: p.searchName, source: "masters" }));
  }, []);

  const fetchMastersGames = useCallback(async (player) => {
    // The Masters explorer needs the player name in specific format
    // We'll search through common opening moves to find games
    const searchName = typeof player === "string" 
      ? player 
      : (player.searchName || player.name?.split(",")[0] || "");
    
    if (!searchName) throw new Error("Invalid player name");
    
    console.log("Searching Masters DB for:", searchName);
    
    const games = [];
    const seenIds = new Set();
    
    // Search starting position and common first moves
    const positions = [
      "", // starting position
      "e2e4", // 1.e4
      "d2d4", // 1.d4
      "c2c4", // 1.c4
      "g1f3", // 1.Nf3
      "e2e4,e7e5", // 1.e4 e5
      "e2e4,c7c5", // 1.e4 c5 (Sicilian)
      "d2d4,d7d5", // 1.d4 d5
      "d2d4,g8f6", // 1.d4 Nf6
    ];
    
    for (const play of positions) {
      if (games.length >= 30) break;
      
      try {
        const url = `https://explorer.lichess.ovh/masters?play=${play}&topGames=15&player=${encodeURIComponent(searchName)}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        
        const data = await res.json();
        
        for (const g of (data.topGames || [])) {
          if (seenIds.has(g.id) || games.length >= 30) continue;
          seenIds.add(g.id);
          
          // Verify the player is actually in this game
          const whiteName = g.white?.name || "";
          const blackName = g.black?.name || "";
          if (!whiteName.toLowerCase().includes(searchName.toLowerCase()) && 
              !blackName.toLowerCase().includes(searchName.toLowerCase())) {
            continue;
          }
          
          // Fetch the PGN for this game
          try {
            const pgnRes = await fetch(`https://explorer.lichess.ovh/masters/pgn/${g.id}`);
            if (pgnRes.ok) {
              const pgn = await pgnRes.text();
              games.push({
                id: g.id,
                white: g.white?.name || "?",
                black: g.black?.name || "?",
                whiteElo: g.white?.rating,
                blackElo: g.black?.rating,
                result: g.winner === "white" ? "1-0" : g.winner === "black" ? "0-1" : "½-½",
                date: g.year ? String(g.year) : "",
                event: g.month ? `${g.year}.${String(g.month).padStart(2, "0")}` : String(g.year || ""),
                pgn,
                source: "masters"
              });
            }
          } catch (e) { /* skip this game */ }
        }
      } catch (e) {
        console.error("Masters fetch error:", e);
      }
    }
    
    if (games.length === 0) {
      throw new Error(`No games found for "${searchName}" in Masters database`);
    }
    
    return games;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHESS.COM
  // ═══════════════════════════════════════════════════════════════════════════
  const searchChessCom = useCallback(async (query) => {
    // Chess.com doesn't have a search API, so we just return the query as a potential username
    if (!query || query.length < 2) return [];
    return [{ username: query, name: query, source: "chesscom" }];
  }, []);

  const fetchChessComGames = useCallback(async (username) => {
    // Get archives list
    const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
    if (!archivesRes.ok) throw new Error(`Player not found on Chess.com`);
    
    const archives = await archivesRes.json();
    const archiveUrls = archives.archives || [];
    
    if (archiveUrls.length === 0) throw new Error("No games found");
    
    // Get the most recent archive
    const recentUrl = archiveUrls[archiveUrls.length - 1];
    const gamesRes = await fetch(recentUrl);
    if (!gamesRes.ok) throw new Error("Failed to load games");
    
    const gamesData = await gamesRes.json();
    
    return (gamesData.games || []).slice(-30).reverse().map(g => {
      return {
        id: g.uuid || g.url,
        white: g.white?.username || "?",
        black: g.black?.username || "?",
        whiteElo: g.white?.rating,
        blackElo: g.black?.rating,
        result: g.white?.result === "win" ? "1-0" : g.black?.result === "win" ? "0-1" : "½-½",
        date: g.end_time ? new Date(g.end_time * 1000).toLocaleDateString() : "",
        event: g.time_class || "Online",
        opening: g.eco ? `${g.eco}` : null,
        pgn: g.pgn,
        source: "chesscom",
        url: g.url
      };
    }).filter(g => g.pgn);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFIED SEARCH
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      try {
        let results = [];
        if (source === "lichess") {
          results = await searchLichess(searchQuery);
        } else if (source === "masters") {
          results = await searchMasters(searchQuery);
        } else if (source === "chesscom") {
          results = await searchChessCom(searchQuery);
        }
        setSearchResults(results);
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, source, searchLichess, searchMasters, searchChessCom]);

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
      } else if (source === "masters") {
        // Pass the full player object so we can use searchName
        fetchedGames = await fetchMastersGames(player);
      } else if (source === "chesscom") {
        fetchedGames = await fetchChessComGames(player.username);
      }
      
      setGames(fetchedGames);
      if (fetchedGames.length > 0) {
        handleSelectGame(fetchedGames[0]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingGames(false);
    }
  }, [source, fetchLichessGames, fetchMastersGames, fetchChessComGames]);

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
      if (mode !== "library" || !selectedGame) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); goToMove(libraryMoveIndex - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToMove(libraryMoveIndex + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); goToMove(0); }
      else if (e.key === "ArrowDown") { e.preventDefault(); goToMove(libraryMoves.length); }
      else if (e.key === "f" || e.key === "F") { e.preventDefault(); setLibraryOrientation(o => o === "w" ? "b" : "w"); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, selectedGame, libraryMoveIndex, libraryMoves.length, goToMove]);

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
  const famousForSource = FAMOUS_PLAYERS[source] || [];

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
        </div>
      </header>

      {/* LIBRARY MODE */}
      {mode === "library" && (
        <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
          {/* Source Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {Object.values(SOURCES).map(s => (
              <button key={s.id} onClick={() => { setSource(s.id); setGames([]); setCurrentPlayer(null); setSearchQuery(""); }}
                style={{
                  flex: 1, padding: "16px 20px", borderRadius: 12,
                  border: source === s.id ? "2px solid #4CAF50" : "2px solid transparent",
                  background: source === s.id ? "rgba(76,175,80,0.15)" : "rgba(255,255,255,0.05)",
                  color: "#fff", cursor: "pointer", textAlign: "left"
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={source === "masters" ? "Search player (e.g. Fischer, Carlsen, Morphy)..." : "Search username..."}
                style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box" }}
              />
              {searchResults.length > 0 && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1e1e2e", borderRadius: 10, marginTop: 4, maxHeight: 250, overflowY: "auto", zIndex: 100, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  {searchResults.map((p, i) => (
                    <button key={i} onClick={() => { setSearchQuery(p.name || p.username); fetchGames(p); }}
                      style={{ width: "100%", padding: "12px 16px", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "transparent", color: "#fff", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                      {p.title && <span style={{ fontSize: 11, padding: "2px 6px", background: "rgba(255,193,7,0.3)", borderRadius: 4, color: "#ffc107", fontWeight: 700 }}>{p.title}</span>}
                      <span style={{ fontWeight: 600 }}>{p.name || p.username}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10 }}>POPULAR PLAYERS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {famousForSource.map((p, i) => (
                  <button key={i} onClick={() => { setSearchQuery(p.name || p.username); fetchGames(p); }}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                    {p.name || p.username}
                  </button>
                ))}
              </div>
            </div>
          </div>

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

          {/* Games */}
          {currentPlayer && !loadingGames && (
            <div style={{ display: "grid", gridTemplateColumns: "350px 520px 1fr", gap: 20 }}>
              {/* Game list */}
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, maxHeight: 700, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: 16, opacity: 0.8 }}>
                  {currentPlayer.name || currentPlayer.username} ({games.length} games)
                </h3>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                  {games.map((game, i) => (
                    <button key={game.id || i} onClick={() => handleSelectGame(game)}
                      style={{
                        padding: "12px 14px", borderRadius: 10, textAlign: "left", cursor: "pointer",
                        border: selectedGame?.id === game.id ? "2px solid #4CAF50" : "2px solid transparent",
                        background: selectedGame?.id === game.id ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)",
                        color: "#fff"
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{game.white} vs {game.black}</span>
                        <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: game.result === "1-0" ? "rgba(76,175,80,0.3)" : game.result === "0-1" ? "rgba(244,67,54,0.3)" : "rgba(255,255,255,0.1)" }}>{game.result}</span>
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.6 }}>{game.opening || game.event} {game.date && `• ${game.date}`}</div>
                      {game.whiteElo && game.blackElo && <div style={{ fontSize: 10, opacity: 0.4, marginTop: 2 }}>{game.whiteElo} vs {game.blackElo}</div>}
                    </button>
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
                <div style={{ marginTop: 8, fontSize: 12, opacity: 0.5 }}>← → to navigate</div>
              </div>

              {/* Game info */}
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", maxHeight: 700 }}>
                {selectedGame ? (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <h2 style={{ margin: "0 0 8px 0", fontSize: 18 }}>{selectedGame.white} vs {selectedGame.black}</h2>
                      <div style={{ fontSize: 14, opacity: 0.7 }}>{selectedGame.opening}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                        <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>{selectedGame.event}</span>
                        <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>{selectedGame.result}</span>
                        {selectedGame.date && <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>{selectedGame.date}</span>}
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
          {!currentPlayer && !loadingGames && (
            <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.7 }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>{SOURCES[source].icon}</div>
              <h2 style={{ margin: "0 0 10px 0" }}>{SOURCES[source].name}</h2>
              <p style={{ margin: 0, opacity: 0.7 }}>{SOURCES[source].desc}</p>
            </div>
          )}
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
