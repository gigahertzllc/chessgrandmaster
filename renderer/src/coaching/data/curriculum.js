/**
 * Chess Coaching Curriculum
 * 
 * Structured training progression from beginner to advanced.
 * Each module contains multiple sessions, each session is 5-10 minutes.
 */

export const coachingModules = {
  // ═══════════════════════════════════════════════════════════════════════════
  // BEGINNER MODULES (Rating < 1000)
  // ═══════════════════════════════════════════════════════════════════════════
  
  fundamentals: {
    id: "fundamentals",
    name: "Chess Fundamentals",
    level: "beginner",
    description: "Master the basics every chess player needs to know",
    icon: "🎯",
    estimatedTime: "2-3 hours",
    prerequisites: [],
    sessions: [
      {
        id: "fund_1",
        name: "Piece Power",
        duration: 8,
        type: "lesson",
        description: "Understanding the relative value of each piece",
        skills: ["development"],
        content: {
          introduction: "Every piece has a point value that helps you make trading decisions. Queen=9, Rook=5, Bishop=3, Knight=3, Pawn=1. Let's see why!",
          exercises: [
            { type: "quiz", question: "Which is worth more: a rook or a knight?", answer: "rook" },
            { type: "puzzle", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1", goal: "Find the winning move (Scholar's Mate)" }
          ]
        }
      },
      {
        id: "fund_2",
        name: "Controlling the Center",
        duration: 8,
        type: "lesson",
        description: "Why the center matters and how to fight for it",
        skills: ["centerControl"],
        content: {
          introduction: "The four central squares (e4, d4, e5, d5) are the most important squares on the board. Pieces in the center control more squares and can reach any part of the board quickly.",
          exercises: [
            { type: "position", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", task: "Play moves that control the center" }
          ]
        }
      },
      {
        id: "fund_3",
        name: "Developing Your Army",
        duration: 8,
        type: "lesson",
        description: "Get your pieces into the game efficiently",
        skills: ["development"],
        content: {
          introduction: "Development means moving your pieces from their starting squares to more active positions. Key principles: Knights before bishops, don't move the same piece twice, don't bring the queen out too early.",
          exercises: []
        }
      },
      {
        id: "fund_4",
        name: "King Safety First",
        duration: 8,
        type: "lesson",
        description: "Castle early and protect your king",
        skills: ["kingSafety"],
        content: {
          introduction: "Your king is the most important piece - if it's checkmated, you lose! Castle early (usually by move 10) to tuck your king away safely.",
          exercises: []
        }
      },
      {
        id: "fund_5",
        name: "Fundamentals Game",
        duration: 10,
        type: "game",
        description: "Play a game focusing on development and center control",
        skills: ["development", "centerControl", "kingSafety"],
        opponent: "beginner_bot",
        analysis: true
      }
    ]
  },

  tacticsBasics: {
    id: "tacticsBasics",
    name: "Basic Tactics",
    level: "beginner",
    description: "Learn the tactical patterns that win games",
    icon: "⚔️",
    estimatedTime: "3-4 hours",
    prerequisites: ["fundamentals"],
    sessions: [
      {
        id: "tac_1",
        name: "The Fork",
        duration: 10,
        type: "lesson",
        description: "Attack two pieces at once with one piece",
        skills: ["forks"],
        content: {
          introduction: "A fork is when one piece attacks two or more enemy pieces at the same time. Knights are famous for forks because of their unique jumping ability!",
          exercises: [
            { type: "puzzle", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1", hint: "Can the knight fork?" },
            { type: "puzzle", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1", hint: "Knight fork incoming!" }
          ]
        }
      },
      {
        id: "tac_2",
        name: "The Pin",
        duration: 10,
        type: "lesson",
        description: "Freeze pieces in place by attacking through them",
        skills: ["pins"],
        content: {
          introduction: "A pin is when a piece can't move because it would expose a more valuable piece behind it. Bishops, rooks, and queens can create pins.",
          exercises: []
        }
      },
      {
        id: "tac_3",
        name: "The Skewer",
        duration: 10,
        type: "lesson",
        description: "Force a piece to move and capture what's behind it",
        skills: ["skewers"],
        content: {
          introduction: "A skewer is like a pin in reverse - you attack a valuable piece, and when it moves, you capture the piece behind it.",
          exercises: []
        }
      },
      {
        id: "tac_4",
        name: "Discovered Attacks",
        duration: 10,
        type: "lesson",
        description: "Move one piece to unleash another",
        skills: ["discoveredAttacks"],
        content: {
          introduction: "A discovered attack happens when you move one piece out of the way to reveal an attack from a piece behind it. Double check is the most powerful version!",
          exercises: []
        }
      },
      {
        id: "tac_5",
        name: "Back Rank Threats",
        duration: 10,
        type: "lesson",
        description: "Exploit kings trapped on the back rank",
        skills: ["backRank"],
        content: {
          introduction: "When a king is stuck on the back rank with no escape squares, a rook or queen can deliver checkmate. Always make 'luft' (an escape square) for your king!",
          exercises: []
        }
      },
      {
        id: "tac_6",
        name: "Tactics Drill",
        duration: 10,
        type: "puzzles",
        description: "Practice all the basic patterns",
        skills: ["forks", "pins", "skewers", "discoveredAttacks", "backRank"],
        puzzleCount: 15,
        difficulty: "beginner"
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERMEDIATE MODULES (Rating 1000-1600)
  // ═══════════════════════════════════════════════════════════════════════════

  tacticsIntermediate: {
    id: "tacticsIntermediate",
    name: "Intermediate Tactics",
    level: "intermediate",
    description: "Sharpen your tactical vision with harder puzzles",
    icon: "🎯",
    estimatedTime: "4-5 hours",
    prerequisites: ["tacticsBasics"],
    sessions: [
      {
        id: "taci_1",
        name: "Complex Forks",
        duration: 10,
        type: "puzzles",
        description: "Multi-move fork combinations",
        skills: ["forks"],
        puzzleCount: 12,
        difficulty: "intermediate"
      },
      {
        id: "taci_2",
        name: "Pin Exploitation",
        duration: 10,
        type: "puzzles",
        description: "Creating and exploiting pins",
        skills: ["pins"],
        puzzleCount: 12,
        difficulty: "intermediate"
      },
      {
        id: "taci_3",
        name: "Deflection & Overloading",
        duration: 10,
        type: "lesson",
        description: "Force defenders away from their duties",
        skills: ["deflection"],
        content: {
          introduction: "Deflection is when you force a piece away from defending something important. Overloading is when a piece has too many jobs and can't do them all.",
          exercises: []
        }
      },
      {
        id: "taci_4",
        name: "Mating Patterns",
        duration: 12,
        type: "lesson",
        description: "Learn the classic checkmate patterns",
        skills: ["matingPatterns"],
        content: {
          introduction: "Strong players recognize mating patterns instantly. We'll study the most common ones: back rank mate, smothered mate, Anastasia's mate, Arabian mate, and more.",
          exercises: []
        }
      },
      {
        id: "taci_5",
        name: "Combination Practice",
        duration: 15,
        type: "puzzles",
        description: "Multi-step tactical combinations",
        skills: ["forks", "pins", "skewers", "discoveredAttacks", "deflection", "matingPatterns"],
        puzzleCount: 20,
        difficulty: "intermediate"
      }
    ]
  },

  middlegameFundamentals: {
    id: "middlegameFundamentals",
    name: "Middlegame Strategy",
    level: "intermediate",
    description: "Think strategically and make plans",
    icon: "♟️",
    estimatedTime: "4-5 hours",
    prerequisites: ["tacticsBasics"],
    sessions: [
      {
        id: "mid_1",
        name: "Making a Plan",
        duration: 10,
        type: "lesson",
        description: "How to assess positions and form plans",
        skills: ["planning"],
        content: {
          introduction: "Every move should be part of a plan. Ask yourself: What are the weaknesses in my opponent's position? What are my best pieces? What's my target?",
          exercises: []
        }
      },
      {
        id: "mid_2",
        name: "Pawn Structure",
        duration: 10,
        type: "lesson",
        description: "Understanding pawn weaknesses and strengths",
        skills: ["pawnStructure"],
        content: {
          introduction: "Pawns can't move backwards, so pawn structure decisions are permanent. Learn about isolated pawns, doubled pawns, passed pawns, and pawn chains.",
          exercises: []
        }
      },
      {
        id: "mid_3",
        name: "Piece Activity",
        duration: 10,
        type: "lesson",
        description: "Keep your pieces active and coordinated",
        skills: ["pieceActivity"],
        content: {
          introduction: "An active piece is worth more than a passive one. Knights need outposts, bishops need open diagonals, rooks need open files.",
          exercises: []
        }
      },
      {
        id: "mid_4",
        name: "Attack & Defense",
        duration: 12,
        type: "lesson",
        description: "When to attack and how to defend",
        skills: ["attack", "defense"],
        content: {
          introduction: "Attack when you have an advantage. Defend actively - create counterplay instead of just sitting passively.",
          exercises: []
        }
      },
      {
        id: "mid_5",
        name: "Strategy Game",
        duration: 15,
        type: "game",
        description: "Apply strategic concepts in a real game",
        skills: ["planning", "pawnStructure", "pieceActivity"],
        opponent: "intermediate_bot",
        analysis: true
      }
    ]
  },

  endgameEssentials: {
    id: "endgameEssentials",
    name: "Endgame Essentials",
    level: "intermediate",
    description: "Convert your advantages and save difficult positions",
    icon: "👑",
    estimatedTime: "3-4 hours",
    prerequisites: ["fundamentals"],
    sessions: [
      {
        id: "end_1",
        name: "King + Queen Mate",
        duration: 8,
        type: "lesson",
        description: "The most basic checkmate",
        skills: ["basicMates"],
        content: {
          introduction: "Checkmate with king and queen is the first endgame you must master. The technique: push the enemy king to the edge with your queen, then deliver mate with your king's help.",
          exercises: []
        }
      },
      {
        id: "end_2",
        name: "King + Rook Mate",
        duration: 10,
        type: "lesson",
        description: "Essential technique everyone must know",
        skills: ["basicMates"],
        content: {
          introduction: "Rook checkmate takes more technique. Use the 'box method' - cut off the enemy king, then shrink the box until mate.",
          exercises: []
        }
      },
      {
        id: "end_3",
        name: "King Activity",
        duration: 10,
        type: "lesson",
        description: "Your king becomes a fighting piece",
        skills: ["kingActivity"],
        content: {
          introduction: "In the endgame, your king should be active! Bring it to the center and use it to support your pawns and attack your opponent's.",
          exercises: []
        }
      },
      {
        id: "end_4",
        name: "Pawn Endgames",
        duration: 12,
        type: "lesson",
        description: "King and pawn technique",
        skills: ["pawnEndgames"],
        content: {
          introduction: "Pawn endgames are all about the king. Learn the key squares, opposition, and the square of the pawn rule.",
          exercises: []
        }
      },
      {
        id: "end_5",
        name: "Rook Endgames Basics",
        duration: 12,
        type: "lesson",
        description: "The Lucena and Philidor positions",
        skills: ["rookEndgames"],
        content: {
          introduction: "Rook endgames are the most common. You MUST know the Lucena (how to win) and Philidor (how to draw) positions.",
          exercises: []
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED MODULES (Rating 1600+)
  // ═══════════════════════════════════════════════════════════════════════════

  tacticsAdvanced: {
    id: "tacticsAdvanced",
    name: "Advanced Tactics",
    level: "advanced",
    description: "Master-level tactical combinations",
    icon: "💎",
    estimatedTime: "5-6 hours",
    prerequisites: ["tacticsIntermediate"],
    sessions: [
      {
        id: "taca_1",
        name: "Sacrificial Attacks",
        duration: 15,
        type: "lesson",
        description: "When and how to sacrifice material",
        skills: ["attack", "matingPatterns"],
        content: {
          introduction: "The best attacks often require sacrifices. Learn to recognize when a sacrifice leads to checkmate or decisive advantage.",
          exercises: []
        }
      },
      {
        id: "taca_2",
        name: "Complex Combinations",
        duration: 15,
        type: "puzzles",
        description: "Multi-move tactical masterpieces",
        skills: ["forks", "pins", "discoveredAttacks", "deflection", "matingPatterns"],
        puzzleCount: 15,
        difficulty: "advanced"
      },
      {
        id: "taca_3",
        name: "Prophylactic Thinking",
        duration: 12,
        type: "lesson",
        description: "Prevent opponent's ideas before they happen",
        skills: ["defense", "planning"],
        content: {
          introduction: "Prophylaxis means preventing your opponent's plans. Ask 'what does my opponent want to do?' before making your move.",
          exercises: []
        }
      },
      {
        id: "taca_4",
        name: "Calculation Training",
        duration: 15,
        type: "puzzles",
        description: "Deep calculation exercises",
        skills: ["depth", "accuracy", "visualization"],
        puzzleCount: 12,
        difficulty: "advanced"
      }
    ]
  }
};

// Get all modules as array
export function getAllModules() {
  return Object.values(coachingModules);
}

// Get modules by level
export function getModulesByLevel(level) {
  return Object.values(coachingModules).filter(m => m.level === level);
}

// Get module by ID
export function getModuleById(moduleId) {
  return coachingModules[moduleId] || null;
}

// Calculate module progress
export function calculateModuleProgress(moduleId, completedSessions) {
  const module = coachingModules[moduleId];
  if (!module) return 0;
  
  const completed = module.sessions.filter(s => completedSessions.includes(s.id)).length;
  return Math.round((completed / module.sessions.length) * 100);
}

// Get next recommended module
export function getNextModule(completedModules, userLevel) {
  const levelOrder = ['beginner', 'intermediate', 'advanced'];
  
  for (const level of levelOrder) {
    const modules = getModulesByLevel(level);
    for (const module of modules) {
      // Check if prerequisites are met
      const prereqsMet = module.prerequisites.every(p => completedModules.includes(p));
      if (prereqsMet && !completedModules.includes(module.id)) {
        return module;
      }
    }
  }
  return null;
}
