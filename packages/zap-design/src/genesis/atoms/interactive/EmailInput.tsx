import * as React from 'react';
import { Input, type InputProps } from '../../../genesis/atoms/interactive/inputs';

export type EmailInputProps = Omit<InputProps, 'type' | 'leadingIcon'>;

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
    ({ ...props }, ref) => {
        return (
            <Input
                ref={ref}
                type="email"
                leadingIcon="mail"
                placeholder={props.placeholder || "Enter your email"}
                {...props}
            />
        );
    }
);

EmailInput.displayName = 'EmailInput';
