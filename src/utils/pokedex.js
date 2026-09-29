// Sugerencias para el buscador: por número exacto, o por nombre
// (primero los que empiezan con el texto, luego los que lo contienen).
export function searchNames(names, query, limit = 8) {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  if (!q) return [];
  if (/^\d+$/.test(q)) {
    const exact = names.find((n) => n.id === Number(q));
    return exact ? [exact] : [];
  }
  const starts = names.filter((n) => n.name.startsWith(q));
  const contains = names.filter((n) => !n.name.startsWith(q) && n.name.includes(q));
  return [...starts, ...contains].slice(0, limit);
}
