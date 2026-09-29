import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AREAS, START_AREA, TILE } from "./areas.js";
import { ENCOUNTER_CHANCE, MOVE_DELAY_MS, STARTER_ID } from "./config.js";
import { clearSave, readSave, saveSummary, writeSave } from "./save.js";
import { canWalk } from "../utils/map.js";
import { getParty, healAll, isAvailable, makeMember, regenBox, setMemberHp } from "../utils/party.js";
import { fetchPokemon } from "../utils/pokeapi.js";
import { prefetchGameData } from "../utils/prefetch.js";

// Modos del juego: "title" | "explore" | "battle" | "pokedex"
const GameContext = createContext(null);

const DELTAS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const startPosition = () => ({ ...AREAS[START_AREA].start, facing: "down" });

export function GameProvider({ children }) {
  const [mode, setMode] = useState("title");
  const [areaId, setAreaId] = useState(START_AREA);
  const [player, setPlayer] = useState(startPosition);
  const [box, setBox] = useState([]); // todos los Pokémon del jugador (el inicial va primero)

  // Copia del estado actual para leerlo dentro de callbacks sin recrearlos
  const live = useRef({});
  live.current = { mode, areaId, player, box };
  const lastMove = useRef(0);

  // Precarga de datos y sprites al iniciar el juego
  useEffect(() => {
    prefetchGameData();
  }, []);

  // Autoguardado: en el título no se guarda (el estado en memoria puede estar vacío o ser viejo)
  useEffect(() => {
    if (mode === "title" || box.length === 0) return;
    writeSave({ box, areaId, player });
  }, [mode, box, areaId, player]);

  const party = useMemo(() => getParty(box), [box]);
  const captured = useMemo(() => box.filter((p) => !p.starter), [box]); // los que atrapaste (Pokédex)

  const move = useCallback((dir) => {
    const { mode, areaId, player: current, box: currentBox } = live.current;
    if (mode !== "explore") return; // solo se camina en modo explorar

    const now = performance.now();
    if (now - lastMove.current < MOVE_DELAY_MS) return;
    lastMove.current = now;

    const area = AREAS[areaId];
    const [dx, dy] = DELTAS[dir];
    const nx = current.x + dx;
    const ny = current.y + dy;
    const facing = dir === "left" || dir === "right" ? dir : current.facing;

    if (!canWalk(area.map, nx, ny)) {
      setPlayer({ ...current, facing });
      return;
    }
    // Portal: cambia de área y coloca al jugador junto a la entrada de la otra
    const portal = area.portals?.find((pt) => pt.x === nx && pt.y === ny);
    if (portal) {
      setAreaId(portal.to);
      setPlayer({ ...portal.spawn, facing });
      return;
    }

    setPlayer({ x: nx, y: ny, facing });

    // Caminar recupera PS poco a poco (y termina de levantar a los debilitados)
    const nextBox = regenBox(currentBox);
    if (nextBox !== currentBox) setBox(nextBox);

    // Encuentro aleatorio al pisar pasto alto (solo si algún Pokémon puede pelear)
    if (
      area.map[ny][nx] === TILE.TALL_GRASS &&
      Math.random() < ENCOUNTER_CHANCE &&
      getParty(nextBox).some(isAvailable)
    ) {
      setMode("battle");
    }
  }, []);

  const addCaptured = useCallback((pokemon) => setBox((b) => [...b, makeMember(pokemon)]), []);
  const updateHp = useCallback((uid, hp) => setBox((b) => setMemberHp(b, uid, hp)), []);
  const endBattle = useCallback(() => setMode("explore"), []);

  // Todo el equipo se debilitó: vuelves al inicio del Bosque con el equipo curado
  const blackout = useCallback(() => {
    setBox((b) => healAll(b));
    setAreaId(START_AREA);
    setPlayer(startPosition());
    setMode("explore");
  }, []);

  // Solo se puede abrir la Pokédex desde el modo explorar (nunca en batalla)
  const openPokedex = useCallback(() => setMode((m) => (m === "explore" ? "pokedex" : m)), []);
  const closePokedex = useCallback(() => setMode((m) => (m === "pokedex" ? "explore" : m)), []);

  // Título y partidas guardadas
  const goToTitle = useCallback(() => setMode((m) => (m === "explore" ? "title" : m)), []);

  const continueGame = useCallback(() => {
    const save = readSave();
    if (!save) return false;
    setBox(save.box);
    setAreaId(save.areaId);
    setPlayer(save.player);
    setMode("explore");
    return true;
  }, []);

  // Empieza de cero. Si falla la PokeAPI lanza el error y no toca la partida existente.
  const newGame = useCallback(async () => {
    const starter = await fetchPokemon(STARTER_ID);
    clearSave();
    setBox([makeMember(starter, { starter: true })]);
    setAreaId(START_AREA);
    setPlayer(startPosition());
    setMode("explore");
  }, []);

  const deleteSave = useCallback(() => {
    clearSave();
    setBox([]);
    setAreaId(START_AREA);
    setPlayer(startPosition());
  }, []);

  const value = useMemo(
    () => ({
      mode,
      areaId,
      area: AREAS[areaId],
      player,
      move,
      party,
      captured,
      addCaptured,
      updateHp,
      endBattle,
      blackout,
      openPokedex,
      closePokedex,
      goToTitle,
      continueGame,
      newGame,
      deleteSave,
      getSaveSummary: saveSummary,
    }),
    [
      mode, areaId, player, move, party, captured, addCaptured, updateHp, endBattle,
      blackout, openPokedex, closePokedex, goToTitle, continueGame, newGame, deleteSave,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame debe usarse dentro de <GameProvider>");
  return ctx;
}
