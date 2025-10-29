import { AboutSection } from '@/library/sections/about';
import { ContactSection } from '@/library/sections/contact';
import { Footer } from '@/library/sections/footer';
import { HeroSection } from '@/library/sections/hero';
import { Navbar } from '@/library/sections/navbar';
import { ProjectsSection } from '@/library/sections/projects';
import { SkillsSection } from '@/library/sections/skills';
import { ThemeProvider } from '@/library/utils/theme-provider';

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          {/* <TestimonialsSection /> */}
          {/* <ArticlesSection /> */}
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
