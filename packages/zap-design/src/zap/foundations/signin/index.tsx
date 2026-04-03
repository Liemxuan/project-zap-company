'use client';

import React from 'react';
import { Button as GenesisButton } from '../../../genesis/atoms/interactive/buttons';
import { Input as GenesisInput } from '../../../genesis/atoms/interactive/inputs';
import { Card as GenesisCard } from '../../../genesis/atoms/surfaces/card';

import { useSigninForm } from '../../../features/auth/use-signin-form';
import { FormProvider, Controller } from 'react-hook-form';
import { GoogleIcon } from '../../../genesis/atoms/icons/google';
import { AppleIcon } from '../../../genesis/atoms/icons/apple';
import { SpinnerIcon } from '../../../genesis/atoms/icons/spinner';
import { InfoIcon } from '../../../genesis/atoms/icons/info';
import { AlertCircleIcon } from '../../../genesis/atoms/icons/alert-circle';
import { Checkbox } from '../../../genesis/atoms/interactive/checkboxes';
import { useTheme } from '../../../components/ThemeContext';

/**
 * Combat Sign-in Page: The Hybrid Skeleton
 * 
 * Objectives:
 * 1. Mirror the Core Base split-screen layout.
 * 2. Use Metro/Genesis atoms for form primitives.
 * 3. Mobile Emphasis: Clean, high-density form on small screens.
 */
export default function CombatLoginPage() {
    const {} = useTheme();
    const { form, isProcessing, error, onSubmit, onSocialSignIn } = useSigninForm();

    return (
        <div className="grid lg:grid-cols-2 grow min-h-screen font-body text-transform-secondary bg-layer-canvas">
            
            {/* Left Side: Authentication Form (The Truth) */}
            <div className="flex justify-center items-center p-8 lg:p-12 order-2 lg:order-1 outline-none">
                <GenesisCard className="w-full max-w-[440px] bg-layer-cover shadow-elevation-1 flex flex-col p-[var(--spacing-card-pad)] gap-[var(--spacing-form-gap)]">
                    
                    {/* Header */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold font-display tracking-tight text-on-surface text-transform-primary">Sign in to ZAP</h1>
                    </div>

                    {/* Note/Alert Box */}
                    <div className="flex items-start gap-3 p-4 bg-layer-panel debug-l3 rounded-xl border border-border">
                        <div className="mt-0.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                           <InfoIcon className="size-3 text-on-primary" />
                        </div>
                        <p className="text-[13px] leading-tight text-on-surface-variant font-body text-transform-secondary font-medium">
                            Use <span className="font-bold text-on-surface">demo@zap.vn</span> username and <span className="font-bold text-on-surface">demo123</span> for demo access.
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <GenesisButton 
                            type="button"
                            onClick={() => onSocialSignIn('apple')}
                            visualStyle="outline" variant="flat" 
                            className="w-full h-11 border-border hover:bg-surface-container-low text-on-surface font-bold font-body text-transform-secondary text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <AppleIcon className="size-5" />
                            Apple
                        </GenesisButton>
                        <GenesisButton 
                            type="button"
                            onClick={() => onSocialSignIn('google')}
                            visualStyle="outline" variant="flat" 
                            className="w-full h-11 border-border hover:bg-surface-container-low text-on-surface font-bold font-body text-transform-secondary text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <GoogleIcon className="size-5" />
                            Google
                        </GenesisButton>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-border" />
                        <span className="px-3 text-labelSmall font-bold text-on-surface-variant font-body text-transform-secondary tracking-widest">
                            or
                        </span>
                        <div className="flex-grow border-t border-border" />
                    </div>

                    {/* Form Fields */}
                    <FormProvider {...form}>
                    <form onSubmit={onSubmit} className="flex flex-col w-full gap-[var(--spacing-element-gap)]" noValidate>
                        
                        {error && (
                            <div className="flex items-start gap-3 p-3 bg-error/10 rounded-lg border border-error/20">
                                <AlertCircleIcon className="size-4 text-error shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-error">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-on-surface font-body text-transform-secondary ml-0.5">
                                Email
                            </label>
                            <GenesisInput 
                                placeholder="demo@zap.vn" 
                                type="email" 
                                {...form.register('email')}
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-0.5">
                                <label className="text-sm font-bold text-on-surface font-body text-transform-secondary">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-bold text-primary hover:text-primary/80 font-body text-transform-secondary transition-colors">
                                    Forgot Password?
                                </a>
                            </div>
                            <GenesisInput 
                                placeholder="••••••" 
                                type="password" 
                                {...form.register('password')}
                            />
                        </div>

                        <div className="flex items-center gap-2 px-0.5 pt-4">
                            <Controller
                                name="rememberMe"
                                control={form.control}
                                render={({ field }) => (
                                    <Checkbox 
                                        id="remember" 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <label htmlFor="remember" className="text-sm font-medium text-on-surface-variant font-body text-transform-secondary cursor-pointer hover:text-on-surface transition-colors leading-none mt-px">
                                Remember me
                            </label>
                        </div>

                        <GenesisButton 
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full h-12 bg-primary text-on-primary font-bold font-body text-transform-secondary text-sm shadow-lg shadow-primary/20 ${isProcessing ? 'opacity-90 cursor-not-allowed' : 'hover:bg-primary/90 transition-all'}`} 
                            variant="flat"
                        >
                            {isProcessing ? (
                                <>
                                    <SpinnerIcon className="size-4 animate-spin mr-2" />
                                    Authenticating...
                                </>
                            ) : (
                                "Continue"
                            )}
                        </GenesisButton>
                    </form>
                    </FormProvider>

                    {/* Footer */}
                    <div className="text-center text-sm font-medium text-on-surface-variant font-body text-transform-secondary">
                        Don&apos;t have an account? <a href="#" className="font-bold text-primary hover:text-primary/80 transition-colors ml-1">Sign Up</a>
                    </div>
                </GenesisCard>
            </div>

            {/* Right Side: Branding / Dashboard Mockup (Matching Core Truth) */}
            <div className="relative hidden lg:flex flex-col justify-center items-center bg-layer-base debug-l0-cad p-16 order-1 lg:order-2 overflow-hidden">
                <div className="relative z-10 w-full max-w-2xl space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold font-display tracking-tight text-on-surface text-transform-primary">Secure Dashboard Access</h2>
                        <p className="text-lg text-on-surface-variant font-body text-transform-secondary max-w-lg leading-relaxed">
                            A robust authentication gateway ensuring secure efficient user access to the ZAP Dashboard interface.
                        </p>
                    </div>

                    {/* Dashboard Mockup Visual */}
                    <div className="relative rounded-3xl border border-border bg-layer-dialog shadow-2xl overflow-hidden aspect-[4/3] group scale-90 -rotate-1 hover:rotate-0 transition-all duration-700">
                        <div className="h-full w-full bg-layer-canvas relative">
                             {/* Mock Shell Sidebar */}
                             <div className="absolute left-0 top-0 bottom-0 w-16 bg-layer-dialog border-r border-border flex flex-col items-center py-6 gap-6">
                                <div className="size-8 rounded-lg bg-primary" />
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="size-6 rounded bg-layer-panel" />)}
                                </div>
                             </div>
                             
                             {/* Mock Content */}
                             <div className="pl-24 pt-12 pr-12 space-y-8">
                                <div className="h-6 w-32 bg-layer-panel rounded" />
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="h-32 bg-layer-dialog rounded-2xl border border-border p-4 space-y-3 shadow-sm">
                                        <div className="size-8 rounded-lg bg-primary/20" />
                                        <div className="h-3 w-20 bg-layer-panel rounded" />
                                        <div className="h-2 w-full bg-layer-canvas rounded" />
                                    </div>
                                    <div className="h-32 bg-layer-dialog rounded-2xl border border-border p-4 space-y-3 shadow-sm">
                                        <div className="size-8 rounded-lg bg-secondary/20" />
                                        <div className="h-3 w-20 bg-layer-panel rounded" />
                                        <div className="h-2 w-full bg-layer-canvas rounded" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 w-24 bg-layer-panel rounded" />
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-12 bg-layer-dialog rounded-xl border border-border flex items-center px-4 gap-3">
                                                <div className="size-6 rounded bg-layer-panel" />
                                                <div className="h-2 w-32 bg-layer-panel rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Brand Footnote */}
                <div className="absolute bottom-8 right-8 flex items-center gap-2">
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-black text-[14px]">N</div>
                </div>
            </div>
        </div>
    );
}
