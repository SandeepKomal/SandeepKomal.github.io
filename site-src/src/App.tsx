import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import StackSection from './sections/StackSection';
import ArchitectureSection from './sections/ArchitectureSection';
import ProjectsSection from './sections/ProjectsSection';
import JourneySection from './sections/JourneySection';
import ContactSection from './sections/ContactSection';

export default function App() {
  return (
    <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <StackSection />
      <ArchitectureSection />
      <ProjectsSection />
      <JourneySection />
      <ContactSection />
    </main>
  );
}
