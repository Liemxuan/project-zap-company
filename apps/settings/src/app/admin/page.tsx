import { PrismaClient } from '@prisma/client';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'zap-design/src/genesis/molecules/table';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export default async function TenantAdminDashboard() {
  const workspaces = await prisma.workspaces.findMany({
    include: {
      tenants: true,
      _count: {
        select: { users: true }
      }
    },
    take: 10
  });

  // Pulling 10 most recent user interactions logged in this Tenant
  const interactions = await prisma.user_interactions.findMany({
    take: 10,
    orderBy: {
      interaction_date: 'desc'
    },
    include: {
      users: true,
      ai_personas: true
    }
  });

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
      <div className="mb-8 border-b pb-4 border-[var(--md-sys-color-outline-variant)]">
        <h1 className="text-3xl font-black tracking-tight font-display text-[var(--md-sys-color-on-surface)]">
          Tenant Settings & Workspaces
        </h1>
        <p className="text-sm mt-1 text-[var(--md-sys-color-on-surface-variant)]">
          Administer active workspaces, AI subscriptions, and monitor personnel utilization globally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] shadow-sm">
           <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Active Workspaces</h3>
           <p className="text-4xl mt-2 font-bold text-[var(--md-sys-color-primary)]">{workspaces.length}</p>
        </div>
        <div className="p-6 rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] shadow-sm">
           <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Registered Humans (Users)</h3>
           <p className="text-4xl mt-2 font-bold text-[var(--md-sys-color-primary)]">{workspaces.reduce((acc, ws) => acc + ws._count.users, 0)}</p>
        </div>
        <div className="p-6 rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] shadow-sm">
           <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Total LLM Interactions</h3>
           <p className="text-4xl mt-2 font-bold text-[var(--md-sys-color-primary)]">{interactions.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-[var(--md-sys-color-on-surface)]">Assigned Workspaces in Sector</h2>
      <div className="rounded-md border border-[var(--md-sys-color-outline-variant)] mb-10 overflow-hidden bg-[var(--md-sys-color-surface-container-lowest)]">
        <Table>
          <TableHeader className="bg-[var(--md-sys-color-surface-container)]">
            <TableRow className="border-b-[var(--md-sys-color-outline-variant)]">
              <TableHead className="font-semibold text-[var(--md-sys-color-on-surface)]">Office ID</TableHead>
              <TableHead className="font-semibold text-[var(--md-sys-color-on-surface)]">Name</TableHead>
              <TableHead className="font-semibold text-[var(--md-sys-color-on-surface)]">Tenant Domain</TableHead>
              <TableHead className="font-semibold text-[var(--md-sys-color-on-surface)]">Status</TableHead>
              <TableHead className="text-right font-semibold text-[var(--md-sys-color-on-surface)]">UTC Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces.map((ws) => (
              <TableRow key={ws.id} className="border-b-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors">
                <TableCell className="font-medium">{ws.id.substring(0, 8)}</TableCell>
                <TableCell>{ws.name}</TableCell>
                <TableCell>{ws.tenants.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {ws.status}
                  </span>
                </TableCell>
                {/* PROVING STRICT UTC COMPLIANCE DISPLAY */}
                <TableCell className="text-right font-mono text-xs text-[var(--md-sys-color-on-surface-variant)]">
                   {ws.created_at.toISOString()} 
                </TableCell>
              </TableRow>
            ))}
            {workspaces.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-[var(--md-sys-color-on-surface-variant)]">
                  No active workspaces provisioned yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="ghost" className="text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)]">Sync Metrics</Button>
        <Button variant="primary" className="bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:opacity-90">Provision New Workspace</Button>
      </div>
    </div>
  );
}
