"use client";
import { Badge } from '@/library/components/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/library/components/dialog';
import { ImageWithFallback } from '@/library/components/image-with-fallback';
import { Globe, Lock } from '@/library/icons';
import type { Lang } from '@/library/utils/dictionary';
import { motion } from '@/library/utils/motion';
import { useSettings } from '@/library/utils/settings-provider';

function getProjects(lang: Lang) {
  const isEn = lang === 'en';
  return [
    {
      title: isEn ? 'Public Audit System' : 'Sistema de Auditoria Pública',
      description: isEn ? 'Complete platform for managing government audits' : 'Plataforma completa para gestão de auditorias governamentais',
      longDescription: isEn
        ? 'System developed for the state government, used by over 200 auditors. Includes planning, execution and reporting modules, with customized workflow and analytical dashboards.'
        : 'Sistema desenvolvido para o governo do estado, utilizado por mais de 200 auditores. Inclui módulos de planejamento, execução e relatórios de auditorias, com workflow customizado e dashboards analíticos.',
      image: 'https://images.unsplash.com/photo-1665470909939-959569b20021?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzYxNjcwMDUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      type: 'privado',
      impact: isEn ? '200+ auditors use it daily' : '+200 auditores utilizam diariamente',
    },
    {
      title: isEn ? 'Educational Mobile Platform' : 'Plataforma Educacional Mobile',
      description: isEn ? 'Educational app with over 30k active students' : 'App educacional com mais de 30 mil alunos ativos',
      longDescription: isEn
        ? 'Mobile app for distance education with video classes, interactive exercises, gamification and badges. Integrated with RESTful API and push notifications.'
        : 'Aplicativo mobile para educação à distância, com videoaulas, exercícios interativos, gamificação e sistema de badges. Integrado com API RESTful e sistema de notificações push.',
      image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ258ZW58MXx8fHwxNzYxNjU4Mjc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stack: ['React Native', 'TypeScript', 'FastAPI', 'MongoDB'],
      type: 'privado',
      impact: isEn ? '30k+ active users' : '+30 mil usuários ativos',
    },
    {
      title: isEn ? 'Serverless Cloud Infrastructure' : 'Infraestrutura Cloud Serverless',
      description: isEn ? 'Migration to serverless architecture on AWS' : 'Migração de infraestrutura para arquitetura serverless na AWS',
      longDescription: isEn
        ? 'Modernization project from legacy to serverless architecture using Lambda, API Gateway, DynamoDB and S3. 60% cost reduction.'
        : 'Projeto de modernização de infraestrutura legada para arquitetura serverless, utilizando Lambda, API Gateway, DynamoDB e S3. Redução de 60% nos custos operacionais.',
      image: 'https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NjE2NDQxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stack: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'CloudFormation'],
      type: 'privado',
      impact: isEn ? '60% cost reduction' : '60% redução de custos',
    },
    {
      title: isEn ? 'Internal Corporate Portal' : 'Portal Corporativo Interno',
      description: isEn ? 'Internal management system with multiple integrated modules' : 'Sistema de gestão interna com múltiplos módulos integrados',
      longDescription: isEn
        ? 'Portal to centralize internal processes, including HR, finance, projects and internal comms. Modern React interface and robust backend.'
        : 'Portal desenvolvido para centralizar processos internos de uma empresa, incluindo RH, financeiro, projetos e comunicação interna. Interface moderna com React e backend robusto.',
      image: 'https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYxNTgxMzAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stack: ['Next.js', 'Node.js', 'MySQL', 'Docker'],
      type: 'privado',
      impact: isEn ? '500+ employees' : '500+ colaboradores',
    },
    {
      title: isEn ? 'Optimized CI/CD Pipeline' : 'Pipeline CI/CD Otimizado',
      description: isEn ? 'Full deploy automation with GitLab CI and Docker' : 'Automação completa de deploy com GitLab CI e Docker',
      longDescription: isEn
        ? 'Automated CI/CD pipeline for multiple projects: automated tests, code analysis, build and deploy across environments.'
        : 'Implementação de pipeline CI/CD automatizado para múltiplos projetos, incluindo testes automatizados, análise de código, build e deploy em múltiplos ambientes.',
      image: 'https://images.unsplash.com/photo-1595623654300-b27329804025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29kZXxlbnwxfHx8fDE3NjE2NzAwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stack: ['GitLab CI', 'Docker', 'Kubernetes', 'AWS'],
      type: 'autoral',
      impact: isEn ? 'Deploy time: 15min → 3min' : 'Deploy time: 15min → 3min',
    },
    {
      title: isEn ? 'Real-time Analytics Dashboard' : 'Dashboard Analytics em Tempo Real',
      description: isEn ? 'Data visualization with real-time updates' : 'Visualização de dados com atualização em tempo real',
      longDescription: isEn
        ? 'Dashboard with real-time metrics and KPIs using WebSockets. Rich UI with interactive charts and advanced filters.'
        : 'Dashboard com métricas e KPIs atualizados em tempo real usando WebSockets. Interface rica com gráficos interativos e filtros avançados.',
      image: 'https://images.unsplash.com/photo-1665470909939-959569b20021?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzYxNjcwMDUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stack: ['React', 'WebSocket', 'Python', 'Redis'],
      type: 'autoral',
      impact: isEn ? 'Real-time data' : 'Dados em tempo real',
    },
  ];
}

export function ProjectsSection() {
  const { t, lang } = useSettings();
  const projects = getProjects(lang);
  return (
    <section id="projetos" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">{t('projects.title')}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant={project.type === 'autoral' ? 'default' : 'secondary'}>
                          {project.type === 'privado' ? (
                            <><Lock className="w-3 h-3 mr-1" /> {t('projects.badge.private')}</>
                          ) : project.type === 'autoral' ? (
                            <><Globe className="w-3 h-3 mr-1" /> {t('projects.badge.authoral')}</>
                          ) : (
                            <><Globe className="w-3 h-3 mr-1" /> {t('projects.badge.public')}</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col grow">
                      <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 grow">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.stack.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="text-sm text-primary">
                        {project.impact}
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>{project.description}</DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    
                    <p className="text-muted-foreground">
                      {project.longDescription}
                    </p>
                    
                    <div>
                      <h4 className="mb-2">{t('projects.tech_used')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">{t('projects.impact')}</div>
                      <div className="text-lg">{project.impact}</div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
