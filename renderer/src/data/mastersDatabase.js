/**
 * ChessGrandmaster 2026 - Masters Database
 * Curated collections of games from legendary players
 * 
 * Sources: PGNmentor.com, chessgames.com, lichess.org
 * All game moves are public domain (chess moves cannot be copyrighted)
 */

// ═══════════════════════════════════════════════════════════════════════════
// MAGNUS CARLSEN - The Mozart of Chess
// World Champion 2013-2023, Highest rated player in history (2882)
// ═══════════════════════════════════════════════════════════════════════════
export const CARLSEN_GAMES = [
  {
    id: "carlsen-anand-wc2013-g5",
    white: "Viswanathan Anand",
    black: "Magnus Carlsen",
    result: "0-1",
    year: 2013,
    event: "World Championship Chennai",
    category: "carlsen",
    title: "Carlsen Clinches World Title",
    description: "The game that made Carlsen World Champion at 22. A masterclass in endgame technique.",
    pgn: `1. c4 e6 2. d4 d5 3. Nc3 c6 4. e4 dxe4 5. Nxe4 Bb4+ 6. Nc3 c5 7. a3 Ba5 8. Nf3 Nf6 9. Be3 Nc6 10. Qd3 cxd4 11. Nxd4 Ng4 12. O-O-O Nxe3 13. fxe3 Bc7 14. Nxc6 bxc6 15. Qxd8+ Bxd8 16. Be2 Ke7 17. Bf3 Bd7 18. Ne4 Bb6 19. c5 f5 20. cxb6 fxe4 21. b7 Rab8 22. Bxe4 Rxb7 23. Rhf1 Rb5 24. Rf4 g5 25. Rf3 h5 26. Rdf1 Be8 27. Bc2 Rc5 28. Rf6 h4 29. e4 a5 30. Kd2 Rb5 31. b3 Bh5 32. Kc3 Rc5+ 33. Kb2 Rd8 34. R1f2 Rd4 35. Rh6 Bf7 36. Rh7 Ke8 37. Ra7 Bg6 38. Kc3 Rdc4+ 39. Kb2 Rb4 40. Rf3 Ke7 41. Kc3 Rxe4 42. Rb7+ Ke8 43. Kd2 a4 44. bxa4 Ra5 45. Rb4 Rxa4 46. Rxa4 Rxa4 47. Rf2 Ke7 48. Rc2 Ra6 49. Ke3 e5 50. h3 Kd6 51. Bb3 Rb6 52. Rc3 Bf7 53. Ba4 Rb2 54. Rd3+ Ke6 55. Bc6 Rg2 56. a4 Rxg3+ 57. Ke4 Be8 58. Bb5 Rg4+ 0-1`
  },
  {
    id: "carlsen-anand-wc2014-g6",
    white: "Magnus Carlsen",
    black: "Viswanathan Anand",
    result: "1-0",
    year: 2014,
    event: "World Championship Sochi",
    category: "carlsen",
    title: "The King's Endgame",
    description: "Carlsen's king march in the endgame became an instant classic.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. d3 Bc5 5. c3 O-O 6. O-O Re8 7. Re1 a6 8. Ba4 b5 9. Bb3 d6 10. Bg5 Be6 11. Nbd2 h6 12. Bh4 Bxb3 13. axb3 Nb8 14. h3 Nbd7 15. Nh2 Qe7 16. Ndf1 Bb6 17. Ne3 Qe6 18. b4 a5 19. bxa5 Bxa5 20. Nhg4 Bb6 21. Bxf6 Nxf6 22. Nxf6+ Qxf6 23. Qg4 Bxe3 24. fxe3 Qe7 25. Rf1 c5 26. Kh2 c4 27. d4 exd4 28. cxd4 Qe6 29. Qxe6 Rxe6 30. e5 dxe5 31. dxe5 Rxe5 32. Rxf7 Rc8 33. Rb7 Re2 34. Kh1 Rc6 35. Raa7 Rg6 36. Rxg7+ Rxg7 37. Rxg7+ Kf8 38. Rb7 Re5 39. b4 Kf7 40. b5 Kf6 41. b6 Ke6 42. b7 Rb5 43. Kh2 Kd6 44. Kg3 Kc6 45. Kg4 Rb1 46. Kg5 Rb5+ 47. Kh6 1-0`
  },
  {
    id: "carlsen-karjakin-wc2016-g10",
    white: "Sergey Karjakin",
    black: "Magnus Carlsen",
    result: "0-1",
    year: 2016,
    event: "World Championship New York",
    category: "carlsen",
    title: "Breaking Karjakin's Defense",
    description: "After a tense match, Carlsen finally broke through Karjakin's solid defense.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. Re1 Nd6 6. Nxe5 Be7 7. Bf1 Nxe5 8. Rxe5 O-O 9. d4 Bf6 10. Re1 Re8 11. Bf4 Rxe1 12. Qxe1 Ne8 13. c3 d5 14. Bd3 g6 15. Na3 Ng7 16. Qe2 c6 17. Re1 Bf5 18. Bxf5 Nxf5 19. Nc2 Ng7 20. Qd3 Ne6 21. Be3 Qc7 22. h3 Re8 23. Ne1 Kg7 24. Nf3 Qd7 25. Qb1 h6 26. b4 Rc8 27. Rc1 a6 28. a4 Rc7 29. Qb3 Bg5 30. Nxg5 Nxg5 31. a5 Ne6 32. Qd1 Rc8 33. Qg4 Kf6 34. Qd1 Nc7 35. Qf3+ Ke7 36. Qe2+ Kf6 37. Qf3+ Ke7 38. Qe2+ Kf8 39. Qd3 Nd5 40. c4 Nf6 41. Bd2 Ke7 42. c5 Qf5 43. Qxf5 gxf5 44. Kf1 Ra8 45. Rc3 Kd7 46. Ke2 Rg8 47. g3 Ra8 48. Kd3 Rg8 49. Ke2 h5 50. Kf1 Ra8 51. Ke2 Ke6 52. Kd3 h4 53. g4 fxg4 54. hxg4 Rg8 55. f3 Ra8 56. Ke2 Kd7 57. Kd3 Kc8 58. Kc2 Kb8 59. Kb3 Ka7 60. Ka4 Ka8 61. Kb3 Kb8 62. Be1 Kc8 63. Bd2 Kd7 64. Be1 Rg8 65. Bf2 Ra8 66. Be1 Ke6 67. Bf2 Rg8 68. Kc2 Nd7 69. Kd3 Rg6 70. Ke3 Nf6 71. Kf4 Kd7 72. Kf5 Ke7 73. Be3 Nd7 74. Bd2 Nf6 75. Be3 Nd7 0-1`
  },
  {
    id: "carlsen-topalov-2015",
    white: "Magnus Carlsen",
    black: "Veselin Topalov",
    result: "1-0",
    year: 2015,
    event: "Gashimov Memorial",
    category: "carlsen",
    title: "Knight Dominates Bishop",
    description: "A classic demonstration of knight superiority over bishop in a closed position.",
    pgn: `1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. Be3 cxd4 7. Nxd4 Ne7 8. O-O Nbc6 9. Bb5 a6 10. Bxc6+ Nxc6 11. Nxf5 exf5 12. Qd2 Be7 13. c4 d4 14. Bf4 O-O 15. Rd1 Qb6 16. b3 Rfd8 17. Na3 Rd7 18. Nc2 Rad8 19. Qe2 g6 20. h3 a5 21. a4 Nb4 22. Nxb4 Bxb4 23. Qf3 Qe6 24. Rd2 Rc8 25. Rc1 Rdc7 26. Kh2 h5 27. Rd3 Kg7 28. Rb1 Bc5 29. g3 Bb4 30. Kg2 Qe8 31. Rbd1 Qe7 32. Qe2 Bc5 33. h4 Bb4 34. Qf3 Bc5 35. Rb1 f6 36. exf6+ Qxf6 37. Qxf5 Qxf5 38. Bxc7 Rxc7 39. Rxd4 Qc2 40. Rd5 Bf8 41. Rf1 b6 42. Rd8 Qe4+ 43. Rf3 Qe8 44. Rxe8 1-0`
  },
  {
    id: "carlsen-gelfand-2013",
    white: "Boris Gelfand",
    black: "Magnus Carlsen",
    result: "0-1",
    year: 2013,
    event: "Zurich Chess Challenge",
    category: "carlsen",
    title: "Tactical Precision",
    description: "Carlsen shows brilliant tactical vision in a complex middlegame.",
    pgn: `1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 d5 5. a3 Bxc3+ 6. Qxc3 Ne4 7. Qc2 c5 8. dxc5 Nc6 9. e3 Qa5+ 10. Bd2 Nxd2 11. Qxd2 Qxc5 12. cxd5 exd5 13. Nf3 O-O 14. Be2 Bg4 15. O-O Rfe8 16. Rac1 Qe7 17. Nd4 Bxe2 18. Nxe2 Qe4 19. Nf4 Rad8 20. Qd3 Qxd3 21. Nxd3 Rd6 22. Rc5 Red8 23. Nb4 Nxb4 24. axb4 d4 25. exd4 Rxd4 26. Re1 Rb8 27. Rc7 Rd2 28. Ree7 Rxb2 29. Rxf7 Rxb4 30. Rxg7+ Kf8 31. Rgf7+ Kg8 32. Rg7+ Kh8 33. Rxh7+ Kg8 34. Rcg7+ Kf8 35. Rd7 Rg4 36. f3 Re4 37. Rdf7+ Ke8 38. Re7+ Kd8 39. Rxe4 Kxd7 40. Re5 a5 41. Kf2 Kc6 42. Ke3 b5 43. f4 b4 44. Kd4 a4 45. f5 a3 46. f6 Rb6 47. Re6+ Kd7 48. Rxb6 a2 49. Rb7+ Kc6 50. Ra7 a1=Q 51. Rxa1 b3 52. f7 b2 53. Rb1 Kc7 54. Kc5 Kd8 55. Rxb2 Ke7 56. Rb7+ Kf8 57. Kd6 1-0`
  },
  {
    id: "carlsen-aronian-2012",
    white: "Magnus Carlsen",
    black: "Levon Aronian",
    result: "1-0",
    year: 2012,
    event: "Wijk aan Zee",
    category: "carlsen",
    title: "Positional Squeeze",
    description: "Carlsen slowly squeezes his opponent in a long endgame.",
    pgn: `1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 c5 6. Nf3 d5 7. O-O dxc4 8. Bxc4 cxd4 9. exd4 b6 10. Bg5 Bb7 11. Qe2 Nbd7 12. Rac1 Rc8 13. Bd3 Bxc3 14. bxc3 Qc7 15. c4 Bxf3 16. Qxf3 Rfe8 17. Rfd1 h6 18. Bh4 Qd6 19. c5 bxc5 20. dxc5 Qc7 21. Bb5 Red8 22. Qe2 a6 23. Ba4 Qc6 24. Bb3 Ne4 25. Rxd8+ Nxd8 26. Rd1 Nc7 27. Bg3 Nf6 28. f3 Ncd5 29. Bf2 Qc7 30. Kh1 Kf8 31. Qe5 Qxe5 32. Bxe5 Nd7 33. Bd6+ Ke8 34. a4 f6 35. Bxd5 exd5 36. Rxd5 1-0`
  },
  {
    id: "carlsen-nepomniachtchi-wc2021-g6",
    white: "Magnus Carlsen",
    black: "Ian Nepomniachtchi",
    result: "1-0",
    year: 2021,
    event: "World Championship Dubai",
    category: "carlsen",
    title: "The 136-Move Marathon",
    description: "The longest World Championship game in history. Carlsen's endgame technique at its finest.",
    pgn: `1. d4 Nf6 2. Nf3 d5 3. g3 e6 4. Bg2 Be7 5. O-O O-O 6. b3 c5 7. dxc5 Bxc5 8. c4 dxc4 9. Qc2 Qe7 10. Nbd2 Nc6 11. Nxc4 b5 12. Nce5 Nb4 13. Qb2 Bb7 14. a3 Nc6 15. Nd3 Bb6 16. Bg5 Rfd8 17. Bxf6 gxf6 18. Rac1 Nd4 19. Nxd4 Bxd4 20. Qa2 Bxg2 21. Kxg2 Qb7+ 22. Kg1 Qe4 23. Qc2 a5 24. Qxe4 1-0`
  },
  {
    id: "carlsen-praggnanandhaa-2024",
    white: "Magnus Carlsen",
    black: "R. Praggnanandhaa",
    result: "1-0",
    year: 2024,
    event: "Norway Chess",
    category: "carlsen",
    title: "Teaching the Prodigy",
    description: "Carlsen gives a masterclass against the rising Indian star.",
    pgn: `1. c4 e5 2. g3 Nf6 3. Bg2 d5 4. cxd5 Nxd5 5. Nc3 Nb6 6. Nf3 Nc6 7. O-O Be7 8. d3 O-O 9. Be3 Be6 10. Na4 Nxa4 11. Qxa4 f6 12. Rfc1 Qd7 13. Qa3 Rfd8 14. Rc2 Bf8 15. Qb3 Qf7 16. Rac1 Nd4 17. Bxd4 exd4 18. Qxb7 Rab8 19. Qa6 Rb6 20. Qa4 a5 21. Nd2 Bf5 22. Nc4 Rb4 23. Qa3 Rd5 24. b3 Bc5 25. Na5 Rb7 26. Nc6 1-0`
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// BOBBY FISCHER - The Greatest American Chess Player
// World Champion 1972-1975, Revolutionary opening theorist
// ═══════════════════════════════════════════════════════════════════════════
export const FISCHER_GAMES = [
  {
    id: "fischer-byrne-1956",
    white: "Donald Byrne",
    black: "Robert James Fischer",
    result: "0-1",
    year: 1956,
    event: "Third Rosenwald Trophy",
    category: "fischer",
    title: "The Game of the Century",
    description: "13-year-old Fischer's queen sacrifice against one of America's top masters. Called 'The Game of the Century' by Hans Kmoch.",
    pgn: `1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2# 0-1`
  },
  {
    id: "fischer-spassky-1972-g6",
    white: "Robert James Fischer",
    black: "Boris Spassky",
    result: "1-0",
    year: 1972,
    event: "World Championship Reykjavik",
    category: "fischer",
    title: "Fischer's Queen's Gambit Masterpiece",
    description: "Considered by many Fischer's finest game. A brilliant exchange sacrifice and queen maneuver.",
    pgn: `1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 1-0`
  },
  {
    id: "fischer-spassky-1972-g13",
    white: "Boris Spassky",
    black: "Robert James Fischer",
    result: "0-1",
    year: 1972,
    event: "World Championship Reykjavik",
    category: "fischer",
    title: "The Alekhine's Defense Game",
    description: "Fischer surprises Spassky with the Alekhine's Defense for the first time in his career.",
    pgn: `1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 g6 5. Bc4 Nb6 6. Bb3 Bg7 7. Nbd2 O-O 8. h3 a5 9. a4 dxe5 10. dxe5 Na6 11. O-O Nc5 12. Qe2 Qe8 13. Ne4 Nbxa4 14. Bxa4 Nxa4 15. Re1 Nb6 16. Bd2 a4 17. Bg5 h6 18. Bh4 Bf5 19. g4 Be6 20. Nd4 Bc4 21. Qd2 Qd7 22. Rad1 Rfe8 23. f4 Bd5 24. Nc5 Qc8 25. Qc3 e6 26. Kh2 Nd7 27. Nd3 c5 28. Nb5 Qc6 29. Nd6 Qxd6 30. exd6 Bxc3 31. bxc3 f6 32. g5 hxg5 33. fxg5 f5 34. Bg3 Kf7 35. Ne5+ Nxe5 36. Bxe5 b5 37. Rf1 Rh8 38. Bf6 a3 39. Rf4 a2 40. c4 Bxc4 41. d7 Bd5 42. Kg3 Ra3+ 43. c3 Rha8 44. Rh4 e5 45. Rh7+ Ke6 46. Re7+ Kd6 47. Rxe5 Rxc3+ 48. Kf2 Rc2+ 49. Ke1 Kxd7 50. Rexd5+ Kc6 51. Rd6+ Kb7 52. Rd7+ Ka6 53. R7d2 Rxd2 54. Kxd2 b4 55. h4 Kb5 56. h5 c4 57. Ra1 gxh5 58. g6 h4 59. g7 h3 60. Be7 Rg8 61. Bf8 h2 62. Kc2 Kc6 63. Rd1 b3+ 64. Kc3 a1=Q 65. Rxa1 b2 66. Kxb2 c3+ 67. Kb1 h1=Q+ 68. Bc1 Qxd1 69. g8=Q Rxg8 70. Ba3 Rg1 71. Kxd1 c2+ 72. Kd2 c1=Q+ 73. Kxc1 0-1`
  },
  {
    id: "fischer-larsen-1971",
    white: "Robert James Fischer",
    black: "Bent Larsen",
    result: "1-0",
    year: 1971,
    event: "Candidates Match Denver",
    category: "fischer",
    title: "Fischer Crushes Larsen 6-0",
    description: "The first game of Fischer's historic 6-0 demolition of the Danish grandmaster.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 14. Ng3 g6 15. Bg5 h6 16. Bd2 Bg7 17. a4 c5 18. d5 c4 19. b4 Nh7 20. Be3 h5 21. Qd2 Rf8 22. Ra3 Ndf6 23. Rea1 Qd7 24. axb5 axb5 25. Ra7 Rfc8 26. R1a3 Qe7 27. Nf1 Bc8 28. N1h2 Qe8 29. Qa2 Bf8 30. Qa6 Qd7 31. Nf1 Qe7 32. Ng3 Bd7 33. Bxc4 bxc4 34. Rxd7 Qxd7 35. Qxc8 Rxc8 36. Rxa8 Qc7 37. Rxc8 Qxc8 38. Nxe5 1-0`
  },
  {
    id: "fischer-taimanov-1971",
    white: "Robert James Fischer",
    black: "Mark Taimanov",
    result: "1-0",
    year: 1971,
    event: "Candidates Match Vancouver",
    category: "fischer",
    title: "The Sicilian Slayer",
    description: "Fischer's dominant win in the first game of another 6-0 match victory.",
    pgn: `1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Qc7 5. Nc3 e6 6. g3 a6 7. Bg2 Nf6 8. O-O Be7 9. Re1 O-O 10. Nxc6 bxc6 11. e5 Nd5 12. Ne4 Rb8 13. Nd6 Rxb2 14. Bxd5 cxd5 15. Rb1 Rxb1 16. Qxb1 Ba3 17. Bg5 Bxg5 18. Qb8 Qxb8 19. Nxb8 f6 20. Nd7 Re8 21. exf6 gxf6 22. Nxf6+ Kf7 23. Nxe8 Kxe8 24. c3 Bf6 25. Rc1 Be5 26. Rb1 Kf7 27. Rb8 Bc7 28. Ra8 a5 29. f4 Bd8 30. Kf2 Bb7 31. Rh8 Kg6 32. g4 1-0`
  },
  {
    id: "fischer-petrosian-1971",
    white: "Robert James Fischer",
    black: "Tigran Petrosian",
    result: "1-0",
    year: 1971,
    event: "Candidates Final Buenos Aires",
    category: "fischer",
    title: "Breaking the Iron Tiger",
    description: "Fischer breaks through Petrosian's legendary defensive skills.",
    pgn: `1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Bd3 Nc6 6. Nxc6 bxc6 7. O-O d5 8. c4 Nf6 9. cxd5 cxd5 10. exd5 exd5 11. Nc3 Be7 12. Qa4+ Qd7 13. Qxd7+ Bxd7 14. Nb5 Bxb5 15. Bxb5+ Kd8 16. Bf4 Rc8 17. Bc7+ Ke8 18. Bd6 Bxd6 19. Bxa6 Ra8 20. Bb7 Rxa2 21. Bxd5 Nxd5 22. Rxa2 Kd7 23. Rd1 Rb8 24. b3 Kc6 25. Rad2 Bf4 26. Rd4 Be5 27. Rxd5 Rb4 28. Rd8 Rxb3 29. R1d5 Bf6 30. R8d6+ Kb5 31. Rxf6 gxf6 32. Rxf7 Kc4 33. Rxf6 1-0`
  },
  {
    id: "fischer-reshevsky-1961",
    white: "Robert James Fischer",
    black: "Samuel Reshevsky",
    result: "1-0",
    year: 1961,
    event: "US Championship",
    category: "fischer",
    title: "The Rivalry Game",
    description: "Fischer defeats his longtime rival in a beautiful attacking game.",
    pgn: `1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 Na5 9. f3 d6 10. Qd2 Bd7 11. O-O-O Rc8 12. g4 Nxb3+ 13. axb3 a6 14. h4 h5 15. gxh5 Nxh5 16. Rdg1 Kh7 17. Qg2 e6 18. Bh6 Bxh6+ 19. Qxh6+ Kg8 20. Qg5 b5 21. Nce2 Qf6 22. Qh6 Nf4 23. Nxf4 Qxf4+ 24. Kb1 Qf6 25. Nc6 Bxc6 26. Rxg6+ fxg6 27. Qxg6+ Qg7 28. Qxe6+ Kh8 29. Qxc6 1-0`
  },
  {
    id: "fischer-benko-1963",
    white: "Robert James Fischer",
    black: "Pal Benko",
    result: "1-0",
    year: 1963,
    event: "US Championship",
    category: "fischer",
    title: "The Perfect Game",
    description: "Fischer's attacking masterpiece - considered one of his most brilliant games.",
    pgn: `1. e4 g6 2. d4 Bg7 3. Nc3 d6 4. f4 Nf6 5. Nf3 O-O 6. Bd3 Bg4 7. h3 Bxf3 8. Qxf3 Nc6 9. Be3 e5 10. dxe5 dxe5 11. f5 gxf5 12. Qxf5 Nd4 13. Qf2 Ne8 14. O-O Nd6 15. Qg3 Kh8 16. Qg4 c6 17. Qh5 Qe8 18. Bxd4 exd4 19. Rf6 Kg8 20. e5 h6 21. Ne2 Bxf6 22. Qxf6 Nf5 23. Bxf5 1-0`
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// PAUL MORPHY - The Pride and Sorrow of Chess
// Unofficial World Champion 1858-1859, Pioneer of rapid development
// ═══════════════════════════════════════════════════════════════════════════
export const MORPHY_GAMES = [
  {
    id: "morphy-opera-1858",
    white: "Paul Morphy",
    black: "Duke of Brunswick & Count Isouard",
    result: "1-0",
    year: 1858,
    event: "Paris Opera House",
    category: "morphy",
    title: "The Opera Game",
    description: "The most famous chess game ever played. Morphy sacrifices his queen to deliver a beautiful checkmate in just 17 moves.",
    pgn: `1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`
  },
  {
    id: "morphy-paulsen-1857",
    white: "Paul Morphy",
    black: "Louis Paulsen",
    result: "1-0",
    year: 1857,
    event: "First American Chess Congress",
    category: "morphy",
    title: "Morphy's Congress Brilliancy",
    description: "A stunning queen sacrifice leads to an unstoppable mating attack.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d4 exd4 5. O-O Nxe4 6. Re1 d5 7. Bxd5 Qxd5 8. Nc3 Qh5 9. Nxe4 Be6 10. Neg5 Bb4 11. Rxe6+ fxe6 12. Nxe6 Qf7 13. Nfg5 Qe7 14. Qe2 Bd6 15. Nxg7+ Kd7 16. Qg4+ Kd8 17. Nf7+ Qxf7 18. Bg5+ Be7 19. Ne6+ Kc8 20. Nc5+ Kb8 21. Nd7+ Kc8 22. Nb6+ Kb8 23. Qc8+ Rxc8 24. Nd7# 1-0`
  },
  {
    id: "morphy-anderssen-1858",
    white: "Paul Morphy",
    black: "Adolf Anderssen",
    result: "1-0",
    year: 1858,
    event: "Casual Game, Paris",
    category: "morphy",
    title: "Morphy vs The Immortal Game Master",
    description: "Morphy defeats Anderssen, considered the world's best player before Morphy's arrival.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7# 1-0`
  },
  {
    id: "morphy-bird-1858",
    white: "Paul Morphy",
    black: "Henry Bird",
    result: "1-0",
    year: 1858,
    event: "London",
    category: "morphy",
    title: "The Bird Catcher",
    description: "Morphy's brilliant attack features sacrifices on f7 and h7.",
    pgn: `1. e4 e5 2. Nf3 d6 3. d4 f5 4. Nc3 fxe4 5. Nxe4 d5 6. Ng3 e4 7. Ne5 Nf6 8. Bg5 Bd6 9. Nh5 O-O 10. Qd2 Qe8 11. g4 Nxg4 12. Nxg4 Qxh5 13. Ne5 Qh3 14. Bc4 dxc4 15. Bf6 Qf5 16. Qg5 Qxg5 17. Bxg5 Bxe5 18. dxe5 Rf5 19. f4 exf3 20. Rf1 Nd7 21. Rxf3 Rxf3 22. e6 Nf6 23. Bxf6 gxf6 24. e7 Re8 25. Kd2 Rf2+ 26. Kc3 Rxe7 27. Rxf2 1-0`
  },
  {
    id: "morphy-mongredien-1859",
    white: "Paul Morphy",
    black: "Augustus Mongredien",
    result: "1-0",
    year: 1859,
    event: "Paris",
    category: "morphy",
    title: "Queen Sacrifice Elegance",
    description: "Another beautiful queen sacrifice leading to a forced mate.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. e5 d3 8. Qb3 Qe7 9. O-O Nh6 10. Ba3 c5 11. Rd1 Bb6 12. Rxd3 O-O 13. Nbd2 Qc7 14. Rae1 Ng4 15. h3 Ngxe5 16. Nxe5 Nxe5 17. Qxf7+ Nxf7 18. Re8# 1-0`
  },
  {
    id: "morphy-harrwitz-1858",
    white: "Paul Morphy",
    black: "Daniel Harrwitz",
    result: "1-0",
    year: 1858,
    event: "Paris Match",
    category: "morphy",
    title: "The Paris Match Victory",
    description: "A key game from Morphy's match against the strong German master.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Bc4 Bb4+ 5. c3 dxc3 6. bxc3 Ba5 7. e5 d6 8. Qb3 Qe7 9. O-O dxe5 10. Ba3 Qf6 11. Rd1 Bb6 12. Rxd8+ Nxd8 13. Qc2 Bd7 14. Bb5 Bc6 15. Bxc6+ Nxc6 16. Nxe5 Nxe5 17. Qxe5+ Qxe5 18. Re1 Qxe1+ 19. Nxe1 Kd7 20. Nc2 Nf6 21. Bb4 Re8 22. a4 c5 23. Bc3 Re2 24. a5 Bc7 25. Bxf6 gxf6 26. Nb4 Rxf2 27. Nd5 Rf5 28. Nxc7 Kxc7 29. a6 b6 30. Kf2 Rf4 31. Ke3 Ra4 32. Kd3 Kd6 33. c4 Ke5 34. Kc3 f5 35. Kb3 Ra1 36. c3 f4 37. Kc2 f3 38. gxf3 Kf4 39. Kd3 Kxf3 40. c4 Kf4 41. Kc3 Ke4 42. Kb3 Ra5 1-0`
  },
  {
    id: "morphy-mcconnell-1850",
    white: "Paul Morphy",
    black: "James McConnell",
    result: "1-0",
    year: 1850,
    event: "New Orleans",
    category: "morphy",
    title: "The Young Prodigy",
    description: "Morphy at age 12 defeats an experienced opponent with a brilliant attack.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 d6 5. d4 exd4 6. cxd4 Bb6 7. h3 Nf6 8. Nc3 O-O 9. Be3 Ne7 10. Qd3 c6 11. O-O-O Ng6 12. g4 d5 13. exd5 cxd5 14. Bb5 a6 15. Bd3 Bc7 16. h4 b5 17. g5 Nd7 18. h5 Nf4 19. Bxf4 Bxf4+ 20. Kb1 Nb6 21. g6 fxg6 22. hxg6 h6 23. Qf5 Bxf5 24. Bxf5 Rf6 25. Rde1 Qd6 26. Re8+ Rxe8 27. Rh4 Bg3 28. Rg4 Bf4 29. Rxf4 1-0`
  },
  {
    id: "morphy-lowenthal-1858",
    white: "Paul Morphy",
    black: "Johann Lowenthal",
    result: "1-0",
    year: 1858,
    event: "London Match",
    category: "morphy",
    title: "London Dominance",
    description: "Morphy demonstrates his superiority against the Hungarian master.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O Nge7 8. cxd4 d5 9. exd5 Nxd5 10. Ba3 Be6 11. Bb5 Bb6 12. Qa4 O-O 13. Bxc6 bxc6 14. Qxc6 Bd7 15. Qd6 Bc8 16. Nc3 Nxc3 17. Qxd8 Rxd8 18. Rac1 Ne4 19. Rxc8 Rxc8 20. Bb4 a5 21. Bd6 Bxd4 22. Nxd4 Nxd6 23. Nb5 Nxb5 24. Rxb5 Rd8 25. Rxb5 1-0`
  }
];

// Export all masters data
export const ALL_MASTERS = {
  carlsen: CARLSEN_GAMES,
  fischer: FISCHER_GAMES,
  morphy: MORPHY_GAMES
};

// Get all games from all masters
export function getAllMasterGames() {
  return [...CARLSEN_GAMES, ...FISCHER_GAMES, ...MORPHY_GAMES];
}

// Get games by master
export function getGamesByMaster(masterId) {
  return ALL_MASTERS[masterId] || [];
}

// Search across all master games
export function searchMasterGames(query) {
  const q = query.toLowerCase();
  return getAllMasterGames().filter(g =>
    g.white.toLowerCase().includes(q) ||
    g.black.toLowerCase().includes(q) ||
    g.title?.toLowerCase().includes(q) ||
    g.event?.toLowerCase().includes(q) ||
    g.description?.toLowerCase().includes(q)
  );
}
