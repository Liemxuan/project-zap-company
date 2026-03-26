'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Check, ChevronRight, Circle } from 'lucide-react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { motion } from 'motion/react';
import { spring } from '../../lib/animations';

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
    return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
    return <DropdownMenuPrimitive.Trigger className="select-none" data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.SubTrigger asChild {...props}>
            <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                data-slot="dropdown-menu-sub-trigger"
                className={cn(
                    'font-body text-transform-secondary flex cursor-default gap-2 select-none items-center rounded-md px-2 py-1.5 text-sm outline-hidden text-on-surface',
                    'focus:bg-surface-variant focus:text-on-surface hover:bg-surface-variant hover:text-on-surface hover:shadow-[var(--md-sys-elevation-level1)] hover:z-10',
                    'data-[state=open]:bg-surface-variant data-[state=open]:text-on-surface',
                    'data-[here=true]:bg-surface-variant data-[here=true]:text-on-surface',
                    '[&>svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&>svg]:size-4 [&>svg]:shrink-0',
                    inset && 'ps-8',
                    className,
                )}
            >
                {children}
                <ChevronRight data-slot="dropdown-menu-sub-trigger-indicator" className="ms-auto size-3.5! rtl:rotate-180" />
            </motion.div>
        </DropdownMenuPrimitive.SubTrigger>
    );
}

function DropdownMenuSubContent({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
    return (
        <DropdownMenuPrimitive.SubContent
            data-slot="dropdown-menu-sub-content"
            className={cn(
                'z-50 min-w-[8rem] overflow-hidden shadow-[var(--md-sys-elevation-level2)] border-outline-variant bg-surface-container-high text-on-surface data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                'space-y-[length:var(--dropdown-gap,0.125rem)] rounded-[length:var(--dropdown-radius,0.375rem)] border-[length:var(--dropdown-border-width,1px)] p-[length:var(--dropdown-padding,0.5rem)]',
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuContent({
    className,
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                className={cn(
                    'z-50 min-w-[8rem] overflow-hidden border-outline-variant bg-surface-container-high text-on-surface shadow-[var(--md-sys-elevation-level2)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    'space-y-[length:var(--dropdown-gap,0.125rem)] rounded-[length:var(--dropdown-radius,0.375rem)] border-[length:var(--dropdown-border-width,1px)] p-[length:var(--dropdown-padding,0.5rem)]',
                    className,
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    );
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
    return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
    className,
    inset,
    variant,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: 'destructive';
}) {
    return (
        <DropdownMenuPrimitive.Item asChild {...props}>
            <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                data-slot="dropdown-menu-item"
                className={cn(
                    'font-body text-transform-secondary text-on-surface relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
                    'focus:bg-surface-variant focus:text-on-surface hover:bg-surface-variant hover:text-on-surface hover:shadow-[var(--md-sys-elevation-level1)] hover:z-10',
                    'data-[active=true]:bg-surface-variant data-[active=true]:text-on-surface',
                    inset && 'ps-8',
                    variant === 'destructive' &&
                    'text-error hover:text-error focus:text-error hover:bg-error/5 focus:bg-error/5 data-[active=true]:bg-error/5',
                    className,
                )}
            >
                {children}
            </motion.div>
        </DropdownMenuPrimitive.Item>
    );
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
    return (
        <DropdownMenuPrimitive.CheckboxItem asChild checked={checked} {...props}>
            <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                data-slot="dropdown-menu-checkbox-item"
                className={cn(
                    'font-body text-transform-secondary text-on-surface relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50',
                    'focus:bg-surface-variant focus:text-on-surface hover:bg-surface-variant hover:text-on-surface hover:shadow-[var(--md-sys-elevation-level1)] hover:z-10',
                    className,
                )}
            >
                <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
                    <DropdownMenuPrimitive.ItemIndicator>
                        <Check className="h-4 w-4 text-primary" />
                    </DropdownMenuPrimitive.ItemIndicator>
                </span>
                {children}
            </motion.div>
        </DropdownMenuPrimitive.CheckboxItem>
    );
}

function DropdownMenuRadioItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
    return (
        <DropdownMenuPrimitive.RadioItem asChild {...props}>
            <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                data-slot="dropdown-menu-radio-item"
                className={cn(
                    'font-body text-transform-secondary text-on-surface relative flex cursor-default select-none items-center rounded-md py-1.5 ps-6 pe-2 text-sm outline-hidden focus:bg-surface-variant focus:text-on-surface data-disabled:pointer-events-none data-disabled:opacity-50',
                    'hover:bg-surface-variant hover:text-on-surface hover:shadow-[var(--md-sys-elevation-level1)] hover:z-10',
                    className,
                )}
            >
                <span className="absolute start-1.5 flex h-3.5 w-3.5 items-center justify-center">
                    <DropdownMenuPrimitive.ItemIndicator>
                        <Circle className="h-1.5 w-1.5 fill-primary stroke-primary" />
                    </DropdownMenuPrimitive.ItemIndicator>
                </span>
                {children}
            </motion.div>
        </DropdownMenuPrimitive.RadioItem>
    );
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.Label
            data-slot="dropdown-menu-label"
            className={cn('font-display text-transform-primary px-2 py-1.5 text-xs text-on-surface-variant font-medium', inset && 'ps-8', className)}
            {...props}
        />
    );
}

function DropdownMenuRadioGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
    return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
    return (
        <DropdownMenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn('-mx-2 my-1.5 h-px bg-outline-variant', className)}
            {...props}
        />
    );
}

function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn('ms-auto text-xs tracking-widest opacity-60', className)}
            {...props}
        />
    );
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
    return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

export {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
};
