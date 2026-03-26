import * as React from "react"
import { PatternFormat, PatternFormatProps } from "react-number-format"
import { Input } from '../../../genesis/atoms/interactive/inputs'
import { cn } from '../../../lib/utils'

export interface PhoneNumberInputProps extends Omit<PatternFormatProps, 'disabled' | 'format'> {
  disabled?: boolean;
  variant?: "sm" | "md" | "lg";
  format?: string;
}

const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  ({ className, variant, format = "(###) ###-####", ...props }, ref) => {
    return (
      <PatternFormat
        format={format}
        mask="_"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        customInput={Input as any}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Variant matches Input props
        variant={variant}
        className={cn(className)}
        getInputRef={ref}
        {...props}
      />
    )
  }
)
PhoneNumberInput.displayName = "PhoneNumberInput"

export { PhoneNumberInput }
