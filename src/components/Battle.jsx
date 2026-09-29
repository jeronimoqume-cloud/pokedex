import { useEffect } from "react";
import { useGame } from "../game/GameContext.jsx";
import { TILE_PX } from "../game/config.js";
import { useWildPokemon } from "../hooks/usePokemon.js";
import { formatName } from "../utils/pokeapi.js";

// Paso 3: muestra el Pokémon salvaje traído de la PokeAPI.
// En el Paso 4 se agregará el menú de Atacar / Pokébola / Huir.
export default function Battle() {
  const { area, endBattle } = useGame();
  const { status, pokemon, error, retry } = useWildPokemon(area.types);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") endBattle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [endBattle]);

  return (
    <div
      className="battle"
      style={{ width: area.map[0].length * TILE_PX, height: area.map.length * TILE_PX }}
    >
      {status === "loading" && <p>Buscando un Pokémon salvaje...</p>}

      {status === "error" && (
        <>
          <p>No se pudo cargar el Pokémon.</p>
          <p className="hint">{error}</p>
          <button onClick={retry}>Reintentar</button>
        </>
      )}

      {status === "ready" && (
        <>
          <h3>¡Un {formatName(pokemon.name)} salvaje apareció!</h3>
          <img className="wild-sprite" src={pokemon.sprites.front} alt={pokemon.name} />
          <div className="types">
            <span className="id">#{String(pokemon.id).padStart(3, "0")}</span>
            {pokemon.types.map((t) => (
              <span key={t} className="badge">{t}</span>
            ))}
          </div>
          <p className="hint">
            PS {pokemon.stats.hp} · Ataque {pokemon.stats.attack} · Defensa {pokemon.stats.defense}
          </p>
        </>
      )}

      <button onClick={endBattle}>Volver al mapa</button>
    </div>
  );
}
