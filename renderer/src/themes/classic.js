/**
 * Classic Theme System
 * 
 * Design Philosophy:
 * - Typography-first (Hillman Curtis)
 * - Editorial precision (Roger Black)  
 * - Timeless elegance (Chessmaster Grandmaster Edition)
 * 
 * NO EMOJIS. Clean iconography through typography and subtle symbols.
 */

// Typography System - Editorial hierarchy
export const typography = {
  // Display - for main titles
  display: {
    fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif',
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  },
  // Heading - for section headers
  heading: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  },
  // Body - for content
  body: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    weights: { regular: 400, medium: 500 }
  },
  // Mono - for moves and technical content
  mono: {
    fontFamily: '"SF Mono", "Consolas", "Monaco", monospace',
    weights: { regular: 400, medium: 500 }
  }
};

// Spacing scale (8px base)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

// Classic Dark Theme - Rich, sophisticated
export const classicDark = {
  id: "classic-dark",
  name: "Classic Dark",
  
  // Core palette
  colors: {
    // Backgrounds
    bg: "#0C0C0E",
    bgElevated: "#141416",
    bgSurface: "#1A1A1E",
    bgHover: "#222226",
    bgActive: "#2A2A2E",
    
    // Text
    textPrimary: "#F5F5F3",
    textSecondary: "#A8A8A6",
    textTertiary: "#6B6B69",
    textInverse: "#0C0C0E",
    
    // Accents
    accent: "#C9A227",  // Warm gold
    accentHover: "#D4AF37",
    accentMuted: "rgba(201, 162, 39, 0.15)",
    
    // Semantic
    success: "#3D8B40",
    error: "#C23B22",
    warning: "#C9A227",
    info: "#4A7B9D",
    
    // Borders
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.15)",
    borderAccent: "rgba(201, 162, 39, 0.4)",
    
    // Shadows
    shadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
    shadowStrong: "0 8px 32px rgba(0, 0, 0, 0.6)",
    shadowElevated: "0 16px 64px rgba(0, 0, 0, 0.8)"
  },
  
  // Component-specific
  components: {
    // Header
    header: {
      height: 64,
      bg: "rgba(12, 12, 14, 0.95)",
      borderColor: "rgba(255, 255, 255, 0.06)"
    },
    // Cards
    card: {
      bg: "#141416",
      bgHover: "#1A1A1E",
      borderRadius: 8
    },
    // Buttons
    button: {
      primary: {
        bg: "#C9A227",
        text: "#0C0C0E",
        hover: "#D4AF37"
      },
      secondary: {
        bg: "transparent",
        text: "#F5F5F3",
        border: "rgba(255, 255, 255, 0.2)",
        hover: "rgba(255, 255, 255, 0.08)"
      },
      ghost: {
        bg: "transparent",
        text: "#A8A8A6",
        hover: "rgba(255, 255, 255, 0.06)"
      }
    },
    // Navigation tabs
    tab: {
      inactive: "#6B6B69",
      active: "#F5F5F3",
      indicator: "#C9A227"
    }
  }
};

// Classic Light Theme - Clean, editorial
export const classicLight = {
  id: "classic-light",
  name: "Classic Light",
  
  colors: {
    // Backgrounds
    bg: "#FAFAF8",
    bgElevated: "#FFFFFF",
    bgSurface: "#F5F5F3",
    bgHover: "#EEEEEC",
    bgActive: "#E5E5E3",
    
    // Text
    textPrimary: "#1A1A1A",
    textSecondary: "#5C5C5A",
    textTertiary: "#8C8C8A",
    textInverse: "#FAFAF8",
    
    // Accents
    accent: "#8B5A2B",  // Warm brown
    accentHover: "#6B4423",
    accentMuted: "rgba(139, 90, 43, 0.1)",
    
    // Semantic
    success: "#2E7D32",
    error: "#C62828",
    warning: "#EF6C00",
    info: "#1565C0",
    
    // Borders
    border: "rgba(0, 0, 0, 0.08)",
    borderStrong: "rgba(0, 0, 0, 0.15)",
    borderAccent: "rgba(139, 90, 43, 0.3)",
    
    // Shadows
    shadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    shadowStrong: "0 8px 32px rgba(0, 0, 0, 0.12)",
    shadowElevated: "0 16px 64px rgba(0, 0, 0, 0.18)"
  },
  
  components: {
    header: {
      height: 64,
      bg: "rgba(250, 250, 248, 0.95)",
      borderColor: "rgba(0, 0, 0, 0.06)"
    },
    card: {
      bg: "#FFFFFF",
      bgHover: "#F5F5F3",
      borderRadius: 8
    },
    button: {
      primary: {
        bg: "#1A1A1A",
        text: "#FAFAF8",
        hover: "#333333"
      },
      secondary: {
        bg: "transparent",
        text: "#1A1A1A",
        border: "rgba(0, 0, 0, 0.2)",
        hover: "rgba(0, 0, 0, 0.05)"
      },
      ghost: {
        bg: "transparent",
        text: "#5C5C5A",
        hover: "rgba(0, 0, 0, 0.04)"
      }
    },
    tab: {
      inactive: "#8C8C8A",
      active: "#1A1A1A",
      indicator: "#8B5A2B"
    }
  }
};

// Icon characters (no emoji) - elegant Unicode symbols
export const icons = {
  // Navigation
  library: "◎",      // Library/collection
  play: "▶",         // Play
  learn: "△",        // Coach/learn
  focus: "◇",        // Zone/focus mode
  settings: "⚙",     // Settings
  
  // Chess
  king: "♔",
  queen: "♕", 
  rook: "♖",
  bishop: "♗",
  knight: "♘",
  pawn: "♙",
  
  // Actions
  close: "×",
  back: "←",
  forward: "→",
  up: "↑",
  down: "↓",
  check: "✓",
  plus: "+",
  minus: "−",
  search: "⌕",
  menu: "≡",
  
  // Status
  success: "●",
  error: "●",
  warning: "●",
  info: "●",
  
  // Misc
  star: "★",
  starEmpty: "☆",
  heart: "♥",
  flame: "◆",
  trophy: "◈",
  book: "▤",
  folder: "▢",
  user: "○",
  clock: "◔"
};

// Sources without emojis
export const sourceLabels = {
  classics: { name: "Classics", icon: icons.trophy },
  masters: { name: "Masters", icon: icons.star },
  lichess: { name: "Lichess", icon: icons.knight },
  chesscom: { name: "Chess.com", icon: icons.pawn },
  imported: { name: "My Games", icon: icons.folder }
};

// Navigation items
export const navItems = [
  { id: "library", label: "Library", icon: icons.library },
  { id: "play", label: "Play", icon: icons.play },
  { id: "coach", label: "Learn", icon: icons.learn },
  { id: "zone", label: "Focus", icon: icons.focus }
];

// Convert classic theme to legacy format for backward compatibility
export function classicToLegacy(classic) {
  return {
    id: classic.id,
    name: classic.name,
    bg: classic.colors.bg,
    bgAlt: classic.colors.bgSurface,
    card: classic.colors.bgElevated,
    cardHover: classic.colors.bgHover,
    ink: classic.colors.textPrimary,
    inkMuted: classic.colors.textSecondary,
    inkFaint: classic.colors.textTertiary,
    accent: classic.colors.accent,
    accentSoft: classic.colors.accentMuted,
    success: classic.colors.success,
    error: classic.colors.error,
    border: classic.colors.border,
    borderStrong: classic.colors.borderStrong,
    shadow: classic.colors.shadow,
    shadowStrong: classic.colors.shadowStrong
  };
}

export default {
  typography,
  spacing,
  classicDark,
  classicLight,
  icons,
  sourceLabels,
  navItems,
  classicToLegacy
};
