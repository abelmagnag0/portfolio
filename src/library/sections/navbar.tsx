"use client";
import { Download, Moon, Sun } from '@/library/icons';
import { motion } from '@/library/utils/motion';
import { Button } from '../components/button';
import { useTheme } from '../utils/theme-provider';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white">AM</span>
              </div>
            </button>
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('sobre')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection('projetos')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Projetos
              </button>
              <button
                onClick={() => scrollToSection('artigos')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Artigos
              </button>
              <button
                onClick={() => scrollToSection('contato')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contato
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Baixar CV
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
