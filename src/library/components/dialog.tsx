"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "./utils";

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function useDialogCtx() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
}

function Dialog({ open: openProp, defaultOpen, onOpenChange, children }: DialogProps) {
  const [open, setOpen] = React.useState<boolean>(!!defaultOpen);
  const isControlled = typeof openProp === "boolean";
  const mergedOpen = isControlled ? !!openProp : open;
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const setOpenMerged = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  // Close on ESC
  React.useEffect(() => {
    if (!mergedOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMerged(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mergedOpen, setOpenMerged]);

  // Lock scroll when open
  React.useEffect(() => {
    if (!mergedOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mergedOpen]);

  const value = React.useMemo<DialogContextValue>(
    () => ({ open: mergedOpen, setOpen: setOpenMerged, triggerRef }),
    [mergedOpen, setOpenMerged]
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: React.ReactNode;
};

function DialogTrigger({ asChild, children, onClick, ...rest }: DialogTriggerProps) {
  const { setOpen, triggerRef } = useDialogCtx();

  const handleClick = (e: React.MouseEvent) => {
    // guarda quem disparou para restaurar foco ao fechar
    triggerRef.current = e.currentTarget as HTMLElement;
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
    setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.cloneElement(child as any, {
      onClick: (e: React.MouseEvent) => {
        // @ts-expect-error: tipo do onClick do filho é dinâmico
        child.props?.onClick?.(e);
        handleClick(e);
      },
      "data-slot": "dialog-trigger",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}

type DialogPortalProps = { children?: React.ReactNode };
function DialogPortal({ children }: DialogPortalProps) {
  const { open } = useDialogCtx();
  if (!open) return null;
  if (typeof document === "undefined") return null;
  return createPortal(<div data-slot="dialog-portal">{children}</div>, document.body);
}

type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };
function DialogClose({ asChild, children, onClick, ...rest }: DialogCloseProps) {
  const { setOpen } = useDialogCtx();
  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
    setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.cloneElement(child as any, {
      onClick: (e: React.MouseEvent) => {
        // @ts-expect-error: tipo do onClick do filho é dinâmico
        child.props?.onClick?.(e);
        handleClick(e);
      },
      "data-slot": "dialog-close",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }
  return (
    <button type="button" data-slot="dialog-close" onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}

type DialogOverlayProps = React.HTMLAttributes<HTMLDivElement>;
function DialogOverlay({ className, onMouseDown, ...rest }: DialogOverlayProps) {
  const { setOpen } = useDialogCtx();
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) setOpen(false);
    onMouseDown?.(e);
  };
  return (
    <div
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        className
      )}
      onMouseDown={handleMouseDown}
      {...rest}
    />
  );
}

type DialogContentProps = React.HTMLAttributes<HTMLDivElement>;
function DialogContent({ className, children, ...rest }: DialogContentProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  // Restore focus to trigger on unmount
  const { triggerRef } = useDialogCtx();
  React.useEffect(() => {
    const el = contentRef.current;
    // set initial focus if none
    el?.focus();
    const toFocus = triggerRef.current;
    return () => {
      toFocus?.focus?.();
    };
  }, [triggerRef]);

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        role="dialog"
        aria-modal="true"
        data-slot="dialog-content"
        className={cn(
          "bg-background fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        ref={contentRef}
        tabIndex={-1}
        {...rest}
      >
        {children}
        <DialogClose className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <span aria-hidden>×</span>
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
};

