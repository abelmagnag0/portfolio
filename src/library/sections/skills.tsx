"use client";
import { Cloud, Code2, Database, Server } from 'lucide-react';
import { motion } from 'motion/react';

const skillCategories = [
  {
    title: 'Front-End',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React & Next.js', description: 'Aplicações web modernas e performáticas' },
      { name: 'TypeScript', description: 'Código type-safe e escalável' },
      { name: 'UX/UI Design', description: 'Interfaces intuitivas e acessíveis' },
    ],
  },
  {
    title: 'Back-End',
    icon: Server,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js', description: 'APIs RESTful e GraphQL escaláveis' },
      { name: 'Python', description: 'FastAPI, Flask para microsserviços' },
      { name: 'PHP', description: 'Sistemas legados e WordPress' },
    ],
  },
  {
    title: 'DevOps & Cloud',
    icon: Cloud,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Docker', description: 'Containerização de aplicações' },
      { name: 'AWS', description: 'EC2, S3, Lambda, CloudFront' },
      { name: 'CI/CD', description: 'GitLab CI, GitHub Actions' },
    ],
  },
  {
    title: 'Banco de Dados',
    icon: Database,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'MongoDB', description: 'NoSQL para dados flexíveis' },
      { name: 'PostgreSQL', description: 'Banco relacional robusto' },
      { name: 'MySQL', description: 'Queries otimizadas' },
    ],
  },
];

export function SkillsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">Habilidades & Tecnologias</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} bg-opacity-10`}>
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="border-l-2 border-primary/20 pl-4 group-hover:border-primary/50 transition-colors"
                  >
                    <div className="text-lg">{skill.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {skill.description}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
