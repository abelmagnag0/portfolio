"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "./utils";

type TooltipContextValue = {
  open: boolean;
  setOpen: (o: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  delay: number;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltipCtx() {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip components must be used within <Tooltip>");
  return ctx;
}

type TooltipProviderProps = { children?: React.ReactNode; delayDuration?: number };
function TooltipProvider({ delayDuration = 0, children }: TooltipProviderProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const value = React.useMemo(
    () => ({ open, setOpen, triggerRef, delay: delayDuration }),
    [open, delayDuration]
  );
  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

type TooltipProps = { children?: React.ReactNode };
function Tooltip({ children }: TooltipProps) {
  return <TooltipProvider>{children}</TooltipProvider>;
}

type TooltipTriggerProps = React.HTMLAttributes<HTMLElement> & { asChild?: boolean; children: React.ReactNode };
function TooltipTrigger({ asChild, children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...rest }: TooltipTriggerProps) {
  const { setOpen, triggerRef, delay } = useTooltipCtx();
  const timerRef = React.useRef<number | null>(null);

  const openWithDelay = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  };
  const closeNow = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setOpen(false);
  };

  type CombinedProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  const bindHandlers = (props: CombinedProps = {} as CombinedProps) => ({
    onMouseEnter: (e: React.MouseEvent) => {
      props.onMouseEnter?.(e as React.MouseEvent<HTMLElement>);
      openWithDelay();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      props.onMouseLeave?.(e as React.MouseEvent<HTMLElement>);
      closeNow();
    },
    onFocus: (e: React.FocusEvent) => {
      props.onFocus?.(e as React.FocusEvent<HTMLElement>);
      openWithDelay();
    },
    onBlur: (e: React.FocusEvent) => {
      props.onBlur?.(e as React.FocusEvent<HTMLElement>);
      closeNow();
    },
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      if (typeof props.ref === "function") props.ref(node);
      else if (props.ref && typeof props.ref === "object") (props.ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    "data-slot": "tooltip-trigger",
  });

  if (asChild && React.isValidElement(children)) {
    const childEl = children as React.ReactElement;
    const injected = bindHandlers(childEl.props as CombinedProps) as unknown as Record<string, unknown>;
    return React.cloneElement(childEl, injected);
  }

  return (
    <span {...bindHandlers({ onMouseEnter, onMouseLeave, onFocus, onBlur })} {...rest}>
      {children}
    </span>
  );
}

type TooltipContentProps = React.HTMLAttributes<HTMLDivElement> & {
  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
};
function TooltipContent({ className, children, sideOffset = 0, side = "top", align = "center", style, ...rest }: TooltipContentProps) {
  const { open, triggerRef } = useTooltipCtx();
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const { scrollX, scrollY } = window;
    let top = rect.top + scrollY;
    let left = rect.left + scrollX;
    if (side === "top") top = rect.top + scrollY - sideOffset;
    if (side === "bottom") top = rect.bottom + scrollY + sideOffset;
    if (side === "left") left = rect.left + scrollX - sideOffset;
    if (side === "right") left = rect.right + scrollX + sideOffset;

    // Center horizontally/vertically when applicable
    if (side === "top" || side === "bottom") {
      if (align === "center") left = rect.left + scrollX + rect.width / 2;
      if (align === "start") left = rect.left + scrollX;
      if (align === "end") left = rect.right + scrollX;
    }
    if (side === "left" || side === "right") {
      if (align === "center") top = rect.top + scrollY + rect.height / 2;
      if (align === "start") top = rect.top + scrollY;
      if (align === "end") top = rect.bottom + scrollY;
    }
    setPos({ top, left });
  }, [open, triggerRef, side, sideOffset, align]);

  if (!open || !pos) return null;

  return (
    // Portal simples usando body
    (typeof document !== "undefined") ? (
      createPortal(
        <div
          data-slot="tooltip-content"
          data-side={side}
          data-align={align}
          className={cn(
            "bg-primary text-primary-foreground z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
            className
          )}
          style={{ position: "absolute", top: pos.top, left: pos.left, transform: (side === "top" || side === "bottom") ? (align === "center" ? "translate(-50%, -100%)" : align === "end" ? "translate(-100%, -100%)" : "translate(0, -100%)") : (align === "center" ? "translate(0, -50%)" : align === "end" ? "translate(0, -100%)" : "translate(0, 0)"), ...style }}
          role="tooltip"
          {...rest}
        >
          {children}
        </div>,
        document.body
      )
    ) : null
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

