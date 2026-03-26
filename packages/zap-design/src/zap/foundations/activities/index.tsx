'use client';

import React from 'react';
import { Activity, ShieldCheck, Download, Code, User, AlertCircle, Trash2 } from 'lucide-react';
import { Button as GenesisButton } from '../../../genesis/atoms/interactive/buttons';
import { Card } from '../../../genesis/atoms/surfaces/card';
import { Badge } from '../../../genesis/atoms/status/badges';
import { Avatar } from '../../../genesis/atoms/status/avatars';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../genesis/atoms/data-display/table';
import { SettingsLayout } from '../../../zap/layout/SettingsLayout';
import { useTheme } from '../../../components/ThemeContext';

export default function MetroActivities() {
    const {} = useTheme();

    // Sidebar simulating an Audit/Logs left-nav
    const sidebarContent = (
        <nav className="flex flex-col gap-1 w-full font-body text-transform-secondary">
            <GenesisButton variant="flat" className="justify-start gap-3 w-full bg-primary-container text-on-primary-container">
                <Activity className="size-4" />
                Audit Logs
            </GenesisButton>
            <GenesisButton visualStyle="ghost" variant="flat" className="justify-start gap-3 w-full text-on-surface-variant hover:text-on-surface">
                <ShieldCheck className="size-4" />
                Security Events
            </GenesisButton>
            <GenesisButton visualStyle="ghost" variant="flat" className="justify-start gap-3 w-full text-on-surface-variant hover:text-on-surface">
                <Code className="size-4" />
                System Hooks
            </GenesisButton>
        </nav>
    );

    return (
        <SettingsLayout sidebar={sidebarContent}>
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-titleLarge text-on-surface text-transform-primary">System Activity Logs</h2>
                        <p className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                            Track and monitor all actions within your workspace.
                        </p>
                    </div>
                    <GenesisButton visualStyle="outline" variant="flat" className="gap-2 border-border text-on-surface">
                        <Download className="size-4" />
                        Export CSV
                    </GenesisButton>
                </div>

                <Card className="p-0 overflow-hidden flex flex-col border border-border">
                    <div className="p-4 border-b border-border bg-surface-container-highest flex gap-2">
                        <GenesisButton variant="flat" className="bg-primary text-on-primary h-8 text-xs">All Events</GenesisButton>
                        <GenesisButton visualStyle="ghost" variant="flat" className="text-on-surface-variant hover:text-on-surface h-8 text-xs">Extraction</GenesisButton>
                        <GenesisButton visualStyle="ghost" variant="flat" className="text-on-surface-variant hover:text-on-surface h-8 text-xs">Security</GenesisButton>
                        <GenesisButton visualStyle="ghost" variant="flat" className="text-on-surface-variant hover:text-on-surface h-8 text-xs">System</GenesisButton>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Actor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-btn bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                                            <Trash2 className="size-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-display text-labelLarge text-on-surface text-transform-primary">Deleted Legacy Component</span>
                                            <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">/genesis/legacy/button.tsx</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-body text-bodyMedium text-on-surface text-transform-secondary">
                                        <Avatar initials="A" size="sm" className="w-6 h-6 bg-primary text-on-primary" />
                                        Antigravity (Agent 1)
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-success-container text-on-success-container border-success">Success</Badge>
                                </TableCell>
                                <TableCell className="text-right font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                    Just now
                                </TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-btn bg-warning-container text-on-warning-container flex items-center justify-center shrink-0">
                                            <AlertCircle className="size-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-display text-labelLarge text-on-surface text-transform-primary">L1-L2 Layer Audit Failed</span>
                                            <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">/design/signin inline colors detected</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                        <Avatar initials="S" size="sm" className="w-6 h-6 bg-inverse-surface text-inverse-on-surface" />
                                        Spike (Agent 2)
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-error-container text-on-error-container border-error">Flagged</Badge>
                                </TableCell>
                                <TableCell className="text-right font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                    12 mins ago
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-btn bg-success-container text-on-success-container flex items-center justify-center shrink-0">
                                            <Code className="size-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-display text-labelLarge text-on-surface text-transform-primary">Created Genesis Table</span>
                                            <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">/genesis/atoms/data-display/table.tsx</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-body text-bodyMedium text-on-surface text-transform-secondary">
                                        <Avatar initials="Z" size="sm" className="w-6 h-6 bg-primary text-on-primary" />
                                        Zeus Admin
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-success-container text-on-success-container border-success">Merged</Badge>
                                </TableCell>
                                <TableCell className="text-right font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                    35 mins ago
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-btn bg-surface-variant text-on-surface flex items-center justify-center shrink-0">
                                            <User className="size-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-display text-labelLarge text-on-surface text-transform-primary">Authentication Attempt</span>
                                            <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">IP: 192.168.1.45</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-body text-bodyMedium text-on-surface text-transform-secondary">
                                        <Avatar initials="J" size="sm" className="w-6 h-6 bg-surface-variant text-on-surface" />
                                        Jerry (Agent 3)
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-surface-variant text-on-surface border-border">Granted</Badge>
                                </TableCell>
                                <TableCell className="text-right font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                    1 hour ago
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>

            </div>
        </SettingsLayout>
    );
}
