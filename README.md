# PokeGame

RPG explorable hecho con React + Vite y la [PokeAPI](https://pokeapi.co).

## Ejecutar

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente http://localhost:5173). Necesita internet para consultar la PokeAPI.

## Controles

| Tecla | Acción |
|---|---|
| Flechas / WASD | Moverse |
| P | Abrir o cerrar la Pokédex |
| Esc | Cerrar la Pokédex, volver al mapa al terminar una batalla, o ir al título desde el mapa (se guarda solo) |
| Enter | Continuar al terminar una batalla |

## Cómo se juega

- Camina por el pasto alto: en cada paso hay probabilidad de un encuentro con un Pokémon salvaje.
- En la batalla elige **Atacar**, **Pokébola** o **Huir**. Para atrapar a un Pokémon hay que debilitarlo
  **sin derrotarlo**: cuanto menos vida le quede, más probabilidad de captura.
- Los círculos amarillos en los bordes del mapa son salidas: el **Bosque** conecta con la **Nieve** (izquierda)
  y la **Cueva** (derecha). Cada área tiene Pokémon de distintos tipos.
- La **Pokédex** busca cualquier Pokémon por nombre o número y muestra sus estadísticas.
- Tu **equipo** son tus primeros 6 Pokémon (Pikachu y lo que atrapes); el resto va a la caja. En batalla usa **Pokémon**
  para cambiar de uno: gasta el turno (el salvaje ataca al que entra), salvo cuando el anterior se debilitó.
- Los PS **se conservan entre batallas** y caminar los recupera poco a poco. Un Pokémon debilitado no puede pelear
  hasta recuperar el 25 % de sus PS (unos 9 pasos). Si todo tu equipo cae, vuelves al inicio del Bosque con todos curados.
- La pantalla de **título** permite **Continuar**, empezar una **Nueva partida** o **Borrar datos guardados**.
  El juego se guarda solo (equipo, PS, área y posición) en el navegador (`localStorage`).

## Ajustes rápidos (`src/game/config.js`)

`MAX_ID` (Pokémon que pueden aparecer, 151 = Gen 1), `ENCOUNTER_CHANCE`, `STARTER_ID`, `FLEE_CHANCE`, `PLAYER_HP_MULTIPLIER`,
`PARTY_SIZE` (tamaño del equipo), `REGEN_PER_STEP` (PS que se recuperan por paso) y `REVIVE_AT` (PS necesarios para que un debilitado vuelva a pelear).

## Desplegar

```bash
npm run build   # genera dist/
```

`vite.config.js` usa `base: "./"`, por lo que `dist/` funciona también bajo un subpath (por ejemplo GitHub Pages).

## Créditos

Ver `public/sprites/CREDITS.md`.
