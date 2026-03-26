import React from 'react';

export interface PropertyBoxProps {
    className?: string;
    children: React.ReactNode;
}

export const PropertyBox: React.FC<PropertyBoxProps> = ({ children, className = '' }) => {
    return (
        <div className={`border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] bg-layer-cover rounded-card shadow-card overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export interface PropertyRowProps {
    label: string | React.ReactNode;
    value: string | React.ReactNode;
    className?: string;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({ label, value, className = '' }) => {
    return (
        <div className={`flex items-center justify-between p-3 border-b-[length:var(--card-border-width,0px)] border-brand-midnight/10 last:border-b-0 text-[10px] tracking-wider uppercase font-black text-brand-midnight ${className}`}>
            <div className="text-theme-base/50 truncate pr-4 shrink-0">{label}</div>
            <div className="truncate text-right">{value}</div>
        </div>
    );
};
