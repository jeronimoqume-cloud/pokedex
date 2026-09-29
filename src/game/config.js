export const MAX_ID = 151;          // Generación 1. Súbelo para incluir más Pokémon.
export const TILE_SIZE = 16;        // tamaño real de los sprites (px)
export const SCALE = 3;             // escala en pantalla (16 x 3 = 48 px)
export const TILE_PX = TILE_SIZE * SCALE;
export const ENCOUNTER_CHANCE = 0.15; // probabilidad de encuentro por paso en pasto alto
export const MOVE_DELAY_MS = 130;   // tiempo mínimo entre pasos

// Batalla (Paso 4)
export const STARTER_ID = 25;          // Pokémon inicial del jugador (25 = Pikachu)
export const PLAYER_HP_MULTIPLIER = 2; // el Pokémon del jugador tiene el doble de PS para que la batalla sea justa
export const FLEE_CHANCE = 0.7;        // probabilidad de huir con éxito
export const TURN_DELAY_MS = 900;      // pausa entre mensajes de la batalla
