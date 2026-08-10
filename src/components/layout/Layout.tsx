import { Outlet } from 'react-router-dom'
import { Cursor } from './Cursor'
import { ScrollProgress } from './ScrollProgress'
import { Navigation } from '../navigation/Navigation'
import { LoadScreen } from '../overlay/LoadScreen'

export function Layout() {
  return (
    <div className="min-h-dvh bg-bg-hero text-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:uppercase focus:tracking-widest focus:text-paper"
      >
        Saltar al contenido
      </a>
      <LoadScreen />
      <Cursor />
      <ScrollProgress />
      <Navigation />
      <main id="main">
        <Outlet />
      </main>
    </div>
  )
}
