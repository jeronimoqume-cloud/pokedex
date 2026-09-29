# PokeGame

A Pokémon-inspired exploration and battle web game built with React and Vite. Explore the Forest, Snow, and Cave areas; encounter wild Pokémon; build your team; and browse the Pokédex.

Pokémon data, statistics, and sprites are provided by [PokeAPI](https://pokeapi.co/).

## Features

- Explore three areas connected through portals.
- Random encounters while walking through tall grass.
- Turn-based battles: attack, throw a Poké Ball, flee, or switch Pokémon.
- A party of up to six Pokémon; additional captures are stored in the box.
- Pokédex search by name or number, with types and stats.
- HP recovery while walking and fainted-Pokémon handling.
- Automatic saving of the party, HP, area, and player position.

## Technologies

- React 18
- Vite 5
- JavaScript and CSS
- [PokeAPI](https://pokeapi.co/)

## Requirements

- Node.js 18 or later
- npm
- An internet connection to query PokeAPI

## Installation and local development

```bash
git clone <REPOSITORY-URL>
cd Pokedex
npm install
npm run dev
```

Open the address shown by Vite in your browser, usually `http://localhost:5173`.

## Controls

| Key | Action |
| --- | --- |
| Arrow keys or WASD | Move the player |
| P | Open or close the Pokédex |
| Esc | Close the Pokédex, return to the map after a battle, or return to the title screen |
| Enter | Continue after a battle ends |

## Save data

The game automatically saves to the browser's `localStorage` under the `pokegame:save` key. It stores the party, captures, HP, current area, and player position.

This lets players continue after refreshing or reopening the browser on the same device and browser. Save data is not shared between users or synchronized across devices, and it is lost if site data is cleared.

## Game configuration

Values such as the starter Pokémon, encounter probability, party size, and HP recovery can be changed in [`src/game/config.js`](src/game/config.js).

## Build and deployment

Create a production build with:

```bash
npm run build
```

The output is created in `dist/`. The project uses `base: "./"` in `vite.config.js`, so it can be deployed to GitHub Pages even when hosted in a subdirectory, such as `https://username.github.io/Pokedex/`.

For GitHub Pages, publish the generated contents of `dist/`. Map resources are bundled with the deployment; Pokémon data and sprites are requested from PokeAPI at runtime.

## Credits

- Map and player assets: see [`public/sprites/CREDITS.md`](public/sprites/CREDITS.md).
- Pokémon data and sprites: [PokeAPI](https://pokeapi.co/).

## AI usage

Artificial-intelligence assistance, including **Claude** and **Codex**, was used during development to support ideation, review, debugging, documentation, and implementation improvements. Final decisions, code integration, and validation were completed within this project.
