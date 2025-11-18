"use client";
import { Award, Code2, Users } from '@/library/icons';
import { dictionary } from '@/library/utils/dictionary';
import { useSettings } from '@/library/utils/settings-provider';

export function AboutSection() {
  const { lang } = useSettings();
  const about = dictionary[lang].about;
  const stats = [
    { icon: Award, value: about.stats.years.value, label: about.stats.years.label },
    { icon: Users, value: about.stats.users.value, label: about.stats.users.label },
    { icon: Code2, value: about.stats.stacks.value, label: about.stats.stacks.label },
  ];
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">{about.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">{about.p1}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{about.p2}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{about.p3}</p>
          </div>

          <div className="grid gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
