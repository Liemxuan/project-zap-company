import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PAGES = [
    // AUTH
    { path: '/change-password', group: 'Auth' },
    { path: '/reset-password', group: 'Auth' },
    { path: '/signin', group: 'Auth' },
    { path: '/signup', group: 'Auth' },
    { path: '/verify-email', group: 'Auth' },
    { path: '/auth/account-deactivated', group: 'Auth' },
    { path: '/auth/get-started', group: 'Auth' },
    { path: '/auth/welcome-message', group: 'Auth' },

    // ACCOUNT
    { path: '/account/activity', group: 'Account' },
    { path: '/account/api-keys', group: 'Account' },
    { path: '/account/appearance', group: 'Account' },
    { path: '/account/billing/basic', group: 'Account/Billing' },
    { path: '/account/billing/enterprise', group: 'Account/Billing' },
    { path: '/account/billing/history', group: 'Account/Billing' },
    { path: '/account/billing/plans', group: 'Account/Billing' },
    { path: '/account/home/company-profile', group: 'Account/Home' },
    { path: '/account/home/get-started', group: 'Account/Home' },
    { path: '/account/home/settings-enterprise', group: 'Account/Home' },
    { path: '/account/home/settings-modal', group: 'Account/Home' },
    { path: '/account/home/settings-plain', group: 'Account/Home' },
    { path: '/account/home/settings-sidebar', group: 'Account/Home' },
    { path: '/account/home/user-profile', group: 'Account/Home' },
    { path: '/account/integrations', group: 'Account' },
    { path: '/account/invite-a-friend', group: 'Account' },
    { path: '/account/members/import-members', group: 'Account/Members' },
    { path: '/account/members/members-starter', group: 'Account/Members' },
    { path: '/account/members/permissions-check', group: 'Account/Members' },
    { path: '/account/members/permissions-toggle', group: 'Account/Members' },
    { path: '/account/members/roles', group: 'Account/Members' },
    { path: '/account/members/team-info', group: 'Account/Members' },
    { path: '/account/members/team-members', group: 'Account/Members' },
    { path: '/account/members/team-starter', group: 'Account/Members' },
    { path: '/account/members/teams', group: 'Account/Members' },
    { path: '/account/notifications', group: 'Account' },
    { path: '/account/security/allowed-ip-addresses', group: 'Account/Security' },
    { path: '/account/security/backup-and-recovery', group: 'Account/Security' },
    { path: '/account/security/current-sessions', group: 'Account/Security' },
    { path: '/account/security/device-management', group: 'Account/Security' },
    { path: '/account/security/get-started', group: 'Account/Security' },
    { path: '/account/security/overview', group: 'Account/Security' },
    { path: '/account/security/privacy-settings', group: 'Account/Security' },
    { path: '/account/security/security-log', group: 'Account/Security' },

    // NETWORK
    { path: '/network/get-started', group: 'Network' },
    { path: '/network/user-cards/author', group: 'Network/UserCards' },
    { path: '/network/user-cards/mini-cards', group: 'Network/UserCards' },
    { path: '/network/user-cards/nft', group: 'Network/UserCards' },
    { path: '/network/user-cards/social', group: 'Network/UserCards' },
    { path: '/network/user-cards/team-crew', group: 'Network/UserCards' },
    { path: '/network/user-table/app-roster', group: 'Network/UserTable' },
    { path: '/network/user-table/market-authors', group: 'Network/UserTable' },
    { path: '/network/user-table/saas-users', group: 'Network/UserTable' },
    { path: '/network/user-table/store-clients', group: 'Network/UserTable' },
    { path: '/network/user-table/team-crew', group: 'Network/UserTable' },
    { path: '/network/user-table/visitors', group: 'Network/UserTable' },

    // PUBLIC PROFILE
    { path: '/public-profile/activity', group: 'PublicProfile' },
    { path: '/public-profile/campaigns/card', group: 'PublicProfile/Campaigns' },
    { path: '/public-profile/campaigns/list', group: 'PublicProfile/Campaigns' },
    { path: '/public-profile/empty', group: 'PublicProfile' },
    { path: '/public-profile/network', group: 'PublicProfile' },
    { path: '/public-profile/profiles/blogger', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/company', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/creator', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/crm', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/default', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/feeds', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/gamer', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/modal', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/nft', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/profiles/plain', group: 'PublicProfile/Profiles' },
    { path: '/public-profile/projects/2-columns', group: 'PublicProfile/Projects' },
    { path: '/public-profile/projects/3-columns', group: 'PublicProfile/Projects' },
    { path: '/public-profile/teams', group: 'PublicProfile' },
    { path: '/public-profile/works', group: 'PublicProfile' },

    // STORE ADMIN
    { path: '/store-admin/dashboard', group: 'StoreAdmin' },
    { path: '/store-admin/inventory/all-products', group: 'StoreAdmin/Inventory' },

    // STORE CLIENT
    { path: '/store-client/cart', group: 'StoreClient' },
    { path: '/store-client/checkout/order-placed', group: 'StoreClient/Checkout' },
    { path: '/store-client/checkout/order-summary', group: 'StoreClient/Checkout' },
    { path: '/store-client/checkout/payment-method', group: 'StoreClient/Checkout' },
    { path: '/store-client/checkout/shipping-info', group: 'StoreClient/Checkout' },
    { path: '/store-client/home', group: 'StoreClient' },
    { path: '/store-client/my-orders', group: 'StoreClient' },
    { path: '/store-client/order-receipt', group: 'StoreClient' },
    { path: '/store-client/product-details', group: 'StoreClient' },
    { path: '/store-client/search-results-grid', group: 'StoreClient' },
    { path: '/store-client/search-results-list', group: 'StoreClient' },
    { path: '/store-client/wishlist', group: 'StoreClient' },

    // USER MANAGEMENT
    { path: '/user-management/account', group: 'UserManagement' },
    { path: '/user-management/account/security', group: 'UserManagement' },
    { path: '/user-management/permissions', group: 'UserManagement' },
    { path: '/user-management/roles', group: 'UserManagement' },
    { path: '/user-management/settings', group: 'UserManagement' },
    { path: '/user-management/settings/notifications', group: 'UserManagement' },
    { path: '/user-management/settings/social', group: 'UserManagement' },
    { path: '/user-management/users', group: 'UserManagement' },
    { path: '/user-management/users/[id]', group: 'UserManagement' },

    // MISC / LAYOUT
    { path: '/dark-sidebar', group: 'Layout' },
    { path: '/i18n-test', group: 'Misc' },
];

async function main() {
    console.log(`[GENESIS BLAST] Seeding ${PAGES.length} Metronic pages into Swarm DB...`);
    let created = 0;
    let failed = 0;

    for (const page of PAGES) {
        try {
            await prisma.extractionTicket.upsert({
                where: { urlPath: page.path },
                update: { group: page.group },
                create: {
                    urlPath: page.path,
                    group: page.group,
                    status: 'PENDING',
                    zapLevel: 'L7',
                    assignedWorker: null,
                    l5Organisms: '[]',
                    l4Molecules: '[]',
                    l3Atoms: '[]',
                    l2Primitives: '[]',
                    l1Tokens: '[]',
                }
            });
            created++;
            process.stdout.write(`  ✓ ${page.path}\n`);
        } catch (err) {
            process.stdout.write(`  ✗ ${page.path} — ${err.message}\n`);
            failed++;
        }
    }

    console.log(`\n[GENESIS BLAST COMPLETE] ${created} upserted, ${failed} failed.`);
    console.log(`Dashboard: http://localhost:3002/debug/metro/lab/swarm`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
