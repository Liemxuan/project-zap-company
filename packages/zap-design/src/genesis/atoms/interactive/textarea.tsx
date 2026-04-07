import * as React from "react"
import { cn } from '../../../lib/utils'

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  position?: 'top' | 'floating' | 'left' | 'right';
  isError?: boolean;
  errorMessage?: string;
}

function Textarea({ className, label, position, isError, errorMessage, disabled, ...props }: TextareaProps) {
  const isFloating = position === 'floating';

  const textareaEl = (
    <textarea
      data-slot="textarea"
      disabled={disabled}
      aria-invalid={isError}
      className={cn(
        "flex field-sizing-content w-full rounded-[length:var(--textarea-border-radius,8px)] border-[length:var(--textarea-border-width,1px)] border-outline-variant bg-[color:var(--textarea-bg,var(--color-surface-container-highest))] px-2.5 text-[length:var(--textarea-text-size,var(--text-sm))] font-[family:var(--textarea-font,var(--font-body))] text-on-surface transition-[color,box-shadow] outline-none placeholder:text-on-surface-variant/80 placeholder:text-transform-secondary focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-[length:var(--input-focus-width,2px)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--input-error-border,var(--color-error))] aria-invalid:ring-[length:var(--input-error-width,2px)] aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] dark:bg-[color:var(--textarea-bg,var(--color-surface-container-highest))] dark:text-on-surface dark:aria-invalid:border-[color:var(--input-error-border,var(--color-error))] dark:aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] border-[length:var(--input-border-width,1px)]",
        isFloating && label
          ? "min-h-[var(--textarea-height,80px)] pt-6 pb-2 placeholder-transparent peer"
          : "min-h-[var(--textarea-height,64px)] py-2",
        className
      )}
      placeholder={isFloating && label ? " " : props.placeholder}
      {...props}
    />
  );

  const errorEl = errorMessage ? (
    <p className="text-xs text-error font-medium px-1 mt-1.5 flex items-center gap-1">
      <span className="material-symbols-rounded text-sm leading-none">error</span>
      {errorMessage}
    </p>
  ) : null;

  const labelEl = label && !isFloating ? (
    <label className={cn(
      "font-display text-sm font-medium text-foreground shrink-0",
      disabled && "opacity-50"
    )}>
      {label}
    </label>
  ) : null;

  if (isFloating && label) {
    return (
      <div className={cn("relative flex flex-col w-full", className?.includes("w-") ? "" : "w-full")}>
        {textareaEl}
        <label className={cn(
          "absolute left-2.5 pointer-events-none select-none transition-all duration-200",
          // Floated state (has value)
          "top-1.5 text-[10px] font-semibold tracking-wide",
          isError ? "text-error" : "text-muted-foreground peer-focus:text-primary",
          // Resting state (placeholder shown = no value, no focus)
          "peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal",
          // Focus overrides resting
          "peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-wide",
          disabled && "opacity-50"
        )}>
          {label}
        </label>
        {errorEl}
      </div>
    );
  }

  if (position === 'top') {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {labelEl}
        {textareaEl}
        {errorEl}
      </div>
    );
  }

  if (position === 'left') {
    return (
      <div className="flex items-start gap-3 w-full">
        <div className="pt-2 shrink-0">{labelEl}</div>
        <div className="flex flex-col flex-1 min-w-0">
          {textareaEl}
          {errorEl}
        </div>
      </div>
    );
  }

  if (position === 'right') {
    return (
      <div className="flex items-start gap-3 w-full">
        <div className="flex flex-col flex-1 min-w-0">
          {textareaEl}
          {errorEl}
        </div>
        <div className="pt-2 shrink-0">{labelEl}</div>
      </div>
    );
  }

  // no position
  if (errorEl) {
    return (
      <div className="flex flex-col w-full">
        {textareaEl}
        {errorEl}
      </div>
    );
  }

  return textareaEl;
}

export { Textarea }
