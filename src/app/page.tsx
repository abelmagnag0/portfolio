import { AboutSection } from '@/library/sections/about';
import { ContactSection } from '@/library/sections/contact';
import { Footer } from '@/library/sections/footer';
import { HeroSection } from '@/library/sections/hero';
import { Navbar } from '@/library/sections/navbar';
import ProjectsSectionSSR from '@/library/sections/projects-ssr';
import { SkillsSection } from '@/library/sections/skills';

export default function Home() {
  return (
    <>
      {/* JSON-LD: Person, WebSite e Navegação */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Abel Magnago",
              alternateName: "Portfólio de Abel Magnago",
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
            },
            {
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              "name": ["Home", "Sobre", "Projetos", "Contato"],
              "url": [
                "https://abel.dev.br/#home",
                "https://abel.dev.br/#sobre",
                "https://abel.dev.br/#projetos",
                "https://abel.dev.br/#contato"
              ]
            }
          ]),
        }}
      />
      <div className="min-h-screen">
        {/* Navbar agora é componente de servidor com island apenas para o toggle de tema */}
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
