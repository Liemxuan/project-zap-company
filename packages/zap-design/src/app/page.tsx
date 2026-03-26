'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../../../zap-auth/src/actions';
import { AppleIcon } from '../genesis/atoms/icons/apple';
import { GoogleIcon } from '../genesis/atoms/icons/google';
import { SpinnerIcon } from '../genesis/atoms/icons/spinner';
import { Button } from '../genesis/atoms/interactive/buttons';
import { EmailInput } from '../genesis/atoms/interactive/EmailInput';
import { PasswordInput } from '../genesis/atoms/interactive/PasswordInput';
import { Heading } from '../genesis/atoms/typography/headings';
import { Text } from '../genesis/atoms/typography/text';
import { Label } from '../genesis/atoms/typography/label';
import { Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
};

const itemShow = {
    hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' }
};

/**
 * Root Login Page — FUNCTIONAL
 * Same visual template as /design/[theme]/signin but wired to loginAction.
 */
export default function RootLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeLang, setActiveLang] = useState('🇺🇸 EN');
    const [rememberMe, setRememberMe] = useState(false);

    React.useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setIsDarkMode(true);
        }
        // Restore saved email
        const savedEmail = localStorage.getItem('zap_remember_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

    const cycleLanguage = () => {
        const languages = ['🇺🇸 EN', '🇻🇳 VI', '🇫🇷 FR', '🇯🇵 JA'];
        const nextIndex = (languages.indexOf(activeLang) + 1) % languages.length;
        setActiveLang(languages[nextIndex]);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        try {
            const result = await loginAction(email, password);
            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem('zap_remember_email', email);
                } else {
                    localStorage.removeItem('zap_remember_email');
                }
                router.push('/design/metro/organisms/user-management');
            } else {
                setError(result.error || 'Authentication failed.');
                setIsProcessing(false);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
            setIsProcessing(false);
        }
    };

    return (
        /* L1: Canvas Background */
        <div className="min-h-screen w-full flex items-center justify-center bg-layer-canvas p-4 md:p-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:32px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-6xl relative z-10"
            >
                {/* L2: Cover (The Application Window) */}
                <div
                    className="w-full bg-layer-cover overflow-hidden flex flex-col lg:flex-row shadow-2xl border-outline-variant/30 min-h-[650px] border relative"
                    style={{ borderRadius: 'var(--layer-2-border-radius, 24px)' }}
                >

                    {/* Left Column: Branding / Art */}
                    <div className="hidden lg:flex flex-col justify-center p-16 bg-primary/10 w-1/2 relative overflow-hidden group">
                        <motion.img
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.8, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800"
                            alt="ZAP System Architecture"
                            className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-overlay transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        <motion.div
                            className="relative z-10"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Heading level={1} className="text-transform-primary text-primary mb-6 drop-shadow-lg" style={{ fontSize: 'var(--typography-display-size, 54px)' }}>
                                ZAP SYSTEM
                            </Heading>
                            <Text size="body-large" className="text-transform-secondary text-on-surface/90 max-w-sm mb-8 leading-relaxed font-medium drop-shadow-md">
                                Complete mastery of the M3 5-Tier Spatial Architecture. The most sophisticated, layer-compliant UI stack constructed.
                            </Text>
                        </motion.div>

                        {/* Abstract Lighting */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none -translate-x-1/4 translate-y-1/3"></div>
                    </div>

                    {/* Right Column: Interaction Form Hub */}
                    <div className="w-full lg:w-1/2 p-6 md:p-12 flex items-center justify-center bg-transparent relative z-10 bg-grid-on-surface/[0.02]">

                        {/* L3: Panel */}
                        <div
                            className="w-full max-w-md bg-layer-panel p-8 md:p-10 relative border border-outline-variant/40 shadow-lg"
                            style={{ borderRadius: 'var(--layer-3-border-radius, 16px)' }}
                        >

                            {/* Panel Header */}
                            <div className="mb-10">
                                <Heading level={2} className="text-on-surface text-transform-primary tracking-tight">
                                    Authenticate
                                </Heading>
                                <Text size="body-main" className="text-on-surface/60 mt-2 block text-transform-secondary">
                                    Please enter your credentials below.
                                </Text>
                            </div>

                            {/* L4: Dialog */}
                            <div
                                className="bg-layer-dialog p-6 sm:p-8 relative border border-outline-variant/50 shadow-xl mt-6"
                                style={{ borderRadius: 'var(--layer-4-border-radius, 12px)' }}
                            >

                                {/* L5: Config Bar */}
                                <div className="absolute -top-5 right-6 flex items-center gap-2 z-50">
                                    {/* Language Selector */}
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={cycleLanguage}
                                        className="bg-layer-modal px-3 py-1.5 border border-outline-variant/60 shadow-2xl flex items-center gap-2 backdrop-blur-xl cursor-pointer hover:bg-on-surface/5"
                                        style={{ borderRadius: 'var(--layer-5-border-radius, 8px)' }}
                                    >
                                        <Text size="body-tiny" className="font-bold text-on-surface tracking-wider">{activeLang}</Text>
                                    </motion.div>

                                    {/* Theme Switcher */}
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleTheme}
                                        className="bg-layer-modal px-3 py-1.5 border border-outline-variant/60 shadow-2xl flex items-center gap-2 backdrop-blur-xl cursor-pointer hover:bg-on-surface/5"
                                        style={{ borderRadius: 'var(--layer-5-border-radius, 8px)' }}
                                    >
                                        <Text size="body-tiny" className="font-bold text-on-surface tracking-wider uppercase">
                                            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                                        </Text>
                                    </motion.div>
                                </div>

                                <motion.form
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="show"
                                    onSubmit={handleLogin}
                                    className="flex flex-col gap-5 pt-3"
                                    noValidate
                                >
                                    {/* Email */}
                                    <motion.div variants={itemShow} className="space-y-2">
                                        <Label className="text-on-surface">Operator ID</Label>
                                        <EmailInput
                                            placeholder="operator@zap.vn"
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            required
                                        />
                                    </motion.div>

                                    {/* Password */}
                                    <motion.div variants={itemShow} className="space-y-2">
                                        <div className="flex justify-between items-center w-full">
                                            <Label className="text-on-surface">Passkey</Label>
                                        </div>
                                        <PasswordInput
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                            required
                                        />
                                    </motion.div>

                                    {/* Error Display */}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-error/10 border border-error/30 text-error text-center"
                                            style={{ borderRadius: 'var(--layer-5-border-radius, 8px)' }}
                                        >
                                            <Text size="body-small" className="font-medium">{error}</Text>
                                        </motion.div>
                                    )}

                                    {/* Account Recovery Options */}
                                    <motion.div variants={itemShow} className="flex items-center justify-between mt-2 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center w-4 h-4 rounded border border-outline-variant group-hover:border-primary transition-colors bg-surface overflow-hidden">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => {
                                                        setRememberMe(e.target.checked);
                                                        if (!e.target.checked) {
                                                            localStorage.removeItem('zap_remember_email');
                                                        }
                                                    }}
                                                    className="peer absolute opacity-0 w-full h-full cursor-pointer z-20"
                                                />
                                                <div className="absolute inset-0 bg-primary scale-0 peer-checked:scale-100 transition-transform origin-center duration-200"></div>
                                                <svg className="w-3 h-3 text-on-primary absolute scale-0 peer-checked:scale-100 transition-transform delay-75 duration-200 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <Text size="body-small" className="text-on-surface/80 group-hover:text-on-surface transition-colors select-none font-medium text-transform-secondary">Remember Me</Text>
                                        </label>
                                        
                                        <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.95 }}>
                                            <Text size="body-small" className="text-primary font-semibold hover:underline cursor-pointer text-transform-secondary transition-all">
                                                Forget Password?
                                            </Text>
                                        </motion.div>
                                    </motion.div>

                                    {/* Submit Action */}
                                    <motion.div variants={itemShow} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full mt-4"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <SpinnerIcon className="size-5 animate-spin shrink-0" />
                                                    <span>Authenticating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Fingerprint className="size-5 shrink-0" />
                                                    <span>Authorize Access</span>
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>

                                    {/* Divider */}
                                    <motion.div variants={itemShow} className="relative flex items-center my-4 opacity-70">
                                        <div className="flex-grow border-t border-outline-variant/40"></div>
                                        <Text size="body-small" className="flex-shrink-0 mx-4 text-transform-secondary text-on-surface/50 bg-layer-dialog px-2">
                                            or
                                        </Text>
                                        <div className="flex-grow border-t border-outline-variant/40"></div>
                                    </motion.div>

                                    {/* SSO */}
                                    <motion.div variants={itemShow} className="flex gap-3">
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                                            <Button
                                                type="button"
                                                visualStyle="outline"
                                                color="primary"
                                                className="w-full"
                                            >
                                                <AppleIcon className="size-4 shrink-0" />
                                                Apple
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                                            <Button
                                                type="button"
                                                visualStyle="outline"
                                                color="primary"
                                                className="w-full"
                                            >
                                                <GoogleIcon className="size-4 shrink-0" />
                                                Google
                                            </Button>
                                        </motion.div>
                                    </motion.div>

                                </motion.form>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* L1 Footer Note */}
            <Text size="body-small" className="absolute bottom-6 w-full flex justify-center text-transform-tertiary text-on-surface/40 z-10 pointer-events-none tracking-widest">
                Olympus Swarm Infrastructure // L1-L5 Compliant
            </Text>
        </div>
    );
}
