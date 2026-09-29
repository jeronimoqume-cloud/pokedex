import { useState } from "react";
import { useGame } from "../game/GameContext.jsx";
import { TILE_PX } from "../game/config.js";
import { asset } from "../utils/asset.js";
import "./title.css";

export default function Title() {
  const { area, getSaveSummary, continueGame, newGame, deleteSave } = useGame();
  const [save, setSave] = useState(() => getSaveSummary()); // null si no hay partida
  const [confirm, setConfirm] = useState(null); // null | "new" | "delete"
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  function onContinue() {
    if (!continueGame()) {
      setSave(getSaveSummary());
      setNotice("No se pudo leer la partida guardada.");
    }
  }

  async function startNew() {
    setBusy(true);
    setNotice("");
    try {
      await newGame(); // al terminar, esta pantalla se cierra sola
    } catch (err) {
      setBusy(false);
      setConfirm(null);
      setNotice(`No se pudo empezar (${err.message}). Revisa tu conexión e inténtalo otra vez.`);
    }
  }

  function onDelete() {
    deleteSave();
    setSave(null);
    setConfirm(null);
    setNotice("Partida borrada.");
  }

  return (
    <div className="tt" style={{ width: area.map[0].length * TILE_PX, height: area.map.length * TILE_PX }}>
      <img className="tt-ball" src={asset("/sprites/ui/pokeball.png")} alt="" />
      <h1 className="tt-title">POKEGAME</h1>
      <p className="tt-sub">Explora, batalla y atrapa Pokémon</p>

      {confirm ? (
        <div className="tt-confirm">
          <p>
            {confirm === "new"
              ? "Ya tienes una partida guardada. Empezar una nueva la reemplazará."
              : "¿Borrar tu partida guardada? No se puede deshacer."}
          </p>
          <div className="tt-row">
            <button className="tt-danger" onClick={confirm === "new" ? startNew : onDelete} disabled={busy}>
              {busy ? "Cargando..." : confirm === "new" ? "Sí, empezar de nuevo" : "Sí, borrar"}
            </button>
            <button onClick={() => setConfirm(null)} disabled={busy}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="tt-menu">
          <button autoFocus={!!save} disabled={!save || busy} onClick={onContinue}>
            Continuar
            {save && <small>{save.areaName} · {save.captured} capturados</small>}
          </button>
          <button
            autoFocus={!save}
            disabled={busy}
            onClick={() => (save ? setConfirm("new") : startNew())}
          >
            {busy ? "Cargando..." : "Nueva partida"}
          </button>
          <button className="tt-danger" disabled={!save || busy} onClick={() => setConfirm("delete")}>
            Borrar datos guardados
          </button>
        </div>
      )}

      <p className="tt-notice">{notice}</p>
    </div>
  );
}
