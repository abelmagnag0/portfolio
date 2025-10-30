"use client";
import { Button } from '@/library/components/button';
import { ImageWithFallback } from '@/library/components/image-with-fallback';
import { ArrowRight, Mail } from '@/library/icons';
import { motion } from '@/library/utils/motion';
import { useSettings } from '@/library/utils/settings-provider';

export function HeroSection() {
  const { t } = useSettings();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background gradient */}
  <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-primary">{t('hero.available')}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl">
              Abel Magnago
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground">
              {t('hero.role')}
            </p>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => scrollToSection('projetos')}
                className="gap-2"
              >
                {t('hero.cta_portfolio')}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('contato')}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                {t('hero.cta_contact')}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-primary to-primary/50 rounded-full blur-2xl opacity-30" />
              <ImageWithFallback
                src="/hero.jpeg"
                alt="Abel Magnago"
                className="relative rounded-full w-full h-full object-cover border-4 border-primary/20"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
