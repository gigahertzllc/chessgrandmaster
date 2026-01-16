import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Chess } from "chess.js";
import Board2D from "./cm-board/components/Board2D.jsx";
import { BOARD_THEMES, listBoardThemes } from "./cm-board/themes/boardThemes.js";
import { getLesson, getAllBooks, getLessonsByBook } from "../data/lessons.js";

/**
 * Zone Mode - Immersive chess experience
 * Features:
 * - Premium 2D board with multiple themes
 * - Lesson mode with move-by-move annotations
 * - Classical music ambiance
 * - Glass-like transparent UI
 * - Game replay with annotations
 */

// Classical music tracks (royalty-free URLs)
const MUSIC_TRACKS = [
  { name: "Bach - Air on G String", url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Bach_Air_on_the_G_string.ogg" },
  { name: "Beethoven - Moonlight Sonata", url: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Piano_Sonata_No._14_in_C_Sharp_Minor%2C_Op._27%2C_No._2_%22Moonlight%22_-_I._Adagio_sostenuto.ogg" },
  { name: "Debussy - Clair de Lune", url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Clair_de_lune_%28Debussy%29.ogg" }
];

export default function ZoneMode({ 
  initialGame = null, 
  initialLesson = null,
  onClose 
}) {
  // Mode: "game" for viewing a game, "lesson" for lesson mode, "browse" for selecting lessons
  const [mode, setMode] = useState(initialLesson ? "lesson" : initialGame ? "game" : "browse");
  
  // Chess state
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [moves, setMoves] = useState([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [orientation, setOrientation] = useState("w");
  const [lastMove, setLastMove] = useState(null);
  
  // Current content
  const [currentGame, setCurrentGame] = useState(initialGame);
  const [currentLesson, setCurrentLesson] = useState(initialLesson ? getLesson(initialLesson) : null);
  
  // UI state
  const [themeId, setThemeId] = useState("carrara_gold");
  const [showThemes, setShowThemes] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef(null);
  
  // Music state
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);

  // Load game or lesson
  useEffect(() => {
    if (currentLesson) {
      loadPgn(currentLesson.game.pgn);
      setMode("lesson");
    } else if (currentGame?.pgn) {
      loadPgn(currentGame.pgn);
      setMode("game");
    }
  }, [currentLesson, currentGame]);

  const loadPgn = useCallback((pgn) => {
    try {
      const temp = new Chess();
      temp.loadPgn(pgn, { strict: false });
      const history = temp.history();
      setMoves(history);
      setMoveIndex(0);
      chess.reset();
      setFen(chess.fen());
      setLastMove(null);
    } catch (e) {
      console.error("Failed to load PGN:", e);
    }
  }, [chess]);

  // Navigate moves
  const goToMove = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, moves.length));
    setMoveIndex(clamped);
    chess.reset();
    let last = null;
    for (let i = 0; i < clamped; i++) {
      try {
        const m = chess.move(moves[i]);
        if (i === clamped - 1) last = { from: m.from, to: m.to };
      } catch { break; }
    }
    setFen(chess.fen());
    setLastMove(last);
  }, [moves, chess]);

  // Auto-play
  useEffect(() => {
    if (autoPlay && moveIndex < moves.length) {
      autoPlayRef.current = setTimeout(() => {
        goToMove(moveIndex + 1);
      }, 1500);
    }
    return () => clearTimeout(autoPlayRef.current);
  }, [autoPlay, moveIndex, moves.length, goToMove]);

  // Music control
  useEffect(() => {
    if (audioRef.current) {
      if (musicEnabled) {
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicEnabled, volume, currentTrack]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goToMove(moveIndex - 1); setAutoPlay(false); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToMove(moveIndex + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); goToMove(0); setAutoPlay(false); }
      else if (e.key === "ArrowDown") { e.preventDefault(); goToMove(moves.length); }
      else if (e.key === "f" || e.key === "F") { e.preventDefault(); setOrientation(o => o === "w" ? "b" : "w"); }
      else if (e.key === " ") { e.preventDefault(); setAutoPlay(a => !a); }
      else if (e.key === "Escape") { onClose?.(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moveIndex, moves.length, goToMove, onClose]);

  // Get current annotation
  const currentAnnotation = useMemo(() => {
    if (!currentLesson?.annotations) return null;
    // Find the closest annotation at or before current move
    const annotationMoves = Object.keys(currentLesson.annotations).map(Number).sort((a, b) => b - a);
    const matchingMove = annotationMoves.find(m => m <= moveIndex);
    return matchingMove !== undefined ? currentLesson.annotations[matchingMove] : null;
  }, [currentLesson, moveIndex]);

  // Get current quiz if any
  const currentQuiz = useMemo(() => {
    if (!currentLesson?.quizPositions) return null;
    return currentLesson.quizPositions.find(q => q.afterMove === moveIndex);
  }, [currentLesson, moveIndex]);

  const selectLesson = (lessonId) => {
    const lesson = getLesson(lessonId);
    setCurrentLesson(lesson);
    setCurrentGame(null);
  };

  const glassStyle = {
    background: "rgba(15, 15, 25, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 2000,
      background: "linear-gradient(135deg, #0a0a15 0%, #1a1a2e 50%, #0f0f1a 100%)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      {/* Background pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)`,
        backgroundSize: "20px 20px",
        pointerEvents: "none"
      }} />

      {/* Audio element */}
      <audio 
        ref={audioRef} 
        src={MUSIC_TRACKS[currentTrack].url} 
        loop 
        onEnded={() => setCurrentTrack((currentTrack + 1) % MUSIC_TRACKS.length)}
      />

      {/* Header */}
      <header style={{
        ...glassStyle,
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderRadius: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            ← Exit Zone
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "rgba(212,175,55,0.9)" }}>
            {mode === "lesson" ? "📚 Lesson Mode" : mode === "game" ? "♟️ Game Analysis" : "📖 Training Library"}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Music controls */}
          <button onClick={() => setMusicEnabled(!musicEnabled)} style={{
            background: musicEnabled ? "rgba(76,175,80,0.3)" : "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: 14
          }}>
            {musicEnabled ? "🎵 On" : "🔇 Off"}
          </button>
          
          {musicEnabled && (
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: 80 }}
            />
          )}

          {/* Theme selector */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowThemes(!showThemes)} style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: 14
            }}>
              🎨 Theme
            </button>
            {showThemes && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                ...glassStyle,
                borderRadius: 12,
                padding: 8,
                width: 280,
                maxHeight: 300,
                overflowY: "auto",
                zIndex: 100
              }}>
                {listBoardThemes().map(t => (
                  <button key={t.id} onClick={() => { setThemeId(t.id); setShowThemes(false); }}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      borderRadius: 8,
                      background: themeId === t.id ? "rgba(212,175,55,0.3)" : "transparent",
                      color: "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: 13,
                      marginBottom: 4
                    }}>
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: 24, gap: 24 }}>
        
        {/* Browse mode - lesson selection */}
        {mode === "browse" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ ...glassStyle, borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: "0 0 20px 0", color: "rgba(212,175,55,0.9)" }}>📚 Chess Training Library</h2>
              {getAllBooks().map(book => (
                <div key={book.id} style={{ marginBottom: 24 }}>
                  <div style={{
                    background: book.coverColor,
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 16
                  }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: 22 }}>{book.title}</h3>
                    <p style={{ margin: "0 0 4px 0", fontSize: 14, opacity: 0.8 }}>by {book.author}</p>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>{book.description}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {getLessonsByBook(book.id).map(lesson => (
                      <button key={lesson.id} onClick={() => selectLesson(lesson.id)}
                        style={{
                          ...glassStyle,
                          borderRadius: 12,
                          padding: "16px 20px",
                          cursor: "pointer",
                          textAlign: "left",
                          color: "#fff"
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                              Chapter {lesson.chapter}, Lesson {lesson.lessonNumber}: {lesson.title}
                            </div>
                            <div style={{ fontSize: 13, opacity: 0.7 }}>{lesson.subtitle}</div>
                          </div>
                          <span style={{ fontSize: 24 }}>→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game/Lesson viewing mode */}
        {(mode === "game" || mode === "lesson") && (
          <>
            {/* Left panel - Info/Annotations */}
            <div style={{
              width: 380,
              ...glassStyle,
              borderRadius: 16,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}>
              {currentLesson && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 4 }}>LESSON</div>
                    <h2 style={{ margin: "0 0 4px 0", fontSize: 20, color: "rgba(212,175,55,0.9)" }}>
                      {currentLesson.title}
                    </h2>
                    <div style={{ fontSize: 14, opacity: 0.7 }}>{currentLesson.subtitle}</div>
                  </div>

                  <div style={{ 
                    flex: 1, 
                    overflowY: "auto",
                    paddingRight: 8
                  }}>
                    {moveIndex === 0 ? (
                      <div style={{ 
                        background: "rgba(255,255,255,0.05)", 
                        borderRadius: 12, 
                        padding: 16,
                        fontSize: 14,
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap"
                      }}>
                        {currentLesson.introduction}
                      </div>
                    ) : currentQuiz ? (
                      <div style={{ 
                        background: "rgba(212,175,55,0.15)", 
                        borderRadius: 12, 
                        padding: 16,
                        border: "1px solid rgba(212,175,55,0.3)"
                      }}>
                        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>💡 QUIZ</div>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{currentQuiz.question}</div>
                        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>Hint: {currentQuiz.hint}</div>
                        <details style={{ cursor: "pointer" }}>
                          <summary style={{ fontSize: 13, color: "rgba(212,175,55,0.9)" }}>Show Answer</summary>
                          <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>{currentQuiz.answer}</div>
                        </details>
                      </div>
                    ) : currentAnnotation ? (
                      <div style={{ 
                        background: "rgba(255,255,255,0.05)", 
                        borderRadius: 12, 
                        padding: 16,
                        fontSize: 14,
                        lineHeight: 1.7
                      }}>
                        {currentAnnotation}
                      </div>
                    ) : (
                      <div style={{ opacity: 0.5, textAlign: "center", padding: 20 }}>
                        Play through the moves to see annotations
                      </div>
                    )}

                    {moveIndex === moves.length && currentLesson.conclusion && (
                      <div style={{ 
                        background: "rgba(76,175,80,0.15)", 
                        borderRadius: 12, 
                        padding: 16,
                        marginTop: 16,
                        fontSize: 14,
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                        border: "1px solid rgba(76,175,80,0.3)"
                      }}>
                        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>✓ LESSON COMPLETE</div>
                        {currentLesson.conclusion}
                      </div>
                    )}
                  </div>

                  {currentLesson.concepts && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 8 }}>KEY CONCEPTS</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {currentLesson.concepts.map((c, i) => (
                          <span key={i} style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            background: "rgba(212,175,55,0.15)",
                            borderRadius: 20,
                            color: "rgba(212,175,55,0.9)"
                          }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {currentGame && !currentLesson && (
                <>
                  <h2 style={{ margin: "0 0 8px 0", fontSize: 18 }}>
                    {currentGame.white} vs {currentGame.black}
                  </h2>
                  <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
                    {currentGame.event} {currentGame.year && `(${currentGame.year})`}
                  </div>
                  {currentGame.description && (
                    <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{currentGame.description}</p>
                  )}
                </>
              )}

              <button onClick={() => { setMode("browse"); setCurrentLesson(null); setCurrentGame(null); }}
                style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13
                }}>
                ← Back to Library
              </button>
            </div>

            {/* Center - Board */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                ...glassStyle,
                borderRadius: 20,
                padding: 20
              }}>
                <Board2D
                  chess={chess}
                  size={520}
                  orientation={orientation}
                  interactive={false}
                  lastMove={lastMove}
                  themeId={themeId}
                  vignette={true}
                />
              </div>

              {/* Controls */}
              <div style={{
                ...glassStyle,
                borderRadius: 12,
                padding: 12,
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <button onClick={() => { goToMove(0); setAutoPlay(false); }}
                  style={controlBtnStyle(moveIndex === 0)}>⏮</button>
                <button onClick={() => { goToMove(moveIndex - 1); setAutoPlay(false); }}
                  style={controlBtnStyle(moveIndex === 0)}>◀</button>
                <button onClick={() => setAutoPlay(!autoPlay)}
                  style={{
                    ...controlBtnStyle(false),
                    background: autoPlay ? "rgba(76,175,80,0.4)" : "rgba(255,255,255,0.1)",
                    width: 80
                  }}>
                  {autoPlay ? "⏸" : "▶"}
                </button>
                <button onClick={() => goToMove(moveIndex + 1)}
                  style={controlBtnStyle(moveIndex >= moves.length)}>▶</button>
                <button onClick={() => goToMove(moves.length)}
                  style={controlBtnStyle(moveIndex >= moves.length)}>⏭</button>
                <div style={{
                  padding: "8px 16px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  minWidth: 80,
                  textAlign: "center"
                }}>
                  {moveIndex} / {moves.length}
                </div>
                <button onClick={() => setOrientation(o => o === "w" ? "b" : "w")}
                  style={controlBtnStyle(false)}>🔄</button>
              </div>
            </div>

            {/* Right panel - Moves */}
            <div style={{
              width: 280,
              ...glassStyle,
              borderRadius: 16,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 12 }}>MOVES</div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {moves.map((move, idx) => (
                    <span key={idx} onClick={() => { goToMove(idx + 1); setAutoPlay(false); }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: idx + 1 === moveIndex ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.05)",
                        cursor: "pointer",
                        fontSize: 13,
                        transition: "background 0.15s"
                      }}>
                      {idx % 2 === 0 && <span style={{ opacity: 0.5, marginRight: 3 }}>{Math.floor(idx / 2) + 1}.</span>}
                      {move}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ 
                marginTop: 16, 
                paddingTop: 16, 
                borderTop: "1px solid rgba(255,255,255,0.1)",
                fontSize: 11,
                opacity: 0.5,
                lineHeight: 1.6
              }}>
                <div>← → Navigate moves</div>
                <div>↑ ↓ Start / End</div>
                <div>Space Auto-play</div>
                <div>F Flip board</div>
                <div>Esc Exit</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const controlBtnStyle = (disabled) => ({
  padding: "12px 16px",
  borderRadius: 8,
  border: "none",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  cursor: disabled ? "default" : "pointer",
  opacity: disabled ? 0.4 : 1,
  fontSize: 16,
  transition: "background 0.15s"
});
