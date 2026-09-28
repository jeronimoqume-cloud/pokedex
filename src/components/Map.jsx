import { TILE } from "../game/areas.js";
import { TILE_PX } from "../game/config.js";
import { groundVariant, treeVariant } from "../utils/map.js";

function Tile({ kind, x, y, sprites }) {
  const style = { left: x * TILE_PX, top: y * TILE_PX, width: TILE_PX, height: TILE_PX };
  const ground = sprites.ground[groundVariant(x, y, sprites.ground.length)];

  let base = ground;
  let overlay = null;

  if (kind === TILE.PATH) base = sprites.path;
  else if (kind === TILE.TALL_GRASS) base = sprites.tallGrass;
  else if (kind === TILE.TREE) overlay = sprites.trees[treeVariant(x, y, sprites.trees.length)];
  else if (kind === TILE.BUSH) overlay = sprites.bush;

  return (
    <div className="tile" style={style}>
      <img src={base} alt="" draggable={false} />
      {overlay && <img src={overlay} alt="" draggable={false} />}
    </div>
  );
}

export default function Map({ area, player }) {
  const { map, sprites } = area;
  const width = map[0].length * TILE_PX;
  const height = map.length * TILE_PX;

  return (
    <div className="map" style={{ width, height }}>
      {map.map((row, y) =>
        row.map((kind, x) => (
          <Tile key={`${x}-${y}`} kind={kind} x={x} y={y} sprites={sprites} />
        ))
      )}
      <div
        className="player"
        style={{ left: player.x * TILE_PX, top: player.y * TILE_PX, width: TILE_PX, height: TILE_PX }}
      >
        <img
          src="/sprites/player/player.png"
          alt="Jugador"
          draggable={false}
          style={{ transform: player.facing === "left" ? "scaleX(-1)" : "none" }}
        />
      </div>
    </div>
  );
}
