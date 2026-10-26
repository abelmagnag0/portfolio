import type { Lang } from '@/library/utils/dictionary';
import { PROJECT_LOGOS, type ProjectLogo } from './logos.generated';

/**
 * Projetos.
 *
 * Estrutura de conteúdo: problema, o que eu fiz, resultado. Cada projeto é um
 * card com a tela e o selo do cliente; o detalhe abre sob clique
 * (`work-dossier.tsx`).
 *
 * PT-BR fica no topo de cada objeto; `translations.en` sobrescreve campo a
 * campo. Mesmo padrão de `experience.data.ts`.
 */
export type WorkOutcome = { metric: string; text: string };

export type WorkCopy = {
  title: string;
  subtitle: string;
  period: string;
  problem: string;
  role: string;
  outcomes: WorkOutcome[];
};

type WorkTranslations = Partial<Record<Lang, Partial<WorkCopy>>>;

export type WorkCase = WorkCopy & {
  key: string;
  client: string; // nome próprio: idêntico nos dois idiomas
  /** Por onde o trabalho chegou, quando não foi direto. */
  via?: string;
  stack: string[];
  /** Stack em inglês, quando algum item não é nome próprio de tecnologia. */
  stack_en?: string[];
  logo?: ProjectLogo;
  /** Telas: `/projects/<key>/gallery/*.avif` (1600×900). */
  gallery?: string[];
  translations?: WorkTranslations;
};

export function getWorkCopy(item: WorkCase, lang: Lang): WorkCopy {
  const override = item.translations?.[lang] ?? {};
  return {
    title: override.title ?? item.title,
    subtitle: override.subtitle ?? item.subtitle,
    period: override.period ?? item.period,
    problem: override.problem ?? item.problem,
    role: override.role ?? item.role,
    outcomes: override.outcomes ?? item.outcomes,
  };
}

export const workData: WorkCase[] = [
  {
    key: 'cge',
    client: 'Controladoria-Geral do Estado do Rio de Janeiro',
    via: 'via Extreme Digital Solutions',
    title: 'Sistema de auditoria do estado do Rio',
    subtitle: 'Governo · controle interno',
    period: 'Mai 2023 – atual',
    problem:
      'O fluxo de auditoria estava espalhado em três lugares: relatório num sistema, parecer jurídico em outro e controle de benefício em planilha. Para saber onde cada peça estava, alguém precisava lembrar.',
    role:
      'Fiz o levantamento com auditores e jurídico, o modelo de dados, a API, a autenticação por perfil, o front-end e o deploy em container. Depois conduzi a migração do PHP para Node.js, que é a versão em uso.',
    outcomes: [
      {
        metric: 'PHP → Node.js',
        text: 'Migração do sistema legado sem parar a auditoria.',
      },
      {
        metric: 'SHA-256',
        text: 'Assinatura de documento com hash e histórico auditável.',
      },
      {
        metric: '4 áreas',
        text: 'Auditoria, jurídico, controladoria e ouvidoria passaram a usar o mesmo dado.',
      },
    ],
    stack: [
      'Node.js',
      'Express',
      'TypeScript',
      'React',
      'PHP',
      'EJS',
      'PostgreSQL',
      'MongoDB',
      'LDAP/SSO',
      'Docker',
      'CI/CD',
    ],
    logo: PROJECT_LOGOS.cge,
    gallery: ['/projects/cge/gallery/01.avif', '/projects/cge/gallery/02.avif'],
    translations: {
      en: {
        title: 'The state audit system',
        subtitle: 'Government · internal control',
        period: 'May 2023 – present',
        problem:
          'The audit workflow was spread across three places: reports in one system, legal opinions in another, benefit tracking in a spreadsheet. Finding each piece depended on someone remembering.',
        role:
          'I did the requirements with auditors and legal, the data model, the API, role-based authentication, the front end and the container deploy. Then I led the migration from PHP to Node.js, which is the version in use.',
        outcomes: [
          {
            metric: 'PHP → Node.js',
            text: 'Migrated the legacy system without stopping audit work.',
          },
          {
            metric: 'SHA-256',
            text: 'Document signing with hash and an auditable history.',
          },
          {
            metric: '4 departments',
            text: 'Audit, legal, comptroller and ombudsman started using the same record.',
          },
        ],
      },
    },
  },
  {
    key: 'prodigio',
    client: 'Prodígio Educação',
    title: 'Escolas com marca própria a partir de um núcleo',
    subtitle: 'Educação · EAD white-label',
    period: 'Jun 2022 – Mar 2025',
    problem:
      'Cada franqueado queria a própria escola digital, e manter um código por cliente não escala.',
    role:
      'Desenhei a arquitetura multi-tenant, juntei os módulos que dava para compartilhar e conduzi a migração dos módulos legados para React, um por vez, sem parar feature em produção.',
    outcomes: [
      {
        metric: '1 núcleo',
        text: 'Uma base só gerando escola com marca própria para cada franqueado.',
      },
      {
        metric: '30 mil+',
        text: 'Alunos ativos na plataforma.',
      },
      {
        metric: 'Sem queda',
        text: 'Migração em incrementos, sem quebrar release.',
      },
    ],
    stack: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'GraphQL', 'Firebase', 'Styled-components'],
    logo: PROJECT_LOGOS.prodigio,
    gallery: [
      '/projects/prodigio/gallery/01.avif',
      '/projects/prodigio/gallery/02.avif',
      '/projects/prodigio/gallery/03.avif',
    ],
    translations: {
      en: {
        title: 'Branded schools from one core',
        subtitle: 'Education · white-label e-learning',
        period: 'Jun 2022 – Mar 2025',
        problem:
          'Every franchise wanted its own digital school, and keeping one codebase per client does not scale.',
        role:
          'I designed the multi-tenant architecture, pulled together the modules worth sharing, and led the migration of the legacy modules to React one at a time, without breaking a feature in production.',
        outcomes: [
          {
            metric: '1 core',
            text: 'One base generating branded schools for each franchise.',
          },
          {
            metric: '30k+',
            text: 'Active students on the platform.',
          },
          {
            metric: 'No downtime',
            text: 'Migration in increments, with no broken release.',
          },
        ],
      },
    },
  },
  {
    key: 'proraiz',
    client: 'ProRaiz Sistema de Ensino',
    title: 'Matrícula, turma, avaliação e família no mesmo lugar',
    subtitle: 'Educação · rede RAIZ',
    period: 'Jun 2024 – Dez 2025',
    problem:
      'Coordenação pedagógica e comercial olhavam pedaços diferentes da mesma coisa: matrícula num sistema, financeiro em outro, indicador pedagógico em planilha.',
    role:
      'Liderei o front-end de uma plataforma com mais de 30 mil alunos ativos: backlog, pipeline do sprint ao release e a migração dos módulos legados que cortou 40% do tempo de build.',
    outcomes: [
      {
        metric: '−40%',
        text: 'Tempo de build depois de migrar os módulos legados.',
      },
      {
        metric: '30 mil+',
        text: 'Alunos ativos no front-end que liderei.',
      },
      {
        metric: 'Mesmo dado',
        text: 'Coordenação e comercial passaram a decidir sobre a mesma fonte.',
      },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Storybook', 'Node.js', 'Firebase', 'PostgreSQL'],
    logo: PROJECT_LOGOS.proraiz,
    gallery: [
      '/projects/proraiz/gallery/01.avif',
      '/projects/proraiz/gallery/02.avif',
      '/projects/proraiz/gallery/03.avif',
      '/projects/proraiz/gallery/04.avif',
    ],
    translations: {
      en: {
        title: 'Enrolment, classes, assessments and families in one place',
        subtitle: 'Education · RAIZ network',
        period: 'Jun 2024 – Dec 2025',
        problem:
          'Academic coordination and the commercial team were looking at different pieces of the same thing: enrolment in one system, finance in another, academic indicators in a spreadsheet.',
        role:
          'I led the front end of a platform with more than 30,000 active students: backlog, pipeline from sprint to release, and the legacy module migration that cut build time by 40%.',
        outcomes: [
          {
            metric: '−40%',
            text: 'Build time after migrating the legacy modules.',
          },
          {
            metric: '30k+',
            text: 'Active students on the front end I led.',
          },
          {
            metric: 'Same record',
            text: 'Coordination and commercial deciding from the same source.',
          },
        ],
      },
    },
  },
  {
    key: 'cursology',
    client: 'Cursology',
    title: 'Marketplace de cursos por assinatura',
    subtitle: 'Educação · LMS',
    period: 'Mar 2026 – Set 2026',
    problem:
      'A Cursology vende curso de criador conhecido por assinatura: checkout, catálogo, player, certificado e app, tudo junto.',
    role:
      'Front-end no núcleo do produto. Em seis meses foram mais de 40 PRs no app principal: checkout com upsert e abas de preço, assinatura, taxa de plataforma, upload de vídeo, cupom, quiz, certificado e dashboard do player. Componentes em biblioteca própria (Stencil) e dados via GraphQL com codegen.',
    outcomes: [
      {
        metric: '40+ PRs',
        text: 'Seis meses no app principal.',
      },
      {
        metric: 'Checkout',
        text: 'Fluxo de compra com vários meios de pagamento, cupom e agendamento.',
      },
      {
        metric: 'Monorepo',
        text: 'Design system em Stencil compartilhado entre o app e os produtos irmãos no Nx.',
      },
    ],
    stack: [
      'Next.js 14',
      'React 18',
      'TypeScript',
      'Apollo GraphQL',
      'Stencil',
      'MUI',
      'Nx',
      'next-auth',
      'Docker',
      'GitHub Actions',
    ],
    logo: PROJECT_LOGOS.cursology,
    gallery: ['/projects/cursology/gallery/01.avif', '/projects/cursology/gallery/02.avif'],
    translations: {
      en: {
        title: 'Subscription course marketplace',
        subtitle: 'Education · LMS',
        period: 'Mar 2026 – Sep 2026',
        problem:
          'Cursology sells courses from well-known creators by subscription: checkout, catalogue, player, certificates and app, all together.',
        role:
          'Front end on the product core. In six months, 40+ PRs on the main app: checkout with upsert and pricing tabs, subscriptions, platform fees, video upload, coupons, quizzes, certificates and the player dashboard. Components in our own Stencil library, data via GraphQL with codegen.',
        outcomes: [
          {
            metric: '40+ PRs',
            text: 'Six months on the main app.',
          },
          {
            metric: 'Checkout',
            text: 'Purchase flow with several payment methods, coupons and scheduling.',
          },
          {
            metric: 'Monorepo',
            text: 'Stencil design system shared between the app and sibling products in Nx.',
          },
        ],
      },
    },
  },
  {
    key: 'extreme-digital',
    client: 'Extreme Digital Solutions',
    title: 'Sistemas de jurídico e auditoria na web',
    subtitle: 'Consultoria · jurídico e auditoria',
    period: 'Mar 2025 – Set 2026',
    problem:
      'Os sistemas de jurídico e auditoria viviam em legado fechado. Cada integração era um favor manual e o ponto de entrada técnico mudava a cada contrato.',
    role:
      'Consultor full stack, em paralelo aos contratos de auditoria: desenvolvimento para jurídico e auditoria, contato técnico entre os times, integração com os sistemas legados e automação de processo. Tudo sobe em Docker, com CI/CD.',
    outcomes: [
      {
        metric: 'Uma entrada',
        text: 'Um só ponto técnico para jurídico e auditoria.',
      },
      {
        metric: 'Legado → web',
        text: 'Sistemas legados integrados às telas web, sem reescrever o legado.',
      },
      {
        metric: 'Docker + CI/CD',
        text: 'Tudo em container, com pipeline, no padrão da operação.',
      },
    ],
    stack: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Docker', 'CI/CD', 'Automação'],
    stack_en: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Docker', 'CI/CD', 'Automation'],
    logo: PROJECT_LOGOS['extreme-digital'],
    gallery: [
      '/projects/extreme-digital/gallery/01.avif',
      '/projects/extreme-digital/gallery/02.avif',
    ],
    translations: {
      en: {
        title: 'Legal and audit systems on the web',
        subtitle: 'Consulting · legal & audit',
        period: 'Mar 2025 – Sep 2026',
        problem:
          'The legal and audit systems lived on closed legacy software. Every integration was a manual favour, and the technical point of entry changed with each contract.',
        role:
          'Full-stack consultant, alongside the audit contracts: development for legal and audit, technical contact between teams, integration with the legacy systems and process automation. Everything ships in Docker, with CI/CD.',
        outcomes: [
          {
            metric: 'One entry',
            text: 'A single technical entry point for legal and audit.',
          },
          {
            metric: 'Legacy → web',
            text: 'Legacy systems integrated with the web front end, without rewriting the legacy.',
          },
          {
            metric: 'Docker + CI/CD',
            text: 'Everything in a container, with a pipeline, matching the operation.',
          },
        ],
      },
    },
  },
  {
    key: 'raiz',
    client: 'Raiz Educação',
    via: 'via Prodígio Educação',
    title: 'Página de captação que o marketing opera sozinho',
    subtitle: 'Educação · aquisição',
    period: '2024',
    problem:
      'Testar uma oferta nova dependia de abrir demanda para a engenharia, e cada campanha ficava presa a um deploy.',
    role:
      'Redesenhei a página de captação pensando em performance e SEO, liguei o simulador de bolsa no CRM e montei componentes que o marketing passou a usar sem escrever código.',
    outcomes: [
      {
        metric: 'Sem código',
        text: 'Marketing monta e testa oferta sem abrir demanda.',
      },
      {
        metric: 'Lead → CRM',
        text: 'Simulador de bolsa mandando o contato para o comercial na hora.',
      },
      {
        metric: 'SEO',
        text: 'Base técnica de indexação para as campanhas.',
      },
    ],
    stack: ['Next.js', 'Tailwind', 'SEO', 'Vercel'],
    logo: PROJECT_LOGOS.raiz,
    gallery: ['/projects/raiz/gallery/01.avif', '/projects/raiz/gallery/02.avif'],
    translations: {
      en: {
        title: 'An acquisition page marketing runs on its own',
        subtitle: 'Education · acquisition',
        period: '2024',
        problem:
          'Testing a new offer meant filing an engineering ticket, and every campaign was tied to a deploy.',
        role:
          'I redesigned the acquisition page around performance and SEO, wired a scholarship simulator into the CRM, and built components marketing could use without writing code.',
        outcomes: [
          {
            metric: 'No code',
            text: 'Marketing composes and tests offers without a ticket.',
          },
          {
            metric: 'Lead → CRM',
            text: 'Scholarship simulator sending the contact to sales in real time.',
          },
          {
            metric: 'SEO',
            text: 'Technical indexing foundation for the campaigns.',
          },
        ],
      },
    },
  },
];