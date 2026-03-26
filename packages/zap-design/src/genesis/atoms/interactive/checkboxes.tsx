import React from 'react';
import { Checkbox as BaseCheckbox } from '../../../genesis/atoms/interactive/checkbox';

export const Checkbox: React.FC<React.ComponentProps<typeof BaseCheckbox>> = (props) => {
    return (
        <BaseCheckbox
            {...props}
        />
    );
};
