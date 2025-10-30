import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Award(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="M8 14l-2 7 6-3 6 3-2-7" />
    </IconBase>
  );
}

export function Code2(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 18l-6-6 6-6" />
      <path d="M15 6l6 6-6 6" />
    </IconBase>
  );
}

export function Users(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="3" />
      <path d="M2 21c0-3.5 4-5 7-5" />
      <path d="M14 21c0-2.5 3-4 6-4" />
    </IconBase>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </IconBase>
  );
}

export function Calendar(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </IconBase>
  );
}

export function Github(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 19c-4.3 1.6-4.3-2.1-6-2m12 4v-3.5a3 3 0 00-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 00-1.2-3.2 4.3 4.3 0 00-.1-3.2s-1-.3-3.3 1.2a11.6 11.6 0 00-6 0C6.8.2 5.8.5 5.8.5a4.3 4.3 0 00-.1 3.2A4.6 4.6 0 004.5 7c0 4.7 2.8 5.7 5.5 6a3 3 0 00-.8 2.3V21" />
    </IconBase>
  );
}

export function Linkedin(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 11v6M8 7h.01M12 17v-3a2 2 0 114 0v3" />
    </IconBase>
  );
}

export function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </IconBase>
  );
}

export function Phone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 16.92V21a2 2 0 01-2.18 2A19.8 19.8 0 013 5.18 2 2 0 015 3h4.09a2 2 0 012 1.72c.12.86.32 1.7.6 2.5a2 2 0 01-.45 2.11L10 10a16 16 0 006 6l.67-1.24a2 2 0 012.11-.45c.8.28 1.64.48 2.5.6A2 2 0 0122 16.92z" />
    </IconBase>
  );
}

export function Heart(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 000-7.8z" />
    </IconBase>
  );
}

export function Download(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 21h14" />
    </IconBase>
  );
}

export function Moon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" />
    </IconBase>
  );
}

export function Sun(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </IconBase>
  );
}

export function Globe(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
    </IconBase>
  );
}

export function Lock(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 118 0v4" />
    </IconBase>
  );
}

export function Cloud(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M17.5 19a4.5 4.5 0 000-9 6 6 0 00-11.7 1.5A4 4 0 006 19h11.5z" />
    </IconBase>
  );
}

export function Database(props: IconProps) {
  return (
    <IconBase {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </IconBase>
  );
}

export function Server(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M7 7h.01M7 17h.01" />
    </IconBase>
  );
}

export function Quote(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 7h4v6H5V9a2 2 0 012-2zm10 0h4v6h-6V9a2 2 0 012-2z" />
    </IconBase>
  );
}
