"use client";
import { Button } from '@/library/components/button';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

const contactLinks = [
  {
    icon: Github,
    label: 'GitHub',
    value: 'abelmagnag0',
    href: 'https://github.com/abelmagnag0',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/abel-magnago1',
    href: 'https://linkedin.com/in/abel-magnago1',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'abel.magnago@gmail.com',
    href: 'mailto:abel.magnago@gmail.com',
  },
  {
    icon: Phone,
    label: 'WhatsApp',
    value: 'Disponível via LinkedIn',
    href: 'https://linkedin.com/in/abel-magnago1',
  },
];

export function ContactSection() {
  return (
    <section id="contato" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">Vamos Conversar?</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aberto a novos desafios que unam tecnologia, design e impacto real.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contactLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all flex items-center gap-4"
            >
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <link.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-grow">
                <div className="text-sm text-muted-foreground">{link.label}</div>
                <div className="group-hover:text-primary transition-colors">
                  {link.value}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" className="gap-2" asChild>
            <a href="mailto:abel.magnago@gmail.com">
              <Mail className="w-4 h-4" />
              Enviar Email
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
