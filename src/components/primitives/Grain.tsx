/**
 * Grano de imprenta fijo sobre toda la interfaz — firma visual Persona 5.
 * Capa estatica (no anima) por encima del contenido pero bajo el cursor
 * y el cargador. Decorativa, nunca intercepta interaccion.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[115] bg-noise opacity-[0.05]"
    />
  );
}
