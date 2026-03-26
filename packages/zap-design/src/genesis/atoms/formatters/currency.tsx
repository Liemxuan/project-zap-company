import * as React from "react"
import { NumericFormat, NumericFormatProps } from "react-number-format"
import { Input } from '../../../genesis/atoms/interactive/inputs'
import { cn } from '../../../lib/utils'

export interface CurrencyInputProps extends Omit<NumericFormatProps, 'disabled'> {
  disabled?: boolean;
  variant?: "sm" | "md" | "lg";
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <NumericFormat
        thousandSeparator=","
        prefix="$"
        decimalScale={2}
        fixedDecimalScale
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
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
