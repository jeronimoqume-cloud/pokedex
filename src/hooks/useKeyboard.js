import { useEffect } from "react";

const KEY_TO_DIR = {
  ArrowUp: "up", w: "up", W: "up",
  ArrowDown: "down", s: "down", S: "down",
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
};

export function useKeyboard(onDirection, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      const dir = KEY_TO_DIR[e.key];
      if (!dir) return;
      e.preventDefault();
      onDirection(dir);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDirection, enabled]);
}
