import { AREAS } from "../game/areas.js";
import { STARTER_ID } from "../game/config.js";
import { fetchPokemon, fetchPokemonNames, fetchTypeIds } from "./pokeapi.js";
import { asset } from "./asset.js";

const quiet = (promise) => promise.catch(() => {}); // si falla, se reintenta cuando se necesite

// Precarga datos y sprites al iniciar para que la primera batalla, la Pokédex
// y el cambio de área no tengan esperas ni parpadeos.
export function prefetchGameData() {
  quiet(fetchPokemonNames());
  quiet(fetchPokemon(STARTER_ID));
  const types = new Set(Object.values(AREAS).flatMap((a) => a.types));
  types.forEach((t) => quiet(fetchTypeIds(t)));

  if (typeof Image === "undefined") return;
  const paths = new Set(["/sprites/player/player.png", "/sprites/ui/pokeball.png"]);
  for (const area of Object.values(AREAS)) {
    const s = area.sprites;
    [...s.ground, s.tallGrass, ...s.trees, ...s.bushes, s.path].filter(Boolean).forEach((p) => paths.add(p));
  }
  paths.forEach((src) => {
    const img = new Image();
    img.src = asset(src);
  });
}
