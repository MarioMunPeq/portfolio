import { useState } from 'react'
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
  '/education': 'FORMACIoN',
  '/404': 'ERROR 404',
}

const contextFor = (path: string) => {
  if (path.startsWith('/proyectos/')) return 'INVENTARIO'
  return CONTEXT[path] ?? 'SISTEMA'
}

/**
 * Marco de las pantallas: TopBar unificada en todas las pantallas internas
 * salvo el menu principal (trae su propia topbar) y Experiencia (conserva
 * su diseño rojo de chat y su HUD). El footer global (◆ GITHUB ◆ LINKEDIN)
 * se monta en TODAS las pantallas, incluido el menu principal. El cargador,
 * el grano y el cursor viven por encima de todo.
 */
export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()
  const showTopBar = pathname !== '/' && pathname !== '/experience'
  const [loadscreenDone, setLoadscreenDone] = useState(false)

  return (
    <div className="min-h-dvh bg-bg-hero text-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:uppercase focus:tracking-widest focus:text-paper"
      >
        Saltar al contenido
      </a>
      <LoadScreen onExitReady={() => setLoadscreenDone(true)} />
      {pathname === '/experience' ? <HUD /> : null}
      {showTopBar && <TopBar context={contextFor(pathname)} />}
      <BottomBar />
      <Grain />
      <Cursor />
      <main id="main">{children}</main>
    </div>
  )
}
