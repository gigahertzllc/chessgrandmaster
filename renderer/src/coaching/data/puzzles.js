/**
 * Chess Puzzle Database
 * 
 * Puzzles organized by tactical motif and difficulty.
 * Each puzzle includes:
 * - FEN position
 * - Solution move(s) in SAN notation
 * - Hint text
 * - Difficulty rating (1-5)
 * - Category tags
 */

export const puzzles = {
  // ═══════════════════════════════════════════════════════════════════════════
  // FORKS - Attack two pieces at once
  // ═══════════════════════════════════════════════════════════════════════════
  forks: {
    beginner: [
      {
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
        solution: ["Qxf7#"],
        hint: "The queen can attack f7 and deliver checkmate!",
        explanation: "This is Scholar's Mate - Qxf7 is checkmate because the king can't escape and nothing can block.",
        tags: ["queen", "checkmate", "opening-trap"]
      },
      {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        solution: ["Ng5"],
        hint: "Where can the knight go to attack two things?",
        explanation: "Ng5 attacks the weak f7 square and threatens Qxf7+ fork of king and rook.",
        tags: ["knight", "attack", "f7-weakness"]
      },
      {
        fen: "rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        solution: ["Nxe5"],
        hint: "The knight can capture and fork!",
        explanation: "Nxe5 wins a pawn and attacks the queen if she defends d5.",
        tags: ["knight", "pawn-win"]
      },
      {
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        solution: ["Ng5"],
        hint: "The knight can attack f7!",
        explanation: "Ng5 creates a double attack on f7, threatening Nxf7 winning the rook.",
        tags: ["knight", "double-attack"]
      },
      {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        solution: ["Nc6"],
        hint: "Develop with a threat!",
        explanation: "Nc6 develops and defends e5 - a good developing move.",
        tags: ["development", "defense"]
      }
    ],
    intermediate: [
      {
        fen: "r1b1k2r/ppppqppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5",
        solution: ["Bg5", "Nxe4"],
        hint: "Pin the knight, then win it!",
        explanation: "Bg5 pins the knight to the queen. After h6, Bxf6 Qxf6, you've won a piece.",
        tags: ["pin", "piece-win"]
      },
      {
        fen: "r1bqkb1r/ppp2ppp/2np1n2/4p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 5",
        solution: ["Nd5"],
        hint: "The knight can jump to a powerful square!",
        explanation: "Nd5 attacks the knight on f6 and threatens Nxc7+ forking king and rook.",
        tags: ["knight", "outpost", "fork-threat"]
      },
      {
        fen: "r2qk2r/ppp1bppp/2np1n2/4p1B1/2B1P3/2NP1N2/PPP2PPP/R2QK2R w KQkq - 5 7",
        solution: ["Nd5"],
        hint: "Occupy the powerful central square!",
        explanation: "Nd5 attacks the bishop on e7 and knight on f6 simultaneously.",
        tags: ["knight", "central-outpost"]
      }
    ],
    advanced: [
      {
        fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 6 7",
        solution: ["Nd5", "Nxf6+"],
        hint: "The knight can create multiple threats!",
        explanation: "Nd5 prepares Nxf6+ which forks king and queen after Bxf6.",
        tags: ["knight", "combination", "fork"]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PINS - Immobilize a piece
  // ═══════════════════════════════════════════════════════════════════════════
  pins: {
    beginner: [
      {
        fen: "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        solution: ["Bb5+"],
        hint: "Check and pin the knight!",
        explanation: "Bb5+ pins the knight on c6 (once it blocks) to the king.",
        tags: ["bishop", "absolute-pin"]
      },
      {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        solution: ["Bb5"],
        hint: "Pin the knight to the king!",
        explanation: "Bb5 creates a pin - the knight on c6 cannot move without exposing the king.",
        tags: ["bishop", "pin"]
      },
      {
        fen: "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
        solution: ["Bg5"],
        hint: "Pin the knight to the queen!",
        explanation: "Bg5 pins the knight on f6 to the queen. This is a relative pin.",
        tags: ["bishop", "relative-pin"]
      }
    ],
    intermediate: [
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5",
        solution: ["Bg5", "Nd5"],
        hint: "Pin first, then exploit!",
        explanation: "Bg5 pins the knight, then Nd5 attacks the pinned piece.",
        tags: ["bishop", "pin", "attack-pinned-piece"]
      },
      {
        fen: "r2qkb1r/ppp2ppp/2np1n2/4pb2/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 6",
        solution: ["Bg5"],
        hint: "Create a pin on the f6 knight!",
        explanation: "Bg5 pins the knight. If Bxe4 then Bxf6 wins the pinned knight.",
        tags: ["bishop", "pin", "trap"]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SKEWERS - Attack through a piece
  // ═══════════════════════════════════════════════════════════════════════════
  skewers: {
    beginner: [
      {
        fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
        solution: ["Re8+"],
        hint: "Check the king, win the piece behind!",
        explanation: "Re8+ forces the king to move, then you capture whatever's behind it.",
        tags: ["rook", "skewer", "check"]
      },
      {
        fen: "4r1k1/5ppp/8/8/8/4B3/5PPP/6K1 w - - 0 1",
        solution: ["Bc5+"],
        hint: "The bishop can skewer!",
        explanation: "Bc5+ attacks the king, and when it moves, we capture the rook.",
        tags: ["bishop", "skewer"]
      }
    ],
    intermediate: [
      {
        fen: "r3k2r/ppp2ppp/2n2n2/8/1bB5/2N2N2/PPPQ1PPP/R3K2R w KQkq - 0 10",
        solution: ["Qa5+"],
        hint: "Attack the king and bishop!",
        explanation: "Qa5+ skewers the king and bishop on b4.",
        tags: ["queen", "skewer", "check"]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DISCOVERED ATTACKS
  // ═══════════════════════════════════════════════════════════════════════════
  discoveredAttacks: {
    beginner: [
      {
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        solution: ["Nxe5"],
        hint: "Take and discover an attack!",
        explanation: "Nxe5 wins a pawn and discovers an attack on f7 from the bishop.",
        tags: ["knight", "discovered-attack"]
      },
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 5",
        solution: ["Bxf7+", "Kxf7", "Ng5+"],
        hint: "Sacrifice to discover an attack!",
        explanation: "Bxf7+ Kxf7 Ng5+ forks king and queen (discovered check from queen).",
        tags: ["sacrifice", "discovered-check"]
      }
    ],
    intermediate: [
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        solution: ["Ng5"],
        hint: "Attack f7 and threaten discovery!",
        explanation: "Ng5 threatens Bxf7+ discovered attack winning material.",
        tags: ["knight", "threat", "discovery-threat"]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BACK RANK TACTICS
  // ═══════════════════════════════════════════════════════════════════════════
  backRank: {
    beginner: [
      {
        fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
        solution: ["Re8#"],
        hint: "The king is trapped on the back rank!",
        explanation: "Re8# is checkmate - the king has no escape squares (blocked by its own pawns).",
        tags: ["rook", "back-rank-mate"]
      },
      {
        fen: "3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
        solution: ["Rd8+", "Rxd8#"],
        hint: "Force the rook trade, then mate!",
        explanation: "Rd8+ forces Rxd8, and after Rxd8# it's checkmate on the back rank.",
        tags: ["rook", "back-rank", "exchange"]
      }
    ],
    intermediate: [
      {
        fen: "r4rk1/ppp2ppp/8/8/8/8/PPP2PPP/R4RK1 w - - 0 1",
        solution: ["Rae1"],
        hint: "Double your rooks to threaten the back rank!",
        explanation: "Rae1 doubles rooks and threatens Re8+ with a devastating attack.",
        tags: ["rook", "doubling", "back-rank-threat"]
      },
      {
        fen: "2r3k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1",
        solution: ["Rb8+", "Rxb8#"],
        hint: "Force the trade and mate!",
        explanation: "Rb8+ forces Rxb8, allowing Rxb8# - back rank checkmate.",
        tags: ["rook", "back-rank-mate", "deflection"]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MATING PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════
  matingPatterns: {
    beginner: [
      {
        fen: "k7/8/1K6/8/8/8/8/R7 w - - 0 1",
        solution: ["Ra8#"],
        hint: "Deliver checkmate with the rook!",
        explanation: "Ra8# is a simple back rank checkmate. The king has nowhere to go.",
        tags: ["rook", "checkmate", "basic-mate"]
      },
      {
        fen: "k7/8/2K5/8/8/8/8/7Q w - - 0 1",
        solution: ["Qa8#"],
        hint: "The queen can mate in one!",
        explanation: "Qa8# delivers checkmate. The queen covers all escape squares.",
        tags: ["queen", "checkmate", "basic-mate"]
      },
      {
        fen: "k7/2K5/8/8/8/8/8/R7 w - - 0 1",
        solution: ["Ra8#"],
        hint: "Checkmate with the rook!",
        explanation: "Ra8# - the king supports the rook and there's no escape.",
        tags: ["rook", "king", "checkmate"]
      }
    ],
    intermediate: [
      {
        fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
        solution: [],
        isCheckmate: true,
        hint: "This position is already checkmate!",
        explanation: "This is Scholar's Mate - Qxf7# has just been played.",
        tags: ["checkmate", "scholar's-mate"]
      },
      {
        fen: "6k1/5ppp/6N1/8/8/8/5PPP/6K1 w - - 0 1",
        solution: ["Nf8"],
        hint: "Set up a smothered mate threat!",
        explanation: "Nf8! threatens Nh7# (smothered mate). The king is trapped by its own pawns.",
        tags: ["knight", "smothered-mate", "threat"]
      },
      {
        fen: "r1bqk2r/pppp1Npp/2n2n2/2b1p3/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 5",
        solution: [],
        isCheckmate: false,
        hint: "White has a deadly threat!",
        explanation: "Nxh8 wins the rook, or Ng5 threatens Qxf7#.",
        tags: ["knight", "threat", "material"]
      }
    ],
    advanced: [
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 6 5",
        solution: ["Qxf7+", "Ke7", "Qxe5+"],
        hint: "Start a forcing sequence!",
        explanation: "Qxf7+ Ke7 Qxe5+ wins massive material and keeps attacking.",
        tags: ["queen", "attack", "forcing"]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEFLECTION
  // ═══════════════════════════════════════════════════════════════════════════
  deflection: {
    beginner: [
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 5",
        solution: ["Bxf7+"],
        hint: "Deflect the king from defending!",
        explanation: "Bxf7+ forces the king to move, allowing tactical ideas.",
        tags: ["bishop", "sacrifice", "deflection"]
      }
    ],
    intermediate: [
      {
        fen: "r1bqk2r/ppp2ppp/2n1pn2/3p4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 6",
        solution: ["Qa4"],
        hint: "Attack the pinned knight and bishop!",
        explanation: "Qa4 attacks both the bishop on b4 and threatens the knight on c6.",
        tags: ["queen", "double-attack", "pin-exploitation"]
      }
    ]
  }
};

// Get puzzles by category and difficulty
export function getPuzzles(category, difficulty = "beginner") {
  const categoryPuzzles = puzzles[category];
  if (!categoryPuzzles) return [];
  return categoryPuzzles[difficulty] || [];
}

// Get random puzzles from multiple categories
export function getRandomPuzzles(categories, count = 10, difficulty = "beginner") {
  const allPuzzles = [];
  
  categories.forEach(cat => {
    const catPuzzles = getPuzzles(cat, difficulty);
    allPuzzles.push(...catPuzzles.map(p => ({ ...p, category: cat })));
  });
  
  // Shuffle
  const shuffled = allPuzzles.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get all categories
export function getCategories() {
  return Object.keys(puzzles);
}

// Get puzzle count for a category
export function getPuzzleCount(category) {
  const cat = puzzles[category];
  if (!cat) return 0;
  
  let count = 0;
  Object.values(cat).forEach(difficulty => {
    count += difficulty.length;
  });
  return count;
}

export default puzzles;
