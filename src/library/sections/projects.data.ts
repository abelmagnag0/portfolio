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
  images: string[]; // caminhos absolutos começando por /projects/
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
    key: 'audit',
    title: 'Sistema de Auditoria Interna',
    description: 'Plataforma para auditorias internas em órgão público',
    longDescription:
      'Sistema robusto voltado a auditores, assessoria jurídica, controlador geral e outros grupos. Permite auditar relatórios, acompanhar benefícios, contratos e documentos, com workflows bem definidos. Projeto em Node com EJS, MongoDB, WebSockets, Docker e recursos de IA nos editores.',
    images: ['/projects/audit/siaudi.webp'],
    stack: ['Node.js', 'EJS', 'MongoDB', 'WebSockets', 'Docker', 'IA'],
    type: 'privado',
    impact: 'Uso interno por múltiplos perfis (auditoria e jurídico) com alto volume de documentos',
    translations: {
      en: {
        title: 'Internal Audit System',
        description: 'Platform for internal audits in a public agency',
        longDescription:
          'Robust system built for auditors, legal advisors, the comptroller, and other teams. Supports auditing reports, tracking benefits, contracts, and documents with well-defined workflows. Built with Node, EJS, MongoDB, WebSockets, Docker, and AI-powered editors.',
        impact: 'Internal use across multiple profiles (audit and legal) with high document volume',
      },
    },
  },
  {
    key: 'ia',
    title: 'Assistente de IA Jurídico',
    description: 'IA treinada em documentos jurídicos e administrativos',
    longDescription:
      'Assistente de IA alimentado por base de dados de contratos, decretos e documentos úteis ao setor jurídico e auditoria. Auxilia na elaboração de textos e esclarecimento de dúvidas. Stack em React, Tailwind, FastAPI, Docker e MongoDB.',
    images: ['/projects/ia/qda.webp'],
    stack: ['React', 'Tailwind', 'FastAPI', 'Docker', 'MongoDB'],
    type: 'privado',
    impact: 'Acelera a produção de documentos e consultas jurídicas',
    translations: {
      en: {
        title: 'Legal AI Assistant',
        description: 'AI trained on legal and administrative documents',
        longDescription:
          'AI assistant powered by a dataset of contracts, decrees, and documents used by legal and audit teams. Helps draft texts and clarify questions. Stack: React, Tailwind, FastAPI, Docker, MongoDB.',
        impact: 'Speeds up document production and legal research',
      },
    },
  },
  {
    key: 'lms',
    title: 'Plataforma LMS (EAD)',
    description: 'Aulas, lives, exercícios, provas, redações e planos de estudo',
    longDescription:
      'Plataforma EAD completa com sistema de whitelabel: uma base de configurações gera múltiplas aplicações em domínios distintos. Tecnologias incluem React, Redux, Node, GraphQL, Yup. Mais de 30k usuários.',
    images: [
      // fallback temporário se modal ainda usar `images`
      '/projects/lms/gallery/01.avif',
      '/projects/lms/gallery/02.avif',
    ],
    stack: ['React', 'Redux', 'Node.js', 'GraphQL', 'Yup'],
    type: 'privado',
    impact: '+30k usuários ativos',
    // novos campos
    logo: '/projects/lms/logo.avif',
    card: '/projects/lms/card.avif',
    gallery: [
      '/projects/lms/gallery/01.avif',
      '/projects/lms/gallery/02.avif',
    ],
    translations: {
      en: {
        title: 'LMS Platform (E-learning)',
        description: 'Classes, live sessions, exercises, exams, essays, and study plans',
        longDescription:
          'Complete e-learning platform with a whitelabel system: one configuration base powers multiple applications across different domains. Built with React, Redux, Node, GraphQL, Yup. Serves more than 30k users.',
        impact: '30k+ active users',
      },
    },
  },
  {
    key: 'partner',
    title: 'Portal do Parceiro',
    description: 'Clientes acompanham pedidos, entregas e devoluções',
    longDescription:
      'Portal para parceiros que compram materiais pedagógicos. Acompanhamento de entregas, pedidos e devoluções, com design limpo e arquitetura bem abstraída. Stack em React, styled-components, Zod e Immer; componentes em biblioteca própria.',
    images: [
      '/projects/partner/parceiro-contato.webp',
      '/projects/partner/parceiro-relatorio.webp',
      '/projects/partner/parceiro-solicitacoes.webp',
      '/projects/partner/parceiro-solicitacoes-mobile.webp',
    ],
    stack: ['React', 'styled-components', 'Zod', 'Immer'],
    type: 'privado',
    impact: 'Melhora o pós-venda e a experiência do cliente',
    translations: {
      en: {
        title: 'Partner Portal',
        description: 'Customers track orders, deliveries, and returns',
        longDescription:
          'Portal for partners that purchase educational materials. Tracks deliveries, orders, and returns with a clean UI and well-abstracted architecture. Stack: React, styled-components, Zod, Immer; components shipped in a private library.',
        impact: 'Improves post-sales and the customer experience',
      },
    },
  },
  {
    key: 'partner-admin',
    title: 'Portal de Gestão (Admin)',
    description: 'Gestão de devoluções, entregas e relatórios',
    longDescription:
      'Versão administrativa do Portal do Parceiro, com foco em análise de devoluções, gestão de entregas e relatórios. Compartilha a base tecnológica e padrões do projeto parceiro.',
    images: ['/projects/partner-admin/gestao.webp'],
    stack: ['React', 'styled-components', 'Zod', 'Immer'],
    type: 'privado',
    impact: 'Centraliza e agiliza fluxos de operação',
    translations: {
      en: {
        title: 'Operations Management Portal',
        description: 'Manage returns, deliveries, and reports',
        longDescription:
          'Administrative version of the Partner Portal, focused on analysing returns, managing deliveries, and generating reports. Shares the same technology stack and standards as the partner project.',
        impact: 'Centralises and speeds up operational workflows',
      },
    },
  },
  {
    key: 'sisu',
    title: 'Simulador SISU',
    description: 'Simulação de notas do ENEM para o SISU',
    longDescription:
      'Aplicação em Next com styled-components permitindo o aluno lançar notas e simular o SISU via parametrizações. Design limpo e SEO eficiente, com boa indexação no Google.',
    images: ['/projects/sisu/raiz-desktop.webp'],
    stack: ['Next.js', 'styled-components', 'SEO'],
    type: 'publico',
    impact: 'Auxilia candidatos a entenderem suas chances de ingresso',
    translations: {
      en: {
        title: 'SISU Score Simulator',
        description: 'Simulate ENEM scores to plan SISU applications',
        longDescription:
          'Next.js app with styled-components that lets students input their scores and simulate SISU results through configurable parameters. Clean design and strong SEO with great Google indexing.',
        impact: 'Helps applicants understand their admission chances',
      },
    },
  },
  {
    key: 'storybook',
    title: 'Biblioteca de Componentes (Storybook)',
    description: 'Design system manual sem dependências de layout',
    longDescription:
      'Biblioteca de componentes feita do zero, sem dependências para layout/estilização. Baseada em Storybook + React e publicada via npm de forma privada. Alimenta composições utilizadas em outros projetos.',
    images: ['/projects/storybook/storybook.webp'],
    stack: ['React', 'Storybook', 'npm'],
    type: 'autoral',
    impact: 'Reuso consistente e acelerado em múltiplos apps',
    translations: {
      en: {
        title: 'Component Library (Storybook)',
        description: 'Manual design system with no layout dependencies',
        longDescription:
          'Component library built from scratch without layout or styling dependencies. Based on Storybook + React and published privately on npm. Powers compositions reused across other projects.',
        impact: 'Consistent, accelerated reuse across multiple apps',
      },
    },
  },
  {
    key: 'travel',
    title: 'Diárias e Passagens (Governo)',
    description: 'Solicitações de diárias, eventos e passagens',
    longDescription:
      'Sistema para servidores do Estado solicitarem pagamento de diárias, inscrição em eventos pagos e passagens aéreas. Projeto feito end-to-end: Figma, backend em Node/Express e frontend em EJS com Tailwind.',
    images: ['/projects/travel/sisdep.webp'],
    stack: ['Node.js', 'Express', 'EJS', 'Tailwind'],
    type: 'privado',
    impact: 'Digitaliza e formaliza o fluxo de solicitações oficiais',
    translations: {
      en: {
        title: 'Government Travel and Per Diem',
        description: 'Requests for per diems, events, and flights',
        longDescription:
          'System for state employees to request per diem payments, register for paid events, and book flights. Full end-to-end delivery: Figma, Node/Express backend, and EJS with Tailwind on the frontend.',
        impact: 'Digitizes and formalizes official request workflows',
      },
    },
  },
];
