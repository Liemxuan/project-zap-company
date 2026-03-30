import React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from '../atoms/interactive/badge';

export interface DataReadoutItem {
    id: string;
    label: string;
    value?: React.ReactNode;
    type?: 'default' | 'badge' | 'code' | 'text' | 'tags';
    badgeVariant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
    tags?: string[];
    tagColor?: 'primary' | 'secondary';
}

export interface DataReadoutProps {
    title?: string;
    items: DataReadoutItem[];
    className?: string;
}

export const DataReadout: React.FC<DataReadoutProps> = ({ items, className }) => {
    return (
        <div className={cn("flex flex-col gap-4", className)}>
            
            <div className="flex flex-col gap-5">
                {items.map(item => (
                    <div key={item.id} className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold tracking-widest lowercase text-on-surface-variant leading-none">
                            {item.label}
                        </span>
                        
                        {item.type === 'badge' ? (
                            <div className="flex">
                                <Badge 
                                    variant={item.badgeVariant || 'secondary'} 
                                    className={cn(
                                        "shadow-none rounded-md px-2.5 py-0.5",
                                        item.badgeVariant === 'success' && "bg-success/10 text-success border border-success/20 hover:bg-success/20"
                                    )}
                                >
                                    {item.value}
                                </Badge>
                            </div>
                        ) : item.type === 'tags' && item.tags ? (
                            <div className="flex flex-wrap gap-1.5 w-full">
                                {item.tags.map(t => (
                                    <span key={t} className={cn(
                                        "px-2 py-1 rounded-[4px] text-[10px] font-dev text-transform-tertiary border",
                                        item.tagColor === 'secondary' 
                                            ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                                            : "bg-primary-container text-on-primary-container border-primary/20"
                                    )}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        ) : item.type === 'code' ? (
                            <div className="bg-[color:var(--select-bg,var(--color-surface-container-highest))] border border-[length:var(--select-border-width,var(--layer-border-width,1px))] border-outline-variant rounded-[length:var(--select-border-radius,var(--radius-shape-small,8px))] p-2.5 font-mono text-[11px] text-on-surface w-full overflow-x-auto whitespace-nowrap shadow-sm">
                                {item.value}
                            </div>
                        ) : (
                            <span className="text-[13px] font-medium text-on-surface whitespace-pre-wrap leading-tight">
                                {item.value}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
