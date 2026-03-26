import * as React from "react"
import { PatternFormat, PatternFormatProps } from "react-number-format"
import { Input } from '../../../genesis/atoms/interactive/inputs'
import { cn } from '../../../lib/utils'

export type CreditCardInputProps = Omit<PatternFormatProps, 'customInput' | 'format'>

const CreditCardInput = React.forwardRef<HTMLInputElement, CreditCardInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <PatternFormat
        format="#### #### #### ####"
        mask="_"
        customInput={Input}
        getInputRef={ref}
        className={cn("tabular-nums", className)}
        {...props}
      />
    )
  }
)
CreditCardInput.displayName = "CreditCardInput"

export { CreditCardInput }
