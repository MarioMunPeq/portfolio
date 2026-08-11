import { Link } from 'react-router-dom'

export type HeroIcon = 'triangle' | 'square' | 'circle' | 'cross' | 'asterisk'

const ICONS: Record<HeroIcon, { glyph: string; colorClass: string }> = {
  triangle: { glyph: '△', colorClass: 'text-face-tri' },
  square: { glyph: '□', colorClass: 'text-face-sq' },
  circle: { glyph: '○', colorClass: 'text-face-cir' },
  cross: { glyph: '✕', colorClass: 'text-face-cross' },
  asterisk: { glyph: '※', colorClass: 'text-face-ast' },
}

interface CommandNavItemProps {
  icon: HeroIcon
  label: string
  sub: string
  path: string
}

/**
 * Ítem de la navegación de comandos del menú principal: tarjeta angular
 * sesgada con icono de botón de mando (△ □ ○ ✕ ※), label y subtítulo.
 * El `li` declara las variables --off/--rot (ver .hero-command-item en
 * tokens.css); la tarjeta hereda el offset/rotación por ítem y se inclina
 * a la izquierda con un glitch-slice al hacer hover. Navegable por teclado
 * (Link) y dispara el cursor decorativo.
 */
export function CommandNavItem({ icon, label, sub, path }: CommandNavItemProps) {
  const { glyph, colorClass } = ICONS[icon]

  return (
    <li className="hero-command-item">
      <Link
        to={path}
        data-cursor
        className="hero-cmd group"
      >
        <span aria-hidden="true" className="hero-cmd-track" />
        <span
          aria-hidden="true"
          className={`hero-btn-icon flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2 border-current text-[15px] font-bold [transform:skewX(10deg)] ${colorClass}`}
        >
          {glyph}
        </span>
        <span className="whitespace-nowrap [transform:skewX(10deg)] font-display text-[24px] uppercase leading-none tracking-[0.02em] text-paper transition-colors duration-200 [text-shadow:2px_2px_0_color-mix(in_srgb,var(--color-ink)_60%,transparent)] group-hover:text-ink group-hover:[text-shadow:none] group-focus-visible:text-ink sm:text-[30px] lg:text-[38px]">
          {label}
        </span>
        <span className="ml-auto hidden self-center whitespace-nowrap [transform:skewX(10deg)] text-[15px] tracking-[0.06em] text-paper/50 transition-colors duration-200 group-hover:text-ink/70 group-focus-visible:text-ink/70 md:block">
          {sub}
        </span>
      </Link>
    </li>
  )
}
