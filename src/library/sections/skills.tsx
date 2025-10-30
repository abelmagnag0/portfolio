"use client";
import { Cloud, Code2, Database, Server } from '@/library/icons';
import type { TranslationKey } from '@/library/utils/dictionary';
import { motion } from '@/library/utils/motion';
import { useSettings } from '@/library/utils/settings-provider';

function useSkillCategories(t: (k: TranslationKey) => string) {
  return [
    {
      title: t('skills.cat.frontend'),
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'React & Next.js', description: t('skills.desc.frontend.1') },
        { name: 'TypeScript', description: t('skills.desc.frontend.2') },
        { name: 'UX/UI Design', description: t('skills.desc.frontend.3') },
      ],
    },
    {
      title: t('skills.cat.backend'),
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'Node.js', description: t('skills.desc.backend.1') },
        { name: 'Python', description: t('skills.desc.backend.2') },
        { name: 'PHP', description: t('skills.desc.backend.3') },
      ],
    },
    {
      title: t('skills.cat.devops'),
      icon: Cloud,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'Docker', description: t('skills.desc.devops.1') },
        { name: 'AWS', description: t('skills.desc.devops.2') },
        { name: 'CI/CD', description: t('skills.desc.devops.3') },
      ],
    },
    {
      title: t('skills.cat.database'),
      icon: Database,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'MongoDB', description: t('skills.desc.database.1') },
        { name: 'PostgreSQL', description: t('skills.desc.database.2') },
        { name: 'MySQL', description: t('skills.desc.database.3') },
      ],
    },
  ];
}

export function SkillsSection() {
  const { t } = useSettings();
  const skillCategories = useSkillCategories(t);
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
          <h2 className="text-4xl md:text-5xl mb-4">{t('skills.title')}</h2>
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
                  <div className={`p-3 rounded-xl bg-linear-to-br ${category.color} bg-opacity-10`}>
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
