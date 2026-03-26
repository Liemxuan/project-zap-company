'use client';

import React from 'react';
import { useTheme } from '../../components/ThemeContext';
import { DebugAuditor } from '../../components/debug/auditor';
import { Inspector } from '../../zap/layout/Inspector';
import { Canvas } from '../../genesis/atoms/surfaces/canvas';
import { CanvasBody } from '../../zap/layout/CanvasBody';

interface LaboratoryTemplateProps {
    /** 
     * The name shown on the Auditor (e.g. "Colors", "Typography")
     */
    componentName: string;
    /** 
     * 
     * The Tier for the component, e.g. "L1 TOKEN"
     */
    tier?: string;
    /**
     * File path to be shown in the Auditor
     */
    filePath?: string;
    /**
     * The main Component Header (often ThemeHeader) 
     * Handles tabs, titles, breadcrumbs, actions
     */
    headerMode?: React.ReactNode;
    /**
     * The main interactive content rendered inside the canvas
     */
    children?: React.ReactNode;
    /**
     * 
     * Configuration for the Inspector Panel on the Right
     */
    inspectorConfig?: {
        title?: string;
        width?: number; // default 380 per the colors page
        footer?: React.ReactNode;
        content: React.ReactNode;
    };
    /**
     * Title displayed in the L2 Cover card header.
     * Defaults to componentName if not provided.
     */
    coverTitle?: string;
    /**
     * Architecture badge text in the Cover pill.
     * Defaults to "[ L2 Cover // {componentName} ]" if not provided.
     */
    coverBadge?: string;
    /**
     * Remove padding and boundaries from the canvas body for full-bleed content 
     */
    flush?: boolean;
}

export function LaboratoryTemplate({
    componentName,
    tier = "L2 PRIMITIVE",
    filePath = "",
    headerMode,
    children,
    inspectorConfig,
    coverTitle,
    coverBadge,
    flush = false,
}: LaboratoryTemplateProps) {
    useTheme(); // Ensure theme context is bound for the Inspector Layout

    // Auto-derive cover card text from componentName
    const resolvedTitle = coverTitle ?? componentName;
    const resolvedBadge = coverBadge ?? `[ L2 Cover // ${componentName} ]`;

    return (
        <DebugAuditor
            componentName={componentName}
            tier={tier}
            status="Beta"
            filePath={filePath}
            importPath=""
            inspector={
                inspectorConfig ? (
                    <Inspector 
                        title={inspectorConfig.title || "Architect"} 
                        width={inspectorConfig.width || 380}
                        footer={inspectorConfig.footer}
                    >
                        {inspectorConfig.content}
                    </Inspector>
                ) : undefined
            }
        >
            {/* The Main Stage Area matching the exact architecture of Colors */}
            <Canvas className="transition-all duration-300 origin-center flex flex-col pt-0 min-h-full overflow-y-auto">
                {/* Header Level - Stretches 100% */}
                {headerMode && (
                    <div className="w-full flex-none">
                        {headerMode}
                    </div>
                )}
                
                {/* Canvas Main Content — L1 → L2 via CanvasBody */}
                <CanvasBody coverTitle={coverTitle === "" ? "" : resolvedTitle} coverBadge={coverBadge === "" ? "" : resolvedBadge} flush={flush}>
                    {children}
                </CanvasBody>
            </Canvas>
        </DebugAuditor>
    );
}
