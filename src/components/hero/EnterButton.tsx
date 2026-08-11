import { Link } from 'react-router-dom'

/**
 * Botón "ENTRAR AL SISTEMA" del pie del menú principal: placa angular con
 * borde rojo de base y sombra offset roja profunda que se rellena de rojo
 * al hover/focus, con el mismo glitch-slice que las tarjetas de comando.
 * Navega al inventario (proyectos) y dispara el cursor decorativo.
 */
export function EnterButton() {
  return (
    <Link
      to="/projects"
      data-cursor
      className="hero-enter group relative inline-block overflow-hidden border-2 border-accent px-[26px] py-[14px] font-display text-[13px] uppercase tracking-[0.1em] text-paper [clip-path:polygon(0_0,94%_0,100%_100%,6%_100%)] [box-shadow:3px_3px_0_var(--color-accent-deep)] transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink hover:[box-shadow:5px_5px_0_var(--color-paper)] focus-visible:border-accent focus-visible:bg-accent focus-visible:text-ink"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-paper opacity-0 [clip-path:polygon(0_40%,100%_40%,100%_46%,0_46%)] group-hover:animate-[hero-glitch_0.35s_steps(2)_1] group-focus-visible:animate-[hero-glitch_0.35s_steps(2)_1]"
      />
      <span className="relative">Entrar al sistema</span>
    </Link>
  )
}
