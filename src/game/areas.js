// Tipos de casilla del mapa
export const TILE = {
  GROUND: 0,
  TREE: 1,
  TALL_GRASS: 2,
  PATH: 3,
  BUSH: 4,
};

// Casillas por las que NO se puede pasar
export const BLOCKED = [TILE.TREE, TILE.BUSH];

export const AREAS = {
  forest: {
    name: "Bosque",
    types: ["grass", "bug", "poison"], // se usará en el Paso 3 con /type/{tipo}
    start: { x: 2, y: 5 },
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 1],
      [1, 0, 4, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 0, 3, 3, 3, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 4, 0, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 1],
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
      bush: "/sprites/forest/bush.png",
    },
  },
};

export const START_AREA = "forest";
