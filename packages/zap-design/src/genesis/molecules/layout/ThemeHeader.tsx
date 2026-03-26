'use client';

import React from 'react';
import { useTheme } from '../../../components/ThemeContext';
import { ExperimentalHeader, type ExperimentalHeaderProps } from '../../../genesis/molecules/layout/ExperimentalHeader';
import { MetroHeader, type MetroHeaderProps } from '../../../genesis/molecules/layout/MetroHeader';

export type ThemeHeaderProps = ExperimentalHeaderProps & MetroHeaderProps;

export const ThemeHeader = (props: ThemeHeaderProps) => {
    const { theme } = useTheme();

    // If active theme uses Metro engine/styling, render the M3-specific Header primitive.
    if (theme === 'metro') {
        return <MetroHeader {...props} />;
    }

    // Default to the Shadcn-based Core Experimental Header
    return <ExperimentalHeader {...props} />;
};
