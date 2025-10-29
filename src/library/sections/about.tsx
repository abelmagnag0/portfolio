"use client";
import { Award, Code2, Users } from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  {
    icon: Award,
    value: '+4 anos',
    label: 'de experiência',
  },
  {
    icon: Users,
    value: '+30 mil',
    label: 'usuários impactados',
  },
  {
    icon: Code2,
    value: '5 stacks',
    label: 'dominadas',
  },
];

export function AboutSection() {
  return (
    <section id="sobre" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">Sobre Mim</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sou desenvolvedor com experiência em produtos educacionais e governamentais, 
              com foco em escalabilidade, automação e UX.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Atuo liderando times front-end e implementando pipelines CI/CD em nuvem, 
              sempre buscando entregar soluções que combinem excelência técnica com 
              impacto real para os usuários.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Acredito que bons produtos nascem da união entre código limpo, design 
              intuitivo e infraestrutura sólida. Meu objetivo é transformar desafios 
              complexos em experiências simples e eficientes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
