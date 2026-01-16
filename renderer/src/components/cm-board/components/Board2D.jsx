import React, { useMemo, useState, useEffect } from "react";
import "./board2d.css";
import { allSquares, isDarkSquare } from "../utils/squares";
import { getBoardTheme, getSquareBackground } from "../themes/boardThemes";
import Piece2D from "./Piece2D";

/**
 * Premium 2D board with marble/wood textures.
 * Parent owns chess engine state (e.g., chess.js).
 * Pass `fen` prop alongside `chess` to trigger re-renders when position changes.
 */
export default function Board2D({
  chess,
  fen, // Used to trigger re-renders when position changes
  size = 520,
  orientation = "w",
  interactive = true,
  onMove,
  lastMove = null,
  themeId = "classic_wood",
  vignette = true,
  piece2DBaseUrl = "/pieces/classic/"
}) {
  const theme = getBoardTheme(themeId);
  const [selected, setSelected] = useState(null);

  // Re-calculate when fen changes
  const squares = useMemo(() => allSquares(orientation), [orientation]);

  const legalMoves = useMemo(() => {
    if (!selected) return [];
    try {
      return chess.moves({ square: selected, verbose: true }).map(m => m.to);
    } catch {
      return [];
    }
  }, [selected, chess, fen]);

  const checkSquare = useMemo(() => {
    // chess.js doesn't expose check square directly; this is a best-effort highlight:
    // If in check, find king square for side to move.
    try {
      if (!chess.inCheck()) return null;
      const color = chess.turn();
      for (const sq of allSquares("w")) {
        const p = chess.get(sq);
        if (p && p.type === "k" && p.color === color) return sq;
      }
      return null;
    } catch {
      return null;
    }
  }, [chess, fen]);

  // Clear selection when position changes
  useEffect(() => {
    setSelected(null);
  }, [fen]);

  const handleSquareClick = (sq) => {
    if (!interactive) return;
    const piece = chess.get(sq);

    if (selected && legalMoves.includes(sq)) {
      onMove?.({ from: selected, to: sq, promotion: "q" });
      setSelected(null);
      return;
    }

    if (!piece || piece.color !== chess.turn()) {
      setSelected(null);
      return;
    }

    setSelected(sq);
  };

  return (
    <div
      className={"board2d" + (vignette ? " vignette" : "")}
      style={{
        width: size,
        height: size,
        background: theme.frame,
        boxShadow: `inset 0 0 0 2px ${theme.accent}, 0 8px 32px rgba(0,0,0,0.4)`,
        ["--accent"]: theme.accent
      }}
    >
      {squares.map((sq) => {
        const isDark = isDarkSquare(sq);
        const piece = chess.get(sq);
        const isSelected = selected === sq;
        const isLegal = legalMoves.includes(sq);
        const isLast = lastMove && (sq === lastMove.from || sq === lastMove.to);
        const isCheck = checkSquare === sq;

        // Get background with texture pattern if available
        const squareBg = getSquareBackground(theme, isDark);

        return (
          <div
            key={sq}
            className={
              "square " +
              (isDark ? "dark" : "light") +
              (isSelected ? " selected" : "") +
              (isLegal ? " legal" : "") +
              (isLast ? " lastmove" : "") +
              (isCheck ? " check" : "")
            }
            style={{
              background: squareBg
            }}
            onClick={() => handleSquareClick(sq)}
          >
            {piece && (
              <Piece2D
                piece={piece}
                square={sq}
                boardPx={size}
                orientation={orientation}
                baseUrl={piece2DBaseUrl}
                isLifted={isSelected}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
