'use client';

import * as React from 'react';
import { LogIn, Loader2, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../../genesis/atoms/status/avatars';
import { Button } from '../../genesis/atoms/interactive/button';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { LiveBlinker } from '../../genesis/atoms/indicators/LiveBlinker';
import { cn } from '../../lib/utils';
import { Wrapper } from '../../components/dev/Wrapper';
import { spring, softSpring } from '../../lib/animations';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './dropdown-menu';

export interface UserSessionProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'default' | 'small';
    variant?: 'default' | 'ghost';
    spacing?: 'between' | 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    dropdownSide?: 'top' | 'bottom';
    isLoggedIn?: boolean;
    isLoading?: boolean;
    interactionMode?: 'buttons' | 'dropdown';
    user?: {
        name: string;
        role?: string;
        avatarUrl?: string;
        status?: 'online' | 'offline' | 'busy' | 'away';
    };
    onLoginClick?: () => void;
    onLogoutClick?: () => void;
}

export function UserSession({
    size = 'small',
    variant = 'ghost',
    spacing = 'sm',
    showLabel = true,
    dropdownSide = 'bottom',
    isLoggedIn = false,
    isLoading = false,
    interactionMode = 'dropdown',
    user,
    onLoginClick,
    onLogoutClick,
    className,
    ...props
}: UserSessionProps) {
    // Determine avatar source and initials
    const avatarSrc = isLoggedIn ? user?.avatarUrl : undefined;
    const fallbackInitials = isLoggedIn && user?.name 
        ? user.name.substring(0, 2).toUpperCase() 
        : 'GU';

    // Status indicator replaced by LiveBlinker when active

    // Determine typography styles mapping to M3
    // Image 1: "USER SESSION" label
    // Bordered card
    // Internal user info text sizes
    
    // Extracted Avatar Content for reuse
    const renderAvatar = (isClickable: boolean = true) => (
        <div className={cn("relative flex items-center justify-center shrink-0", isClickable && "cursor-pointer group", isLoading && "opacity-70 pointer-events-none")}>
            <Avatar 
                size={size === 'small' ? "sm" : "md"} 
                src={avatarSrc}
                initials={isLoggedIn ? fallbackInitials : undefined}
                fallback={!isLoggedIn ? "?" : undefined}
                className={cn("border border-outline transition-colors", isClickable && "group-hover:border-primary/50")}
            />
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/50 rounded-full backdrop-blur-[2px]">
                    <Loader2 className="size-4 animate-spin text-primary" />
                </div>
            )}
            {/* Status Indicator */}
            {isLoggedIn && !isLoading && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={spring}
                    className="absolute bottom-0 right-0 z-10 flex items-center justify-center bg-surface p-[2px] rounded-full translate-x-1/4 translate-y-1/4"
                >
                    <LiveBlinker 
                        color="green" 
                        iconOnly={true} 
                        className="!h-auto !pb-0 !m-0"
                    />
                </motion.div>
            )}
        </div>
    );

    return (
        <Wrapper identity={{ displayName: 'UserSession', filePath: 'components/ui/user-session.tsx', type: 'Molecule', architecture: 'L4: Molecules' }}>
            <div className={cn("flex flex-col gap-2 w-full max-w-[320px]", className)} {...props}>
                {showLabel && (
                    <span className="font-display text-[12px] font-bold tracking-wider text-transform-primary">
                        USER SESSION
                    </span>
                )}
                
                <motion.div 
                    layout 
                    transition={spring}
                    className={cn(
                        "flex items-center rounded-xl",
                        spacing === 'between' && "justify-between",
                        spacing === 'sm' && "gap-3",
                        spacing === 'md' && "gap-4",
                        spacing === 'lg' && "gap-8",
                        variant === 'default' ? "border border-outline-variant bg-surface" : "bg-transparent",
                        size === 'small' ? "p-1" : "p-3"
                    )}
                >
                    <motion.div layout="position" className={cn(
                        "flex items-center w-full justify-end",
                        spacing === 'sm' && "gap-3",
                        spacing === 'md' && "gap-4",
                        spacing === 'lg' && "gap-8",
                        spacing === 'between' && "gap-3"
                    )}>
                        <div className="flex flex-col relative justify-center items-end text-right">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={isLoggedIn ? 'logged-in' : 'logged-out'}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={softSpring}
                                    className="flex flex-col"
                                >
                                    <span className={cn(
                                        "font-display font-semibold leading-tight text-transform-primary",
                                        size === 'small' ? "text-[12px]" : "text-[14px]",
                                        isLoggedIn ? "text-on-surface" : "text-on-surface/60"
                                    )}>
                                        {isLoggedIn && user ? user.name : "Guest User"}
                                    </span>
                                    <span className={cn(
                                        "font-body text-on-surface-variant text-transform-secondary",
                                        size === 'small' ? "text-[10px]" : "text-[12px]"
                                    )}>
                                        {isLoggedIn && user ? user.role : "Not logged in"}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        {interactionMode === 'dropdown' ? (
                            isLoggedIn ? (
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild disabled={isLoading}>
                                        <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full flex shrink-0 disabled:opacity-50">
                                            {renderAvatar(true)}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side={dropdownSide} align="end" className="w-56" style={{
                                         '--dropdown-gap': '2px',
                                         '--dropdown-padding': '4px',
                                         '--dropdown-radius': '12px',
                                         '--dropdown-border-width': '1px'
                                    } as React.CSSProperties}>
                                        <DropdownMenuLabel className="font-display">My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer gap-2">
                                            <User className="size-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer gap-2">
                                            <Settings className="size-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={onLogoutClick} 
                                            disabled={isLoading}
                                            className="cursor-pointer gap-2 text-error focus:text-error/90 focus:bg-error/10"
                                        >
                                            <Icon name="logout" size="sm" className="rotate-180" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <button 
                                    onClick={onLoginClick}
                                    disabled={isLoading}
                                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full flex shrink-0 disabled:opacity-50"
                                >
                                    {renderAvatar(true)}
                                </button>
                            )
                        ) : (
                            <div className="flex shrink-0">
                                {renderAvatar(false)}
                            </div>
                        )}
                    </motion.div>

                    {interactionMode === 'buttons' && (
                        <AnimatePresence mode="popLayout" initial={false}>
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={spring}
                                >
                                    <Button 
                                        type="button"
                                        variant="secondary" 
                                        size="xs" 
                                        className="gap-2 rounded-lg px-4 opacity-70 pointer-events-none w-[90px] justify-center"
                                    >
                                        <Loader2 className="size-4 animate-spin" />
                                    </Button>
                                </motion.div>
                            ) : isLoggedIn ? (
                                <motion.div
                                    key="logout"
                                    initial={{ opacity: 0, scale: 0.9, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                                    transition={spring}
                                >
                                    <Button 
                                        type="button"
                                        variant="secondary" 
                                        size="xs" 
                                        className="gap-2 rounded-lg px-4 w-[90px] justify-center"
                                        onClick={onLogoutClick}
                                    >
                                        <Icon name="logout" size="sm" className="rotate-180" />
                                        Logout
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, scale: 0.9, x: -10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: 10 }}
                                    transition={spring}
                                >
                                    <Button 
                                        type="button"
                                        variant="primary" 
                                        size="xs" 
                                        className="gap-2 rounded-lg px-4 w-[90px] justify-center"
                                        onClick={onLoginClick}
                                    >
                                        <LogIn className="size-4 rotate-180" />
                                        Login
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </motion.div>
            </div>
        </Wrapper>
    );
}
