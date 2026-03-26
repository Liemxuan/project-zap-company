"use client";

import React from "react";
import { Canvas } from '../../../../../genesis/atoms/surfaces/canvas';
import { Card } from '../../../../../genesis/atoms/surfaces/card';
import { Panel } from '../../../../../genesis/atoms/surfaces/panel';

export default function AgentTrackingMatrix() {
    return (
        <div className="w-full min-h-screen bg-iso-gray-900 text-white flex flex-col font-sans p-8 theme-neo">
            <h1 className="text-4xl font-black uppercase mb-2 text-center text-acid-yellow">Olympus Agent Wikidocs</h1>
            <p className="text-center mb-12 max-w-2xl mx-auto opacity-70">
                Master terminal for tracking Agent Routing, Specialized Skills, Memory Usage, and the Olympus vs. OpenClaw architecture Matrix.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">

                {/* ROUTING & MEMORY */}
                <Canvas className="p-8 overflow-hidden rounded-card border-[length:var(--card-border-width,0px)] border-card-border">
                    <Card className="p-8 flex flex-col gap-6 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card h-full">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-black uppercase text-brand-midnight">Routing & Memory</h2>
                            <div className="bg-state-success text-brand-midnight text-xs font-bold px-3 py-1 uppercase border-[length:var(--card-border-width,0px)] border-card-border">Online</div>
                        </div>

                        <Panel className="p-6 flex flex-col gap-4 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card bg-layer-panel">
                            <h3 className="text-lg font-bold uppercase text-brand-midnight mb-2 border-b-2 border-brand-midnight/10 pb-2">Session Memory</h3>
                            <div className="flex justify-between items-center text-brand-midnight">
                                <span className="font-bold">Protocol</span>
                                <span className="text-brand-midnight/70 font-dev text-transform-tertiary text-sm">SYS_CLAW_sessions</span>
                            </div>
                            <div className="flex justify-between items-center text-brand-midnight">
                                <span className="font-bold">Compaction</span>
                                <span className="text-acid-yellow bg-black px-2 font-dev text-transform-tertiary text-sm font-bold">Rule of 500 [WIP]</span>
                            </div>
                            <div className="flex justify-between items-center text-brand-midnight">
                                <span className="font-bold">Thread Binding</span>
                                <span className="text-brand-midnight/70 font-dev text-transform-tertiary text-sm">Native Sub-agents</span>
                            </div>
                        </Panel>

                        <Panel className="p-6 flex flex-col gap-4 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card bg-layer-panel">
                            <h3 className="text-lg font-bold uppercase text-brand-midnight mb-2 border-b-2 border-brand-midnight/10 pb-2">OmniQueue Router</h3>
                            <div className="flex justify-between items-center text-brand-midnight">
                                <span className="font-bold">Engine</span>
                                <span className="text-brand-midnight/70 font-dev text-transform-tertiary text-sm">Redis / BullMQ</span>
                            </div>
                            <div className="flex justify-between items-center text-brand-midnight">
                                <span className="font-bold">Events</span>
                                <span className="text-state-warning bg-black px-2 font-dev text-transform-tertiary text-sm font-bold">Pending Hooks</span>
                            </div>
                        </Panel>
                    </Card>
                </Canvas>

                {/* SKILLS ARMORY */}
                <Canvas className="p-8 overflow-hidden rounded-card border-[length:var(--card-border-width,0px)] border-card-border">
                    <Card className="p-8 flex flex-col gap-6 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card h-full">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-black uppercase text-brand-midnight">The Armory Tracker</h2>
                            <div className="bg-brand-teal text-white text-xs font-bold px-3 py-1 uppercase border-[length:var(--card-border-width,0px)] border-card-border">JIT Injection</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Panel className="p-4 flex flex-col gap-2 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card bg-layer-panel">
                                <span className="font-bold uppercase text-brand-midnight">database-design</span>
                                <span className="text-xs text-brand-midnight/60">Mongoose/MongoDB optimizations</span>
                            </Panel>
                            <Panel className="p-4 flex flex-col gap-2 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card bg-layer-panel">
                                <span className="font-bold uppercase text-brand-midnight">server-management</span>
                                <span className="text-xs text-brand-midnight/60">Distributed queuing & scaling</span>
                            </Panel>
                            <Panel className="p-4 flex flex-col gap-2 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card bg-layer-panel">
                                <span className="font-bold uppercase text-brand-midnight">clean-code</span>
                                <span className="text-xs text-brand-midnight/60">Refactoring & SNR control</span>
                            </Panel>
                            <Panel className="p-4 flex flex-col gap-2 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card bg-layer-panel">
                                <span className="font-bold uppercase text-brand-midnight">agent-skill-builder</span>
                                <span className="text-xs text-brand-midnight/60">JIT pipeline generation</span>
                            </Panel>
                        </div>
                    </Card>
                </Canvas>

                {/* TRACKING MATRIX */}
                <Canvas className="col-span-1 lg:col-span-2 p-8 overflow-hidden rounded-card border-[length:var(--card-border-width,0px)] border-card-border">
                    <Card className="p-8 flex flex-col gap-6 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-black uppercase text-brand-midnight">Olympus vs OpenClaw Matrix</h2>
                            <div className="bg-acid-yellow text-brand-midnight text-xs font-bold px-3 py-1 uppercase border-[length:var(--card-border-width,0px)] border-card-border">Teacher vs Student</div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-dev text-transform-tertiary text-sm text-brand-midnight">
                                <thead>
                                    <tr className="border-b-[length:var(--card-border-width,0px)] border-card-border bg-theme-base/5 uppercase tracking-tight">
                                        <th className="p-4 font-bold">Feature Layer</th>
                                        <th className="p-4 font-bold">Olympus Spec</th>
                                        <th className="p-4 font-bold">ZAP Improvement</th>
                                        <th className="p-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-brand-midnight/10 hover:bg-theme-base/5">
                                        <td className="p-4 font-bold uppercase">Session Creation</td>
                                        <td className="p-4 text-brand-midnight/80">session.ts (Mongo)</td>
                                        <td className="p-4 text-brand-midnight/80">Native sub-agent threaded bindings</td>
                                        <td className="p-4"><span className="text-state-success font-black">🟢 DONE</span></td>
                                    </tr>
                                    <tr className="border-b border-brand-midnight/10 hover:bg-theme-base/5">
                                        <td className="p-4 font-bold uppercase">Sandbox Execute</td>
                                        <td className="p-4 text-brand-midnight/80">zap-run (macOS bypass)</td>
                                        <td className="p-4 text-brand-midnight/80">EPERM bypass via OS-level mapping</td>
                                        <td className="p-4"><span className="text-state-success font-black">🟢 DONE</span></td>
                                    </tr>
                                    <tr className="border-b border-brand-midnight/10 hover:bg-theme-base/5">
                                        <td className="p-4 font-bold uppercase">History Limiting</td>
                                        <td className="p-4 text-brand-midnight/80">Rule of 500 Target</td>
                                        <td className="p-4 text-brand-midnight/80">Inline logic summarizing high-cap arrays</td>
                                        <td className="p-4"><span className="text-acid-yellow bg-black font-black px-2">🟡 WIP</span></td>
                                    </tr>
                                    <tr className="border-b border-brand-midnight/10 hover:bg-theme-base/5">
                                        <td className="p-4 font-bold uppercase">Auth Rotation</td>
                                        <td className="p-4 text-brand-midnight/80">Tenant Billing Key DB</td>
                                        <td className="p-4 text-brand-midnight/80">Decentralized BYOK handling per tenant</td>
                                        <td className="p-4"><span className="text-state-error font-black">🔴 PENDING</span></td>
                                    </tr>
                                    <tr className="hover:bg-theme-base/5">
                                        <td className="p-4 font-bold uppercase">Tag Stripping</td>
                                        <td className="p-4 text-brand-midnight/80">Tg Middleware</td>
                                        <td className="p-4 text-brand-midnight/80">Scrubbing reasoning steps from human hud</td>
                                        <td className="p-4"><span className="text-state-error font-black">🔴 PENDING</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </Canvas>

            </div>
        </div>
    );
}
