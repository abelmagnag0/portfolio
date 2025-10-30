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
  | 'hero.cta_contact'
  | 'about.title'
  | 'about.p1'
  | 'about.p2'
  | 'about.p3'
  | 'about.stats.years.value'
  | 'about.stats.years.label'
  | 'about.stats.users.value'
  | 'about.stats.users.label'
  | 'about.stats.stacks.value'
  | 'about.stats.stacks.label'
  | 'skills.title'
  | 'skills.cat.frontend'
  | 'skills.cat.backend'
  | 'skills.cat.devops'
  | 'skills.cat.database'
  | 'skills.desc.frontend.1'
  | 'skills.desc.frontend.2'
  | 'skills.desc.frontend.3'
  | 'skills.desc.backend.1'
  | 'skills.desc.backend.2'
  | 'skills.desc.backend.3'
  | 'skills.desc.devops.1'
  | 'skills.desc.devops.2'
  | 'skills.desc.devops.3'
  | 'skills.desc.database.1'
  | 'skills.desc.database.2'
  | 'skills.desc.database.3'
  | 'projects.title'
  | 'projects.badge.private'
  | 'projects.badge.public'
  | 'projects.badge.authoral'
  | 'projects.tech_used'
  | 'projects.impact'
  | 'articles.title'
  | 'articles.subtitle'
  | 'contact.title'
  | 'contact.subtitle'
  | 'contact.cta_email'
  | 'testimonials.title'
  | 'footer.role';

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
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
    stats: {
      years: { value: string; label: string };
      users: { value: string; label: string };
      stacks: { value: string; label: string };
    };
  };
  skills: {
    title: string;
    cat: { frontend: string; backend: string; devops: string; database: string };
    desc: {
      frontend: { 1: string; 2: string; 3: string };
      backend: { 1: string; 2: string; 3: string };
      devops: { 1: string; 2: string; 3: string };
      database: { 1: string; 2: string; 3: string };
    };
  };
  projects: {
    title: string;
    badge: { private: string; public: string; authoral: string };
    tech_used: string;
    impact: string;
  };
  articles: { title: string; subtitle: string };
  contact: { title: string; subtitle: string; cta_email: string };
  testimonials: { title: string };
  footer: { role: string };
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
      role: 'Desenvolvedor Full Stack e Mobile',
      description: 'Desenvolvo aplicações rápidas e fáceis de usar, com foco em experiência e nuvem.',
      cta_portfolio: 'Ver portfólio',
      cta_contact: 'Falar comigo',
    },
    about: {
      title: 'Sobre mim',
      p1: 'Trabalho com tecnologia há mais de 4 anos, criando produtos para educação e governo. Gosto de unir escalabilidade, automação e boa experiência de uso.',
      p2: 'No dia a dia, lidero frentes de front‑end e construo pipelines de CI/CD na nuvem. Meu foco é entregar com qualidade e resolver problemas reais do usuário.',
      p3: 'Acredito que bons produtos nascem de um código claro, design simples e infraestrutura confiável. Meu objetivo é transformar desafios em soluções práticas.',
      stats: {
        years: { value: '+4 anos', label: 'de experiência' },
        users: { value: '+30 mil', label: 'pessoas alcançadas' },
        stacks: { value: '5 stacks', label: 'dominadas' },
      },
    },
    skills: {
      title: 'Habilidades e tecnologias',
      cat: {
        frontend: 'Front-end',
        backend: 'Back-end',
        devops: 'DevOps & Cloud',
        database: 'Banco de Dados',
      },
      desc: {
        frontend: {
          1: 'Aplicações web modernas e rápidas',
          2: 'Código seguro com TypeScript',
          3: 'Interfaces acessíveis e fáceis de usar',
        },
        backend: {
          1: 'APIs REST e GraphQL escaláveis',
          2: 'Microsserviços com FastAPI e Flask',
          3: 'Integração com sistemas legados e WordPress',
        },
        devops: {
          1: 'Containers e automação de deploy',
          2: 'EC2, S3, Lambda e CloudFront',
          3: 'GitLab CI e GitHub Actions',
        },
        database: {
          1: 'NoSQL para dados flexíveis',
          2: 'Bancos relacionais robustos',
          3: 'Consultas otimizadas',
        },
      },
    },
    projects: {
      title: 'Projetos em Destaque',
      badge: { private: 'Privado', public: 'Público', authoral: 'Autoral' },
      tech_used: 'Tecnologias utilizadas:',
      impact: 'Impacto',
    },
    articles: {
      title: 'Artigos e ideias',
      subtitle: 'Conteúdos sobre desenvolvimento, DevOps e design a partir da prática',
    },
    contact: {
      title: 'Vamos conversar?',
      subtitle: 'Falo sobre projetos, ideias e como posso ajudar seu produto a evoluir.',
      cta_email: 'Enviar e‑mail',
    },
    testimonials: { title: 'Depoimentos' },
    footer: { role: 'Desenvolvedor Full Stack e Mobile' },
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
      role: 'Full Stack and Mobile Developer',
      description: 'I build fast, easy-to-use applications with a focus on UX and Cloud.',
      cta_portfolio: 'View portfolio',
      cta_contact: 'Contact me',
    },
    about: {
      title: 'About me',
      p1: 'I have 4+ years building products for education and government. I care about scalability, automation, and user experience.',
      p2: 'I lead front‑end efforts and create cloud CI/CD pipelines. My goal is to deliver quality and solve real user problems.',
      p3: 'Great products come from clear code, simple design, and reliable infrastructure. I like turning challenges into practical solutions.',
      stats: {
        years: { value: '+4 years', label: 'of experience' },
        users: { value: '+30k', label: 'people reached' },
        stacks: { value: '5 stacks', label: 'mastered' },
      },
    },
    skills: {
      title: 'Skills and technologies',
      cat: {
        frontend: 'Front-end',
        backend: 'Back-end',
        devops: 'DevOps & Cloud',
        database: 'Databases',
      },
      desc: {
        frontend: {
          1: 'Modern and fast web apps',
          2: 'Type-safe code with TypeScript',
          3: 'Accessible and easy-to-use UIs',
        },
        backend: {
          1: 'Scalable REST and GraphQL APIs',
          2: 'Microservices with FastAPI and Flask',
          3: 'Integration with legacy systems and WordPress',
        },
        devops: {
          1: 'Containers and deploy automation',
          2: 'EC2, S3, Lambda, and CloudFront',
          3: 'GitLab CI and GitHub Actions',
        },
        database: {
          1: 'NoSQL for flexible data',
          2: 'Robust relational databases',
          3: 'Optimized queries',
        },
      },
    },
    projects: {
      title: 'Featured Projects',
      badge: { private: 'Private', public: 'Public', authoral: 'Authoral' },
      tech_used: 'Technologies used:',
      impact: 'Impact',
    },
    articles: {
      title: 'Articles and ideas',
      subtitle: 'Thoughts on development, DevOps, and design from real projects',
    },
    contact: {
      title: 'Let’s talk',
      subtitle: 'Happy to discuss projects, ideas, and how I can help your product grow.',
      cta_email: 'Send e‑mail',
    },
    testimonials: { title: 'Testimonials' },
    footer: { role: 'Full Stack and Mobile Developer' },
  },
};
