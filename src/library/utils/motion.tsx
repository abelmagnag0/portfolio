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
  const mountedRef = React.useRef(false);
  const inView = useInView(nodeRef, viewport);
  const [active, setActive] = React.useState<MotionStyle | undefined>(initial);

  const mergedAnimate = React.useMemo(() => mergeStyles(initial, animate), [initial, animate]);
  const mergedWhileInView = React.useMemo(
    () => mergeStyles(initial, whileInView),
    [initial, whileInView],
  );

  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (mergedAnimate && !whileInView) {
        const id = requestAnimationFrame(() => setActive(mergedAnimate));
        return () => cancelAnimationFrame(id);
      }
    }
  }, [mergedAnimate, whileInView]);

  React.useEffect(() => {
    if (!whileInView) return;
    if (inView) setActive(mergedWhileInView);
    else if (!(viewport?.once ?? false)) setActive(initial);
  }, [inView, whileInView, mergedWhileInView, initial, viewport?.once]);

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
