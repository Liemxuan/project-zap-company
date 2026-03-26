'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LaboratoryTemplate } from '../../../zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';
import { ThemePublisher } from '../../../components/dev/ThemePublisher';
import { toast } from 'sonner';

import { useBorderProperties } from '../../../zap/sections/atoms/border_radius/use-border-properties';
import { BorderRadiusInspector } from '../../../zap/sections/atoms/border_radius/inspector';
import { BorderRadiusBody } from '../../../zap/sections/atoms/border_radius/body';

export default function BorderRadiusPage() {
    const params = useParams();
    const themeId = (params?.theme as string) || 'metro';
    const [platform, setPlatform] = useState<Platform>('web');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        state,
        setUniversal,
        setComponentOverride,
        clearComponentOverride,
        hasOverrides,
        getEffectiveProps,
        hydrateState
    } = useBorderProperties();

    // Hydrate saved border radius tokens
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/border_radius/publish?theme=${themeId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        console.log('Loaded border radius tokens for', themeId);
                        if (data.data.state) {
                            hydrateState(data.data.state);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load border radius settings:", err);
            }
        };
        loadSettings();
    }, [themeId, hydrateState]);

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: themeId,
                    state // Send the entire nested state object instead of flat tokens
                }),
            });

            if (res.ok) {
                toast.success(`Border & Radius Tokens Published`, {
                    description: `Successfully synced values to the ${themeId} theme database.`
                });
            } else {
                throw new Error("Failed to publish");
            }
        } catch (error) {
            console.error("Publish Error:", error);
            toast.error(`Publish Failed`, {
                description: `Failed to sync values to the ${themeId} theme database.`
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inspectorFooter = (
        <ThemePublisher
            theme={themeId}
            onPublish={handlePublish}
            isLoading={isSubmitting}
            filePath={`app/design/${themeId}/foundations/border_radius/page.tsx`}
        />
    );

    return (
        <LaboratoryTemplate
            componentName="Border & Radius"
            tier="L1 TOKEN"
            filePath="src/zap/foundations/border_radius/index.tsx"
            headerMode={
                <ThemeHeader
                    title="Border & Radius"
                    badge="Shape System"
                    breadcrumb={`Zap Design Engine / ${themeId} / Foundations`}
                    platform={platform}
                    setPlatform={setPlatform}
                />
            }
            inspectorConfig={{
                title: 'Shape Control',
                width: 380,
                content: (
                    <BorderRadiusInspector 
                        state={state}
                        setUniversal={setUniversal}
                        setComponentOverride={setComponentOverride}
                        clearComponentOverride={clearComponentOverride}
                        hasOverrides={hasOverrides}
                    />
                ),
                footer: inspectorFooter,
            }}
        >
            <BorderRadiusBody 
                getEffectiveProps={getEffectiveProps}
                universal={state.universal}
            />
        </LaboratoryTemplate>
    );
}
