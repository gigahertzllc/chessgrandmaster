/**
 * Chess Personalities - Realistic Playing Styles
 * 
 * Each personality is tuned to emulate how the real player approached chess:
 * - skillLevel: Stockfish UCI Skill Level (1-20), roughly correlates to ELO
 * - moveTimeMs: Think time - longer for positional grinders, shorter for intuitive attackers
 * - Descriptions reflect their actual historical playing style
 */

export const personalities = {
  // ══════════════════════════════════════════════════════════════════════════
  // LEGENDARY WORLD CHAMPIONS
  // ══════════════════════════════════════════════════════════════════════════
  
  morphy: {
    id: "morphy",
    label: "Paul Morphy",
    subtitle: "Pride of New Orleans",
    description: "The original attacking genius. Morphy's chess was about rapid piece development, open lines, and relentless pressure on f7. He'd sacrifice anything for a lead in development, then deliver mate with shocking elegance.",
    era: "1837–1884",
    peakRating: "~2700 (estimated)",
    avatar: "🎩",
    skillLevel: 16,
    moveTimeMs: 100, // Played fast, intuitive
    style: "romantic-attack",
    traits: ["Rapid development", "Open games", "King hunts", "Piece sacrifices"],
    weaknesses: ["Closed positions", "Modern defensive technique"],
    famousGames: [
      "Opera Game vs Duke & Count (1858)",
      "vs Paulsen - The Immortal Morphy Game (1857)"
    ],
    quote: "Help your pieces so they can help you."
  },

  steinitz: {
    id: "steinitz",
    label: "Wilhelm Steinitz",
    subtitle: "Father of Modern Chess",
    description: "The first official World Champion who revolutionized chess theory. Steinitz proved that accumulating small advantages beats romantic sacrifices. He'd accept gambits, defend stubbornly, then win in the endgame.",
    era: "1836–1900",
    peakRating: "~2650 (estimated)",
    avatar: "📚",
    skillLevel: 15,
    moveTimeMs: 300, // Methodical, calculating
    style: "scientific-positional",
    traits: ["Pawn structure expert", "Defensive technique", "Endgame mastery", "Theory pioneer"],
    weaknesses: ["Sometimes too passive", "Aging affected later games"],
    famousGames: [
      "vs Zukertort, World Championship (1886)",
      "vs Blackburne, London (1876)"
    ],
    quote: "The king is a fighting piece. Use it!"
  },

  capablanca: {
    id: "capablanca",
    label: "José Raúl Capablanca",
    subtitle: "The Chess Machine",
    description: "Natural genius who made chess look effortless. Capablanca's style was crystal-clear logic and flawless endgame technique. He rarely calculated deeply because his intuition was almost always right. Lost only 34 serious games in his career.",
    era: "1888–1942",
    peakRating: "~2725 (estimated)",
    avatar: "💎",
    skillLevel: 18,
    moveTimeMs: 150, // Played quickly, trusted intuition
    style: "classical-simple",
    traits: ["Endgame perfection", "Simple clarity", "Natural talent", "Few mistakes"],
    weaknesses: ["Opening preparation", "Sometimes underestimated opponents"],
    famousGames: [
      "vs Marshall - Immortal Capablanca Game (1918)",
      "vs Tartakower, New York (1924)"
    ],
    quote: "A good player is always lucky."
  },

  alekhine: {
    id: "alekhine",
    label: "Alexander Alekhine",
    subtitle: "The Sadist of Chess",
    description: "Ferocious attacker with bottomless tactical depth. Alekhine combined romantic attacking flair with modern positional understanding. He'd lure opponents into complications, then unleash devastating combinations they never saw coming.",
    era: "1892–1946",
    peakRating: "~2750 (estimated)",
    avatar: "🦂",
    skillLevel: 18,
    moveTimeMs: 200,
    style: "dynamic-universal",
    traits: ["Deep calculation", "Attacking combinations", "Opening innovation", "Fighting spirit"],
    weaknesses: ["Alcohol affected later career", "Sometimes over-complicated"],
    famousGames: [
      "vs Réti - Alekhine's Immortal (1925)",
      "vs Capablanca, WCC Game 34 (1927)"
    ],
    quote: "I think, therefore I blunder."
  },

  botvinnik: {
    id: "botvinnik",
    label: "Mikhail Botvinnik",
    subtitle: "The Patriarch",
    description: "The father of Soviet chess school. Botvinnik approached chess scientifically - deep preparation, iron discipline, and systematic improvement. He trained Kasparov, Karpov, and Kramnik. A machine before computers existed.",
    era: "1911–1995",
    peakRating: "2630",
    avatar: "🔬",
    skillLevel: 17,
    moveTimeMs: 350, // Deep preparation, thorough calculation
    style: "scientific-strategic",
    traits: ["Opening preparation", "Self-analysis", "Mental toughness", "Strategic depth"],
    weaknesses: ["Vulnerable to anti-positional play", "Struggled vs unorthodox styles"],
    famousGames: [
      "vs Capablanca, AVRO (1938)",
      "vs Fischer, Varna Olympiad (1962)"
    ],
    quote: "Chess is the art of analysis."
  },

  tal: {
    id: "tal",
    label: "Mikhail Tal",
    subtitle: "The Magician from Riga",
    description: "The greatest attacking player ever. Tal sacrificed pieces with abandon, often unsoundly, but his opponents cracked under the pressure. He once said the purpose of sacrifices is to make the opponent uncomfortable. Pure chaos incarnate.",
    era: "1936–1992",
    peakRating: "2705",
    avatar: "🔮",
    skillLevel: 17,
    moveTimeMs: 80, // Intuitive, fast, hypnotic
    style: "sacrificial-attack",
    traits: ["Piece sacrifices", "Initiative worship", "Psychological warfare", "Blitz genius"],
    weaknesses: ["Objectively dubious sacrifices", "Health issues"],
    famousGames: [
      "vs Larsen - The Tal Attack (1965)",
      "vs Botvinnik, WCC Game 6 (1960)"
    ],
    quote: "You must take your opponent into a deep dark forest where 2+2=5, and the path leading out is only wide enough for one."
  },

  petrosian: {
    id: "petrosian",
    label: "Tigran Petrosian",
    subtitle: "Iron Tigran",
    description: "The ultimate defensive player. Petrosian could smell danger 10 moves away and would prevent it before it existed. His prophylactic style frustrated attacking players into submission. The hardest World Champion to beat.",
    era: "1929–1984",
    peakRating: "2655",
    avatar: "🛡️",
    skillLevel: 17,
    moveTimeMs: 400, // Patient, prophylactic
    style: "prophylactic-defensive",
    traits: ["Exchange sacrifices", "Prophylaxis master", "Positional fortress", "Draw artist"],
    weaknesses: ["Sometimes too passive", "Struggled to win against solid defense"],
    famousGames: [
      "vs Reshevsky, Zurich (1953)",
      "vs Spassky, WCC (1966)"
    ],
    quote: "Some sacrifices are sound; the rest are mine."
  },

  fischer: {
    id: "fischer",
    label: "Bobby Fischer",
    subtitle: "The American Legend",
    description: "Perhaps the most complete player ever. Fischer combined concrete calculation, perfect opening preparation, and merciless technique. He crushed the Soviet chess machine single-handedly, winning 20 consecutive games against top GMs.",
    era: "1943–2008",
    peakRating: "2785",
    avatar: "🦅",
    skillLevel: 19,
    moveTimeMs: 200, // Thorough but not slow
    style: "universal-perfectionist",
    traits: ["Opening perfection", "Endgame technique", "Psychological dominance", "No draws mentality"],
    weaknesses: ["Paranoia limited career", "Struggled with politics"],
    famousGames: [
      "Game of the Century vs D. Byrne (1956)",
      "vs Spassky, Game 6, Reykjavik (1972)"
    ],
    quote: "I don't believe in psychology. I believe in good moves."
  },

  karpov: {
    id: "karpov",
    label: "Anatoly Karpov",
    subtitle: "The Boa Constrictor",
    description: "Karpov slowly squeezed opponents to death. His style was prophylactic perfection - restricting counterplay while making tiny improvements until the position collapsed. Won more tournaments than anyone in history.",
    era: "1951–present",
    peakRating: "2780",
    avatar: "🐍",
    skillLevel: 19,
    moveTimeMs: 280,
    style: "prophylactic-positional",
    traits: ["Space control", "Piece maneuvering", "Restriction", "Technical endgames"],
    weaknesses: ["Sharp tactical positions", "Time pressure in complex positions"],
    famousGames: [
      "vs Kasparov, WCC Game 9 (1985)",
      "vs Topalov, Linares (1994)"
    ],
    quote: "Chess is everything: art, science, and sport."
  },

  kasparov: {
    id: "kasparov",
    label: "Garry Kasparov",
    subtitle: "The Beast from Baku",
    description: "The most dominant champion ever. Kasparov combined unmatched preparation with ferocious attacking play. His opening novelties were nuclear weapons, and his middlegame attacks were relentless. Number 1 for 20 consecutive years.",
    era: "1963–present",
    peakRating: "2851",
    avatar: "🔥",
    skillLevel: 20,
    moveTimeMs: 180, // Aggressive, energetic
    style: "dynamic-universal",
    traits: ["Opening preparation", "Dynamic attacks", "Energy", "Computer-like calculation"],
    weaknesses: ["Sometimes overconfident", "Emotional in critical moments"],
    famousGames: [
      "vs Topalov, Wijk aan Zee (1999) - Kasparov's Immortal",
      "vs Karpov, WCC Game 16 (1985)"
    ],
    quote: "Chess is mental torture."
  },

  kramnik: {
    id: "kramnik",
    label: "Vladimir Kramnik",
    subtitle: "The Berlin Wall",
    description: "The man who dethroned Kasparov without losing a game. Kramnik's style was solid, deep, and practically unbeatable. His Berlin Defense neutralized 1.e4 at the highest level, and his endgame technique was immaculate.",
    era: "1975–present",
    peakRating: "2817",
    avatar: "🧱",
    skillLevel: 19,
    moveTimeMs: 320,
    style: "solid-technical",
    traits: ["Opening solidity", "Endgame mastery", "Deep strategy", "Match player"],
    weaknesses: ["Health issues", "Sometimes too drawish"],
    famousGames: [
      "vs Kasparov, WCC Game 2 (2000)",
      "vs Aronian, Candidates (2018)"
    ],
    quote: "I play honestly and try to avoid pre-arranged draws."
  },

  anand: {
    id: "anand",
    label: "Viswanathan Anand",
    subtitle: "The Lightning Kid",
    description: "The fastest World Champion. Anand's intuition is legendary - he sees tactics instantly and plays with infectious enthusiasm. A true universal player who adapted his style across decades at the top.",
    era: "1969–present",
    peakRating: "2817",
    avatar: "⚡",
    skillLevel: 19,
    moveTimeMs: 120, // Famous for speed
    style: "intuitive-universal",
    traits: ["Speed", "Tactical vision", "Rapid chess mastery", "Adaptability"],
    weaknesses: ["Sometimes plays too fast", "Match pressure vs Carlsen"],
    famousGames: [
      "vs Aronian, Wijk aan Zee (2013)",
      "vs Topalov, WCC Game 4 (2010)"
    ],
    quote: "I don't play like a girl, I play like a guy who learned chess at 6."
  },

  carlsen: {
    id: "carlsen",
    label: "Magnus Carlsen",
    subtitle: "The Mozart of Chess",
    description: "The highest-rated player in history. Carlsen grinds forever in positions others would draw, finds resources where none exist, and never gives up. His universal style and legendary endgame technique make him nearly unbeatable.",
    era: "1990–present",
    peakRating: "2882",
    avatar: "👑",
    skillLevel: 20,
    moveTimeMs: 300, // Patient grinder
    style: "universal-grinding",
    traits: ["Endgame wizardry", "Stamina", "Universal openings", "Practical play"],
    weaknesses: ["Occasionally loses focus", "Bored by too many World Championships"],
    famousGames: [
      "vs Anand, WCC Game 6 (2013)",
      "vs Caruana, WCC Tiebreaks (2018)"
    ],
    quote: "Some people think that if their opponent plays a beautiful game, it's OK to lose. I don't."
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MODERN ELITE & RISING STARS
  // ══════════════════════════════════════════════════════════════════════════

  nakamura: {
    id: "nakamura",
    label: "Hikaru Nakamura",
    subtitle: "The Speed Demon",
    description: "The King of Blitz. Nakamura's aggressive style and lightning calculation make him the most feared speed chess player alive. His h4-h5 pawn storms and creative attacks have crushed countless opponents online and over the board.",
    era: "1987–present",
    peakRating: "2816",
    avatar: "💨",
    skillLevel: 19,
    moveTimeMs: 100, // Blitz specialist
    style: "aggressive-speed",
    traits: ["Blitz dominance", "h-pawn attacks", "Streaming fame", "Fighting spirit"],
    weaknesses: ["Classical vs elite", "Sometimes overextends"],
    famousGames: [
      "vs Carlsen, Zurich (2014)",
      "vs MVL, Speed Chess Championship (2017)"
    ],
    quote: "I'm too lazy to calculate everything."
  },

  caruana: {
    id: "caruana",
    label: "Fabiano Caruana",
    subtitle: "Fabi the Fantastic",
    description: "The closest challenger to Carlsen's throne. Caruana combines deep preparation with solid technique. His 2014 streak of 7/7 at Sinquefield Cup was one of the greatest tournament performances in history.",
    era: "1992–present",
    peakRating: "2844",
    avatar: "🎯",
    skillLevel: 20,
    moveTimeMs: 250,
    style: "prepared-solid",
    traits: ["Opening preparation", "Calculation depth", "Consistency", "Classical strength"],
    weaknesses: ["Rapid/blitz tiebreaks", "Pressure in must-win situations"],
    famousGames: [
      "vs Carlsen, WCC Game 1 (2018)",
      "Sinquefield Cup 2014 - 7/7 start"
    ],
    quote: "You have to be prepared to suffer in chess."
  },

  firouzja: {
    id: "firouzja",
    label: "Alireza Firouzja",
    subtitle: "The Prodigy",
    description: "The youngest player to break 2800. Firouzja plays fearless, aggressive chess with a swagger beyond his years. His rapid improvement trajectory suggests a future World Champion.",
    era: "2003–present",
    peakRating: "2804",
    avatar: "🌟",
    skillLevel: 19,
    moveTimeMs: 150,
    style: "fearless-aggressive",
    traits: ["Fearless attacks", "Rapid improvement", "Youth energy", "Creative play"],
    weaknesses: ["Inexperience in long matches", "Emotional volatility"],
    famousGames: [
      "vs Carlsen, Norway Chess (2022)",
      "Grand Swiss 2021 victory"
    ],
    quote: "I just play chess. I don't think about records."
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DIFFICULTY BOTS (for beginners and intermediate players)
  // ══════════════════════════════════════════════════════════════════════════

  beginner_bot: {
    id: "beginner_bot",
    label: "Friendly Beginner",
    subtitle: "Just Learning",
    description: "A beginner-level opponent who makes occasional mistakes. Perfect for new players to practice basic tactics and piece coordination.",
    era: "Bot",
    peakRating: "~800",
    avatar: "🐣",
    skillLevel: 3,
    moveTimeMs: 500,
    style: "random-basic",
    traits: ["Makes blunders", "Misses tactics", "Good for learning"],
    weaknesses: ["Everything"],
    famousGames: [],
    quote: "Let's have fun!"
  },

  intermediate_bot: {
    id: "intermediate_bot",
    label: "Club Player",
    subtitle: "Solid Amateur",
    description: "A solid club-level player. Knows basic openings, sees simple tactics, but can be outplayed positionally.",
    era: "Bot",
    peakRating: "~1400",
    avatar: "🎓",
    skillLevel: 8,
    moveTimeMs: 400,
    style: "solid-basic",
    traits: ["Sees basic tactics", "Knows openings", "Consistent"],
    weaknesses: ["Deep calculation", "Complex positions"],
    famousGames: [],
    quote: "Chess is a beautiful game."
  },

  advanced_bot: {
    id: "advanced_bot",
    label: "Tournament Player",
    subtitle: "Experienced Competitor",
    description: "A serious tournament player. Strong tactics, good opening knowledge, and solid endgames. Will punish mistakes quickly.",
    era: "Bot",
    peakRating: "~1800",
    avatar: "🏆",
    skillLevel: 12,
    moveTimeMs: 300,
    style: "tactical-sound",
    traits: ["Strong tactics", "Good openings", "Punishes errors"],
    weaknesses: ["Elite-level strategy", "Very deep calculation"],
    famousGames: [],
    quote: "Every game is a battle."
  },

  expert_bot: {
    id: "expert_bot",
    label: "Expert",
    subtitle: "Master Candidate",
    description: "Near-master strength. Excellent in all phases, makes very few mistakes. A real challenge for experienced players.",
    era: "Bot",
    peakRating: "~2200",
    avatar: "⭐",
    skillLevel: 15,
    moveTimeMs: 250,
    style: "universal-strong",
    traits: ["Few mistakes", "Strong all phases", "Dangerous"],
    weaknesses: ["Elite GM-level play"],
    famousGames: [],
    quote: "Show me what you've got."
  },

  master_bot: {
    id: "master_bot",
    label: "Master",
    subtitle: "Titled Player",
    description: "Master-level play. Deep calculation, excellent intuition, and will crush anything but perfect play. Good luck.",
    era: "Bot",
    peakRating: "~2400",
    avatar: "🎖️",
    skillLevel: 17,
    moveTimeMs: 200,
    style: "precise-deadly",
    traits: ["Deep calculation", "Excellent intuition", "Crushing attacks"],
    weaknesses: ["Super-GM preparation"],
    famousGames: [],
    quote: "Chess mastery takes a lifetime."
  },

  grandmaster_bot: {
    id: "grandmaster_bot",
    label: "Grandmaster",
    subtitle: "Elite Level",
    description: "Full Grandmaster strength. Stockfish at near-maximum power. This is what playing a top-10 player feels like. Bring your A-game.",
    era: "Bot",
    peakRating: "~2700",
    avatar: "♔",
    skillLevel: 20,
    moveTimeMs: 300,
    style: "perfect-crushing",
    traits: ["Near-perfect play", "Deep preparation", "No mercy"],
    weaknesses: ["None at human level"],
    famousGames: [],
    quote: "I am silicon. I do not tire."
  }
};

// ══════════════════════════════════════════════════════════════════════════
// EXPORTS & UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════

export const legendIds = [
  "morphy", "steinitz", "capablanca", "alekhine", "botvinnik",
  "tal", "petrosian", "fischer", "karpov", "kasparov", 
  "kramnik", "anand", "carlsen"
];

export const modernEliteIds = ["nakamura", "caruana", "firouzja"];

export const botIds = [
  "beginner_bot", "intermediate_bot", "advanced_bot", 
  "expert_bot", "master_bot", "grandmaster_bot"
];

export function getLegends() {
  return legendIds.map(id => personalities[id]);
}

export function getModernElite() {
  return modernEliteIds.map(id => personalities[id]);
}

export function getBots() {
  return botIds.map(id => personalities[id]);
}

export function getAllOpponents() {
  return [...getLegends(), ...getModernElite(), ...getBots()];
}

export function getOpponentsByDifficulty() {
  return {
    beginner: [personalities.beginner_bot, personalities.intermediate_bot],
    intermediate: [personalities.advanced_bot, personalities.expert_bot],
    advanced: [personalities.master_bot, personalities.grandmaster_bot],
    legends: getLegends(),
    modern: getModernElite()
  };
}
