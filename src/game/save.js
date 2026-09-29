import { AREAS, START_AREA } from "./areas.js";
import { canWalk } from "../utils/map.js";
import { maxHp } from "../utils/battle.js";

const KEY = "pokegame:save";
const LEGACY_KEY = "pokegame:captured"; // formato anterior (solo capturas), ya no se usa
export const SAVE_VERSION = 2;

function isMember(p) {
  return (
    p && typeof p.uid === "string" && Number.isInteger(p.id) && typeof p.name === "string" &&
    Array.isArray(p.types) && p.stats && typeof p.stats.hp === "number" &&
    p.sprites && typeof p.hp === "number"
  );
}

// Lee y valida la partida guardada. Devuelve null si no existe o está dañada.
export function readSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.version !== SAVE_VERSION || !Array.isArray(data.box) || data.box.length === 0) return null;
    if (!data.box.every(isMember)) return null;

    const box = data.box.map((p) => {
      const hp = Math.min(maxHp(p), Math.max(0, Math.round(p.hp)));
      return { ...p, hp, fainted: hp <= 0 ? true : !!p.fainted };
    });

    const areaId = AREAS[data.areaId] ? data.areaId : START_AREA;
    const area = AREAS[areaId];
    const pos = data.player;
    const valid = pos && Number.isInteger(pos.x) && Number.isInteger(pos.y) && canWalk(area.map, pos.x, pos.y);
    const player = valid
      ? { x: pos.x, y: pos.y, facing: pos.facing === "left" || pos.facing === "right" ? pos.facing : "down" }
      : { ...area.start, facing: "down" };

    return { box, areaId, player };
  } catch {
    return null;
  }
}

export function writeSave({ box, areaId, player }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: SAVE_VERSION, box, areaId, player }));
  } catch {
    /* almacenamiento lleno o bloqueado: el juego sigue sin guardar */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* nada que borrar */
  }
}

// Resumen para mostrar en el título
export function saveSummary() {
  const save = readSave();
  if (!save) return null;
  return {
    areaName: AREAS[save.areaId].name,
    captured: save.box.filter((p) => !p.starter).length,
  };
}
