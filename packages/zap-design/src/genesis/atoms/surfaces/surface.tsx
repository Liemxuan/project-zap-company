import React from 'react';

export const Surface: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <div className={`border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] p-4 transition-all ${className}`}>
            {children}
        </div>
    );
};
