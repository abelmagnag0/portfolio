import type { Lang } from '@/library/utils/dictionary';

export type ProjectType = 'privado' | 'autoral' | 'publico';

export type ProjectCopy = {
  title: string;
  description: string;
  longDescription: string;
  impact?: string;
};

type ProjectTranslations = Partial<Record<Lang, Partial<ProjectCopy>>>;

export type Project = {
  key: string; // pasta em public/projects/<key>
  title: string;
  description: string;
  longDescription: string;
  images?: string[]; // caminhos absolutos começando por /projects/
  stack: string[];
  type: ProjectType;
  impact?: string;
  // Novos campos para UI refinada (opcionais durante a migração)
  logo?: string; // /projects/<key>/logo.avif
  card?: string; // /projects/<key>/card.avif
  gallery?: string[]; // /projects/<key>/gallery/*.avif (1x)
  translations?: ProjectTranslations;
};

export function getProjectCopy(project: Project, lang: Lang): ProjectCopy {
  const override = project.translations?.[lang] ?? {};
  return {
    title: override.title ?? project.title,
    description: override.description ?? project.description,
    longDescription: override.longDescription ?? project.longDescription,
    impact: override.impact ?? project.impact,
  };
}

export const projectsData: Project[] = [
  {
    key: 'cge',
    title: 'Controladoria Geral do Estado do Rio de Janeiro',
    description: 'Suite digital que unifica auditoria, compliance e fluxos jurídicos do governo do RJ.',
    longDescription:
      'Liderei a modernização da plataforma de auditoria da CGE-RJ, centralizando relatórios, workflows jurídicos e gestão de benefícios em um único painel. Implementamos autenticação multi-perfil, edição colaborativa assistida por IA e históricos auditáveis que reduziram reprocessos e fortaleceram a governança.',
    gallery: ['/projects/cge/gallery/01.avif', '/projects/cge/gallery/02.avif'],
    images: ['/projects/cge/gallery/01.avif', '/projects/cge/gallery/02.avif'],
    stack: ['Node.js', 'EJS', 'MongoDB', 'WebSockets', 'Docker', 'IA'],
    type: 'publico',
    impact: 'Garante colaboração segura entre auditoria, jurídico e controladoria em um só ambiente',
    logo: '/projects/cge/logo.avif',
    translations: {
      en: {
        title: 'Rio de Janeiro State Comptroller General',
        description: 'Digital suite that unifies audit, compliance, and legal workflows for the State of Rio de Janeiro.',
        longDescription:
          "Led the modernisation of CGE-RJ's audit platform, consolidating reports, legal workflows, and benefits management in a single dashboard. Added multi-profile authentication, AI-assisted editing, and fully traceable histories to cut rework and strengthen governance.",
        impact: 'Enables secure collaboration between audit, legal, and comptroller teams in one place',
      },
    },
  },
  {
    key: 'prodigio',
    title: 'Prodígio Educação',
    description: 'Ecossistema EAD white-label que atende milhares de alunos em jornadas personalizadas.',
    longDescription:
      'Desenhei a arquitetura multi-tenant da Prodígio Educação, permitindo que uma única base configurável gere escolas digitais com identidade própria. O produto oferece lives, simulados, redações e analytics para times pedagógicos, com integrações de pagamento, CRM e automações de suporte.',
    gallery: [
      '/projects/prodigio/gallery/01.avif',
      '/projects/prodigio/gallery/02.avif',
      '/projects/prodigio/gallery/03.avif',
    ],
    images: [
      '/projects/prodigio/gallery/01.avif',
      '/projects/prodigio/gallery/02.avif',
      '/projects/prodigio/gallery/03.avif',
    ],
    stack: ['React', 'Redux', 'Node.js', 'GraphQL', 'Yup'],
    type: 'privado',
    impact: 'Escala para 30k+ alunos com onboarding rápido de novas unidades e franqueados',
    logo: '/projects/prodigio/logo.avif',
    translations: {
      en: {
        title: 'Prodígio Education',
        description: 'White-label e-learning ecosystem serving thousands of students with tailored journeys.',
        longDescription:
          'Designed the multi-tenant architecture for Prodígio Education, enabling a single configurable core to launch branded schools. The platform powers live classes, exams, writing labs, and analytics for academic teams, with payment, CRM, and support automations fully integrated.',
        impact: 'Supports 30k+ learners while enabling fast onboarding of new franchises',
      },
    },
  },
  {
    key: 'proraiz',
    title: 'ProRaiz',
    description: 'Portal acadêmico que conecta operação, pedagógico e relacionamento da rede RAIZ.',
    longDescription:
      'Construí um hub digital que integra matrícula, gestão de turmas, conteúdos avaliativos e comunicação com famílias. A solução unifica CRM, financeiro e dados pedagógicos em painéis em tempo real, permitindo que coordenações acompanhem indicadores e atuem com base em insights confiáveis.',
    gallery: [
      '/projects/proraiz/gallery/01.avif',
      '/projects/proraiz/gallery/02.avif',
      '/projects/proraiz/gallery/03.avif',
      '/projects/proraiz/gallery/04.avif',
    ],
    images: [
      '/projects/proraiz/gallery/01.avif',
      '/projects/proraiz/gallery/02.avif',
      '/projects/proraiz/gallery/03.avif',
      '/projects/proraiz/gallery/04.avif',
    ],
    stack: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    type: 'privado',
    impact: 'Coordenação pedagógica e comercial atuam sobre dados únicos e atualizados',
    logo: '/projects/proraiz/logo.avif',
    translations: {
      en: {
        title: 'ProRaiz',
        description: 'Academic hub connecting operations, pedagogy, and relationship for the RAIZ network.',
        longDescription:
          'Built a digital hub that brings enrolment, class management, assessments, and family communications together. The platform merges CRM, finance, and pedagogical data into real-time dashboards so coordinators can act on reliable insights.',
        impact: 'Gives academic and commercial teams a single source of truth to operate faster',
      },
    },
  },
  {
    key: 'raiz',
    title: 'Raiz Educação',
    description: 'Landing page de aquisição com simuladores e automações de marketing.',
    longDescription:
      'Liderei o redesign da presença digital da RAIZ com foco em performance, SEO e geração de demanda. O site oferece simuladores de bolsas, integra CRM e campanhas e traz componentes acessíveis que aceleram testes A/B e iteram com marketing sem depender de código.',
    gallery: ['/projects/raiz/gallery/01.avif', '/projects/raiz/gallery/02.avif'],
    images: ['/projects/raiz/gallery/01.avif', '/projects/raiz/gallery/02.avif'],
    stack: ['Next.js', 'Tailwind', 'SEO', 'Vercel'],
    type: 'privado',
    impact: 'Cria uma máquina de leads qualificados com análise em tempo real para marketing e vendas',
    logo: '/projects/raiz/logo.avif',
    translations: {
      en: {
        title: 'Raiz Education',
        description: 'Acquisition website with simulators and marketing automations.',
        longDescription:
          "Led the redesign of RAIZ's digital presence with performance, SEO, and demand generation at the core. The site delivers scholarship simulators, hooks into CRM and campaigns, and ships accessible components that let marketing run A/B tests without engineering bottlenecks.",
        impact: 'Builds a predictable flow of qualified leads with real-time analytics for marketing and sales',
      },
    },
  },
];
