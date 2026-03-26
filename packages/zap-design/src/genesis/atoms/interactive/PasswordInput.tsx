import * as React from 'react';
import { Input, type InputProps } from '../../../genesis/atoms/interactive/inputs';

export type PasswordInputProps = Omit<InputProps, 'type' | 'trailingIcon'>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ ...props }, ref) => {
        return (
            <Input
                ref={ref}
                type="password"
                leadingIcon="lock"
                placeholder={props.placeholder || "Enter your password"}
                {...props}
            />
        );
    }
);

PasswordInput.displayName = 'PasswordInput';
