import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Chess } from "chess.js";
import Board2D from "./cm-board/components/Board2D.jsx";
import Board3D from "./cm-board/components/Board3D.jsx";
import { listBoardThemes } from "./cm-board/themes/boardThemes.js";
import { getLesson, getAllBooks, getLessonsByBook } from "../data/lessons.js";
import { getAudioManager } from "../audio/AudioManager.js";

const transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

export default function ZoneMode({ initialGame = null, initialLesson = null, onClose, theme: appTheme, boardThemeId: initialBoardTheme = "carrara_gold", onBoardThemeChange }) {
  const theme = appTheme || {
    bg: "#0a0a0b", bgAlt: "#111113", card: "rgba(20,20,22,0.95)",
    ink: "#FAFAF8", inkMuted: "#888", accent: "#D4AF37",
    accentSoft: "rgba(212,175,55,0.15)", border: "rgba(255,255,255,0.08)",
    shadow: "0 8px 32px rgba(0,0,0,0.5)",
  };

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
  
  // 2D/3D board view toggle
  const [boardView, setBoardView] = useState("2d");
  
  // Audio Manager state
  const audioManager = useMemo(() => getAudioManager(), []);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [volume, setVolume] = useState(() => audioManager.getVolume());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showTrackToast, setShowTrackToast] = useState(false);
  const toastTimeoutRef = useRef(null);

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
      const rowHeight = 28;
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
      
      {/* Track Toast Notification */}
      <div style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${showTrackToast ? 0 : 100}px)`,
        opacity: showTrackToast ? 1 : 0,
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 3000,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: showTrackToast ? "auto" : "none",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: theme.accentSoft,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20
        }}>🎵</div>
        <div>
          <div style={{ color: theme.ink, fontWeight: 500, fontSize: 13 }}>
            {currentTrack?.title || "Now Playing"}
          </div>
          <div style={{ color: theme.inkMuted, fontSize: 11 }}>
            {currentTrack?.artist || "Unknown Artist"}
          </div>
        </div>
      </div>

      {/* LEFT: Board Area */}
      <div style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        position: "relative",
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: 20, left: 20,
          padding: "10px 16px", background: "rgba(255,255,255,0.05)", 
          border: `1px solid ${theme.border}`,
          borderRadius: 8, color: theme.ink, cursor: "pointer", fontSize: 13,
          display: "flex", alignItems: "center", gap: 8,
          transition
        }}>
          ← Exit
        </button>

        {/* Settings button */}
        <button onClick={() => setShowSettings(!showSettings)} style={{
          position: "absolute", top: 20, right: 20,
          padding: "10px 14px", background: showSettings ? theme.accentSoft : "rgba(255,255,255,0.05)", 
          border: `1px solid ${theme.border}`,
          borderRadius: 8, color: theme.ink, cursor: "pointer", fontSize: 14,
          transition
        }}>
          ⚙️
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div style={{
            position: "absolute", top: 70, right: 20,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: 16,
            minWidth: 200,
            zIndex: 100,
          }}>
            <div style={{ fontSize: 11, color: theme.inkMuted, marginBottom: 12, letterSpacing: "0.05em" }}>SETTINGS</div>
            
            {/* 2D/3D Toggle */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8 }}>Board View</div>
              <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 6, overflow: "hidden" }}>
                <button onClick={() => setBoardView("2d")} style={{
                  flex: 1, padding: "8px 12px", border: "none",
                  background: boardView === "2d" ? theme.accent : "transparent",
                  color: boardView === "2d" ? "#000" : theme.ink,
                  cursor: "pointer", fontSize: 12, fontWeight: 600
                }}>2D</button>
                <button onClick={() => setBoardView("3d")} style={{
                  flex: 1, padding: "8px 12px", border: "none",
                  background: boardView === "3d" ? theme.accent : "transparent",
                  color: boardView === "3d" ? "#000" : theme.ink,
                  cursor: "pointer", fontSize: 12, fontWeight: 600
                }}>3D</button>
              </div>
            </div>

            {/* Board Theme */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8 }}>Board Theme</div>
              <select 
                value={boardThemeId} 
                onChange={(e) => handleBoardThemeChange(e.target.value)}
                style={{
                  width: "100%", padding: "8px 10px",
                  background: "rgba(0,0,0,0.3)", border: `1px solid ${theme.border}`,
                  borderRadius: 6, color: theme.ink, fontSize: 12
                }}
              >
                {listBoardThemes().map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Music Toggle */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8 }}>Music</div>
              <button onClick={() => setMusicEnabled(!musicEnabled)} style={{
                width: "100%", padding: "8px 12px",
                background: musicEnabled ? theme.accentSoft : "rgba(0,0,0,0.3)",
                border: `1px solid ${musicEnabled ? theme.accent : theme.border}`,
                borderRadius: 6, color: theme.ink, cursor: "pointer", fontSize: 12,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>
                {musicEnabled ? "🔊 On" : "🔇 Off"}
              </button>
            </div>

            {/* Volume */}
            {musicEnabled && (
              <div>
                <div style={{ fontSize: 12, color: theme.ink, marginBottom: 8 }}>Volume</div>
                <input 
                  type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>
        )}

        {/* Captured pieces - Black */}
        <div style={{ 
          height: 28, marginBottom: 12, 
          display: "flex", gap: 2, alignItems: "center",
          minWidth: 580
        }}>
          {capturedPieces.byBlack.map((p, i) => (
            <img key={i} src={`/pieces/classic/w${p.toUpperCase()}.svg`} alt="" 
              style={{ width: 22, height: 22, opacity: 0.6 }} />
          ))}
        </div>

        {/* THE BOARD */}
        <div style={{
          background: "rgba(0,0,0,0.3)",
          borderRadius: 4,
          padding: 4,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}>
          {boardView === "3d" ? (
            <Board3D 
              key={`3d-${fen}`}
              chess={chess} 
              size={580} 
              orientation={orientation} 
              interactive={false} 
              lastMove={lastMove} 
              themeId={boardThemeId}
              cameraPreset="top"
              animations={true}
            />
          ) : (
            <Board2D 
              chess={chess} 
              fen={fen} 
              size={580} 
              orientation={orientation} 
              interactive={false} 
              lastMove={lastMove} 
              themeId={boardThemeId} 
              vignette={false} 
            />
          )}
        </div>

        {/* Captured pieces - White */}
        <div style={{ 
          height: 28, marginTop: 12, 
          display: "flex", gap: 2, alignItems: "center",
          minWidth: 580
        }}>
          {capturedPieces.byWhite.map((p, i) => (
            <img key={i} src={`/pieces/classic/b${p.toUpperCase()}.svg`} alt="" 
              style={{ width: 22, height: 22, opacity: 0.6 }} />
          ))}
        </div>

        {/* Controls Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 24,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: "8px 12px",
        }}>
          {[
            { icon: "⏮", action: () => { goToMove(0); setAutoPlay(false); }, disabled: moveIndex === 0 },
            { icon: "◀", action: () => { goToMove(moveIndex - 1); setAutoPlay(false); }, disabled: moveIndex === 0 },
            { icon: autoPlay ? "⏸" : "▶", action: () => setAutoPlay(!autoPlay), disabled: false, primary: true },
            { icon: "▶", action: () => goToMove(moveIndex + 1), disabled: moveIndex >= moves.length },
            { icon: "⏭", action: () => goToMove(moves.length), disabled: moveIndex >= moves.length },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} disabled={btn.disabled} style={{
              width: btn.primary ? 56 : 44,
              height: 44,
              borderRadius: 8,
              border: "none",
              background: btn.primary ? (autoPlay ? "rgba(76,175,80,0.3)" : theme.accentSoft) : "rgba(255,255,255,0.05)",
              color: btn.disabled ? theme.inkMuted : theme.ink,
              cursor: btn.disabled ? "default" : "pointer",
              opacity: btn.disabled ? 0.4 : 1,
              fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition
            }}>
              {btn.icon}
            </button>
          ))}

          <div style={{ 
            padding: "0 16px", 
            fontSize: 14, 
            fontWeight: 600, 
            color: theme.ink,
            fontVariantNumeric: "tabular-nums"
          }}>
            {moveIndex} / {moves.length}
          </div>

          <button onClick={() => setOrientation(o => o === "w" ? "b" : "w")} style={{
            width: 44, height: 44, borderRadius: 8, border: "none",
            background: "rgba(255,255,255,0.05)",
            color: theme.ink, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>↻</button>
        </div>
      </div>

      {/* RIGHT: Sidebar */}
      <div style={{
        width: 340,
        borderLeft: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.2)",
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
                  width: 40, height: 40, borderRadius: 8,
                  background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18
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
                  width: 40, height: 40, borderRadius: 8,
                  background: "#1a1a1a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: "#fff"
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
                  padding: "4px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 4 
                }}>{gameInfo.event}</span>}
                {(gameInfo.year || gameInfo.date) && <span style={{ 
                  padding: "4px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 4 
                }}>{gameInfo.year || gameInfo.date}</span>}
                {gameInfo.result && <span style={{ 
                  padding: "4px 8px", background: theme.accentSoft, borderRadius: 4, color: theme.accent, fontWeight: 600 
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
            background: "rgba(212,175,55,0.05)",
          }}>
            <div style={{ 
              fontSize: 11, color: theme.accent, marginBottom: 8, 
              letterSpacing: "0.05em", fontWeight: 600 
            }}>ANNOTATION</div>
            <div style={{ fontSize: 13, color: theme.ink, lineHeight: 1.6 }}>
              {currentAnnotation}
            </div>
          </div>
        )}

        {/* Moves List */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: `1px solid ${theme.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ fontSize: 11, color: theme.inkMuted, letterSpacing: "0.05em", fontWeight: 600 }}>MOVES</span>
            <span style={{ fontSize: 12, color: theme.inkMuted }}>{moveIndex} of {moves.length}</span>
          </div>

          <div ref={movesContainerRef} style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: 12,
          }}>
            {moves.length === 0 ? (
              <div style={{ textAlign: "center", color: theme.inkMuted, padding: 24, fontSize: 13 }}>
                No moves loaded
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr", gap: "2px" }}>
                {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
                  <React.Fragment key={i}>
                    <span style={{ 
                      color: theme.inkMuted, 
                      padding: "6px 4px", 
                      textAlign: "right",
                      fontSize: 12,
                      fontVariantNumeric: "tabular-nums"
                    }}>
                      {i + 1}.
                    </span>
                    <button
                      onClick={() => { goToMove(i * 2 + 1); setAutoPlay(false); }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 4,
                        border: "none",
                        background: moveIndex === i * 2 + 1 ? theme.accent : "transparent",
                        color: moveIndex === i * 2 + 1 ? "#000" : theme.ink,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: moveIndex === i * 2 + 1 ? 600 : 400,
                        textAlign: "left",
                        transition: "background 0.15s"
                      }}
                    >
                      {moves[i * 2]}
                    </button>
                    {moves[i * 2 + 1] ? (
                      <button
                        onClick={() => { goToMove(i * 2 + 2); setAutoPlay(false); }}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 4,
                          border: "none",
                          background: moveIndex === i * 2 + 2 ? theme.accent : "transparent",
                          color: moveIndex === i * 2 + 2 ? "#000" : theme.ink,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: moveIndex === i * 2 + 2 ? 600 : 400,
                          textAlign: "left",
                          transition: "background 0.15s"
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
          fontSize: 10, 
          color: theme.inkMuted,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4px 16px"
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
            padding: "12px",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            color: theme.ink,
            cursor: "pointer",
            fontSize: 13
          }}>
            ← Back to Library
          </button>
        </div>
      </div>
    </div>
  );
}
