'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '../../../../../genesis/molecules/form';

import { Dropzone } from '../../../../../genesis/atoms/interactive/dropzone';
const formSchema = z.object({
  documents: z.array(z.any()).min(1, {
    message: 'Please upload at least one document.',
  }),
});

export default function DropzoneSandboxPage() {    const [zoneMinHeight, setZoneMinHeight] = useState([160]);
    const [zoneRadius, setZoneRadius] = useState([12]);
    const [borderWidth, setBorderWidth] = useState([2]);

    // Fetch initial settings
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { documents: [] },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert(JSON.stringify(values.documents.map((d: any) => d.name), null, 2));
    };
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "src/app/design/zap/molecules/dropzone/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Dropzone Settings", type: "Docs Link", filePath: "src/app/design/zap/molecules/dropzone/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--dropzone-min-height</span>
                                    <span className="font-bold">{zoneMinHeight[0]}px</span>
                                </div>
                                <Slider value={zoneMinHeight} onValueChange={setZoneMinHeight} min={80} max={300} step={10} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--dropzone-radius</span>
                                    <span className="font-bold">{zoneRadius[0]}px</span>
                                </div>
                                <Slider value={zoneRadius} onValueChange={setZoneRadius} min={0} max={32} step={2} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--dropzone-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={1} max={4} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="File Dropzone"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/components/ui/dropzone.tsx"
            importPath="@/components/ui/dropzone"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['font-body', 'font-display', 'text-transform-primary', 'text-transform-secondary']
            }}
            platformConstraints={{
                web: "Allows drag and drop of files.",
                mobile: "Falls back to native file picker via touch target."
            }}
            foundationRules={[
                "All UI primitives must map to the sandbox dynamic CSS variables.",
                "ZAP Skinning protocol forces all primitives to avoid inline styles."
            ]}
        >
            <div
                className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl"
                style={Object.assign({}, {
                    '--dropzone-min-height': `${zoneMinHeight[0]}px`,
                    '--dropzone-radius': `${zoneRadius[0]}px`,
                    '--dropzone-border-width': `${borderWidth[0]}px`,
                } as React.CSSProperties)}
            >
                <div className="max-w-xl w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="documents"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-display font-bold text-transform-primary">Upload Documents</FormLabel>
                                        <FormControl>
                                            <Dropzone
                                                {...field}
                                                onChange={(files) => field.onChange(files)}
                                            />
                                        </FormControl>
                                        <FormDescription className="font-body text-transform-secondary">
                                            Max file size: 5MB. Formats allowed: PDF, DOCX, TXT.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="flat" className="w-full h-[40px] rounded-[var(--dropzone-radius)]">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
