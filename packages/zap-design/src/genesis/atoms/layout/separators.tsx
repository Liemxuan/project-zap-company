import React from 'react';

export const Separator: React.FC<{ className?: string }> = ({ className }) => {
    return <div className={`border-t-[length:var(--card-border-width,2px)] border-card-border-[length:var(--card-border-width,0px)] w-full my-2 ${className}`} />;
};
