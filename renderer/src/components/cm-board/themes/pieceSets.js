/**
 * 3D Piece Sets - Materials and Geometry Styles
 * 
 * Each set has:
 * - Material properties (color, roughness, metalness, etc.)
 * - Geometry style reference (determines piece shape profiles)
 */

// ═══════════════════════════════════════════════════════════════════════════
// PIECE GEOMETRY PROFILES - Different chess piece shapes
// ═══════════════════════════════════════════════════════════════════════════

// Profile format: array of [radius, height] points for LatheGeometry
export const PIECE_GEOMETRY_STYLES = {
  
  // Classic Staunton - Traditional tournament style
  staunton: {
    id: "staunton",
    name: "Staunton Classic",
    scale: 0.72,
    profiles: {
      p: [[0.0,0.0],[0.42,0.0],[0.40,0.08],[0.28,0.16],[0.30,0.42],[0.22,0.56],[0.26,0.68],[0.20,0.82],[0.0,0.82]],
      r: [[0.0,0.0],[0.48,0.0],[0.45,0.10],[0.32,0.18],[0.35,0.52],[0.30,0.78],[0.34,0.86],[0.38,0.94],[0.32,0.98],[0.0,0.98]],
      n: [[0.0,0.0],[0.48,0.0],[0.44,0.10],[0.30,0.18],[0.33,0.54],[0.26,0.78],[0.30,0.94],[0.22,1.06],[0.0,1.06]],
      b: [[0.0,0.0],[0.48,0.0],[0.44,0.10],[0.30,0.18],[0.33,0.58],[0.24,0.82],[0.28,1.00],[0.16,1.18],[0.08,1.24],[0.0,1.24]],
      q: [[0.0,0.0],[0.50,0.0],[0.46,0.10],[0.30,0.20],[0.35,0.64],[0.28,0.92],[0.32,1.12],[0.20,1.34],[0.12,1.40],[0.0,1.40]],
      k: [[0.0,0.0],[0.52,0.0],[0.48,0.12],[0.32,0.22],[0.38,0.68],[0.32,0.98],[0.38,1.20],[0.28,1.44],[0.10,1.52],[0.0,1.52]]
    }
  },

  // Modern Minimalist - Clean, simplified shapes
  modern: {
    id: "modern",
    name: "Modern Minimal",
    scale: 0.70,
    profiles: {
      p: [[0.0,0.0],[0.35,0.0],[0.35,0.05],[0.28,0.10],[0.28,0.50],[0.22,0.55],[0.22,0.75],[0.0,0.75]],
      r: [[0.0,0.0],[0.40,0.0],[0.40,0.08],[0.32,0.12],[0.32,0.70],[0.38,0.75],[0.38,0.90],[0.30,0.90],[0.0,0.90]],
      n: [[0.0,0.0],[0.40,0.0],[0.40,0.08],[0.30,0.12],[0.30,0.65],[0.24,0.70],[0.28,0.90],[0.18,1.00],[0.0,1.00]],
      b: [[0.0,0.0],[0.40,0.0],[0.40,0.08],[0.30,0.12],[0.30,0.70],[0.22,0.80],[0.24,1.00],[0.12,1.15],[0.0,1.15]],
      q: [[0.0,0.0],[0.42,0.0],[0.42,0.08],[0.30,0.14],[0.30,0.80],[0.24,0.90],[0.28,1.15],[0.16,1.32],[0.0,1.32]],
      k: [[0.0,0.0],[0.44,0.0],[0.44,0.10],[0.32,0.16],[0.32,0.85],[0.26,0.95],[0.30,1.20],[0.20,1.40],[0.08,1.48],[0.0,1.48]]
    }
  },

  // Baroque - Ornate, curved shapes
  baroque: {
    id: "baroque",
    name: "Baroque Ornate",
    scale: 0.68,
    profiles: {
      p: [[0.0,0.0],[0.44,0.0],[0.46,0.06],[0.38,0.14],[0.32,0.20],[0.34,0.36],[0.28,0.48],[0.32,0.58],[0.26,0.70],[0.30,0.78],[0.22,0.88],[0.0,0.88]],
      r: [[0.0,0.0],[0.52,0.0],[0.54,0.08],[0.44,0.18],[0.36,0.26],[0.40,0.50],[0.34,0.70],[0.38,0.82],[0.44,0.90],[0.40,0.98],[0.0,0.98]],
      n: [[0.0,0.0],[0.52,0.0],[0.54,0.08],[0.42,0.18],[0.34,0.28],[0.38,0.52],[0.30,0.74],[0.34,0.88],[0.26,1.02],[0.30,1.10],[0.20,1.18],[0.0,1.18]],
      b: [[0.0,0.0],[0.52,0.0],[0.54,0.08],[0.42,0.18],[0.34,0.28],[0.38,0.56],[0.28,0.78],[0.32,0.94],[0.22,1.12],[0.26,1.22],[0.14,1.34],[0.0,1.34]],
      q: [[0.0,0.0],[0.56,0.0],[0.58,0.10],[0.44,0.22],[0.36,0.32],[0.42,0.62],[0.32,0.88],[0.38,1.06],[0.28,1.26],[0.34,1.38],[0.20,1.52],[0.0,1.52]],
      k: [[0.0,0.0],[0.58,0.0],[0.60,0.12],[0.46,0.24],[0.38,0.34],[0.44,0.68],[0.36,0.96],[0.42,1.16],[0.32,1.38],[0.38,1.50],[0.24,1.64],[0.12,1.72],[0.0,1.72]]
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PIECE MATERIAL SETS
// ═══════════════════════════════════════════════════════════════════════════

export const PIECE_SETS = {
  classic_ebony_ivory: {
    id: "classic_ebony_ivory",
    name: "Ebony & Ivory",
    geometryStyle: "staunton",
    white: { color: 0xf2efe7, roughness: 0.32, metalness: 0.08, clearcoat: 0.6, clearcoatRoughness: 0.2 },
    black: { color: 0x1a1a1a, roughness: 0.35, metalness: 0.12, clearcoat: 0.7, clearcoatRoughness: 0.2 },
    accent: { color: 0xd4af37, roughness: 0.25, metalness: 0.7 }
  },
  
  modern_matte: {
    id: "modern_matte",
    name: "Modern Matte",
    geometryStyle: "modern",
    white: { color: 0xfafafa, roughness: 0.85, metalness: 0.02, clearcoat: 0.0 },
    black: { color: 0x1c1c1c, roughness: 0.88, metalness: 0.02, clearcoat: 0.0 },
    accent: { color: 0xb7b7b7, roughness: 0.7, metalness: 0.2 }
  },
  
  wood_rosewood: {
    id: "wood_rosewood",
    name: "Boxwood & Rosewood",
    geometryStyle: "staunton",
    white: { color: 0xe8d4a8, roughness: 0.65, metalness: 0.0, clearcoat: 0.3, clearcoatRoughness: 0.4 },
    black: { color: 0x4a2c2a, roughness: 0.60, metalness: 0.0, clearcoat: 0.35, clearcoatRoughness: 0.35 },
    accent: { color: 0x8b7355, roughness: 0.5, metalness: 0.1 }
  },
  
  marble_classic: {
    id: "marble_classic",
    name: "White & Black Marble",
    geometryStyle: "baroque",
    white: { color: 0xf5f5f0, roughness: 0.25, metalness: 0.0, clearcoat: 0.8, clearcoatRoughness: 0.15 },
    black: { color: 0x1a1a1a, roughness: 0.20, metalness: 0.05, clearcoat: 0.85, clearcoatRoughness: 0.1 },
    accent: { color: 0xb8b8b8, roughness: 0.3, metalness: 0.1 }
  },
  
  gold_silver: {
    id: "gold_silver",
    name: "Gold & Silver",
    geometryStyle: "baroque",
    white: { color: 0xd4af37, roughness: 0.22, metalness: 0.95, clearcoat: 0.4, clearcoatRoughness: 0.2 },
    black: { color: 0xc0c0c0, roughness: 0.25, metalness: 0.92, clearcoat: 0.35, clearcoatRoughness: 0.25 },
    accent: { color: 0xffffff, roughness: 0.5, metalness: 0.2 }
  },
  
  jade_obsidian: {
    id: "jade_obsidian",
    name: "Jade & Obsidian",
    geometryStyle: "modern",
    white: { color: 0x00a86b, roughness: 0.30, metalness: 0.0, clearcoat: 0.7, clearcoatRoughness: 0.2, transmission: 0.15, thickness: 0.5 },
    black: { color: 0x0a0a0a, roughness: 0.15, metalness: 0.1, clearcoat: 0.9, clearcoatRoughness: 0.1 },
    accent: { color: 0xd4af37, roughness: 0.25, metalness: 0.7 }
  },
  
  glass_crystal: {
    id: "glass_crystal",
    name: "Crystal Glass",
    geometryStyle: "modern",
    white: { color: 0xffffff, roughness: 0.08, metalness: 0.0, transmission: 0.92, thickness: 0.8, ior: 1.52, clearcoat: 0.1 },
    black: { color: 0x1a1a2e, roughness: 0.10, metalness: 0.0, transmission: 0.75, thickness: 0.8, ior: 1.5, clearcoat: 0.15 },
    accent: { color: 0xffffff, roughness: 0.1, metalness: 0.0 }
  }
};

export function listPieceSets() {
  return Object.values(PIECE_SETS).map(s => ({ id: s.id, name: s.name }));
}

export function getPieceSet(id) {
  return PIECE_SETS[id] || PIECE_SETS.classic_ebony_ivory;
}

export function getGeometryStyle(id) {
  return PIECE_GEOMETRY_STYLES[id] || PIECE_GEOMETRY_STYLES.staunton;
}

export function listGeometryStyles() {
  return Object.values(PIECE_GEOMETRY_STYLES).map(s => ({ id: s.id, name: s.name }));
}
