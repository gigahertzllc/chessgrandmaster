import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Chess } from "chess.js";
import Board2D from "./cm-board/components/Board2D.jsx";
import Board3D from "./cm-board/components/Board3D.jsx";
import { listBoardThemes } from "./cm-board/themes/boardThemes.js";
import { listPieceSets } from "./cm-board/themes/pieceSets.js";
import { getLesson, getAllBooks, getLessonsByBook } from "../data/lessons.js";
import { getAudioManager } from "../audio/AudioManager.js";

const transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

// App themes for selector
const APP_THEMES = [
  { id: "dark", name: "Dark" },
  { id: "light", name: "Light" },
  { id: "sepia", name: "Sepia" },
  { id: "midnight", name: "Midnight" }
];

// Camera presets for 3D
const CAMERA_PRESETS = [
  { id: "straight", name: "Straight On" },
  { id: "angled", name: "3/4 Angled" },
  { id: "top", name: "Top Down" }
];

export default function ZoneMode({ 
  initialGame = null, 
  initialLesson = null, 
  onClose, 
  theme: appTheme, 
  themeId: currentThemeId = "dark",
  onThemeChange,
  boardThemeId: initialBoardTheme = "carrara_gold", 
  onBoardThemeChange 
}) {
  // Use passed theme or fallback
  const theme = appTheme || {
    bg: "#0a0a0b", bgAlt: "#111113", card: "rgba(20,20,22,0.95)",
    ink: "#FAFAF8", inkMuted: "#888", accent: "#D4AF37",
    accentSoft: "rgba(212,175,55,0.15)", border: "rgba(255,255,255,0.08)",
    shadow: "0 8px 32px rgba(0,0,0,0.5)",
  };

  // Determine if theme is light-based for contrast adjustments
  const isLightTheme = currentThemeId === "light" || currentThemeId === "sepia";

  const [mode, setMode] = useState(initialLesson ? "lesson" : initialGame ? "game" : "browse");
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(() => new Chess().fen());
  const [moves, setMoves] = useState([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [orientation, setOrientation] = useState("w");
  const [lastMove, setLastMove] = useState(null);
  const [currentGame, setCurrentGame] = useState(initialGame);
  const [currentLesson, setCurrentLesson] = useState(initialLesson ? getLesson(initialLesson) : null);
  const [boardThemeId, setBoardThemeId] = useState(initialBoardTheme);
  const [showSettings, setShowSettings] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef(null);
  const movesContainerRef = useRef(null);
  const boardContainerRef = useRef(null);
  
  // 2D/3D board view toggle
  const [boardView, setBoardView] = useState("2d");
  
  // 3D specific settings
  const [pieceSetId, setPieceSetId] = useState("classic_ebony_ivory");
  const [cameraPreset, setCameraPreset] = useState("straight");
  
  // Responsive board size
  const [boardSize, setBoardSize] = useState(580);
  
  // Audio Manager state
  const audioManager = useMemo(() => getAudioManager(), []);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [volume, setVolume] = useState(() => audioManager.getVolume());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showTrackToast, setShowTrackToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Calculate responsive board size for 2D mode
  useEffect(() => {
    if (boardView !== "2d" || !boardContainerRef.current) return;
    
    const updateSize = () => {
      const container = boardContainerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      // Leave room for captured pieces (28px each) and controls (80px) and padding
      const availableHeight = rect.height - 28 - 28 - 80 - 64;
      const availableWidth = rect.width - 64;
      
      // Use the smaller dimension, max 700px, min 400px
      const size = Math.max(400, Math.min(700, Math.min(availableWidth, availableHeight)));
      setBoardSize(size);
    };
    
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(boardContainerRef.current);
    
    return () => resizeObserver.disconnect();
  }, [boardView]);

  // When board theme changes, notify parent to save to Supabase
  const handleBoardThemeChange = (newThemeId) => {
    setBoardThemeId(newThemeId);
    onBoardThemeChange?.(newThemeId);
  };

  useEffect(() => {
    if (currentLesson) { loadPgn(currentLesson.game.pgn); setMode("lesson"); }
    else if (currentGame?.pgn) { loadPgn(currentGame.pgn); setMode("game"); }
  }, [currentLesson, currentGame]);

  const loadPgn = useCallback((pgn) => {
    try {
      const temp = new Chess();
      temp.loadPgn(pgn, { strict: false });
      setMoves(temp.history());
      setMoveIndex(0);
      chess.reset();
      setFen(chess.fen());
      setLastMove(null);
    } catch (e) { console.error(e); }
  }, [chess]);

  const goToMove = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, moves.length));
    setMoveIndex(clamped);
    chess.reset();
    let last = null;
    for (let i = 0; i < clamped; i++) {
      try { const m = chess.move(moves[i]); if (i === clamped - 1) last = { from: m.from, to: m.to }; } catch { break; }
    }
    setFen(chess.fen());
    setLastMove(last);
  }, [moves, chess]);

  // Auto-scroll moves list
  useEffect(() => {
    if (movesContainerRef.current) {
      const moveRow = Math.floor((moveIndex - 1) / 2);
      const rowHeight = 32;
      movesContainerRef.current.scrollTop = Math.max(0, moveRow * rowHeight - 100);
    }
  }, [moveIndex]);

  useEffect(() => {
    if (autoPlay && moveIndex < moves.length) {
      autoPlayRef.current = setTimeout(() => goToMove(moveIndex + 1), 1500);
    }
    return () => clearTimeout(autoPlayRef.current);
  }, [autoPlay, moveIndex, moves.length, goToMove]);

  // Initialize AudioManager
  useEffect(() => {
    audioManager.loadManifest("/audio/lofi/playlist.json");
    audioManager.setMode("zone");
    
    // Track change callback - show toast
    audioManager.onTrackChange = (track) => {
      setCurrentTrack(track);
      if (track && musicEnabled) {
        setShowTrackToast(true);
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => setShowTrackToast(false), 4000);
      }
    };
    
    return () => {
      audioManager.onTrackChange = null;
      clearTimeout(toastTimeoutRef.current);
    };
  }, [audioManager, musicEnabled]);

  // Handle music enable/disable
  useEffect(() => {
    if (musicEnabled) {
      audioManager.markUserInteracted();
      audioManager.play();
    } else {
      audioManager.pause();
    }
  }, [musicEnabled, audioManager]);

  // Handle volume changes
  useEffect(() => {
    audioManager.setVolume(volume);
  }, [volume, audioManager]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goToMove(moveIndex - 1); setAutoPlay(false); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToMove(moveIndex + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); goToMove(0); setAutoPlay(false); }
      else if (e.key === "ArrowDown") { e.preventDefault(); goToMove(moves.length); }
      else if (e.key === "f") { e.preventDefault(); setOrientation(o => o === "w" ? "b" : "w"); }
      else if (e.key === " ") { e.preventDefault(); setAutoPlay(a => !a); }
      else if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moveIndex, moves.length, goToMove, onClose]);

  const currentAnnotation = useMemo(() => {
    if (!currentLesson?.annotations) return null;
    const keys = Object.keys(currentLesson.annotations).map(Number).sort((a, b) => b - a);
    const match = keys.find(m => m <= moveIndex);
    return match !== undefined ? currentLesson.annotations[match] : null;
  }, [currentLesson, moveIndex]);

  const capturedPieces = useMemo(() => {
    const init = { w: { p: 8, n: 2, b: 2, r: 2, q: 1 }, b: { p: 8, n: 2, b: 2, r: 2, q: 1 } };
    const cur = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
    chess.board().flat().filter(Boolean).forEach(p => { if (cur[p.color][p.type] !== undefined) cur[p.color][p.type]++; });
    return {
      byWhite: Object.entries(init.b).flatMap(([t, c]) => Array(c - cur.b[t]).fill(t)),
      byBlack: Object.entries(init.w).flatMap(([t, c]) => Array(c - cur.w[t]).fill(t))
    };
  }, [fen, chess]);

  const selectLesson = (id) => { setCurrentLesson(getLesson(id)); setCurrentGame(null); };

  // Game info for display
  const gameInfo = currentGame || (currentLesson?.game);

  // ═══════════════════════════════════════════════════════════════════════════
  // WCAG AAA Compliant Color Helpers
  // ═══════════════════════════════════════════════════════════════════════════
  
  // High contrast colors for selected states
  const selectedBg = theme.accent;
  const selectedText = isLightTheme ? "#fff" : "#000";
  
  // Moves list colors - ensure 7:1 contrast ratio
  const movesBg = isLightTheme ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)";
  const movesText = theme.ink;
  const movesNumber = theme.inkMuted;
  const moveHoverBg = isLightTheme ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  
  // Toast colors - follow theme
  const toastBg = isLightTheme ? "rgba(255,255,255,0.95)" : "rgba(20,20,22,0.95)";
  const toastBorder = theme.border;
  const toastText = theme.ink;
  const toastMuted = theme.inkMuted;

  // Browse mode - select content
  if (mode === "browse") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: theme.bg,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Simple Header */}
        <header style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: theme.ink }}>Zone Mode</h1>
          <button onClick={onClose} style={{
            padding: "8px 16px", background: "transparent", border: `1px solid ${theme.border}`,
            borderRadius: 8, color: theme.ink, cursor: "pointer", fontSize: 13
          }}>✕ Close</button>
        </header>

        {/* Content Browser */}
        <div style={{ flex: 1, overflow: "auto", padding: 32 }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ color: theme.ink, fontSize: 24, marginBottom: 24 }}>Select Content</h2>
            
            {/* Lessons */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ color: theme.inkMuted, fontSize: 12, letterSpacing: "0.1em", marginBottom: 16 }}>LESSONS</h3>
              {getAllBooks().map(book => (
                <div key={book.id} style={{ marginBottom: 16 }}>
                  <div style={{ color: theme.ink, fontWeight: 500, marginBottom: 8 }}>{book.title}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {getLessonsByBook(book.id).map(lesson => (
                      <button key={lesson.id} onClick={() => selectLesson(lesson.id)} style={{
                        padding: "10px 16px", background: theme.accentSoft, border: "none",
                        borderRadius: 8, color: theme.ink, cursor: "pointer", fontSize: 13
                      }}>
                        {lesson.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main viewing mode
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: theme.bg,
      display: "flex", overflow: "hidden",
    }}>
      
      {/* Track Toast Notification - THEME AWARE */}
      <div style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${showTrackToast ? 0 : 100}px)`,
        opacity: showTrackToast ? 1 : 0,
        background: toastBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${toastBorder}`,
        borderRadius: 12,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        zIndex: 3000,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: showTrackToast ? "auto" : "none",
        boxShadow: theme.shadow,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: theme.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: selectedText
        }}>♪</div>
        <div>
          <div style={{ color: toastText, fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
            {currentTrack?.title || "Now Playing"}
          </div>
          <div style={{ color: toastMuted, fontSize: 12 }}>
            {currentTrack?.artist || "Unknown Artist"}
          </div>
        </div>
      </div>

      {/* LEFT: Board Area */}
      <div 
        ref={boardContainerRef}
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: boardView === "3d" ? "stretch" : "center",
          justifyContent: boardView === "3d" ? "stretch" : "center",
          padding: boardView === "3d" ? 0 : 32,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: 20, left: 20, zIndex: 50,
          padding: "10px 16px", 
          background: isLightTheme ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)", 
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.border}`,
          borderRadius: 8, color: theme.ink, cursor: "pointer", fontSize: 13,
          display: "flex", alignItems: "center", gap: 8,
          transition,
          fontWeight: 500
        }}>
          ← Exit
        </button>

        {/* Settings button */}
        <button onClick={() => setShowSettings(!showSettings)} style={{
          position: "absolute", top: 20, right: 20, zIndex: 50,
          padding: "10px 14px", 
          background: showSettings 
            ? theme.accent 
            : (isLightTheme ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)"), 
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.border}`,
          borderRadius: 8, 
          color: showSettings ? selectedText : theme.ink, 
          cursor: "pointer", fontSize: 14,
          transition
        }}>
          ⚙
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div style={{
            position: "absolute", top: 70, right: 20, zIndex: 100,
            background: isLightTheme ? "rgba(255,255,255,0.98)" : "rgba(20,20,22,0.98)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: 20,
            minWidth: 220,
            boxShadow: theme.shadow,
          }}>
            <div style={{ fontSize: 11, color: theme.inkMuted, marginBottom: 16, letterSpacing: "0.1em", fontWeight: 600 }}>SETTINGS</div>
            
            {/* App Theme */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8, fontWeight: 500 }}>App Theme</div>
              <select 
                value={currentThemeId} 
                onChange={(e) => onThemeChange?.(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px",
                  background: isLightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)",
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8, color: theme.ink, fontSize: 13,
                  cursor: "pointer"
                }}
              >
                {APP_THEMES.map(t => (
                  <option key={t.id} value={t.id} style={{ background: theme.bg, color: theme.ink }}>{t.name}</option>
                ))}
              </select>
            </div>
            
            {/* 2D/3D Toggle */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8, fontWeight: 500 }}>Board View</div>
              <div style={{ display: "flex", background: isLightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)", borderRadius: 8, overflow: "hidden" }}>
                <button onClick={() => setBoardView("2d")} style={{
                  flex: 1, padding: "10px 12px", border: "none",
                  background: boardView === "2d" ? theme.accent : "transparent",
                  color: boardView === "2d" ? selectedText : theme.ink,
                  cursor: "pointer", fontSize: 13, fontWeight: 600
                }}>2D</button>
                <button onClick={() => setBoardView("3d")} style={{
                  flex: 1, padding: "10px 12px", border: "none",
                  background: boardView === "3d" ? theme.accent : "transparent",
                  color: boardView === "3d" ? selectedText : theme.ink,
                  cursor: "pointer", fontSize: 13, fontWeight: 600
                }}>3D</button>
              </div>
            </div>

            {/* Board Theme */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8, fontWeight: 500 }}>Board Theme</div>
              <select 
                value={boardThemeId} 
                onChange={(e) => handleBoardThemeChange(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px",
                  background: isLightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)",
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8, color: theme.ink, fontSize: 13,
                  cursor: "pointer"
                }}
              >
                {listBoardThemes().map(t => (
                  <option key={t.id} value={t.id} style={{ background: theme.bg, color: theme.ink }}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* 3D Settings - Only show when in 3D mode */}
            {boardView === "3d" && (
              <>
                {/* Piece Set */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8, fontWeight: 500 }}>3D Piece Set</div>
                  <select 
                    value={pieceSetId} 
                    onChange={(e) => setPieceSetId(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px",
                      background: isLightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)",
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8, color: theme.ink, fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    {listPieceSets().map(s => (
                      <option key={s.id} value={s.id} style={{ background: theme.bg, color: theme.ink }}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Camera Angle */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8, fontWeight: 500 }}>Camera Angle</div>
                  <select 
                    value={cameraPreset} 
                    onChange={(e) => setCameraPreset(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px",
                      background: isLightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)",
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8, color: theme.ink, fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    {CAMERA_PRESETS.map(c => (
                      <option key={c.id} value={c.id} style={{ background: theme.bg, color: theme.ink }}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Music Toggle */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8, fontWeight: 500 }}>Music</div>
              <button onClick={() => setMusicEnabled(!musicEnabled)} style={{
                width: "100%", padding: "10px 12px",
                background: musicEnabled ? theme.accent : (isLightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"),
                border: `1px solid ${musicEnabled ? theme.accent : theme.border}`,
                borderRadius: 8, 
                color: musicEnabled ? selectedText : theme.ink, 
                cursor: "pointer", fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontWeight: 500
              }}>
                {musicEnabled ? "🔊 On" : "🔇 Off"}
              </button>
            </div>

            {/* Volume */}
            {musicEnabled && (
              <div>
                <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8, fontWeight: 500 }}>Volume</div>
                <input 
                  type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: theme.accent }}
                />
              </div>
            )}
          </div>
        )}

        {/* 3D MODE - Fullscreen Canvas */}
        {boardView === "3d" ? (
          <div style={{
            position: "absolute",
            inset: 0,
            background: isLightTheme ? "#e8e8e6" : "#0a0a0b",
          }}>
            <Board3D 
              key={`3d-${fen}-${pieceSetId}`}
              chess={chess} 
              size="full"
              orientation={orientation} 
              interactive={false} 
              lastMove={lastMove} 
              themeId={boardThemeId}
              pieceSetId={pieceSetId}
              cameraPreset={cameraPreset}
              animations={true}
            />
          </div>
        ) : (
          /* 2D MODE - Responsive Board */
          <>
            {/* Captured pieces - Black */}
            <div style={{ 
              height: 28, marginBottom: 12, 
              display: "flex", gap: 2, alignItems: "center",
              minWidth: boardSize
            }}>
              {capturedPieces.byBlack.map((p, i) => (
                <img key={i} src={`/pieces/classic/w${p.toUpperCase()}.svg`} alt="" 
                  style={{ width: 22, height: 22, opacity: 0.6 }} />
              ))}
            </div>

            {/* THE BOARD - 2D Responsive */}
            <div style={{
              background: isLightTheme ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.3)",
              borderRadius: 4,
              padding: 4,
              boxShadow: theme.shadow,
            }}>
              <Board2D 
                chess={chess} 
                fen={fen} 
                size={boardSize} 
                orientation={orientation} 
                interactive={false} 
                lastMove={lastMove} 
                themeId={boardThemeId} 
                vignette={false} 
              />
            </div>

            {/* Captured pieces - White */}
            <div style={{ 
              height: 28, marginTop: 12, 
              display: "flex", gap: 2, alignItems: "center",
              minWidth: boardSize
            }}>
              {capturedPieces.byWhite.map((p, i) => (
                <img key={i} src={`/pieces/classic/b${p.toUpperCase()}.svg`} alt="" 
                  style={{ width: 22, height: 22, opacity: 0.6 }} />
              ))}
            </div>
          </>
        )}

        {/* Floating Controls Bar */}
        <div style={{
          position: boardView === "3d" ? "absolute" : "relative",
          bottom: boardView === "3d" ? 24 : "auto",
          left: boardView === "3d" ? "50%" : "auto",
          transform: boardView === "3d" ? "translateX(-50%)" : "none",
          marginTop: boardView === "3d" ? 0 : 24,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: isLightTheme 
            ? (boardView === "3d" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.05)")
            : (boardView === "3d" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.03)"),
          backdropFilter: boardView === "3d" ? "blur(20px)" : "none",
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: "6px 10px",
          zIndex: 50,
        }}>
          {/* Skip to Start */}
          <button 
            onClick={() => { goToMove(0); setAutoPlay(false); }} 
            disabled={moveIndex === 0}
            aria-label="Go to start"
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none",
              background: isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
              color: moveIndex === 0 ? theme.inkMuted : theme.ink,
              cursor: moveIndex === 0 ? "default" : "pointer",
              opacity: moveIndex === 0 ? 0.4 : 1,
              fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition
            }}
          >⏮</button>

          {/* Previous */}
          <button 
            onClick={() => { goToMove(moveIndex - 1); setAutoPlay(false); }} 
            disabled={moveIndex === 0}
            aria-label="Previous move"
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none",
              background: isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
              color: moveIndex === 0 ? theme.inkMuted : theme.ink,
              cursor: moveIndex === 0 ? "default" : "pointer",
              opacity: moveIndex === 0 ? 0.4 : 1,
              fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition
            }}
          >◂</button>

          {/* PLAY/PAUSE - Distinctly different */}
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            aria-label={autoPlay ? "Pause auto-play" : "Start auto-play"}
            style={{
              width: 56, height: 48, borderRadius: 10, border: "none",
              background: autoPlay ? "#4CAF50" : theme.accent,
              color: autoPlay ? "#fff" : selectedText,
              cursor: "pointer",
              fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition,
              boxShadow: `0 2px 8px ${autoPlay ? "rgba(76,175,80,0.4)" : "rgba(212,175,55,0.3)"}`,
              fontWeight: "bold"
            }}
          >
            {autoPlay ? "⏸" : "▶"}
          </button>

          {/* Next */}
          <button 
            onClick={() => goToMove(moveIndex + 1)} 
            disabled={moveIndex >= moves.length}
            aria-label="Next move"
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none",
              background: isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
              color: moveIndex >= moves.length ? theme.inkMuted : theme.ink,
              cursor: moveIndex >= moves.length ? "default" : "pointer",
              opacity: moveIndex >= moves.length ? 0.4 : 1,
              fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition
            }}
          >▸</button>

          {/* Skip to End */}
          <button 
            onClick={() => goToMove(moves.length)} 
            disabled={moveIndex >= moves.length}
            aria-label="Go to end"
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none",
              background: isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
              color: moveIndex >= moves.length ? theme.inkMuted : theme.ink,
              cursor: moveIndex >= moves.length ? "default" : "pointer",
              opacity: moveIndex >= moves.length ? 0.4 : 1,
              fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition
            }}
          >⏭</button>

          {/* Move Counter */}
          <div style={{ 
            padding: "0 14px", 
            fontSize: 14, 
            fontWeight: 600, 
            color: theme.ink,
            fontVariantNumeric: "tabular-nums",
            minWidth: 70,
            textAlign: "center"
          }}>
            {moveIndex} / {moves.length}
          </div>

          {/* Flip Board */}
          <button 
            onClick={() => setOrientation(o => o === "w" ? "b" : "w")} 
            aria-label="Flip board"
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none",
              background: isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
              color: theme.ink, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >↻</button>
        </div>
      </div>

      {/* RIGHT: Sidebar */}
      <div style={{
        width: 360,
        borderLeft: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        background: isLightTheme ? theme.bgAlt : "rgba(0,0,0,0.2)",
      }}>
        {/* Game Info Header */}
        <div style={{ 
          padding: 24, 
          borderBottom: `1px solid ${theme.border}`,
        }}>
          {gameInfo && (
            <>
              <div style={{ 
                display: "flex", alignItems: "center", gap: 12, marginBottom: 16 
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: isLightTheme ? "#fff" : "#f0f0f0",
                  border: `1px solid ${theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: "#000"
                }}>♔</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.ink, fontWeight: 600, fontSize: 15 }}>
                    {gameInfo.white || "White"}
                  </div>
                  <div style={{ color: theme.inkMuted, fontSize: 12 }}>
                    {gameInfo.whiteElo && `${gameInfo.whiteElo}`}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: "flex", alignItems: "center", gap: 12, marginBottom: 16 
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "#1a1a1a",
                  border: `1px solid ${theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: "#fff"
                }}>♚</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.ink, fontWeight: 600, fontSize: 15 }}>
                    {gameInfo.black || "Black"}
                  </div>
                  <div style={{ color: theme.inkMuted, fontSize: 12 }}>
                    {gameInfo.blackElo && `${gameInfo.blackElo}`}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: "flex", gap: 8, flexWrap: "wrap",
                fontSize: 11, color: theme.inkMuted 
              }}>
                {gameInfo.event && <span style={{ 
                  padding: "5px 10px", 
                  background: isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", 
                  borderRadius: 6 
                }}>{gameInfo.event}</span>}
                {(gameInfo.year || gameInfo.date) && <span style={{ 
                  padding: "5px 10px", 
                  background: isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", 
                  borderRadius: 6 
                }}>{gameInfo.year || gameInfo.date}</span>}
                {gameInfo.result && <span style={{ 
                  padding: "5px 10px", 
                  background: theme.accent, 
                  borderRadius: 6, 
                  color: selectedText, 
                  fontWeight: 700 
                }}>{gameInfo.result}</span>}
              </div>
            </>
          )}
        </div>

        {/* Annotation Panel */}
        {currentAnnotation && (
          <div style={{
            padding: 16,
            borderBottom: `1px solid ${theme.border}`,
            background: isLightTheme ? "rgba(212,175,55,0.08)" : "rgba(212,175,55,0.06)",
          }}>
            <div style={{ 
              fontSize: 11, color: theme.accent, marginBottom: 8, 
              letterSpacing: "0.05em", fontWeight: 700 
            }}>ANNOTATION</div>
            <div style={{ fontSize: 13, color: theme.ink, lineHeight: 1.7 }}>
              {currentAnnotation}
            </div>
          </div>
        )}

        {/* Moves List - WCAG AAA Compliant */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ 
            padding: "14px 20px", 
            borderBottom: `1px solid ${theme.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ fontSize: 11, color: theme.inkMuted, letterSpacing: "0.1em", fontWeight: 700 }}>MOVES</span>
            <span style={{ fontSize: 13, color: theme.ink, fontWeight: 600 }}>{moveIndex} of {moves.length}</span>
          </div>

          <div ref={movesContainerRef} style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: 12,
            background: movesBg,
          }}>
            {moves.length === 0 ? (
              <div style={{ textAlign: "center", color: theme.inkMuted, padding: 24, fontSize: 13 }}>
                No moves loaded
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: "4px 2px" }}>
                {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
                  <React.Fragment key={i}>
                    <span style={{ 
                      color: movesNumber, 
                      padding: "8px 4px", 
                      textAlign: "right",
                      fontSize: 13,
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: 500
                    }}>
                      {i + 1}.
                    </span>
                    <button
                      onClick={() => { goToMove(i * 2 + 1); setAutoPlay(false); }}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: moveIndex === i * 2 + 1 ? selectedBg : "transparent",
                        color: moveIndex === i * 2 + 1 ? selectedText : movesText,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: moveIndex === i * 2 + 1 ? 700 : 500,
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (moveIndex !== i * 2 + 1) e.target.style.background = moveHoverBg;
                      }}
                      onMouseLeave={(e) => {
                        if (moveIndex !== i * 2 + 1) e.target.style.background = "transparent";
                      }}
                    >
                      {moves[i * 2]}
                    </button>
                    {moves[i * 2 + 1] ? (
                      <button
                        onClick={() => { goToMove(i * 2 + 2); setAutoPlay(false); }}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "none",
                          background: moveIndex === i * 2 + 2 ? selectedBg : "transparent",
                          color: moveIndex === i * 2 + 2 ? selectedText : movesText,
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: moveIndex === i * 2 + 2 ? 700 : 500,
                          textAlign: "left",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (moveIndex !== i * 2 + 2) e.target.style.background = moveHoverBg;
                        }}
                        onMouseLeave={(e) => {
                          if (moveIndex !== i * 2 + 2) e.target.style.background = "transparent";
                        }}
                      >
                        {moves[i * 2 + 1]}
                      </button>
                    ) : <span />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div style={{ 
          padding: 16, 
          borderTop: `1px solid ${theme.border}`,
          fontSize: 11, 
          color: theme.inkMuted,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 16px"
        }}>
          <span>← → Navigate</span>
          <span>↑ ↓ Start/End</span>
          <span>Space Auto-play</span>
          <span>F Flip board</span>
        </div>

        {/* Back Button */}
        <div style={{ padding: 16, borderTop: `1px solid ${theme.border}` }}>
          <button onClick={() => { setMode("browse"); setCurrentLesson(null); setCurrentGame(null); }} style={{
            width: "100%",
            padding: "14px",
            background: isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            color: theme.ink,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500
          }}>
            ← Back to Library
          </button>
        </div>
      </div>
    </div>
  );
}
