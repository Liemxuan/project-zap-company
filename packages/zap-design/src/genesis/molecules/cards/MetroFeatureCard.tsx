import * as React from "react";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from '../../../lib/utils';

export interface MetroFeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tag?: string;
  colorScheme?: "primary" | "secondary" | "tertiary" | "error" | "surface";
  className?: string;
}

export function MetroFeatureCard({
  title,
  description,
  href,
  icon: Icon,
  tag,
  colorScheme = "secondary",
  className,
}: MetroFeatureCardProps) {
  const schemeTokens = {
    primary: {
      bg: "bg-[var(--md-sys-color-primary-container)]",
      fg: "text-[var(--md-sys-color-on-primary-container)]",
    },
    secondary: {
      bg: "bg-[var(--md-sys-color-secondary-container)]",
      fg: "text-[var(--md-sys-color-on-secondary-container)]",
    },
    tertiary: {
      bg: "bg-[var(--md-sys-color-tertiary-container)]",
      fg: "text-[var(--md-sys-color-on-tertiary-container)]",
    },
    error: {
      bg: "bg-[var(--md-sys-color-error-container)]",
      fg: "text-[var(--md-sys-color-on-error-container)]",
    },
    surface: {
      bg: "bg-[var(--md-sys-color-surface-variant)]",
      fg: "text-[var(--md-sys-color-on-surface-variant)]",
    },
  };

  const tokens = schemeTokens[colorScheme];

  return (
    <Link
      href={href}
      className={cn(
        "group rounded-[24px] p-6 border-[1px] transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col h-full",
        "bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]",
        className
      )}
    >
      <div
        className={cn("w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 shrink-0", tokens.bg, tokens.fg)}
      >
        <Icon size={24} />
      </div>

      <h2 className="text-[20px] font-bold mb-2 font-display text-transform-primary tracking-tight text-[var(--md-sys-color-on-surface)]">
        {title}
      </h2>
      <p className="text-[14px] opacity-70 mb-6 line-clamp-2 text-[var(--md-sys-color-on-surface-variant)]">
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        {tag && (
          <span
            className="text-[10px] text-transform-tertiary font-bold tracking-widest text-[var(--md-sys-color-primary)]"
          >
            {tag}
          </span>
        )}
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1 ml-auto text-[var(--md-sys-color-primary)]"
        />
      </div>
    </Link>
  );
}
