import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { transitionBus } from '../transition/transition-bus'

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
  animDelay?: number
  rotation?: number
  offsetX?: number
  widthPx?: number
}

/**
 * Item de navegación del menú principal — placa angular con icono de
 * mando (△ □ ○ ✕), label y subtítulo. Cada item recibe rotación y
 * offset individuales para composición caótica tipo Persona 5.
 *
 * Navigation triggers the transition video FIRST, then navigates once
 * the screen is visually covered. This prevents the destination from
 * flashing before the transition overlay appears.
 */
export function CommandNavItem({
  icon,
  label,
  sub,
  path,
  animDelay = 0,
  rotation = 0,
  offsetX = 0,
  widthPx = 380,
}: CommandNavItemProps) {
  const { glyph, colorClass } = ICONS[icon]
  const navigate = useNavigate()
  const navigating = useRef(false)

  const handleNav = async () => {
    if (navigating.current) return
    navigating.current = true

    transitionBus.markExternallyStarted()
    await transitionBus.playUntilCovered()
    navigate(path)
  }

  return (
    <li
      className="hero-command-item"
      style={
        {
          '--off': `${offsetX}px`,
          '--rot': `${rotation}deg`,
          width: `min(${widthPx}px, 100%)`,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        onClick={handleNav}
        data-cursor="open"
        className="hero-cmd metro-menu-btn group w-full border-none text-left"
        style={{ animationDelay: `${animDelay}s` }}
      >
        <span aria-hidden="true" className="hero-cmd-track" />
        <span
          aria-hidden="true"
          className={`hero-btn-icon flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 border-current text-[17px] font-bold [transform:skewX(11deg)] ${colorClass}`}
        >
          {glyph}
        </span>
        <span className="whitespace-nowrap [transform:skewX(11deg)] font-p5-menu text-[26px] leading-none tracking-[0.02em] text-paper transition-colors duration-200 [text-shadow:2px_2px_0_color-mix(in_srgb,var(--color-ink)_60%,transparent)] group-hover:text-ink group-hover:[text-shadow:none] group-focus-visible:text-ink sm:text-[32px] lg:text-[34px] xl:text-[42px]">
          {label}
        </span>
        <span className="ml-auto hidden self-center whitespace-nowrap font-display text-[14px] uppercase tracking-[0.06em] text-paper/50 [transform:skewX(11deg)] transition-colors duration-200 group-hover:text-ink/70 group-focus-visible:text-ink/70 md:block lg:text-[15px]">
          {sub}
        </span>
      </button>
    </li>
  )
}
