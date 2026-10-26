"use client";
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { dictionary, type Lang, type LangDictionary } from './dictionary';

interface SettingsContextType {
  lang: Lang;
  /** Bloco de texto do idioma atual. */
  copy: LangDictionary;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Estado de preferência do visitante.
 *
 * Hoje isto é só o idioma. O tema saiu daqui: quem manda nele é o
 * `THEME_SCRIPT` do root-shell, que aplica a classe antes do primeiro paint e
 * escuta o clique `[data-theme-toggle]` por delegação. Manter uma segunda
 * cópia em `useState` era estado duplicado — a página não renderiza o tema a
 * partir do React em lugar nenhum — e só criava superfície para divergir do
 * que o script já tinha aplicado no `<html>`.
 *
 * Só os componentes interativos consomem isto (`AnchorNav`, `ContactForm`).
 * O conteúdo das seções é renderizado no servidor e recebe o idioma por prop —
 * por isso não existe um `t(key)` com um mapa de ~60 chaves duplicando o
 * dicionário: as seções leem `dictionary[lang]` direto, tipado.
 *
 * A troca de idioma NÃO mora mais aqui. Ela era um `toggleLanguage` que chamava
 * `router.push`, e como cada idioma tem URL e raiz de layout próprias, aquilo
 * era só um jeito complicado de pedir uma troca de documento — que quebra
 * quando a hidratação não acontece e que dependia do roteador do cliente para
 * uma navegação que é, na prática, um link. Virou `<a href>` no `AnchorNav`;
 * aqui sobrou o que é de verdade estado de preferência: ler o idioma da rota.
 */
export function SettingsProvider({
  children,
  // O `RootShell` sempre passa o idioma da rota; este padrão só existe para o
  // componente não depender disso. É `en` porque é o idioma da raiz.
  initialLang = 'en',
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>(initialLang);

  // O idioma é derivado da rota: ela é a fonte da verdade para SEO e para
  // links compartilháveis, e é o que decide qual casca de root renderiza.
  // O inglês mora na raiz, então o que identifica o português é o prefixo `/pt`
  // — não o contrário, como era antes de a raiz virar inglês.
  useEffect(() => {
    const routeLang: Lang = pathname?.startsWith('/pt') ? 'pt-BR' : 'en';
    setLang(routeLang);
    document.documentElement.setAttribute('lang', routeLang);
  }, [pathname]);

  const value: SettingsContextType = {
    lang,
    copy: dictionary[lang],
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}