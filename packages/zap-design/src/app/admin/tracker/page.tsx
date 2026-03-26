import { PrismaClient } from '@prisma/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../genesis/molecules/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../genesis/molecules/table';

// Force dynamic rendering to ensure fresh db hits on every load for mission control
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function AdminTrackerPage() {
  const [tenants, personas, subscriptions, workspaces, interactions] = await Promise.all([
    prisma.tenants.findMany({ include: { _count: { select: { workspaces: true } } } }),
    prisma.ai_personas.findMany(),
    prisma.tenant_subscriptions.findMany({
      include: { tenants: true, ai_personas: true }
    }),
    prisma.workspaces.findMany({ include: { tenants: true, _count: { select: { users: true } } } }),
    prisma.user_interactions.findMany({
      include: {
        users: true,
        ai_personas: true
      },
      orderBy: { interaction_date: 'desc' },
      take: 50
    })
  ]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-layer-cover">
      <div className="mb-8 border-b pb-4" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
        <h1 className="text-4xl font-black tracking-tight font-display">Olympus Mission Control</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          Real-time Database Tracker for B2B SaaS Ecosystem
        </p>
      </div>

      <Tabs defaultValue="personas" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="personas">AI Personas ({personas.length})</TabsTrigger>
          <TabsTrigger value="tenants">Tenants ({tenants.length})</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions ({subscriptions.length})</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces ({workspaces.length})</TabsTrigger>
          <TabsTrigger value="interactions">Interactions ({interactions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="personas">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UCN Name</TableHead>
                  <TableHead>Sector Lock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>System Prompt ID</TableHead>
                  <TableHead>Started At (UTC)</TableHead>
                  <TableHead>Updated At (UTC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personas.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">{p.name}</TableCell>
                    <TableCell>{p.sector || 'UNIVERSAL'}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' }}>
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[150px]">{p.system_prompt || 'N/A'}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(p.created_at).toUTCString()}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(p.updated_at).toUTCString()}</TableCell>
                  </TableRow>
                ))}
                {personas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No personas active.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="tenants">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Slug</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Workspaces</TableHead>
                  <TableHead>Started At (UTC)</TableHead>
                  <TableHead>Updated At (UTC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.slug}</TableCell>
                    <TableCell>{t.sector || 'N/A'}</TableCell>
                    <TableCell>{t.plan}</TableCell>
                    <TableCell>{t._count.workspaces}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(t.created_at).toUTCString()}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(t.updated_at).toUTCString()}</TableCell>
                  </TableRow>
                ))}
                {tenants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No tenants found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Subscribed Persona</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started At (UTC)</TableHead>
                  <TableHead>Updated At (UTC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.tenants.slug}</TableCell>
                    <TableCell className="font-mono">{s.ai_personas.name}</TableCell>
                    <TableCell>{s.billing_cycle}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(s.created_at).toUTCString()}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(s.updated_at).toUTCString()}</TableCell>
                  </TableRow>
                ))}
                {subscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No subscriptions found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="workspaces">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workspace Code</TableHead>
                  <TableHead>Parent Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active Users</TableHead>
                  <TableHead>Started At (UTC)</TableHead>
                  <TableHead>Updated At (UTC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.id.substring(0,8)}</TableCell>
                    <TableCell>{w.tenants.slug}</TableCell>
                    <TableCell>{w.status}</TableCell>
                    <TableCell>{w._count.users}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(w.created_at).toUTCString()}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(w.updated_at).toUTCString()}</TableCell>
                  </TableRow>
                ))}
                {workspaces.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No workspaces found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="interactions">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User / Workspace</TableHead>
                  <TableHead>Persona</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Tokens Burned</TableHead>
                  <TableHead>Started At (UTC)</TableHead>
                  <TableHead>Updated At (UTC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interactions.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>User {i.users?.id.substring(0,8)}</TableCell>
                    <TableCell className="font-mono">{i.ai_personas.name}</TableCell>
                    <TableCell>System Log</TableCell>
                    <TableCell>{Number(i.tokens_used).toLocaleString()}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(i.created_at).toUTCString()}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(i.updated_at).toUTCString()}</TableCell>
                  </TableRow>
                ))}
                {interactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">No cognitive usage recorded.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
