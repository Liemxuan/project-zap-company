'use client';

import React, { useState, useEffect } from 'react';
import { PanelLeft, Bell, Search, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button as GenesisButton } from '../../../genesis/atoms/interactive/buttons';
import { Input as GenesisInput } from '../../../genesis/atoms/interactive/inputs';
import { Avatar } from '../../../genesis/atoms/status/avatars';
import { Card } from '../../../genesis/atoms/surfaces/card';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../genesis/atoms/data-display/table';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';

export default function MetroDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full bg-layer-canvas debug-l1 bg-[radial-gradient(var(--color-outline-variant)_1px,transparent_1px)] [background-size:16px_16px] font-body text-on-surface text-transform-secondary overflow-hidden">
            {/* LEFT SIDEBAR */}
            {sidebarOpen && (
                <aside className="w-[280px] bg-layer-cover debug-l2 border-r border-border flex flex-col flex-shrink-0 transition-all duration-300">
                    <div className="h-14 border-b border-border flex items-center flex-shrink-0 justify-between px-4 w-full">
                        <div className="flex items-center gap-2">
                            <Avatar initials="Z" size="sm" className="bg-primary text-on-primary font-display text-transform-primary" />
                            <span className="font-display text-titleMedium text-on-surface text-transform-primary truncate">ZAP OS</span>
                        </div>
                        <GenesisButton
                            visualStyle="ghost" color="secondary"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <PanelLeft className="size-5" />
                        </GenesisButton>
                    </div>

                    <div className="flex-1 w-full overflow-y-auto p-4 flex flex-col gap-2">
                        <div className="font-display text-labelLarge text-on-surface-variant text-transform-secondary py-2">Nav Components</div>
                        <div className="bg-layer-panel h-10 w-full animate-pulse" />
                        <div className="bg-layer-panel h-10 w-full animate-pulse" />
                        <div className="bg-layer-panel h-10 w-full animate-pulse" />
                    </div>
                </aside>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col bg-layer-cover debug-l2 min-w-0">
                {/* HEADER */}
                <ThemeHeader
                    title={
                        <div className="flex items-center gap-2 -ml-2">
                            {!sidebarOpen && (
                                <GenesisButton
                                    visualStyle="ghost" color="secondary"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <PanelLeft className="size-5" />
                                </GenesisButton>
                            )}
                            <span className="font-display text-headlineSmall text-on-surface text-transform-primary ml-1">Dashboard</span>
                        </div>
                    }
                    breadcrumb={`Zap Design Engine / Foundations`}
                    badge="Interactive Layout"
                    rightSlot={
                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:flex items-center">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-on-surface-variant" />
                                <GenesisInput
                                    type="search"
                                    placeholder="Search resources..."
                                    className="pl-8 w-[200px] lg:w-[300px]"
                                />
                            </div>

                            <GenesisButton visualStyle="ghost" color="secondary" className="hidden md:flex">Upgrade to Pro</GenesisButton>
                            <GenesisButton visualStyle="ghost" color="secondary">
                                <Bell className="size-5" />
                            </GenesisButton>

                            <GenesisButton visualStyle="outline" variant="flat" className="gap-2 border-border shadow-sm text-on-surface-variant">
                                <Avatar initials="A" size="sm" className="w-6 h-6 text-xs bg-primary text-on-primary" />
                                <span className="font-body text-labelLarge text-on-surface text-transform-secondary hidden sm:inline-block">Admin</span>
                                <ChevronDown className="size-4 text-on-surface-variant" />
                            </GenesisButton>
                        </div>
                    }
                    showBackground={false}
                />

                {/* WORKSPACE */}
                <div className="flex-1 w-full overflow-y-auto p-6 md:p-10">
                    <div className="max-w-6xl mx-auto flex flex-col gap-6">
                        
                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 flex flex-col gap-4 bg-layer-panel debug-l3">
                                <div className="font-display text-titleMedium text-on-surface-variant text-transform-primary">Total Extraction Targets</div>
                                <div className="font-display text-displayMedium text-primary text-transform-primary">12,450</div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-success text-on-success border-success">+14%</Badge>
                                    <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">vs last week</span>
                                </div>
                            </Card>
                            <Card className="p-6 flex flex-col gap-4 bg-layer-panel debug-l3">
                                <div className="font-display text-titleMedium text-on-surface-variant text-transform-primary">Swarm Active Agents</div>
                                <div className="font-display text-displayMedium text-on-surface text-transform-primary">342</div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-layer-base text-on-surface border-border">Stable</Badge>
                                </div>
                            </Card>
                            <Card className="p-6 flex flex-col gap-4 bg-layer-panel debug-l3">
                                <div className="font-display text-titleMedium text-on-surface-variant text-transform-primary">M3 Compliance Rate</div>
                                <div className="font-display text-displayMedium text-on-surface text-transform-primary">98.2%</div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-error text-on-error border-error">-0.5%</Badge>
                                    <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">Needs attention</span>
                                </div>
                            </Card>
                        </div>

                        {/* Data Visualization / Recent Activity */}
                        <Card className="p-6 flex flex-col gap-6 bg-layer-panel debug-l3">
                            <div className="flex justify-between items-center">
                                <h2 className="font-display text-headlineMedium text-on-surface text-transform-primary">Recent Swarm Activity</h2>
                                <GenesisButton visualStyle="solid" color="primary">View All Reports</GenesisButton>
                            </div>
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Target URI</TableHead>
                                        <TableHead>Assigned Agent</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Execution Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-body text-bodyMedium text-on-surface text-transform-secondary">/design/metro/signin</TableCell>
                                        <TableCell className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">Spike (Agent 2)</TableCell>
                                        <TableCell>
                                            <Badge className="bg-success-container text-on-success-container border-success gap-1">
                                                <CheckCircle2 className="size-3" />
                                                Verified
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-body text-bodyMedium text-on-surface-variant text-transform-secondary">1.2s</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-body text-bodyMedium text-on-surface text-transform-secondary">/design/metro/dashboard</TableCell>
                                        <TableCell className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">Antigravity (Agent 1)</TableCell>
                                        <TableCell>
                                            <Badge className="bg-warning-container text-on-warning-container border-warning gap-1">
                                                <AlertCircle className="size-3" />
                                                In Progress
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-body text-bodyMedium text-on-surface-variant text-transform-secondary">4.5s</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
