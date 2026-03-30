import { cn } from '../../lib/utils';
import { badgeVariants } from '../atoms/interactive/badge';
import { Icon } from '../atoms/icons/Icon';

export interface FilterOption {
    id: string;
    label: string;
    selected?: boolean;
}

export interface FilterGroup {
    id: string;
    title: string;
    options: FilterOption[];
}

export interface DataFilterProps {
    title?: string;
    groups: FilterGroup[];
    className?: string;
    onToggle?: (groupId: string, optionId: string) => void;
}

/**
 * DataFilter
 * A specialized strict-style filtering block, adhering to the "Data Terminal" aesthetic.
 * Best used in Inspector accordions or heavy data-grid sidebars.
 */
export function DataFilter({
    groups,
    className,
    onToggle,
}: DataFilterProps) {
    return (
        <div className={cn('flex flex-col gap-6 w-full', className)}>
            
            <div className="flex flex-col gap-5">
                {groups.map((group) => (
                    <div key={group.id} className="flex flex-col gap-1.5">
                        {/* Group Header */}
                        <div className="text-[11px] font-bold tracking-widest text-on-surface-variant lowercase leading-none">
                            {group.title}
                        </div>
                        
                        {/* Options Pills */}
                        <div className="flex flex-wrap gap-2">
                            {group.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => onToggle?.(group.id, option.id)}
                                    className={cn(
                                        badgeVariants({ variant: option.selected ? 'primary' : 'outline' }),
                                        'shadow-none rounded-md px-2.5 py-0.5 transition-colors cursor-pointer',
                                        option.selected && 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                                    )}
                                >
                                    <span>{option.label}</span>
                                    {option.selected && (
                                        <Icon name="check" size={14} className="ml-1 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
