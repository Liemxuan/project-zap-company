import React from 'react';
import { FoundationLogin } from 'zap-design/src/components/ui/FoundationLogin';
import { cookies } from 'next/headers';
import { loginAction } from '@olympus/zap-auth/src/actions';
import { DynamicMermaidBox } from 'zap-design/src/components/ui/DynamicMermaidBox';

const posChart = `
flowchart TD
  Employee(["🧑‍💼 Newbie (You)"])
  POS["💳 POS Terminal (Here)"]
  Auth["🛡️ ZAP-Auth (SSO)"]
  Ops["📦 ZAP-Ops (Business Logic)"]
  DB["💾 ZAP-DB (The Vault)"]

  Employee -->|1. Enters PIN Code| POS
  POS -->|2. Validates Secure Login| Auth
  POS -->|3. Punches in Order| Ops
  Ops -->|4. Saves Transaction| DB
`;

export default async function POSBlueprint() {
  const cookieStore = await cookies();
  const session = cookieStore.get('zap_session');

  if (!session) {
    return (
      <FoundationLogin 
        appName="Point of Sale (POS) Terminal"
        description="A high-speed, touch-optimized interface for physical store endpoints. This system handles real-time basket creation, checkout workflows, and hardware integration."
        duties={[
            "Process physical transactions securely and directly via local hardware.",
            "Send normalized basket payloads to the unified ZAP-Ops layer.",
            "Display visual receipt feedback without exposing raw database states."
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
            <h1 className="text-4xl font-extrabold mb-2 text-theme-base font-display text-transform-primary">POS Terminal</h1>
            <p className="text-xl text-muted-foreground">Endpoint: <code className="bg-surface-variant px-2 py-1 rounded">localhost:3001</code></p>
          </div>
          <div className="bg-layer-panel border border-border p-6 rounded-[length:var(--radius-card,8px)]">
            <h3 className="text-lg font-bold mb-3">Newbie Instructions:</h3>
            <ul className="list-disc pl-5 space-y-2 text-on-surface">
              <li>This app will run on the iPads at the physical store.</li>
              <li>You will build the order grid and number pad here.</li>
              <li>Do <b>NOT</b> query the database directly. Send the basket array to <code>zap-ops</code>.</li>
            </ul>
          </div>
        </div>
        <div className="bg-layer-panel border border-border rounded-[length:var(--radius-card,8px)] p-8 flex flex-col items-center justify-center shadow-[var(--elevation-4,0_8px_24px_rgba(0,0,0,0.15))]">
          <h2 className="text-lg font-bold mb-6 tracking-widest uppercase text-muted-foreground">Operation Flowchart</h2>
          <DynamicMermaidBox chart={posChart} />
        </div>
      </div>
    </main>
  );
}
