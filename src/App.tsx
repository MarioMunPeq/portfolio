import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ScrollProvider } from './components/layout/ScrollProvider'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProjectDetail } from './pages/ProjectDetail'

function App() {
  return (
    <BrowserRouter>
      <ScrollProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/proyectos/:slug" element={<ProjectDetail />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ScrollProvider>
    </BrowserRouter>
  )
}

export default App
