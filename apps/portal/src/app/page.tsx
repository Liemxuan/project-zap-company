import React from 'react';
import { FoundationLogin } from 'zap-design/src/components/ui/FoundationLogin';
import { getSession, loginAction, getSystemLogsAction, getPortalMetricsAction } from '@olympus/zap-auth/src/actions';
import { SystemLogsTable } from 'zap-design/src/zap/organisms/system-logs-table';

export default async function PortalBlueprint() {
  const session = await getSession();

  if (!session) {
    return (
      <FoundationLogin 
        appName="HQ Master Portal"
        description="The central nervous system for ZAP operations. A heavy data-grid application restricted to Store Managers and regional executives."
        duties={[
            "View real-time global sales telemetry.",
            "Manage ZAP-HR employee rosters and shift assignments.",
            "Query ZAP-AI directly for predictive inventory models.",
            "Requires deep Level-3 SSO clearance."
        ]}
        onLogin={loginAction}
      />
    );
  }

  if (session.role !== 'SUPERADMIN' && session.role !== 'ADMIN' && session.role !== 'MANAGER') {
    return (
      <main className="flex min-h-screen items-center justify-center p-12 bg-layer-canvas text-foreground font-body">
        <div className="bg-destructive/10 border border-destructive/30 p-8 rounded-[length:var(--radius-card,8px)] max-w-lg text-center">
            <h1 className="text-3xl font-extrabold text-destructive mb-4 tracking-wider font-display text-transform-primary">ACCESS DENIED</h1>
            <p className="text-muted-foreground mb-6 font-body text-transform-secondary">Your current authorization level <code className="bg-destructive/20 px-2 py-1 rounded-[length:var(--radius-btn,4px)] text-destructive font-dev text-transform-tertiary">[{session.role}]</code> does not grant access to the HQ Master Portal.</p>
            <p className="text-sm text-muted-foreground border-t border-destructive/20 pt-4 font-body text-transform-secondary">Please contact ZAP-IT for role elevation or access Sector 4 POS / Kiosk terminals.</p>
        </div>
      </main>
    );
  }

  const [metrics, rawLogs] = await Promise.all([
    getPortalMetricsAction(),
    getSystemLogsAction()
  ]);

  const formattedLogs = rawLogs.map((log: any) => ({
      id: log.id,
      timestamp: log.createdAt.toISOString(),
      level: log.level.toLowerCase(),
      service: log.source,
      message: log.message,
      duration: "live",
      status: "200",
      tags: ["postgres", "telemetry"]
  }));

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-layer-canvas text-foreground font-body space-y-8">

      {/* HEADER SECTION */}
      <div className="w-full max-w-[1400px] flex justify-between items-end border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-theme-base tracking-tight font-display text-transform-primary">HQ Master Portal</h1>
            <p className="text-lg text-muted-foreground font-body text-transform-secondary">Welcome back, {session.name} <span className="bg-layer-panel text-foreground px-2 rounded-[length:var(--radius-btn,4px)] ml-2 text-xs font-display text-transform-primary">{session.role}</span></p>
          </div>
          <div className="text-right">
              <p className="text-sm text-muted-foreground font-dev text-transform-tertiary tracking-widest">System Status: ONLINE</p>
          </div>
      </div>

      {/* METRIC CARDS */}
      <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-layer-panel border border-border p-6 rounded-[length:var(--radius-card,8px)] flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground font-display text-transform-primary tracking-wider">Total Revenue</h3>
              <p className="text-3xl font-bold text-foreground mt-4 font-display text-transform-primary">${metrics.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-layer-panel border border-border p-6 rounded-[length:var(--radius-card,8px)] flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground font-display text-transform-primary tracking-wider">Active Pos Terminals</h3>
              <p className="text-3xl font-bold text-foreground mt-4 font-display text-transform-primary">{metrics.posLogs}</p>
          </div>
          <div className="bg-layer-panel border border-border p-6 rounded-[length:var(--radius-card,8px)] flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground font-display text-transform-primary tracking-wider">Registered Identities</h3>
              <p className="text-3xl font-bold text-foreground mt-4 font-display text-transform-primary">{metrics.totalUsers}</p>
          </div>
          <div className="bg-layer-panel border border-border p-6 rounded-[length:var(--radius-card,8px)] flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground font-display text-transform-primary tracking-wider">Intercepted Telemetry</h3>
              <p className="text-3xl font-bold text-foreground mt-4 font-display text-transform-primary">{metrics.totalLogs}</p>
          </div>
      </div>

      {/* SYSTEM LOGS TABLE */}
      <div className="w-full max-w-[1400px] mt-4">
        <h2 className="text-xl font-bold text-foreground mb-4 tracking-tight font-display text-transform-primary">Live Production Telemetry</h2>
        <SystemLogsTable initialLogs={formattedLogs} />
      </div>

    </main>
  );
}
