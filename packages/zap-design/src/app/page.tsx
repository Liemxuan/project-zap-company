'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../../../zap-auth/src/actions';
import { Heading } from '../genesis/atoms/typography/headings';
import { Text } from '../genesis/atoms/typography/text';
import { AuthLayout } from '../genesis/templates/auth/AuthLayout';
import { LoginForm } from '../genesis/organisms/auth/LoginForm';
import { motion } from 'framer-motion';

/**
 * L7 Page — Root Login Route (/)
 * Composes L6 AuthLayout + L5 LoginForm.
 * Owns: auth logic, routing, localStorage, error state.
 */
export default function RootLoginPage() {
    const router = useRouter();
    const [merchantName, setMerchantName] = useState('');
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

    const handleRememberMeChange = (checked: boolean) => {
        setRememberMe(checked);
        if (!checked) {
            localStorage.removeItem('zap_remember_email');
        }
    };

    // Branding panel for the desktop split-panel variant
    const brandingPanel = (
        <>
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
        </>
    );

    return (
        <AuthLayout
            title="Authenticate"
            subtitle="Please enter your credentials below."
            brandingPanel={brandingPanel}
        >
            <LoginForm
                onSubmit={handleLogin}
                merchantName={merchantName}
                onMerchantNameChange={setMerchantName}
                email={email}
                onEmailChange={setEmail}
                password={password}
                onPasswordChange={setPassword}
                rememberMe={rememberMe}
                onRememberMeChange={handleRememberMeChange}
                isProcessing={isProcessing}
                error={error}
                activeLang={activeLang}
                onCycleLang={cycleLanguage}
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
            />
        </AuthLayout>
    );
}
