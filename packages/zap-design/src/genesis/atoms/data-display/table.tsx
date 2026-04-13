'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, style, ...props }, ref) => (
        <div data-slot="table-wrapper" className="relative w-full overflow-auto">
            <table
                ref={ref}
                data-slot="table"
                className={cn('w-full caption-bottom text-on-surface text-[11px] font-medium text-transform-none', className)}
                style={Object.assign({}, {
                    fontSize: 'var(--table-font-size, 11px)',
                    lineHeight: 'var(--table-line-height, 1.45)',
                    letterSpacing: 'var(--table-letter-spacing, 0.5px)',
                    fontWeight: 'var(--table-font-weight, 500)',
                    textTransform: 'var(--table-text-casing, none)' as React.CSSProperties['textTransform'],
                }, style)}
                {...props}
            />
        </div>
    )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} data-slot="table-header" className={cn('[&_tr]:border-b [&_tr]:border-outline-variant', className)} {...props} />
    )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody ref={ref} data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />
    )
);
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tfoot
            ref={ref}
            data-slot="table-footer"
            className={cn('border-t border-outline-variant bg-surface-variant font-medium last:[&>tr]:border-b-0', className)}
            {...props}
        />
    )
);
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            data-slot="table-row"
            className={cn(
                'border-b border-outline-variant transition-colors [&:has(td):hover]:bg-surface-variant data-[state=selected]:bg-surface-variant',
                className,
            )}
            {...props}
        />
    )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, style, ...props }, ref) => (
        <th
            ref={ref}
            data-slot="table-head"
            className={cn(
                'h-12 px-4 text-left rtl:text-right align-middle text-muted-foreground text-xs font-bold text-transform-primary tracking-wider [&:has([role=checkbox])]:pe-0',
                className,
            )}
            style={Object.assign({}, {
                fontSize: 'var(--table-header-font-size, 12px)',
                lineHeight: 'var(--table-header-line-height, 1.33)',
                letterSpacing: 'var(--table-header-letter-spacing, 0.4px)',
                fontWeight: 'var(--table-header-font-weight, 700)',
                textTransform: 'var(--table-header-text-casing, var(--text-transform-primary, uppercase))' as React.CSSProperties['textTransform'],
            }, style)}
            {...props}
        />
    )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td ref={ref} data-slot="table-cell" className={cn('p-4 align-middle [&:has([role=checkbox])]:pe-0', className)} {...props} />
    )
);
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    ({ className, ...props }, ref) => (
        <caption ref={ref} data-slot="table-caption" className={cn('mt-4 text-sm text-on-surface-variant font-body text-transform-secondary', className)} {...props} />
    )
);
TableCaption.displayName = 'TableCaption';
