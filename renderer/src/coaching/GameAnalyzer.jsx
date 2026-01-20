import React, { useState, useCallback, useRef, useEffect } from "react";
import { Chess } from "chess.js";
import Board from "../components/Board.jsx";

/**
 * Game Analyzer - AI-Powered Game Review
 * 
 * Analyzes games using Stockfish for evaluation and provides
 * human-friendly coaching feedback on mistakes and improvements.
 * 
 * Features:
 * - Load games from PGN
 * - Step through moves with evaluation
 * - Identify blunders, mistakes, inaccuracies
 * - Coaching explanations for errors
 * - Skill-based feedback
 */

// Move classification thresholds (centipawns)
const THRESHOLDS = {
  blunder: 200,    // Losing 2+ pawns worth
  mistake: 100,    // Losing 1+ pawns worth
  inaccuracy: 50,  // Losing 0.5+ pawns worth
  good: -10,       // Slight improvement
  excellent: -50   // Significant improvement
};

// Coaching explanations for common error types
const errorExplanations = {
  hangingPiece: "You left a piece undefended. Always ask yourself: 'Is this piece protected after I move?'",
  missedTactic: "There was a tactical opportunity here! Look for checks, captures, and threats in that order.",
  poorTrade: "This trade wasn't favorable. Remember: trade when you're ahead, avoid trades when behind.",
  weakPawnStructure: "This move damaged your pawn structure. Pawns can't move backwards!",
  kingExposed: "Your king safety was compromised. Keep your king protected, especially in the middlegame.",
  passivePiece: "This piece became passive. Aim for active, centralized pieces.",
  timelyDevelopment: "You could have developed faster. In the opening, develop pieces before starting attacks.",
  endgameTechnique: "Endgame precision matters. With fewer pieces, every move counts more."
};

// Simple position evaluation using material count (fallback when no engine)
function evaluateMaterial(chess) {
  const values = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  let score = 0;
  
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = values[piece.type];
        score += piece.color === 'w' ? val : -val;
      }
    }
  }
  
  return score;
}

// Classify a move based on evaluation change
function classifyMove(evalBefore, evalAfter, turn) {
  // Adjust for whose perspective
  const diff = turn === 'w' 
    ? evalAfter - evalBefore  // White wants positive
    : evalBefore - evalAfter;  // Black wants negative
  
  if (diff <= -THRESHOLDS.blunder) return { type: "blunder", symbol: "??", color: "#f44336" };
  if (diff <= -THRESHOLDS.mistake) return { type: "mistake", symbol: "?", color: "#ff9800" };
  if (diff <= -THRESHOLDS.inaccuracy) return { type: "inaccuracy", symbol: "?!", color: "#ffc107" };
  if (diff >= THRESHOLDS.excellent) return { type: "excellent", symbol: "!!", color: "#4caf50" };
  if (diff >= THRESHOLDS.good) return { type: "good", symbol: "!", color: "#8bc34a" };
  return { type: "normal", symbol: "", color: "#fff" };
}

// Generate coaching feedback for a move
function generateCoachingFeedback(move, classification, position) {
  if (classification.type === "blunder") {
    if (move.captured) {
      return "This capture lost significant material. Before capturing, always check if your piece will be safe.";
    }
    return "This was a serious mistake that significantly worsened your position. Take more time on critical moves.";
  }
  
  if (classification.type === "mistake") {
    return "This move gave away some advantage. Try to think about your opponent's responses before committing.";
  }
  
  if (classification.type === "inaccuracy") {
    return "A small slip here. The position is still playable, but there was a better option.";
  }
  
  if (classification.type === "excellent") {
    return "Excellent move! You found the best continuation.";
  }
  
  if (classification.type === "good") {
    return "Good move! This improves your position.";
  }
  
  return null;
}

export default function GameAnalyzer({ game, userSkills, voice, onBack, onSkillUpdate }) {
  const [pgn, setPgn] = useState(game?.pgn || "");
  const [chess, setChess] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(-1);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coachFeedback, setCoachFeedback] = useState(null);
  const [showPgnInput, setShowPgnInput] = useState(!game?.pgn);
  const [summary, setSummary] = useState(null);

  // Speak coach feedback when it changes
  useEffect(() => {
    if (coachFeedback && voice?.isEnabled) {
      voice.speak(coachFeedback);
    }
  }, [coachFeedback]);

  // Worker for Stockfish (optional enhancement)
  const workerRef = useRef(null);

  // Load PGN
  const loadPgn = useCallback((pgnText) => {
    try {
      const newChess = new Chess();
      newChess.loadPgn(pgnText);
      
      // Get all moves
      const history = newChess.history({ verbose: true });
      
      // Reset to start
      newChess.reset();
      
      setChess(newChess);
      setMoves(history);
      setCurrentMoveIdx(-1);
      setPgn(pgnText);
      setShowPgnInput(false);
      setAnalysis(null);
      setSummary(null);
      
      return true;
    } catch (e) {
      console.error("Invalid PGN:", e);
      return false;
    }
  }, []);

  // Analyze the game
  const analyzeGame = useCallback(async () => {
    if (moves.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simple analysis without external engine
    const analysisData = [];
    const tempChess = new Chess();
    let prevEval = 0;
    
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const turnBefore = tempChess.turn();
      const evalBefore = evaluateMaterial(tempChess);
      
      tempChess.move(move);
      
      const evalAfter = evaluateMaterial(tempChess);
      const classification = classifyMove(evalBefore, evalAfter, turnBefore);
      const feedback = generateCoachingFeedback(move, classification, tempChess);
      
      analysisData.push({
        move,
        fen: tempChess.fen(),
        evalBefore,
        evalAfter,
        classification,
        feedback,
        turn: turnBefore
      });
      
      prevEval = evalAfter;
    }
    
    setAnalysis(analysisData);
    
    // Generate summary
    const blunders = analysisData.filter(a => a.classification.type === "blunder");
    const mistakes = analysisData.filter(a => a.classification.type === "mistake");
    const inaccuracies = analysisData.filter(a => a.classification.type === "inaccuracy");
    const excellent = analysisData.filter(a => a.classification.type === "excellent");
    
    const accuracy = Math.round(
      ((analysisData.length - blunders.length * 3 - mistakes.length * 2 - inaccuracies.length) 
       / analysisData.length) * 100
    );
    
    setSummary({
      totalMoves: moves.length,
      blunders: blunders.length,
      mistakes: mistakes.length,
      inaccuracies: inaccuracies.length,
      excellent: excellent.length,
      accuracy: Math.max(0, Math.min(100, accuracy)),
      keyMoments: [...blunders.slice(0, 3), ...mistakes.slice(0, 2)]
    });
    
    setIsAnalyzing(false);
  }, [moves]);

  // Navigate moves
  const goToMove = useCallback((idx) => {
    const newChess = new Chess();
    
    for (let i = 0; i <= idx; i++) {
      if (i < moves.length) {
        newChess.move(moves[i]);
      }
    }
    
    setChess(newChess);
    setCurrentMoveIdx(idx);
    
    // Show feedback for this move
    if (analysis && idx >= 0 && analysis[idx]) {
      setCoachFeedback(analysis[idx]);
    } else {
      setCoachFeedback(null);
    }
  }, [moves, analysis]);

  // Navigation helpers
  const goToStart = () => goToMove(-1);
  const goBack = () => goToMove(Math.max(-1, currentMoveIdx - 1));
  const goForward = () => goToMove(Math.min(moves.length - 1, currentMoveIdx + 1));
  const goToEnd = () => goToMove(moves.length - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goBack();
      if (e.key === "ArrowRight") goForward();
      if (e.key === "Home") goToStart();
      if (e.key === "End") goToEnd();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentMoveIdx, moves.length]);

  // Render PGN input
  if (showPgnInput) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button
            onClick={onBack}
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
          <h2 style={{ margin: 0 }}>🔍 Game Analysis</h2>
        </div>

        <div style={{
          background: "rgba(0,0,0,0.2)",
          borderRadius: 16,
          padding: 24
        }}>
          <h3 style={{ marginTop: 0 }}>Paste Your Game (PGN)</h3>
          <p style={{ opacity: 0.7, marginBottom: 16 }}>
            Copy a game from Chess.com, Lichess, or any chess app and paste it below.
          </p>
          
          <textarea
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            placeholder={`[Event "My Game"]
[Date "2024.01.18"]
[White "Me"]
[Black "Opponent"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 ...`}
            style={{
              width: "100%",
              height: 200,
              padding: 16,
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
              fontFamily: "monospace",
              fontSize: 14,
              resize: "vertical"
            }}
          />
          
          <button
            onClick={() => loadPgn(pgn)}
            disabled={!pgn.trim()}
            style={{
              marginTop: 16,
              padding: "14px 32px",
              background: pgn.trim() ? "#4CAF50" : "#555",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: pgn.trim() ? "pointer" : "not-allowed"
            }}
          >
            Load Game →
          </button>
          
          {/* Sample game button */}
          <button
            onClick={() => {
              const sample = `[Event "Casual Game"]
[Site "Chess.com"]
[Date "2024.01.18"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4 Qc7 12. Nbd2 cxd4 13. cxd4 Nc6 14. Nb3 a5 15. Be3 a4 16. Nbd2 Bd7 17. Rc1 Qb8 18. Nf1 exd4 19. Bxd4 Nxd4 20. Qxd4 Bc6 21. Ng3 Rd8 22. Bb1 d5 23. exd5 Nxd5 24. Qd3 g6 25. Rcd1 Bf6 26. Qe4 Qb6 27. Nh5 Bg7 28. Qg4 Nf6 29. Nxg7 Nxg4 30. Nh5 Rxd1 31. Rxd1 Nxf2 32. Kxf2 gxh5 33. Rd6 Qc5+ 34. Kf1 Re8 35. Rxc6 Qf5 36. Rc7 Re1+ 37. Kxe1 Qxb1+ 38. Nd2 1-0`;
              setPgn(sample);
            }}
            style={{
              marginTop: 16,
              marginLeft: 12,
              padding: "14px 24px",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            Load Sample Game
          </button>
        </div>
      </div>
    );
  }

  // Main analysis view
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setShowPgnInput(true)}
          style={{
            padding: "8px 16px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ← New Game
        </button>
        <h2 style={{ margin: 0 }}>🔍 Game Analysis</h2>
        
        {!analysis && (
          <button
            onClick={analyzeGame}
            disabled={isAnalyzing}
            style={{
              marginLeft: "auto",
              padding: "10px 20px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: isAnalyzing ? "not-allowed" : "pointer"
            }}
          >
            {isAnalyzing ? "Analyzing..." : "🔬 Analyze Game"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Board section */}
        <div style={{ flex: "0 0 auto" }}>
          <Board
            chess={chess}
            fen={chess.fen()}
            orientation="w"
            interactive={false}
            size={420}
          />
          
          {/* Navigation */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 16
          }}>
            <NavButton onClick={goToStart} disabled={currentMoveIdx < 0}>⏮</NavButton>
            <NavButton onClick={goBack} disabled={currentMoveIdx < 0}>◀</NavButton>
            <NavButton onClick={goForward} disabled={currentMoveIdx >= moves.length - 1}>▶</NavButton>
            <NavButton onClick={goToEnd} disabled={currentMoveIdx >= moves.length - 1}>⏭</NavButton>
          </div>
        </div>

        {/* Analysis panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary (if analyzed) */}
          {summary && (
            <div style={{
              background: "rgba(0,0,0,0.2)",
              borderRadius: 12,
              padding: 16
            }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Game Summary</div>
              <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                <StatBox label="Accuracy" value={`${summary.accuracy}%`} color="#4CAF50" />
                <StatBox label="Blunders" value={summary.blunders} color="#f44336" />
                <StatBox label="Mistakes" value={summary.mistakes} color="#ff9800" />
                <StatBox label="Inaccuracies" value={summary.inaccuracies} color="#ffc107" />
              </div>
            </div>
          )}

          {/* Current move feedback */}
          {coachFeedback && (
            <div style={{
              background: `${coachFeedback.classification.color}15`,
              borderRadius: 12,
              padding: 16,
              border: `1px solid ${coachFeedback.classification.color}40`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ 
                  fontSize: 24, 
                  fontWeight: 700, 
                  color: coachFeedback.classification.color 
                }}>
                  {coachFeedback.move.san}{coachFeedback.classification.symbol}
                </span>
                <span style={{ 
                  padding: "4px 12px",
                  background: coachFeedback.classification.color,
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}>
                  {coachFeedback.classification.type}
                </span>
              </div>
              {coachFeedback.feedback && (
                <div style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start"
                }}>
                  <span style={{ fontSize: 24 }}>🎓</span>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
                    {coachFeedback.feedback}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Move list */}
          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: 12,
            padding: 16,
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Moves</div>
            <div style={{ 
              flex: 1, 
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              alignContent: "flex-start"
            }}>
              {moves.map((move, idx) => {
                const moveAnalysis = analysis?.[idx];
                const isSelected = idx === currentMoveIdx;
                
                return (
                  <span key={idx}>
                    {idx % 2 === 0 && (
                      <span style={{ opacity: 0.5, marginRight: 4 }}>
                        {Math.floor(idx / 2) + 1}.
                      </span>
                    )}
                    <span
                      onClick={() => goToMove(idx)}
                      style={{
                        padding: "2px 6px",
                        borderRadius: 4,
                        cursor: "pointer",
                        background: isSelected 
                          ? "rgba(76,175,80,0.3)" 
                          : "transparent",
                        color: moveAnalysis?.classification.color || "#fff",
                        fontWeight: moveAnalysis?.classification.type === "blunder" ? 700 : 400
                      }}
                    >
                      {move.san}
                      {moveAnalysis?.classification.symbol}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Key moments (if analyzed) */}
          {summary && summary.keyMoments.length > 0 && (
            <div style={{
              background: "rgba(0,0,0,0.2)",
              borderRadius: 12,
              padding: 16
            }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Key Moments</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {summary.keyMoments.map((moment, idx) => (
                  <div
                    key={idx}
                    onClick={() => goToMove(moves.indexOf(moment.move))}
                    style={{
                      padding: "8px 12px",
                      background: `${moment.classification.color}15`,
                      borderRadius: 8,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    <span style={{ 
                      fontWeight: 700, 
                      color: moment.classification.color 
                    }}>
                      {moment.move.san}{moment.classification.symbol}
                    </span>
                    <span style={{ fontSize: 13, opacity: 0.7 }}>
                      Move {moves.indexOf(moment.move) + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper components
function NavButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 48,
        height: 40,
        background: disabled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
        border: "none",
        borderRadius: 8,
        color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
        fontSize: 18,
        cursor: disabled ? "not-allowed" : "pointer"
      }}
    >
      {children}
    </button>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
    </div>
  );
}
