import { AboutSection } from '@/library/sections/about';
import { Footer } from '@/library/sections/footer';
import { HeroSection } from '@/library/sections/hero';
import { Navbar } from '@/library/sections/navbar';
import { SkillsSection } from '@/library/sections/skills';
import { SettingsProvider } from '@/library/utils/settings-provider';
import dynamic from 'next/dynamic';

const ProjectsSection = dynamic(() => import('@/library/sections/projects').then(m => m.ProjectsSection), {
  ssr: true,
  loading: () => null,
});
const ContactSection = dynamic(() => import('@/library/sections/contact').then(m => m.ContactSection), {
  ssr: true,
  loading: () => null,
});

export default function Home() {
  return (
    <SettingsProvider>
      {/* JSON-LD: Person & WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Abel Magnago",
            url: "https://abel.dev.br/",
            inLanguage: "pt-BR",
            description:
              "Portfólio de Abel Magnago, desenvolvedor Full Stack e Mobile. Especialista em React, Next.js, Node.js, TypeScript, React Native e AWS.",
            sameAs: [
              "https://github.com/abelmagnag0",
              "https://www.linkedin.com/in/abel-magnago1",
            ],
            creator: {
              "@type": "Person",
              name: "Abel Magnago",
              url: "https://abel.dev.br/",
              jobTitle: "Desenvolvedor Full Stack",
              knowsAbout: [
                "React",
                "Next.js",
                "Node.js",
                "TypeScript",
                "React Native",
                "AWS",
                "Serverless",
              ],
              sameAs: [
                "https://github.com/abelmagnag0",
                "https://www.linkedin.com/in/abel-magnago1",
              ],
            },
          }),
        }}
      />
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
    </SettingsProvider>
  );
}
