import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`font-black uppercase tracking-tighter ${className}`}>
            ZAP
        </div>
    );
};
