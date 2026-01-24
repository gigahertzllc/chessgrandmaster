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
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODERN CHESS CONCEPTS (Special Module)
  // How Carlsen, Nakamura, and engine-era players approach the game
  // ═══════════════════════════════════════════════════════════════════════════

  modernConcepts: {
    id: "modernConcepts",
    name: "Modern Chess Thinking",
    level: "advanced",
    description: "How today's top players (Carlsen, Nakamura) break classical rules — and why",
    icon: "🚀",
    estimatedTime: "4-5 hours",
    prerequisites: ["fundamentals"],
    sessions: [
      {
        id: "modern_1",
        name: "Why Rules Get Broken",
        duration: 12,
        type: "lesson",
        description: "Understanding the purpose behind classical principles",
        skills: ["planning"],
        content: {
          introduction: `Classical chess rules like "castle early" or "don't move the same piece twice" are training wheels, not laws. They exist because they work MOST of the time. 

Modern top players understand WHY each rule exists, which lets them know WHEN to break it. The goal isn't to memorize rules — it's to understand chess deeply enough to make good decisions in any position.

Magnus Carlsen often plays "boring" openings to avoid opponent preparation and reach unique middlegames where understanding beats memorization. Hikaru Nakamura plays incredibly fast because he understands patterns, not because he memorized more lines.

Key insight: Rules teach you what usually works. Understanding teaches you what actually works in THIS position.`,
          keyPoints: [
            "Classical rules are guidelines based on what usually works",
            "Understanding WHY lets you know WHEN to deviate",
            "Top players seek unique positions, not theoretical ones",
            "Memorization loses to understanding in unfamiliar territory"
          ],
          exercises: []
        }
      },
      {
        id: "modern_2",
        name: "The Engine Revolution",
        duration: 12,
        type: "lesson",
        description: "How computers changed our understanding of chess",
        skills: ["planning"],
        content: {
          introduction: `Before engines, humans decided what was "good chess." Many ideas were accepted simply because great players used them. Engines revealed uncomfortable truths:

1. Many "bad" positions are actually fine
2. Many "good" moves are second-best  
3. Defense is far more resilient than we thought
4. Concrete calculation beats general principles

What this means for you: Don't reject a move just because it "looks wrong." If you can't find a concrete problem with it, it might be perfectly playable. Engines taught us to be less dogmatic and more objective.

However, engines also showed that for most positions, classical principles DO lead to good moves. The difference is knowing which positions are exceptions.`,
          keyPoints: [
            "Engines revealed many 'ugly' positions are objectively fine",
            "Concrete analysis beats abstract rules",
            "Defense is stronger than classical players believed",
            "Classical principles still work — they're just not absolute"
          ],
          exercises: []
        }
      },
      {
        id: "modern_3",
        name: "Breaking the Opening Rules",
        duration: 15,
        type: "lesson",
        description: "Early queen moves, delayed castling, and other modern ideas",
        skills: ["development", "centerControl", "kingSafety"],
        content: {
          introduction: `Classical opening rules you learned — and when modern players break them:

"Don't bring the queen out early"
→ BROKEN: The Scandinavian (1.e4 d5 2.exd5 Qxd5) is fully playable. The queen develops with tempo when attacked. What matters is whether opponent can PUNISH it, not whether it violates a rule.

"Don't move the same piece twice"  
→ BROKEN: If your piece is attacked or can reach a much better square, move it again. Time is relative — a well-placed piece is worth "losing" a tempo.

"Castle early (by move 10)"
→ BROKEN: In many modern lines, players castle on move 15-20 or not at all. The key is: Is your king safe WHERE IT IS? Sometimes the center is safest.

"Control the center with pawns"
→ MODIFIED: Hypermodern openings (King's Indian, Grünfeld) control the center with pieces first, then undermine opponent's pawn center later.

The lesson: Each rule has a PURPOSE. Know the purpose, and you'll know when it doesn't apply.`,
          keyPoints: [
            "Early queen moves are fine if opponent can't punish them",
            "Moving a piece twice is fine if it improves significantly",
            "Castling can wait if king is already safe",
            "Center control with pieces (hypermodern) is equally valid"
          ],
          exercises: [
            { type: "quiz", question: "In the Scandinavian Defense, Black moves the queen early. Why is this acceptable?", answer: "The queen develops while being attacked, gaining time, and it's hard for White to actually punish the queen" },
            { type: "quiz", question: "When might you delay castling past move 15?", answer: "When the center is closed, your king is safe, or castling would walk into an attack" }
          ]
        }
      },
      {
        id: "modern_4",
        name: "Practical Chess (The Carlsen Method)",
        duration: 12,
        type: "lesson",
        description: "Playing for positions, not evaluations",
        skills: ["planning", "pieceActivity"],
        content: {
          introduction: `Magnus Carlsen revolutionized top-level chess by prioritizing PRACTICAL chances over computer evaluations.

His approach:
1. Avoid sharp theory where opponent has prepared deeply
2. Reach complex middlegames where understanding beats preparation  
3. Keep pieces on the board — more pieces = more chances for opponent to err
4. Play "boring" positions excellently — small edges, ground out over 60 moves
5. Trust your opponent to make mistakes (they will)

What this means for improving players: A position that's "equal" on the computer might be much easier to play for one side. Choose positions YOU understand, even if the engine says something else is "better."

The best move is often the one your opponent is most likely to go wrong against — not the one the engine prefers.`,
          keyPoints: [
            "Practical chances matter more than computer evaluations",
            "Complex positions with more pieces = more opponent mistakes",
            "Choose positions you understand over 'objectively best' ones",
            "Small, lasting advantages can be converted over many moves",
            "Your opponent WILL make mistakes — give them the opportunity"
          ],
          exercises: []
        }
      },
      {
        id: "modern_5",
        name: "Speed Chess Principles (The Nakamura Method)",
        duration: 12,
        type: "lesson",
        description: "Pattern recognition and time management",
        skills: ["depth", "accuracy"],
        content: {
          introduction: `Hikaru Nakamura is one of the greatest blitz players ever. His success comes from:

1. PATTERN RECOGNITION over calculation
   - He's seen similar positions thousands of times
   - He doesn't calculate everything — he recognizes what works
   
2. "GOOD ENOUGH" moves played FAST
   - A 2nd-best move played quickly beats the best move played slowly
   - Time is a resource, just like material
   
3. Keeping the position COMPLICATED
   - More complexity = more chance for opponent to err under time pressure
   - Simplification helps the player with less time
   
4. INTUITION trained by thousands of games
   - His "gut feeling" is backed by massive pattern database in his brain

For you: Play lots of games (especially blitz) to build pattern recognition. When in doubt, develop a piece, improve your worst piece, or create a threat. Don't agonize over perfection.`,
          keyPoints: [
            "Pattern recognition > raw calculation in fast games",
            "A good move now beats a perfect move too late",
            "Time on the clock is a resource like material",
            "Complexity favors the better player; simplification favors who's ahead",
            "Intuition comes from playing thousands of games"
          ],
          exercises: []
        }
      },
      {
        id: "modern_6",
        name: "Playing Real Chess",
        duration: 10,
        type: "lesson",
        description: "Thinking for yourself instead of following trends",
        skills: ["planning"],
        content: {
          introduction: `The danger of modern chess: Blindly copying top player moves without understanding WHY.

When you play 1.e4 e5 2.Nf3 Nc6 3.Bb5 because "Magnus plays it," you're not playing chess — you're performing memorized theater. The moment your opponent deviates, you're lost.

How to play REAL chess:
1. Learn the IDEAS behind openings, not just moves
2. Ask "what's the point of this move?" for every move you learn
3. Be willing to play "inferior" lines you understand deeply
4. Study complete games, not just opening databases
5. Analyze your own games — YOUR mistakes teach more than GM games

The goal: Develop your OWN chess understanding. Use engine analysis to check your thinking, not replace it. The best players aren't the ones who memorized the most — they're the ones who understand the most.

When you truly understand chess, you'll naturally find good moves in any position — whether it's a known theoretical line or something completely new.`,
          keyPoints: [
            "Copying moves without understanding is memorization, not chess",
            "Learn IDEAS behind openings, not just move sequences",
            "Your own analysis teaches more than watching GMs",
            "Engines should check your thinking, not replace it",
            "Deep understanding in fewer openings beats shallow knowledge in many"
          ],
          exercises: []
        }
      },
      {
        id: "modern_7",
        name: "Practical Applications",
        duration: 15,
        type: "game",
        description: "Apply modern concepts in actual play",
        skills: ["planning", "development", "pieceActivity"],
        content: {
          introduction: "Let's play a game where you practice modern concepts: seek unique positions, prioritize understanding over memorization, and make practical decisions.",
          exercises: []
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANTI-THEORY REPERTOIRE (Companion to Modern Concepts)
  // Practical openings that avoid heavy memorization
  // ═══════════════════════════════════════════════════════════════════════════

  antiTheory: {
    id: "antiTheory",
    name: "Anti-Theory Openings",
    level: "intermediate",
    description: "Solid openings that prioritize understanding over memorization",
    icon: "🛡️",
    estimatedTime: "3-4 hours",
    prerequisites: ["openings"],
    sessions: [
      {
        id: "anti_1",
        name: "The London System",
        duration: 12,
        type: "lesson",
        description: "A solid, flexible system for White",
        skills: ["development", "planning"],
        content: {
          introduction: `The London System (1.d4 and 2.Bf4) is Carlsen-approved for a reason:

- Same setup against almost anything Black plays
- Easy to learn, hard to prepare against
- Solid pawn structure, clear plans
- Gets you to a middlegame where understanding > memorization

Key ideas:
1. Develop bishop to f4 BEFORE playing e3
2. Build a pyramid: pawns on d4, e3, c3
3. Knight to d2, then to f3 (or e5)
4. Castle kingside, then play for e4 or c4 break

This isn't about getting an "advantage" — it's about getting a playable position YOU understand better than your opponent.`,
          exercises: []
        }
      },
      {
        id: "anti_2",
        name: "The Caro-Kann Defense",
        duration: 12,
        type: "lesson",
        description: "A rock-solid response to 1.e4",
        skills: ["development", "pawnStructure"],
        content: {
          introduction: `The Caro-Kann (1.e4 c6) is the "boring but solid" choice against 1.e4:

- Sound pawn structure (no weak pawns)
- Clear development scheme
- Less theory than Sicilian or French
- Black often gets endgame with slight pressure

Main line ideas:
1. 1.e4 c6 2.d4 d5 — challenge the center immediately
2. Develop light-squared bishop BEFORE playing e6
3. Aim for ...c5 break to challenge White's center
4. Solid but not passive — look for counterplay

Many GMs use the Caro-Kann when they want a solid game without memorizing 30 moves of theory.`,
          exercises: []
        }
      },
      {
        id: "anti_3",
        name: "Systems Over Lines",
        duration: 10,
        type: "lesson",
        description: "Why setups beat memorization",
        skills: ["planning"],
        content: {
          introduction: `A SYSTEM is a setup you can use regardless of opponent's moves.
A LINE is a specific sequence that requires memorization.

Examples of systems:
- London System (White)
- King's Indian Attack (White)  
- Hippo/Hedgehog setups (Black)
- Stonewall formations (both colors)

Why systems work:
1. You play YOUR game, not your opponent's
2. Preparation is harder for opponents
3. Understanding transfers across many games
4. Less memorization, more chess

The tradeoff: Systems usually aim for equality or small advantages, not crushing attacks. But equality in a position you understand is better than an "advantage" in something you don't.`,
          exercises: []
        }
      },
      {
        id: "anti_4",
        name: "Sideline Weapons",
        duration: 12,
        type: "lesson",
        description: "Surprise openings that avoid main theory",
        skills: ["development", "openingTraps"],
        content: {
          introduction: `Sometimes the best preparation is to avoid the opponent's preparation entirely.

Useful sidelines:
- 1.b3 (Larsen's Opening) — flexible, transpositional
- 1.Nf3 followed by g3, Bg2, 0-0 (King's Indian Attack)
- 1.e4 e5 2.Nf3 Nc6 3.Bc4 (Italian) instead of the Ruy Lopez
- 1.d4 d5 2.Bf4 (London) instead of mainline Queen's Gambit

Against 1.e4 as Black:
- 1...e5 2...Nf6 (Petroff) — super solid
- 1...d6 followed by ...Nf6, ...g6 (Pirc) — flexible
- 1...Nc6 (Nimzowitsch) — rare and tricky

The point isn't that these are "better" — they're different. Your opponent's 20 moves of Sicilian preparation becomes useless.`,
          exercises: []
        }
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
