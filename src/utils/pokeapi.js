import { MAX_ID } from "../game/config.js";

const BASE = "https://pokeapi.co/api/v2";

// Cachés en memoria: guardan la promesa, así no se repiten llamadas (ni siquiera simultáneas)
const pokemonCache = new Map(); // id o nombre -> Promise<pokemon>
const typeCache = new Map();    // tipo -> Promise<number[]> (ids permitidos)

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al consultar la PokeAPI`);
  return res.json();
}

function cached(cache, key, loader) {
  if (!cache.has(key)) {
    const promise = loader().catch((err) => {
      cache.delete(key); // si falla, permitir reintentar
      throw err;
    });
    cache.set(key, promise);
  }
  return cache.get(key);
}

// Nos quedamos solo con lo que el juego necesita
function normalize(data) {
  const stat = (name) => data.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t) => t.type.name),
    stats: {
      hp: stat("hp"),
      attack: stat("attack"),
      defense: stat("defense"),
      speed: stat("speed"),
    },
    sprites: {
      front:
        data.sprites.front_default ??
        data.sprites.other?.["official-artwork"]?.front_default ??
        null,
      back: data.sprites.back_default ?? null,
    },
  };
}

export function fetchPokemon(idOrName) {
  const key = String(idOrName).toLowerCase();
  return cached(pokemonCache, key, async () =>
    normalize(await getJSON(`${BASE}/pokemon/${key}`))
  );
}

// IDs de todos los Pokémon de un tipo, filtrados por MAX_ID
export function fetchTypeIds(type) {
  return cached(typeCache, type, async () => {
    const data = await getJSON(`${BASE}/type/${type}`);
    return data.pokemon
      .map((entry) => Number(entry.pokemon.url.match(/\/pokemon\/(\d+)\/?$/)?.[1]))
      .filter((id) => id >= 1 && id <= MAX_ID);
  });
}

// Elige un tipo del área al azar y luego un Pokémon de ese tipo
export async function fetchRandomPokemon(types) {
  const type = types[Math.floor(Math.random() * types.length)];
  const ids = await fetchTypeIds(type);
  if (ids.length === 0) throw new Error(`No hay Pokémon de tipo ${type} con id <= ${MAX_ID}`);
  const id = ids[Math.floor(Math.random() * ids.length)];
  return fetchPokemon(id);
}

export function formatName(name) {
  const text = name.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
