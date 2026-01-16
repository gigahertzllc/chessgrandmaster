export const PIECE_SETS = {
  classic_ebony_ivory: {
    id: "classic_ebony_ivory",
    name: "Classic Ebony & Ivory (Gloss)",
    white: { color: 0xf2efe7, roughness: 0.32, metalness: 0.08, clearcoat: 0.6, clearcoatRoughness: 0.2 },
    black: { color: 0x121212, roughness: 0.35, metalness: 0.12, clearcoat: 0.7, clearcoatRoughness: 0.2 },
    accent: { color: 0xd4af37, roughness: 0.25, metalness: 0.7 }
  },
  modern_matte: {
    id: "modern_matte",
    name: "Modern Matte (High Readability)",
    white: { color: 0xf5f5f5, roughness: 0.8, metalness: 0.05, clearcoat: 0.0, clearcoatRoughness: 1.0 },
    black: { color: 0x1b1b1b, roughness: 0.85, metalness: 0.05, clearcoat: 0.0, clearcoatRoughness: 1.0 },
    accent: { color: 0xb7b7b7, roughness: 0.7, metalness: 0.2 }
  },
  gold_vs_onyx: {
    id: "gold_vs_onyx",
    name: "Gold vs Onyx (Luxury)",
    white: { color: 0xd4af37, roughness: 0.25, metalness: 0.95, clearcoat: 0.3, clearcoatRoughness: 0.25 },
    black: { color: 0x0a0a0a, roughness: 0.2, metalness: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.2 },
    accent: { color: 0xffffff, roughness: 0.5, metalness: 0.2 }
  },
  glass_frost: {
    id: "glass_frost",
    name: "Frosted Glass (Subtle)",
    white: { color: 0xffffff, roughness: 0.35, metalness: 0.0, transmission: 0.65, thickness: 0.7, ior: 1.45, clearcoat: 0.1, clearcoatRoughness: 0.35 },
    black: { color: 0x202020, roughness: 0.35, metalness: 0.0, transmission: 0.35, thickness: 0.7, ior: 1.5, clearcoat: 0.1, clearcoatRoughness: 0.35 },
    accent: { color: 0xd4af37, roughness: 0.25, metalness: 0.7 }
  }
};

export function listPieceSets() {
  return Object.values(PIECE_SETS).map(s => ({ id: s.id, name: s.name }));
}

export function getPieceSet(id) {
  return PIECE_SETS[id] || PIECE_SETS.classic_ebony_ivory;
}
