import * as React from "react"

import { cn } from '../../../lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[var(--textarea-height,64px)] w-full rounded-[length:var(--textarea-border-radius,8px)] border-[length:var(--textarea-border-width,1px)] border-outline-variant bg-[color:var(--textarea-bg,var(--color-surface-container-highest))] px-2.5 py-2 text-[length:var(--textarea-text-size,var(--text-sm))] font-[family:var(--textarea-font,var(--font-body))] text-on-surface transition-[color,box-shadow] outline-none placeholder:text-on-surface-variant/80 placeholder:text-transform-secondary focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-[length:var(--input-focus-width,2px)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--input-error-border,var(--color-error))] aria-invalid:ring-[length:var(--input-error-width,2px)] aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] dark:bg-[color:var(--textarea-bg,var(--color-surface-container-highest))] dark:text-on-surface dark:aria-invalid:border-[color:var(--input-error-border,var(--color-error))] dark:aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] border-[length:var(--input-border-width,1px)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
