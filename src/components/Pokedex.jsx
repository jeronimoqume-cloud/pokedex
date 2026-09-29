import { useMemo, useState } from "react";
import { useGame } from "../game/GameContext.jsx";
import { TILE_PX } from "../game/config.js";
import { usePokemon, usePokemonNames } from "../hooks/usePokemon.js";
import { formatName } from "../utils/pokeapi.js";
import { searchNames } from "../utils/pokedex.js";
import "./pokedex.css";

const STAT_LABELS = [
  ["hp", "PS"],
  ["attack", "Ataque"],
  ["defense", "Defensa"],
  ["spAttack", "At. Esp."],
  ["spDefense", "Def. Esp."],
  ["speed", "Velocidad"],
];

function PokemonCard({ idOrName, timesCaptured }) {
  const { status, pokemon, error, retry } = usePokemon(idOrName);

  if (status === "loading") return <p className="pd-empty">Cargando...</p>;
  if (status === "error") {
    return (
      <div className="pd-empty">
        <p>No se pudo cargar el Pokémon.</p>
        <p className="pd-hint">{error}</p>
        <button onClick={retry}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="pd-card">
      <div className="pd-sprite-box">
        <img className="pd-sprite" src={pokemon.sprites.front} alt={pokemon.name} />
      </div>
      <div className="pd-info">
        <h3>
          {formatName(pokemon.name)} <span className="pd-id">#{String(pokemon.id).padStart(3, "0")}</span>
        </h3>
        <div className="pd-types">
          {pokemon.types.map((t) => (
            <span key={t} className="pd-badge">{t}</span>
          ))}
          {timesCaptured > 0 && <span className="pd-caught">Capturado ×{timesCaptured}</span>}
        </div>
        <div className="pd-stats">
          {STAT_LABELS.map(([key, label]) => (
            <div key={key} className="pd-stat">
              <span className="pd-stat-label">{label}</span>
              <div className="pd-stat-track">
                <div className="pd-stat-fill" style={{ width: `${Math.min(100, (pokemon.stats[key] / 200) * 100)}%` }} />
              </div>
              <span className="pd-stat-value">{pokemon.stats[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Pokedex() {
  const { area, captured, closePokedex } = useGame();
  const names = usePokemonNames();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // id del Pokémon mostrado

  const suggestions = useMemo(
    () => (names.status === "ready" ? searchNames(names.data, query) : []),
    [names.status, names.data, query]
  );

  // Pokémon capturados sin repetir, para la fila de abajo
  const capturedUnique = useMemo(
    () => [...new Map(captured.map((p) => [p.id, p])).values()],
    [captured]
  );

  const choose = (id) => {
    setSelected(id);
    setQuery("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && suggestions[0]) choose(suggestions[0].id);
  };

  return (
    <div
      className="pd"
      style={{ width: area.map[0].length * TILE_PX, height: area.map.length * TILE_PX }}
    >
      <div className="pd-header">
        <strong className="pd-title">POKÉDEX</strong>
        <div className="pd-search">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Busca por nombre o número..."
          />
          {suggestions.length > 0 && (
            <ul className="pd-suggestions">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button onClick={() => choose(s.id)}>
                    <span className="pd-id">#{String(s.id).padStart(3, "0")}</span> {formatName(s.name)}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {names.status === "ready" && query.trim() && suggestions.length === 0 && (
            <div className="pd-suggestions pd-none">Sin resultados</div>
          )}
        </div>
        <button onClick={closePokedex}>Cerrar (Esc)</button>
      </div>

      <div className="pd-main">
        {names.status === "loading" && <p className="pd-empty">Cargando la lista de Pokémon...</p>}
        {names.status === "error" && (
          <div className="pd-empty">
            <p>No se pudo cargar la lista de Pokémon.</p>
            <p className="pd-hint">{names.error}</p>
            <button onClick={names.retry}>Reintentar</button>
          </div>
        )}
        {names.status === "ready" && selected === null && (
          <p className="pd-empty">Escribe un nombre (por ejemplo, pikachu) o un número para buscar.</p>
        )}
        {names.status === "ready" && selected !== null && (
          <PokemonCard
            key={selected}
            idOrName={selected}
            timesCaptured={captured.filter((p) => p.id === selected).length}
          />
        )}
      </div>

      <div className="pd-footer">
        <span className="pd-footer-title">Capturados: {captured.length}</span>
        <div className="pd-caught-list">
          {capturedUnique.length === 0 && <span className="pd-hint">Aún no has atrapado ninguno.</span>}
          {capturedUnique.map((p) => (
            <button key={p.id} className="pd-chip" onClick={() => choose(p.id)} title={formatName(p.name)}>
              <img src={p.sprites.front} alt={p.name} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
