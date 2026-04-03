'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { AICard } from '../../../../../genesis/molecules/cards/AICard';
import { MessageSquare, Github, Figma } from 'lucide-react';
import { toast } from 'sonner';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function AiCardPage() {
    return (
        <ComponentSandboxTemplate
            componentName="AI Card"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/genesis/molecules/cards/AICard.tsx"
            importPath="@/genesis/molecules/cards/AICard"
            foundationInheritance={{
                colorTokens: [
                    'bg-layer-cover (Card Surface)',
                    'bg-outline/5 (Brand background accent)',
                    'bg-white (Image pill background)',
                ],
                typographyScales: ['text-on-surface text-transform-primary', 'text-on-surface-variant text-transform-secondary'],
            }}
            platformConstraints={{
                web: 'Standard fixed width cards or fluid flex layouts. High fidelity with visual corner accents.',
                mobile: 'Full width stacked components.',
            }}
            foundationRules={[
                'Use bg-layer-cover for standalone components to ensure optimal contrast.',
                'Brand hex codes can be bypassed via Tailwind text brackets (e.g., text-[#E01E5A]).',
                'Status indicators must use standardized LiveBlinker atoms when active.',
            ]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="ai-card" title="AI Card Sandbox" description="Interactive components for AI Card" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex flex-col gap-8 py-8 px-4 h-full relative z-10 overflow-y-auto">
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <AICard 
                                name="slack"
                                description="Native Slack bridge for swarm messaging and automated channel notifications."
                                imageUrl="/logos/slack.png?v=4"
                                brandColorClass="bg-layer-elevated text-[#E01E5A] border-[#E01E5A]/20"
                                status="offline"
                                users={0}
                                onConfig={() => toast.info('Configuring slack...')}
                            />
                            <AICard 
                                name="discord"
                                description="Discord webhooks and bot integration for community moderation and fleet logs."
                                icon={MessageSquare}
                                brandColorClass="bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                                status="active"
                                users={142}
                                onConfig={() => toast.info('Configuring discord...')}
                            />
                            <AICard 
                                name="github"
                                description="GitHub integration for PR reviews, issue tracking, and automated CI/CD alerts."
                                icon={Github}
                                brandColorClass="bg-slate-500/10 text-slate-800 dark:text-slate-200 border-slate-500/20"
                                status="active"
                                users={204}
                                onConfig={() => toast.info('Configuring github...')}
                            />
                            <AICard 
                                name="figma"
                                description="Figma webhook integration for design system sync and asset extraction."
                                icon={Figma}
                                brandColorClass="bg-red-500/10 text-red-600 border-red-500/20"
                                status="offline"
                                users={0}
                                onConfig={() => toast.info('Configuring figma...')}
                            />
                        </section>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}
