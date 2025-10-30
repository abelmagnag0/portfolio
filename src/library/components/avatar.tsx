"use client";

import * as React from "react";
import { cn } from "./utils";

type AvatarCtx = {
  loaded: boolean;
  error: boolean;
  setLoaded: (v: boolean) => void;
  setError: (v: boolean) => void;
};

const AvatarContext = React.createContext<AvatarCtx | null>(null);

function useAvatarCtx() {
  const ctx = React.useContext(AvatarContext);
  if (!ctx) throw new Error("Avatar components must be used within <Avatar>");
  return ctx;
}

function Avatar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <AvatarContext.Provider value={{ loaded, error, setLoaded, setError }}>
      <div
        data-slot="avatar"
        className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  );
}

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
function AvatarImage({ className, onError, onLoad, alt = "", ...props }: AvatarImageProps) {
  const { setLoaded, setError, error } = useAvatarCtx();
  return (
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className, error && "hidden")}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setError(true);
        onError?.(e);
      }}
      alt={alt}
      {...props}
    />
  );
}

type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;
function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  const { loaded, error } = useAvatarCtx();
  const show = !loaded || error;
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        !show && "hidden",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };

