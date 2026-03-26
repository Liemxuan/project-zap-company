'use client'

import React from 'react';
import { Button } from '../../../genesis/atoms/interactive/buttons';
import { Input } from '../../../genesis/atoms/interactive/inputs';
import { AppShell } from '../../../zap/layout/AppShell';
import { Box } from 'lucide-react';
import { useTheme } from '../../../components/ThemeContext';

export default function LoginTemplate() {
    const {} = useTheme();
    return (
        <AppShell>
            <div className="flex min-h-screen items-center justify-center p-4 font-body text-transform-secondary">
                <div className="w-full max-w-sm space-y-6">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <Box className="size-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access the ZAP Engine.
                        </p>
                    </div>

                    <div className="bg-layer-panel rounded-[var(--radius)] p-6 shadow-card">
                        <div className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                                <Input placeholder="name@example.com" type="email" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs font-medium text-primary hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <Input placeholder="••••••••" type="password" />
                            </div>
                            <Button className="w-full font-medium" visualStyle="solid">
                                Sign In
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4 border-t border-border/50 bg-black/5 p-6 mt-2">
                            <Button visualStyle="outline" className="w-full border-dashed shadow-xs hover:bg-accent text-muted-foreground">
                                Sign in with Single Sign-On
                            </Button>
                            <div className="text-center text-xs text-muted-foreground">
                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                Don't have an account? <a href="#" className="font-medium text-primary hover:underline">Contact Admin</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
