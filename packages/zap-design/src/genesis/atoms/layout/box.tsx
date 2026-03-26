import React from 'react';

export const Box: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return <div className={`flex ${className}`}>{children}</div>;
};
