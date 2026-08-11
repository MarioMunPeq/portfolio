import { Link } from 'react-router-dom'

export type HeroIcon = 'triangle' | 'square' | 'circle' | 'cross'

const ICONS: Record<HeroIcon, { glyph: string; colorClass: string }> = {
  triangle: { glyph: '△', colorClass: 'text-face-tri' },
  square: { glyph: '□', colorClass: 'text-face-sq' },
  circle: { glyph: '○', colorClass: 'text-face-cir' },
  cross: { glyph: '✕', colorClass: 'text-face-cross' },
}

interface CommandNavItemProps {
  icon: HeroIcon
  num: string
  label: string
  sub: string
  path: string
}

/**
 * Ítem de la navegación de comandos del menú principal: tarjeta angular
 * sesgada con icono de botón de mando (△ □ ○ ✕), número, label y subtítulo.
 * El `li` declara las variables --off/--rot (ver .hero-command-item en
 * tokens.css); la tarjeta hereda el offset/rotación por ítem y se inclina
 * a la izquierda con un glitch-slice al hacer hover. Navegable por teclado
 * (Link) y dispara el cursor decorativo.
 */
export function CommandNavItem({ icon, num, label, sub, path }: CommandNavItemProps) {
  const { glyph, colorClass } = ICONS[icon]

  return (
    <li className="hero-command-item">
      <Link
        to={path}
        data-cursor
        className="hero-cmd group"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-paper opacity-0 [clip-path:polygon(0_40%,100%_40%,100%_46%,0_46%)] group-hover:animate-[hero-glitch_0.35s_steps(2)_1]"
        />
        <span
          aria-hidden="true"
          className={`hero-btn-icon flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-current text-[13px] font-bold [transform:skewX(8deg)] ${colorClass}`}
        >
          {glyph}
        </span>
        <span className="[transform:skewX(8deg)] font-display text-[11px] leading-none text-accent transition-colors duration-200 group-hover:text-ink group-focus-visible:text-ink">
          {num}
        </span>
        <span className="whitespace-nowrap [transform:skewX(8deg)] font-display text-[20px] uppercase leading-none tracking-[0.02em] text-paper transition-colors duration-200 [text-shadow:2px_2px_0_color-mix(in_srgb,var(--color-ink)_60%,transparent)] group-hover:text-ink group-hover:[text-shadow:none] group-focus-visible:text-ink sm:text-[25px] lg:text-[30px]">
          {label}
        </span>
        <span className="ml-auto hidden self-center whitespace-nowrap [transform:skewX(8deg)] text-[9px] tracking-[0.06em] text-paper/50 transition-colors duration-200 group-hover:text-ink/70 group-focus-visible:text-ink/70 sm:block">
          {sub}
        </span>
      </Link>
    </li>
  )
}
