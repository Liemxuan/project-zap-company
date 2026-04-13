'use client';

import React from 'react';
import { Button } from '../../../genesis/atoms/interactive/buttons';
import { Input } from '../../../genesis/atoms/interactive/input';
import { Building2 } from 'lucide-react';
import { EmailInput } from '../../../genesis/atoms/interactive/EmailInput';
import { PasswordInput } from '../../../genesis/atoms/interactive/PasswordInput';
import { Label } from '../../../genesis/atoms/typography/label';
import { Text } from '../../../genesis/atoms/typography/text';
import { SpinnerIcon } from '../../../genesis/atoms/icons/spinner';
import { RememberMeCheckbox } from '../../../genesis/molecules/forms/RememberMeCheckbox';
import { SocialLoginButtons } from '../../../genesis/molecules/forms/SocialLoginButtons';
import { ConfigBar } from '../../../genesis/molecules/forms/ConfigBar';
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

export interface LoginFormProps {
    onSubmit: (e: React.FormEvent) => void;
    merchantName: string;
    onMerchantNameChange: (value: string) => void;
    email: string;
    onEmailChange: (value: string) => void;
    password: string;
    onPasswordChange: (value: string) => void;
    rememberMe: boolean;
    onRememberMeChange: (checked: boolean) => void;
    isProcessing?: boolean;
    error?: string;
    activeLang: string;
    onCycleLang: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    onForgotPassword?: () => void;
    onAppleLogin?: () => void;
    onGoogleLogin?: () => void;
    onSignUp?: () => void;
    /** Composition visibility toggles — Inspector-driven */
    showMerchantName?: boolean;
    showEmail?: boolean;
    showPassword?: boolean;
    showRememberMe?: boolean;
    showSocialLogin?: boolean;
    showConfigBar?: boolean;
    showSignUp?: boolean;
}

/**
 * L5 Organism — LoginForm
 * Self-contained auth form composing L4 molecules.
 * No routing, no auth logic — pure presentation + form events.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    merchantName,
    onMerchantNameChange,
    email,
    onEmailChange,
    password,
    onPasswordChange,
    rememberMe,
    onRememberMeChange,
    isProcessing = false,
    error,
    activeLang,
    onCycleLang,
    isDarkMode,
    onToggleTheme,
    onForgotPassword,
    onAppleLogin,
    onGoogleLogin,
    onSignUp,
    showMerchantName = true,
    showEmail = true,
    showPassword = true,
    showRememberMe = true,
    showSocialLogin = true,
    showConfigBar = true,
    showSignUp = false,
}) => {
    return (
        <div
            className="w-full bg-layer-panel p-6 sm:p-8 relative border border-outline-variant/50 shadow-xl"
            style={{ borderRadius: 'var(--layer-3-border-radius, 16px)' }}
        >
            {/* L5: Config Bar — floats above the panel */}
            {showConfigBar && (
                <ConfigBar
                    activeLang={activeLang}
                    onCycleLang={onCycleLang}
                    isDarkMode={isDarkMode}
                    onToggleTheme={onToggleTheme}
                    className="absolute -top-5 right-6 z-50"
                />
            )}

            <motion.form
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                onSubmit={onSubmit}
                className="flex flex-col gap-5 pt-3"
                noValidate
            >
                {/* Merchant Name */}
                {showMerchantName && (
                    <motion.div variants={itemShow} className="space-y-2">
                        <Label className="text-on-surface">Merchant Name</Label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/60" />
                            <Input
                                placeholder="ZAP Inc."
                                value={merchantName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMerchantNameChange(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </motion.div>
                )}

                {/* Email */}
                {showEmail && (
                    <motion.div variants={itemShow} className="space-y-2">
                        <Label className="text-on-surface">Email</Label>
                        <EmailInput
                            placeholder="operator@zap.vn"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
                            required
                        />
                    </motion.div>
                )}

                {/* Password */}
                {showPassword && (
                    <motion.div variants={itemShow} className="space-y-2">
                        <Label className="text-on-surface">Password</Label>
                        {/* <PasswordInput
                            placeholder="••••••••"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(e.target.value)}                            
                            required
                        /> */}
                        <Input
                            style={{ textTransform: 'none' }}
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck="false"
                            type="password"
                            placeholder='••••••••'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(e.target.value)}
                        />
                    </motion.div>
                )}

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

                {/* Remember Me + Forget Password */}
                {showRememberMe && (
                    <motion.div variants={itemShow} className="flex items-center justify-between mt-2 pt-1">
                        <RememberMeCheckbox
                            checked={rememberMe}
                            onChange={onRememberMeChange}
                        />
                        <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.95 }}>
                            <span
                                className="text-bodySmall text-primary font-semibold hover:underline cursor-pointer text-transform-secondary transition-all"
                                onClick={onForgotPassword}
                            >
                                Forget Password?
                            </span>
                        </motion.div>
                    </motion.div>
                )}

                {/* Authorize Button */}
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

                {/* Sign Up Button */}
                {showSignUp && (
                    <motion.div variants={itemShow} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="button"
                            onClick={onSignUp}
                            variant="secondary"
                            className="w-full"
                        >
                            Create New Account
                        </Button>
                    </motion.div>
                )}

                {/* Social SSO */}
                {showSocialLogin && (
                    <motion.div variants={itemShow}>
                        <SocialLoginButtons
                            onApple={onAppleLogin}
                            onGoogle={onGoogleLogin}
                        />
                    </motion.div>
                )}
            </motion.form>
        </div>
    );
};

export default LoginForm;
