import React, { useState, useMemo, useCallback, useEffect } from "react";

/**
 * Professional Chess Board with CDN-loaded pieces
 * Uses the clean "cburnett" piece set from lichess
 */

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

// Lichess piece images (cburnett set - very clean and professional)
const PIECE_URLS = {
  wK: "https://lichess1.org/assets/_gefPZv/piece/cburnett/wK.svg",
  wQ: "https://lichess1.org/assets/_gefPZv/piece/cburnett/wQ.svg",
  wR: "https://lichess1.org/assets/_gefPZv/piece/cburnett/wR.svg",
  wB: "https://lichess1.org/assets/_gefPZv/piece/cburnett/wB.svg",
  wN: "https://lichess1.org/assets/_gefPZv/piece/cburnett/wN.svg",
  wP: "https://lichess1.org/assets/_gefPZv/piece/cburnett/wP.svg",
  bK: "https://lichess1.org/assets/_gefPZv/piece/cburnett/bK.svg",
  bQ: "https://lichess1.org/assets/_gefPZv/piece/cburnett/bQ.svg",
  bR: "https://lichess1.org/assets/_gefPZv/piece/cburnett/bR.svg",
  bB: "https://lichess1.org/assets/_gefPZv/piece/cburnett/bB.svg",
  bN: "https://lichess1.org/assets/_gefPZv/piece/cburnett/bN.svg",
  bP: "https://lichess1.org/assets/_gefPZv/piece/cburnett/bP.svg"
};

function getPieceUrl(piece) {
  if (!piece) return null;
  const key = piece.color + piece.type.toUpperCase();
  return PIECE_URLS[key] || null;
}

function indexToSquare(row, col) {
  const file = FILES[col];
  const rank = 8 - row;
  return `${file}${rank}`;
}

export default function Board({
  chess,
  orientation = "w",
  interactive = false,
  onMove = null,
  lastMove = null,
  disabled = false,
  size = 480
}) {
  const [selected, setSelected] = useState(null);
  const board = chess.board();
  const turn = chess.turn();
  const inCheck = chess.inCheck();
  
  useEffect(() => { setSelected(null); }, [chess.fen()]);

  const legalMoves = useMemo(() => {
    if (!selected || !interactive || disabled) return [];
    try { return chess.moves({ square: selected, verbose: true }); }
    catch (e) { return []; }
  }, [chess, selected, interactive, disabled]);

  const legalTargets = useMemo(() => new Set(legalMoves.map(m => m.to)), [legalMoves]);

  const kingInCheckSquare = useMemo(() => {
    if (!inCheck) return null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === "k" && p.color === turn) return indexToSquare(r, c);
      }
    }
    return null;
  }, [board, turn, inCheck]);

  const handleClick = useCallback((square) => {
    if (!interactive || disabled) return;
    const piece = chess.get(square);
    if (selected) {
      if (legalTargets.has(square)) {
        const move = legalMoves.find(m => m.to === square);
        if (move && onMove) {
          const promotion = move.flags.includes("p") ? "q" : undefined;
          onMove({ from: selected, to: square, promotion });
        }
        setSelected(null);
      } else if (piece && piece.color === turn) {
        setSelected(square);
      } else {
        setSelected(null);
      }
    } else {
      if (piece && piece.color === turn) setSelected(square);
    }
  }, [chess, selected, legalTargets, legalMoves, turn, interactive, disabled, onMove]);

  const sqSize = size / 8;

  const renderSquares = () => {
    const squares = [];
    for (let visualRow = 0; visualRow < 8; visualRow++) {
      for (let visualCol = 0; visualCol < 8; visualCol++) {
        let boardRow, boardCol;
        if (orientation === "w") { boardRow = visualRow; boardCol = visualCol; }
        else { boardRow = 7 - visualRow; boardCol = 7 - visualCol; }
        
        const square = indexToSquare(boardRow, boardCol);
        const piece = board[boardRow][boardCol];
        const isLight = (boardRow + boardCol) % 2 === 0;
        const isSelected = selected === square;
        const isLegalTarget = legalTargets.has(square);
        const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
        const isCheck = kingInCheckSquare === square;
        
        // Beautiful color scheme
        let bg;
        if (isCheck) bg = "#e57373";
        else if (isSelected) bg = "#aed581";
        else if (isLastMove) bg = isLight ? "#f7f683" : "#baca2b";
        else bg = isLight ? "#f0d9b5" : "#b58863";
        
        const pieceUrl = getPieceUrl(piece);
        
        squares.push(
          <div key={square} onClick={() => handleClick(square)} style={{
            width: sqSize, height: sqSize, backgroundColor: bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", cursor: interactive && !disabled ? "pointer" : "default", userSelect: "none"
          }}>
            {/* Legal move dot */}
            {isLegalTarget && !piece && (
              <div style={{ 
                width: sqSize * 0.33, 
                height: sqSize * 0.33, 
                borderRadius: "50%", 
                backgroundColor: "rgba(0,0,0,0.12)" 
              }} />
            )}
            
            {/* Capture ring */}
            {isLegalTarget && piece && (
              <div style={{ 
                position: "absolute", 
                inset: 2, 
                borderRadius: "50%", 
                border: "5px solid rgba(0,0,0,0.12)", 
                pointerEvents: "none" 
              }} />
            )}
            
            {/* Piece image */}
            {pieceUrl && (
              <img 
                src={pieceUrl} 
                alt=""
                draggable={false}
                style={{ 
                  width: sqSize * 0.85, 
                  height: sqSize * 0.85,
                  filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.25))",
                  pointerEvents: "none"
                }} 
              />
            )}
          </div>
        );
      }
    }
    return squares;
  };

  const fileLabels = orientation === "w" ? FILES : [...FILES].reverse();
  const rankLabels = orientation === "w" ? ["8","7","6","5","4","3","2","1"] : ["1","2","3","4","5","6","7","8"];

  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ display: "flex" }}>
        {/* Rank labels */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", paddingRight: 8, width: 22 }}>
          {rankLabels.map((r, i) => (
            <div key={i} style={{ height: sqSize, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{r}</div>
          ))}
        </div>
        
        {/* Board */}
        <div style={{ 
          width: size, 
          height: size, 
          display: "grid", 
          gridTemplateColumns: `repeat(8, ${sqSize}px)`, 
          gridTemplateRows: `repeat(8, ${sqSize}px)`, 
          borderRadius: 6, 
          overflow: "hidden", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)" 
        }}>
          {renderSquares()}
        </div>
      </div>
      
      {/* File labels */}
      <div style={{ display: "flex", marginLeft: 30, width: size }}>
        {fileLabels.map((f, i) => (
          <div key={i} style={{ width: sqSize, textAlign: "center", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", paddingTop: 8 }}>{f}</div>
        ))}
      </div>
    </div>
  );
}
