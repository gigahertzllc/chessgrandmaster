import React, { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import Board from "./Board.jsx";

/**
 * Play vs Bot Component with Built-in Chess Engine
 * 
 * Uses a simple evaluation + search that works without external dependencies.
 */

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE CHESS ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Piece-square tables for positional evaluation
const PST = {
  p: [
    0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0
  ],
  n: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50
  ],
  b: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20
  ],
  r: [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
  ],
  q: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20
  ],
  k: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20
  ]
};

function squareToIndex(square) {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  return (7 - rank) * 8 + file;
}

function evaluateBoard(chess) {
  const board = chess.board();
  let score = 0;
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      
      const idx = r * 8 + c;
      const pieceValue = PIECE_VALUES[piece.type];
      const pstValue = PST[piece.type]?.[piece.color === 'w' ? idx : 63 - idx] || 0;
      
      if (piece.color === 'w') {
        score += pieceValue + pstValue;
      } else {
        score -= pieceValue + pstValue;
      }
    }
  }
  
  // Mobility bonus
  const moves = chess.moves().length;
  score += (chess.turn() === 'w' ? 1 : -1) * moves * 2;
  
  return score;
}

function minimax(chess, depth, alpha, beta, maximizing) {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }
  
  const moves = chess.moves();
  
  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function findBestMove(chess, skillLevel = 10) {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;
  
  // Adjust search depth based on skill level
  const depth = Math.max(1, Math.min(4, Math.floor(skillLevel / 5)));
  
  // Add some randomness for lower skill levels
  const randomFactor = Math.max(0, (20 - skillLevel) / 20);
  
  const isMaximizing = chess.turn() === 'w';
  let bestMove = null;
  let bestScore = isMaximizing ? -Infinity : Infinity;
  
  const scoredMoves = [];
  
  for (const move of moves) {
    chess.move(move);
    const score = minimax(chess, depth - 1, -Infinity, Infinity, !isMaximizing);
    chess.undo();
    
    scoredMoves.push({ move, score });
    
    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }
  
  // For lower skill levels, sometimes pick a suboptimal move
  if (randomFactor > 0 && Math.random() < randomFactor) {
    scoredMoves.sort((a, b) => isMaximizing ? b.score - a.score : a.score - b.score);
    const topMoves = scoredMoves.slice(0, Math.max(3, Math.floor(moves.length * 0.3)));
    const randomIdx = Math.floor(Math.random() * topMoves.length);
    return topMoves[randomIdx].move;
  }
  
  return bestMove;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIO
// ═══════════════════════════════════════════════════════════════════════════

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playSound(freq, duration = 0.1) {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playMoveSound(capture) {
  playSound(capture ? 300 : 600, 0.1);
}

function playEndSound() {
  playSound(440, 0.3);
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function formatTime(secs) {
  return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
}

export default function PlayVsBot({ profile, onBack }) {
  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [phase, setPhase] = useState("setup");
  const [playerColor, setPlayerColor] = useState("w");
  const [orientation, setOrientation] = useState("w");
  const [history, setHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  
  const [useTimer, setUseTimer] = useState(false);
  const [playerTime, setPlayerTime] = useState(600);
  const [botTime, setBotTime] = useState(600);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === "setup") setOrientation(playerColor);
  }, [playerColor, phase]);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || !useTimer) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      const chess = chessRef.current;
      const myTurn = chess.turn() === playerColor;
      if (myTurn && !thinking) {
        setPlayerTime(t => {
          if (t <= 1) { endGame(playerColor === "w" ? "0-1" : "1-0", "Time"); return 0; }
          return t - 1;
        });
      } else if (!myTurn) {
        setBotTime(t => {
          if (t <= 1) { endGame(playerColor === "w" ? "1-0" : "0-1", "Time"); return 0; }
          return t - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, useTimer, playerColor, thinking]);

  const endGame = useCallback((res, reason) => {
    playEndSound();
    setPhase("ended");
    setResult({ result: res, reason });
  }, []);

  const checkGameOver = useCallback((chess) => {
    if (chess.isGameOver()) {
      let res, reason;
      if (chess.isCheckmate()) {
        res = chess.turn() === "w" ? "0-1" : "1-0";
        reason = "Checkmate";
      } else if (chess.isStalemate()) {
        res = "½-½"; reason = "Stalemate";
      } else if (chess.isDraw()) {
        res = "½-½"; reason = "Draw";
      } else {
        res = "½-½"; reason = "Game Over";
      }
      endGame(res, reason);
      return true;
    }
    return false;
  }, [endGame]);

  const makeEngineMove = useCallback(() => {
    const chess = chessRef.current;
    setThinking(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const best = findBestMove(chess, profile?.skillLevel || 10);
      
      if (best) {
        const move = chess.move(best);
        if (move) {
          playMoveSound(move.captured);
          setFen(chess.fen());
          setLastMove({ from: best.from, to: best.to });
          setHistory(h => [...h, move.san]);
          checkGameOver(chess);
        }
      }
      setThinking(false);
    }, 300 + Math.random() * 500);
  }, [profile, checkGameOver]);

  const onPlayerMove = useCallback((move) => {
    if (phase !== "playing" || thinking) return;
    const chess = chessRef.current;
    if (chess.turn() !== playerColor) return;
    
    try {
      const result = chess.move(move);
      if (result) {
        playMoveSound(result.captured);
        setFen(chess.fen());
        setLastMove({ from: move.from, to: move.to });
        setHistory(h => [...h, result.san]);
        
        if (!checkGameOver(chess)) {
          setTimeout(makeEngineMove, 300);
        }
      }
    } catch (e) {}
  }, [phase, thinking, playerColor, checkGameOver, makeEngineMove]);

  const startGame = useCallback(() => {
    const chess = chessRef.current;
    chess.reset();
    setFen(chess.fen());
    setHistory([]);
    setLastMove(null);
    setResult(null);
    setPhase("playing");
    setPlayerTime(600);
    setBotTime(600);
    setOrientation(playerColor);
    
    if (playerColor === "b") {
      setTimeout(makeEngineMove, 500);
    }
  }, [playerColor, makeEngineMove]);

  const resign = useCallback(() => {
    endGame(playerColor === "w" ? "0-1" : "1-0", "Resignation");
  }, [playerColor, endGame]);

  const newGame = useCallback(() => {
    chessRef.current.reset();
    setFen(chessRef.current.fen());
    setHistory([]);
    setLastMove(null);
    setResult(null);
    setPhase("setup");
  }, []);

  const chess = chessRef.current;
  const myTurn = chess.turn() === playerColor;

  return (
    <div style={{ display: "flex", gap: 24, background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 24 }}>
      {/* Board side */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Opponent */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 32 }}>{profile.avatar}</span>
            <div>
              <div style={{ fontWeight: 700 }}>{profile.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {phase === "playing" && !myTurn && thinking ? "Thinking..." : ""}
              </div>
            </div>
          </div>
          {useTimer && phase === "playing" && (
            <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: botTime < 60 ? "#ff6b6b" : "#fff" }}>
              {formatTime(botTime)}
            </div>
          )}
        </div>

        <Board
          chess={chess}
          orientation={orientation}
          interactive={phase === "playing" && myTurn && !thinking}
          onMove={onPlayerMove}
          lastMove={lastMove}
          disabled={phase !== "playing" || !myTurn || thinking}
          size={480}
        />

        {/* Player */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 32 }}>🧑</span>
            <div>
              <div style={{ fontWeight: 700 }}>You</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {phase === "playing" && myTurn && !thinking ? "Your turn" : ""}
              </div>
            </div>
          </div>
          {useTimer && phase === "playing" && (
            <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: playerTime < 60 ? "#ff6b6b" : "#fff" }}>
              {formatTime(playerTime)}
            </div>
          )}
        </div>

        {phase === "playing" && (
          <button onClick={() => setOrientation(o => o === "w" ? "b" : "w")}
            style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" }}>
            🔄 Flip Board
          </button>
        )}
      </div>

      {/* Controls side */}
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 16 }}>
        {phase === "setup" && (
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: "0 0 16px 0" }}>Game Setup</h3>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>PLAY AS</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["w", "b"].map(c => (
                  <button key={c} onClick={() => setPlayerColor(c)}
                    style={{
                      flex: 1, padding: 14, borderRadius: 8,
                      border: playerColor === c ? "2px solid #4CAF50" : "2px solid transparent",
                      background: playerColor === c ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.1)",
                      color: "#fff", cursor: "pointer", fontSize: 18
                    }}>
                    {c === "w" ? "♔ White" : "♚ Black"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 8 }}>
                <input type="checkbox" checked={useTimer} onChange={e => setUseTimer(e.target.checked)} style={{ width: 18, height: 18 }} />
                <span>10 min clock</span>
              </label>
            </div>
            <button onClick={startGame}
              style={{ width: "100%", padding: 16, borderRadius: 8, border: "none", background: "#4CAF50", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              ▶ Start Game
            </button>
          </div>
        )}

        {phase === "playing" && (
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>{thinking ? "🤔 Thinking..." : "♟️ Playing"}</span>
              <button onClick={resign} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#c62828", color: "#fff", cursor: "pointer" }}>
                Resign
              </button>
            </div>
          </div>
        )}

        {phase === "ended" && result && (
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 20, border: "2px solid #4CAF50" }}>
            <h3 style={{ margin: 0 }}>Game Over</h3>
            <div style={{ fontSize: 32, fontWeight: 700, margin: "12px 0" }}>{result.result}</div>
            <div style={{ opacity: 0.8, marginBottom: 16 }}>{result.reason}</div>
            <button onClick={newGame}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: "#4CAF50", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
              New Game
            </button>
          </div>
        )}

        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 16, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 700, marginBottom: 12, opacity: 0.7 }}>MOVES</div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {history.length === 0 ? (
              <div style={{ opacity: 0.5 }}>No moves</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {history.map((m, i) => (
                  <span key={i}>
                    {i % 2 === 0 && <span style={{ opacity: 0.5 }}>{Math.floor(i/2)+1}.</span>} {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>{profile.avatar}</span>
            <div>
              <div style={{ fontWeight: 700 }}>{profile.label}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Skill: {profile.skillLevel}/20</div>
            </div>
          </div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{profile.description}</div>
        </div>

        <button onClick={onBack}
          style={{ padding: 12, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
          ← Back
        </button>
      </div>
    </div>
  );
}
