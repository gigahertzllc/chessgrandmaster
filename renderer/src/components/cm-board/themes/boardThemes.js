/**
 * Board Themes - Premium chess board styles
 * Designed for piece visibility (light squares light enough for black pieces,
 * dark squares not too dark for black pieces to blend in)
 */

export const BOARD_THEMES = {
  // Classic wood themes - high contrast
  classic_wood: {
    id: "classic_wood",
    name: "Classic Wood",
    light: "#f0d9b5",
    dark: "#b58863",
    frame: "#5d4037",
    accent: "rgba(212,175,55,0.85)",
    pattern: null
  },
  
  walnut_maple: {
    id: "walnut_maple",
    name: "Walnut & Maple",
    light: "#f5e6c8",
    dark: "#9e7a5a",
    frame: "#5c4030",
    accent: "rgba(212,175,55,0.8)",
    pattern: null
  },
  
  rosewood_ivory: {
    id: "rosewood_ivory",
    name: "Rosewood & Ivory",
    light: "#fffef0",
    dark: "#8b4513",
    frame: "#4a2511",
    accent: "rgba(212,175,55,0.85)",
    pattern: null
  },

  // Marble themes - with CSS texture patterns
  carrara_green: {
    id: "carrara_green",
    name: "Carrara & Green Marble",
    light: "#f5f5f0",
    dark: "#5d8a66",
    frame: "#2a4a30",
    accent: "rgba(212,175,55,0.85)",
    pattern: "marble",
    lightTexture: `
      linear-gradient(135deg, rgba(200,200,195,0.1) 0%, transparent 50%, rgba(200,200,195,0.1) 100%),
      linear-gradient(45deg, rgba(180,180,175,0.08) 25%, transparent 25%, transparent 75%, rgba(180,180,175,0.08) 75%)
    `,
    darkTexture: `
      linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.08) 100%),
      linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%)
    `
  },
  
  nero_pearl: {
    id: "nero_pearl",
    name: "Nero & Pearl Marble",
    light: "#f8f6f2",
    dark: "#4a4a52",
    frame: "#2a2a30",
    accent: "rgba(212,175,55,0.8)",
    pattern: "marble",
    lightTexture: `
      linear-gradient(135deg, rgba(200,195,190,0.12) 0%, transparent 50%, rgba(200,195,190,0.12) 100%)
    `,
    darkTexture: `
      linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)
    `
  },

  white_blue_marble: {
    id: "white_blue_marble",
    name: "White & Blue Marble",
    light: "#f0f4f8",
    dark: "#4a6a8a",
    frame: "#2a3a4a",
    accent: "rgba(212,175,55,0.85)",
    pattern: "marble",
    lightTexture: `
      linear-gradient(135deg, rgba(180,190,200,0.1) 0%, transparent 50%, rgba(180,190,200,0.1) 100%)
    `,
    darkTexture: `
      linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.12) 100%)
    `
  },

  travertine_brown: {
    id: "travertine_brown",
    name: "Travertine & Brown",
    light: "#e8dfd0",
    dark: "#7a5a40",
    frame: "#4a3020",
    accent: "rgba(212,175,55,0.85)",
    pattern: "marble",
    lightTexture: `
      linear-gradient(135deg, rgba(160,150,130,0.1) 0%, transparent 50%, rgba(160,150,130,0.1) 100%)
    `,
    darkTexture: `
      linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)
    `
  },

  // Tournament/Modern themes
  tournament_green: {
    id: "tournament_green",
    name: "Tournament Green",
    light: "#eeeed2",
    dark: "#769656",
    frame: "#4a5a3a",
    accent: "rgba(212,175,55,0.9)",
    pattern: null
  },
  
  lichess_brown: {
    id: "lichess_brown",
    name: "Lichess Brown",
    light: "#f0d9b5",
    dark: "#b58863",
    frame: "#8b6914",
    accent: "rgba(100,150,200,0.8)",
    pattern: null
  },

  chess_com_green: {
    id: "chess_com_green",
    name: "Chess.com Green",
    light: "#ebecd0",
    dark: "#779556",
    frame: "#312e2b",
    accent: "rgba(255,205,0,0.8)",
    pattern: null
  },

  // Slate/Stone themes
  slate_alabaster: {
    id: "slate_alabaster",
    name: "Slate & Alabaster",
    light: "#f0efe9",
    dark: "#5c6a72",
    frame: "#3a454b",
    accent: "rgba(212,175,55,0.75)",
    pattern: "stone",
    lightTexture: `
      linear-gradient(135deg, rgba(180,175,165,0.08) 0%, transparent 50%, rgba(180,175,165,0.08) 100%)
    `,
    darkTexture: `
      linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)
    `
  },

  // High contrast themes for visibility
  ice_obsidian: {
    id: "ice_obsidian",
    name: "Ice & Obsidian",
    light: "#e8f4f8",
    dark: "#3a3a4a",
    frame: "#1a1a2a",
    accent: "rgba(100,200,255,0.8)",
    pattern: "glass",
    lightTexture: `
      linear-gradient(135deg, rgba(200,220,240,0.15) 0%, transparent 50%, rgba(200,220,240,0.15) 100%)
    `,
    darkTexture: `
      linear-gradient(135deg, rgba(100,100,150,0.15) 0%, transparent 50%, rgba(100,100,150,0.15) 100%)
    `
  },

  coral_cream: {
    id: "coral_cream",
    name: "Coral & Cream",
    light: "#fff8f0",
    dark: "#c97a6a",
    frame: "#8a4a3a",
    accent: "rgba(212,175,55,0.85)",
    pattern: null
  },

  // Luxury themes
  gold_ebony: {
    id: "gold_ebony",
    name: "Gold & Ebony",
    light: "#f5e8c8",
    dark: "#3a3532",
    frame: "#1a1815",
    accent: "rgba(212,175,55,1)",
    pattern: "luxury",
    lightTexture: `
      linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 50%, rgba(212,175,55,0.08) 100%)
    `,
    darkTexture: `
      linear-gradient(135deg, rgba(212,175,55,0.12) 0%, transparent 50%, rgba(212,175,55,0.12) 100%)
    `
  },

  purple_silver: {
    id: "purple_silver",
    name: "Purple & Silver",
    light: "#f0f0f5",
    dark: "#6a5a7a",
    frame: "#3a2a4a",
    accent: "rgba(192,192,210,0.9)",
    pattern: null
  }
};

export function listBoardThemes() {
  return Object.values(BOARD_THEMES).map(t => ({ id: t.id, name: t.name }));
}

export function getBoardTheme(id) {
  return BOARD_THEMES[id] || BOARD_THEMES.classic_wood;
}

/**
 * Get CSS background for a square
 */
export function getSquareBackground(theme, isDark) {
  const baseColor = isDark ? theme.dark : theme.light;
  const texture = isDark ? theme.darkTexture : theme.lightTexture;
  
  if (texture) {
    return `${texture}, ${baseColor}`;
  }
  return baseColor;
}
