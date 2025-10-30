"use client";

import * as React from "react";

// Slot interno simples que injeta props no filho e mescla className/ref
type SlotProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, className, ...props },
  forwardedRef
) {
  if (React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = (child.props ?? {}) as { className?: string } & Record<string, unknown>;
    const prevClass = childProps.className ?? "";
    const mergedClass = [prevClass, className].filter(Boolean).join(" ");

    const ref = (node: HTMLElement | null) => {
      const r = (child as unknown as { ref?: unknown }).ref;
      if (typeof r === "function") (r as (instance: HTMLElement | null) => void)(node);
      else if (r && typeof r === "object" && "current" in r) (r as { current: HTMLElement | null }).current = node;

      if (typeof forwardedRef === "function") (forwardedRef as (instance: HTMLElement | null) => void)(node);
      else if (forwardedRef && typeof forwardedRef === "object") (forwardedRef as { current: HTMLElement | null }).current = node;
    };

    return React.cloneElement(child, { ...props, className: mergedClass, ref });
  }
  // Se não for elemento válido, apenas renderiza dentro de um span
  return (
    <span ref={forwardedRef as React.MutableRefObject<HTMLElement | null>} className={className} {...props}>
      {children}
    </span>
  );
});
