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
      projects: 'Cases',
      articles: 'Artigos',
      contact: 'Contato',
      download_cv: 'Baixar CV',
      switch_language_title: 'Alternar idioma',
    },
    hero: {
      available: 'Tech lead em produtos digitais complexos',
      role: 'Tech Lead & Engenheiro Full Stack',
      description: 'Lidero squads multidisciplinares para lançar produtos digitais que conectam objetivos de negócio, UX e engenharia escalável.',
      cta_portfolio: 'Explorar cases',
      cta_contact: 'Agendar conversa',
    },
    about: {
      title: 'Quem sou',
      p1: 'Sou Abel Magnago, engenheiro full stack com mais de 4 anos construindo plataformas para governo, educação e empresas digitais. Atuei como tech lead conduzindo discovery, arquitetura e entregas ponta a ponta.',
      p2: 'Trabalho lado a lado com produto, design e stakeholders para transformar indicadores em roadmap, definir métricas de sucesso e garantir que o software entregue valor desde o primeiro release.',
      p3: 'Minha atuação combina código limpo, automação, observabilidade e uma forte cultura de UX acessível. Busco resultados mensuráveis, sustentáveis e alinhados à estratégia do negócio.',
      stats: {
        years: { value: '4+ anos', label: 'liderando entregas de produto' },
        users: { value: '30k+', label: 'usuários atendidos' },
        stacks: { value: '10+', label: 'produtos lançados' },
      },
    },
    skills: {
      title: 'Como entrego valor',
      cat: {
        frontend: 'Experiência Digital',
        backend: 'Plataformas & APIs',
        devops: 'Cloud & Operações',
        database: 'Dados & Integração',
      },
      desc: {
        frontend: {
          1: 'Design de interfaces guiadas por métricas e pesquisa',
          2: 'Componentes acessíveis, tipados e escaláveis com React/Next',
          3: 'Experimentos e otimizações para conversão e retenção',
        },
        backend: {
          1: 'APIs resilientes em Node, Python e arquiteturas modulares',
          2: 'Integrações com sistemas legados e parceiros com observabilidade',
          3: 'Governança de segurança, compliance e revisão técnica',
        },
        devops: {
          1: 'Pipelines CI/CD automatizados com testes e qualidade contínua',
          2: 'Infra escalável em AWS, Vercel e contêineres Docker/Kubernetes',
          3: 'Monitoramento, alertas e otimização de custos em produção',
        },
        database: {
          1: 'Modelagem pensada para analytics em SQL e NoSQL',
          2: 'ETLs, sincronizações e governança de dados multi-fonte',
          3: 'Dashboards e experimentos guiados por dados',
        },
      },
    },
    projects: {
      title: 'Clientes & Cases',
      badge: { private: 'Empresas', public: 'Governo', authoral: 'Autoral' },
      tech_used: 'Stack principal:',
      impact: 'Resultados',
    },
    articles: {
      title: 'Artigos e ideias',
      subtitle: 'Insights práticos sobre produto, engenharia e operações digitais',
    },
    contact: {
      title: 'Vamos criar algo juntos?',
      subtitle: 'Conte sobre o desafio, metas e prazo: respondo rapidamente com próximos passos claros.',
      cta_email: 'Enviar e-mail',
    },
    testimonials: { title: 'Depoimentos' },
    footer: { role: 'Tech Lead & Engenheiro Full Stack' },
  },
  en: {
    nav: {
      about: 'About',
      projects: 'Cases',
      articles: 'Articles',
      contact: 'Contact',
      download_cv: 'Download CV',
      switch_language_title: 'Switch language',
    },
    hero: {
      available: 'Tech lead on complex digital products',
      role: 'Tech Lead & Full Stack Engineer',
      description: 'I lead cross-functional teams to ship digital products that align business goals, UX, and scalable engineering.',
      cta_portfolio: 'Explore cases',
      cta_contact: 'Schedule a call',
    },
    about: {
      title: 'About me',
      p1: "I'm Abel Magnago, a full stack engineer with 4+ years building platforms for education, government, and digital-first companies. I operate as a tech lead guiding discovery, architecture, and end-to-end delivery.",
      p2: 'I partner with product, design, and stakeholders to translate KPIs into roadmaps, define success metrics, and ensure every release delivers measurable value.',
      p3: 'My toolkit blends clean code, automation, observability, and an inclusive UX mindset. I focus on sustainable, data-backed results that stay aligned with business strategy.',
      stats: {
        years: { value: '4+ years', label: 'leading product deliveries' },
        users: { value: '30k+', label: 'users served' },
        stacks: { value: '10+', label: 'products shipped' },
      },
    },
    skills: {
      title: 'How I deliver impact',
      cat: {
        frontend: 'Product Experiences',
        backend: 'Platforms & APIs',
        devops: 'Cloud & Ops',
        database: 'Data & Integrations',
      },
      desc: {
        frontend: {
          1: 'UX crafted from research, analytics, and experimentation',
          2: 'Accessible, type-safe components built with React/Next',
          3: 'Continuous optimisation for conversion and retention',
        },
        backend: {
          1: 'Resilient REST/GraphQL services in Node, Python, and modular architectures',
          2: 'Legacy and partner integrations with full observability',
          3: 'Security, compliance, and technical reviews embedded in the process',
        },
        devops: {
          1: 'CI/CD pipelines with automated quality gates and testing',
          2: 'Scalable infrastructure on AWS, Vercel, Docker, and Kubernetes',
          3: 'Monitoring, alerting, and cost optimisation in production',
        },
        database: {
          1: 'Data models shaped for analytics across SQL and NoSQL',
          2: 'ETL, synchronisation, and governance across multiple sources',
          3: 'Dashboards and experiments driven by data insights',
        },
      },
    },
    projects: {
      title: 'Clients & Cases',
      badge: { private: 'Enterprise', public: 'Government', authoral: 'Authorial' },
      tech_used: 'Core stack:',
      impact: 'Results',
    },
    articles: {
      title: 'Articles & ideas',
      subtitle: 'Hands-on insights about product, engineering, and digital operations',
    },
    contact: {
      title: 'Ready to collaborate?',
      subtitle: 'Share the challenge, goals, and timeline — I reply quickly with clear next steps.',
      cta_email: 'Send email',
    },
    testimonials: { title: 'Testimonials' },
    footer: { role: 'Tech Lead & Full Stack Engineer' },
  },
};
