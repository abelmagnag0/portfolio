import { AnchorNav } from '@/library/sections/anchor-nav';
import { CapabilitiesSection } from '@/library/sections/capabilities';
import { ContactSection } from '@/library/sections/contact';
import { CoverSection } from '@/library/sections/cover';
import { CredentialsSection } from '@/library/sections/credentials';
import { DecisionsProvider } from '@/library/sections/decisions';
import { ExperienceSection } from '@/library/sections/experience';
import { Footer } from '@/library/sections/footer';
import { HeroSection } from '@/library/sections/hero';
import { SourceSection } from '@/library/sections/source';
import { TechMarquee } from '@/library/sections/tech-marquee';
import { WorkSection } from '@/library/sections/work';
import { workData } from '@/library/sections/work.data';
import { NavigationJsonLd } from '@/library/seo/navigation-jsonld';
import { WebsiteJsonLd } from '@/library/seo/website-jsonld';
import { WorkJsonLd } from '@/library/seo/work-jsonld';
import type { Lang } from '@/library/utils/dictionary';

/**
 * A página inicial, em um lugar só.
 *
 * Antes existiam dois arquivos quase idênticos (`(pt)/page.tsx` e
 * `(en)/en/page.tsx`) que precisavam ser editados em par — divergência
 * garantida. Agora as duas rotas são uma linha: passam o idioma e pronto.
 *
 * Tudo aqui é server component. O idioma entra por prop em vez de vir de
 * contexto no cliente, então o HTML sai correto e completo no build, sem
 * depender de hidratação para trocar texto.
 */
export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <WebsiteJsonLd lang={lang} />
      <NavigationJsonLd lang={lang} />
      <WorkJsonLd work={workData} lang={lang} />

      <div className="min-h-screen">
        {/* Camada de decisões: o provider é da página (não do root-shell) porque
            as notas só existem na home — nem a página admin nem o 404 as têm. */}
        <DecisionsProvider>
          <AnchorNav />
          <main id="content">
            <CoverSection lang={lang} />
            <HeroSection lang={lang} />
            <TechMarquee />
            <WorkSection lang={lang} />
            <ExperienceSection lang={lang} />
            <CredentialsSection lang={lang} />
            <CapabilitiesSection lang={lang} />
            <SourceSection lang={lang} />
            <ContactSection lang={lang} />
          </main>
          <Footer lang={lang} />
        </DecisionsProvider>
      </div>
    </>
  );
}