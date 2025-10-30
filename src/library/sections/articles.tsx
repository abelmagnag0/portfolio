"use client";
import { Badge } from '@/library/components/badge';
import { ArrowRight, Calendar } from '@/library/icons';
import { motion } from '@/library/utils/motion';

const articles = [
  {
    title: 'Como otimizei pipelines CI/CD com GitLab e Docker',
    summary: 'Estratégias práticas para reduzir o tempo de deploy de 15 para 3 minutos usando cache inteligente e multi-stage builds.',
    date: '15 Out 2024',
    category: 'DevOps',
    readTime: '8 min',
  },
  {
    title: 'UX e performance em sistemas administrativos',
    summary: 'Boas práticas para criar interfaces administrativas que sejam ao mesmo tempo poderosas e intuitivas, sem sacrificar a performance.',
    date: '02 Set 2024',
    category: 'UX/UI',
    readTime: '6 min',
  },
  {
    title: 'Arquitetura Serverless na prática com AWS Lambda',
    summary: 'Estudo de caso real: como migramos uma aplicação monolítica para serverless e reduzimos custos em 60%.',
    date: '20 Ago 2024',
    category: 'Cloud',
    readTime: '10 min',
  },
  {
    title: 'TypeScript avançado: Generics e Type Guards',
    summary: 'Técnicas avançadas de TypeScript para criar código mais seguro e reutilizável em projetos de larga escala.',
    date: '05 Jul 2024',
    category: 'Desenvolvimento',
    readTime: '12 min',
  },
  {
    title: 'Monitoramento e observabilidade em microsserviços',
    summary: 'Como implementar logging, métricas e tracing distribuído para manter visibilidade em arquiteturas complexas.',
    date: '18 Jun 2024',
    category: 'DevOps',
    readTime: '9 min',
  },
  {
    title: 'Design Systems: do Figma ao código React',
    summary: 'Minha abordagem para criar e manter design systems que funcionam tanto para designers quanto para desenvolvedores.',
    date: '30 Mai 2024',
    category: 'UX/UI',
    readTime: '7 min',
  },
];

export function ArticlesSection() {
  return (
    <section id="artigos" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">Artigos & Insights</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Compartilho conhecimento e experiências sobre desenvolvimento, DevOps e design
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{article.category}</Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{article.readTime}</span>
              </div>

              <h3 className="text-xl mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h3>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {article.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {article.date}
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
