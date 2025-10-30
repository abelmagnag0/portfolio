export type Lang = 'pt-BR' | 'en';

export type TranslationKey =
  | 'nav.about'
  | 'nav.projects'
  | 'nav.articles'
  | 'nav.contact'
  | 'nav.download_cv'
  | 'nav.switch_language_title'
  | 'hero.available'
  | 'hero.role'
  | 'hero.description'
  | 'hero.cta_portfolio'
  | 'hero.cta_contact';

type Messages = {
  nav: {
    about: string;
    projects: string;
    articles: string;
    contact: string;
    download_cv: string;
    switch_language_title: string;
  };
  hero: {
    available: string;
    role: string;
    description: string;
    cta_portfolio: string;
    cta_contact: string;
  };
};

export const dictionary: Record<Lang, Messages> = {
  'pt-BR': {
    nav: {
      about: 'Sobre',
      projects: 'Projetos',
      articles: 'Artigos',
      contact: 'Contato',
      download_cv: 'Baixar CV',
      switch_language_title: 'Alternar idioma',
    },
    hero: {
      available: 'Disponível para novos projetos',
      role: 'Desenvolvedor Full-Stack & Mobile',
      description: 'Crio soluções escaláveis e intuitivas unindo performance, UX e Cloud.',
      cta_portfolio: 'Ver Portfólio',
      cta_contact: 'Entrar em Contato',
    },
  },
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      articles: 'Articles',
      contact: 'Contact',
      download_cv: 'Download CV',
      switch_language_title: 'Switch language',
    },
    hero: {
      available: 'Open to new projects',
      role: 'Full-Stack & Mobile Developer',
      description: 'I build scalable, intuitive solutions combining performance, UX, and Cloud.',
      cta_portfolio: 'View Portfolio',
      cta_contact: 'Get in Touch',
    },
  },
};
