"use client";
import { Moon, Sun } from '@/library/icons';
import { useEffect, useState } from 'react';
// Removed unused component. This file is intentionally left blank to be deleted.
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const stored = (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) as 'light' | 'dark' | null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: 'light' | 'dark' = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    const root = document.documentElement;
    if (initial === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined') localStorage.setItem('theme', next);
    const root = document.documentElement;
    if (next === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-accent transition-colors"
      aria-label="Alternar tema"
      title="Alternar tema"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
