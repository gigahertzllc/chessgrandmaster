import React, { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import Board from "./Board.jsx";

/**
 * Play vs Bot Component - Stockfish CDN Edition
 * 
 * Uses Stockfish.js loaded from CDN for strong chess engine play.
 * Skill levels 1-20 map to Stockfish's Skill Level UCI option.
 */

// Sound effects
function playMoveSound(captured) {
  try {
    const audio = new Audio(captured ? "/audio/capture.mp3" : "/audio/move.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch (e) {}
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayVsBot({ profile, onBack }) {
  const chessRef = useRef(new Chess());
  const workerRef = useRef(null);
  const pendingMoveRef = useRef(false);

  const [fen, setFen] = useState(chessRef.current.fen());
  const [history, setHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [phase, setPhase] = useState("setup"); // setup | playing | ended
  const [result, setResult] = useState(null);
  const [playerColor, setPlayerColor] = useState("w");
  const [orientation, setOrientation] = useState("w");
  const [thinking, setThinking] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [engineError, setEngineError] = useState(null);
  
  // Timer state
  const [useTimer, setUseTimer] = useState(false);
  const [playerTime, setPlayerTime] = useState(600);
  const [botTime, setBotTime] = useState(600);

  // Initialize Stockfish worker
  useEffect(() => {
    const worker = new Worker(
      new URL("../engine/stockfish.worker.js", import.meta.url),
      { type: "classic" }
    );
    workerRef.current = worker;

    worker.onmessage = (evt) => {
      const msg = evt.data;

      if (msg.type === "ready") {
        console.log("[PlayVsBot] Stockfish ready");
        setEngineReady(true);
        setEngineError(null);
      }

      if (msg.type === "log") {
        console.log("[Stockfish]", msg.message);
      }

      if (msg.type === "error") {
        console.error("Stockfish error:", msg.message);
        setEngineError(msg.message);
      }

      if (msg.type === "engine_line") {
        const line = String(msg.line ?? "");

        // Parse bestmove response
        if (line.startsWith("bestmove ") && pendingMoveRef.current) {
          pendingMoveRef.current = false;
          const parts = line.split(" ");
          const bestMove = parts[1];

          if (bestMove && bestMove !== "(none)") {
            // Parse UCI move (e.g., "e2e4" or "e7e8q" for promotion)
            const from = bestMove.slice(0, 2);
            const to = bestMove.slice(2, 4);
            const promotion = bestMove.length > 4 ? bestMove[4] : undefined;

            const chess = chessRef.current;
            try {
              const move = chess.move({ from, to, promotion });
              if (move) {
                playMoveSound(move.captured);
                setFen(chess.fen());
                setHistory(h => [...h, move.san]);
                setLastMove({ from, to });
                checkGameOver(chess);
              }
            } catch (e) {
              console.error("Engine move failed:", e);
            }
          }
          setThinking(false);
        }
      }
    };

    worker.postMessage({ type: "init" });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!useTimer || phase !== "playing") return;
    
    const interval = setInterval(() => {
      const chess = chessRef.current;
      const isPlayerTurn = chess.turn() === playerColor;
      
      if (isPlayerTurn) {
        setPlayerTime(t => {
          if (t <= 1) {
            endGame(playerColor === "w" ? "0-1" : "1-0", "Time out");
            return 0;
          }
          return t - 1;
        });
      } else {
        setBotTime(t => {
          if (t <= 1) {
            endGame(playerColor === "w" ? "1-0" : "0-1", "Time out");
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [useTimer, phase, playerColor]);

  const checkGameOver = useCallback((chess) => {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === "w" ? "0-1" : "1-0";
      endGame(winner, "Checkmate");
      return true;
    }
    if (chess.isStalemate()) {
      endGame("½-½", "Stalemate");
      return true;
    }
    if (chess.isDraw()) {
      endGame("½-½", "Draw");
      return true;
    }
    if (chess.isThreefoldRepetition()) {
      endGame("½-½", "Threefold repetition");
      return true;
    }
    if (chess.isInsufficientMaterial()) {
      endGame("½-½", "Insufficient material");
      return true;
    }
    return false;
  }, []);

  const endGame = useCallback((result, reason) => {
    setPhase("ended");
    setResult({ result, reason });
  }, []);

  // Request engine move via Stockfish worker
  const makeEngineMove = useCallback(() => {
    if (!workerRef.current || !engineReady) return;
    
    const chess = chessRef.current;
    if (chess.isGameOver()) return;

    setThinking(true);
    pendingMoveRef.current = true;

    // Set skill level for this profile
    workerRef.current.postMessage({ 
      type: "set_profile", 
      profile 
    });

    // Request analysis
    workerRef.current.postMessage({
      type: "analyze",
      fen: chess.fen(),
      profile,
      movetimeMs: profile?.moveTimeMs ?? 500
    });
  }, [profile, engineReady]);

  // Trigger engine move when it's bot's turn
  useEffect(() => {
    if (phase !== "playing" || !engineReady) return;
    
    const chess = chessRef.current;
    const isBotTurn = chess.turn() !== playerColor;
    
    if (isBotTurn && !thinking && !chess.isGameOver()) {
      const timer = setTimeout(makeEngineMove, 300);
      return () => clearTimeout(timer);
    }
  }, [fen, phase, playerColor, engineReady, thinking, makeEngineMove]);

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
        checkGameOver(chess);
      }
    } catch (e) {}
  }, [phase, thinking, playerColor, checkGameOver]);

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
  }, [playerColor]);

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
                {!engineReady ? "Loading Stockfish..." : 
                 phase === "playing" && !myTurn && thinking ? "Thinking..." : ""}
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
          fen={fen}
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
        {/* Engine status */}
        {engineError && (
          <div style={{ background: "rgba(198,40,40,0.3)", borderRadius: 8, padding: 12, fontSize: 13 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>⚠️ Stockfish Error</div>
            <div style={{ opacity: 0.9, marginBottom: 8 }}>{engineError}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>
              Try refreshing the page. If the issue persists, your browser may be blocking the Stockfish CDN.
            </div>
          </div>
        )}

        {phase === "setup" && (
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: "0 0 16px 0" }}>Game Setup</h3>
            
            {!engineReady && (
              <div style={{ marginBottom: 16, padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 8, fontSize: 13 }}>
                ⏳ Loading Stockfish engine...
              </div>
            )}
            
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
              disabled={!engineReady}
              style={{ 
                width: "100%", padding: 16, borderRadius: 8, border: "none", 
                background: engineReady ? "#4CAF50" : "#666", 
                color: "#fff", fontSize: 16, fontWeight: 700, 
                cursor: engineReady ? "pointer" : "not-allowed" 
              }}>
              {engineReady ? "▶ Start Game" : "⏳ Loading..."}
            </button>
          </div>
        )}

        {phase === "playing" && (
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>{thinking ? "🤔 Stockfish thinking..." : "♟️ Playing"}</span>
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
              <div style={{ fontSize: 12, opacity: 0.6 }}>Skill: {profile.skillLevel}/20 • Stockfish</div>
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
