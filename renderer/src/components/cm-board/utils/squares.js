export const FILES = ["a","b","c","d","e","f","g","h"];

export function allSquares(orientation = "w") {
  const ranks = ["1","2","3","4","5","6","7","8"];
  if (orientation === "w") {
    return ranks.slice().reverse().flatMap(r => FILES.map(f => f + r));
  }
  return ranks.flatMap(r => FILES.slice().reverse().map(f => f + r));
}

export function squareToFR(sq) {
  const file = sq.charCodeAt(0) - 97;
  const rank = parseInt(sq[1], 10) - 1;
  return { file, rank };
}

export function isDarkSquare(sq) {
  const { file, rank } = squareToFR(sq);
  return (file + rank) % 2 === 1;
}
