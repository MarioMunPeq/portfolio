import { BrowserRouter, Route } from "react-router-dom";
import { TransitionRoutes } from "./components/transition/TransitionRoutes";
import { VideoTransition } from "./components/transition/VideoTransition";
import { Layout } from "./components/layout/Layout";
import { ScrollProvider } from "./components/layout/ScrollProvider";
import { PetalBackground } from "./components/primitives/PetalBackground";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Projects } from "./pages/Projects";
import { Experience } from "./pages/Experience";
import { Education } from "./pages/Education";
import { ProjectDetail } from "./pages/ProjectDetail";
import { NotFound } from "./pages/NotFound";

/**
 * La app se sirve bajo el base `/portfolio/` (vite.config) en el despliegue,
 * pero bajo `/` en preview local. El basename se ajusta a la ruta real de
 * carga para que `/portfolio/` (o `/`) resuelva la pantalla de inicio `/`.
 */
const APP_BASE = window.location.pathname.startsWith("/portfolio")
  ? "/portfolio"
  : "/";

function App() {
  return (
    <BrowserRouter basename={APP_BASE}>
      <ScrollProvider>
        <PetalBackground />
        <Layout>
          <TransitionRoutes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/proyectos/:slug" element={<ProjectDetail />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </TransitionRoutes>
        </Layout>
        <VideoTransition />
      </ScrollProvider>
    </BrowserRouter>
  );
}

export default App;
