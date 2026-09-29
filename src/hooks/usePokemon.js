import { useEffect, useState } from "react";
import { fetchPokemon, fetchRandomPokemon } from "../utils/pokeapi.js";

// Ejecuta una carga asíncrona con estados: "loading" | "ready" | "error"
function useLoad(loader, deps) {
  const [state, setState] = useState({ status: "loading", pokemon: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", pokemon: null, error: null });

    loader()
      .then((pokemon) => {
        if (!cancelled) setState({ status: "ready", pokemon, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", pokemon: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [...deps, attempt]);

  return { ...state, retry: () => setAttempt((a) => a + 1) };
}

// Pokémon salvaje al azar según los tipos del área
export function useWildPokemon(types) {
  return useLoad(() => fetchRandomPokemon(types), [types]);
}

// Un Pokémon concreto por id o nombre (por ejemplo, el inicial del jugador)
export function usePokemon(idOrName) {
  return useLoad(() => fetchPokemon(idOrName), [idOrName]);
}
