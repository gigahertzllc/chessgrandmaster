import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Chess } from "chess.js";
import Board2D from "./cm-board/components/Board2D.jsx";
import Board3D from "./cm-board/components/Board3D.jsx";
import { listBoardThemes } from "./cm-board/themes/boardThemes.js";
import { getLesson, getAllBooks, getLessonsByBook } from "../data/lessons.js";
import { getAudioManager } from "../audio/AudioManager.js";

const transition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)";

export default function ZoneMode({ initialGame = null, initialLesson = null, onClose, theme: appTheme, boardThemeId: initialBoardTheme = "carrara_gold", onBoardThemeChange }) {
  const theme = appTheme || {
    bg: "#141416", bgAlt: "#1c1c20", card: "rgba(28,28,32,0.95)",
    ink: "#FAFAF8", inkMuted: "#a0a0a0", accent: "#D4AF37",
    accentSoft: "rgba(212,175,55,0.12)", border: "rgba(255,255,255,0.06)",
    shadow: "0 4px 24px rgba(0,0,0,0.4)",
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
  const [showThemes, setShowThemes] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef(null);
  
  // 2D/3D board view toggle
  const [boardView, setBoardView] = useState("2d");
  
  // Audio Manager state
  const audioManager = useMemo(() => getAudioManager(), []);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [volume, setVolume] = useState(() => audioManager.getVolume());
  const [currentTrack, setCurrentTrack] = useState(null);

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
    
    // Track change callback
    audioManager.onTrackChange = (track) => {
      setCurrentTrack(track);
    };
    
    return () => {
      audioManager.onTrackChange = null;
    };
  }, [audioManager]);

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

  const currentQuiz = useMemo(() => currentLesson?.quizPositions?.find(q => q.afterMove === moveIndex), [currentLesson, moveIndex]);

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

  const glassCard = {
    background: theme.card,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bgAlt} 100%)`,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Header */}
      <header style={{
        ...glassCard, borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none",
        padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "relative", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onClose} style={{
            background: theme.accentSoft, border: "none", borderRadius: 8,
            color: theme.ink, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition,
          }}>← Exit</button>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.accent }}>
            {mode === "lesson" ? "📚 Lesson" : mode === "game" ? "♟ Analysis" : "📖 Training"}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Music Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setMusicEnabled(!musicEnabled)} style={{
              background: musicEnabled ? "rgba(76,175,80,0.2)" : theme.accentSoft,
              border: "none", borderRadius: 8, color: theme.ink, padding: "8px 14px", cursor: "pointer", fontSize: 13,
            }}>{musicEnabled ? "🎵" : "🔇"}</button>
            {musicEnabled && (
              <>
                <button onClick={() => audioManager.skip()} style={{
                  background: theme.accentSoft, border: "none", borderRadius: 8,
                  color: theme.ink, padding: "8px 12px", cursor: "pointer", fontSize: 13,
                }}>⏭</button>
                <input type="range" min="0" max="100" step="5" value={Math.round(volume * 100)} 
                  onChange={(e) => setVolume(parseInt(e.target.value) / 100)} 
                  style={{ width: 60 }} />
                {currentTrack && (
                  <span style={{ fontSize: 11, color: theme.inkMuted, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentTrack.title}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Board Theme Selector */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowThemes(!showThemes)} style={{
              background: showThemes ? theme.accent : theme.accentSoft, 
              border: "none", borderRadius: 8,
              color: showThemes ? theme.bg : theme.ink, 
              padding: "8px 14px", cursor: "pointer", fontSize: 13,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              🎨 Board
              <span style={{ fontSize: 10 }}>{showThemes ? "▲" : "▼"}</span>
            </button>
            {showThemes && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: theme.card, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${theme.border}`, borderRadius: 12,
                padding: 8, width: 280, maxHeight: 350, overflowY: "auto", 
                zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}>
                <div style={{ fontSize: 10, color: theme.inkMuted, padding: "8px 12px", letterSpacing: "0.1em" }}>SELECT BOARD THEME</div>
                {listBoardThemes().map(t => (
                  <button key={t.id} onClick={() => { handleBoardThemeChange(t.id); setShowThemes(false); }}
                    style={{
                      width: "100%", padding: "12px", border: "none", borderRadius: 8,
                      background: boardThemeId === t.id ? theme.accentSoft : "transparent",
                      color: theme.ink, textAlign: "left", cursor: "pointer", fontSize: 13, marginBottom: 2, transition,
                      fontWeight: boardThemeId === t.id ? 600 : 400,
                    }}>
                    {boardThemeId === t.id && "✓ "}{t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: 24, gap: 24, position: "relative", zIndex: 1 }}>
        {/* Browse */}
        {mode === "browse" && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ ...glassCard, padding: 24 }}>
              <h2 style={{ margin: "0 0 20px 0", color: theme.accent, fontSize: 20 }}>📚 Training Library</h2>
              {getAllBooks().map(book => (
                <div key={book.id} style={{ marginBottom: 24 }}>
                  <div style={{ background: book.coverColor, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 20 }}>{book.title}</h3>
                    <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.8 }}>by {book.author}</p>
                  </div>
                  {getLessonsByBook(book.id).map(lesson => (
                    <button key={lesson.id} onClick={() => selectLesson(lesson.id)}
                      style={{
                        ...glassCard, width: "100%", padding: "16px 20px", cursor: "pointer",
                        textAlign: "left", color: theme.ink, marginBottom: 8, transition,
                      }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                        Ch.{lesson.chapter} Lesson {lesson.lessonNumber}: {lesson.title}
                      </div>
                      <div style={{ fontSize: 12, color: theme.inkMuted }}>{lesson.subtitle}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game/Lesson View */}
        {(mode === "game" || mode === "lesson") && (
          <div style={{ display: "flex", gap: 20, flex: 1, overflow: "hidden", maxWidth: 1400, margin: "0 auto" }}>
            {/* Left - Info */}
            <div style={{ width: 300, minWidth: 280, ...glassCard, padding: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {currentLesson && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: theme.inkMuted, letterSpacing: "0.1em", marginBottom: 4 }}>LESSON</div>
                    <h2 style={{ margin: 0, fontSize: 18, color: theme.accent }}>{currentLesson.title}</h2>
                    <div style={{ fontSize: 13, color: theme.inkMuted }}>{currentLesson.subtitle}</div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
                    {moveIndex === 0 ? (
                      <div style={{ background: theme.accentSoft, borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                        {currentLesson.introduction}
                      </div>
                    ) : currentQuiz ? (
                      <div style={{ background: "rgba(212,175,55,0.15)", borderRadius: 12, padding: 16, border: `1px solid ${theme.accent}40` }}>
                        <div style={{ fontSize: 10, color: theme.inkMuted, marginBottom: 8 }}>💡 QUIZ</div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{currentQuiz.question}</div>
                        <div style={{ fontSize: 12, color: theme.inkMuted, marginBottom: 12 }}>Hint: {currentQuiz.hint}</div>
                        <details style={{ cursor: "pointer" }}>
                          <summary style={{ fontSize: 12, color: theme.accent }}>Show Answer</summary>
                          <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6 }}>{currentQuiz.answer}</div>
                        </details>
                      </div>
                    ) : currentAnnotation ? (
                      <div style={{ background: theme.accentSoft, borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.7 }}>
                        {currentAnnotation}
                      </div>
                    ) : (
                      <div style={{ opacity: 0.5, textAlign: "center", padding: 20 }}>Play through moves to see annotations</div>
                    )}
                    {moveIndex === moves.length && currentLesson.conclusion && (
                      <div style={{ background: "rgba(76,175,80,0.15)", borderRadius: 12, padding: 16, marginTop: 16, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", border: "1px solid rgba(76,175,80,0.3)" }}>
                        <div style={{ fontSize: 10, color: theme.inkMuted, marginBottom: 8 }}>✓ COMPLETE</div>
                        {currentLesson.conclusion}
                      </div>
                    )}
                  </div>
                  {currentLesson.concepts && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
                      <div style={{ fontSize: 10, color: theme.inkMuted, marginBottom: 8 }}>KEY CONCEPTS</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {currentLesson.concepts.map((c, i) => (
                          <span key={i} style={{ fontSize: 10, padding: "4px 10px", background: theme.accentSoft, borderRadius: 20, color: theme.accent }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              {currentGame && !currentLesson && (
                <>
                  <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>{currentGame.white} vs {currentGame.black}</h2>
                  <div style={{ fontSize: 12, color: theme.inkMuted, marginBottom: 16 }}>{currentGame.event} {currentGame.year || currentGame.date}</div>
                  {currentGame.description && <p style={{ fontSize: 13, lineHeight: 1.6, color: theme.inkMuted }}>{currentGame.description}</p>}
                </>
              )}
              <button onClick={() => { setMode("browse"); setCurrentLesson(null); setCurrentGame(null); }}
                style={{ marginTop: 16, padding: "12px", background: theme.accentSoft, border: "none", borderRadius: 8, color: theme.ink, cursor: "pointer", fontSize: 13 }}>
                ← Back to Library
              </button>
            </div>

            {/* Center - Board */}
            <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 400, maxWidth: 600 }}>
              <div style={{ ...glassCard, padding: 16 }}>
                {/* Captured by black */}
                <div style={{ height: 24, marginBottom: 8, display: "flex", gap: 2, justifyContent: "center" }}>
                  {capturedPieces.byBlack.map((p, i) => <img key={i} src={`/pieces/classic/w${p.toUpperCase()}.svg`} alt="" style={{ width: 20, height: 20, opacity: 0.7 }} />)}
                </div>
                
                {/* Board - 2D or 3D */}
                {boardView === "3d" ? (
                  <Board3D 
                    key={`3d-${fen}`}
                    chess={chess} 
                    size={420} 
                    orientation={orientation} 
                    interactive={false} 
                    lastMove={lastMove} 
                    themeId={boardThemeId}
                    cameraPreset="classic34"
                    animations={true}
                  />
                ) : (
                  <Board2D chess={chess} fen={fen} size={420} orientation={orientation} interactive={false} lastMove={lastMove} themeId={boardThemeId} vignette={true} />
                )}
                
                {/* Captured by white */}
                <div style={{ height: 24, marginTop: 8, display: "flex", gap: 2, justifyContent: "center" }}>
                  {capturedPieces.byWhite.map((p, i) => <img key={i} src={`/pieces/classic/b${p.toUpperCase()}.svg`} alt="" style={{ width: 20, height: 20, opacity: 0.7 }} />)}
                </div>
              </div>

              {/* Controls */}
              <div style={{ ...glassCard, padding: 12, marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
                {[
                  { l: "⏮", a: () => { goToMove(0); setAutoPlay(false); }, d: moveIndex === 0 },
                  { l: "◀", a: () => { goToMove(moveIndex - 1); setAutoPlay(false); }, d: moveIndex === 0 },
                  { l: autoPlay ? "⏸" : "▶", a: () => setAutoPlay(!autoPlay), d: false, w: 70 },
                  { l: "▶", a: () => goToMove(moveIndex + 1), d: moveIndex >= moves.length },
                  { l: "⏭", a: () => goToMove(moves.length), d: moveIndex >= moves.length },
                ].map((b, i) => (
                  <button key={i} onClick={b.a} disabled={b.d}
                    style={{
                      padding: "12px 16px", borderRadius: 8, border: "none",
                      background: b.l.includes("▶") && !b.l.includes("⏸") && i === 2 ? (autoPlay ? "rgba(76,175,80,0.3)" : theme.accentSoft) : theme.accentSoft,
                      color: theme.ink, cursor: b.d ? "default" : "pointer", opacity: b.d ? 0.4 : 1,
                      fontSize: 14, width: b.w || "auto", transition,
                    }}>{b.l}</button>
                ))}
                <div style={{ padding: "10px 16px", background: "rgba(0,0,0,0.3)", borderRadius: 8, fontSize: 13, fontWeight: 600, minWidth: 70, textAlign: "center" }}>
                  {moveIndex} / {moves.length}
                </div>
                <button onClick={() => setOrientation(o => o === "w" ? "b" : "w")} style={{
                  padding: "12px 16px", borderRadius: 8, border: "none", background: theme.accentSoft, color: theme.ink, cursor: "pointer", fontSize: 14,
                }}>↻</button>
                
                {/* 2D/3D Toggle */}
                <div style={{ 
                  display: "flex", 
                  background: "rgba(0,0,0,0.3)", 
                  borderRadius: 8, 
                  overflow: "hidden",
                  border: `1px solid ${theme.border}`
                }}>
                  <button 
                    onClick={() => setBoardView("2d")}
                    style={{
                      padding: "10px 14px", 
                      border: "none", 
                      background: boardView === "2d" ? theme.accent : "transparent",
                      color: boardView === "2d" ? "#000" : theme.ink, 
                      cursor: "pointer", 
                      fontSize: 12,
                      fontWeight: 600,
                      transition
                    }}
                  >2D</button>
                  <button 
                    onClick={() => setBoardView("3d")}
                    style={{
                      padding: "10px 14px", 
                      border: "none", 
                      background: boardView === "3d" ? theme.accent : "transparent",
                      color: boardView === "3d" ? "#000" : theme.ink, 
                      cursor: "pointer", 
                      fontSize: 12,
                      fontWeight: 600,
                      transition
                    }}
                  >3D</button>
                </div>
              </div>
            </div>

            {/* Right - Moves */}
            <div style={{ width: 220, minWidth: 200, ...glassCard, padding: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: theme.inkMuted, letterSpacing: "0.1em", fontWeight: 600 }}>MOVES</div>
                <div style={{ fontSize: 11, color: theme.inkMuted }}>{moveIndex}/{moves.length}</div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 8 }}>
                {moves.length === 0 ? (
                  <div style={{ textAlign: "center", color: theme.inkMuted, padding: 16, fontSize: 12 }}>No moves yet</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "2px 4px", fontSize: 12 }}>
                    {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
                      <React.Fragment key={i}>
                        <span style={{ color: theme.inkMuted, padding: "4px 6px", textAlign: "right" }}>{i + 1}.</span>
                        <span
                          onClick={() => { goToMove(i * 2 + 1); setAutoPlay(false); }}
                          style={{
                            padding: "4px 6px", borderRadius: 4, cursor: "pointer",
                            background: moveIndex === i * 2 + 1 ? theme.accent : "transparent",
                            color: moveIndex === i * 2 + 1 ? theme.bg : theme.ink,
                          }}>
                          {moves[i * 2]}
                        </span>
                        {moves[i * 2 + 1] ? (
                          <span
                            onClick={() => { goToMove(i * 2 + 2); setAutoPlay(false); }}
                            style={{
                              padding: "4px 6px", borderRadius: 4, cursor: "pointer",
                              background: moveIndex === i * 2 + 2 ? theme.accent : "transparent",
                              color: moveIndex === i * 2 + 2 ? theme.bg : theme.ink,
                            }}>
                            {moves[i * 2 + 1]}
                          </span>
                        ) : <span />}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.border}`, fontSize: 9, color: theme.inkMuted, lineHeight: 1.8 }}>
                <div>← → Navigate</div>
                <div>↑ ↓ Start/End</div>
                <div>Space Auto-play</div>
                <div>F Flip • Esc Exit</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
