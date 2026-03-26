import React from 'react';
import { RadioGroup as BaseRadioGroup, RadioGroupItem as BaseRadioGroupItem } from '../../../genesis/atoms/interactive/radio-group';

export const RadioGroup: React.FC<React.ComponentProps<typeof BaseRadioGroup>> = (props) => {
    return (
        <BaseRadioGroup
            {...props}
        />
    );
};

export const Radio: React.FC<React.ComponentProps<typeof BaseRadioGroupItem>> = (props) => {
    return (
        <BaseRadioGroupItem
            {...props}
        />
    );
};
