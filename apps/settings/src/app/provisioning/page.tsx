import { PrismaClient } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'zap-design/src/genesis/molecules/table';

// Force dynamic rendering to ensure fresh db hits on every load for mission control
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function AdminProvisioningPage() {
  const systemAdmins = await prisma.system_admins.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-layer-cover">
      <div className="mb-8 border-b pb-4 flex justify-between items-end border-outline-variant">
        <div>
          <h1 className="text-4xl font-black tracking-tight font-display">System Directory</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            OLY-003 Level 1: System Admin & Agent Provisioning
          </p>
        </div>
        <button className="px-4 py-2 rounded-md font-medium text-sm transition-colors bg-primary text-on-primary">
          Provision User
        </button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started At (UTC)</TableHead>
              <TableHead>Updated At (UTC)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systemAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">
                  {admin.username}
                  {admin.display_name && (
                    <span className="block text-xs text-muted-foreground">{admin.display_name}</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-mono bg-secondary-container text-on-secondary-container">
                    {admin.role}
                  </span>
                </TableCell>
                <TableCell>L{admin.level}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${admin.status === 'active' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}`}>
                    {admin.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs whitespace-nowrap">{new Date(admin.created_at).toUTCString()}</TableCell>
                <TableCell className="text-xs whitespace-nowrap">{new Date(admin.updated_at).toUTCString()}</TableCell>
                <TableCell className="text-right">
                  <button className="text-sm font-medium hover:underline text-primary">
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {systemAdmins.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No System Admins found. Ensure the Bootstrap Script hydrated the root user.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
