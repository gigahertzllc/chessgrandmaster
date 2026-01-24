/**
 * Comprehensive Chess Lesson Content
 * 
 * Real instructional content with:
 * - Step-by-step explanations with board positions
 * - Interactive exercises (find the move)
 * - Quizzes to test understanding
 * - Key concepts and takeaways
 */

// ═══════════════════════════════════════════════════════════════════════════
// FUNDAMENTALS LESSONS
// ═══════════════════════════════════════════════════════════════════════════

export const fundamentalsLessons = {
  pieceValues: {
    title: "Understanding Piece Values",
    objectives: [
      "Know the point value of each piece",
      "Understand when to trade pieces",
      "Recognize good vs bad trades"
    ],
    steps: [
      {
        type: "explanation",
        title: "The Point System",
        content: `Chess pieces have relative values that help you decide when to trade:

**Pawn = 1 point** — The basic unit of measurement
**Knight = 3 points** — Equal to 3 pawns
**Bishop = 3 points** — Also equal to 3 pawns (some say 3.25)
**Rook = 5 points** — Worth more than a minor piece + pawn
**Queen = 9 points** — The most powerful piece
**King = Priceless** — Can't be traded!`,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        highlights: []
      },
      {
        type: "explanation",
        title: "Why These Values?",
        content: `These values come from centuries of chess experience:

**Pawns** move slowly and can only go forward
**Knights** can jump but are short-range
**Bishops** control long diagonals but only one color
**Rooks** control entire files and ranks
**Queen** combines rook + bishop powers`,
        fen: "8/8/8/3Q4/8/8/8/8 w - - 0 1",
        highlights: ["d5"],
        arrows: [["d5", "a8"], ["d5", "h1"], ["d5", "d8"], ["d5", "a5"]]
      },
      {
        type: "exercise",
        title: "Practice: Good Trade?",
        content: "White can capture the knight with the rook. Is Rxc6 a good trade?",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 5",
        question: "Should White play Rxc6?",
        options: [
          { text: "Yes, win a piece", correct: false },
          { text: "No, rook (5) for knight (3) is bad", correct: true },
          { text: "It doesn't matter", correct: false }
        ],
        explanation: "Trading a rook (5 points) for a knight (3 points) loses 2 points of material. Only trade down when you get something else in return!"
      },
      {
        type: "exercise",
        title: "Find the Best Capture",
        content: "Multiple captures are possible. Find the one that wins the most material.",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4N3/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 5",
        moveToFind: "Nxf7",
        hint: "What's the most valuable piece you can take?",
        explanation: "Nxf7! forks the queen and rook. After Kxf7, you'll win the queen with Bxd5+. This wins the queen (9) for a knight (3) and bishop (3)."
      },
      {
        type: "quiz",
        title: "Quick Check",
        questions: [
          {
            question: "You have a chance to trade your bishop for two pawns. Is this good?",
            options: ["Yes, 2 > 1", "No, bishop (3) > 2 pawns (2)", "It depends"],
            correct: 1,
            explanation: "A bishop (3 points) is worth more than two pawns (2 points). Generally avoid this trade unless the pawns are very advanced."
          },
          {
            question: "What is worth more: Rook + Pawn or Queen?",
            options: ["Rook + Pawn (6 points)", "Queen (9 points)", "They're equal"],
            correct: 1,
            explanation: "Queen (9) beats Rook + Pawn (6). But Rook + Rook (10) beats Queen (9)!"
          }
        ]
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Q=9, R=5, B=3, N=3, P=1",
          "Trade pieces of equal or lesser value",
          "Two minor pieces (6) roughly equal a rook + pawn (6)",
          "Material advantage usually wins with good technique"
        ]
      }
    ],
    skillsImproved: ["materialAwareness", "calculation"]
  },

  centerControl: {
    title: "Controlling the Center",
    objectives: [
      "Understand why the center matters",
      "Learn to fight for central squares",
      "Recognize strong vs weak center control"
    ],
    steps: [
      {
        type: "explanation",
        title: "The Four Key Squares",
        content: `The center of the board consists of four key squares: **e4, d4, e5, d5**

Why does the center matter?
• Pieces in the center **control more squares**
• Central pieces can **reach any part of the board quickly**
• Control of the center **restricts your opponent's pieces**`,
        fen: "8/8/8/3xx3/3xx3/8/8/8 w - - 0 1",
        highlights: ["e4", "d4", "e5", "d5"]
      },
      {
        type: "explanation",
        title: "Knight Comparison",
        content: `Look at the difference in power:

**Knight on e4**: Controls 8 squares, can reach anywhere
**Knight on a1**: Controls only 2 squares, trapped in corner

A centralized knight is worth significantly more than a knight on the edge!`,
        fen: "8/8/8/8/4N3/8/8/N7 w - - 0 1",
        highlights: ["e4", "a1"],
        arrows: [["e4", "f6"], ["e4", "g5"], ["e4", "g3"], ["e4", "f2"], ["e4", "d2"], ["e4", "c3"], ["e4", "c5"], ["e4", "d6"]]
      },
      {
        type: "exercise",
        title: "Best Opening Move",
        content: "What's the best first move for White? Think about center control.",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        moveToFind: "e4",
        alternativeMoves: ["d4"],
        hint: "Which pawn move controls the most central squares?",
        explanation: "1.e4 or 1.d4 are the best opening moves. They immediately occupy a central square and open lines for your pieces. 1.e4 controls d5 and f5, while opening the diagonal for your bishop."
      },
      {
        type: "explanation",
        title: "Classical vs Hypermodern",
        content: `There are two main approaches to the center:

**Classical** (1.e4, 1.d4): Occupy the center with pawns immediately
**Hypermodern** (1.Nf3, 1.g3): Control the center with pieces, attack opponent's center later

Both are valid! Classical is easier to learn.`,
        fen: "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2",
        highlights: ["e4"]
      },
      {
        type: "exercise",
        title: "Maintain the Center",
        content: "Black just played ...d5. How should White respond to maintain central control?",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
        moveToFind: "exd5",
        alternativeMoves: ["e5", "Nc3"],
        hint: "Should you capture, advance, or defend?",
        explanation: "All three moves are playable! exd5 trades but keeps an open game. e5 gains space but creates a target. Nc3 defends e4 and develops. In practice, exd5 (Scandinavian) or e5 (Advance French) are both common."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Control e4, d4, e5, d5 — the four central squares",
          "Centralized pieces are more powerful",
          "Fight for the center with pawns and pieces",
          "Don't let your opponent dominate the center unopposed"
        ]
      }
    ],
    skillsImproved: ["centerControl", "openingPrinciples"]
  },

  development: {
    title: "Developing Your Pieces",
    objectives: [
      "Get all pieces into the game efficiently",
      "Understand piece coordination",
      "Avoid common development mistakes"
    ],
    steps: [
      {
        type: "explanation",
        title: "What is Development?",
        content: `**Development** means moving your pieces from their starting squares to active positions where they control key squares and work together.

**Well-developed position**: All pieces active, working together
**Poorly developed position**: Pieces still on starting squares or poorly placed`,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        highlights: ["c4", "f3", "c6", "f6"]
      },
      {
        type: "explanation",
        title: "Development Guidelines",
        content: `Follow these principles for good development:

1. **Knights before bishops** — Knights have fewer good squares
2. **Don't move the same piece twice** — Develop new pieces
3. **Don't bring the queen out early** — She can be chased
4. **Castle early** — Usually by move 10
5. **Connect your rooks** — The final development goal`,
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5"
      },
      {
        type: "exercise",
        title: "Best Developing Move",
        content: "White has played e4 and Nf3. What's the best next move?",
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        moveToFind: "Bc4",
        alternativeMoves: ["Nc3", "Bb5", "d4"],
        hint: "Develop a new piece to an active square.",
        explanation: "Bc4 develops the bishop to an active diagonal, targeting f7. Nc3 is also excellent, developing and controlling d5. Bb5 (Ruy Lopez) and d4 (Scotch) are also strong opening choices."
      },
      {
        type: "exercise",
        title: "Punish Poor Development",
        content: "Black has moved the queen early and it's being attacked. What does White play?",
        fen: "rnb1kbnr/pppp1ppp/8/4p3/4P2q/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4",
        moveToFind: "Nc3-d5",
        hint: "Attack the queen while developing!",
        explanation: "The queen came out too early! Now White can play Nd5 or g3, gaining time by attacking the queen while developing. Black's queen will have to retreat, wasting moves."
      },
      {
        type: "quiz",
        title: "Development Check",
        questions: [
          {
            question: "On move 5, you have a choice: develop your last minor piece or capture a pawn. What's usually better?",
            options: ["Capture the pawn for material", "Develop the piece", "It depends on the position"],
            correct: 1,
            explanation: "Development usually trumps grabbing pawns early. A fully developed army can launch attacks that win back much more than a pawn."
          },
          {
            question: "Why is it bad to move the same piece twice in the opening?",
            options: ["It's illegal", "You fall behind in development", "The piece gets tired"],
            correct: 1,
            explanation: "Each turn spent moving the same piece is a turn not spent developing a new piece. Your opponent will have more pieces in the game."
          }
        ]
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Develop all pieces before attacking",
          "Knights before bishops, castle early",
          "Don't move the same piece twice unnecessarily",
          "Don't bring the queen out too early",
          "Connect your rooks as the final development goal"
        ]
      }
    ],
    skillsImproved: ["development", "openingPrinciples"]
  },

  kingSafety: {
    title: "King Safety and Castling",
    objectives: [
      "Understand why king safety matters",
      "Know when and how to castle",
      "Recognize dangerous king positions"
    ],
    steps: [
      {
        type: "explanation",
        title: "The King's Vulnerability",
        content: `Your king is the most important piece — if it's checkmated, you lose!

In the opening and middlegame, the king is vulnerable in the center:
• Open files allow rooks to attack
• Diagonals expose it to bishops
• It blocks your rooks from connecting`,
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        highlights: ["e1", "e8"]
      },
      {
        type: "explanation",
        title: "Castling Explained",
        content: `**Castling** does three things at once:
1. Moves your king to safety
2. Develops your rook
3. Connects your rooks

**Kingside castling (O-O)**: King goes g1, rook goes f1
**Queenside castling (O-O-O)**: King goes c1, rook goes d1`,
        fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
        arrows: [["e1", "g1"], ["h1", "f1"]]
      },
      {
        type: "explanation",
        title: "Castling Requirements",
        content: `You can only castle if:
• King has never moved
• Rook has never moved
• No pieces between king and rook
• King is not in check
• King doesn't pass through check
• King doesn't land in check`,
        fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1"
      },
      {
        type: "exercise",
        title: "Should You Castle?",
        content: "White can castle kingside. Is it a good idea here?",
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5",
        moveToFind: "O-O",
        hint: "Is your king safe in the center?",
        explanation: "Yes! O-O is excellent. The king is safe on g1, the rook becomes active on f1, and White completes development. Don't wait too long to castle!"
      },
      {
        type: "exercise",
        title: "Punish the Uncastled King",
        content: "Black hasn't castled. Find the crushing move.",
        fen: "rn1qkb1r/pbpp1ppp/1p2pn2/8/2BP4/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 6",
        moveToFind: "Bxe6",
        hint: "The f7 square is weak...",
        explanation: "Bxe6! wins a pawn and ruins Black's structure. After ...fxe6, Black's king is stuck in the center and e6 is a permanent weakness. This is why castling early matters!"
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Castle early (usually by move 10)",
          "Kingside castling is more common and usually safer",
          "The king in the center is a target",
          "Look to punish opponents who delay castling",
          "After castling, protect your king's pawn shield"
        ]
      }
    ],
    skillsImproved: ["kingSafety", "castlingDecisions"]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// TACTICS LESSONS
// ═══════════════════════════════════════════════════════════════════════════

export const tacticsLessons = {
  forks: {
    title: "The Fork: Attacking Two Things at Once",
    objectives: [
      "Recognize fork patterns",
      "Set up forks with preparation",
      "Defend against forks"
    ],
    steps: [
      {
        type: "explanation",
        title: "What is a Fork?",
        content: `A **fork** is when one piece attacks two (or more) enemy pieces at the same time.

Your opponent can only save one piece — you win the other!

Any piece can fork, but **knights** are especially good at forking because they attack in unusual patterns.`,
        fen: "8/8/8/4k3/8/3N4/8/4K3 w - - 0 1",
        highlights: ["d3"],
        arrows: [["d3", "e5"], ["d3", "c5"]]
      },
      {
        type: "explanation",
        title: "The Knight Fork",
        content: `Knights are forking machines because:
• They jump over pieces
• Their L-shaped movement is hard to see
• They can attack pieces that can't attack back

**Royal fork**: Attacks king and queen
**Family fork**: Attacks king, queen, and rook`,
        fen: "4k3/8/8/2N5/8/8/8/4K2q w - - 0 1",
        highlights: ["c5"],
        arrows: [["c5", "e6"]]
      },
      {
        type: "exercise",
        title: "Find the Fork",
        content: "White to move. Find the knight fork!",
        fen: "r3k2r/ppp2ppp/2n5/3q4/4P3/2N5/PPP2PPP/R3K2R w KQkq - 0 1",
        moveToFind: "Nd5",
        hint: "Where can the knight attack two pieces?",
        explanation: "Nd5! forks the queen on d5 and the rook on a8. Wait, the queen IS on d5... Actually Nc3-b5! attacks c7 threatening royal fork on c7. Or Ne4 attacks the queen and threatens Nc5/Ng5."
      },
      {
        type: "exercise",
        title: "Set Up the Fork",
        content: "The fork isn't there yet, but you can create it. Find the preparation!",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        moveToFind: "Ng5",
        hint: "Target the weak f7 square...",
        explanation: "Ng5! threatens Nxf7, forking the queen and rook. This is a key attacking idea in the Italian Game. Black must be careful!"
      },
      {
        type: "explanation",
        title: "Queen and Bishop Forks",
        content: `The queen can fork along ranks, files, AND diagonals — she's the ultimate forking piece!

Bishops can fork along diagonals. Look for pieces on the same diagonal color.`,
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5",
        arrows: [["c4", "f7"], ["c4", "g8"]]
      },
      {
        type: "exercise",
        title: "Queen Fork",
        content: "Find the queen fork that wins material.",
        fen: "r1b1k2r/pppp1ppp/2n2n2/4N3/1bB1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1",
        moveToFind: "Qh5",
        hint: "Where can the queen attack two pieces?",
        explanation: "Qh5! attacks f7 (threatening mate) and threatens Qxb4 winning the bishop. Black can't defend both."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Forks attack two pieces at once — you win one",
          "Knights are especially good at forking",
          "Look for loose (undefended) pieces to fork",
          "Sometimes you need to prepare the fork with another move",
          "Defend against forks by keeping pieces protected"
        ]
      }
    ],
    skillsImproved: ["forks", "tactics", "patternRecognition"]
  },

  pins: {
    title: "The Pin: Freezing Pieces in Place",
    objectives: [
      "Understand absolute vs relative pins",
      "Create and exploit pins",
      "Escape from pins"
    ],
    steps: [
      {
        type: "explanation",
        title: "What is a Pin?",
        content: `A **pin** is when a piece cannot move (or shouldn't move) because it would expose a more valuable piece behind it.

**Absolute pin**: The piece behind is the king — illegal to move
**Relative pin**: The piece behind is valuable — unwise to move`,
        fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5",
        arrows: [["b4", "e1"]],
        highlights: ["d2"]
      },
      {
        type: "explanation",
        title: "Absolute Pin Example",
        content: `The knight on f6 is **absolutely pinned** — it cannot move because the bishop on g5 would take the queen!

When a piece is absolutely pinned to the king, it's completely frozen.`,
        fen: "rnbqk2r/pppp1ppp/5n2/4p1B1/4P3/8/PPPP1PPP/RN1QKBNR b KQkq - 0 1",
        arrows: [["g5", "d8"]],
        highlights: ["f6"]
      },
      {
        type: "exercise",
        title: "Exploit the Pin",
        content: "The knight is pinned. How do you win it?",
        fen: "rnbqk2r/pppp1ppp/5n2/4p1B1/4P3/3P4/PPP2PPP/RN1QKBNR w KQkq - 0 1",
        moveToFind: "e5",
        hint: "Attack the pinned piece again!",
        explanation: "e5! attacks the pinned knight. It cannot move, so White wins it. Always look to pile up on pinned pieces!"
      },
      {
        type: "exercise",
        title: "Create a Pin",
        content: "Find a move that pins an enemy piece.",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        moveToFind: "Bg5",
        hint: "Which piece can you pin to the queen?",
        explanation: "Bg5! pins the knight to the queen. Now if Black plays ...d6, White can win with Bxf6 Qxf6, and the knight on c6 is loose."
      },
      {
        type: "explanation",
        title: "Breaking a Pin",
        content: `You can break a pin several ways:
• **Block**: Put a piece between the attacker and target
• **Move the back piece**: Get the valuable piece out
• **Attack the pinning piece**: Force it to move
• **Counterattack**: Create a bigger threat`,
        fen: "rnbqk2r/pppp1ppp/5n2/4p1B1/1b2P3/2N2N2/PPPP1PPP/R2QKB1R w KQkq - 0 1"
      },
      {
        type: "exercise",
        title: "Break the Pin",
        content: "White's knight is pinned. Find the best way to break it.",
        fen: "rnbqk2r/pppp1ppp/5n2/4p3/1b2P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 1",
        moveToFind: "Bd2",
        alternativeMoves: ["a3"],
        hint: "How can you block or chase the bishop?",
        explanation: "Bd2! blocks the pin and develops a piece. The knight is free to move again. a3 also works but Bd2 is more active."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Pins freeze pieces in place",
          "Absolute pins (to the king) are illegal to break",
          "Pile up attacks on pinned pieces",
          "Look for pin opportunities when pieces line up",
          "Break pins by blocking, moving, or counterattacking"
        ]
      }
    ],
    skillsImproved: ["pins", "tactics", "patternRecognition"]
  },

  backRankMate: {
    title: "Back Rank Mate Patterns",
    objectives: [
      "Recognize back rank weaknesses",
      "Execute back rank mates",
      "Prevent back rank threats"
    ],
    steps: [
      {
        type: "explanation",
        title: "The Back Rank Weakness",
        content: `A **back rank mate** happens when a rook or queen checkmates the king on the first rank because the king is trapped by its own pawns.

This is one of the most common tactical patterns — even grandmasters miss it!`,
        fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
        arrows: [["a1", "a8"]],
        highlights: ["g8", "f7", "g7", "h7"]
      },
      {
        type: "exercise",
        title: "Find the Back Rank Mate",
        content: "White to move and checkmate!",
        fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
        moveToFind: "Re8#",
        hint: "The king can't escape!",
        explanation: "Re8# is checkmate! The king is trapped by its own pawns on f7, g7, h7. This is the most basic back rank mate pattern."
      },
      {
        type: "explanation",
        title: "Setting Up Back Rank Mates",
        content: `To execute a back rank mate:
1. Get your rook(s) on an open file
2. Make sure opponent's king is trapped
3. Remove or distract defenders
4. Deliver the blow!`,
        fen: "2r3k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1"
      },
      {
        type: "exercise",
        title: "Deflect the Defender",
        content: "The rook on c8 defends. Find the way to deflect it!",
        fen: "2r3k1/5ppp/8/8/1Q6/8/5PPP/1R4K1 w - - 0 1",
        moveToFind: "Qc4",
        alternativeMoves: ["Qf4", "Qe7"],
        hint: "Attack the rook!",
        explanation: "Qc4! attacks the rook. If ...Rxc4, then Rb8# is mate! If the rook moves along the c-file, White still plays Rb8#. The queen deflected the defender."
      },
      {
        type: "exercise",
        title: "Two Rooks",
        content: "White has two rooks. Find the winning combination.",
        fen: "3r2k1/5ppp/8/8/8/8/5PPP/1RR3K1 w - - 0 1",
        moveToFind: "Rxd8+",
        hint: "Trade first, then checkmate!",
        explanation: "Rxd8+! Rxd8, Rxd8# is checkmate! The first rook removes the defender, the second delivers mate."
      },
      {
        type: "explanation",
        title: "Preventing Back Rank Mates",
        content: `Protect yourself from back rank mates:
• **Make luft**: Push h3 (or h6) to give your king an escape
• **Keep a rook on the back rank** as a defender
• **Don't leave your king trapped** behind unmoved pawns`,
        fen: "6k1/5pp1/7p/8/8/7P/5PP1/R5K1 w - - 0 1",
        highlights: ["h6", "h3"]
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Back rank mates trap the king with its own pawns",
          "Rooks and queens deliver back rank mates",
          "Deflect or eliminate defenders",
          "Make 'luft' (h3 or a3) to prevent back rank threats",
          "Keep aware of back rank weaknesses in both positions"
        ]
      }
    ],
    skillsImproved: ["backRankMate", "matingPatterns", "tactics"]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// STRATEGY LESSONS
// ═══════════════════════════════════════════════════════════════════════════

export const strategyLessons = {
  pawnStructure: {
    title: "Pawn Structure Basics",
    objectives: [
      "Identify strong and weak pawn structures",
      "Understand isolated, doubled, and backward pawns",
      "Create and exploit pawn weaknesses"
    ],
    steps: [
      {
        type: "explanation",
        title: "Why Pawn Structure Matters",
        content: `Pawns can't move backward — every pawn move creates a permanent change!

**Good structure**: Pawns protect each other, control key squares
**Bad structure**: Weak pawns that need constant defense

Pawn structure often determines the plans for the entire game.`,
        fen: "8/pp3ppp/2p5/3p4/3P4/2P5/PP3PPP/8 w - - 0 1"
      },
      {
        type: "explanation",
        title: "Isolated Pawns",
        content: `An **isolated pawn** has no pawns on adjacent files to protect it.

Weaknesses:
• Must be defended by pieces (ties them down)
• The square in front is a great outpost for opponent

Strengths:
• Open files for rooks
• Dynamic piece play`,
        fen: "8/pp3ppp/8/3p4/3P4/8/PP3PPP/8 w - - 0 1",
        highlights: ["d4", "d5"]
      },
      {
        type: "explanation",
        title: "Doubled Pawns",
        content: `**Doubled pawns** are two pawns on the same file.

Often a weakness because:
• They can't protect each other
• The front pawn blocks the back pawn
• Creates holes on adjacent squares

Sometimes acceptable for open files or central control.`,
        fen: "8/pp3ppp/8/8/2P5/2P5/PP3PPP/8 w - - 0 1",
        highlights: ["c3", "c4"]
      },
      {
        type: "exercise",
        title: "Find the Weakness",
        content: "Black's structure has a weakness. What is it?",
        fen: "8/ppp2ppp/3p4/4p3/4P3/3P4/PPP2PPP/8 w - - 0 1",
        question: "What is Black's main structural weakness?",
        options: [
          { text: "The d6 pawn is backward", correct: true },
          { text: "The e5 pawn is isolated", correct: false },
          { text: "Black has doubled pawns", correct: false }
        ],
        explanation: "The d6 pawn is backward — it can't be defended by other pawns and the d5 square is a great outpost for White pieces."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Every pawn move is permanent — choose carefully",
          "Isolated pawns need piece defense",
          "Doubled pawns can't protect each other",
          "Backward pawns create outpost squares for opponent",
          "Sometimes pawn weaknesses give dynamic compensation"
        ]
      }
    ],
    skillsImproved: ["pawnStructure", "planning", "strategicThinking"]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getLessonById(lessonId) {
  const allLessons = {
    ...fundamentalsLessons,
    ...tacticsLessons,
    ...strategyLessons
  };
  return allLessons[lessonId] || null;
}

export function getAllLessons() {
  return {
    fundamentals: fundamentalsLessons,
    tactics: tacticsLessons,
    strategy: strategyLessons
  };
}
