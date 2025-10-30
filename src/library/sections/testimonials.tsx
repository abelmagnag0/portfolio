
"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/library/components/avatar';
import { Quote } from '@/library/icons';
import { motion } from '@/library/utils/motion';
import { useSettings } from '@/library/utils/settings-provider';

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Gestor de Tecnologia',
    company: 'Empresa Pública',
    content: 'Abel tem visão de produto e domínio técnico acima da média. Sua capacidade de traduzir requisitos complexos em soluções elegantes foi fundamental para o sucesso dos nossos projetos.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    initials: 'CS',
  },
  {
    name: 'Marina Costa',
    role: 'Product Manager',
    company: 'EdTech Startup',
    content: 'Trabalhar com Abel foi uma experiência excepcional. Ele não apenas entrega código de qualidade, mas também contribui ativamente com ideias para melhorar a experiência do usuário.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    initials: 'MC',
  },
  {
    name: 'Roberto Almeida',
    role: 'Tech Lead',
    company: 'Fintech',
    content: 'A expertise de Abel em DevOps e Cloud foi crucial para otimizar nossa infraestrutura. Conseguimos reduzir custos significativamente mantendo alta performance.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    initials: 'RA',
  },
];

export function TestimonialsSection() {
  const { t } = useSettings();
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
          <h2 className="text-4xl md:text-5xl mb-4">{t('testimonials.title')}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              
              <div className="relative z-10">
                <p className="text-muted-foreground mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
