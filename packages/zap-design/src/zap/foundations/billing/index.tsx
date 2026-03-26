'use client';

import React from 'react';
import { CreditCard, Download, Zap } from 'lucide-react';
import { Button as GenesisButton } from '../../../genesis/atoms/interactive/buttons';
import { Card } from '../../../genesis/atoms/surfaces/card';
import { Badge } from '../../../genesis/atoms/status/badges';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../genesis/atoms/data-display/table';
import { SettingsLayout } from '../../../zap/layout/SettingsLayout';
import { useTheme } from '../../../components/ThemeContext';

export default function MetroBilling() {
    const {} = useTheme();
    
    // Using a simple static sidebar identical to Settings but highlighting Billing if it were part of a larger app.
    const sidebarContent = (
        <nav className="flex flex-col gap-1 w-full font-body text-transform-secondary">
            <GenesisButton visualStyle="ghost" variant="flat" className="justify-start gap-3 w-full text-on-surface-variant hover:text-on-surface">
                Account
            </GenesisButton>
            <GenesisButton variant="flat" className="justify-start gap-3 w-full bg-primary-container text-on-primary-container">
                <CreditCard className="size-4" />
                Billing
            </GenesisButton>
            <GenesisButton visualStyle="ghost" variant="flat" className="justify-start gap-3 w-full text-on-surface-variant hover:text-on-surface">
                Invoices
            </GenesisButton>
        </nav>
    );

    return (
        <SettingsLayout sidebar={sidebarContent}>
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                <div className="flex flex-col gap-1">
                    <h2 className="font-display text-titleLarge text-on-surface text-transform-primary">Plan & Billing</h2>
                    <p className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                        Manage your subscription, payment methods, and billing history.
                    </p>
                </div>

                {/* Current Plan Card */}
                <Card className="p-0 overflow-hidden flex flex-col md:flex-row border-primary/20">
                    <div className="flex-1 p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-display text-titleMedium text-on-surface text-transform-primary">ZAP Enterprise</span>
                                <Badge className="bg-primary text-on-primary">Active</Badge>
                            </div>
                            <span className="font-display text-headlineMedium text-on-surface text-transform-primary">$299<span className="text-titleMedium text-on-surface-variant">/mo</span></span>
                        </div>
                        
                        <p className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                            Your next billing date is April 1st, 2026. You are currently utilizing 450/500 Swarm Agents.
                        </p>

                        <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mt-2">
                            <div className="bg-primary h-full w-[90%]" />
                        </div>
                        <div className="flex justify-between font-body text-bodySmall text-on-surface-variant text-transform-secondary">
                            <span>450 Agents Active</span>
                            <span>90% Limit Reached</span>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-[240px] bg-surface-container-highest p-6 flex flex-col justify-center items-start gap-3 border-l md:border-t-0 border-border">
                        <GenesisButton variant="flat" className="w-full bg-primary text-on-primary gap-2">
                            <Zap className="size-4" /> Upgrade Plan
                        </GenesisButton>
                        <GenesisButton visualStyle="ghost" variant="flat" className="w-full text-error hover:bg-error-container">
                            Cancel Subscription
                        </GenesisButton>
                    </div>
                </Card>

                {/* Payment Methods */}
                <Card className="p-6 flex flex-col gap-6 mt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display text-titleMedium text-on-surface text-transform-primary">Payment Methods</h3>
                        <GenesisButton visualStyle="outline" variant="flat" className="h-8 border-border text-on-surface text-xs">Add Method</GenesisButton>
                    </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-btn bg-surface-container">
            <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-surface border border-border rounded flex items-center justify-center font-display text-primary font-bold">
                    VISA
                </div>
                <div className="flex flex-col">
                    <span className="font-display text-labelLarge text-on-surface text-transform-primary">Visa ending in 4242</span>
                    <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">Expires 12/28</span>
                </div>
            </div>
            <Badge className="bg-surface-variant text-on-surface-variant">Default</Badge>
        </div>
                </Card>

                {/* Billing History */}
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display text-titleMedium text-on-surface text-transform-primary">Billing History</h3>
                    </div>
                    
                    <Card className="overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-body text-bodyMedium text-on-surface text-transform-secondary font-medium">INV-2026-003</TableCell>
                                    <TableCell className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">$299.00</TableCell>
                                    <TableCell className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">Mar 1, 2026</TableCell>
                                    <TableCell>
                                        <Badge className="bg-success-container text-on-success-container border-success">Paid</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <GenesisButton visualStyle="ghost" variant="flat" className="h-8 w-8 p-0 text-on-surface-variant hover:text-on-surface">
                                            <Download className="size-4" />
                                        </GenesisButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-body text-bodyMedium text-on-surface text-transform-secondary font-medium">INV-2026-002</TableCell>
                                    <TableCell className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">$299.00</TableCell>
                                    <TableCell className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">Feb 1, 2026</TableCell>
                                    <TableCell>
                                        <Badge className="bg-success-container text-on-success-container border-success">Paid</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <GenesisButton visualStyle="ghost" variant="flat" className="h-8 w-8 p-0 text-on-surface-variant hover:text-on-surface">
                                            <Download className="size-4" />
                                        </GenesisButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-body text-bodyMedium text-on-surface text-transform-secondary font-medium">INV-2026-001</TableCell>
                                    <TableCell className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">$299.00</TableCell>
                                    <TableCell className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">Jan 1, 2026</TableCell>
                                    <TableCell>
                                        <Badge className="bg-success-container text-on-success-container border-success">Paid</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <GenesisButton visualStyle="ghost" variant="flat" className="h-8 w-8 p-0 text-on-surface-variant hover:text-on-surface">
                                            <Download className="size-4" />
                                        </GenesisButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </SettingsLayout>
    );
}
