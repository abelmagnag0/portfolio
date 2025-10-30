"use client";

import * as React from "react";

import { cn } from "./utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="separator-root"
      role="separator"
      aria-orientation={orientation}
      aria-hidden={decorative || undefined}
      data-orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" && "h-px w-full",
        orientation === "vertical" && "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
