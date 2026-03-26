'use client';

import React from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../genesis/atoms/icons/Icon';

import { type Platform } from '../../../../genesis/molecules/navigation/PlatformToggle';
export type { Platform };
// =============================================================================
// Code Block — Platform-aware
// =============================================================================

interface CodeBlockProps {
    web?: string;
    mobile?: string;
    platform: Platform;
    language?: string;
    label?: string;
}

export const CodeBlock = ({ web, mobile, platform, label }: CodeBlockProps) => {
    const code = platform === 'web' ? web : mobile;
    if (!code) return null;

    return (
        <div className="rounded-lg overflow-hidden border border-border/50 bg-layer-panel">
            {label && (
                <div className="bg-layer-dialog px-4 py-2 border-b border-border/50 flex items-center gap-2">
                    <Icon name={platform === 'web' ? 'code' : 'phone_android'} size={14} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{label}</span>
                </div>
            )}
            <pre className="p-4 overflow-x-auto">
                <code className="text-xs font-dev text-transform-tertiary leading-relaxed text-foreground whitespace-pre">{code}</code>
            </pre>
        </div>
    );
};

// =============================================================================
// Section Header — Consistent with anchor
// =============================================================================

interface SectionHeaderProps {
    number: string;
    title: string;
    icon: string;
    description: string;
    id: string;
}

export const SectionHeader = ({ number, title, icon, description, id }: SectionHeaderProps) => (
    <div id={id} className="scroll-mt-20 flex items-center justify-between px-4 py-3 bg-layer-panel rounded-t-xl border-b border-outline-variant/30">
        {/* Left: number pill + icon + title */}
        <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-on-primary text-[10px] font-black tracking-widest">
                <Icon name={icon} size={12} />
                {number}
            </span>
            <span className="text-sm font-black tracking-tight text-on-surface text-transform-secondary leading-none font-secondary">
                {title}
            </span>
        </div>
        {/* Right: description metadata */}
        <span className="text-[10px] text-on-surface-variant font-secondary tracking-wide opacity-70">
            {description}
        </span>
    </div>
);

// =============================================================================
// Token Table — Reusable
// =============================================================================

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../../genesis/atoms/data-display/table';

interface TokenTableProps {
    headers: string[];
    rows: (string | number | null)[][];
    highlight?: number; // column to highlight
    fontClass?: string;
}

export const TokenTable = ({ headers, rows, highlight, fontClass }: TokenTableProps) => (
    <div className={cn("rounded-lg border border-outline-variant bg-layer-dialog overflow-hidden", fontClass)}>
        <Table className="w-full">
            <TableHeader>
                <TableRow className="border-b border-outline-variant hover:bg-transparent">
                    {headers.map((h, i) => (
                        <TableHead key={i} className="h-12 align-middle">
                            {h}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row, ri) => (
                    <TableRow key={ri} className="border-b border-outline-variant last:border-0 hover:bg-surface-variant/50">
                        {row.map((cell, ci) => (
                            <TableCell key={ci} className={cn(
                                "align-middle h-12",
                                ci === highlight ? "font-dev text-transform-tertiary text-primary font-bold" : "text-foreground",
                                cell === null ? "text-muted-foreground/40 italic" : ""
                            )}>
                                {cell === null ? '—' : String(cell)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);
