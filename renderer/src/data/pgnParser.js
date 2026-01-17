/**
 * PGN Parser Utility
 * Parse PGN files into game objects for the library
 */

import { PLAYERS } from './playerInfo.js';

/**
 * Parse a PGN string into an array of game objects
 * @param {string} pgnString - Raw PGN content
 * @param {number} limit - Maximum games to parse (0 = all)
 */
export function parsePGN(pgnString, limit = 0) {
  const games = [];
  
  // Normalize line endings
  const normalized = pgnString.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split into individual games - handle various PGN formats
  // Games are separated by blank lines between the result and next [Event
  const gameStrings = normalized.split(/\n\s*\n(?=\[Event\s)/);
  
  const maxGames = limit > 0 ? Math.min(limit, gameStrings.length) : gameStrings.length;
  
  for (let i = 0; i < maxGames; i++) {
    const gameStr = gameStrings[i];
    if (!gameStr.trim()) continue;
    
    const game = parseGame(gameStr.trim(), i);
    if (game) games.push(game);
  }
  
  return games;
}

/**
 * Parse a single game string
 */
function parseGame(gameStr, index = 0) {
  const headers = {};
  const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
  let match;
  
  while ((match = headerRegex.exec(gameStr)) !== null) {
    headers[match[1]] = match[2];
  }
  
  // Extract moves section (everything after the last header)
  // Find the position after the last ] that's followed by the moves
  let movesStartIndex = 0;
  const lastBracketMatch = gameStr.match(/\]\s*\n/g);
  if (lastBracketMatch) {
    // Find the last occurrence
    let lastIndex = 0;
    let searchStr = gameStr;
    for (const m of lastBracketMatch) {
      const idx = searchStr.indexOf(m);
      lastIndex += idx + m.length;
      searchStr = searchStr.slice(idx + m.length);
    }
    movesStartIndex = lastIndex;
  }
  
  let movesSection = gameStr.slice(movesStartIndex).trim();
  
  // Clean up moves for display - remove comments and variations
  let cleanMoves = movesSection
    .replace(/\{[^}]*\}/g, '')      // Remove { } comments
    .replace(/;[^\n]*/g, '')        // Remove ; comments
    .replace(/\([^)]*\)/g, '')      // Remove variations (simple)
    .replace(/\$\d+/g, '')          // Remove NAGs like $1 $2
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .trim();
  
  if (!headers.White || !headers.Black) return null;
  
  const category = inferCategory(headers.White, headers.Black);
  
  // Build a proper PGN string that chess.js can parse
  // chess.js needs the moves in a format it can understand
  const fullPgn = buildPGN(headers, cleanMoves);
  
  return {
    id: generateId(headers, index),
    white: headers.White,
    black: headers.Black,
    result: headers.Result || "*",
    year: headers.Date ? parseInt(headers.Date.split('.')[0]) : null,
    date: headers.Date || null,
    event: headers.Event || "Unknown",
    site: headers.Site || "",
    round: headers.Round || "",
    eco: headers.ECO || "",
    whiteElo: headers.WhiteElo || "",
    blackElo: headers.BlackElo || "",
    title: `${headers.White} vs ${headers.Black}`,
    description: generateDescription(headers),
    pgn: fullPgn,  // Store full PGN for chess.js
    moves: cleanMoves, // Store clean moves for display
    category: category
  };
}

/**
 * Build a complete PGN string from headers and moves
 */
function buildPGN(headers, moves) {
  const lines = [];
  
  // Add essential headers
  const essentialHeaders = ['Event', 'Site', 'Date', 'Round', 'White', 'Black', 'Result'];
  for (const h of essentialHeaders) {
    lines.push(`[${h} "${headers[h] || '?'}"]`);
  }
  
  // Add optional headers if present
  const optionalHeaders = ['WhiteElo', 'BlackElo', 'ECO', 'Opening'];
  for (const h of optionalHeaders) {
    if (headers[h]) {
      lines.push(`[${h} "${headers[h]}"]`);
    }
  }
  
  // Add blank line and moves
  lines.push('');
  lines.push(moves);
  
  return lines.join('\n');
}

/**
 * Generate a unique ID for a game
 */
function generateId(headers, index = 0) {
  const white = (headers.White || "").toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
  const black = (headers.Black || "").toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
  const date = (headers.Date || "").replace(/\./g, '').replace(/\?/g, '');
  const round = (headers.Round || "").replace(/[^0-9]/g, '');
  const event = (headers.Event || "").toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  return `${white}-${black}-${event}-${date}-${round || index}`;
}

/**
 * Generate a description from headers
 */
function generateDescription(headers) {
  const parts = [];
  if (headers.Event && headers.Event !== "?") parts.push(headers.Event);
  if (headers.Site && headers.Site !== "?") parts.push(headers.Site);
  if (headers.Date && headers.Date !== "????.??.??") {
    const year = headers.Date.split('.')[0];
    if (year !== "????") parts.push(year);
  }
  if (headers.ECO) parts.push(`ECO: ${headers.ECO}`);
  return parts.join(" • ") || "Chess game";
}

/**
 * Infer category from player names
 */
function inferCategory(white, black) {
  const players = [white, black].join(' ').toLowerCase();
  
  if (players.includes('morphy')) return 'morphy';
  if (players.includes('fischer')) return 'fischer';
  if (players.includes('carlsen')) return 'carlsen';
  if (players.includes('kasparov')) return 'kasparov';
  if (players.includes('tal')) return 'tal';
  if (players.includes('capablanca')) return 'capablanca';
  if (players.includes('alekhine')) return 'alekhine';
  if (players.includes('anand')) return 'anand';
  if (players.includes('kramnik')) return 'kramnik';
  if (players.includes('karpov')) return 'karpov';
  if (players.includes('steinitz')) return 'steinitz';
  if (players.includes('lasker')) return 'lasker';
  if (players.includes('caruana')) return 'caruana';
  if (players.includes('ding')) return 'ding';
  
  return 'modern';
}

/**
 * Load PGN file from URL
 */
export async function loadPGNFromURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const text = await response.text();
    return parsePGN(text);
  } catch (error) {
    console.error('Error loading PGN:', error);
    return [];
  }
}

/**
 * Master PGN collections - links to player info
 */
export const MASTER_COLLECTIONS = {
  carlsen: {
    ...PLAYERS.carlsen,
    file: "/pgn/carlsen.pgn"
  },
  fischer: {
    ...PLAYERS.fischer,
    file: "/pgn/Fischer.pgn"
  },
  morphy: {
    ...PLAYERS.morphy,
    file: "/pgn/morphy.pgn"
  }
};

/**
 * Count games in a PGN string without fully parsing
 */
export function countGames(pgnString) {
  return (pgnString.match(/\[Event\s+"/g) || []).length;
}

/**
 * Get summary of a PGN file
 */
export async function getPGNSummary(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const text = await response.text();
    
    const gameCount = countGames(text);
    const firstGames = parsePGN(text, 5); // Parse first 5 for preview
    
    return {
      totalGames: gameCount,
      preview: firstGames,
      loaded: true
    };
  } catch (error) {
    console.error('Error getting PGN summary:', error);
    return { totalGames: 0, preview: [], loaded: false, error: error.message };
  }
}
