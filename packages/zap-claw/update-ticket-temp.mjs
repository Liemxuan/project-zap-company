import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const SHARED = {
    zapLevel: 'L7',
    l6Layout: 'DashboardLayout (protected, sidebar + topbar)',
    l3Atoms: JSON.stringify(['Button (solid)', 'Button (outline)', 'Link', 'Container']),
    l2Primitives: JSON.stringify(['Fragment', 'Container']),
    l1Tokens: JSON.stringify(['--color-primary', '--color-foreground', '--color-secondary-foreground', '--color-muted-foreground']),
    assignedWorker: 'ZAP (G-102 Batch Audit)',
    status: 'DOM_RIPPED',
};

const pages = [
    // Billing (4)
    { url: '/account/billing/basic', content: 'AccountBasicContent', toolbar: 'Order History' },
    { url: '/account/billing/enterprise', content: 'AccountEnterpriseContent', toolbar: 'Order History' },
    { url: '/account/billing/history', content: 'AccountHistoryContent', toolbar: 'Billing' },
    { url: '/account/billing/plans', content: 'AccountPlansContent', toolbar: 'View Billing' },
    // Standalone (6)
    { url: '/account/activity', content: 'AccountActivityContent', toolbar: 'Privacy Settings' },
    { url: '/account/api-keys', content: 'AccountApiKeysContent', toolbar: 'Privacy Settings' },
    { url: '/account/appearance', content: 'AccountAppearanceContent', toolbar: 'Privacy Settings' },
    { url: '/account/integrations', content: 'AccountIntegrationsContent', toolbar: 'Add New Integration' },
    { url: '/account/invite-a-friend', content: 'AccountInviteAFriendContent', toolbar: 'Privacy Settings' },
    { url: '/account/notifications', content: 'AccountNotificationsContent', toolbar: 'Privacy Settings' },
    // Security (8)
    { url: '/account/security/allowed-ip-addresses', content: 'AccountAllowedIPContent', toolbar: 'Security' },
    { url: '/account/security/backup-and-recovery', content: 'AccountBackupRecoveryContent', toolbar: 'Security' },
    { url: '/account/security/current-sessions', content: 'AccountCurrentSessionsContent', toolbar: 'Security' },
    { url: '/account/security/device-management', content: 'AccountDeviceManagementContent', toolbar: 'Security' },
    { url: '/account/security/get-started', content: 'AccountSecurityGetStartedContent', toolbar: 'Security' },
    { url: '/account/security/overview', content: 'AccountSecurityOverviewContent', toolbar: 'Security' },
    { url: '/account/security/privacy-settings', content: 'AccountPrivacySettingsContent', toolbar: 'Security' },
    { url: '/account/security/security-log', content: 'AccountSecurityLogContent', toolbar: 'Security' },
    // Members (9)
    { url: '/account/members/import-members', content: 'AccountImportMembersContent', toolbar: 'Members' },
    { url: '/account/members/members-starter', content: 'AccountMembersStarterContent', toolbar: 'Members' },
    { url: '/account/members/permissions-check', content: 'AccountPermissionsCheckContent', toolbar: 'Members' },
    { url: '/account/members/permissions-toggle', content: 'AccountPermissionsToggleContent', toolbar: 'Members' },
    { url: '/account/members/roles', content: 'AccountRolesContent', toolbar: 'Members' },
    { url: '/account/members/team-info', content: 'AccountTeamInfoContent', toolbar: 'Members' },
    { url: '/account/members/team-members', content: 'AccountTeamMembersContent', toolbar: 'Members' },
    { url: '/account/members/team-starter', content: 'AccountTeamStarterContent', toolbar: 'Members' },
    { url: '/account/members/teams', content: 'AccountTeamsContent', toolbar: 'Members' },
];

async function main() {
    let count = 0;
    for (const p of pages) {
        await prisma.extractionTicket.update({
            where: { urlPath: p.url },
            data: {
                ...SHARED,
                l5Organisms: JSON.stringify(['PageNavbar', 'Toolbar', p.content]),
                l4Molecules: JSON.stringify([
                    'ToolbarHeading (title + desc)',
                    `ToolbarActions (${p.toolbar})`,
                ]),
            }
        });
        count++;
        console.log(`✓ ${p.url}`);
    }
    console.log(`\n[GENESIS BLAST] Account remaining ${count} pages — ALL DOM_RIPPED`);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
