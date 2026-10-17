import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import ScrollManager from './components/ScrollManager';
import AboutPage from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import VenturesPage from './pages/VenturesPage';
import ContactSection from './sections/ContactSection';

/** Every page ends with the contact section and footer. */
function Layout() {
  return (
    <main id="top" className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <Outlet />
      <ContactSection />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="ventures" element={<VenturesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
