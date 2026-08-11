import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ScrollProvider } from './components/layout/ScrollProvider'
import { AnimatedRoutes } from './components/transition/AnimatedRoutes'

/**
 * La app se sirve bajo el base `/portfolio/` (vite.config) en el despliegue,
 * pero bajo `/` en preview local. El basename se ajusta a la ruta real de
 * carga para que `/portfolio/` (o `/`) resuelva la pantalla de inicio `/`.
 */
const APP_BASE = window.location.pathname.startsWith('/portfolio') ? '/portfolio' : '/'

function App() {
  return (
    <BrowserRouter basename={APP_BASE}>
      <ScrollProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </ScrollProvider>
    </BrowserRouter>
  )
}

export default App
