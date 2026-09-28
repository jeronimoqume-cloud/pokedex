import { useCallback, useRef, useState } from "react";
import Map from "./components/Map.jsx";
import { AREAS, START_AREA, TILE } from "./game/areas.js";
import { MOVE_DELAY_MS } from "./game/config.js";
import { useKeyboard } from "./hooks/useKeyboard.js";
import { canWalk } from "./utils/map.js";

const DELTAS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const TILE_NAMES = {
  [TILE.GROUND]: "suelo",
  [TILE.PATH]: "camino",
  [TILE.TALL_GRASS]: "pasto alto",
};

export default function App() {
  const area = AREAS[START_AREA];
  const [player, setPlayer] = useState({ ...area.start, facing: "down" });
  const lastMove = useRef(0);

  const move = useCallback(
    (dir) => {
      const now = performance.now();
      if (now - lastMove.current < MOVE_DELAY_MS) return;
      lastMove.current = now;

      setPlayer((p) => {
        const [dx, dy] = DELTAS[dir];
        const nx = p.x + dx;
        const ny = p.y + dy;
        const facing = dir === "left" || dir === "right" ? dir : p.facing;
        if (!canWalk(area.map, nx, ny)) return { ...p, facing };
        return { x: nx, y: ny, facing };
      });
    },
    [area]
  );

  useKeyboard(move);

  const current = area.map[player.y][player.x];

  return (
    <div className="game">
      <h2>{area.name}</h2>
      <Map area={area} player={player} />
      <div className="hud">
        Flechas o WASD para moverte · Posición ({player.x}, {player.y}) · Casilla: {TILE_NAMES[current] ?? "?"}
      </div>
    </div>
  );
}
