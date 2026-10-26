import type { Lang } from '@/library/utils/dictionary';

/**
 * Trajetória profissional.
 *
 * Deliberadamente magra. A versão anterior listava oito bullets por cargo —
 * era o currículo inteiro dentro do portfólio, e ninguém lê isso numa landing
 * page. O portfólio responde "quem é essa pessoa e ela sabe fazer o que diz?";
 * o detalhe de cada entrega fica no CV, que está a um clique (`cv_label`).
 *
 * Cada cargo tem então: o período, o nome, a empresa, UMA linha que diferencia,
 * e a stack. Nada mais. Se um cargo não cabe em uma linha, o problema é a linha.
 *
 * Datas conferidas com `resume-pt.yaml`, o currículo ATS mais recente, e não
 * com a versão antiga em markdown (que divergia em Prodígio e não registrava a
 * passagem de contrato para tempo integral na CGE).
 *
 * EDS e ProRaiz são contratos simultâneos ao vínculo principal — por isso as
 * datas se sobrepõem de propósito. O subtítulo da seção explica isso, senão
 * parece erro de digitação.
 *
 * PT-BR no topo, `translations.en` sobrescrevendo campo a campo.
 */
export type ExperienceCopy = {
  role: string;
  line: string;
  period: string;
  employment: string;
  location: string;
};

type ExperienceTranslations = Partial<Record<Lang, Partial<ExperienceCopy>>>;

export type ExperienceRole = ExperienceCopy & {
  key: string;
  company: string; // nome próprio: idêntico nos dois idiomas
  stack: string[];
  current?: boolean;
  /** Entrada curta (estágio): rende uma linha, não um bloco. */
  minor?: boolean;
  translations?: ExperienceTranslations;
};

export function getExperienceCopy(role: ExperienceRole, lang: Lang): ExperienceCopy {
  const override = role.translations?.[lang] ?? {};
  return {
    role: override.role ?? role.role,
    line: override.line ?? role.line,
    period: override.period ?? role.period,
    employment: override.employment ?? role.employment,
    location: override.location ?? role.location,
  };
}

export const experienceData: ExperienceRole[] = [
  {
    key: 'cge',
    company: 'Controladoria-Geral do Estado do Rio de Janeiro',
    role: 'Engenheiro de Software',
    line: 'Sistemas internos que auditor e servidor do estado usam todo dia.',
    period: 'Mai 2023 – Atual',
    employment: 'Contrato, depois tempo integral',
    location: 'Rio de Janeiro · Híbrido',
    current: true,
    stack: [
      'Node.js',
      'Express',
      'TypeScript',
      'React',
      'PHP',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'LDAP/SSO',
      'Docker',
      'CI/CD',
    ],
    translations: {
      en: {
        role: 'Software Engineer',
        line: 'Internal systems that state auditors and civil servants use every day.',
        period: 'May 2023 – Present',
        employment: 'Contract, then full-time',
        location: 'Rio de Janeiro · Hybrid',
      },
    },
  },
  {
    key: 'eds',
    company: 'Extreme Digital Solutions',
    role: 'Consultor de Software',
    line: 'Consultoria full stack para clientes de jurídico e auditoria.',
    period: 'Mar 2025 – Set 2026',
    employment: 'Contrato, simultâneo',
    location: 'Rio de Janeiro · Híbrido',
    stack: ['PHP', 'Python', 'Node.js', 'TypeScript', 'React', 'MySQL', 'Docker', 'CI/CD'],
    translations: {
      en: {
        role: 'Software Consultant',
        line: 'Full-stack consulting for legal and audit clients.',
        period: 'Mar 2025 – Sep 2026',
        employment: 'Contract, concurrent',
        location: 'Rio de Janeiro · Hybrid',
      },
    },
  },
  {
    key: 'proraiz',
    company: 'ProRaiz Sistema de Ensino',
    role: 'Desenvolvedor Front-End',
    line: 'Front-end de uma plataforma de ensino com mais de 30 mil alunos ativos.',
    period: 'Jun 2024 – Dez 2025',
    employment: 'Contrato, simultâneo',
    location: 'Brasil · Remoto',
    stack: ['React', 'Next.js', 'TypeScript', 'Styled-components', 'Storybook', 'Node.js', 'Firebase'],
    translations: {
      en: {
        role: 'Front-End Developer',
        line: 'Front end of a learning platform with more than 30,000 active students.',
        period: 'Jun 2024 – Dec 2025',
        employment: 'Contract, concurrent',
        location: 'Brazil · Remote',
      },
    },
  },
  {
    key: 'prodigio',
    company: 'Prodígio Educação',
    role: 'Desenvolvedor Front-End',
    line: 'Aplicações para alunos, professores e gestores em produtos de ensino.',
    period: 'Jun 2022 – Mar 2025',
    employment: 'Tempo integral',
    location: 'Rio de Janeiro',
    stack: ['React', 'TypeScript', 'JavaScript', 'Firebase', 'REST APIs', 'Styled-components'],
    translations: {
      en: {
        role: 'Front-End Developer',
        line: 'Applications for students, teachers and managers across education products.',
        period: 'Jun 2022 – Mar 2025',
        employment: 'Full-time',
        location: 'Rio de Janeiro',
      },
    },
  },
  {
    key: 'qa',
    company: 'Prodígio Educação',
    role: 'Estagiário de QA / Contribuidor Front-End',
    line: 'Landing pages e testes funcionais a cada release.',
    period: 'Out 2021 – Mai 2022',
    employment: 'Estágio',
    location: 'Rio de Janeiro',
    minor: true,
    stack: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Storybook'],
    translations: {
      en: {
        role: 'QA Intern / Front-End Contributor',
        line: 'Landing pages and functional testing on every release.',
        period: 'Oct 2021 – May 2022',
        employment: 'Internship',
        location: 'Rio de Janeiro',
      },
    },
  },
];