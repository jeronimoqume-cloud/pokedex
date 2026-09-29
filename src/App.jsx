import { useEffect } from "react";
import Map from "./components/Map.jsx";
import Battle from "./components/Battle.jsx";
import Pokedex from "./components/Pokedex.jsx";
import { GameProvider, useGame } from "./game/GameContext.jsx";
import { TILE } from "./game/areas.js";
import { useKeyboard } from "./hooks/useKeyboard.js";

const TILE_NAMES = {
  [TILE.GROUND]: "suelo",
  [TILE.PATH]: "camino",
  [TILE.TALL_GRASS]: "pasto alto",
};

function Screen() {
  const { mode, area, player, move, captured, openPokedex, closePokedex } = useGame();
  useKeyboard(move, mode === "explore");

  // P abre/cierra la Pokédex y Esc la cierra. Mientras se escribe en el buscador,
  // la P es solo una letra (Esc sí sigue cerrando).
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target instanceof HTMLInputElement;
      if (e.key === "Escape") {
        closePokedex();
      } else if ((e.key === "p" || e.key === "P") && !typing) {
        if (mode === "explore") openPokedex();
        else if (mode === "pokedex") closePokedex();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, openPokedex, closePokedex]);

  const current = area.map[player.y][player.x];

  const hud = {
    battle: "Modo: batalla · Debilita al Pokémon sin derrotarlo y lanza la Pokébola para atraparlo",
    pokedex: "Modo: Pokédex · Esc para cerrar",
    explore: `Modo: explorar · Flechas o WASD · P: Pokédex · Posición (${player.x}, ${player.y}) · Casilla: ${TILE_NAMES[current] ?? "?"} · Capturados: ${captured.length}`,
  }[mode];

  return (
    <div className="game">
      <h2>{area.name}</h2>
      {mode === "battle" && <Battle />}
      {mode === "pokedex" && <Pokedex />}
      {mode === "explore" && <Map area={area} player={player} />}
      <div className="hud">{hud}</div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Screen />
    </GameProvider>
  );
}
