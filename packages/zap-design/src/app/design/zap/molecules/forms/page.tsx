'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Input } from '../../../../../genesis/atoms/interactive/inputs';
import { Checkbox } from '../../../../../genesis/atoms/interactive/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../../genesis/molecules/form';
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms.',
  }),
});

export default function FormSandboxPage() {
    const [gap, setGap] = useState([16]);
    const [inputHeight, setInputHeight] = useState([48]);
    const [inputRadius, setInputRadius] = useState([8]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
            terms: false,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        alert(JSON.stringify(values, null, 2));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const triggerErrors = () => {
        form.trigger();
    };

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/forms/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Form Structural Settings", type: "Docs Link", filePath: "zap/molecules/forms/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--form-item-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={4} max={32} step={4} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--input-height</span>
                                    <span className="font-bold">{inputHeight[0]}px</span>
                                </div>
                                <Slider value={inputHeight} onValueChange={setInputHeight} min={32} max={64} step={4} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--input-border-radius</span>
                                    <span className="font-bold">{inputRadius[0]}px</span>
                                </div>
                                <Slider value={inputRadius} onValueChange={setInputRadius} min={0} max={24} step={2} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Form Architecture"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/form.tsx"
            importPath="@/components/ui/form"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-error', '--md-sys-color-surface'],
                typographyScales: ['--font-display (labelLarge)', '--font-body (bodySmall)']
            }}
            platformConstraints={{
                web: "Forms assemble inputs, labels, and validation into unified accessible groups.",
                mobile: "Errors must sit precisely beneath the input and maintain an 8px minimum gap to the next item."
            }}
            foundationRules={[
                "Form fields must wrap Inputs inside FormItem > FormControl > Slot.",
                "Labels use text-transform-primary, Descriptions use text-transform-secondary.",
                "All spacings bind dynamically via CSS variables (e.g. var(--form-item-gap))."
            ]}
        >
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16"
                style={Object.assign({}, {
                    '--form-item-gap': `${gap[0]}px`,
                    '--input-height': `${inputHeight[0]}px`,
                    '--input-border-radius': `${inputRadius[0]}px`
                } as React.CSSProperties)}
            >
                <section className="space-y-6">
                    <Wrapper identity={{ displayName: "Section Header", type: "Header", filePath: "zap/molecules/forms/page.tsx" }} className="w-fit inline-block">
                        <div className="flex items-center justify-start gap-2 text-on-surface-variant text-transform-secondary pb-2 px-2">
                            <Icon name="design_services" size={14} className="opacity-60" />
                            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary uppercase">React Hook Form Assembly</h3>
                        </div>
                    </Wrapper>

                    <div className="bg-layer-panel rounded-[24px] border border-outline-variant/50 p-8 md:p-12 relative overflow-hidden">
                        <Wrapper identity={{ displayName: "States Grid Container", type: "Container", filePath: "zap/molecules/forms/page.tsx" }}>
                            <div className="max-w-md mx-auto">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your username" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your public display name.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Enter secure password" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Must contain at least 8 characters.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="terms"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border border-outline-variant rounded-[var(--input-border-radius,8px)]">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            Accept terms and conditions
                                                        </FormLabel>
                                                        <FormDescription>
                                                            You agree to our Terms of Service and Privacy Policy.
                                                        </FormDescription>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" variant="flat" className="w-full">
                                            Submit Form
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </Wrapper>
                    </div>
                </section>
            </div>
        </ComponentSandboxTemplate>
    );
}
