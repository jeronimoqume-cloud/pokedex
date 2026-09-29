import Map from "./components/Map.jsx";
import Battle from "./components/Battle.jsx";
import { GameProvider, useGame } from "./game/GameContext.jsx";
import { TILE } from "./game/areas.js";
import { useKeyboard } from "./hooks/useKeyboard.js";

const TILE_NAMES = {
  [TILE.GROUND]: "suelo",
  [TILE.PATH]: "camino",
  [TILE.TALL_GRASS]: "pasto alto",
};

function Screen() {
  const { mode, area, player, move } = useGame();
  useKeyboard(move, mode === "explore");

  const current = area.map[player.y][player.x];

  return (
    <div className="game">
      <h2>{area.name}</h2>
      {mode === "battle" ? <Battle /> : <Map area={area} player={player} />}
      <div className="hud">
        {mode === "battle"
          ? "Modo: batalla · Esc para volver al mapa"
          : `Modo: explorar · Flechas o WASD · Posición (${player.x}, ${player.y}) · Casilla: ${TILE_NAMES[current] ?? "?"}`}
      </div>
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
