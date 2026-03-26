"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from '../../../lib/utils'
import { MinusIcon } from "lucide-react"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-[var(--input-border-radius,6px)] has-aria-invalid:border-error/60 has-aria-invalid:ring-3 has-aria-invalid:ring-error/10 dark:has-aria-invalid:border-error dark:has-aria-invalid:ring-error/20",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex w-[var(--input-height,36px)] h-[var(--input-height,36px)] items-center justify-center border-y-[length:var(--input-border-width,1px)] border-r-[length:var(--input-border-width,1px)] border-[color:var(--input-border-filled,var(--color-outline-variant))] bg-[color:var(--input-bg-filled,transparent)] text-on-surface transition-[color,box-shadow] outline-none font-body text-sm font-normal text-transform-primary",
        "first:rounded-l-[var(--input-border-radius,8px)] first:border-l-[length:var(--input-border-width,1px)] last:rounded-r-[var(--input-border-radius,8px)]",
        "aria-invalid:border-[color:var(--input-error-border,var(--color-error))] aria-invalid:bg-error/5 aria-invalid:text-error dark:aria-invalid:border-error",
        "data-[active=true]:z-10 data-[active=true]:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] data-[active=true]:ring-[length:var(--input-focus-width,2px)] data-[active=true]:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] data-[active=true]:bg-[color:var(--input-bg-filled-focus,transparent)]",
        "data-[active=true]:aria-invalid:border-error/60 data-[active=true]:aria-invalid:ring-error/10 dark:data-[active=true]:aria-invalid:border-error dark:data-[active=true]:aria-invalid:ring-error/20",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
