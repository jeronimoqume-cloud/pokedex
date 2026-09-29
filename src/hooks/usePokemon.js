import { useEffect, useState } from "react";
import { fetchPokemon, fetchPokemonNames, fetchRandomPokemon } from "../utils/pokeapi.js";

// Ejecuta una carga asíncrona con estados: "loading" | "ready" | "error"
function useLoad(loader, deps) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    loader()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", data: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [...deps, attempt]);

  return { ...state, pokemon: state.data, retry: () => setAttempt((a) => a + 1) };
}

// Pokémon salvaje al azar según los tipos del área
export function useWildPokemon(types) {
  return useLoad(() => fetchRandomPokemon(types), [types]);
}

// Un Pokémon concreto por id o nombre
export function usePokemon(idOrName) {
  return useLoad(() => fetchPokemon(idOrName), [idOrName]);
}

// Lista de nombres para el autocompletado de la Pokédex
export function usePokemonNames() {
  return useLoad(() => fetchPokemonNames(), []);
}
