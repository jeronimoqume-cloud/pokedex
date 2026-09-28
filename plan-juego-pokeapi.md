# Plan del proyecto: RPG Pokémon con React y PokeAPI

**Plazo total:** 2 horas
**Stack:** React (Vite) + PokeAPI

---

## 1. Idea del juego

Un RPG explorable donde el personaje camina por mapas, se encuentra con Pokémon salvajes en el pasto, los enfrenta en una batalla por turnos y puede atraparlos. Además, tiene un dispositivo (Pokédex) para buscar cualquier Pokémon y ver su nombre, tipo y estadísticas.

### Funciones principales

1. **Exploración:** movimiento del personaje con las flechas o WASD sobre un mapa de cuadrícula.
2. **Áreas por tipo:** cada área tiene su propio mapa y los Pokémon que aparecen dependen de los tipos asignados a ella.
3. **Batalla por turnos:** Atacar, lanzar Pokébola o Huir. Se puede atrapar después de pelear.
4. **Pokédex:** un dispositivo que se abre con una tecla, con búsqueda por nombre o número y muestra de nombre, tipo, imagen y estadísticas.

---

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Sprites del personaje y del mapa | **Assets gratuitos** (Kenney.nl, OpenGameArt, itch.io). No se dibuja nada a mano, salvo que sea indispensable. |
| Sprites de los Pokémon | Vienen de la PokeAPI (`front_default` y `back_default`). |
| Audio | **Por ahora nada de audio.** Se puede agregar al final si sobra tiempo. |
| Pokémon incluidos | **Generación 1 (IDs 1 a 151)**, controlado por una sola constante `MAX_ID`. |
| Pokédex | Puede buscar cualquier Pokémon de la API (no solo los de la Gen 1). |
| Áreas | Empezar con **3 áreas** y agregar más si hay tiempo. |
| Batalla | Versión simplificada: sin movimientos reales, sin niveles ni experiencia. |

---

## 3. Alcance

### Mínimo indispensable (MVP)

- Un mapa explorable con movimiento y colisiones.
- Pasto alto que genera encuentros aleatorios.
- Batalla por turnos con captura.
- Pokédex con búsqueda y estadísticas.
- 3 áreas con sus Pokémon según el tipo.

### Opcional (solo si sobra tiempo)

- Las otras 3 áreas.
- Animación de caminata del personaje.
- Equipo con varios Pokémon capturados y cambio entre ellos.
- Guardado de progreso (`localStorage`).
- Audio y efectos de sonido.

---

## 4. Áreas y tipos de Pokémon

| Área | Tipos | Assets a buscar |
|---|---|---|
| **Bosque** (MVP) | Planta, Bicho, Veneno | árboles, pasto alto, arbustos, flores, troncos |
| **Lago / Costa** (MVP) | Agua, Hielo | agua, arena, orilla, muelle, rocas |
| **Cueva / Montaña** (MVP) | Roca, Tierra, Lucha | suelo de piedra, paredes de cueva, rocas, cristales |
| Volcán / Desierto | Fuego, Dragón | lava, arena oscura, roca volcánica, cactus |
| Ciudad / Central eléctrica | Eléctrico, Normal, Acero | edificios, calles, cercas, postes |
| Ruinas / Cementerio | Fantasma, Psíquico, Siniestro, Hada | lápidas, ruinas, niebla, suelo oscuro |

Los Pokémon de tipo Volador pueden aparecer en cualquier área, porque casi todos son de doble tipo. Un Pokémon de doble tipo puede aparecer en las dos áreas que le correspondan.

---

## 5. Sprites gratuitos

**Fuentes:**
- Kenney.nl (licencia CC0, sin atribución)
- OpenGameArt.org (revisar la licencia de cada asset)
- itch.io, sección Game Assets → Free (revisar la licencia)

**Lo que se necesita:**
- Personaje: 4 direcciones (arriba, abajo, izquierda, derecha).
- Tiles por área: suelo, camino, pasto alto, obstáculo (árbol, roca, agua) y entrada/salida.
- Pokébola (puede ser un emoji o un círculo en CSS).

**Reglas:**
- Usar un solo pack por área y mantener el mismo tamaño de tile en todo el juego (16×16 o 32×32).
- No usar sprites sacados de los juegos oficiales de Pokémon para el personaje o el mapa.
- Guardar un archivo `CREDITS.md` con los créditos de los assets que lo requieran.

---

## 6. Uso de la PokeAPI

**Base:** `https://pokeapi.co/api/v2/`

| Necesidad | Endpoint |
|---|---|
| Datos de un Pokémon (nombre, tipos, stats, sprites) | `/pokemon/{nombre o id}` |
| Lista de nombres para el autocompletado de la Pokédex | `/pokemon?limit=1500` |
| Pokémon de un tipo (para las áreas) | `/type/{tipo}` |

**Reglas:**
- Filtrar los Pokémon de cada área con `id <= MAX_ID` (el ID se saca de la URL de cada resultado).
- Guardar en caché (un `Map` en memoria) todo lo que ya se consultó, para no repetir llamadas.
- Manejar estados de carga y error en todas las llamadas.
- Para ampliar el juego más adelante, basta con subir `MAX_ID`.

---

## 7. Sistema de batalla (simplificado)

**Flujo:**
1. Aparece un Pokémon salvaje al pisar pasto alto (probabilidad de encuentro por paso, por ejemplo 15%).
2. El jugador usa un Pokémon inicial.
3. Cada turno el jugador elige una acción; después ataca el rival (si sigue con vida).
4. La batalla termina si alguien se queda sin vida, si el jugador huye o si atrapa al Pokémon.

**Fórmulas propuestas** (fáciles de ajustar):

- **Vida máxima:** `stat hp` de la API.
- **Daño:** `max(1, round((ataque / defensa) * 12 * aleatorio(0.85 a 1)))`
- **Probabilidad de captura:** `0.2 + 0.6 * (1 - vidaActual / vidaMaxima)`, con un tope de 0.95.
- **Huir:** 70% de éxito.

**Estados de la batalla:** `eligiendo` → `atacando` → `turno del rival` → `resultado` (victoria, derrota, captura o huida).

---

## 8. Estructura del proyecto

```
src/
  App.jsx                 # decide qué pantalla mostrar
  game/
    GameContext.jsx       # estado global (modo, jugador, área, capturados)
    config.js             # MAX_ID, tamaño de tile, probabilidad de encuentro
    areas.js              # mapas, tipos y tiles de cada área
  components/
    Map.jsx               # dibuja el mapa y el personaje
    Player.jsx
    Battle.jsx            # pantalla de batalla
    Pokedex.jsx           # dispositivo de búsqueda
    HUD.jsx               # mensajes y controles en pantalla
  hooks/
    useKeyboard.js        # teclas de movimiento y abrir Pokédex
    usePokemon.js         # llamadas a la API con caché
  utils/
    battle.js             # fórmulas de daño y captura
public/
  sprites/                # personaje y tiles
CREDITS.md
```

**Modos del juego (estado principal):** `explorar`, `batalla`, `pokedex`. Cada modo bloquea los controles de los demás.

---

## 9. Plan de programación (paso a paso)

**Regla de trabajo:** cada paso termina con algo que se puede probar en el navegador. No se empieza el siguiente hasta que el anterior funcione.

### Paso 0: Preparación (10 min)
- [ ] Crear el proyecto: `npm create vite@latest pokegame -- --template react`
- [ ] Copiar a `public/sprites/` los assets elegidos.
- [ ] Crear `config.js` con `MAX_ID = 151`, tamaño de tile y probabilidad de encuentro.
- [ ] Crear las carpetas de la estructura.

**Listo cuando:** `npm run dev` abre la app sin errores.

### Paso 1: Mapa y movimiento (20 min)
- [ ] Definir un mapa como matriz de números (0 = suelo, 1 = obstáculo, 2 = pasto alto).
- [ ] Dibujar la matriz con CSS Grid, con una imagen por tile.
- [ ] Crear el personaje con posición `{x, y}` y dirección.
- [ ] Hook `useKeyboard` para flechas/WASD.
- [ ] Colisiones: no entrar a obstáculos ni salir del mapa.

**Listo cuando:** el personaje camina por el mapa y se detiene ante los obstáculos.

### Paso 2: Encuentros aleatorios (15 min)
- [ ] Al pisar pasto alto, tirar la probabilidad de encuentro.
- [ ] Si hay encuentro, cambiar el modo a `batalla`.
- [ ] Crear el estado global con `GameContext` (modo, área, jugador).

**Listo cuando:** al caminar por el pasto aparece una pantalla de batalla vacía y se puede volver al mapa.

### Paso 3: Conexión con la API (15 min)
- [ ] Hook `usePokemon` con `fetch`, caché y manejo de carga/error.
- [ ] Función que pide `/type/{tipo}`, filtra por `MAX_ID` y elige un Pokémon al azar.
- [ ] Asignar los tipos a cada área en `areas.js`.
- [ ] Al iniciar un encuentro, pedir el Pokémon salvaje y guardarlo en el estado.

**Listo cuando:** el nombre y el sprite del Pokémon salvaje aparecen en la pantalla de batalla.

### Paso 4: Batalla por turnos (30 min)
- [ ] Interfaz: Pokémon rival (`front_default`), Pokémon propio (`back_default`), barras de vida, menú de acciones.
- [ ] Elegir el Pokémon inicial del jugador (por ejemplo, fijo al inicio).
- [ ] Acción **Atacar** con la fórmula de daño y turno del rival.
- [ ] Acción **Huir** con 70% de éxito.
- [ ] Acción **Pokébola** con la probabilidad de captura; si tiene éxito, se guarda el Pokémon en `capturados`.
- [ ] Mensajes de cada turno y pantalla de resultado; volver al modo `explorar`.

**Listo cuando:** se puede pelear, atrapar, huir y perder, y siempre se vuelve al mapa.

### Paso 5: Pokédex (20 min)
- [ ] Abrir y cerrar el dispositivo con una tecla (por ejemplo, `P`).
- [ ] Campo de búsqueda con autocompletado usando `/pokemon?limit=1500`.
- [ ] Mostrar imagen, nombre, tipos y barras con las estadísticas.
- [ ] Marcar en la Pokédex cuáles Pokémon ya fueron capturados.

**Listo cuando:** buscar "charizard" o "6" muestra su información correcta.

### Paso 6: Las 3 áreas (15 min)
- [ ] Crear un mapa por área (Bosque, Lago, Cueva) con sus tiles.
- [ ] Puntos de entrada y salida entre áreas.
- [ ] Verificar que en cada área salgan Pokémon de los tipos correctos.

**Listo cuando:** se puede viajar entre las 3 áreas y los encuentros cambian según el área.

### Paso 7: Pulido y cierre (5 a 10 min)
- [ ] Probar el flujo completo de principio a fin.
- [ ] Corregir errores visibles (carga lenta, pantallas vacías).
- [ ] Completar `CREDITS.md`.

### Si sobra tiempo (por prioridad)
1. Las otras 3 áreas.
2. Guardado de progreso con `localStorage`.
3. Equipo con varios Pokémon.
4. Animación de caminata.
5. Audio y efectos de sonido.

---

## 10. Distribución del tiempo

| Paso | Tarea | Tiempo | Acumulado |
|---|---|---|---|
| 0 | Preparación | 10 min | 0:10 |
| 1 | Mapa y movimiento | 20 min | 0:30 |
| 2 | Encuentros aleatorios | 15 min | 0:45 |
| 3 | Conexión con la API | 15 min | 1:00 |
| 4 | Batalla y captura | 30 min | 1:30 |
| 5 | Pokédex | 20 min | 1:50 |
| 6 | Las 3 áreas | 15 min | 2:05 |
| 7 | Pulido | 5 a 10 min | ~2:10 |

Este plan suma un poco más de 2 horas, por eso el orden importa: si se atrasa algo, se recorta primero el paso 6 (dejar una sola área funcional) antes que la batalla o la Pokédex.

---

## 11. Riesgos y cómo evitarlos

| Riesgo | Solución |
|---|---|
| La API responde lento | Caché en memoria y pedir solo lo necesario. |
| Perder tiempo con los sprites | Usar un solo pack por área y no dibujar nada a mano. |
| La batalla se complica | Mantener las fórmulas simples y sin movimientos reales. |
| El estado se vuelve un desorden | Un solo `GameContext` con el modo del juego como control principal. |
| No alcanza el tiempo | Recortar áreas (una sola) y dejar lo opcional para después. |
