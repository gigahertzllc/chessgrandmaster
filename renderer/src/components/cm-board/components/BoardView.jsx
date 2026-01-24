import React, { useMemo } from "react";
import Board2D from "./Board2D.jsx";
import Board3D from "./Board3D.jsx";

/**
 * Wrapper that chooses 2D or 3D renderer.
 *
 * Recommended usage:
 * - Parent owns chess state and passes updated `lastMove`
 * - For best 3D animation accuracy, pass a `positionKey` that changes after each move
 *   and use it as React key: <BoardView key={positionKey} ... />
 */
export default function BoardView({
  variant = "2d",
  chess,
  size = 560,
  orientation = "w",
  interactive = true,
  onMove,
  lastMove = null,
  themeId = "carrara_gold",
  pieceSetId = "classic_ebony_ivory",
  vignette = true,
  animations = true,
  piece2DBaseUrl = "/pieces/classic/",
  cameraPreset = "classic34"
}) {
  if (variant === "3d") {
    return (
      <Board3D
        chess={chess}
        size={size}
        orientation={orientation}
        interactive={interactive}
        onMove={onMove}
        lastMove={lastMove}
        themeId={themeId}
        pieceSetId={pieceSetId}
        cameraPreset={cameraPreset}
        animations={animations}
      />
    );
  }

  return (
    <Board2D
      chess={chess}
      size={size}
      orientation={orientation}
      interactive={interactive}
      onMove={onMove}
      lastMove={lastMove}
      themeId={themeId}
      vignette={vignette}
      piece2DBaseUrl={piece2DBaseUrl}
    />
  );
}
