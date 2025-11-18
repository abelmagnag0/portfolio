"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Mail } from '@/library/icons';
import { dictionary } from '@/library/utils/dictionary';
import { useSettings } from '@/library/utils/settings-provider';

export function HeroSection() {
  const { lang } = useSettings();
  const hero = dictionary[lang].hero;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-primary">{hero.available}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl">
              Abel Magnago
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground">
              {hero.role}
            </p>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              {hero.description}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#projects" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6">
                {hero.cta_portfolio}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 rounded-md px-6">
                <Mail className="w-4 h-4" />
                {hero.cta_contact}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-primary to-primary/50 rounded-full blur-2xl opacity-30" />
              <img
                src="/hero.webp"
                alt="Abel Magnago"
                className="relative rounded-full w-full h-full object-cover border-4 border-primary/20"
                fetchPriority="high"
                decoding="async"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
