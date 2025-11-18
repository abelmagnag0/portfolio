"use client";

import { Download, Globe, Moon } from '@/library/icons';
import { useSettings } from '@/library/utils/settings-provider';
import { Button } from '../components/button';

export function Navbar() {
  const { lang, toggleLanguage, t } = useSettings();
  const navItems = [
    { key: 'nav.about', href: '#about' },
    { key: 'nav.projects', href: '#projects' },
    { key: 'nav.contact', href: '#contact' },
  ] as const;
  const cvHref = lang === 'pt-BR' ? '/cv/pt-br.pdf' : '/cv/en.pdf';
  const nextLanguageLabel = lang === 'pt-BR' ? 'EN' : 'PT';
  const themeToggleLabel = lang === 'pt-BR' ? 'Alternar tema' : 'Toggle theme';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white">AM</span>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t(item.key)}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle de tema sem hidratação React */}
            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label={themeToggleLabel}
              title={themeToggleLabel}
              data-theme-toggle
            >
              <Moon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
              aria-label={t('nav.switch_language_title')}
              title={t('nav.switch_language_title')}
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium" suppressHydrationWarning>
                {nextLanguageLabel}
              </span>
            </button>
            <Button className="gap-2" asChild>
              <a
                href={cvHref}
                download
              >
                <Download className="w-4 h-4" />
                {t('nav.download_cv')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
