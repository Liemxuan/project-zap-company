import React from 'react';
import { FoundationLogin } from 'zap-design/src/components/ui/FoundationLogin';
import { cookies } from 'next/headers';
import { loginAction } from '@olympus/zap-auth/src/actions';
import { DynamicMermaidBox } from 'zap-design/src/components/ui/DynamicMermaidBox';

const kioskChart = `
flowchart TD
  Customer(["👨‍👩‍👦 Customer"])
  Kiosk["🖥️ Kiosk Screen (Here)"]
  Ops["📦 ZAP-Ops (Logic)"]
  POS["💳 Cashier/POS"]

  Customer -->|1. Touches Screen| Kiosk
  Kiosk -->|2. Builds digital cart| Ops
  Kiosk -->|3. Pays via Terminal| Ops
  Ops -.->|4. Sends Ticket to| POS
`;

export default async function KioskBlueprint() {
  const cookieStore = await cookies();
  const session = cookieStore.get('zap_session');

  if (!session) {
    return (
      <FoundationLogin 
        appName="Customer Kiosk Screen"
        description="A massive, high-visibility touch interface stationed in the lobby. Designed for pure speed, fluid animations, and zero training overhead."
        duties={[
            "Display visual menus and promotional upsells to guests.",
            "Handle local cart state without blocking the cloud.",
            "Bridge local payment terminals (Card Readers) securely.",
            "Issue randomized order IDs for pick-up queues."
        ]}
        onLogin={loginAction}
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-12 bg-layer-canvas text-foreground font-body text-transform-secondary">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-theme-base font-display text-transform-primary">Self-Service Kiosk</h1>
            <p className="text-xl text-muted-foreground">Endpoint: <code className="bg-surface-variant px-2 py-1 rounded">localhost:3002</code></p>
          </div>

          <div className="bg-layer-panel border border-border p-6 rounded-[length:var(--radius-card,8px)]">
            <h3 className="text-lg font-bold mb-3">Newbie Instructions:</h3>
            <ul className="list-disc pl-5 space-y-2 text-on-surface">
              <li>This runs on the large touch displays. Pure customer-facing UI.</li>
              <li>Focus entirely on beautiful, large <code>zap-design</code> components.</li>
              <li>Wait for the customer to swipe their card, then pass the auth token to <code>zap-ops</code>.</li>
            </ul>
          </div>
        </div>

        <div className="bg-layer-panel border border-border rounded-[length:var(--radius-card,8px)] p-8 flex flex-col items-center justify-center shadow-[var(--elevation-4,0_8px_24px_rgba(0,0,0,0.15))]">
          <h2 className="text-lg font-bold mb-6 tracking-widest uppercase text-muted-foreground">Operation Flowchart</h2>
          <DynamicMermaidBox chart={kioskChart} />
        </div>

      </div>
    </main>
  );
}
