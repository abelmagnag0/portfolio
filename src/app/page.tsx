import { AboutSection } from '@/library/sections/about';
import { ContactSection } from '@/library/sections/contact';
import { Footer } from '@/library/sections/footer';
import { HeroSection } from '@/library/sections/hero';
import { Navbar } from '@/library/sections/navbar';
import ProjectsSectionSSR from '@/library/sections/projects-ssr';
import { projectsData } from '@/library/sections/projects.data';
import { SkillsSection } from '@/library/sections/skills';
import { NavigationJsonLd } from '@/library/seo/navigation-jsonld';
import { ProjectsJsonLd } from '@/library/seo/projects-jsonld';
import { WebsiteJsonLd } from '@/library/seo/website-jsonld';

export default function Home() {
  return (
    <>
      <WebsiteJsonLd />
      <NavigationJsonLd />
      <ProjectsJsonLd projects={projectsData} />
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSectionSSR />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
