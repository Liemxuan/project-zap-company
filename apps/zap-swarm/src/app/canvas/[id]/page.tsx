"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EphemeralCanvasCard } from "zap-design/src/genesis/molecules/cards/EphemeralCanvasCard";

export default function CanvasReceiverPage() {
    const params = useParams();
    const router = useRouter();
    const canvasId = params.id as string;
    
    const [status, setStatus] = useState<"loading" | "valid" | "expired">("loading");
    const [sessionData, setSessionData] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        if (!canvasId) return;
        
        // ZAP Gateway runs on :3900 locally. In prod this will route to the gateway domain.
        const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3900";
        
        const fetchCanvas = async () => {
            try {
                const res = await fetch(`${gatewayUrl}/api/canvas/${canvasId}`);
                
                // Strict 404/403 denotes expiry/invalid
                if (res.status === 404 || res.status === 403) {
                    setStatus("expired");
                    return;
                }
                
                if (!res.ok) throw new Error("Failed to load gateway response");
                
                const data = await res.json();
                setSessionData(data);
                setStatus("valid");
            } catch (err) {
                console.error("Failed to connect to Canvas Gateway", err);
                setStatus("expired");
            }
        };
        
        fetchCanvas();
    }, [canvasId]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen w-full items-center justify-center p-4 bg-layer-base">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (status === "expired") {
        return (
            <div className="flex min-h-screen w-full items-center justify-center p-4 bg-layer-base">
                <div className="flex flex-col items-center justify-center space-y-4 max-w-md text-center p-10 border border-error/20 rounded-[32px] bg-error/10 text-error shadow-sm animate-in fade-in zoom-in duration-300">
                    <span className="material-symbols-rounded text-6xl">gpp_bad</span>
                    <h2 className="text-2xl font-bold tracking-tight">Session Expired</h2>
                    <p className="text-sm opacity-80 leading-relaxed font-medium">
                        This Ephemeral Canvas link was automatically destroyed for security reasons, or it never existed.
                        <br/><br/>
                        Please ask your ZAP Swarm agent to generate a fresh link securely via your active group chat.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col p-4 md:p-12 lg:p-24 bg-layer-base">
            <EphemeralCanvasCard 
                sessionTitle="Active Visual Canvas"
                payload={sessionData?.payload as any}
                expiresAt={sessionData?.expiresAt as string}
                onExpireClick={() => router.push('/')}
            />
        </div>
    );
}
