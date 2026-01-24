import React, { useLayoutEffect, useRef } from "react";

/**
 * 2D piece with delta-based slide animation.
 * NOTE: This module does not ship assets. The parent app should provide SVG files
 * at /public/pieces/<setId>/wP.svg ... bK.svg or update the baseUrl prop.
 */
export default function Piece2D({
  piece,
  square,
  boardPx,
  orientation,
  baseUrl = "/pieces/classic/",
  isLifted = false
}) {
  const ref = useRef(null);
  const prevSquare = useRef(square);
  const sq = boardPx / 8;

  const toXY = (s) => {
    const file = s.charCodeAt(0) - 97;
    const rank = parseInt(s[1], 10) - 1;
    if (orientation === "w") return [file, 7 - rank];
    return [7 - file, rank];
  };

  useLayoutEffect(() => {
    if (!ref.current) return;
    if (prevSquare.current === square) return;

    const [px, py] = toXY(prevSquare.current);
    const [nx, ny] = toXY(square);
    const dx = (px - nx) * sq;
    const dy = (py - ny) * sq;

    // Set initial offset without transition, then animate to 0.
    ref.current.style.transition = "none";
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`;

    requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.style.transition = "transform 220ms cubic-bezier(0.4, 0, 0.2, 1)";
      ref.current.style.transform = "translate(0px, 0px)";
    });

    prevSquare.current = square;
  }, [square, sq, orientation]);

  const type = piece.type.toUpperCase();
  const src = `${baseUrl}${piece.color}${type}.svg`;

  return (
    <img
      ref={ref}
      className={"piece2d" + (isLifted ? " lifted" : "")}
      src={src}
      draggable={false}
      alt=""
    />
  );
}
