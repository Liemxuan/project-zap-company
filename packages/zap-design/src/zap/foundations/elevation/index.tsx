'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { LaboratoryTemplate } from '../../../zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { ElevationBody } from '../../../zap/sections/atoms/elevation/body';
import { ElevationInspector, useLayerProperties } from '../../../zap/sections/atoms/elevation/inspector';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';
import { ThemePublisher } from '../../../components/dev/ThemePublisher';

export default function ElevationPage() {
    const params = useParams();
    const themeId = (params?.theme as string) || 'metro'; // Provide fallback if rendered outside dynamic route
    
    const [platform, setPlatform] = useState<Platform>('web');
    const layerProps = useLayerProperties();

    const inspectorFooter = (
        <ThemePublisher
            theme={themeId}
            onPublish={layerProps.publish}
            filePath={`app/design/${themeId}/foundations/elevation/page.tsx`}
            hideWrapper={true}
        />
    );

    return (
        <LaboratoryTemplate
            componentName="Elevation &amp; Shadows"
            tier="L1 TOKEN"
            filePath={`app/design/${themeId}/foundations/elevation/page.tsx`}
            headerMode={
                <ThemeHeader
                    title="Elevation &amp; Shadows"
                    badge="Surface Hierarchy"
                    breadcrumb={`Zap Design Engine / ${themeId} / Foundations`}
                    platform={platform}
                    setPlatform={setPlatform}
                />
            }
            inspectorConfig={{
                title: 'Elevation',
                width: 320,
                content: (
                        <ElevationInspector
                            state={layerProps.state}
                        setLayerOverride={layerProps.setLayerOverride}
                        hasOverrides={layerProps.hasOverrides}
                    />
                ),
                footer: inspectorFooter,
            }}
        >
            <ElevationBody platform={platform} />
        </LaboratoryTemplate>
    );
}
