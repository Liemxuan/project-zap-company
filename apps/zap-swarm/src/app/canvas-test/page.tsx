"use client";

export const dynamic = 'force-dynamic';

import React from "react";
import { EphemeralCanvasCard } from "zap-design/src/genesis/molecules/cards/EphemeralCanvasCard";

export default function CanvasTestDemo() {
    const mockPayload = {
        type: "chart" as const,
        data: {
            title: "Store Performance - 30 Day Egress",
            series: [10500, 11000, 15000, 43000, 52000, 89000],
            labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col p-4 md:p-12 lg:p-24 bg-layer-base">
            <h1 className="text-3xl font-black text-on-surface mb-8 mx-auto text-center tracking-tight">
                Ephemeral Canvas: Mock View
            </h1>
            <EphemeralCanvasCard 
                sessionTitle="Stripe Velocity Analytics"
                description="Securely beamed from Watchdog Agent"
                payload={mockPayload as unknown as any}
                expiresAt={new Date(Date.now() + 10 * 60000).toISOString()}
                onExpireClick={() => alert("Closing Secure Session...")}
            />
        </div>
    );
}
