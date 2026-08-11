import { Link } from 'react-router-dom'

/**
 * Botón "ENTRAR AL SISTEMA" del pie del menú principal: placa angular
 * con sombra offset roja profunda que se rellena de rojo al hover/focus.
 * Navega al inventario (proyectos) y dispara el cursor decorativo.
 */
export function EnterButton() {
  return (
    <Link
      to="/projects"
      data-cursor
      className="hero-enter inline-block border border-paper px-[26px] py-[14px] font-display text-[13px] uppercase tracking-[0.1em] text-paper [clip-path:polygon(0_0,94%_0,100%_100%,6%_100%)] [box-shadow:3px_3px_0_var(--color-accent-deep)] transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink hover:[box-shadow:5px_5px_0_var(--color-paper)] focus-visible:border-accent focus-visible:bg-accent focus-visible:text-ink"
    >
      Entrar al sistema
    </Link>
  )
}
