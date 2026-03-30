'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { Wrapper } from '../../../components/dev/Wrapper';
import { LoginForm } from '../../../genesis/organisms/auth/LoginForm';
import { AuthCardLayout } from '../../../genesis/layout/auth/AuthCardLayout';
import { useBorderProperties } from '../../../zap/sections/atoms/border_radius/use-border-properties';
import { L5Inspector } from '../../../genesis/organisms/inspector';
import { Switch } from '../../../genesis/atoms/interactive/switch';
import { InspectorAccordion } from '../../../zap/organisms/laboratory/InspectorAccordion';

/**
 * Sign-in B (Card Layout) Showcase
 * Renders LoginForm inside the L6 AuthCardLayout
 * Route: /design/[theme]/organisms/signin-b
 */
export default function SignInBTemplate() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // ─── Form State ──────────────────────────────────────────────────
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeLang, setActiveLang] = useState('🇺🇸 EN');
    const [rememberMe, setRememberMe] = useState(false);
    const [merchantName, setMerchantName] = useState('ZAP Inc.');
    const [email, setEmail] = useState('tom@zap.vn');
    const [password, setPassword] = useState('password');

    // ─── Composition Visibility Toggles (Inspector-driven) ──────────
    const [showMerchantName, setShowMerchantName] = useState(false);
    const [showEmail, setShowEmail] = useState(true);
    const [showPassword, setShowPassword] = useState(true);
    const [showRememberMe, setShowRememberMe] = useState(true);
    const [showSocialLogin, setShowSocialLogin] = useState(true);
    const [showConfigBar, setShowConfigBar] = useState(true);

    // ─── Dynamic Border Properties (DB-backed) ─────────────────────
    const {
        state: borderState,
        setComponentOverride,
        clearComponentOverride,
        hydrateState,
        getEffectiveProps
    } = useBorderProperties();

    useEffect(() => {
        // Run once on mount to sync React state with document class
        if (typeof document !== 'undefined') {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/border_radius/publish?theme=${activeTheme}`);
                if (res.ok && mounted) {
                    const data = await res.json();
                    if (data.success && data.data && data.data.state) {
                        hydrateState(data.data.state);
                    }
                }
            } catch (err) {
                console.error("Failed to load border radius settings:", err);
            }
        };
        loadSettings();
        return () => { mounted = false; };
    }, [activeTheme, hydrateState]);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

    const cycleLanguage = () => {
        const languages = ['🇺🇸 EN', '🇻🇳 VI', '🇫🇷 FR', '🇯🇵 JA'];
        const nextIndex = (languages.indexOf(activeLang) + 1) % languages.length;
        setActiveLang(languages[nextIndex]);
    };

    const effectiveProps = getEffectiveProps('LoginForm');

    // ─── Composition Toggles (for Inspector) ────────────────────────
    const compositionToggles = [
        { label: 'Merchant Name', checked: showMerchantName, onChange: setShowMerchantName, icon: 'business' },
        { label: 'Email', checked: showEmail, onChange: setShowEmail, icon: 'mail' },
        { label: 'Password', checked: showPassword, onChange: setShowPassword, icon: 'lock' },
        { label: 'Remember Me', checked: showRememberMe, onChange: setShowRememberMe, icon: 'check_box' },
        { label: 'Social Login', checked: showSocialLogin, onChange: setShowSocialLogin, icon: 'login' },
        { label: 'Config Bar', checked: showConfigBar, onChange: setShowConfigBar, icon: 'tune' },
    ];

    // ─── Inspector Panel ────────────────────────────────────────────
    const inspectorControls = (
        <L5Inspector
            componentName="SignInBLayout"
            borderState={borderState}
            setComponentOverride={setComponentOverride}
            clearComponentOverride={clearComponentOverride}
            effectiveProps={effectiveProps}
            publishContext={{
                activeTheme,
                filePath: "genesis/templates/login/SignInBTemplate.tsx",
            }}
        >
            <InspectorAccordion title="Composition" icon="view_stream" defaultOpen={true}>
                <Wrapper identity={{ displayName: "Composition Toggles", type: "Control Group", filePath: "genesis/templates/login/SignInBTemplate.tsx" }}>
                    <div className="space-y-3 pt-1">
                        {compositionToggles.map(({ label, checked, onChange, icon }) => (
                            <div key={label} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px] text-muted-foreground opacity-60">{icon}</span>
                                    <span className="text-[11px] font-bold font-display text-transform-primary text-muted-foreground group-hover:text-foreground transition-colors">
                                        {label}
                                    </span>
                                </div>
                                <Switch size="sm" checked={checked} onCheckedChange={onChange} />
                            </div>
                        ))}
                    </div>
                </Wrapper>
            </InspectorAccordion>
        </L5Inspector>
    );

    const layoutContent = (
        <AuthCardLayout
            className="min-h-full h-full w-full bg-layer-panel"
            backgroundSlot={
                <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-40">
                    {/* Diagonal grid pattern */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, var(--md-sys-color-outline-variant) 25%, transparent 25%, transparent 75%, var(--md-sys-color-outline-variant) 75%, var(--md-sys-color-outline-variant)), linear-gradient(45deg, var(--md-sys-color-outline-variant) 25%, transparent 25%, transparent 75%, var(--md-sys-color-outline-variant) 75%, var(--md-sys-color-outline-variant))', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px', opacity: 0.05 }}></div>
                    {/* Soft glow circles */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                </div>
            }
            formSlot={
                <Wrapper identity={{ displayName: "LoginForm (L5)", type: "Injectable Block", filePath: "genesis/organisms/auth/LoginForm.tsx" }}>
                    <LoginForm
                        onSubmit={(e) => e.preventDefault()}
                        merchantName={merchantName}
                        onMerchantNameChange={setMerchantName}
                        email={email}
                        onEmailChange={setEmail}
                        password={password}
                        onPasswordChange={setPassword}
                        rememberMe={rememberMe}
                        onRememberMeChange={setRememberMe}
                        activeLang={activeLang}
                        onCycleLang={cycleLanguage}
                        isDarkMode={isDarkMode}
                        onToggleTheme={toggleTheme}
                        showMerchantName={showMerchantName}
                        showEmail={showEmail}
                        showPassword={showPassword}
                        showRememberMe={showRememberMe}
                        showSocialLogin={showSocialLogin}
                        showConfigBar={showConfigBar}
                    />
                </Wrapper>
            }
        />
    );

    if (isFullscreen) {
        return (
            <div className="w-screen h-screen m-0 p-0 overflow-hidden">
                {layoutContent}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="Auth Card Layout (Sign-in B)"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="genesis/layout/auth/AuthCardLayout.tsx"
            importPath="@/genesis/layout/auth/AuthCardLayout"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container'],
                typographyScales: ['--font-display (titleMedium)']
            }}
            fullWidth={true}
            foundationRules={[
                "L6 Layout dictating structural grid positioning for a centered auth module.",
                "Background supports patterns, gradients, or solid L2 structural colors.",
                "Z-index layering ensures the L5 form sits above the decorative background."
            ]}
        >
            <div className="w-full flex justify-center py-6 px-4 md:px-0">
                <CanvasDesktop title="Sign-In Experience // Secondary Auth" fullScreenHref={`/design/${activeTheme}/organisms/signin-b?fullscreen=true`}>
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
