'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LaboratoryTemplate } from '../../../zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { SpacingBody } from '../../../zap/sections/atoms/spacing/body';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';
import { ThemePublisher } from '../../../components/dev/ThemePublisher';
import { toast } from 'sonner';

export default function SpacingPage() {
    const params = useParams();
    const themeId = (params?.theme as string) || 'metro';
    const [platform, setPlatform] = useState<Platform>('web');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hydrate saved spacing tokens
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/spacing/publish?theme=${themeId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        console.log('Loaded spacing tokens for', themeId);
                        // Future: apply these tokens to context if SpacingBody manages editable local state
                    }
                }
            } catch (err) {
                console.error("Failed to load spacing settings:", err);
            }
        };
        loadSettings();
    }, [themeId]);

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/spacing/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: themeId,
                    spacingTokens: {} // In the future, collect modified spacing tokens here
                }),
            });

            if (res.ok) {
                toast.success(`Spacing Tokens Published`, {
                    description: `Successfully synced spacing values to the ${themeId} theme database.`
                });
            } else {
                throw new Error("Failed to publish");
            }
        } catch (error) {
            console.error("Publish Error:", error);
            toast.error(`Publish Failed`, {
                description: `Failed to sync spacing values to the ${themeId} theme database.`
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
            filePath={`app/design/${themeId}/foundations/spacing/page.tsx`}
        />
    );

    return (
        <LaboratoryTemplate
            componentName="Spacing & Sizing"
            tier="L1 TOKEN"
            filePath="src/zap/foundations/spacing/index.tsx"
            headerMode={
                <ThemeHeader
                    title="Spacing & Sizing"
                    breadcrumb={`Zap Design Engine / ${themeId} / Foundations`}
                    badge="Spatial System (L1)"
                    platform={platform}
                    setPlatform={setPlatform}
                />
            }
            inspectorConfig={{
                title: 'Spatial System',
                width: 320,
                content: (
                    <div className="p-4 flex flex-col gap-4 text-sm text-muted-foreground">
                        <p>View the active theme&apos;s spacing values.</p>
                        <hr className="border-border" />
                        <p className="text-xs">
                            Current values map directly to Tailwind standard spacing scaled on top of M3 logic.
                        </p>
                    </div>
                ),
                footer: inspectorFooter,
            }}
        >
            <SpacingBody platform={platform} />
        </LaboratoryTemplate>
    );
}
