// Rutas de los sprites (todos 16x16). Usa tileSize = 16 y escala con CSS (x3 = 48px)
// con image-rendering: pixelated. Los tiles con fondo transparente (árboles, arbustos,
// rocas, etc.) se dibujan ENCIMA del tile de suelo de su área.
const base = "/sprites";

export const SPRITES = {
  player: `${base}/player/player.png`, // 1 solo sprite; voltear con scaleX(-1) al ir a la izquierda
  pokeball: `${base}/ui/pokeball.png`, // hecha en Pixil (16x16)
};

export const AREAS = {
  forest: {
    ground: [`${base}/forest/grass.png`, `${base}/forest/grass_2.png`, `${base}/forest/grass_flowers.png`],
    path: `${base}/forest/path.png`,
    tallGrass: `${base}/forest/tall_grass.png`, // zona de encuentros
    obstacles: [
      `${base}/forest/tree_pine_1.png`,
      `${base}/forest/tree_pine_2.png`,
      `${base}/forest/tree_pine_3.png`,
      `${base}/forest/tree_orange.png`,
      `${base}/forest/bush.png`,
      `${base}/forest/fence.png`,
      `${base}/forest/sign.png`,
    ],
  },
  snow: {
    ground: [`${base}/snow/snow.png`],
    tallGrass: `${base}/snow/tall_snow.png`, // zona de encuentros
    obstacles: [
      `${base}/snow/tree_1.png`,
      `${base}/snow/tree_2.png`,
      `${base}/snow/tree_3.png`,
      `${base}/snow/log_1.png`,
      `${base}/snow/log_2.png`,
      `${base}/snow/snowman.png`,
      `${base}/snow/rock.png`,
    ],
  },
  cave: {
    ground: [`${base}/cave/floor.png`],
    path: `${base}/cave/sand.png`,
    tallGrass: `${base}/cave/tall_rubble.png`, // zona de encuentros (alternativa: tall_rubble_alt.png)
    obstacles: [
      `${base}/cave/wall.png`,
      `${base}/cave/wall_2.png`,
      `${base}/cave/brick.png`,
      `${base}/cave/column.png`,
      `${base}/cave/torch.png`,
    ],
  },
};
