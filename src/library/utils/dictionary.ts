/**
 * Camada de texto do site.
 *
 * PT-BR é a fonte da verdade: todo texto nasce aqui em português e o inglês
 * espelha a mesma estrutura. O conteúdo de cada projeto mora junto do dado, em
 * `work.data.ts`, com `translations.en` ao lado. Aqui só vive o texto de
 * interface.
 *
 * Regra editorial (revisada em 2026-10-26): escrever como uma pessoa fala.
 * Frase curta, substantivo concreto, nenhum "impacto", "entrega", "melhoria" ou
 * "solução". Nada de numeração de página, escala de impressão ou coordenada:
 * isso era enfeite de revista, não informação.
 *
 * Regra editorial (2026-10-26, segunda passada): quem lê tem que entender, numa
 * passada só, o que a pessoa fez e onde. Frase como "faço o back-end, o
 * front-end e o deploy" lista partes de um cargo; o que fica na cabeça é o
 * objeto concreto ("sistemas que auditor usa todo dia", "do banco de dados à
 * tela"). Também nada de em dash: a frase se resolve com vírgula, ponto ou
 * dois-pontos.
 */
export type Lang = 'pt-BR' | 'en';

type Capability = { name: string; line: string; tools: string[] };

type WorkCopy = {
  title: string;
  subtitle: string;
  role_label: string;
  stack_label: string;
  outcome_label: string;
  /** Ação do card e rótulo acessível do botão que abre o detalhe. */
  open_label: string;
  /** Fechar o painel (rótulo acessível — o controle visível é um "×"). */
  close_label: string;
  /** Rótulo das telas dentro do painel. */
  gallery_label: string;
  /** Legenda de cada tela no carrossel: "<n> de <total>". */
  gallery_counter: string;
  /** Rótulos acessíveis das setas do carrossel. */
  gallery_prev: string;
  gallery_next: string;
};

type ExperienceCopy = {
  title: string;
  subtitle: string;
};

type CredentialGroup = { label: string; items: string[] };

type CredentialsCopy = {
  title: string;
  subtitle: string;
  groups: CredentialGroup[];
};

type ContactCopy = {
  title: string;
  subtitle: string;
  response_note: string;
  channels_label: string;
  cv_label: string;
  form: {
    name: string;
    name_ph: string;
    email: string;
    email_ph: string;
    subject: string;
    subject_ph: string;
    message: string;
    message_ph: string;
    submit: string;
    sending: string;
    success_title: string;
    success_body: string;
    success_again: string;
    error: string;
    required: string;
  };
};

export type NavCopy = {
  work: string;
  experience: string;
  credentials: string;
  capabilities: string;
  source: string;
  contact: string;
  download_cv: string;
  switch_language_title: string;
  theme_toggle: string;
  skip_to_content: string;
};

export type HeroCopy = {
  lead: string;
  cta_work: string;
  cta_contact: string;
  note: string;
  portrait_alt: string;
};

/**
 * A capa — a folha de rosto.
 *
 * Só o cargo, o nome e uma frase. Nada de escala, coordenada ou trocadilho:
 * a capa apresenta, não vende.
 */
export type CoverCopy = {
  role: string;
  intro: string;
  /** Convite a descer para o resto da página. */
  scroll: string;
};

export type CapabilitiesCopy = {
  title: string;
  subtitle: string;
  groups: Capability[];
};

type SourceEntry = { label: string; line: string };
type SourceTreeNode = { path: string; note: string };

/**
 * "O código deste site" — a seção que leva ao repositório público.
 *
 * Existe para quem quer conferir em vez de acreditar: diz o que está lá dentro
 * e aponta para o mesmo repositório que gera a página. O tom é de ficha, não
 * de anúncio — rótulo curto, uma linha por parte.
 */
export type SourceCopy = {
  title: string;
  subtitle: string;
  entries: SourceEntry[];
  repo_label: string;
  repo_visibility: string;
  repo_stack: string;
  tree_label: string;
  tree: SourceTreeNode[];
  cta: string;
  readme_note: string;
};

export type FooterCopy = {
  role: string;
  location: string;
  nav_label: string;
  channels_label: string;
  back_to_top: string;
};

/**
 * Camada opcional de decisões de engenharia (ver `decisions.tsx`).
 * O conteúdo das notas mora em `decisions.data.ts`; aqui só a interface.
 */
export type DecisionsCopy = {
  toggle_on_title: string;
  toggle_off_title: string;
  tour_why: string;
  tour_intro: string;
  tour_stop: string;
  tour_keep: string;
  tour_prev: string;
  tour_next: string;
  tour_done: string;
  tour_close: string;
  stopped_title: string;
  stopped_body: string;
  stopped_back: string;
  stopped_got_it: string;
};

export type LangDictionary = {
  nav: NavCopy;
  cover: CoverCopy;
  hero: HeroCopy;
  work: WorkCopy;
  experience: ExperienceCopy;
  credentials: CredentialsCopy;
  capabilities: CapabilitiesCopy;
  source: SourceCopy;
  contact: ContactCopy;
  footer: FooterCopy;
  decisions: DecisionsCopy;
};

export const dictionary: Record<Lang, LangDictionary> = {
  'pt-BR': {
    nav: {
      work: 'Projetos',
      experience: 'Experiência',
      credentials: 'Formação',
      capabilities: 'Stack',
      source: 'Código',
      contact: 'Contato',
      download_cv: 'Baixar CV',
      switch_language_title: 'Mudar para inglês',
      theme_toggle: 'Trocar tema',
      skip_to_content: 'Ir para o conteúdo',
    },
    cover: {
      role: 'Engenheiro de Software · Rio de Janeiro',
      intro:
        'Sou engenheiro de software no Rio de Janeiro. Desde 2021, construo sistemas web em Node.js, TypeScript, React e AWS, do banco de dados à tela. Hoje trabalho na Controladoria-Geral do Estado do Rio de Janeiro.',
      scroll: 'Ver projetos',
    },
    hero: {
      lead: 'Comecei em 2021 como estagiário de QA na Prodígio Educação. Depois vieram três produtos de ensino, uma consultoria em jurídico e auditoria e, desde 2023, a Controladoria-Geral do Estado do Rio de Janeiro. No dia a dia, Node.js, TypeScript, React e AWS. Também construí a camada de busca e os guardrails de um assistente de IA que responde perguntas sobre documentos internos.',
      cta_work: 'Ver projetos',
      cta_contact: 'Falar comigo',
      note: 'Rio de Janeiro · remoto',
      portrait_alt: 'Retrato de Abel Magnago',
    },
    work: {
      title: 'Projetos',
      subtitle:
        'Sistemas internos e regulados, quase sempre sob NDA. Cada um abre com o problema, o que eu fiz e o resultado.',
      role_label: 'O que eu fiz',
      stack_label: 'Stack',
      outcome_label: 'Resultado',
      open_label: 'Ver detalhes',
      close_label: 'Fechar',
      gallery_label: 'Telas',
      gallery_counter: 'de',
      gallery_prev: 'Tela anterior',
      gallery_next: 'Próxima tela',
    },
    experience: {
      title: 'Experiência',
      subtitle: 'Datas que se repetem são contratos em paralelo.',
    },
    credentials: {
      title: 'Formação',
      subtitle: 'Cursos, certificados e idiomas, com a instituição e a data.',
      groups: [
        {
          label: 'Certificados',
          items: [
            'Certificado em IA e Transformação Digital no Governo, Saïd Business School, Universidade de Oxford (2026)',
            '7 badges de conhecimento AWS: Serverless, Compute, Networking Core, Object Storage, Data Migration, Cloud Essentials e AI-Driven Development Lifecycle (2026)',
            'AWS Essentials, JStack (2025)',
          ],
        },
        {
          label: 'Formação acadêmica',
          items: [
            'Tecnólogo (CST) em Análise e Desenvolvimento de Sistemas, Universidade Unigranrio | Afya (2021–2023)',
          ],
        },
        {
          label: 'Idiomas',
          items: ['Português (nativo)', 'Inglês (profissional)'],
        },
      ],
    },
    capabilities: {
      title: 'Stack',
      subtitle: 'O que eu uso no dia a dia, separado por área.',
      groups: [
        {
          name: 'Interface',
          line: 'React, Next.js e TypeScript no front-end. Tela que abre rápido em conexão ruim e funciona no teclado.',
          tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Styled-components', 'Storybook', 'Vite'],
        },
        {
          name: 'IA',
          line: 'Uso IA todo dia, em cima de código que eu escrevo e reviso. No trabalho, construí a camada de busca e os guardrails de um assistente que responde sobre documentos internos. Também escrevi meu próprio agente de código.',
          tools: ['LLMs', 'RAG', 'Qdrant', 'MCP', 'Agentes de código', 'Node.js', 'TypeScript'],
        },
        {
          name: 'Back-end',
          line: 'API, autenticação e integração com sistemas que já existem.',
          tools: ['Node.js', 'Express', 'REST', 'OpenAPI/Swagger', 'WebSockets', 'SOAP', 'JWT', 'OAuth', 'LDAP/SSO', 'Zod', 'Joi', 'PHP', 'Python'],
        },
        {
          name: 'Dados',
          line: 'Modelagem pensada em quem vai ler o dado depois.',
          tools: ['PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'Modelagem de dados'],
        },
        {
          name: 'Cloud',
          line: 'Deploy na AWS com Docker e pipeline. Log desde o primeiro release.',
          tools: ['AWS (Lambda, S3, CloudFront, Route 53, Cognito, SQS, CloudFormation)', 'Serverless Framework', 'Docker', 'GitHub Actions', 'CI/CD'],
        },
        {
          name: 'Qualidade',
          line: 'Teste contra banco de verdade, revisão de código e combinado escrito.',
          tools: ['Jest', 'Supertest', 'Testes de integração', 'ESLint', 'Prettier', 'Code review', 'Pair programming', 'Scrum'],
        },
      ],
    },
    source: {
      title: 'O código deste site',
      subtitle:
        'A página, a API, a infraestrutura e o painel estão no mesmo repositório público. Dá para ler tudo o que este site afirma.',
      entries: [
        {
          label: 'Página',
          line: 'Next.js 15 com export estático. Sem servidor de aplicação: o HTML sai do build e vive no S3.',
        },
        {
          label: 'API',
          line: 'Cinco funções Lambda em Node.js. O formulário grava no DynamoDB antes de tentar o e-mail, então o lead não se perde se o SES falhar.',
        },
        {
          label: 'Infra',
          line: 'CloudFormation escrito como recursos do Serverless Framework: CloudFront, API Gateway, tabelas, Cognito, S3 e DNS no mesmo deploy.',
        },
        {
          label: 'Painel',
          line: 'Login no Cognito com TOTP obrigatório. As rotas de admin são barradas no API Gateway antes de chegar na função.',
        },
        {
          label: 'IA',
          line: 'Desde 2025, boa parte do que eu escrevo é com IA do lado: Claude, Copilot, Qwen, DeepSeek, MiniMax, todos por terminal. Eu reviso e reescrevo o que entra.',
        },
      ],
      repo_label: 'Repositório',
      repo_visibility: 'Público',
      repo_stack: 'Next.js · TypeScript · Node.js · Serverless Framework · AWS',
      tree_label: 'O que tem dentro',
      tree: [
        { path: 'src/', note: 'interface, seções e textos' },
        { path: 'backend/', note: 'Lambda do contato, das métricas e do painel' },
        { path: 'sls/', note: 'CloudFront, DNS, S3, tabelas e Cognito' },
        { path: 'scripts/', note: 'build, publicação e admin' },
      ],
      cta: 'Abrir no GitHub',
      readme_note:
        'O README tem a arquitetura e o porquê de cada serviço. É por onde eu começaria.',
    },
    contact: {
      title: 'Contato',
      subtitle: 'Me conta o que você precisa e onde está travando.',
      response_note: 'Respondo em até um dia útil.',
      channels_label: 'Direto',
      cv_label: 'Currículo completo',
      form: {
        name: 'Nome',
        name_ph: 'Como devo te chamar',
        email: 'E-mail',
        email_ph: 'voce@empresa.com',
        subject: 'Assunto',
        subject_ph: 'Projeto, dúvida ou só um oi',
        message: 'Mensagem',
        message_ph: 'Contexto, prazo, o que for útil.',
        submit: 'Enviar mensagem',
        sending: 'Enviando…',
        success_title: 'Recebido.',
        success_body: 'Sua mensagem chegou. Respondo no e-mail que você deixou, em até um dia útil.',
        success_again: 'Enviar outra mensagem',
        error: 'Não deu para enviar agora. Tenta de novo ou me chama em um dos canais ao lado.',
        required: 'Preciso de nome, um e-mail válido e uma mensagem com pelo menos 10 caracteres.',
      },
    },
    footer: {
      role: 'Engenheiro de Software',
      location: 'Duque de Caxias, Rio de Janeiro',
      nav_label: 'Navegar',
      channels_label: 'Links',
      back_to_top: 'Voltar ao topo',
    },
    decisions: {
      toggle_on_title: 'Esconder as notas',
      toggle_off_title: 'Mostrar as notas',
      tour_why: 'Por que estou vendo isso?',
      tour_intro:
        'Cada seção tem uma decisão por trás. Estas notas contam o que eu escolhi e por quê. Dá para desligar quando quiser.',
      tour_stop: 'Parar de ver',
      tour_keep: 'Deixo ligado',
      tour_prev: 'Anterior',
      tour_next: 'Próxima',
      tour_done: 'Concluir',
      tour_close: 'Fechar as notas',
      stopped_title: 'Notas desligadas',
      stopped_body:
        'Dá para trazer de volta pelo ícone de olho, no topo da página, ao lado do tema.',
      stopped_back: 'Trazer de volta',
      stopped_got_it: 'Entendi',
    },
  },

  en: {
    nav: {
      work: 'Projects',
      experience: 'Experience',
      credentials: 'Education',
      capabilities: 'Stack',
      source: 'Code',
      contact: 'Contact',
      download_cv: 'Download CV',
      switch_language_title: 'Switch to Portuguese',
      theme_toggle: 'Toggle theme',
      skip_to_content: 'Skip to content',
    },
    cover: {
      role: 'Software Engineer · Rio de Janeiro',
      intro:
        "I'm a software engineer in Rio de Janeiro. Since 2021 I've been building web systems in Node.js, TypeScript, React and AWS, from the database to the screen. Today I work at the Rio de Janeiro State Comptroller's Office.",
      scroll: 'See projects',
    },
    hero: {
      lead: "I started in 2021 as a QA intern at Prodígio Educação. Then came three education products, a legal and audit consultancy and, since 2023, the Rio de Janeiro State Comptroller's Office. Day to day it's Node.js, TypeScript, React and AWS. I also built the retrieval and guardrail layer of an AI assistant that answers questions over internal documents.",
      cta_work: 'See projects',
      cta_contact: 'Get in touch',
      note: 'Rio de Janeiro · remote',
      portrait_alt: 'Portrait of Abel Magnago',
    },
    work: {
      title: 'Projects',
      subtitle:
        'Internal, regulated systems, almost always under NDA. Each one opens with the problem, what I did and the result.',
      role_label: 'What I did',
      stack_label: 'Stack',
      outcome_label: 'Result',
      open_label: 'See details',
      close_label: 'Close',
      gallery_label: 'Screens',
      gallery_counter: 'of',
      gallery_prev: 'Previous screen',
      gallery_next: 'Next screen',
    },
    experience: {
      title: 'Experience',
      subtitle: 'Overlapping dates are concurrent contracts.',
    },
    credentials: {
      title: 'Education',
      subtitle: 'Courses, certificates and languages, with the institution and the date.',
      groups: [
        {
          label: 'Certificates',
          items: [
            'Certificate in AI and Digital Transformation in Government, Saïd Business School, University of Oxford (2026)',
            '7 AWS Knowledge badges: Serverless, Compute, Networking Core, Object Storage, Data Migration, Cloud Essentials and AI-Driven Development Lifecycle (2026)',
            'AWS Essentials, JStack (2025)',
          ],
        },
        {
          label: 'Degree',
          items: [
            'Associate Degree (CST) in Systems Analysis and Development, Universidade Unigranrio | Afya (2021–2023)',
          ],
        },
        {
          label: 'Languages',
          items: ['Portuguese (native)', 'English (professional)'],
        },
      ],
    },
    capabilities: {
      title: 'Stack',
      subtitle: 'What I use day to day, by area.',
      groups: [
        {
          name: 'Interface',
          line: 'React, Next.js and TypeScript on the front end. Screens that load fast on a bad connection and work from the keyboard.',
          tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Styled-components', 'Storybook', 'Vite'],
        },
        {
          name: 'AI',
          line: 'I use AI every day, on code I write and review myself. At work I built the retrieval and guardrail layer of an assistant that answers over internal documents. I also wrote my own coding agent.',
          tools: ['LLMs', 'RAG', 'Qdrant', 'MCP', 'Coding agents', 'Node.js', 'TypeScript'],
        },
        {
          name: 'Backend',
          line: 'APIs, authentication and integration with systems that already exist.',
          tools: ['Node.js', 'Express', 'REST', 'OpenAPI/Swagger', 'WebSockets', 'SOAP', 'JWT', 'OAuth', 'LDAP/SSO', 'Zod', 'Joi', 'PHP', 'Python'],
        },
        {
          name: 'Data',
          line: 'Modelled for whoever reads the data later.',
          tools: ['PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'Data modelling'],
        },
        {
          name: 'Cloud',
          line: 'Deploys on AWS with Docker and a pipeline. Logs from the first release.',
          tools: ['AWS (Lambda, S3, CloudFront, Route 53, Cognito, SQS, CloudFormation)', 'Serverless Framework', 'Docker', 'GitHub Actions', 'CI/CD'],
        },
        {
          name: 'Quality',
          line: 'Tests against a real database, code review, and agreements written down.',
          tools: ['Jest', 'Supertest', 'Integration testing', 'ESLint', 'Prettier', 'Code review', 'Pair programming', 'Scrum'],
        },
      ],
    },
    source: {
      title: "This site's code",
      subtitle:
        'The page, the API, the infrastructure and the panel live in one public repository. Everything this site claims can be read there.',
      entries: [
        {
          label: 'Page',
          line: 'Next.js 15 as a static export. No application server: the HTML comes out of the build and lives in S3.',
        },
        {
          label: 'API',
          line: 'Five Node.js Lambda functions. The contact form writes to DynamoDB before trying the e-mail, so a lead survives an SES failure.',
        },
        {
          label: 'Infra',
          line: 'CloudFormation written as Serverless Framework resources: CloudFront, API Gateway, tables, Cognito, S3 and DNS in one deploy.',
        },
        {
          label: 'Panel',
          line: 'Cognito login with mandatory TOTP. API Gateway blocks the admin routes before they reach the function.',
        },
        {
          label: 'AI',
          line: 'Since 2025, a good part of what I write has AI next to it: Claude, Copilot, Qwen, DeepSeek, MiniMax, all through the terminal. I review and rewrite what goes in.',
        },
      ],
      repo_label: 'Repository',
      repo_visibility: 'Public',
      repo_stack: 'Next.js · TypeScript · Node.js · Serverless Framework · AWS',
      tree_label: 'What is inside',
      tree: [
        { path: 'src/', note: 'interface, sections and copy' },
        { path: 'backend/', note: 'contact, analytics and admin Lambdas' },
        { path: 'sls/', note: 'CloudFront, DNS, S3, tables and Cognito' },
        { path: 'scripts/', note: 'build, publish and admin' },
      ],
      cta: 'Open on GitHub',
      readme_note:
        'The README has the architecture and the reason for each service. It is where I would start.',
    },
    contact: {
      title: 'Contact',
      subtitle: "Tell me what you need and where it's stuck.",
      response_note: 'I reply within one business day.',
      channels_label: 'Direct',
      cv_label: 'Full résumé',
      form: {
        name: 'Name',
        name_ph: 'What should I call you',
        email: 'Email',
        email_ph: 'you@company.com',
        subject: 'Subject',
        subject_ph: 'A project, a question, or just to say hi',
        message: 'Message',
        message_ph: 'Context, timeline, whatever is useful.',
        submit: 'Send message',
        sending: 'Sending…',
        success_title: 'Got it.',
        success_body: "Your message landed. I'll reply to the email you left, within one business day.",
        success_again: 'Send another message',
        error: "Couldn't send it just now. Try again or reach me on one of the channels beside this form.",
        required: 'I need a name, a valid email, and a message of at least 10 characters.',
      },
    },
    footer: {
      role: 'Software Engineer',
      location: 'Duque de Caxias, Rio de Janeiro',
      nav_label: 'Navigate',
      channels_label: 'Links',
      back_to_top: 'Back to top',
    },
    decisions: {
      toggle_on_title: 'Hide the notes',
      toggle_off_title: 'Show the notes',
      tour_why: 'Why am I seeing this?',
      tour_intro:
        'Each section has a decision behind it. These notes say what I chose and why. You can turn them off whenever you want.',
      tour_stop: 'Stop seeing them',
      tour_keep: 'Keep them on',
      tour_prev: 'Previous',
      tour_next: 'Next',
      tour_done: 'Done',
      tour_close: 'Close the notes',
      stopped_title: 'Notes off',
      stopped_body:
        'You can bring them back with the eye icon at the top of the page, next to the theme toggle.',
      stopped_back: 'Bring them back',
      stopped_got_it: 'Got it',
    },
  },
};

/** Atalho para o bloco de um idioma. */
export function getDictionary(lang: Lang): LangDictionary {
  return dictionary[lang];
}