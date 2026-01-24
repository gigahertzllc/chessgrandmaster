/**
 * Chess Platform Services
 * Handles Lichess and Chess.com API calls
 */

// Lichess API
export const searchLichessGames = async (username, maxGames = 20) => {
  const url = `https://lichess.org/api/games/user/${encodeURIComponent(username)}?max=${maxGames}&pgnInJson=true`;
  
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/x-ndjson" }
    });
    
    if (!res.ok) {
      if (res.status === 404) throw new Error('Player not found');
      throw new Error(`Lichess API error: ${res.status}`);
    }
    
    const text = await res.text();
    const games = text.trim().split("\n").filter(Boolean).map(line => {
      const g = JSON.parse(line);
      return {
        id: g.id,
        white: g.players?.white?.user?.name || "Anonymous",
        black: g.players?.black?.user?.name || "Anonymous",
        result: g.status === "draw" ? "½-½" : g.winner === "white" ? "1-0" : g.winner === "black" ? "0-1" : "*",
        date: new Date(g.createdAt).toLocaleDateString(),
        event: g.speed || "Game",
        pgn: g.pgn,
        url: `https://lichess.org/${g.id}`,
        source: 'lichess'
      };
    });
    
    return { success: true, games, count: games.length };
  } catch (e) {
    return { success: false, error: e.message, games: [] };
  }
};

// Chess.com API
export const searchChessComGames = async (username, maxGames = 20) => {
  try {
    // First get archives
    const archivesRes = await fetch(`https://api.chess.com/pub/player/${username.toLowerCase()}/games/archives`);
    
    if (!archivesRes.ok) {
      if (archivesRes.status === 404) throw new Error('Player not found');
      throw new Error(`Chess.com API error: ${archivesRes.status}`);
    }
    
    const { archives } = await archivesRes.json();
    
    if (!archives?.length) {
      return { success: true, games: [], count: 0 };
    }
    
    // Get latest month's games
    const latestRes = await fetch(archives[archives.length - 1]);
    if (!latestRes.ok) throw new Error('Failed to fetch games');
    
    const { games: monthGames } = await latestRes.json();
    
    const games = monthGames.slice(-maxGames).reverse().map(g => ({
      id: g.uuid,
      white: g.white?.username || "?",
      black: g.black?.username || "?",
      result: g.pgn?.includes("1-0") ? "1-0" : g.pgn?.includes("0-1") ? "0-1" : "½-½",
      date: new Date(g.end_time * 1000).toLocaleDateString(),
      event: g.time_class || "Game",
      pgn: g.pgn,
      url: g.url,
      source: 'chesscom'
    }));
    
    return { success: true, games, count: games.length };
  } catch (e) {
    return { success: false, error: e.message, games: [] };
  }
};

// Test if Lichess API is reachable
export const testLichessConnection = async () => {
  try {
    const res = await fetch('https://lichess.org/api/user/DrNykterstein', {
      headers: { Accept: 'application/json' }
    });
    return { success: res.ok, latency: 0 };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

// Test if Chess.com API is reachable
export const testChessComConnection = async () => {
  try {
    const res = await fetch('https://api.chess.com/pub/player/magnuscarlsen');
    return { success: res.ok, latency: 0 };
  } catch (e) {
    return { success: false, error: e.message };
  }
};
