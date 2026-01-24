/**
 * useGames Hook
 * Handles all game-related functionality:
 * - Loading games from various sources
 * - Game selection and viewing
 * - Move navigation
 * - PGN parsing
 */

import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { searchLichessGames, searchChessComGames } from '../services/chessServices.js';
import { FAMOUS_GAMES, GAME_CATEGORIES, getGamesByCategory, searchGames } from '../data/famousGames.js';
import { parsePGN } from '../data/pgnParser.js';

export function useGames() {
  // Game list state
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  
  // Game viewer state
  const [selectedGame, setSelectedGame] = useState(null);
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(new Chess().fen());
  const [moveIndex, setMoveIndex] = useState(0);
  const [moves, setMoves] = useState([]);
  const [orientation, setOrientation] = useState('w');

  // Search Lichess games
  const searchLichess = useCallback(async (username) => {
    if (!username?.trim()) return;
    
    setLoading(true);
    setError(null);
    setGames([]);
    
    const result = await searchLichessGames(username);
    
    if (result.success) {
      setGames(result.games);
      setCurrentPlayer(username);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  // Search Chess.com games
  const searchChessCom = useCallback(async (username) => {
    if (!username?.trim()) return;
    
    setLoading(true);
    setError(null);
    setGames([]);
    
    const result = await searchChessComGames(username);
    
    if (result.success) {
      setGames(result.games);
      setCurrentPlayer(username);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  // Search classic games
  const searchClassics = useCallback((query) => {
    if (!query?.trim()) {
      setGames([]);
      return;
    }
    
    const results = searchGames(query);
    setGames(results);
    return results;
  }, []);

  // Load games by category
  const loadCategory = useCallback((categoryId) => {
    const categoryGames = getGamesByCategory(categoryId);
    setGames(categoryGames);
    return categoryGames;
  }, []);

  // Select a game and load it into the viewer
  const selectGame = useCallback((game) => {
    if (!game?.pgn) return false;
    
    try {
      chess.reset();
      chess.loadPgn(game.pgn);
      
      const history = chess.history({ verbose: true });
      setMoves(history);
      setSelectedGame(game);
      
      // Reset to starting position
      chess.reset();
      setFen(chess.fen());
      setMoveIndex(0);
      
      return true;
    } catch (e) {
      console.error("Error loading game:", e);
      setError("Failed to load game PGN");
      return false;
    }
  }, [chess]);

  // Clear selected game
  const clearGame = useCallback(() => {
    setSelectedGame(null);
    chess.reset();
    setFen(chess.fen());
    setMoveIndex(0);
    setMoves([]);
  }, [chess]);

  // Navigate moves
  const goToMove = useCallback((index) => {
    if (index < 0 || index > moves.length) return;
    
    chess.reset();
    for (let i = 0; i < index; i++) {
      chess.move(moves[i].san);
    }
    
    setFen(chess.fen());
    setMoveIndex(index);
  }, [chess, moves]);

  const nextMove = useCallback(() => {
    if (moveIndex < moves.length) {
      goToMove(moveIndex + 1);
    }
  }, [moveIndex, moves.length, goToMove]);

  const prevMove = useCallback(() => {
    if (moveIndex > 0) {
      goToMove(moveIndex - 1);
    }
  }, [moveIndex, goToMove]);

  const firstMove = useCallback(() => {
    goToMove(0);
  }, [goToMove]);

  const lastMove = useCallback(() => {
    goToMove(moves.length);
  }, [moves.length, goToMove]);

  // Flip board
  const flipBoard = useCallback(() => {
    setOrientation(o => o === 'w' ? 'b' : 'w');
  }, []);

  // Clear all state
  const reset = useCallback(() => {
    setGames([]);
    setSelectedGame(null);
    setError(null);
    setCurrentPlayer(null);
    chess.reset();
    setFen(chess.fen());
    setMoveIndex(0);
    setMoves([]);
  }, [chess]);

  return {
    // Game list
    games,
    loading,
    error,
    currentPlayer,
    categories: GAME_CATEGORIES,
    
    // Game viewer
    selectedGame,
    fen,
    moveIndex,
    moves,
    orientation,
    
    // Search actions
    searchLichess,
    searchChessCom,
    searchClassics,
    loadCategory,
    
    // Viewer actions
    selectGame,
    clearGame,
    goToMove,
    nextMove,
    prevMove,
    firstMove,
    lastMove,
    flipBoard,
    
    // Utils
    reset,
    setGames,
    setError
  };
}

export default useGames;
