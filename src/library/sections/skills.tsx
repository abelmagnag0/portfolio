"use client";
import { Cloud, Code2, Database, Server } from '@/library/icons';
import { dictionary } from '@/library/utils/dictionary';
import { useSettings } from '@/library/utils/settings-provider';

export function SkillsSection() {
  const { lang } = useSettings();
  const m = dictionary[lang];
  const skillCategories = [
    {
      title: m.skills.cat.frontend,
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'React & Next.js', description: m.skills.desc.frontend[1] },
        { name: 'TypeScript', description: m.skills.desc.frontend[2] },
        { name: 'UX/UI Design', description: m.skills.desc.frontend[3] },
      ],
    },
    {
      title: m.skills.cat.backend,
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'Node.js', description: m.skills.desc.backend[1] },
        { name: 'Python', description: m.skills.desc.backend[2] },
        { name: 'PHP', description: m.skills.desc.backend[3] },
      ],
    },
    {
      title: m.skills.cat.devops,
      icon: Cloud,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'Docker', description: m.skills.desc.devops[1] },
        { name: 'AWS', description: m.skills.desc.devops[2] },
        { name: 'CI/CD', description: m.skills.desc.devops[3] },
      ],
    },
    {
      title: m.skills.cat.database,
      icon: Database,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'MongoDB', description: m.skills.desc.database[1] },
        { name: 'PostgreSQL', description: m.skills.desc.database[2] },
        { name: 'MySQL', description: m.skills.desc.database[3] },
      ],
    },
  ];
  return (
    <section className="py-24 bg-muted/30 cv-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">{m.skills.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
