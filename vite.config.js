import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" permite desplegar en un subpath (p. ej. GitHub Pages) sin romper los sprites.
export default defineConfig({ base: "./", plugins: [react()] });
