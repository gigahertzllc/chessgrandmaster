export const BOARD_THEMES = {
  carrara_gold: {
    id: "carrara_gold",
    name: "Carrara Marble + Ebony + Gold Trim",
    light: "#f6f3ee",
    dark: "#3c3c3c",
    frame: "#2a2a2a",
    accent: "rgba(212,175,55,0.85)"
  },
  nero_pearl_inlay: {
    id: "nero_pearl_inlay",
    name: "Nero Marble + Pearl + Gold Inlay",
    light: "#f3f1ec",
    dark: "#1f1f1f",
    frame: "#141414",
    accent: "rgba(212,175,55,0.8)"
  },
  onyx_champagne: {
    id: "onyx_champagne",
    name: "Onyx Glass + Champagne Gold",
    light: "#f2f2f2",
    dark: "#2a2a2f",
    frame: "#202024",
    accent: "rgba(200,164,111,0.85)"
  },
  marble_walnut_plate: {
    id: "marble_walnut_plate",
    name: "White Marble + Walnut + Gold Plate",
    light: "#f5f4f0",
    dark: "#7b5a43",
    frame: "#5a3f2f",
    accent: "rgba(212,175,55,0.8)"
  },
  travertine_gold_coords: {
    id: "travertine_gold_coords",
    name: "Travertine + Black Marble + Gold Coordinates",
    light: "#e8dfd0",
    dark: "#2b2b2b",
    frame: "#1e1e1e",
    accent: "rgba(212,175,55,0.85)"
  },
  slate_alabaster_corners: {
    id: "slate_alabaster_corners",
    name: "Slate + Alabaster + Subtle Gold Corners",
    light: "#f0efe9",
    dark: "#4c5961",
    frame: "#3a454b",
    accent: "rgba(212,175,55,0.75)"
  },
  pearl_charcoal_rose: {
    id: "pearl_charcoal_rose",
    name: "Pearl + Charcoal + Rose Gold Frame",
    light: "#f5f3f1",
    dark: "#3d3d3d",
    frame: "#2b2b2b",
    accent: "rgba(196,137,135,0.85)"
  },
  verde_ivy_goldline: {
    id: "verde_ivy_goldline",
    name: "Verde Marble + Ivory + Gold Accent Line",
    light: "#f2efe7",
    dark: "#2c5d4c",
    frame: "#214337",
    accent: "rgba(212,175,55,0.85)"
  },
  tournament_luxe: {
    id: "tournament_luxe",
    name: "Tournament Luxe (Flat + Gold UI Accents)",
    light: "#eee9e2",
    dark: "#6c6a66",
    frame: "#1e1e1e",
    accent: "rgba(212,175,55,0.9)"
  },
  mono_marble_states: {
    id: "mono_marble_states",
    name: "Monochrome Marble + Gold State Highlights",
    light: "#efefef",
    dark: "#cfcfcf",
    frame: "#2a2a2a",
    accent: "rgba(212,175,55,0.9)"
  }
};

export function listBoardThemes() {
  return Object.values(BOARD_THEMES).map(t => ({ id: t.id, name: t.name }));
}

export function getBoardTheme(id) {
  return BOARD_THEMES[id] || BOARD_THEMES.carrara_gold;
}
