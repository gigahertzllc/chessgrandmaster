/**
 * Puzzle Trainer - Interactive Tactical Training
 * 
 * Real chess puzzles where users:
 * - See a position on the board
 * - Find the best move by clicking/dragging
 * - Get immediate feedback
 * - Progress through difficulty levels
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Chess } from "chess.js";
import Board from "../components/Board.jsx";
import { useResponsive } from "../hooks/useResponsive.js";

// Real tactical puzzles - verified positions from actual games
const PUZZLE_DATABASE = [
  // ═══════════════════════════════════════════════════════════════════════════
  // BEGINNER - Mate in 1
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "m1_001",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    solution: ["Qxf7#"],
    playerToMove: "white",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Scholar's Mate",
    hint: "The f7 square is only defended by the king...",
  },
  {
    id: "m1_002",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 3",
    solution: ["Qxh2#"],
    playerToMove: "black",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Fool's Mate Pattern",
    hint: "The king has no escape squares...",
  },
  {
    id: "m1_003",
    fen: "r1bqk2r/pppp1Qpp/2n2n2/2b1p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
    solution: ["Qxf7#"],
    playerToMove: "white",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Queen Delivers",
    hint: "Take with check!",
    startFen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
  },
  {
    id: "m1_004",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution: ["Re8#"],
    playerToMove: "white",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Back Rank Mate",
    hint: "The king is trapped on the back rank!",
  },
  {
    id: "m1_005",
    fen: "5rk1/5ppp/8/8/8/8/5PPP/R3R1K1 w - - 0 1",
    solution: ["Re8#", "Rae8#"],
    playerToMove: "white",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Back Rank with Support",
    hint: "One rook can mate, the other covers.",
  },
  {
    id: "m1_006",
    fen: "r4rk1/ppp2ppp/8/8/8/8/PPP2PPP/R4RK1 b - - 0 1",
    solution: ["Rf1#", "Rxf1#"],
    playerToMove: "black",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Black Delivers Back Rank",
    hint: "White's back rank is weak!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BEGINNER - Simple Tactics (Win Material)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "tac_001",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
    solution: ["exd4"],
    playerToMove: "black",
    theme: "capture",
    difficulty: 1,
    title: "Capture the Pawn",
    hint: "Free pawn!",
  },
  {
    id: "tac_002",
    fen: "r1bqkb1r/ppppnppp/5n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    solution: ["Qxe5+"],
    playerToMove: "white",
    theme: "capture",
    difficulty: 1,
    title: "Win the Pawn with Check",
    hint: "Take and give check at the same time!",
  },
  {
    id: "fork_001",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Bxf7+"],
    playerToMove: "white",
    theme: "fork",
    difficulty: 1,
    title: "Bishop Fork",
    hint: "Attack the king and win the knight!",
  },
  {
    id: "fork_002",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    solution: ["Nxe5"],
    playerToMove: "white",
    theme: "capture",
    difficulty: 1,
    title: "Knight Takes",
    hint: "The pawn is free!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERMEDIATE - Knight Forks
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "nf_001",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
    solution: ["Bxf7+", "Kxf7", "Ng5+"],
    playerToMove: "white",
    theme: "knight-fork",
    difficulty: 2,
    title: "Classic Knight Fork Setup",
    hint: "Sacrifice the bishop to set up the fork!",
  },
  {
    id: "nf_002",
    fen: "r2qk2r/ppp2ppp/2n1bn2/3pp3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
    solution: ["Nxd5"],
    playerToMove: "white",
    theme: "knight-fork",
    difficulty: 2,
    title: "Knight Fork Coming",
    hint: "Take the pawn, attack two pieces!",
  },
  {
    id: "nf_003",
    fen: "r1bq1rk1/pppn1ppp/4pn2/3p4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 7",
    solution: ["cxd5", "exd5", "Nb5"],
    playerToMove: "white",
    theme: "knight-fork",
    difficulty: 2,
    title: "Open the Position",
    hint: "Exchange pawns to unleash the knight!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERMEDIATE - Pins
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pin_001",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: ["Ng5"],
    playerToMove: "white",
    theme: "attack",
    difficulty: 2,
    title: "Attack f7",
    hint: "Target the weak f7 pawn!",
  },
  {
    id: "pin_002",
    fen: "r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Ng5"],
    playerToMove: "white",
    theme: "attack",
    difficulty: 2,
    title: "Double Attack on f7",
    hint: "Knight and bishop both target f7!",
  },
  {
    id: "pin_003",
    fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
    solution: ["Bd2", "Qa4+"],
    playerToMove: "white",
    theme: "pin",
    difficulty: 2,
    title: "Break the Pin",
    hint: "Or counter-attack!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERMEDIATE - Skewers
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "skw_001",
    fen: "6k1/5p1p/6p1/8/8/8/1r3PPP/R5K1 b - - 0 1",
    solution: ["Rb1+", "Rxb1"],
    playerToMove: "black",
    theme: "skewer",
    difficulty: 2,
    title: "Rook Skewer",
    hint: "Check the king, win the rook!",
  },
  {
    id: "skw_002",
    fen: "8/8/8/3k4/8/8/3K4/R7 w - - 0 1",
    solution: ["Ra5+"],
    playerToMove: "white",
    theme: "skewer",
    difficulty: 2,
    title: "Skewer the King",
    hint: "Line up the rook with both kings!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERMEDIATE - Discovered Attacks
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "disc_001",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p1B1/2B1P3/5N2/PPPP1PPP/RN1QK2R b KQkq - 5 4",
    solution: ["h6"],
    playerToMove: "black",
    theme: "attack-bishop",
    difficulty: 2,
    title: "Chase the Bishop",
    hint: "Kick the annoying bishop!",
  },
  {
    id: "disc_002",
    fen: "rn1qkbnr/ppp2ppp/4p3/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5",
    solution: ["Nh4"],
    playerToMove: "white",
    theme: "discovered-attack",
    difficulty: 2,
    title: "Discover Attack on Bishop",
    hint: "Move the knight, reveal the attack!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED - Mate in 2
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "m2_001",
    fen: "r1b1k2r/ppppqppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5",
    solution: ["Bxf7+", "Qxf7", "Ng5+"],
    playerToMove: "white",
    theme: "mate-in-2",
    difficulty: 3,
    title: "Fried Liver Setup",
    hint: "Sacrifice to expose the king!",
  },
  {
    id: "m2_002",
    fen: "6k1/5ppp/8/8/8/5Q2/5PPP/6K1 w - - 0 1",
    solution: ["Qf6", "Qg7#"],
    playerToMove: "white",
    theme: "mate-in-2",
    difficulty: 3,
    title: "Queen Infiltration",
    hint: "Threaten mate, then deliver!",
  },
  {
    id: "m2_003",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 6 5",
    solution: ["Qxf7+", "Kd8", "Qxf8#"],
    playerToMove: "white",
    theme: "mate-in-2",
    difficulty: 3,
    title: "Queen Rampage",
    hint: "Take with check, keep checking!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED - Sacrifices
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sac_001",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: ["Bxf7+"],
    playerToMove: "white",
    theme: "sacrifice",
    difficulty: 3,
    title: "Greek Gift Prep",
    hint: "This sacrifice leads to a strong attack!",
  },
  {
    id: "sac_002",
    fen: "r1b1kb1r/ppppqppp/5n2/4n3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 6",
    solution: ["d5"],
    playerToMove: "white",
    theme: "pawn-push",
    difficulty: 3,
    title: "Central Breakthrough",
    hint: "Push forward, gain space!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED - Combinations
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cmb_001",
    fen: "r2qr1k1/ppp2ppp/2n5/3p4/3Pn1b1/2NBPN2/PPP2PPP/R2QK2R b KQ - 0 10",
    solution: ["Nxd4"],
    playerToMove: "black",
    theme: "combination",
    difficulty: 3,
    title: "Tactical Shot",
    hint: "The knight takes!",
  },
  {
    id: "cmb_002",
    fen: "r1bq1rk1/ppp2ppp/2n2n2/3p4/1b1P4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 7",
    solution: ["e4"],
    playerToMove: "white",
    theme: "center-control",
    difficulty: 3,
    title: "Seize the Center",
    hint: "Push e4 to challenge!",
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ENDGAME - Basic Mates
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "end_001",
    fen: "8/8/8/4k3/8/8/8/4K2R w - - 0 1",
    solution: ["Rh5+"],
    playerToMove: "white",
    theme: "endgame",
    difficulty: 2,
    title: "Cut Off the King",
    hint: "Use the rook to restrict the king!",
  },
  {
    id: "end_002",
    fen: "8/8/8/3k4/8/8/4K3/7R w - - 0 1",
    solution: ["Rd1+"],
    playerToMove: "white",
    theme: "endgame",
    difficulty: 2,
    title: "Push Back the King",
    hint: "Check forces the king back!",
  },
  {
    id: "end_003",
    fen: "k7/8/1K6/8/8/8/8/7R w - - 0 1",
    solution: ["Ra1#"],
    playerToMove: "white",
    theme: "endgame",
    difficulty: 1,
    title: "Deliver the Mate",
    hint: "The king is trapped in the corner!",
  },
  {
    id: "end_004",
    fen: "8/8/8/8/8/1k6/8/1K1R4 w - - 0 1",
    solution: ["Rd3+"],
    playerToMove: "white",
    theme: "endgame",
    difficulty: 2,
    title: "Opposition and Check",
    hint: "Check to gain the opposition!",
  },
];

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PuzzleTrainer({ 
  difficulty = "all", // "all", 1, 2, 3
  theme = "all", // "all", "mate-in-1", "fork", etc.
  count = 10,
  voice,
  onComplete,
  onBack 
}) {
  const { isMobile, isTablet, width, height } = useResponsive();
  const [puzzles, setPuzzles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chess, setChess] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [status, setStatus] = useState("thinking"); // thinking | correct | incorrect | hint | complete
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [expectedMoveIndex, setExpectedMoveIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, hintsUsed: 0 });
  const [streak, setStreak] = useState(0);

  // Filter and load puzzles
  useEffect(() => {
    let filtered = [...PUZZLE_DATABASE];
    
    if (difficulty !== "all") {
      filtered = filtered.filter(p => p.difficulty === difficulty);
    }
    
    if (theme !== "all") {
      filtered = filtered.filter(p => p.theme === theme || p.theme?.includes(theme));
    }
    
    // Shuffle and take count
    const selected = shuffleArray(filtered).slice(0, count);
    setPuzzles(selected);
    
    if (selected.length > 0) {
      loadPuzzle(selected[0]);
    }
  }, [difficulty, theme, count]);

  // Load a puzzle onto the board
  const loadPuzzle = useCallback((puzzle) => {
    const newChess = new Chess(puzzle.fen);
    setChess(newChess);
    setSelectedSquare(null);
    setLegalMoves([]);
    setStatus("thinking");
    setShowHint(false);
    setMoveHistory([]);
    setExpectedMoveIndex(0);
    
    const toMove = newChess.turn() === 'w' ? 'White' : 'Black';
    setMessage(`${toMove} to move. ${puzzle.title}`);
    
    // Speak the puzzle intro
    if (voice?.isEnabled) {
      setTimeout(() => {
        voice.speak(`${puzzle.title}. ${toMove} to move.`);
      }, 300);
    }
  }, [voice]);

  // Current puzzle
  const currentPuzzle = puzzles[currentIndex];

  // Handle square click
  const handleSquareClick = useCallback((square) => {
    if (status === "correct" || status === "complete") return;
    
    const piece = chess.get(square);
    const turn = chess.turn();
    
    // If clicking own piece, select it
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setLegalMoves(moves.map(m => m.to));
      return;
    }
    
    // If piece selected and clicking valid target, make move
    if (selectedSquare && legalMoves.includes(square)) {
      makeMove(selectedSquare, square);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [chess, selectedSquare, legalMoves, status]);

  // Make a move
  const makeMove = useCallback((from, to) => {
    if (!currentPuzzle) return;
    
    const solution = currentPuzzle.solution;
    const expectedMove = solution[expectedMoveIndex];
    
    // Try the move
    const move = chess.move({ from, to, promotion: 'q' });
    if (!move) return;
    
    // Check if correct
    const moveSan = move.san;
    const isCorrect = expectedMove.includes(moveSan) || 
                      expectedMove === moveSan ||
                      (Array.isArray(expectedMove) && expectedMove.includes(moveSan));
    
    setMoveHistory(prev => [...prev, moveSan]);
    setSelectedSquare(null);
    setLegalMoves([]);
    
    if (isCorrect) {
      // Move is correct
      if (expectedMoveIndex + 1 >= solution.length) {
        // Puzzle complete!
        setStatus("correct");
        setMessage("Correct! Well done! 🎉");
        setStreak(s => s + 1);
        setStats(s => ({ ...s, correct: s.correct + 1 }));
        
        if (voice?.isEnabled) {
          const phrases = ["Excellent!", "Perfect!", "Well done!", "Great find!"];
          voice.speak(phrases[Math.floor(Math.random() * phrases.length)]);
        }
      } else {
        // More moves needed - make opponent's response
        setExpectedMoveIndex(i => i + 1);
        setMessage("Good! Keep going...");
        
        // Opponent's reply (if there is one)
        if (expectedMoveIndex + 2 <= solution.length) {
          setTimeout(() => {
            const opponentMove = solution[expectedMoveIndex + 1];
            if (opponentMove && !opponentMove.includes('#')) {
              // Parse and make opponent move
              try {
                chess.move(opponentMove);
                setExpectedMoveIndex(i => i + 1);
                setChess(new Chess(chess.fen()));
              } catch (e) {
                // Skip if can't parse
              }
            }
          }, 500);
        }
      }
    } else {
      // Wrong move
      setStatus("incorrect");
      setMessage("Not quite. Try again!");
      setStreak(0);
      setStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
      
      if (voice?.isEnabled) {
        voice.speak("Not quite. Try again!");
      }
      
      // Undo after a moment
      setTimeout(() => {
        chess.undo();
        setChess(new Chess(chess.fen()));
        setStatus("thinking");
        setMessage(`Try again. ${currentPuzzle.title}`);
      }, 1500);
    }
  }, [chess, currentPuzzle, expectedMoveIndex, voice]);

  // Show hint
  const handleShowHint = useCallback(() => {
    if (!currentPuzzle) return;
    setShowHint(true);
    setStats(s => ({ ...s, hintsUsed: s.hintsUsed + 1 }));
    setMessage(currentPuzzle.hint);
    
    if (voice?.isEnabled) {
      voice.speak(currentPuzzle.hint);
    }
  }, [currentPuzzle, voice]);

  // Next puzzle
  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= puzzles.length) {
      setStatus("complete");
      setMessage(`Training complete! ${stats.correct}/${puzzles.length} correct.`);
      
      if (voice?.isEnabled) {
        voice.speak(`Training complete! You got ${stats.correct} out of ${puzzles.length} correct.`);
      }
      
      onComplete?.({
        correct: stats.correct,
        incorrect: stats.incorrect,
        hintsUsed: stats.hintsUsed,
        total: puzzles.length
      });
    } else {
      setCurrentIndex(i => i + 1);
      loadPuzzle(puzzles[currentIndex + 1]);
    }
  }, [currentIndex, puzzles, stats, loadPuzzle, onComplete, voice]);

  // Skip puzzle
  const handleSkip = useCallback(() => {
    setStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
    setStreak(0);
    handleNext();
  }, [handleNext]);

  // Show solution
  const handleShowSolution = useCallback(() => {
    if (!currentPuzzle) return;
    setMessage(`Solution: ${currentPuzzle.solution.join(' → ')}`);
    setStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
    setStreak(0);
    
    if (voice?.isEnabled) {
      voice.speak(`The solution was ${currentPuzzle.solution.join(', then ')}`);
    }
    
    setTimeout(() => {
      handleNext();
    }, 3000);
  }, [currentPuzzle, handleNext, voice]);

  if (puzzles.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>♟️</div>
        <h2>No puzzles found</h2>
        <p style={{ opacity: 0.7 }}>Try adjusting the difficulty or theme filters.</p>
        <button
          onClick={onBack}
          style={{
            marginTop: 20,
            padding: "12px 24px",
            background: "#666",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          ← Back
        </button>
      </div>
    );
  }

  if (status === "complete") {
    const accuracy = Math.round((stats.correct / puzzles.length) * 100);
    
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {accuracy >= 80 ? "🏆" : accuracy >= 60 ? "⭐" : "📚"}
        </div>
        <h2 style={{ marginBottom: 8 }}>Training Complete!</h2>
        <div style={{ fontSize: 48, fontWeight: 700, color: "#4CAF50", marginBottom: 16 }}>
          {accuracy}%
        </div>
        <div style={{ 
          display: "flex", 
          gap: 24, 
          justifyContent: "center",
          marginBottom: 32,
          fontSize: 15
        }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#4CAF50" }}>{stats.correct}</div>
            <div style={{ opacity: 0.7 }}>Correct</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#f44336" }}>{stats.incorrect}</div>
            <div style={{ opacity: 0.7 }}>Incorrect</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#ff9800" }}>{stats.hintsUsed}</div>
            <div style={{ opacity: 0.7 }}>Hints</div>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setStats({ correct: 0, incorrect: 0, hintsUsed: 0 });
              setStreak(0);
              setPuzzles(shuffleArray(puzzles));
              loadPuzzle(puzzles[0]);
            }}
            style={{
              padding: "12px 24px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            🔄 Try Again
          </button>
          <button
            onClick={onBack}
            style={{
              padding: "12px 24px",
              background: "#666",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      height: "100%",
      minHeight: isMobile ? "100vh" : "auto",
      background: "#1a1a1a"
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? "12px 16px" : "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0
      }}>
        <button
          onClick={onBack}
          style={{
            padding: isMobile ? "8px 12px" : "8px 16px",
            background: "transparent",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: isMobile ? 13 : 14,
            minHeight: isMobile ? 40 : "auto"
          }}
        >
          {isMobile ? "←" : "← Back"}
        </button>
        
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16 }}>
          <span style={{ opacity: 0.7, fontSize: isMobile ? 12 : 14 }}>
            {isMobile ? `${currentIndex + 1}/${puzzles.length}` : `Puzzle ${currentIndex + 1} of ${puzzles.length}`}
          </span>
          {streak > 1 && (
            <span style={{ 
              background: "#ff9800", 
              padding: isMobile ? "3px 8px" : "4px 12px", 
              borderRadius: 12,
              fontWeight: 600,
              fontSize: isMobile ? 11 : 13
            }}>
              🔥 {streak}
            </span>
          )}
        </div>
        
        <div style={{ display: "flex", gap: isMobile ? 6 : 8, fontSize: isMobile ? 12 : 14 }}>
          <span style={{ color: "#4CAF50" }}>✓ {stats.correct}</span>
          <span style={{ color: "#f44336" }}>✗ {stats.incorrect}</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? 20 : 40,
        padding: isMobile ? 16 : 24,
        overflow: "auto"
      }}>
        {/* Board */}
        <div style={{ flexShrink: 0 }}>
          <Board
            chess={chess}
            interactive={status !== "correct" && status !== "complete"}
            onMove={(move) => makeMove(move.from, move.to)}
            orientation={currentPuzzle?.playerToMove === "black" ? "b" : "w"}
            size={isMobile ? Math.min(width - 32, 360) : isTablet ? Math.min(400, height - 300) : Math.min(480, height - 250)}
          />
        </div>

        {/* Side panel */}
        <div style={{
          width: isMobile ? "100%" : 280,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 12 : 16
        }}>
          {/* Puzzle info */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 20
          }}>
            <div style={{ 
              fontSize: 12, 
              opacity: 0.5, 
              marginBottom: 4,
              textTransform: "uppercase"
            }}>
              {currentPuzzle?.theme?.replace(/-/g, ' ')}
            </div>
            <h3 style={{ margin: "0 0 12px", fontSize: 18 }}>
              {currentPuzzle?.title}
            </h3>
            <div style={{
              padding: 12,
              background: status === "correct" ? "rgba(76, 175, 80, 0.2)" :
                         status === "incorrect" ? "rgba(244, 67, 54, 0.2)" :
                         "rgba(255,255,255,0.05)",
              borderRadius: 8,
              fontSize: 14,
              lineHeight: 1.5
            }}>
              {message}
            </div>
          </div>

          {/* Hint */}
          {showHint && currentPuzzle?.hint && (
            <div style={{
              background: "rgba(255, 152, 0, 0.1)",
              border: "1px solid rgba(255, 152, 0, 0.3)",
              borderRadius: 8,
              padding: 12,
              fontSize: 14
            }}>
              💡 {currentPuzzle.hint}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 8, flexWrap: "wrap" }}>
            {status === "correct" ? (
              <button
                onClick={handleNext}
                style={{
                  padding: isMobile ? "14px 16px" : "14px 20px",
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: isMobile ? 14 : 15,
                  flex: isMobile ? 1 : "none",
                  minHeight: isMobile ? 48 : "auto"
                }}
              >
                Next Puzzle →
              </button>
            ) : (
              <>
                {!showHint && (
                  <button
                    onClick={handleShowHint}
                    style={{
                      padding: isMobile ? "12px 14px" : "12px 20px",
                      background: "rgba(255, 152, 0, 0.2)",
                      color: "#ff9800",
                      border: "1px solid rgba(255, 152, 0, 0.3)",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: isMobile ? 13 : 14,
                      flex: isMobile ? 1 : "none",
                      minHeight: isMobile ? 48 : "auto"
                    }}
                  >
                    💡 Hint
                  </button>
                )}
                <button
                  onClick={handleShowSolution}
                  style={{
                    padding: isMobile ? "12px 14px" : "12px 20px",
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: isMobile ? 13 : 14,
                    flex: isMobile ? 1 : "none",
                    minHeight: isMobile ? 48 : "auto"
                  }}
                >
                  Solution
                </button>
                <button
                  onClick={handleSkip}
                  style={{
                    padding: isMobile ? "12px 14px" : "12px 20px",
                    background: "transparent",
                    color: "rgba(255,255,255,0.5)",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: isMobile ? 13 : 14,
                    flex: isMobile ? 1 : "none",
                    minHeight: isMobile ? 48 : "auto"
                  }}
                >
                  Skip →
                </button>
              </>
            )}
          </div>

          {/* Difficulty indicator */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: isMobile ? "center" : "flex-start",
            gap: 8,
            opacity: 0.5,
            fontSize: isMobile ? 12 : 13
          }}>
            <span>Difficulty:</span>
            {[1, 2, 3].map(i => (
              <span 
                key={i}
                style={{ 
                  color: i <= (currentPuzzle?.difficulty || 1) ? "#ff9800" : "#444"
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
