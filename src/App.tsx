import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ScrollProvider } from './components/layout/ScrollProvider'
import { AnimatedRoutes } from './components/transition/AnimatedRoutes'

function App() {
  return (
    <BrowserRouter>
      <ScrollProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </ScrollProvider>
    </BrowserRouter>
  )
}

export default App
