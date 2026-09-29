import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../game/GameContext.jsx";
import { FLEE_CHANCE, PARTY_SIZE, TILE_PX, TURN_DELAY_MS } from "../game/config.js";
import { useWildPokemon } from "../hooks/usePokemon.js";
import { calcDamage, catchChance, maxHp } from "../utils/battle.js";
import { isAvailable } from "../utils/party.js";
import { formatName } from "../utils/pokeapi.js";
import { asset } from "../utils/asset.js";
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

// Lista del equipo para cambiar de Pokémon
function SwitchPanel({ party, activeUid, forced, onPick, onCancel }) {
  return (
    <div className="bt-switch">
      <p className="bt-switch-title">
        {forced ? "Tu Pokémon se debilitó. Elige al siguiente." : "¿A quién quieres sacar?"}
      </p>
      <div className="bt-switch-grid">
        {party.map((p) => {
          const active = p.uid === activeUid;
          return (
            <button
              key={p.uid}
              className="bt-member"
              disabled={active || !isAvailable(p)}
              onClick={() => onPick(p.uid)}
            >
              <img src={p.sprites.front} alt="" />
              <span className="bt-member-info">
                <strong>{formatName(p.name)}</strong>
                <HpBar current={p.hp} max={maxHp(p)} />
                <small>{p.fainted ? "Debilitado" : active ? "En combate" : "\u00a0"}</small>
              </span>
            </button>
          );
        })}
      </div>
      {!forced && (
        <button className="bt-cancel" onClick={onCancel}>Cancelar</button>
      )}
    </div>
  );
}

function BattleScene({ wild, firstUid }) {
  const { party, addCaptured, updateHp, endBattle, blackout } = useGame();
  const wildName = formatName(wild.name);
  const wildMax = wild.stats.hp;

  const [wildHp, setWildHp] = useState(wildMax);
  const [activeUid, setActiveUid] = useState(firstUid);
  // choosing | switching | forceSwitch | busy | ended
  const [phase, setPhase] = useState("choosing");
  const [message, setMessage] = useState(() => {
    const first = party.find((p) => p.uid === firstUid);
    return `¡Un ${wildName} salvaje apareció! ¿Qué hará ${formatName(first.name)}?`;
  });

  // Los turnos son asíncronos: se lee el equipo más reciente desde refs, no desde el cierre de la función
  const partyRef = useRef(party);
  partyRef.current = party;
  const activeRef = useRef(firstUid);
  const blackedOut = useRef(false);
  const getMine = () => partyRef.current.find((p) => p.uid === activeRef.current);
  const select = (uid) => {
    activeRef.current = uid;
    setActiveUid(uid);
  };

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

  // Al terminar, se vuelve al mapa; si todo el equipo cayó, al inicio del Bosque
  const onExit = useCallback(() => (blackedOut.current ? blackout() : endBattle()), [blackout, endBattle]);

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

  // Un Pokémon del jugador cae: cambio obligatorio, o desmayo total si no queda nadie
  async function handleFaint(fainted) {
    setMessage(`¡${formatName(fainted.name)} se debilitó!`);
    if (!(await pause())) return;
    const others = partyRef.current.filter((p) => p.uid !== fainted.uid && isAvailable(p));
    if (others.length === 0) {
      blackedOut.current = true;
      finish("Te quedaste sin Pokémon. Vuelves al Bosque a descansar...");
      return;
    }
    setMessage("Elige a tu siguiente Pokémon.");
    setPhase("forceSwitch");
  }

  async function enemyTurn(target) {
    const dmg = calcDamage(wild, target);
    const next = Math.max(0, target.hp - dmg);
    updateHp(target.uid, next);
    setMessage(`${wildName} ataca a ${formatName(target.name)} e inflige ${dmg} de daño.`);
    if (!(await pause())) return;
    if (next === 0) {
      await handleFaint(target);
      return;
    }
    setMessage(`¿Qué hará ${formatName(target.name)}?`);
    setPhase("choosing");
  }

  async function attack() {
    const me = getMine();
    setPhase("busy");
    const dmg = calcDamage(me, wild);
    const next = Math.max(0, wildHp - dmg);
    setWildHp(next);
    setMessage(`${formatName(me.name)} ataca e inflige ${dmg} de daño.`);
    if (!(await pause())) return;
    if (next === 0) {
      finish(`¡${wildName} salvaje fue derrotado!`);
      return;
    }
    await enemyTurn(getMine());
  }

  // Cambiar de Pokémon gasta el turno (el salvaje ataca al que entra), salvo si el anterior se debilitó
  async function switchTo(uid) {
    const forced = phase === "forceSwitch";
    const outgoing = getMine();
    const incoming = partyRef.current.find((p) => p.uid === uid);
    const inName = formatName(incoming.name);
    setPhase("busy");
    select(uid);
    setMessage(forced ? `¡Adelante, ${inName}!` : `¡Regresa, ${formatName(outgoing.name)}! ¡Adelante, ${inName}!`);
    if (!(await pause())) return;
    if (forced) {
      setMessage(`¿Qué hará ${inName}?`);
      setPhase("choosing");
      return;
    }
    await enemyTurn(incoming);
  }

  async function throwBall() {
    setPhase("busy");
    setMessage("¡Lanzas una Pokébola!");
    if (!(await pause(1100))) return;
    if (Math.random() < catchChance(wildHp, wildMax)) {
      const joinsTeam = partyRef.current.length < PARTY_SIZE;
      addCaptured(wild);
      finish(
        joinsTeam
          ? `¡Atrapaste a ${wildName}! Se unió a tu equipo.`
          : `¡Atrapaste a ${wildName}! Tu equipo está lleno: lo enviaste a la caja.`
      );
      return;
    }
    setMessage(`¡${wildName} escapó de la Pokébola!`);
    if (!(await pause())) return;
    await enemyTurn(getMine());
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
    await enemyTurn(getMine());
  }

  const mine = party.find((p) => p.uid === activeUid);
  const myMax = maxHp(mine);
  const canAct = phase === "choosing";
  const canSwitch = canAct && party.some((p) => p.uid !== activeUid && isAvailable(p));

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

      <img key={mine.uid} className="bt-my-sprite" src={mine.sprites.back ?? mine.sprites.front} alt={mine.name} />
      <div className="bt-my-info">
        <strong>{formatName(mine.name)}</strong>
        <HpBar current={mine.hp} max={myMax} />
      </div>

      {(phase === "switching" || phase === "forceSwitch") && (
        <SwitchPanel
          party={party}
          activeUid={activeUid}
          forced={phase === "forceSwitch"}
          onPick={switchTo}
          onCancel={() => setPhase("choosing")}
        />
      )}

      <div className="bt-bottom">
        <p className="bt-message">{message}</p>
        <div className="bt-menu">
          {phase === "ended" ? (
            <button onClick={onExit}>Continuar</button>
          ) : (
            <>
              <button disabled={!canAct} onClick={attack}>Atacar</button>
              <button disabled={!canSwitch} onClick={() => setPhase("switching")}>Pokémon</button>
              <button disabled={!canAct} onClick={throwBall}>
                <img src={asset("/sprites/ui/pokeball.png")} alt="" /> Pokébola
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
  const { area, party, endBattle } = useGame();
  const wild = useWildPokemon(area.types);
  // Primer Pokémon del equipo que puede pelear (se fija al empezar la batalla)
  const [firstUid] = useState(() => party.find(isAvailable)?.uid ?? null);

  const loading = wild.status === "loading";
  const failed = wild.status === "error" || firstUid === null;

  // Mientras carga o si hay un error se puede salir con Esc
  useEffect(() => {
    if (!loading && !failed) return;
    const onKey = (e) => {
      if (e.key === "Escape") endBattle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, failed, endBattle]);

  return (
    <div
      className="bt"
      style={{ width: area.map[0].length * TILE_PX, height: area.map.length * TILE_PX, background: area.battleBg }}
    >
      {failed ? (
        <div className="bt-center">
          <p>{firstUid === null ? "Tus Pokémon están agotados." : "No se pudo cargar el Pokémon."}</p>
          {firstUid !== null && <p className="bt-hint">{wild.error}</p>}
          {firstUid !== null && <button onClick={wild.retry}>Reintentar</button>}
          <button onClick={endBattle}>Volver al mapa</button>
        </div>
      ) : loading ? (
        <div className="bt-center">
          <p>Buscando un Pokémon salvaje...</p>
        </div>
      ) : (
        <BattleScene wild={wild.pokemon} firstUid={firstUid} />
      )}
    </div>
  );
}
