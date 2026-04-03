'use client';

import React from 'react';
import { Button } from '../../../genesis/atoms/interactive/buttons';
import { Input } from '../../../genesis/atoms/interactive/inputs';
import { Checkbox } from '../../../genesis/atoms/interactive/checkbox';
import { AppShell } from '../../../zap/layout/AppShell';
import { Fingerprint, Sun } from 'lucide-react';

export function SignInTemplate() {
    return (
        <AppShell>
            <div className="grid min-h-screen md:grid-cols-2 bg-layer-0 font-body text-transform-secondary text-on-surface">
                {/* Left Column - Branding / Imagery */}
                <div className="relative hidden flex-col justify-center p-12 md:flex bg-gradient-to-br from-[#d9dcd6] to-[#e4e6db] overflow-hidden">
                    {/* Simulated Moon/Planet graphic */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 opacity-80 pointer-events-none">
                        <div className="w-[800px] h-[800px] rounded-full bg-white/40 blur-3xl mix-blend-overlay" />
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl mix-blend-soft-light" />
                    </div>

                    <div className="relative z-10 max-w-[480px]">
                        <h1 className="text-6xl font-black tracking-tighter text-[#5E6D21] mb-6">
                            ZAP SYSTEM
                        </h1>
                        <p className="text-lg text-on-surface-variant font-medium leading-relaxed max-w-[400px]">
                            complete mastery of the m3 5-tier spatial architecture. the most sophisticated, layer-compliant ui stack constructed.
                        </p>
                    </div>
                </div>

                {/* Right Column - Authentication */}
                <div className="flex flex-col items-center justify-center p-8 bg-layer-panel relative">
                    <div className="w-full max-w-[400px] space-y-8">
                        {/* Header */}
                        <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-3xl font-bold tracking-tight text-on-surface">
                                AUTHENTICATE
                            </h2>
                            <p className="text-sm text-on-surface-variant">
                                please enter your credentials below.
                            </p>
                        </div>

                        {/* Card Container */}
                        <div className="relative bg-surface rounded-2xl border border-outline-variant shadow-card p-8">
                            
                            {/* Top Pills */}
                            <div className="absolute -top-3 right-6 flex items-center space-x-2">
                                <span className="flex items-center space-x-1.5 bg-surface border border-outline-variant rounded-full px-3 py-1 text-[10px] font-bold text-on-surface-variant shadow-sm tracking-wider uppercase">
                                    <span>🇺🇸</span>
                                    <span>EN</span>
                                </span>
                                <span className="flex items-center space-x-1.5 bg-surface border border-outline-variant rounded-full px-3 py-1 text-[10px] font-bold text-on-surface-variant shadow-sm tracking-wider uppercase">
                                    <Sun className="h-3 w-3 text-[#f59e0b]" />
                                    <span>LIGHT</span>
                                </span>
                            </div>

                            <form className="space-y-6 pt-2" onSubmit={(e) => e.preventDefault()}>
                                {/* Operator ID */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-on-surface">
                                        operator id
                                    </label>
                                    <Input 
                                        type="email" 
                                        placeholder="tom@zap.vn" 
                                        leadingIcon="mail" 
                                        variant="filled"
                                        className="bg-layer-panel border-transparent focus:bg-layer-surface"
                                    />
                                </div>

                                {/* Passkey */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-on-surface">
                                        passkey
                                    </label>
                                    <Input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        leadingIcon="lock"
                                        variant="filled"
                                        className="bg-layer-panel border-transparent focus:bg-layer-surface tracking-widest"
                                    />
                                </div>

                                {/* Options Row */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="remember" 
                                            className="data-[state=checked]:bg-[#5E6D21] data-[state=checked]:border-[#5E6D21]"
                                        />
                                        <label 
                                            htmlFor="remember" 
                                            className="text-xs font-medium text-on-surface-variant cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            remember me
                                        </label>
                                    </div>
                                    <a href="#" className="text-xs font-bold text-[#5E6D21] hover:underline">
                                        forget password?
                                    </a>
                                </div>

                                {/* Primary Button */}
                                <Button 
                                    className="w-full font-bold h-12 mt-4 bg-[#c4db5e] hover:bg-[#b0c946] text-[#4d5a1b] shadow-md border border-[color-mix(in_srgb,#c4db5e_80%,transparent)] shadow-[#c4db5e]/20"
                                >
                                    <Fingerprint className="mr-2 h-5 w-5 opacity-80" />
                                    authorize access
                                </Button>

                                {/* Divider */}
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-outline-variant" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-surface px-2 text-on-surface-variant font-medium">
                                            or
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="w-full bg-layer-panel border-outline-variant hover:bg-layer-surface shadow-sm font-semibold text-on-surface-variant h-11">
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V15.34h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 3.34h-2.33v6.54C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
                                        </svg>
                                        apple
                                    </Button>
                                    <Button variant="outline" className="w-full bg-layer-panel border-outline-variant hover:bg-layer-surface shadow-sm font-semibold text-on-surface-variant h-11">
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        google
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
