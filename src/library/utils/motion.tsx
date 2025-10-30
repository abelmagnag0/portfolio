"use client";

import * as React from "react";

type Numeric = number | string | undefined;

type MotionStyle = {
  opacity?: number;
  x?: Numeric;
  y?: Numeric;
  scale?: number;
};

type MotionTransition = {
  duration?: number; // seconds
  delay?: number; // seconds
  easing?: string; // CSS easing
};

type ViewportOptions = {
  once?: boolean;
  rootMargin?: string;
  amount?: number; // 0..1 threshold
};

type MotionCommonProps = {
  initial?: MotionStyle;
  animate?: MotionStyle;
  whileInView?: MotionStyle;
  viewport?: ViewportOptions;
  transition?: MotionTransition;
};

function toPx(v: Numeric): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v === "number") return `${v}px`;
  return v;
}

function buildTransform(style: MotionStyle): string | undefined {
  const parts: string[] = [];
  const x = toPx(style.x);
  const y = toPx(style.y);
  if (x || y) parts.push(`translate3d(${x ?? 0}, ${y ?? 0}, 0)`);
  if (style.scale !== undefined) parts.push(`scale(${style.scale})`);
  return parts.length ? parts.join(" ") : undefined;
}

function mergeStyles(base?: MotionStyle, override?: MotionStyle): MotionStyle | undefined {
  if (!base && !override) return undefined;
  return { ...(base ?? {}), ...(override ?? {}) };
}

function applyMotionStyle(style?: MotionStyle): React.CSSProperties {
  if (!style) return {};
  const { opacity } = style;
  const transform = buildTransform(style);
  return {
    ...(opacity !== undefined ? { opacity } : {}),
    ...(transform ? { transform } : {}),
    willChange: transform ? "transform, opacity" : "opacity",
  } as React.CSSProperties;
}

function useInView(ref: React.RefObject<Element>, opts?: ViewportOptions) {
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: opts?.rootMargin,
      threshold: opts?.amount ?? 0.1,
    };

    const once = opts?.once ?? false;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, opts?.rootMargin, opts?.amount, opts?.once]);

  return inView;
}

function useMotionStyles(
  { initial, animate, whileInView, viewport, transition }: MotionCommonProps,
  nodeRef: React.RefObject<HTMLElement>,
) {
  // Evita que o conteúdo apareça invisível antes da hidratação
  const [mounted, setMounted] = React.useState(false);
  const inView = useInView(nodeRef, viewport);
  const [active, setActive] = React.useState<MotionStyle | undefined>(undefined);

  const mergedAnimate = React.useMemo(() => mergeStyles(initial, animate), [initial, animate]);
  const mergedWhileInView = React.useMemo(
    () => mergeStyles(initial, whileInView),
    [initial, whileInView],
  );

  // Detecta preferência do usuário por reduzir animações
  const prefersReduce = React.useMemo(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return false;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Animações de entrada (animate)
  React.useEffect(() => {
    if (!mounted) return;
    if (whileInView) return; // tratado no efeito abaixo
    if (!mergedAnimate) return;

    // Se o usuário prefere reduzir, aplica o estado final imediatamente
    if (prefersReduce) {
      setActive(mergedAnimate);
      return;
    }

    // Fallback robusto: usa rAF e também um setTimeout para garantir aplicação
    let didApply = false;
    const rafId = requestAnimationFrame(() => {
      didApply = true;
      setActive(mergedAnimate);
    });
    const toId = window.setTimeout(() => {
      if (!didApply) setActive(mergedAnimate);
    }, 250);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(toId);
    };
  }, [mounted, mergedAnimate, prefersReduce, whileInView]);

  // Animações baseadas em visibilidade (whileInView)
  React.useEffect(() => {
    if (!mounted) return;
    if (!whileInView) return;

    if (prefersReduce) {
      // Com redução de movimento, não escondemos o conteúdo: aplicamos estado final quando em view
      if (inView) setActive(mergedWhileInView);
      else if (!(viewport?.once ?? false)) setActive(undefined);
      return;
    }

    if (inView) setActive(mergedWhileInView);
    else if (!(viewport?.once ?? false)) setActive(initial);
  }, [mounted, inView, whileInView, mergedWhileInView, initial, viewport?.once, prefersReduce]);

  const style: React.CSSProperties = React.useMemo(() => {
    const base = applyMotionStyle(active);
    const d = transition?.duration ?? 0.6;
    const delay = transition?.delay ?? 0;
    const easing = transition?.easing ?? "ease";
    return {
      ...base,
      transitionProperty: "opacity, transform",
      transitionDuration: `${d}s`,
      transitionTimingFunction: easing,
      transitionDelay: `${delay}s`,
    };
  }, [active, transition?.duration, transition?.delay, transition?.easing]);

  return style;
}

function createMotionTag(tag: string) {
  type Props = React.HTMLAttributes<HTMLElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & MotionCommonProps;

  const Comp = React.forwardRef<HTMLElement, Props>(function MotionTag(
    { initial, animate, whileInView, viewport, transition, style, ...rest },
    ref,
  ) {
  const innerRef = React.useRef<HTMLElement | null>(null);
    const styleMotion = useMotionStyles(
      { initial, animate, whileInView, viewport, transition },
      innerRef as React.RefObject<HTMLElement>,
    );

    return React.createElement(tag, Object.assign({}, rest, {
      ref: (node: Element | null) => {
        innerRef.current = (node as unknown as HTMLElement) ?? null;
        // best-effort forward
        if (typeof ref === "function") ref(innerRef.current);
        else if (ref && typeof ref === "object") (ref as React.MutableRefObject<HTMLElement | null>).current = innerRef.current;
      },
      style: { ...(styleMotion as React.CSSProperties), ...(style as React.CSSProperties) },
    }));
  });

  return Comp;
}

export const motion = {
  div: createMotionTag("div"),
  nav: createMotionTag("nav"),
  section: createMotionTag("section"),
  main: createMotionTag("main"),
  header: createMotionTag("header"),
  footer: createMotionTag("footer"),
  ul: createMotionTag("ul"),
  li: createMotionTag("li"),
  a: createMotionTag("a"),
  span: createMotionTag("span"),
};
