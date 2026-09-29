// Tipos de casilla del mapa
export const TILE = {
  GROUND: 0,
  TREE: 1,        // obstáculo grande / borde (árbol, pared)
  TALL_GRASS: 2,  // zona de encuentros
  PATH: 3,
  BUSH: 4,        // obstáculo pequeño (arbusto, roca, columna)
  PORTAL: 5,      // salida hacia otra área
};

// Casillas por las que NO se puede pasar
export const BLOCKED = [TILE.TREE, TILE.BUSH];

// Cada portal: al pisar la casilla (x, y) se viaja al área "to" y se aparece en "spawn"
export const AREAS = {
  forest: {
    name: "Bosque",
    types: ["grass", "bug", "poison"],
    start: { x: 2, y: 5 },
    battleBg: "linear-gradient(#9fd3f2 0 55%, #7cc26a 55% 100%)",
    portals: [
      { x: 0, y: 5, to: "snow", spawn: { x: 13, y: 5 } },
      { x: 14, y: 5, to: "cave", spawn: { x: 1, y: 5 } },
    ],
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 1],
      [1, 0, 4, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 0, 3, 3, 3, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 4, 0, 1],
      [5, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1],
      [1, 0, 4, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 4, 1],
      [1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    sprites: {
      ground: [
        "/sprites/forest/grass.png",
        "/sprites/forest/grass_2.png",
        "/sprites/forest/grass_flowers.png",
      ],
      path: "/sprites/forest/path.png",
      tallGrass: "/sprites/forest/tall_grass.png",
      trees: [
        "/sprites/forest/tree_pine_1.png",
        "/sprites/forest/tree_pine_2.png",
        "/sprites/forest/tree_pine_3.png",
      ],
      bushes: ["/sprites/forest/bush.png"],
    },
  },

  snow: {
    name: "Nieve",
    types: ["ice", "water"],
    start: { x: 13, y: 5 },
    battleBg: "linear-gradient(#cfe8f7 0 55%, #eef6fb 55% 100%)",
    portals: [{ x: 14, y: 5, to: "forest", spawn: { x: 1, y: 5 } }],
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 4, 0, 1],
      [1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 4, 0, 0, 2, 2, 0, 0, 0, 4, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 1],
      [1, 0, 4, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    sprites: {
      ground: ["/sprites/snow/snow.png"],
      tallGrass: "/sprites/snow/tall_snow.png",
      trees: [
        "/sprites/snow/tree_1.png",
        "/sprites/snow/tree_2.png",
        "/sprites/snow/tree_3.png",
      ],
      bushes: ["/sprites/snow/rock.png", "/sprites/snow/snowman.png", "/sprites/snow/log_1.png"],
    },
  },

  cave: {
    name: "Cueva",
    types: ["rock", "ground", "fighting"],
    start: { x: 1, y: 5 },
    battleBg: "linear-gradient(#2a1f1a 0 55%, #5a3f2e 55% 100%)",
    portals: [{ x: 0, y: 5, to: "forest", spawn: { x: 13, y: 5 } }],
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 1],
      [1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 1],
      [1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 0, 1],
      [1, 0, 4, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 0, 1],
      [1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    sprites: {
      ground: ["/sprites/cave/floor.png"],
      path: "/sprites/cave/sand.png",
      tallGrass: "/sprites/cave/tall_rubble.png",
      trees: ["/sprites/cave/wall.png", "/sprites/cave/wall_2.png"],
      bushes: ["/sprites/cave/column.png", "/sprites/cave/brick.png"],
    },
  },
};

export const START_AREA = "forest";
