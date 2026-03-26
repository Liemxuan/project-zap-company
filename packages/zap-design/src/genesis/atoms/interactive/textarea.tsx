import * as React from "react"

import { cn } from '../../../lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[var(--input-height,64px)] w-full rounded-[length:var(--input-border-radius,8px)] border-[length:var(--input-border-width,1px)] border-outline-variant bg-transparent px-2.5 py-2 text-sm font-body text-transform-primary text-on-surface transition-[color,box-shadow] outline-none placeholder:text-on-surface-variant/80 placeholder:text-transform-secondary focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-[length:var(--input-focus-width,2px)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--input-error-border,var(--color-error))] aria-invalid:ring-[length:var(--input-error-width,2px)] aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] dark:aria-invalid:border-[color:var(--input-error-border,var(--color-error))] dark:aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
