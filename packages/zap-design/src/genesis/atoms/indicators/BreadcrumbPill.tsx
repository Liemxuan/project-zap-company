import React from 'react';
import { Wrapper } from '../../../components/dev/Wrapper';

interface BreadcrumbPillProps {
    label: string;
}

export const BreadcrumbPill = ({ label }: BreadcrumbPillProps) => {
    return (
        <Wrapper identity={{ displayName: "Breadcrumb Pill", filePath: "genesis/atoms/indicators/BreadcrumbPill.tsx", type: "Atom", architecture: "L3: Elements" }}>
            <div className="bg-primary-container text-on-primary-container px-2 py-0.5 md:px-2.5 md:py-1 text-transform-secondary font-secondary font-bold tracking-widest text-[8px] md:text-[10px] rounded-full mb-1 inline-flex items-center justify-center">
                {label}
            </div>
        </Wrapper>
    );
};
