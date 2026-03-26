import React, { useState } from 'react';
import { Button } from '../../../genesis/atoms/interactive/button';
import { PanelLeft, Settings, Bell, Search, LogOut, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../../genesis/atoms/interactive/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../genesis/molecules/dropdown-menu';
import { Input } from '../../../genesis/atoms/interactive/inputs';
import { ScrollArea } from '../../../genesis/molecules/scroll-area';

export interface AppShellProps {
    children?: React.ReactNode;
    sidebarContent?: React.ReactNode;
    headerContent?: React.ReactNode;
}

export const ZapAppShell: React.FC<AppShellProps> = ({ children, sidebarContent, headerContent }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full bg-background font-body text-transform-secondary text-foreground overflow-hidden">

            {/* LEFT SIDEBAR A */}
            {sidebarOpen && (
                <aside className="w-[280px] bg-muted border-r border-border border-solid flex flex-col flex-shrink-0 transition-all duration-300">
                    <div className="h-14 border-b border-border flex items-center flex-shrink-0 justify-between px-4 w-full">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold font-display text-transform-primary flex-shrink-0 cursor-pointer shadow-xs" title="Toggle Sidebar">Z</div>
                            <span className="font-semibold text-sm truncate">ZAP OS</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground rounded-full -mr-2"
                            title="Collapse Sidebar"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <PanelLeft className="size-5" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 w-full">
                        {sidebarContent || (
                            <div className="p-4 flex flex-col gap-2">
                                <div className="text-sm font-medium text-muted-foreground py-2">Nav Components</div>
                                <div className="bg-black/5 h-10 rounded-md w-full animate-pulse" />
                                <div className="bg-black/5 h-10 rounded-md w-full animate-pulse" />
                                <div className="bg-black/5 h-10 rounded-md w-full animate-pulse" />
                            </div>
                        )}
                    </ScrollArea>
                </aside>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col bg-background min-w-0">

                {/* HEADER */}
                <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 flex-shrink-0 w-full bg-surface z-10">
                    <div className="flex items-center gap-2 -ml-2">
                        {!sidebarOpen && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground rounded-full"
                                title="Open Sidebar"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <PanelLeft className="size-5" />
                            </Button>
                        )}
                        {headerContent || <span className="font-medium text-sm text-foreground ml-1">Dashboard</span>}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:flex items-center">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search resources..."
                                className="pl-8 w-[200px] lg:w-[300px] h-9 bg-muted/50 border-none rounded-full"
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9">
                            <Bell className="size-4" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 rounded-full px-2 gap-2 text-muted-foreground hover:text-foreground border border-border shadow-sm">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">A</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium hidden sm:inline-block">Admin</span>
                                    <ChevronDown className="size-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 font-body text-transform-secondary">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-brand-red focus:text-brand-red focus:bg-brand-red/10">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* WORKSPACE */}
                <ScrollArea className="flex-1 w-full bg-surface-container-lowest">
                    {children || (
                        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full flex flex-col gap-6">
                            <div className="w-full h-32 rounded-xl bg-surface-container border border-border/50 shadow-sm animate-pulse" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="h-64 rounded-xl bg-surface-container border border-border/50 shadow-sm animate-pulse" />
                                <div className="col-span-1 md:col-span-2 h-64 rounded-xl bg-surface-container border border-border/50 shadow-sm animate-pulse" />
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </main>
        </div>
    );
};
