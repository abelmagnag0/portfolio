"use client";
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { dictionary, type Lang, type TranslationKey } from './dictionary';

type Theme = 'light' | 'dark';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<Theme>('dark');
  const [lang, setLangState] = useState<Lang>('pt-BR');

  // Initialize from localStorage and path
  useEffect(() => {
    const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) as Theme | null;
    const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('lang') : null) as Lang | null;

    const initialTheme: Theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
    const initialLang: Lang = savedLang === 'en' || savedLang === 'pt-BR' ? savedLang : 'pt-BR'

    setThemeState(initialTheme);
    setLangState(initialLang);

    const root = document.documentElement;
    if (initialTheme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    root.setAttribute('lang', initialLang);
  }, [pathname]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    if (typeof window !== 'undefined') localStorage.setItem('theme', t);
    const root = document.documentElement;
    if (t === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
    document.documentElement.setAttribute('lang', l);
    // Nota: não navegamos para outra rota para evitar remount e perda de estado durante a troca
  };

  const toggleLanguage = () => setLang(lang === 'en' ? 'pt-BR' : 'en');

  const t = useMemo(() => {
    const m = dictionary[lang];
    const map: Record<TranslationKey, string> = {
      'nav.about': m.nav.about,
      'nav.projects': m.nav.projects,
      'nav.articles': m.nav.articles,
      'nav.contact': m.nav.contact,
      'nav.download_cv': m.nav.download_cv,
      'nav.switch_language_title': m.nav.switch_language_title,
      'hero.available': m.hero.available,
      'hero.role': m.hero.role,
      'hero.description': m.hero.description,
      'hero.cta_portfolio': m.hero.cta_portfolio,
      'hero.cta_contact': m.hero.cta_contact,
      'about.title': m.about.title,
      'about.p1': m.about.p1,
      'about.p2': m.about.p2,
      'about.p3': m.about.p3,
      'about.stats.years.value': m.about.stats.years.value,
      'about.stats.years.label': m.about.stats.years.label,
      'about.stats.users.value': m.about.stats.users.value,
      'about.stats.users.label': m.about.stats.users.label,
      'about.stats.stacks.value': m.about.stats.stacks.value,
      'about.stats.stacks.label': m.about.stats.stacks.label,
      'skills.title': m.skills.title,
      'skills.cat.frontend': m.skills.cat.frontend,
      'skills.cat.backend': m.skills.cat.backend,
      'skills.cat.devops': m.skills.cat.devops,
      'skills.cat.database': m.skills.cat.database,
      'skills.desc.frontend.1': m.skills.desc.frontend[1],
      'skills.desc.frontend.2': m.skills.desc.frontend[2],
      'skills.desc.frontend.3': m.skills.desc.frontend[3],
      'skills.desc.backend.1': m.skills.desc.backend[1],
      'skills.desc.backend.2': m.skills.desc.backend[2],
      'skills.desc.backend.3': m.skills.desc.backend[3],
      'skills.desc.devops.1': m.skills.desc.devops[1],
      'skills.desc.devops.2': m.skills.desc.devops[2],
      'skills.desc.devops.3': m.skills.desc.devops[3],
      'skills.desc.database.1': m.skills.desc.database[1],
      'skills.desc.database.2': m.skills.desc.database[2],
      'skills.desc.database.3': m.skills.desc.database[3],
      'projects.title': m.projects.title,
      'projects.badge.private': m.projects.badge.private,
      'projects.badge.public': m.projects.badge.public,
      'projects.badge.authoral': m.projects.badge.authoral,
      'projects.tech_used': m.projects.tech_used,
      'projects.impact': m.projects.impact,
      'articles.title': m.articles.title,
      'articles.subtitle': m.articles.subtitle,
      'contact.title': m.contact.title,
      'contact.subtitle': m.contact.subtitle,
      'contact.cta_email': m.contact.cta_email,
      'testimonials.title': m.testimonials.title,
      'footer.role': m.footer.role,
    };
    return (key: TranslationKey) => map[key] ?? key;
  }, [lang]);

  const value: SettingsContextType = {
    theme,
    setTheme,
    toggleTheme,
    lang,
    setLang,
    toggleLanguage,
    t,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
