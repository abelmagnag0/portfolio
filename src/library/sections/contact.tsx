import { Github, Linkedin, Mail } from '@/library/icons';
import { dictionary } from '@/library/utils/dictionary';
import React from 'react';

type ContactLink = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

const contactLinks: ContactLink[] = [
  {
    icon: Github,
    label: 'GitHub',
    value: 'abelmagnag0',
    href: 'https://github.com/abelmagnag0',
    external: true,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/abel-magnago1',
    href: 'https://linkedin.com/in/abel-magnago1',
    external: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'abel.magnago@gmail.com',
    href: 'mailto:abel.magnago@gmail.com',
  },
];

export function ContactSection() {
  const m = dictionary['pt-BR'];
  return (
    <section id="contato" className="py-24 bg-muted/30 cv-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">{m.contact.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {m.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all flex items-center gap-4"
            >
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <link.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="grow">
                <div className="text-sm text-muted-foreground">{link.label}</div>
                <div className="group-hover:text-primary transition-colors">{link.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
