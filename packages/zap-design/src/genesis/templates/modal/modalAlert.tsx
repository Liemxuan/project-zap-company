'use client';

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/genesis/molecules/alert';
import { CircleCheck, CircleAlert } from 'lucide-react';
import { Text } from '@/genesis/atoms/typography/text';

export interface AlertState {
    type: 'success' | 'destructive' | null;
    message: string | null;
    subMessage?: string;
}

interface ModalAlertProps {
    alert: AlertState;
    onClose: () => void;
}

export const ModalAlert = ({ alert, onClose }: ModalAlertProps) => {
    return (
        <AnimatePresence>
            {alert.type && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                >
                    <Alert
                        variant={alert.type}
                        close
                        onClose={onClose}
                        className="shadow-sm border-outline-variant/50"
                    >
                        <AlertIcon>
                            {alert.type === 'success' ? (
                                <CircleCheck className="size-5" />
                            ) : (
                                <CircleAlert className="size-5" />
                            )}
                        </AlertIcon>
                        <AlertContent>
                            <AlertTitle>
                                {alert.type === 'success' ? 'Success' : 'Error'}
                            </AlertTitle>
                            <AlertDescription>{alert.message}</AlertDescription>
                            {alert.subMessage && (
                                <Text size="body-small" className="mt-1 opacity-70 italic">
                                    {alert.subMessage}
                                </Text>
                            )}
                        </AlertContent>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
