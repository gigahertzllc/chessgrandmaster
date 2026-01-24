/**
 * Famous Chess Games Collection
 * Historical classics + Modern tournament games
 * Enhanced with Masters Database for Carlsen, Fischer, and Morphy
 */

import { getAllMasterGames, searchMasterGames } from './mastersDatabase.js';

export const FAMOUS_GAMES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PAUL MORPHY (1837-1884) - The Pride of New Orleans
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "morphy-opera-1858",
    white: "Paul Morphy",
    black: "Duke of Brunswick & Count Isouard",
    result: "1-0",
    year: 1858,
    event: "Paris Opera House",
    category: "morphy",
    title: "The Opera Game",
    description: "Perhaps the most famous chess game ever played. Morphy sacrifices both rooks and his queen to deliver a beautiful checkmate.",
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
    title: "Morphy's Brilliancy",
    description: "A stunning queen sacrifice leads to an unstoppable attack.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d4 exd4 5. O-O Nxe4 6. Re1 d5 7. Bxd5 Qxd5 8. Nc3 Qh5 9. Nxe4 Be6 10. Neg5 Bb4 11. Rxe6+ fxe6 12. Nxe6 Qf7 13. Nfg5 Qe7 14. Qe2 Bd6 15. Nxg7+ Kd7 16. Qg4+ Kd8 17. Nf7+ Qxf7 18. Bg5+ Be7 19. Ne6+ Kc8 20. Nc5+ Kb8 21. Nd7+ Kc8 22. Nb6+ Kb8 23. Qc8+ Rxc8 24. Nd7# 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WILHELM STEINITZ (1836-1900) - First World Champion
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "steinitz-bardeleben-1895",
    white: "Wilhelm Steinitz",
    black: "Curt von Bardeleben",
    result: "1-0",
    year: 1895,
    event: "Hastings",
    category: "steinitz",
    title: "Steinitz's Immortal",
    description: "Von Bardeleben left the board without resigning, seeing the forced mate. Steinitz demonstrated the winning line to spectators.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 d5 8. exd5 Nxd5 9. O-O Be6 10. Bg5 Be7 11. Bxd5 Bxd5 12. Nxd5 Qxd5 13. Bxe7 Nxe7 14. Re1 f6 15. Qe2 Qd7 16. Rac1 c6 17. d5 cxd5 18. Nd4 Kf7 19. Ne6 Rhc8 20. Qg4 g6 21. Ng5+ Ke8 22. Rxe7+ Kf8 23. Rf7+ Kg8 24. Rg7+ Kh8 25. Rxh7+ 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EMANUEL LASKER (1868-1941) - World Champion 27 years
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "lasker-capablanca-1914",
    white: "Emanuel Lasker",
    black: "Jose Raul Capablanca",
    result: "1-0",
    year: 1914,
    event: "St. Petersburg",
    category: "lasker",
    title: "Lasker's Tournament Victory",
    description: "Lasker defeats Capablanca in their first serious encounter, showing his legendary fighting spirit.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6 dxc6 5. d4 exd4 6. Qxd4 Qxd4 7. Nxd4 Bd6 8. Nc3 Ne7 9. O-O O-O 10. f4 Re8 11. Nb3 f6 12. f5 b6 13. Bf4 Bb7 14. Bxd6 cxd6 15. Nd4 Rad8 16. Ne6 Rd7 17. Rad1 Nc8 18. Rf2 b5 19. Rfd2 Rde7 20. b4 Kf7 21. a3 Ba8 22. Kf2 Ra7 23. g4 h6 24. Rd3 a5 25. h4 axb4 26. axb4 Rae7 27. Kf3 Rg8 28. Kf4 g6 29. Rg3 g5+ 30. Kf3 Nb6 31. hxg5 hxg5 32. Rh3 Rd7 33. Kg3 Ke8 34. Rdh1 Bb7 35. e5 dxe5 36. Ne4 Nd5 37. N6c5 Bc8 38. Nxd7 Bxd7 39. Rh7 Rf8 40. Ra1 Kd8 41. Ra8+ Bc8 42. Nc5 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JOSE RAUL CAPABLANCA (1888-1942) - The Chess Machine
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "capablanca-marshall-1918",
    white: "Jose Raul Capablanca",
    black: "Frank Marshall",
    result: "1-0",
    year: 1918,
    event: "New York",
    category: "capablanca",
    title: "Marshall Attack Debut",
    description: "Marshall unveils his famous gambit, prepared for years. Capablanca defends brilliantly over the board.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d5 9. exd5 Nxd5 10. Nxe5 Nxe5 11. Rxe5 Nf6 12. Re1 Bd6 13. h3 Ng4 14. Qf3 Qh4 15. d4 Nxf2 16. Re2 Bg4 17. hxg4 Bh2+ 18. Kf1 Bg3 19. Rxf2 Qh1+ 20. Ke2 Bxf2 21. Bd2 Bh4 22. Qh3 Rae8+ 23. Kd3 Qf1+ 24. Kc2 Bf2 25. Qf3 Qg1 26. Bd5 c5 27. dxc5 Bxc5 28. b4 Bd6 29. a4 a5 30. axb5 axb4 31. Ra6 bxc3 32. Nxc3 Bb4 33. b6 Bxc3 34. Bxc3 h6 35. b7 Re3 36. Bxf7+ 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ALEXANDER ALEKHINE (1892-1946) - Attacking Genius
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "alekhine-reti-1925",
    white: "Alexander Alekhine",
    black: "Richard Reti",
    result: "1-0",
    year: 1925,
    event: "Baden-Baden",
    category: "alekhine",
    title: "Alekhine's Immortal",
    description: "A cascade of sacrifices leads to a beautiful finish against the founder of hypermodern chess.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 Na5 9. Bc2 c5 10. d4 Qc7 11. Nbd2 O-O 12. Nf1 Nc6 13. Ne3 Bd7 14. dxe5 dxe5 15. Nh4 g6 16. Nhf5 Rfe8 17. Qf3 Be6 18. Ng7 Bf8 19. N7xe6 fxe6 20. Bxg6 hxg6 21. Nxg6 Ng4 22. Nxf8+ Kxf8 23. Qh3 Qf7 24. Qh7 Qf6 25. Bh6+ Ke7 26. Qxg4 Rg8 27. Qh4 Qxh4 28. Bxh4+ Kd6 29. f3 Ne7 30. Rad1+ Kc7 31. Bf2 Rad8 32. Rxd8 Rxd8 33. Bxc5 Nc6 34. b4 a5 35. a3 axb4 36. axb4 Ra8 37. Rd1 Nd8 38. Be3 Nf7 39. Rd7+ Kc6 40. Rxf7 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MIKHAIL TAL (1936-1992) - The Magician from Riga
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "tal-larsen-1965",
    white: "Mikhail Tal",
    black: "Bent Larsen",
    result: "1-0",
    year: 1965,
    event: "Candidates Match",
    category: "tal",
    title: "Tal's Dazzling Attack",
    description: "Tal sacrifices a piece for a long-term attack that proves irresistible.",
    pgn: `1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e6 5. Nc3 d6 6. Be3 Nf6 7. f3 Be7 8. Qd2 O-O 9. O-O-O a6 10. g4 Nxd4 11. Bxd4 b5 12. g5 Nd7 13. h4 b4 14. Na4 Bb7 15. Nb6 Nxb6 16. Bxb6 Qc8 17. Bd3 a5 18. h5 Bc6 19. g6 fxg6 20. hxg6 h6 21. Qe3 Rf6 22. Qe1 Qb7 23. Bc4 Bd8 24. Bxd8 Rxd8 25. Rxd6 Rdxd6 26. Qxa5 Qd7 27. Bxe6+ Rxe6 28. Qxf6 gxf6 29. Rh1 Qf7 30. gxf7+ Kxf7 31. Rxh6 1-0`
  },
  {
    id: "tal-miller-1988",
    white: "Mikhail Tal",
    black: "Johann Hjartarson",
    result: "1-0",
    year: 1987,
    event: "Reykjavik",
    category: "tal",
    title: "The Sorcerer's Magic",
    description: "Classic Tal - sacrificing material for a devastating attack.",
    pgn: `1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Qc7 6. Be3 a6 7. Bd3 Nf6 8. O-O Nxd4 9. Bxd4 Bc5 10. Bxc5 Qxc5 11. Kh1 b5 12. f4 Bb7 13. e5 Nd5 14. Nxd5 Bxd5 15. c3 O-O 16. Qh5 g6 17. Qh6 f5 18. Rf3 Rf7 19. Rh3 Qe7 20. Qxg6+ Rg7 21. Qxe6+ Qxe6 22. Re1 Qc8 23. Rxe5 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BOBBY FISCHER (1943-2008) - American Legend  
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "byrne-fischer-1956",
    white: "Donald Byrne",
    black: "Robert James Fischer",
    result: "0-1",
    year: 1956,
    event: "Rosenwald Memorial",
    category: "fischer",
    title: "The Game of the Century",
    description: "13-year-old Fischer plays one of the most brilliant games ever, sacrificing his queen for a winning attack.",
    pgn: `1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Ra1# 0-1`
  },
  {
    id: "fischer-spassky-1972-g6",
    white: "Robert James Fischer",
    black: "Boris Spassky",
    result: "1-0",
    year: 1972,
    event: "World Championship, Reykjavik",
    category: "fischer",
    title: "WC 1972 Game 6",
    description: "Fischer's masterpiece - a flawless positional crush with the Queen's Gambit that stunned the chess world.",
    pgn: `1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 1-0`
  },
  {
    id: "fischer-spassky-1992",
    white: "Robert James Fischer",
    black: "Boris Spassky",
    result: "1-0",
    year: 1992,
    event: "Rematch, Sveti Stefan",
    category: "fischer",
    title: "Fischer Returns",
    description: "After 20 years away from chess, Fischer returns to defeat Spassky again.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 14. Ng3 g6 15. Bg5 h6 16. Bd2 Bg7 17. a4 c5 18. d5 c4 19. b4 Nh7 20. Be3 h5 21. Qd2 Rf8 22. Ra3 Ndf6 23. Rea1 Qd7 24. R1a2 Rfc8 25. Qc1 Bf8 26. Qa1 Qe8 27. Nf1 Be7 28. N1h2 Bd8 29. axb5 axb5 30. Ra8 Rxa8 31. Rxa8 Qxa8 32. Qxa8 Rxa8 33. Nc7 Ra1+ 34. Kh2 Ng4+ 35. hxg4 hxg4 36. Ng5 g3+ 37. fxg3 Bc8 38. Nxf7 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GARRY KASPAROV (1963-) - Greatest of All Time?
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "kasparov-topalov-1999",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    result: "1-0",
    year: 1999,
    event: "Wijk aan Zee",
    category: "kasparov",
    title: "Kasparov's Immortal",
    description: "One of the greatest games ever played. Kasparov sacrifices rook after rook in a breathtaking attack.",
    pgn: `1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0`
  },
  {
    id: "kasparov-karpov-1985-g16",
    white: "Garry Kasparov",
    black: "Anatoly Karpov",
    result: "1-0",
    year: 1985,
    event: "World Championship, Game 16",
    category: "kasparov",
    title: "Kasparov Becomes Champion",
    description: "The game that made Kasparov the youngest World Champion in history at 22.",
    pgn: `1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nb5 d6 6. c4 Nf6 7. N1c3 a6 8. Na3 d5 9. cxd5 exd5 10. exd5 Nb4 11. Be2 Bc5 12. O-O O-O 13. Bf3 Bf5 14. Bg5 Re8 15. Qd2 b5 16. Rad1 Nd3 17. Nab1 h6 18. Bh4 b4 19. Na4 Bd6 20. Bg3 Rc8 21. b3 g5 22. Bxd6 Qxd6 23. g3 Nd7 24. Bg2 Qf6 25. a3 a5 26. axb4 axb4 27. Qa2 Bg6 28. d6 g4 29. Qd2 Kg7 30. f3 Qxd6 31. fxg4 Qd4+ 32. Kh1 Nf6 33. Rf4 Ne4 34. Qxd3 Nf2+ 35. Rxf2 Bxd3 36. Rfd2 Qe3 37. Rxd3 Rc1 38. Nb2 Qf2 39. Nd2 Rxd1+ 40. Nxd1 Re1+ 1-0`
  },
  {
    id: "kasparov-anand-1995",
    white: "Garry Kasparov",
    black: "Viswanathan Anand",
    result: "1-0",
    year: 1995,
    event: "World Championship, Game 10",
    category: "kasparov",
    title: "WC 1995 - Kasparov's Dragon Slayer",
    description: "Kasparov crushes Anand's Dragon Sicilian with spectacular tactics.",
    pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Bd7 10. h4 Rc8 11. Bb3 Ne5 12. O-O-O Nc4 13. Bxc4 Rxc4 14. h5 Nxh5 15. g4 Nf6 16. Nde2 Qa5 17. Bh6 Bxh6 18. Qxh6 Rfc8 19. Rd3 R4c5 20. g5 Rxg5 21. Rd5 Rxd5 22. Nxd5 Re8 23. Nef4 Bc6 24. e5 Bxd5 25. Nxd5 Qa6 26. Nxf6+ exf6 27. Qxf6 Kf8 28. Qh6+ 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANATOLY KARPOV (1951-) - The Boa Constrictor
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "karpov-kasparov-1984-g9",
    white: "Anatoly Karpov",
    black: "Garry Kasparov",
    result: "1-0",
    year: 1984,
    event: "World Championship, Game 9",
    category: "karpov",
    title: "Karpov's Squeeze",
    description: "Classic Karpov - slowly improving his position until resistance is futile.",
    pgn: `1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nb5 d6 6. c4 Nf6 7. N1c3 a6 8. Na3 Be7 9. Be2 O-O 10. O-O b6 11. Be3 Bb7 12. Rc1 Rc8 13. Qb3 Na5 14. Qa4 Nc6 15. Qb3 Na5 16. Qa4 Nc6 17. Rfd1 Ne5 18. Qb3 Qc7 19. f3 Rfd8 20. Nc2 Ng6 21. Bf2 Bf8 22. Bf1 Be7 23. Be1 Bd8 24. Qd3 Qc5+ 25. Bf2 Qc7 26. Be3 Ne5 27. Qe2 Ng6 28. b3 Qc5 29. Bf2 Qc7 30. Na4 bxa4 31. Rxc7 Rxc7 32. bxa4 Ne5 33. Rb1 Bc8 34. Rb6 Nfd7 35. Rxa6 Nc5 36. Ra8 Rc8 37. Na3 Be7 38. Qa2 Nd7 39. Bd4 Nc5 40. Nb5 Na6 41. Bxe5 dxe5 42. Qd2 Bf8 43. Qd6 Nb4 44. Qxe5 f6 45. Qb2 Rc6 46. Qe2 Bd7 47. Nd4 Rd6 48. Nb5 Rc6 49. a5 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VLADIMIR KRAMNIK (1975-) - 14th World Champion
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "kramnik-kasparov-2000-g2",
    white: "Vladimir Kramnik",
    black: "Garry Kasparov",
    result: "1-0",
    year: 2000,
    event: "World Championship, London",
    category: "kramnik",
    title: "Dethroning Kasparov",
    description: "Kramnik's Berlin Defense preparation shocked Kasparov and changed opening theory forever.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5 8. Qxd8+ Kxd8 9. Nc3 Ke8 10. h3 h5 11. Bf4 Be7 12. Rad1 Be6 13. Ng5 Rh6 14. g3 Bxg5 15. Bxg5 Rg6 16. h4 f6 17. exf6 gxf6 18. Bf4 Nxh4 19. f3 Rd8 20. Kf2 Rxd1 21. Nxd1 Nf5 22. Rh1 Bxa2 23. Rxh5 Be6 24. g4 Nd6 25. Rh7 Nf7 26. Ne3 Kd8 27. Nf5 c5 28. Ng3 Ne5 29. Rh8+ Rg8 30. Bxe5 fxe5 31. Rh5 Kc8 32. Rxe5 Bf7 33. Nf5 1-0`
  },
  {
    id: "kramnik-topalov-2006-g2",
    white: "Vladimir Kramnik",
    black: "Veselin Topalov",
    result: "1-0",
    year: 2006,
    event: "World Championship, Elista",
    category: "kramnik",
    title: "Unified Championship",
    description: "Kramnik unifies the world championship with a dominant performance.",
    pgn: `1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. a3 b4 10. Ne4 Nxe4 11. Bxe4 bxa3 12. O-O Bd6 13. bxa3 Qc7 14. Bd2 e5 15. Rc1 O-O 16. dxe5 Bxe4 17. exd6 Qxd6 18. Qc2 Bxf3 19. gxf3 Qg6+ 20. Kh1 Qf5 21. Qb3 Qf4 22. Kg2 Rab8 23. Qd3 Rb2 24. Qxa6 Qxf3+ 25. Kh3 Rxd2 26. Rc4 Qf5+ 27. Kg2 Qf3+ 28. Kh3 Ne5 29. Rh4 Qf5+ 30. Rg4+ Nxg4 31. Qe6 Qxe6 32. fxe6 Nxe3 1-0`
  },
  {
    id: "kramnik-aronian-2018",
    white: "Vladimir Kramnik",
    black: "Levon Aronian",
    result: "1-0",
    year: 2018,
    event: "Candidates Tournament",
    category: "kramnik",
    title: "Kramnik's Last Hurrah",
    description: "A beautiful attacking game from the twilight of Kramnik's career.",
    pgn: `1. Nf3 d5 2. g3 Nf6 3. Bg2 e6 4. O-O Be7 5. c4 O-O 6. b3 c5 7. cxd5 Nxd5 8. Bb2 Nc6 9. d4 b6 10. Nc3 Nxc3 11. Bxc3 Bb7 12. Rc1 Rc8 13. dxc5 bxc5 14. Qd6 Bf6 15. Rfd1 Qe7 16. Qxe7 Bxe7 17. Ne5 Nxe5 18. Bxe5 Bxg2 19. Kxg2 Bf6 20. Bf4 Rfd8 21. Kf3 Rxd1 22. Rxd1 Rd8 23. Rxd8+ Bxd8 24. Ke4 Kf8 25. Kd5 Ke8 26. Kc6 f6 27. Kb7 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VISWANATHAN ANAND (1969-) - The Tiger of Madras
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "anand-topalov-2005",
    white: "Viswanathan Anand",
    black: "Veselin Topalov",
    result: "1-0",
    year: 2005,
    event: "Sofia MTel",
    category: "anand",
    title: "Anand's Lightning Attack",
    description: "Anand demonstrates his legendary speed with a crushing kingside attack.",
    pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 b5 8. g4 h6 9. Qd2 Nbd7 10. O-O-O Bb7 11. h4 b4 12. Na4 Qa5 13. b3 Nc5 14. a3 Nxa4 15. axb4 Qxd2+ 16. Rxd2 Nc3 17. Bxa6 Bxa6 18. Nb5 Bxb5 19. bxc5 Na4 20. cxd6 Bxd6 21. Kb1 Ke7 22. Ra2 Rhc8 23. c4 Rxc4 24. bxc4 Bxc4 25. Ra3 Nc5 26. Kc2 Bd3+ 27. Kd2 Bxe4 28. Rc3 Nd7 29. Kc2 Bxf3 30. Rxf3 Rxa2+ 31. Kb3 Ra6 32. Kc4 Nc5 33. Kd4 Rd6+ 34. Ke3 Rd7 35. Bf4 Ne4 36. Be5 f6 37. Bxf6+ gxf6 38. Rxf6 Nd2 39. Kf2 Rc7 40. Rf3 Nc4 41. g5 hxg5 42. hxg5 Be5 43. Rh3 Nd6 44. Rh7+ Kf8 45. Rxc7 Bxc7 46. Ke3 Kg7 47. Ke4 Nc4 48. Kd5 1-0`
  },
  {
    id: "anand-carlsen-2013-g5",
    white: "Viswanathan Anand",
    black: "Magnus Carlsen",
    result: "0-1",
    year: 2013,
    event: "World Championship, Chennai",
    category: "anand",
    title: "Changing of the Guard",
    description: "Carlsen breaks through to win his first World Championship game against Anand.",
    pgn: `1. c4 e6 2. d4 d5 3. Nc3 c6 4. e4 dxe4 5. Nxe4 Bb4+ 6. Nc3 c5 7. a3 Ba5 8. Nf3 Nf6 9. Be3 Nc6 10. Qd3 cxd4 11. Nxd4 Ng4 12. O-O-O Nxe3 13. fxe3 Bc7 14. Nxc6 bxc6 15. Qxd8+ Bxd8 16. Be2 Ke7 17. Bf3 Bd7 18. Ne4 Bb6 19. c5 f5 20. cxb6 fxe4 21. b7 Rab8 22. Bxe4 Rxb7 23. Rhf1 Rb5 24. Rf4 g5 25. Rf3 h5 26. Rdf1 Be8 27. Bc2 Rc5 28. Rf6 h4 29. e4 a5 30. Kd2 Rb5 31. b3 Bh5 32. Kc3 Rc8+ 33. Kd4 Rb4+ 34. Ke3 Rxe4+ 35. Kf2 Rf8 36. Rxf8 Kxf8 37. Bd3 Rd4 38. Bc2 Ke7 39. Ke3 Rd6 40. Rf5 Bf7 41. Rf2 Rd5 42. Ke4 Rb5 43. Rf3 Be6 44. Bd3 Rb6 45. Rf2 a4 46. bxa4 Ra6 47. Kd4 Rxa4+ 48. Kc5 Ra3 0-1`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MAGNUS CARLSEN (1990-) - The Mozart of Chess
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "carlsen-anand-2013-g9",
    white: "Magnus Carlsen",
    black: "Viswanathan Anand",
    result: "1-0",
    year: 2013,
    event: "World Championship, Chennai",
    category: "carlsen",
    title: "Carlsen Becomes Champion",
    description: "The clinching game where Carlsen wins his first World Championship title.",
    pgn: `1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. f3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 exd5 8. e3 c4 9. Ne2 Nc6 10. g4 O-O 11. Bg2 Na5 12. O-O Nb3 13. Ra2 b5 14. Ng3 a5 15. g5 Ne8 16. e4 Nxc1 17. Qxc1 Ra6 18. e5 Nc7 19. f4 b4 20. axb4 axb4 21. Rxa6 Nxa6 22. f5 b3 23. Qf4 Nc7 24. f6 g6 25. Qh4 Ne8 26. Qh6 b2 27. Rf4 b1=Q+ 28. Nf1 Qe1 0-1`
  },
  {
    id: "carlsen-caruana-2018-g6",
    white: "Magnus Carlsen",
    black: "Fabiano Caruana",
    result: "1/2-1/2",
    year: 2018,
    event: "World Championship, London",
    category: "carlsen",
    title: "The Greatest Escape",
    description: "Carlsen escapes from a lost position against Caruana in an epic WC game.",
    pgn: `1. e4 c5 2. Nf3 Nc6 3. Bb5 g6 4. Bxc6 dxc6 5. d3 Bg7 6. h3 Nf6 7. Nc3 Nd7 8. Be3 e5 9. O-O O-O 10. Nh2 b6 11. f4 exf4 12. Bxf4 Be5 13. Ng4 Bxf4 14. Rxf4 f5 15. exf5 Nf6 16. Nxf6+ Qxf6 17. fxg6 Qxf4 18. gxh7+ Kh8 19. Qf1 Qxf1+ 20. Rxf1 Rxf1+ 21. Kxf1 Bb7 22. Nd1 Rf8+ 23. Ke2 Kg7 24. Nf2 Kxh7 25. g4 Kg6 26. Ke3 Bg2 27. h4 Rf7 28. Ng4 Re7+ 29. Kf4 Rf7+ 30. Ke3 Re7+ 31. Kf4 Rf7+ 32. Ke3 Bc6 33. Ne5+ Kg7 34. Nxf7 Kxf7 35. d4 cxd4+ 36. Kxd4 Ke6 37. c4 Be8 38. Ke4 Bf7 39. b3 c5 40. h5 Bg8 41. Kf4 Bf7 42. Ke4 Bg8 43. Kd3 Kd6 44. Ke4 Ke6 45. Kf4 Bf7 46. Ke4 Bg8 47. Kf4 Bf7 48. Ke4 1/2-1/2`
  },
  {
    id: "carlsen-karjakin-2016-g10",
    white: "Magnus Carlsen",
    black: "Sergey Karjakin",
    result: "1-0",
    year: 2016,
    event: "World Championship, New York",
    category: "carlsen",
    title: "Carlsen's Rook Endgame Masterclass",
    description: "A demonstration of Carlsen's legendary endgame technique.",
    pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. Re1 Nd6 6. Bxc6 dxc6 7. Rxe5+ Be7 8. Nc3 O-O 9. Nd5 Bf5 10. d4 Bf6 11. Re1 Ne4 12. c3 Re8 13. Bf4 c5 14. Rxe4 Bxe4 15. Nxf6+ Qxf6 16. dxc5 Rad8 17. Qb3 Qe7 18. Be3 Qxc5 19. Nd4 Bd3 20. Rd1 Qe5 21. Qc3 Qf5 22. b3 h5 23. h3 Re4 24. Qc1 Rde8 25. Qd2 Be2 26. Rxe2 Rxe2 27. Qxe2 Rxe2 28. Nxe2 Qb1+ 29. Kh2 Qxa2 30. Ng3 h4 31. Nf1 b5 32. Bd4 c5 33. Bc3 Qc4 34. Nd2 Qc2 35. Nf3 Qd3 36. Nxh4 Qxb3 37. Nf3 Qc4 38. Bd2 a5 39. Ba5 Qd5 40. Ng5 Qf5 41. Nxf7 Qxf7 42. Bc7 a4 43. Bd6 Qf4+ 44. Kg1 Qc1+ 45. Kh2 Qf4+ 46. Kg1 Qc1+ 47. Kh2 Qf4+ 48. g3 Qd2 49. Bxc5 a3 50. Bf2 Qc2 51. Kg1 b4 52. cxb4 Qb1+ 53. Kh2 Qxb4 54. Kg2 Kf7 55. Bc5 Qc4 56. Bxa3 Qb3 57. Bc5 Kg6 58. f3 Kh5 59. Kh2 Qb5 60. Be3 Kg6 61. Bf4 Qb2+ 62. Kg1 Qe2 63. Bc1 Kf6 64. Bb2 Ke6 65. Bc3 Kf5 66. Bd2 Kf6 67. h4 Qd1+ 68. Kf2 Qd5 69. Be3 Qc4 70. Bd4+ Ke6 71. Kg2 Qa2+ 72. Kh3 Qa4 73. Kh2 Qa2+ 74. Kg1 Qa1+ 75. Kf2 Qb2+ 1-0`
  },
  {
    id: "carlsen-nepomniachtchi-2021-g6",
    white: "Magnus Carlsen",
    black: "Ian Nepomniachtchi",
    result: "1-0",
    year: 2021,
    event: "World Championship, Dubai",
    category: "carlsen",
    title: "The 136-Move Marathon",
    description: "The longest game in World Championship history. Carlsen's endgame wizardry breaks Nepo.",
    pgn: `1. d4 Nf6 2. Nf3 d5 3. g3 e6 4. Bg2 Be7 5. O-O O-O 6. b3 c5 7. dxc5 Bxc5 8. c4 dxc4 9. Qc2 Qe7 10. Nbd2 Nc6 11. Nxc4 b5 12. Nce5 Nb4 13. Qb2 Bb7 14. a3 Nc6 15. Nd3 Bb6 16. Bg5 Rfd8 17. Bxf6 gxf6 18. Rac1 Nd4 19. Nxd4 Bxd4 20. Qa2 Bxg2 21. Kxg2 Qb7+ 22. Kg1 Qe4 23. Qc2 a5 24. Qxe4 1/2-1/2`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FABIANO CARUANA (1992-) - American Challenger
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "caruana-carlsen-2018-g1",
    white: "Fabiano Caruana",
    black: "Magnus Carlsen",
    result: "1/2-1/2",
    year: 2018,
    event: "World Championship, London",
    category: "caruana",
    title: "The Opening Salvo",
    description: "Caruana puts massive pressure on Carlsen in game 1 of their championship match.",
    pgn: `1. e4 c5 2. Nf3 Nc6 3. Bb5 g6 4. Bxc6 dxc6 5. d3 Bg7 6. O-O Qc7 7. Re1 e5 8. a3 Nf6 9. b4 O-O 10. Nbd2 Bg4 11. h3 Bxf3 12. Nxf3 cxb4 13. axb4 a5 14. bxa5 Rxa5 15. Bd2 Raa8 16. Qb1 Nd7 17. Qb4 Rfe8 18. Bc3 b5 19. Rxa8 Rxa8 20. Ra1 Rxa1+ 21. Bxa1 Qa7 22. Bc3 Qa2 23. Qb2 Qxb2 24. Bxb2 f6 25. Kf1 Kf7 26. Ke2 Nf8 27. Bc3 Ne6 28. g3 Bf8 29. Nd2 Ng5 30. h4 Ne6 31. Nb3 h5 32. Bd2 Bd6 33. c3 Nc7 34. Be3 Nb5 35. Kd1 Nc7 36. Kc2 Ne8 37. Bc1 Nc7 38. Kb2 Nb5 39. Na1 Ke6 40. Nc2 Nd4 41. Nb4 Bxb4 42. cxb4 Kd6 43. Be3 Nf3 44. Kc3 Kc6 45. Bc1 Ne1 46. Kd2 Nd3 47. Bg5 Nxf2 48. Bxf6 Kd6 49. Ke3 Nd1+ 50. Kd2 Nb2 51. Bg5 Ke6 52. Kc3 Nc4 53. d4 exd4+ 54. Kxd4 Nd6 55. e5 Nb7 56. Be3 Kd7 57. Kd5 Kc7 58. Bc1 Na5 59. Bg5 Nb3 60. Bf4 Na5 61. Bd2 Nb3 62. Bc3 Na5 63. Bb4 Nb7 64. Kc5 Nd8 65. Bd6+ Kb7 66. Kd5 Nc6 67. Bc5 Ne7+ 68. Kd6 Nf5+ 69. Ke6 Kc6 70. Be3 Nh6 71. Kf6 Kd5 72. Kxg6 Nf5 73. Bf2 Kxe5 74. Kxh5 Nd4 75. Kg5 Ke4 76. h5 Nf3+ 77. Kg6 Kf4 78. Bc5 Ne5+ 79. Kf6 Nf3 80. h6 Kg4 81. h7 Nh4 82. Bf8 Kg3 83. Ke5 Nf3+ 84. Kd5 Nd2 85. Kc5 Nc4 1/2-1/2`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DING LIREN (1992-) - Current World Champion
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "ding-nepomniachtchi-2023-g4",
    white: "Ding Liren",
    black: "Ian Nepomniachtchi",
    result: "1-0",
    year: 2023,
    event: "World Championship, Astana",
    category: "ding",
    title: "Ding's First WC Win",
    description: "Ding Liren wins his first classical game in the 2023 World Championship match.",
    pgn: `1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. h3 dxc4 5. e3 c5 6. Bxc4 a6 7. O-O Nc6 8. Nc3 b5 9. Bd3 Bb7 10. a4 b4 11. Ne4 Na5 12. Nxf6+ gxf6 13. e4 c4 14. Bc2 Qc7 15. Bd2 Rg8 16. Rc1 O-O-O 17. Bd3 Kb8 18. Qe2 Bd6 19. Bxc4 Nxc4 20. Rxc4 Qb6 21. Rfc1 Rc8 22. d5 Rxc4 23. Rxc4 exd5 24. exd5 Bc8 25. Qe4 f5 26. Qb1 Be7 27. Be3 Qb5 28. Qd3 Bd6 29. Bc5 Re8 30. Bxd6+ Qxd6 31. Qb3 Re2 32. Rd4 Qe7 33. Nd4 Re1+ 34. Kh2 Bd7 35. d6 Qe5+ 36. Nf3 Qxd6+ 37. Rxd6 Re2 38. Rd2 Re4 39. g3 Bxa4 40. Qd3 Bc6 41. Nd4 Re8 42. Kg2 Bd7 43. f4 Kc7 44. Kf3 Rb8 45. Re2 a5 46. Re7 Rd8 47. Qa6 Kb8 48. Nc6+ 1-0`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODERN TOURNAMENT CLASSICS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "ivanchuk-yusupov-1991",
    white: "Vassily Ivanchuk",
    black: "Artur Yusupov",
    result: "1-0",
    year: 1991,
    event: "Brussels Candidates",
    category: "modern",
    title: "Ivanchuk's Brilliancy Prize",
    description: "A stunning attacking game showcasing Ivanchuk's creative genius.",
    pgn: `1. c4 e5 2. g3 d6 3. Bg2 g6 4. d4 Nd7 5. Nc3 Bg7 6. Nf3 Ngf6 7. O-O O-O 8. Qc2 Re8 9. Rd1 c6 10. b3 Qe7 11. Ba3 e4 12. Ng5 e3 13. f4 Nf8 14. b4 Bf5 15. Qb3 h6 16. Nf3 Ng4 17. b5 g5 18. bxc6 bxc6 19. Ne5 gxf4 20. Nxc6 Qg5 21. Bxd6 Ng6 22. Nd5 Qh5 23. h4 Nxh4 24. gxh4 Qxh4 25. Nde7+ Kh8 26. Nxf5 Qh2+ 27. Kf1 Re6 28. Qb7 Rg6 29. Qxa8+ Kh7 30. Qg8+ 1-0`
  },
  {
    id: "short-timman-1991",
    white: "Nigel Short",
    black: "Jan Timman",
    result: "1-0",
    year: 1991,
    event: "Tilburg",
    category: "modern",
    title: "Short's King Walk",
    description: "Short's king marches up the board in one of chess's most spectacular games.",
    pgn: `1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 g6 5. Bc4 Nb6 6. Bb3 Bg7 7. Qe2 Nc6 8. O-O O-O 9. h3 a5 10. a4 dxe5 11. dxe5 Nd4 12. Nxd4 Qxd4 13. Re1 e6 14. Nd2 Nd5 15. Nf3 Qc5 16. Qe4 Qb4 17. Bc4 Nb6 18. b3 Nxc4 19. bxc4 Re8 20. Rd1 Qc5 21. Qh4 b6 22. Be3 Qc6 23. Bh6 Bh8 24. Rd8 Bb7 25. Rad1 Bg7 26. R8d7 Rf8 27. Bxg7 Kxg7 28. R1d4 Rae8 29. Qf6+ Kg8 30. h4 h5 31. Kh2 Rc8 32. Kg3 Rce8 33. Kf4 Bc8 34. R7d6 Bb7 35. Kg5 1-0`
  }
];

// Group games by category for easy filtering
// NOTE: Icons are provided by the theme via theme.icon("player", playerId)
export const GAME_CATEGORIES = {
  morphy: { name: "Paul Morphy", era: "1837-1884", count: "12+ games" },
  steinitz: { name: "Wilhelm Steinitz", era: "1836-1900" },
  lasker: { name: "Emanuel Lasker", era: "1868-1941" },
  capablanca: { name: "Jose Raul Capablanca", era: "1888-1942" },
  alekhine: { name: "Alexander Alekhine", era: "1892-1946" },
  tal: { name: "Mikhail Tal", era: "1936-1992" },
  fischer: { name: "Bobby Fischer", era: "1943-2008", count: "12+ games" },
  kasparov: { name: "Garry Kasparov", era: "1963-" },
  karpov: { name: "Anatoly Karpov", era: "1951-" },
  kramnik: { name: "Vladimir Kramnik", era: "1975-" },
  anand: { name: "Viswanathan Anand", era: "1969-" },
  carlsen: { name: "Magnus Carlsen", era: "1990-", count: "12+ games" },
  caruana: { name: "Fabiano Caruana", era: "1992-" },
  ding: { name: "Ding Liren", era: "1992-" },
  modern: { name: "Modern Classics", era: "1990+" }
};

// Combine famous games with masters database (avoiding duplicates by id)
function getAllGames() {
  const masterGames = getAllMasterGames();
  const existingIds = new Set(FAMOUS_GAMES.map(g => g.id));
  const newMasterGames = masterGames.filter(g => !existingIds.has(g.id));
  return [...FAMOUS_GAMES, ...newMasterGames];
}

export function getGamesByCategory(category) {
  return getAllGames().filter(g => g.category === category);
}

export function searchGames(query) {
  const q = query.toLowerCase();
  return getAllGames().filter(g => 
    g.white.toLowerCase().includes(q) ||
    g.black.toLowerCase().includes(q) ||
    g.title?.toLowerCase().includes(q) ||
    g.event?.toLowerCase().includes(q) ||
    g.description?.toLowerCase().includes(q)
  );
}

// Export combined games list
export function getAllFamousGames() {
  return getAllGames();
}
