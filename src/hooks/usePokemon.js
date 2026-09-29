import { useEffect, useState } from "react";
import { fetchRandomPokemon } from "../utils/pokeapi.js";

// Carga un Pokémon salvaje al azar según los tipos del área.
// status: "loading" | "ready" | "error"
export function useWildPokemon(types) {
  const [state, setState] = useState({ status: "loading", pokemon: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", pokemon: null, error: null });

    fetchRandomPokemon(types)
      .then((pokemon) => {
        if (!cancelled) setState({ status: "ready", pokemon, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", pokemon: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [types, attempt]);

  return { ...state, retry: () => setAttempt((a) => a + 1) };
}
