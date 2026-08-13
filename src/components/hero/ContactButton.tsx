import { Link } from 'react-router-dom'

/**
 * Botón "CONTACTO" del pie del menú principal: placa angular con borde
 * rojo de base y sombra offset roja profunda que se rellena de rojo al
 * hover/focus, con el mismo glitch-slice que las tarjetas de comando.
 * Navega directamente a la sección de contacto y dispara el cursor
 * decorativo. Es el acceso directo a CONTACTO sin depender del menú.
 */
export function ContactButton() {
  return (
    <Link
      to="/contact"
      data-cursor="contact"
      className="hero-enter group relative inline-block overflow-hidden border-2 border-accent px-[26px] py-[14px] font-display text-[13px] uppercase tracking-[0.1em] text-paper [clip-path:polygon(0_0,94%_0,100%_100%,6%_100%)] [box-shadow:3px_3px_0_var(--color-accent-deep)] transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink hover:[box-shadow:5px_5px_0_var(--color-paper)] focus-visible:border-accent focus-visible:bg-accent focus-visible:text-ink"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-paper opacity-0 [clip-path:polygon(0_84%,100%_84%,100%_88%,0_88%)] group-hover:animate-[hero-glitch_0.22s_steps(3)_1] group-focus-visible:animate-[hero-glitch_0.22s_steps(3)_1]"
      />
      <span className="relative">Contacto</span>
    </Link>
  )
}
