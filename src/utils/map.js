import { BLOCKED } from "../game/areas.js";

export function canWalk(map, x, y) {
  if (y < 0 || y >= map.length) return false;
  if (x < 0 || x >= map[0].length) return false;
  return !BLOCKED.includes(map[y][x]);
}

// Variante de suelo estable (sin aleatoriedad, para que no parpadee al renderizar)
export function groundVariant(x, y, total) {
  const n = (x * 7 + y * 13) % 10;
  if (total < 3) return 0;
  if (n === 9) return 2; // flores
  if (n >= 7) return 1;
  return 0;
}

export function treeVariant(x, y, total) {
  return (x * 3 + y * 5) % total;
}
