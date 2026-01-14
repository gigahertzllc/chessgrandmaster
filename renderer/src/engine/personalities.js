export const personalities = {
  gm_tactician: {
    id: "gm_tactician",
    label: "GM Tactician",
    subtitle: "Aggressive Attacker",
    description: "Seeks sharp positions with tactical complications. Will sacrifice material for initiative.",
    era: "Modern",
    rating: "2650",
    avatar: "⚔️",
    skillLevel: 18,
    moveTimeMs: 150,
    topMoves: 2,
    randomness: 0.15,
    preferredOpenings: ["e4", "d4"],
    style: "aggressive"
  },
  gm_positional: {
    id: "gm_positional",
    label: "GM Positional",
    subtitle: "Strategic Grinder",
    description: "Plays for small advantages and squeezes opponents in long endgames. Patience personified.",
    era: "Modern",
    rating: "2620",
    avatar: "🏰",
    skillLevel: 17,
    moveTimeMs: 200,
    topMoves: 2,
    randomness: 0.10,
    preferredOpenings: ["d4", "Nf3", "c4"],
    style: "positional"
  },
  gm_trickster: {
    id: "gm_trickster",
    label: "GM Trickster",
    subtitle: "Opening Trap Specialist",
    description: "Loves gambits and opening traps. Will trade a worse position for complications.",
    era: "Modern",
    rating: "2580",
    avatar: "🎭",
    skillLevel: 16,
    moveTimeMs: 140,
    topMoves: 4,
    randomness: 0.25,
    preferredOpenings: ["e4", "f4", "b4"],
    style: "tricky"
  },
  morphy: {
    id: "morphy",
    label: "Paul Morphy",
    subtitle: "The Pride of New Orleans",
    description: "The romantic chess genius. Rapid development, open lines, and devastating attacks on the king. Dominated the 1850s like no one before.",
    era: "1837-1884",
    rating: "~2700 (est.)",
    avatar: "👑",
    skillLevel: 15,
    moveTimeMs: 120,
    topMoves: 4,
    randomness: 0.25,
    preferredOpenings: ["e4"],
    style: "romantic",
    famousGames: [
      "Opera Game vs Duke of Brunswick (1858)",
      "vs Louis Paulsen, NYC (1857)"
    ],
    quote: "Help your pieces so they can help you."
  },
  fischer: {
    id: "fischer",
    label: "Bobby Fischer",
    subtitle: "The American Champion",
    description: "Precision and preparation. Perfect openings, relentless technique, and uncompromising will to win. The man who conquered the Soviet chess machine.",
    era: "1943-2008",
    rating: "2785",
    avatar: "🦅",
    skillLevel: 18,
    moveTimeMs: 220,
    topMoves: 3,
    randomness: 0.12,
    preferredOpenings: ["e4", "c4"],
    style: "universal",
    famousGames: [
      "Game of the Century vs D. Byrne (1956)",
      "Game 6 vs Spassky, Reykjavik (1972)"
    ],
    quote: "I don't believe in psychology. I believe in good moves."
  },
  carlsen: {
    id: "carlsen",
    label: "Magnus Carlsen",
    subtitle: "The World Champion",
    description: "The Mozart of chess. Plays all positions, grinds forever, finds resources where none exist. The highest-rated player in history.",
    era: "1990-present",
    rating: "2882 (peak)",
    avatar: "🧊",
    skillLevel: 20,
    moveTimeMs: 280,
    topMoves: 2,
    randomness: 0.08,
    preferredOpenings: ["e4", "d4", "Nf3", "c4"],
    style: "universal",
    famousGames: [
      "vs Anand, Chennai WCC Game 5 (2013)",
      "vs Caruana, London WCC Tiebreaks (2018)"
    ],
    quote: "Some people think that if their opponent plays a beautiful game, it's OK to lose. I don't."
  }
};

export const legendIds = ["morphy", "fischer", "carlsen"];
export const gmBotIds = ["gm_tactician", "gm_positional", "gm_trickster"];

export function getLegends() {
  return legendIds.map(id => personalities[id]);
}

export function getGmBots() {
  return gmBotIds.map(id => personalities[id]);
}

export function getAllGrandmasterOpponents() {
  return [...getLegends(), ...getGmBots()];
}
