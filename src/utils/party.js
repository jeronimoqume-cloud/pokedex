import { PARTY_SIZE, REGEN_PER_STEP, REVIVE_AT } from "../game/config.js";
import { maxHp } from "./battle.js";

// La "caja" (box) guarda todos los Pokémon del jugador; los primeros PARTY_SIZE forman el equipo.
// Cada Pokémon del jugador es un Pokémon de la PokeAPI más { uid, hp, fainted, starter? }.

export function newUid() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function makeMember(pokemon, extra = {}) {
  return { ...pokemon, uid: newUid(), hp: maxHp(pokemon), fainted: false, ...extra };
}

export const isAvailable = (member) => !member.fainted && member.hp > 0;

export const getParty = (box) => box.slice(0, PARTY_SIZE);

// Cambia los PS de un Pokémon; al llegar a 0 queda debilitado
export function setMemberHp(box, uid, hp) {
  return box.map((p) => (p.uid === uid ? { ...p, hp, fainted: hp <= 0 } : p));
}

// Recuperación por paso caminado. Un Pokémon debilitado sigue fuera de combate
// hasta recuperar REVIVE_AT de sus PS. Devuelve la misma caja si no hay nada que curar.
export function regenBox(box) {
  let changed = false;
  const next = box.map((p) => {
    const max = maxHp(p);
    if (p.hp >= max) return p;
    changed = true;
    const hp = Math.min(max, p.hp + Math.max(1, Math.round(max * REGEN_PER_STEP)));
    return { ...p, hp, fainted: !!p.fainted && hp < Math.ceil(max * REVIVE_AT) };
  });
  return changed ? next : box;
}

// Cura total (al desmayarse todo el equipo)
export function healAll(box) {
  return box.map((p) => ({ ...p, hp: maxHp(p), fainted: false }));
}
