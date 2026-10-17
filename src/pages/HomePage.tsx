import { usePageTitle } from '../hooks/usePageTitle';
import AboutSection from '../sections/AboutSection';
import EducationSection from '../sections/EducationSection';
import ExperienceSection from '../sections/ExperienceSection';
import HeroSection from '../sections/HeroSection';
import MarqueeSection from '../sections/MarqueeSection';
import ProjectsSection from '../sections/ProjectsSection';
import ServicesSection from '../sections/ServicesSection';
import VenturesSection from '../sections/VenturesSection';

export default function HomePage() {
  usePageTitle();
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <VenturesSection />
    </>
  );
}
