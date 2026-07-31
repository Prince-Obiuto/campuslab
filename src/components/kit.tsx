import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "dark";
type BtnSize = "sm" | "md" | "lg";

const variants: Record<BtnVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-secondary",
  secondary: "border border-border bg-surface text-foreground hover:bg-muted",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
  danger: "bg-destructive text-primary-foreground hover:brightness-95",
  dark: "bg-foreground text-primary-foreground hover:opacity-90",
};

const sizes: Record<BtnSize, string> = {
  sm: "h-9 px-4 text-caption",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-[17px]",
};

export function btnClass(variant: BtnVariant = "primary", size: BtnSize = "md", extra?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variants[variant],
    sizes[size],
    extra,
  );
}

export function Btn({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: BtnVariant; size?: BtnSize }) {
  return <button className={btnClass(variant, size, className)} {...props} />;
}

export function BtnLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: BtnVariant; size?: BtnSize }) {
  return <Link className={btnClass(variant, size, className)} {...props} />;
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-border bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Tag({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "primary" | "success" | "warning" | "error";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/12 text-[color:var(--success)]",
    warning: "bg-warning/15 text-[color:var(--warning)]",
    error: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "success" }: { tone?: "success" | "warning" | "error" | "muted" }) {
  const map = {
    success: "bg-[color:var(--success)]",
    warning: "bg-[color:var(--warning)]",
    error: "bg-destructive",
    muted: "bg-muted-foreground",
  } as const;
  return <span className={cn("size-2 rounded-full", map[tone])} />;
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-caption font-semibold text-primary",
        className,
      )}
    >
      {letters}
    </span>
  );
}

export function Meter({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("block h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <span
        className="block h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </span>
  );
}
