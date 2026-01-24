/**
 * Chess Training Lessons
 * Based on famous chess books, starting with "Russian Chess" by Bruce Pandolfini
 */

export const BOOKS = {
  russian_chess: {
    id: "russian_chess",
    title: "Russian Chess",
    author: "Bruce Pandolfini",
    description: "Learn from the greatest Soviet and Russian champions. This book explores the distinctive style of Russian chess masters, emphasizing strategic planning, patience, and deep calculation. Covers the light-square strategy, minority attack, prophylactic thinking, attacking play, and endgame technique.",
    coverColor: "#8B0000",
    chapters: 3
  }
};

export const LESSONS = [
  {
    id: "russian_chess_ch1_lesson1",
    bookId: "russian_chess",
    chapter: 1,
    lessonNumber: 1,
    title: "The Light Square Strategy",
    subtitle: "Karpov's Positional Mastery",
    
    introduction: `In Russian chess thinking, the concept of "color complexes" is fundamental. A color complex refers to controlling squares of one color—either light or dark—throughout the board.

When you dominate a color complex, you create permanent weaknesses in your opponent's position. Pieces become restricted, pawns become targets, and the king often lacks safe squares.

Anatoly Karpov was perhaps the greatest master of light-square strategy. In this lesson, we examine his classic victory over Viktor Korchnoi from their 1978 World Championship match.

**Key Concepts:**
• Trading the light-squared bishops early
• Placing pawns on dark squares to control light squares
• Using knights to occupy weak light squares
• The "Karpov squeeze" - slowly improving piece placement`,

    concepts: [
      "Light square weakness",
      "Color complex domination", 
      "Piece coordination",
      "Prophylactic thinking",
      "The Karpov squeeze"
    ],

    game: {
      white: "Anatoly Karpov",
      black: "Viktor Korchnoi",
      event: "World Championship",
      site: "Baguio City",
      year: 1978,
      result: "1-0",
      opening: "Nimzo-Indian Defense",
      pgn: `1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 c5 5. Nge2 d5 6. a3 Bxc3+ 7. Nxc3 cxd4 8. exd4 dxc4 9. Bxc4 Nc6 10. Be3 O-O 11. O-O b6 12. Qd3 Bb7 13. Rad1 Rc8 14. Bb5 Na5 15. Bg5 h6 16. Bh4 Rxc3 17. bxc3 Qc7 18. Bd6 Qxc3 19. Qxc3 Nxc3 20. Bxf8 Nxd1 21. Rxd1 Kxf8 22. Rc1 Ke7 23. Kf1 g5 24. Ke2 Kd6 25. Kd3 Nc4 26. Bxc4 Bxg2 27. Rg1 Bh3 28. Rxg5 Bg4 29. f3 Bf5+ 30. Kc3 hxg5 31. Kb4 a6 32. Ka5 Kc7 33. d5 exd5 34. Bxd5 Kb7 35. Bc6+ Ka7 36. Bd5 Kb7 37. Bf7 Be6 38. Bxe6 fxe6 39. Kxa6 1-0`
    },

    annotations: {
      0: "The starting position. Karpov will demonstrate his legendary ability to exploit light-square weaknesses.",
      6: "3. Nc3 Bb4 - The Nimzo-Indian Defense. Black pins the knight and challenges White's center.",
      12: "6. a3 Bxc3+ - The critical moment. Black gives up the bishop pair. Black keeps the DARK-squared bishop, meaning Black's LIGHT squares will be permanently weak!",
      20: "10. Be3 O-O - Both sides develop. White has BOTH bishops, Black has only the dark-squared one.",
      28: "14. Bb5! - Karpov's bishop targets weak light squares on c6 and a6. Black's bishop cannot challenge it.",
      36: "18. Bd6! - Beautiful. The bishop dominates from d6, controlling c7 and e7.",
      52: "26. Bxc4! - After this trade, Black has NO pieces that can control light squares.",
      66: "33. d5! - The breakthrough. Karpov's passed pawn decides the game.",
      78: "39. Kxa6 1-0 - Korchnoi resigns. A masterclass in light-square domination."
    },

    quizPositions: [
      {
        afterMove: 12,
        question: "Black just played 6...Bxc3+. Why is this exchange strategically significant?",
        hint: "Think about which bishop Black keeps.",
        answer: "Black gives up the light-squared bishop and keeps the dark-squared one. This means Black will have permanent weaknesses on light squares."
      },
      {
        afterMove: 28,
        question: "White just played 14. Bb5. What makes this bishop so powerful?",
        hint: "Consider which enemy piece could challenge this bishop.",
        answer: "Black's remaining bishop is dark-squared, so it can NEVER challenge the bishop on b5."
      }
    ],

    conclusion: `This game demonstrates the power of light-square strategy. By trading off Black's light-squared bishop early, Karpov created a permanent weakness that persisted throughout the entire game.

**Key Takeaways:**
1. When your opponent lacks a bishop of one color, place your pawns on that color
2. Knights are powerful on squares the opponent's bishop cannot reach
3. In endgames, these color advantages become decisive`
  },

  {
    id: "russian_chess_ch1_lesson2",
    bookId: "russian_chess",
    chapter: 1,
    lessonNumber: 2,
    title: "The Minority Attack",
    subtitle: "Botvinnik's Strategic Brilliance",

    introduction: `The minority attack is one of the most important strategic concepts in chess. Russian players perfected it over decades of study.

A "minority attack" occurs when you advance fewer pawns against a larger pawn chain. The goal is NOT to win material—it's to CREATE WEAKNESSES.

In this lesson, we examine Mikhail Botvinnik's legendary victory over Jose Raul Capablanca from the 1938 AVRO tournament.

**Key Concepts:**
• Advance b4-b5 to force pawn exchanges
• Create an isolated or backward c-pawn
• Pressure the newly created weakness
• Convert the advantage in the endgame`,

    concepts: [
      "Minority attack",
      "Pawn structure",
      "Creating weaknesses",
      "Long-term pressure"
    ],

    game: {
      white: "Mikhail Botvinnik",
      black: "Jose Raul Capablanca",
      event: "AVRO Tournament",
      site: "Netherlands",
      year: 1938,
      result: "1-0",
      opening: "Nimzo-Indian Defense",
      pgn: `1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 exd5 8. Bd3 O-O 9. Ne2 b6 10. O-O Ba6 11. Bxa6 Nxa6 12. Bb2 Qd7 13. a4 Rfe8 14. Qd3 c4 15. Qc2 Nb8 16. Rae1 Nc6 17. Ng3 Na5 18. f3 Nb3 19. e4 Qxa4 20. e5 Nd7 21. Qf2 g6 22. f4 f5 23. exf6 Nxf6 24. f5 Rxe1 25. Rxe1 Re8 26. Re6 Rxe6 27. fxe6 Kg7 28. Qf4 Qe8 29. Qe5 Qe7 30. Ba3 Qxa3 31. Nh5+ gxh5 32. Qg5+ Kf8 33. Qxf6+ Kg8 34. e7 Qc1+ 35. Kf2 Qc2+ 36. Kg3 Qd3+ 37. Kh4 Qe4+ 38. Kxh5 Qe2+ 39. Kh4 Qe4+ 40. g4 Qe1+ 41. Kh5 1-0`
    },

    annotations: {
      0: "One of the most famous games in chess history. Botvinnik defeats the legendary Capablanca.",
      10: "5. a3 Bxc3+ 6. bxc3 - White gets the semi-open b-file for the minority attack.",
      26: "13. a4! - The minority attack begins. White will play a4-a5.",
      38: "19. e4! - The breakthrough. Botvinnik opens the position when his pieces are optimally placed.",
      52: "26. Re6! - A brilliant sacrifice. The e-pawn will become decisive.",
      60: "30. Ba3! Qxa3 31. Nh5+! - The combination begins.",
      82: "41. Kh5 1-0 - One of the greatest games ever played."
    },

    quizPositions: [
      {
        afterMove: 26,
        question: "What is the purpose of 13. a4?",
        hint: "Think about the queenside pawns.",
        answer: "This starts the minority attack. White plans a4-a5, forcing exchanges that create weaknesses in Black's pawn structure."
      }
    ],

    conclusion: `Botvinnik's victory over Capablanca demonstrated that systematic preparation and strategic understanding could overcome natural talent.

**Key Takeaways:**
1. The minority attack creates permanent weaknesses
2. Open the position when your pieces are better coordinated  
3. Passed pawns are worth material sacrifices`
  },

  {
    id: "russian_chess_ch2_lesson1",
    bookId: "russian_chess",
    chapter: 2,
    lessonNumber: 1,
    title: "The Art of Defense",
    subtitle: "Petrosian's Prophylactic Thinking",

    introduction: `Tigran Petrosian was known as "Iron Tigran" for his impenetrable defensive style. Unlike tactical players who seek brilliant attacks, Petrosian focused on preventing his opponent's plans before they could develop.

This concept—"prophylaxis"—became a cornerstone of Soviet chess training. The idea is simple: before making your move, ask "What does my opponent want to do?" Then prevent it.

In this lesson, we examine Petrosian's famous victory over Boris Spassky, where he demonstrates how defense can become the strongest form of attack.

**Key Concepts:**
• Prophylactic thinking - preventing opponent's plans
• The exchange sacrifice - giving up material for positional compensation
• Blockade - controlling key squares to restrict enemy pieces
• Patience - waiting for the right moment to strike`,

    concepts: [
      "Prophylaxis",
      "Exchange sacrifice",
      "Positional compensation",
      "Blockade strategy",
      "Patience in chess"
    ],

    game: {
      white: "Tigran Petrosian",
      black: "Boris Spassky",
      event: "World Championship",
      site: "Moscow",
      year: 1966,
      result: "1-0",
      opening: "Queen's Indian Defense",
      pgn: `1. Nf3 Nf6 2. g3 b6 3. Bg2 Bb7 4. O-O e6 5. d3 Be7 6. e4 d6 7. Nc3 Nbd7 8. Nh4 g6 9. f4 a6 10. Be3 Qc7 11. Qe1 h6 12. Qf2 O-O-O 13. a3 Rdg8 14. b4 g5 15. fxg5 hxg5 16. Nf3 Rg6 17. b5 axb5 18. Nxb5 Qb8 19. a4 Nc5 20. Rfb1 Bc6 21. Nd2 Rgh6 22. Nc4 Rxh2 23. Qxh2 Rxh2 24. Kxh2 g4 25. Kg1 Qg8 26. Bf4 Nfd7 27. a5 f6 28. Rb4 d5 29. exd5 Bxd5 30. Na3 Bxg2 31. Kxg2 e5 32. Bc1 Qc8 33. Nc4 Ne6 34. Rba4 f5 35. Na3 Nc5 36. Nc4 Ne6 37. axb6 cxb6 38. Na3 Nc5 39. Nc4 Ne6 40. Ra8 1-0`
    },

    annotations: {
      0: "Petrosian opens with the Réti. He prefers flexible setups that don't commit too early.",
      16: "8. Nh4! - Prophylaxis. Petrosian prevents Black from playing ...e5 and takes control of f5.",
      24: "12. Qf2! - A multi-purpose move. The queen protects b6 while eyeing the kingside.",
      42: "21. Nc4! - The knight heads to d6, a dream square. Petrosian slowly improves his pieces.",
      48: "24. Kxh2 - Petrosian accepts the exchange sacrifice but Black gets attacking chances.",
      64: "32. Bc1! - Prophylactic. The bishop retreats to prevent any tactics on the long diagonal.",
      80: "40. Ra8! 1-0 - The decisive blow. Black cannot prevent Rxc8+ winning the queen."
    },

    quizPositions: [
      {
        afterMove: 16,
        question: "Why did Petrosian play 8. Nh4 instead of developing naturally?",
        hint: "What move was Black hoping to play?",
        answer: "The knight on h4 controls f5 and prevents Black from playing ...e5, which would give Black a good central pawn structure."
      }
    ],

    conclusion: `Petrosian's style teaches us that chess is not just about attacking—it's about preventing your opponent's ideas while slowly improving your position.

**Key Takeaways:**
1. Before moving, ask: "What does my opponent want?"
2. Prevention is often stronger than cure
3. Piece placement matters more than raw material`
  },

  {
    id: "russian_chess_ch2_lesson2",
    bookId: "russian_chess",
    chapter: 2,
    lessonNumber: 2,
    title: "The Magician of Attack",
    subtitle: "Tal's Sacrificial Brilliance",

    introduction: `If Petrosian represented the defensive school, Mikhail Tal was its polar opposite. Known as "The Magician from Riga," Tal played with a ferocity that terrified even the strongest grandmasters.

Tal's philosophy was revolutionary: "You must take your opponent into a deep, dark forest where 2+2=5, and the path leading out is only wide enough for one."

He would sacrifice material—sometimes unsoundly—to create complications that were practically impossible to navigate over the board. Even if objectively worse, his positions gave him winning chances because of the immense pressure.

**Key Concepts:**
• The speculative sacrifice - offering material without calculating everything
• Practical chess - creating problems your opponent cannot solve
• Attack before development - sometimes the initiative is worth more than material
• Psychological pressure - making your opponent uncomfortable`,

    concepts: [
      "Speculative sacrifice",
      "Initiative over material",
      "Practical complications",
      "Psychological warfare",
      "Attacking the king"
    ],

    game: {
      white: "Mikhail Tal",
      black: "Vasily Smyslov",
      event: "Candidates Tournament",
      site: "Bled-Zagreb-Belgrade",
      year: 1959,
      result: "1-0",
      opening: "Caro-Kann Defense",
      pgn: `1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nd7 5. Nf3 Ngf6 6. Nxf6+ Nxf6 7. Bc4 Bf5 8. Qe2 e6 9. Bg5 Be7 10. O-O-O O-O 11. Kb1 Nd5 12. Bxe7 Qxe7 13. Qe5 Qb4 14. Bd3 Bxd3 15. Rxd3 Qa5 16. Nd2 Nf6 17. Nc4 Qc7 18. Qxc7 Rxc8 19. Ne5 Rfd8 20. f4 Nd5 21. Rhd1 Kf8 22. c4 Nb4 23. R3d2 Na6 24. f5 Nc5 25. fxe6 fxe6 26. Nxc6 bxc6 27. d5 cxd5 28. cxd5 Rxd5 29. Rxd5 exd5 30. Rxd5 Re8 31. b4 Nd7 32. Kc2 Re2+ 33. Kd3 Rxa2 34. Rd6 Ra3+ 35. Kc4 Rxg3 36. Rxd7 a6 37. Ra7 Rxh3 38. Rxa6 Ke7 39. b5 1-0`
    },

    annotations: {
      0: "Tal faces Smyslov, a former World Champion known for his precise technique.",
      18: "9. Bg5! - Tal immediately pins the knight. He's not interested in quiet play.",
      24: "12. Bxe7 Qxe7 13. Qe5! - The queen enters aggressively. Tal has his pieces aimed at Black's king.",
      38: "19. Ne5! - The knight lunges into the center. Tal's pieces coordinate menacingly.",
      50: "25. fxe6 fxe6 26. Nxc6! - Tal breaks through. The sacrifice opens lines to Black's king.",
      58: "30. Rxd5 Re8 - Tal has won a pawn and kept the initiative.",
      76: "39. b5! 1-0 - The passed pawn decides. Smyslov is crushed."
    },

    quizPositions: [
      {
        afterMove: 24,
        question: "What is the purpose of 13. Qe5?",
        hint: "Consider what the queen threatens and how it coordinates with other pieces.",
        answer: "The queen on e5 attacks g7 and coordinates with the bishop on g5. It also prevents Black from castling queenside due to Qxb8+."
      }
    ],

    conclusion: `Tal's games teach us that chess is not just about who has the better evaluation—it's about who can handle the pressure. Sometimes the best move is the one that creates the most problems.

**Key Takeaways:**
1. Initiative can be worth more than material
2. Create positions where your opponent has to find the only moves
3. Psychology is part of chess—make your opponent uncomfortable`
  },

  {
    id: "russian_chess_ch3_lesson1",
    bookId: "russian_chess",
    chapter: 3,
    lessonNumber: 1,
    title: "The Endgame Maestro",
    subtitle: "Smyslov's Endgame Technique",

    introduction: `Vasily Smyslov was called the "Hand of God" for his seemingly effortless technique, especially in the endgame. While other players struggled to convert advantages, Smyslov made it look like magic.

The Soviet school emphasized endgame study more than any other aspect of chess. They understood that most games are decided in the endgame, yet most players spend their time studying openings.

Smyslov's endgame philosophy was simple: understand the principles deeply, and the moves will flow naturally.

**Key Concepts:**
• King activity - the king is a fighting piece in the endgame
• The principle of two weaknesses - attack on both flanks
• Opposition and zugzwang - forcing your opponent to make bad moves
• Technique - converting advantages without giving counterplay`,

    concepts: [
      "King activity",
      "Two weaknesses principle",
      "Opposition",
      "Zugzwang",
      "Endgame technique"
    ],

    game: {
      white: "Vasily Smyslov",
      black: "Samuel Reshevsky",
      event: "Candidates Tournament",
      site: "Zurich",
      year: 1953,
      result: "1-0",
      opening: "Ruy Lopez",
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4 Qc7 12. Nbd2 Nc6 13. dxc5 dxc5 14. Nf1 Be6 15. Ne3 Rad8 16. Qe2 c4 17. Ng5 Bc8 18. Nf5 Bxf5 19. exf5 Nd5 20. Qe4 g6 21. fxg6 fxg6 22. Nf3 Nf4 23. Bxf4 Rxf4 24. Qe3 Qf7 25. Re2 Rd5 26. Rae1 Bf8 27. Qe4 Nd8 28. Qb7 Rb5 29. Qa8 Qd5 30. Qa7 Rf7 31. Qc5 Qxc5 32. Rxe5 Qa3 33. Rxb5 axb5 34. Re8 Qxa2 35. Rxd8 Qxb2 36. Rd1 a1=Q 37. Rxa1 Rf1+ 38. Rxf1 Qxf1+ 39. Kh2 Qf4+ 40. g3 Qxc4 41. Ne5 Qe2 42. Nxg6 hxg6 43. Kg2 Kf7 44. h4 Kf6 45. h5 gxh5 46. Kf3 Qd3+ 47. Kf4 Qd4+ 48. Kf3 Qd5+ 49. Kf4 Qd2+ 50. Kf3 Qc3 51. g4 hxg4+ 52. Kxg4 Qe5 53. Kf3 Qf5+ 54. Ke2 Ke5 55. Kd2 Kd4 56. f4 Qe4 57. Kc2 Qe2+ 58. Kb3 Qd3 59. Ka2 Qc4+ 60. Kb2 Kd3 61. Ka3 Qc3+ 62. Ka2 Kc4 63. f5 Kb4 64. f6 Qa5+ 65. Kb2 Qa4 66. f7 Qe8 67. Kc2 Qf8 68. Kd3 Kc5 69. Ke4 b4 70. Ke5 b3 71. Ke6 b2 72. Ke7 Qb4+ 73. Kd7 1-0`
    },

    annotations: {
      0: "Smyslov faces Reshevsky, one of America's strongest players.",
      30: "15. Ne3 Rad8 16. Qe2 c4 - The game has reached a critical middlegame phase.",
      58: "29. Qa8 Qd5 30. Qa7 - Smyslov maneuvers, looking for the right moment to exchange into a favorable endgame.",
      86: "43. Kg2! - The key to the endgame. The king marches up the board as a fighting piece.",
      104: "52. Kxg4 Qe5 - Despite being down material, Smyslov's technique is flawless.",
      144: "72. Ke7 Qb4+ 73. Kd7 1-0 - The pawn promotes. A masterclass in endgame technique."
    },

    quizPositions: [
      {
        afterMove: 86,
        question: "After 43. Kg2, why is king activity so important in this endgame?",
        hint: "Think about what the king can do that no other piece can.",
        answer: "In the endgame, the king is a strong piece that can attack pawns and support passed pawns. An active king is often worth more than a pawn."
      }
    ],

    conclusion: `Smyslov's games demonstrate that endgame mastery is about understanding principles, not memorizing positions. A well-placed king and proper technique can overcome material deficits.

**Key Takeaways:**
1. The king must be active in the endgame
2. Create multiple weaknesses in your opponent's position
3. Technique means finding the cleanest path to victory`
  }
];

export function getLessonsByBook(bookId) {
  return LESSONS.filter(l => l.bookId === bookId);
}

export function getLessonsByChapter(bookId, chapter) {
  return LESSONS.filter(l => l.bookId === bookId && l.chapter === chapter);
}

export function getLesson(lessonId) {
  return LESSONS.find(l => l.id === lessonId);
}

export function getBook(bookId) {
  return BOOKS[bookId];
}

export function getAllBooks() {
  return Object.values(BOOKS);
}
