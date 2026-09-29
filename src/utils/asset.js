// Convierte "/sprites/x.png" en una ruta que respeta la base de Vite,
// para que el juego funcione también si se despliega bajo un subpath.
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, "");
