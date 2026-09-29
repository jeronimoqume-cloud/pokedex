import { useEffect } from "react";
import GameMap from "./components/Map.jsx";
import Battle from "./components/Battle.jsx";
import Pokedex from "./components/Pokedex.jsx";
import Title from "./components/Title.jsx";
import { GameProvider, useGame } from "./game/GameContext.jsx";
import { TILE } from "./game/areas.js";
import { useKeyboard } from "./hooks/useKeyboard.js";
import { maxHp } from "./utils/battle.js";
import { formatName } from "./utils/pokeapi.js";

const TILE_NAMES = {
  [TILE.GROUND]: "suelo",
  [TILE.PATH]: "camino",
  [TILE.TALL_GRASS]: "pasto alto",
  [TILE.PORTAL]: "salida",
};

function MobileControls({ onMove, onPokedex }) {
  return (
    <div className="mobile-controls" aria-label="Touch controls">
      <div className="mobile-dpad" aria-label="Movement controls">
        <span />
        <button type="button" aria-label="Move up" onClick={() => onMove("up")}>▲</button>
        <span />
        <button type="button" aria-label="Move left" onClick={() => onMove("left")}>◀</button>
        <span className="mobile-dpad-center" aria-hidden="true" />
        <button type="button" aria-label="Move right" onClick={() => onMove("right")}>▶</button>
        <span />
        <button type="button" aria-label="Move down" onClick={() => onMove("down")}>▼</button>
      </div>
      <button type="button" className="mobile-pokedex" onClick={onPokedex}>Pokédex</button>
    </div>
  );
}

function Screen() {
  const { mode, area, player, move, party, captured, openPokedex, closePokedex, goToTitle } = useGame();
  useKeyboard(move, mode === "explore");

  // P abre/cierra la Pokédex. Esc cierra la Pokédex o, desde el mapa, vuelve al título.
  // Mientras se escribe en el buscador, la P es solo una letra (Esc sí sigue cerrando).
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target instanceof HTMLInputElement;
      if (e.key === "Escape") {
        if (e.repeat) return; // mantener Esc pulsado no debe saltar de la Pokédex al título
        if (mode === "pokedex") closePokedex();
        else if (mode === "explore") goToTitle();
      } else if ((e.key === "p" || e.key === "P") && !typing) {
        if (mode === "explore") openPokedex();
        else if (mode === "pokedex") closePokedex();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, openPokedex, closePokedex, goToTitle]);

  if (mode === "title") {
    return (
      <div className="game">
        <Title />
      </div>
    );
  }

  const current = area.map[player.y][player.x];

  const hud = {
    battle: "Modo: batalla · Debilita al Pokémon sin derrotarlo y lanza la Pokébola para atraparlo",
    pokedex: "Modo: Pokédex · Esc para cerrar",
    explore: `Modo: explorar · Flechas o WASD · P: Pokédex · Esc: título · Posición (${player.x}, ${player.y}) · Casilla: ${TILE_NAMES[current] ?? "?"} · Capturados: ${captured.length}`,
  }[mode];

  return (
    <div className="game">
      <h2>{area.name}</h2>
      {mode === "battle" && <Battle />}
      {mode === "pokedex" && <Pokedex />}
      {mode === "explore" && <GameMap area={area} player={player} />}
      <div className="hud">{hud}</div>
      {mode === "explore" && (
        <div className="hud hud-party">
          Equipo:{" "}
          {party.map((p, i) => (
            <span key={p.uid} className={p.fainted ? "fainted" : undefined}>
              {i > 0 && " · "}
              {formatName(p.name)} {p.hp}/{maxHp(p)}
              {p.fainted && " (debilitado)"}
            </span>
          ))}
        </div>
      )}
      {mode === "explore" && <MobileControls onMove={move} onPokedex={openPokedex} />}
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
