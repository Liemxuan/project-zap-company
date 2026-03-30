import React from 'react';
import { cn } from '../../../lib/utils';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../../genesis/molecules/accordion';

export interface InspectorAccordionProps {
    title: string;
    icon?: string | React.ElementType;  // Google Material Icon name or React Component (e.g. Lucide)
    defaultOpen?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const InspectorAccordion: React.FC<InspectorAccordionProps> = ({
    title,
    icon,
    defaultOpen = false,
    children,
    className
}) => {
    // We use defaultValue for uncontrolled state with Accordion
    const defaultValue = defaultOpen ? "item" : undefined;

    return (
        <Accordion 
            type="single" 
            collapsible 
            defaultValue={defaultValue}
            variant="navigation" 
            className={cn("bg-transparent w-full space-y-2", className)}
        >
            <AccordionItem value="item" className="border-none m-0">
                <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-[11px] uppercase tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                    <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                        {icon && (
                            typeof icon === 'string' ? (
                                <Icon name={icon as never} size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                            ) : (
                                React.createElement(icon, { size: 16, className: "shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" })
                            )
                        )}
                        <span className="truncate">
                            {title}
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
                    {children}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
