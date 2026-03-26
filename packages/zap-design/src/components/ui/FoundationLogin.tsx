'use client';

import React, { useState } from 'react';
import { Button } from "../../genesis/atoms/interactive/buttons";
import { Input } from "../../genesis/atoms/interactive/inputs";
import { Card } from "../../genesis/atoms/surfaces/card";
import { InfoIcon } from '../../genesis/atoms/icons/info';
import { AlertCircleIcon } from '../../genesis/atoms/icons/alert-circle';
import { SpinnerIcon } from '../../genesis/atoms/icons/spinner';
import { Heading } from '../../genesis/atoms/typography/headings';
import { Text } from '../../genesis/atoms/typography/text';
import { Label } from '../../genesis/atoms/typography/label';

interface FoundationLoginProps {
    appName: string;
    description: string;
    duties: string[];
    onLogin: (email: string, pass: string) => Promise<{ success?: boolean; error?: string }>;
}

export function FoundationLogin({ appName, description, duties, onLogin }: FoundationLoginProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);
        
        const fd = new FormData(e.currentTarget);
        const email = fd.get('email') as string;
        const password = fd.get('password') as string;

        try {
            const res = await onLogin(email, password);
            if (res.error) {
                setError(res.error);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to authenticate");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="grid lg:grid-cols-2 grow min-h-screen font-body bg-layer-canvas">
            
            {/* Left Side: Authentication Form */}
            <div className="flex justify-center items-center p-8 lg:p-12 order-2 lg:order-1 outline-none">
                <Card className="w-full max-w-[440px] bg-layer-cover flex flex-col p-[var(--spacing-card-pad)] gap-[var(--spacing-form-gap)]">
                    
                    <div className="text-center space-y-1">
                        <Heading level={3} className="text-on-surface text-transform-primary">ZAP Sign In</Heading>
                    </div>

                    <div className="flex items-start gap-3 p-[var(--spacing-element-pad)] bg-layer-panel debug-l3">
                        <div className="mt-0.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                           <InfoIcon className="size-3 text-on-primary" />
                        </div>
                        <div className="space-y-1">
                            <Text size="md" weight="medium" className="text-on-surface-variant text-transform-secondary">
                                ZAP HQ: <span className="font-bold text-on-surface">name@zap</span> (1234)
                            </Text>
                            <Text size="md" weight="medium" className="text-on-surface-variant text-transform-secondary">
                                Merchants: <span className="font-bold text-on-surface">name@pho24</span> or <span className="font-bold text-on-surface">name@pendolasco</span> (4567)
                            </Text>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-[var(--spacing-element-gap)]">
                        {error && (
                            <div className="flex items-start gap-3 p-[var(--spacing-element-pad)] bg-error/10 rounded-[var(--radius-shape-medium)] border border-error/20">
                                <AlertCircleIcon className="size-4 text-error shrink-0 mt-0.5" />
                                <Text size="md" weight="medium" className="text-error">{error}</Text>
                            </div>
                        )}

                        <div className="space-y-1.5 flex flex-col">
                            <Label className="text-on-surface font-bold ml-0.5">Email</Label>
                            <Input 
                                name="email"
                                placeholder="name@zap" 
                                type="text" 
                                required
                            />
                        </div>
                        
                        <div className="space-y-1.5 flex flex-col">
                            <Label className="text-on-surface font-bold ml-0.5">Password</Label>
                            <Input 
                                name="password"
                                placeholder="••••" 
                                type="password" 
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isProcessing}
                            size="medium"
                            className="w-full mt-4"
                        >
                            {isProcessing ? (
                                <><SpinnerIcon className="size-4 animate-spin mr-2" /> Authenticating...</>
                            ) : (
                                "Authenticate"
                            )}
                        </Button>
                    </form>
                </Card>
            </div>

            {/* Right Side: Branding / Application Specific Duties */}
            <div className="relative hidden lg:flex flex-col justify-center items-center bg-layer-base p-16 order-1 lg:order-2 overflow-hidden">
                <div className="relative z-10 w-full max-w-2xl space-y-10">
                    <div className="space-y-4">
                        <Heading level={1} className="text-on-surface text-transform-primary">{appName}</Heading>
                        <Text size="iso-500" className="text-on-surface-variant max-w-lg block font-body text-transform-secondary">
                            {description}
                        </Text>
                        <ul className="space-y-2 text-on-surface-variant font-body text-transform-secondary text-sm pt-2">
                            {duties.map((duty, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <div className="size-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">
                                        {idx + 1}
                                    </div>
                                    <Text as="span" size="md">{duty}</Text>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Dashboard Mockup Visual — Restructured for Strict Ascension (L1 -> L2 -> L3) */}
                    <div className="relative bg-layer-canvas overflow-hidden aspect-[4/3] group scale-90 -rotate-1 hover:rotate-0 transition-all duration-700">
                        <div className="h-full w-full bg-layer-cover relative">
                             {/* Mock Shell Sidebar */}
                             <div className="absolute left-0 top-0 bottom-0 w-16 bg-layer-panel flex flex-col items-center py-6 gap-6">
                                <div className="size-8 rounded-[var(--radius-shape-small)] bg-primary" />
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="size-6 rounded-[var(--radius-shape-small)] bg-surface-container-high" />)}
                                </div>
                             </div>
                             
                             {/* Mock Content */}
                             <div className="pl-24 pt-12 pr-12 space-y-8">
                                <div className="h-6 w-32 bg-surface-container-high rounded-[var(--radius-shape-small)]" />
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="h-32 bg-layer-panel p-4 space-y-3">
                                        <div className="size-8 rounded-[var(--radius-shape-small)] bg-primary-container" />
                                        <div className="h-3 w-20 bg-surface-container-high rounded-[var(--radius-shape-small)]" />
                                        <div className="h-2 w-full bg-surface-container rounded-[var(--radius-shape-small)]" />
                                    </div>
                                    <div className="h-32 bg-layer-panel p-4 space-y-3">
                                        <div className="size-8 rounded-[var(--radius-shape-small)] bg-secondary-container" />
                                        <div className="h-3 w-20 bg-surface-container-high rounded-[var(--radius-shape-small)]" />
                                        <div className="h-2 w-full bg-surface-container rounded-[var(--radius-shape-small)]" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 w-24 bg-surface-container-high rounded-[var(--radius-shape-small)]" />
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-12 bg-layer-panel flex items-center px-4 gap-3">
                                                <div className="size-6 rounded-[var(--radius-shape-small)] bg-surface-container" />
                                                <div className="h-2 w-32 bg-surface-container rounded-[var(--radius-shape-small)]" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 flex items-center gap-2">
                    <div className="size-8 rounded-full bg-on-surface flex items-center justify-center text-surface font-black text-labelLarge">Z</div>
                </div>
            </div>
        </div>
    );
}
