import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { HUD } from './HUD'
import { TopBar } from '../ui/TopBar'
import { BottomBar } from '../ui/BottomBar'
import { Cursor } from './Cursor'
import { LoadScreen } from '../overlay/LoadScreen'
import { Grain } from '../primitives/Grain'

interface LayoutProps {
  children: ReactNode
}

const CONTEXT: Record<string, string> = {
  '/about': 'PERFIL',
  '/projects': 'INVENTARIO',
  '/experience': 'PROGRESO',
  '/education': 'FORMACIÓN',
  '/contact': 'CONTACTO',
  '/404': 'ERROR 404',
}

const contextFor = (path: string) => {
  if (path.startsWith('/proyectos/')) return 'INVENTARIO'
  return CONTEXT[path] ?? 'SISTEMA'
}

/** Contexto del footer: en Formación se muestra la ubicación del hero. */
const footerContextFor = (path: string) => {
  if (path === '/education') return 'Valladolid · Es'
  return contextFor(path)
}

/**
 * Marco de las pantallas: TopBar/BottomBar unificadas en todas las
 * pantallas internas salvo el menú principal (trae su propia topbar) y
 * Experiencia (conserva su diseño rojo de chat y su HUD). El cargador,
 * el grano y el cursor viven por encima de todo.
 */
export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()
  const showBars = pathname !== '/' && pathname !== '/experience'

  return (
    <div className="min-h-dvh bg-bg-hero text-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:uppercase focus:tracking-widest focus:text-paper"
      >
        Saltar al contenido
      </a>
      <LoadScreen />
      {pathname === '/experience' ? <HUD /> : null}
      {showBars && <TopBar context={contextFor(pathname)} />}
      {showBars && <BottomBar context={footerContextFor(pathname)} />}
      <Grain />
      <Cursor />
      <main id="main">{children}</main>
    </div>
  )
}
