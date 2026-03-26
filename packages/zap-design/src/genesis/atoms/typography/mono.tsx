import React from 'react';

export const Mono: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return <code className={`font-mono text-transform-tertiary bg-layer-panel text-brand-midnight px-1 rounded-btn ${className}`}>{children}</code>;
};
