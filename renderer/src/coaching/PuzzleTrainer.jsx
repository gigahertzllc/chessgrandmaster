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
    explanation: "This is the famous Scholar's Mate pattern. The f7 pawn (f2 for White) is only defended by the king at the start of the game, making it a natural target. When the queen captures on f7, the king cannot escape because it's blocked by its own pieces. Always watch for attacks on f7/f2 in the opening!",
    keyIdea: "Target f7 - the weakest square in Black's position"
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
    explanation: "This is related to the Fool's Mate, the fastest possible checkmate. White's pawn moves (f3 and g4) have fatally weakened the king's diagonal. The queen delivers checkmate on h2 because the king has no escape squares - blocked by its own pawns. Lesson: Don't move pawns in front of your castled king without good reason!",
    keyIdea: "Weakened king diagonal leads to disaster"
  },
  {
    id: "m1_003",
    fen: "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
    solution: ["Rd8#"],
    playerToMove: "white",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Rook Delivers",
    hint: "The king can't escape the back rank!",
    explanation: "Rd8 is checkmate! The Black king is trapped on g8 with no escape - f8, g7, h8 are all blocked or controlled. This is another classic back rank mate. The lesson: never leave your back rank undefended!",
    keyIdea: "Back rank mates are the most common pattern"
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
    explanation: "The back rank mate is one of the most common tactical patterns. Black's king is trapped behind its own pawns with no escape squares. The rook simply slides to e8, delivering checkmate. To prevent this, always give your king 'luft' (breathing room) with h6/h3 or similar pawn moves.",
    keyIdea: "Trapped king + open file = back rank mate"
  },
  {
    id: "m1_005",
    fen: "6k1/5ppp/8/8/8/8/5PPP/R3R1K1 w - - 0 1",
    solution: ["Re8#", "Rae8#"],
    playerToMove: "white",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Doubled Rooks",
    hint: "Either rook can deliver the blow!",
    explanation: "With two rooks aimed at the back rank, Black is helpless. Either Re8# or Rae8# is checkmate - the king is trapped by its own pawns on f7, g7, h7 and the rook controls the entire 8th rank. Doubled rooks on an open file are incredibly powerful!",
    keyIdea: "Doubled rooks dominate open files"
  },
  {
    id: "m1_006",
    fen: "8/8/8/8/4r3/8/5PPP/6K1 b - - 0 1",
    solution: ["Re1#"],
    playerToMove: "black",
    theme: "mate-in-1",
    difficulty: 1,
    title: "Black's Back Rank Mate",
    hint: "White's king is trapped by its own pawns!",
    explanation: "Re1# is checkmate! White's king is trapped behind its own pawns on f2, g2, h2. The rook controls the entire first rank, leaving no escape. Back rank mates work for both sides - always check if your opponent's back rank is weak!",
    keyIdea: "Back rank threats work both ways"
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
    explanation: "Material advantage wins games! The d4 pawn is undefended, so Black simply captures it. Always scan the board for undefended pieces (called 'hanging' pieces). Even a single pawn advantage can be decisive in the endgame.",
    keyIdea: "Capture undefended pieces"
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
    explanation: "When you can capture material AND give check, it's usually correct! Here Qxe5+ wins the pawn for free because Black must deal with the check first. The check acts like a 'free move' because your opponent can't ignore it. Always look for captures with check!",
    keyIdea: "Captures with check are often free"
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
    explanation: "This is a classic bishop sacrifice on f7. After Bxf7+ Kxf7, Black has won a bishop but exposed the king. In this position, the knight on e4 becomes vulnerable. The key insight: sometimes sacrificing material to expose the enemy king leads to greater gains.",
    keyIdea: "Expose the king to win material back"
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
    explanation: "The e5 pawn is defended only by the knight on c6. After Nxe5, if Black recaptures with Nxe5, White has d4 forking the knight. So White wins a pawn safely. Always calculate one move deeper - 'if they take, then what?'",
    keyIdea: "Calculate consequences of captures"
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
    explanation: "This is the famous 'Fried Liver' pattern! First Bxf7+ forces Kxf7. Then Ng5+ forks the king and queen! The bishop sacrifice is temporary - you get it back plus more. Look for ways to use piece sacrifices to set up knight forks, especially when the enemy king is exposed.",
    keyIdea: "Sacrifice to create a fork"
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
    explanation: "After Nxd5, the knight attacks both the queen on d8 and the bishop on e6 (and threatens Nxf6+). Black cannot save both pieces. Knights are excellent at creating forks because of their unique jumping ability. Centralized knights are especially dangerous!",
    keyIdea: "Centralized knights create fork threats"
  },
  {
    id: "nf_003",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Bxf7+"],
    playerToMove: "white",
    theme: "knight-fork",
    difficulty: 2,
    title: "Win the Knight",
    hint: "Check the king and pick up the piece!",
    explanation: "Bxf7+ is a forcing move - the king must respond to check. After Kxf7 or Ke7, the knight on e4 is left undefended and White wins material. When you have a chance to give check while attacking another piece, take it! The check forces your opponent's hand.",
    keyIdea: "Check + attack = free material"
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERMEDIATE - Pins & Attacks
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
    explanation: "Ng5 creates a double attack on f7 - both the knight and bishop target this weak square. Black must be very careful; if f7 falls, the king's position collapses. This is the starting position for the Fried Liver Attack. Two pieces attacking one point often wins!",
    keyIdea: "Concentrate force on weaknesses"
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
    explanation: "Again Ng5 creates tremendous pressure on f7. The knight cannot be taken (bishop recaptures with devastating effect), and f7 is under assault. Black's d6 pawn blocks the bishop's defense. This shows how piece coordination creates overwhelming threats.",
    keyIdea: "Piece coordination creates threats"
  },
  {
    id: "pin_003",
    fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
    solution: ["Qa4+"],
    playerToMove: "white",
    theme: "pin",
    difficulty: 2,
    title: "Counter the Pin",
    hint: "Don't just defend - counter-attack!",
    explanation: "The bishop pins the knight to the queen, but Qa4+ is a powerful counter-attack! Black must deal with the check, and the bishop on b4 is now attacked. After Black blocks or moves the king, White can take the bishop or continue the initiative. When pinned, look for counter-threats instead of passive defense!",
    keyIdea: "Counter-attack beats passive defense"
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERMEDIATE - Skewers
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "skw_001",
    fen: "6k1/5p1p/6p1/8/8/8/1r3PPP/R5K1 b - - 0 1",
    solution: ["Rb1+"],
    playerToMove: "black",
    theme: "skewer",
    difficulty: 2,
    title: "Rook Skewer",
    hint: "Check the king, win the rook!",
    explanation: "A skewer is like a reverse pin - the more valuable piece is in front! After Rb1+, the White king must move (only legal moves), and then Black captures the rook on a1 with Rxb1. Skewers are most effective when you can attack the king first, forcing it to move and expose the piece behind it.",
    keyIdea: "Skewer: attack valuable piece, win the one behind"
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
    explanation: "Ra5+ creates a skewer along the 5th rank. After the Black king moves, the rook can give check again (if needed) or control key squares. In rook endgames, using the rook actively to check and cut off the enemy king is essential technique.",
    keyIdea: "Active rooks dominate endgames"
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
    explanation: "The bishop on g5 is annoying, pinning the knight to the queen. Simply h6 forces it to decide: retreat, take the knight (and double Black's pawns), or go to h4 where it can be chased again with g5. Pawn moves that gain time by attacking pieces are valuable!",
    keyIdea: "Gain time by attacking pieces"
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
    explanation: "Nh4 attacks the bishop while simultaneously revealing an attack from White's queen on d1 (or preparing to). The knight threatens to trap the bishop with g4. Discovered attacks let you make two threats with one move - the moving piece attacks, and the revealed piece attacks something else!",
    keyIdea: "Discovered attacks create double threats"
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
    explanation: "The Fried Liver Attack in action! Bxf7+ forces Qxf7 (Kxf7 Ng5+ wins the queen), then Ng5 attacks the queen and threatens devastating discovered checks. Black's position collapses. This pattern has won countless games - memorize it!",
    keyIdea: "Classic sacrifice pattern against f7"
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
    explanation: "Qf6 threatens Qg7# immediately. Black's only defense is to move a pawn (g6 or h6), but then Qxg7# or Qf8# follows. The queen is incredibly powerful in the endgame because it can control so many squares. Centralized queens near the enemy king are deadly.",
    keyIdea: "Queen near king = mating threats"
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
    explanation: "Qxf7+ forces Kd8 (Ke7 allows Qxe5+ and more damage). Then Qxf8# is checkmate! The king is trapped by its own pieces on d8. This shows the power of continuous checks - the opponent never gets a chance to defend when you keep checking.",
    keyIdea: "Continuous checks prevent defense"
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
    explanation: "Bxf7+ is a classic sacrifice that exposes Black's king. After Kxf7, White continues with Ng5+ and the attack writes itself. The 'Greek Gift' name comes from the Trojan Horse - the bishop looks like a gift but brings destruction. When the enemy king hasn't castled, look for f7 sacrifices!",
    keyIdea: "Sacrifice to expose the uncastled king"
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
    explanation: "d5! is a powerful pawn break that gains space and kicks the knight. If the knight retreats, White has a strong pawn center. Central pawn pushes often come with tempo (attacking pieces) and open lines for your pieces. Control the center, control the game!",
    keyIdea: "Central pawn pushes gain space and tempo"
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
    explanation: "Nxd4! wins material because of the pin on the e-file and the attack on the queen. If Nxd4 exd4, Black wins a pawn. If Qxd4, then Bxf3 wins a piece. Combinations work by creating multiple threats that can't all be met. Look for forcing moves!",
    keyIdea: "Multiple threats create winning combinations"
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
    explanation: "e4! challenges Black's center and opens lines for White's pieces. After dxe4 Nxe4, White has active piece play. Sometimes the best tactic is strategic - improving your position with natural moves. Central pawn tension should usually be resolved in your favor.",
    keyIdea: "Challenge the center to activate pieces"
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
    explanation: "Rh5+! cuts off the Black king from the h-file and pushes it toward the edge. In rook endgames, cutting off the enemy king is the first step to delivering mate. The rook is most effective when it controls entire ranks or files, restricting the enemy king's movement.",
    keyIdea: "Cut off the king, then push it to the edge"
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
    explanation: "Rd1+! forces the Black king to move toward the edge of the board. This is the technique of 'boxing in' the enemy king with your rook while your own king advances to help deliver mate. Patience and technique win endgames!",
    keyIdea: "Use checks to drive the king to the edge"
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
    explanation: "Ra1# is checkmate! The Black king is trapped in the corner by the White king on b6, and the rook delivers the final blow. This is the basic king and rook checkmate pattern - the king helps trap the enemy king, and the rook delivers mate on the back rank.",
    keyIdea: "King and rook together deliver mate"
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
    explanation: "Rd3+! forces the Black king to move, and White can then take the opposition (kings facing each other with one square between). In king and pawn endgames, the opposition often decides the game. The rook helps by checking and controlling key squares.",
    keyIdea: "Use checks to gain the opposition"
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
  const [status, setStatus] = useState("thinking"); // thinking | correct | incorrect | showingSolution | complete | review
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [expectedMoveIndex, setExpectedMoveIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, hintsUsed: 0 });
  const [streak, setStreak] = useState(0);
  const [puzzleResults, setPuzzleResults] = useState([]); // Track result for each puzzle
  const [reviewIndex, setReviewIndex] = useState(0); // For review mode navigation

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
        setPuzzleResults(prev => [...prev, { puzzle: currentPuzzle, result: 'correct', usedHint: showHint }]);
        
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
    setPuzzleResults(prev => [...prev, { puzzle: currentPuzzle, result: 'skipped', usedHint: showHint }]);
    setStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
    setStreak(0);
    handleNext();
  }, [handleNext, currentPuzzle, showHint]);

  // Show solution - NO auto-advance, user clicks Next
  const handleShowSolution = useCallback(() => {
    if (!currentPuzzle) return;
    setStatus("showingSolution");
    setStreak(0);
    setStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
    setPuzzleResults(prev => [...prev, { puzzle: currentPuzzle, result: 'missed', usedHint: showHint }]);
    
    if (voice?.isEnabled) {
      voice.speak(`The solution was ${currentPuzzle.solution.join(', then ')}`);
    }
  }, [currentPuzzle, voice, showHint]);

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

  // Review Mode - view all puzzles with explanations
  if (status === "review") {
    const reviewPuzzle = puzzleResults[reviewIndex];
    const reviewChess = new Chess(reviewPuzzle?.puzzle?.fen || "");
    const missedPuzzles = puzzleResults.filter(r => r.result !== 'correct');
    
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
            onClick={() => setStatus("complete")}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            ← Back to Results
          </button>
          <span style={{ opacity: 0.7 }}>
            Review {reviewIndex + 1} of {puzzleResults.length}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setReviewIndex(i => Math.max(0, i - 1))}
              disabled={reviewIndex === 0}
              style={{
                padding: "8px 12px",
                background: reviewIndex === 0 ? "#333" : "#555",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: reviewIndex === 0 ? "not-allowed" : "pointer",
                opacity: reviewIndex === 0 ? 0.5 : 1
              }}
            >
              ←
            </button>
            <button
              onClick={() => setReviewIndex(i => Math.min(puzzleResults.length - 1, i + 1))}
              disabled={reviewIndex === puzzleResults.length - 1}
              style={{
                padding: "8px 12px",
                background: reviewIndex === puzzleResults.length - 1 ? "#333" : "#555",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: reviewIndex === puzzleResults.length - 1 ? "not-allowed" : "pointer",
                opacity: reviewIndex === puzzleResults.length - 1 ? 0.5 : 1
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Review content */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 24,
          padding: isMobile ? 16 : 24,
          overflow: "auto"
        }}>
          {/* Board */}
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
            <Board
              chess={reviewChess}
              interactive={false}
              orientation={reviewPuzzle?.puzzle?.playerToMove === "black" ? "b" : "w"}
              size={isMobile ? Math.min(width - 32, 320) : 360}
            />
          </div>

          {/* Info panel */}
          <div style={{ 
            flex: 1, 
            maxWidth: isMobile ? "100%" : 400,
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}>
            {/* Result badge */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <span style={{
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                background: reviewPuzzle?.result === 'correct' ? "rgba(76, 175, 80, 0.2)" :
                           reviewPuzzle?.result === 'missed' ? "rgba(244, 67, 54, 0.2)" :
                           "rgba(255, 152, 0, 0.2)",
                color: reviewPuzzle?.result === 'correct' ? "#4CAF50" :
                       reviewPuzzle?.result === 'missed' ? "#f44336" : "#ff9800"
              }}>
                {reviewPuzzle?.result === 'correct' ? '✓ Solved' :
                 reviewPuzzle?.result === 'missed' ? '✗ Missed' : '⊘ Skipped'}
              </span>
              {reviewPuzzle?.usedHint && (
                <span style={{ fontSize: 12, opacity: 0.6 }}>💡 Used hint</span>
              )}
            </div>

            {/* Title */}
            <div>
              <div style={{ fontSize: 12, opacity: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
                {reviewPuzzle?.puzzle?.theme?.replace(/-/g, ' ')}
              </div>
              <h2 style={{ margin: 0, fontSize: 22 }}>{reviewPuzzle?.puzzle?.title}</h2>
            </div>

            {/* Solution */}
            <div style={{
              background: "rgba(76, 175, 80, 0.1)",
              border: "1px solid rgba(76, 175, 80, 0.3)",
              borderRadius: 8,
              padding: 16
            }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>SOLUTION</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#4CAF50" }}>
                {reviewPuzzle?.puzzle?.solution?.join(' → ')}
              </div>
            </div>

            {/* Key Idea */}
            {reviewPuzzle?.puzzle?.keyIdea && (
              <div style={{
                background: "rgba(255, 152, 0, 0.1)",
                border: "1px solid rgba(255, 152, 0, 0.3)",
                borderRadius: 8,
                padding: 16
              }}>
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>💡 KEY IDEA</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#ff9800" }}>
                  {reviewPuzzle?.puzzle?.keyIdea}
                </div>
              </div>
            )}

            {/* Explanation */}
            {reviewPuzzle?.puzzle?.explanation && (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
                padding: 16
              }}>
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>📚 WHY IT WORKS</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
                  {reviewPuzzle?.puzzle?.explanation}
                </div>
              </div>
            )}

            {/* Quick nav for missed puzzles */}
            {missedPuzzles.length > 0 && reviewPuzzle?.result !== 'correct' && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>
                  Jump to missed puzzles:
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {puzzleResults.map((r, i) => r.result !== 'correct' && (
                    <button
                      key={i}
                      onClick={() => setReviewIndex(i)}
                      style={{
                        padding: "4px 10px",
                        background: reviewIndex === i ? "#f44336" : "rgba(244, 67, 54, 0.2)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 12
                      }}
                    >
                      #{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === "complete") {
    const accuracy = Math.round((stats.correct / puzzles.length) * 100);
    const missedPuzzles = puzzleResults.filter(r => r.result !== 'correct');
    
    return (
      <div style={{ 
        padding: isMobile ? 20 : 40, 
        textAlign: "center",
        maxHeight: "100vh",
        overflow: "auto"
      }}>
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

        {/* Puzzle summary */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          maxWidth: 500,
          margin: "0 auto 24px"
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Puzzle Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {puzzleResults.map((r, i) => (
              <div 
                key={i}
                onClick={() => { setReviewIndex(i); setStatus("review"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: r.result === 'correct' ? "rgba(76, 175, 80, 0.1)" :
                             r.result === 'missed' ? "rgba(244, 67, 54, 0.1)" :
                             "rgba(255, 152, 0, 0.1)",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <span style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  background: r.result === 'correct' ? "#4CAF50" :
                             r.result === 'missed' ? "#f44336" : "#ff9800",
                  color: "#fff"
                }}>
                  {r.result === 'correct' ? '✓' : r.result === 'missed' ? '✗' : '−'}
                </span>
                <span style={{ flex: 1, textAlign: "left", fontSize: 14 }}>
                  {r.puzzle?.title}
                </span>
                <span style={{ fontSize: 12, opacity: 0.5 }}>
                  {r.puzzle?.theme?.replace(/-/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {missedPuzzles.length > 0 && (
            <button
              onClick={() => { setReviewIndex(0); setStatus("review"); }}
              style={{
                padding: "12px 24px",
                background: "#2196F3",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              📖 Review All ({puzzleResults.length})
            </button>
          )}
          <button
            onClick={() => {
              setCurrentIndex(0);
              setStats({ correct: 0, incorrect: 0, hintsUsed: 0 });
              setStreak(0);
              setPuzzleResults([]);
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
            interactive={status !== "correct" && status !== "complete" && status !== "showingSolution"}
            onMove={(move) => makeMove(move.from, move.to)}
            orientation={currentPuzzle?.playerToMove === "black" ? "b" : "w"}
            size={isMobile ? Math.min(width - 32, 360) : isTablet ? Math.min(400, height - 300) : Math.min(480, height - 250)}
          />
        </div>

        {/* Side panel */}
        <div style={{
          width: isMobile ? "100%" : 320,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 12 : 16,
          maxHeight: isMobile ? "none" : "100%",
          overflow: isMobile ? "visible" : "auto"
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
                         status === "showingSolution" ? "rgba(244, 67, 54, 0.2)" :
                         "rgba(255,255,255,0.05)",
              borderRadius: 8,
              fontSize: 14,
              lineHeight: 1.5
            }}>
              {status === "showingSolution" 
                ? `Solution: ${currentPuzzle?.solution?.join(' → ')}`
                : message}
            </div>
          </div>

          {/* Show explanation when solution is revealed */}
          {status === "showingSolution" && (
            <>
              {/* Key Idea */}
              {currentPuzzle?.keyIdea && (
                <div style={{
                  background: "rgba(255, 152, 0, 0.1)",
                  border: "1px solid rgba(255, 152, 0, 0.3)",
                  borderRadius: 8,
                  padding: 12
                }}>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>💡 KEY IDEA</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#ff9800" }}>
                    {currentPuzzle.keyIdea}
                  </div>
                </div>
              )}

              {/* Explanation */}
              {currentPuzzle?.explanation && (
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  padding: 12,
                  maxHeight: isMobile ? "none" : 200,
                  overflow: "auto"
                }}>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>📚 WHY IT WORKS</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>
                    {currentPuzzle.explanation}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Hint (only when not showing solution) */}
          {showHint && currentPuzzle?.hint && status !== "showingSolution" && (
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
            {(status === "correct" || status === "showingSolution") ? (
              <button
                onClick={handleNext}
                style={{
                  padding: isMobile ? "14px 16px" : "14px 20px",
                  background: status === "correct" ? "#4CAF50" : "#2196F3",
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
                {currentIndex + 1 >= puzzles.length ? "See Results →" : "Next Puzzle →"}
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
                  Show Solution
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
