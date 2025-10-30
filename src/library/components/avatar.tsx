"use client";

import Image from "next/image";
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

type AvatarImageProps = {
  src: string;
  alt?: string;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
};
function AvatarImage({ className, onError, onLoad, alt = "", src }: AvatarImageProps) {
  const { setLoaded, setError, error } = useAvatarCtx();
  return (
    <>
      {!error && (
        <Image
          data-slot="avatar-image"
          alt={alt}
          src={src}
          fill
          sizes="40px"
          className={cn("object-cover", className)}
          onLoad={() => {
            setLoaded(true);
            onLoad?.();
          }}
          onError={() => {
            setError(true);
            onError?.();
          }}
          unoptimized
        />
      )}
    </>
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

