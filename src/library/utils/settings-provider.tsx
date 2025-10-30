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
    const initialLang: Lang = pathname?.startsWith('/en') ? 'en' : (savedLang === 'en' || savedLang === 'pt-BR' ? savedLang : 'pt-BR');

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
