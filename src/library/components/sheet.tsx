"use client";

import * as React from "react";

import {
  DialogClose as SheetPrimitiveClose,
  DialogContent as SheetPrimitiveContent,
  DialogOverlay as SheetPrimitiveOverlay,
  DialogPortal as SheetPrimitivePortal,
  Dialog as SheetPrimitiveRoot,
  DialogTrigger as SheetPrimitiveTrigger,
} from "./dialog";
import { cn } from "./utils";

type SheetRootProps = React.ComponentProps<typeof SheetPrimitiveRoot>;
function Sheet({ ...props }: SheetRootProps) {
  return <SheetPrimitiveRoot data-slot="sheet" {...props} />;
}

type SheetTriggerProps = React.ComponentProps<typeof SheetPrimitiveTrigger>;
function SheetTrigger({ ...props }: SheetTriggerProps) {
  return <SheetPrimitiveTrigger data-slot="sheet-trigger" {...props} />;
}

type SheetCloseProps = React.ComponentProps<typeof SheetPrimitiveClose>;
function SheetClose({ ...props }: SheetCloseProps) {
  return <SheetPrimitiveClose data-slot="sheet-close" {...props} />;
}

type SheetPortalProps = React.ComponentProps<typeof SheetPrimitivePortal>;
function SheetPortal({ ...props }: SheetPortalProps) {
  return <SheetPrimitivePortal data-slot="sheet-portal" {...props} />;
}

type SheetOverlayProps = React.ComponentProps<typeof SheetPrimitiveOverlay>;
function SheetOverlay({ className, ...props }: SheetOverlayProps) {
  return (
    <SheetPrimitiveOverlay
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitiveContent> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitiveContent
        data-slot="sheet-content"
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition-transform ease-in-out duration-300",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm translate-x-0",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm translate-x-0",
          side === "top" &&
            "inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto border-t",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitiveClose className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <span aria-hidden>×</span>
          <span className="sr-only">Close</span>
        </SheetPrimitiveClose>
      </SheetPrimitiveContent>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet, SheetClose,
  SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger
};

