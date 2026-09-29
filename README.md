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
| Esc | Cerrar la Pokédex (o volver al mapa al terminar una batalla) |
| Enter | Continuar al terminar una batalla |

## Cómo se juega

- Camina por el pasto alto: en cada paso hay probabilidad de un encuentro con un Pokémon salvaje.
- En la batalla elige **Atacar**, **Pokébola** o **Huir**. Para atrapar a un Pokémon hay que debilitarlo
  **sin derrotarlo**: cuanto menos vida le quede, más probabilidad de captura.
- Los círculos amarillos en los bordes del mapa son salidas: el **Bosque** conecta con la **Nieve** (izquierda)
  y la **Cueva** (derecha). Cada área tiene Pokémon de distintos tipos.
- La **Pokédex** busca cualquier Pokémon por nombre o número y muestra sus estadísticas.

## Ajustes rápidos (`src/game/config.js`)

`MAX_ID` (Pokémon que pueden aparecer, 151 = Gen 1), `ENCOUNTER_CHANCE`, `STARTER_ID`, `FLEE_CHANCE`, `PLAYER_HP_MULTIPLIER`.

## Créditos

Ver `public/sprites/CREDITS.md`.
