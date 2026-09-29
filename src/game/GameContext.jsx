import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AREAS, START_AREA, TILE } from "./areas.js";
import { ENCOUNTER_CHANCE, MOVE_DELAY_MS } from "./config.js";
import { canWalk } from "../utils/map.js";
import { prefetchGameData } from "../utils/prefetch.js";

// Modos del juego: "explore" | "battle" | "pokedex" (el de pokedex llega en el Paso 5)
const GameContext = createContext(null);

const DELTAS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export function GameProvider({ children }) {
  const [mode, setMode] = useState("explore");
  const [areaId, setAreaId] = useState(START_AREA);
  const [player, setPlayer] = useState(() => ({ ...AREAS[START_AREA].start, facing: "down" }));
  const [captured, setCaptured] = useState([]); // Pokémon atrapados

  // Copia del estado actual para leerlo dentro de callbacks sin recrearlos
  const live = useRef({});
  live.current = { mode, areaId, player };
  const lastMove = useRef(0);

  // Precarga de datos y sprites al iniciar el juego
  useEffect(() => {
    prefetchGameData();
  }, []);

  const move = useCallback((dir) => {
    const { mode, areaId, player: p } = live.current;
    if (mode !== "explore") return; // solo se camina en modo explorar

    const now = performance.now();
    if (now - lastMove.current < MOVE_DELAY_MS) return;
    lastMove.current = now;

    const area = AREAS[areaId];
    const [dx, dy] = DELTAS[dir];
    const nx = p.x + dx;
    const ny = p.y + dy;
    const facing = dir === "left" || dir === "right" ? dir : p.facing;

    if (!canWalk(area.map, nx, ny)) {
      setPlayer({ ...p, facing });
      return;
    }
    // Portal: cambia de área y coloca al jugador junto a la entrada de la otra
    const portal = area.portals?.find((p) => p.x === nx && p.y === ny);
    if (portal) {
      setAreaId(portal.to);
      setPlayer({ ...portal.spawn, facing });
      return;
    }

    setPlayer({ x: nx, y: ny, facing });

    // Encuentro aleatorio al pisar pasto alto
    if (area.map[ny][nx] === TILE.TALL_GRASS && Math.random() < ENCOUNTER_CHANCE) {
      setMode("battle");
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      areaId,
      area: AREAS[areaId],
      player,
      move,
      captured,
      addCaptured: (pokemon) => setCaptured((list) => [...list, pokemon]),
      setAreaId,
      startBattle: () => setMode("battle"),
      endBattle: () => setMode("explore"),
      // Solo se puede abrir la Pokédex desde el modo explorar (nunca en batalla)
      openPokedex: () => setMode((m) => (m === "explore" ? "pokedex" : m)),
      closePokedex: () => setMode((m) => (m === "pokedex" ? "explore" : m)),
    }),
    [mode, areaId, player, move, captured]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame debe usarse dentro de <GameProvider>");
  return ctx;
}
