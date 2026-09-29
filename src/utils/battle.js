// Daño = (ataque / defensa) * 12 * aleatorio(0.85 a 1).
// La relación ataque/defensa se limita entre 0.5 y 2 para que ningún combate sea absurdo.
export function calcDamage(attacker, defender, rng = Math.random) {
  const ratio = Math.min(2, Math.max(0.5, attacker.stats.attack / Math.max(1, defender.stats.defense)));
  return Math.max(1, Math.round(ratio * 12 * (0.85 + rng() * 0.15)));
}

// Más probabilidad de captura cuanto menos vida le queda al Pokémon (tope 95%)
export function catchChance(currentHp, maxHp) {
  return Math.min(0.95, 0.2 + 0.6 * (1 - currentHp / maxHp));
}
