/**
 * Chess Training Lessons
 * Based on famous chess books, starting with "Russian Chess" by Bruce Pandolfini
 */

export const BOOKS = {
  russian_chess: {
    id: "russian_chess",
    title: "Russian Chess",
    author: "Bruce Pandolfini",
    description: "Learn from the greatest Soviet and Russian champions. This book explores the distinctive style of Russian chess masters, emphasizing strategic planning, patience, and deep calculation.",
    coverColor: "#8B0000",
    chapters: 10
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
