import { useEffect, useRef, useState } from "react";
import { useGame } from "../game/GameContext.jsx";
import { FLEE_CHANCE, PLAYER_HP_MULTIPLIER, STARTER_ID, TILE_PX, TURN_DELAY_MS } from "../game/config.js";
import { usePokemon, useWildPokemon } from "../hooks/usePokemon.js";
import { calcDamage, catchChance } from "../utils/battle.js";
import { formatName } from "../utils/pokeapi.js";
import "./battle.css";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function HpBar({ current, max }) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? "high" : pct > 20 ? "mid" : "low";
  return (
    <div className="hp">
      <div className="hp-track">
        <div className={`hp-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="hp-text">{current}/{max}</span>
    </div>
  );
}

function BattleScene({ wild, mine, onExit }) {
  const { addCaptured } = useGame();
  const wildName = formatName(wild.name);
  const myName = formatName(mine.name);
  const wildMax = wild.stats.hp;
  const myMax = Math.round(mine.stats.hp * PLAYER_HP_MULTIPLIER);

  const [wildHp, setWildHp] = useState(wildMax);
  const [myHp, setMyHp] = useState(myMax);
  const [phase, setPhase] = useState("choosing"); // choosing | busy | ended
  const [message, setMessage] = useState(`¡Un ${wildName} salvaje apareció! ¿Qué hará ${myName}?`);

  // Evita actualizar el estado si el componente ya se desmontó
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const pause = async (ms = TURN_DELAY_MS) => {
    await wait(ms);
    return alive.current;
  };

  // Al terminar la batalla, Enter o Esc vuelven al mapa
  useEffect(() => {
    if (phase !== "ended") return;
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Enter") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onExit]);

  const finish = (text) => {
    setMessage(text);
    setPhase("ended");
  };

  async function enemyTurn(hpNow) {
    const dmg = calcDamage(wild, mine);
    const next = Math.max(0, hpNow - dmg);
    setMyHp(next);
    setMessage(`${wildName} ataca e inflige ${dmg} de daño.`);
    if (!(await pause())) return;
    if (next === 0) {
      finish(`${myName} se debilitó. Vuelves al mapa...`);
      return;
    }
    setMessage(`¿Qué hará ${myName}?`);
    setPhase("choosing");
  }

  async function attack() {
    setPhase("busy");
    const dmg = calcDamage(mine, wild);
    const next = Math.max(0, wildHp - dmg);
    setWildHp(next);
    setMessage(`${myName} ataca e inflige ${dmg} de daño.`);
    if (!(await pause())) return;
    if (next === 0) {
      finish(`¡${wildName} salvaje fue derrotado!`);
      return;
    }
    await enemyTurn(myHp);
  }

  async function throwBall() {
    setPhase("busy");
    setMessage("¡Lanzas una Pokébola!");
    if (!(await pause(1100))) return;
    if (Math.random() < catchChance(wildHp, wildMax)) {
      addCaptured(wild);
      finish(`¡Atrapaste a ${wildName}!`);
      return;
    }
    setMessage(`¡${wildName} escapó de la Pokébola!`);
    if (!(await pause())) return;
    await enemyTurn(myHp);
  }

  async function flee() {
    setPhase("busy");
    if (Math.random() < FLEE_CHANCE) {
      setMessage("¡Escapaste sin problemas!");
      setPhase("ended");
      return;
    }
    setMessage("¡No pudiste escapar!");
    if (!(await pause())) return;
    await enemyTurn(myHp);
  }

  const canAct = phase === "choosing";

  return (
    <>
      <div className="bt-wild-info">
        <strong>{wildName}</strong>
        <div className="bt-types">
          {wild.types.map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
        <HpBar current={wildHp} max={wildMax} />
      </div>
      <img className="bt-wild-sprite" src={wild.sprites.front} alt={wild.name} />

      <img className="bt-my-sprite" src={mine.sprites.back ?? mine.sprites.front} alt={mine.name} />
      <div className="bt-my-info">
        <strong>{myName}</strong>
        <HpBar current={myHp} max={myMax} />
      </div>

      <div className="bt-bottom">
        <p className="bt-message">{message}</p>
        <div className="bt-menu">
          {phase === "ended" ? (
            <button onClick={onExit}>Continuar</button>
          ) : (
            <>
              <button disabled={!canAct} onClick={attack}>Atacar</button>
              <button disabled={!canAct} onClick={throwBall}>
                <img src="/sprites/ui/pokeball.png" alt="" /> Pokébola
              </button>
              <button disabled={!canAct} onClick={flee}>Huir</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function Battle() {
  const { area, endBattle } = useGame();
  const wild = useWildPokemon(area.types);
  const mine = usePokemon(STARTER_ID);

  const loading = wild.status === "loading" || mine.status === "loading";
  const failed = wild.status === "error" || mine.status === "error";

  // Mientras carga o si hay un error se puede salir con Esc
  useEffect(() => {
    if (!loading && !failed) return;
    const onKey = (e) => {
      if (e.key === "Escape") endBattle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, failed, endBattle]);

  const retry = () => {
    if (wild.status === "error") wild.retry();
    if (mine.status === "error") mine.retry();
  };

  return (
    <div
      className="bt"
      style={{ width: area.map[0].length * TILE_PX, height: area.map.length * TILE_PX, background: area.battleBg }}
    >
      {failed ? (
        <div className="bt-center">
          <p>No se pudo cargar el Pokémon.</p>
          <p className="bt-hint">{wild.error ?? mine.error}</p>
          <button onClick={retry}>Reintentar</button>
          <button onClick={endBattle}>Volver al mapa</button>
        </div>
      ) : loading ? (
        <div className="bt-center">
          <p>Buscando un Pokémon salvaje...</p>
        </div>
      ) : (
        <BattleScene wild={wild.pokemon} mine={mine.pokemon} onExit={endBattle} />
      )}
    </div>
  );
}
