import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MODULES = [
    { core: 'STAFF',   desc: 'Generic Core HR & Staffing', fnb: 'Staffing & Scheduling', hotel: 'Staff & Housekeeping', retail: 'Associate Management', prof: 'Talent Management', beauty: 'Specialist Management' },
    { core: 'PAY',     desc: 'Generic Payroll & Compensation', fnb: 'Payroll & Tips', hotel: 'Payroll', retail: 'Payroll', prof: 'Billing & Payroll', beauty: 'Payroll & Commissions' },
    { core: 'HIRE',    desc: 'Generic Applicant Tracking Tracker (ATS)', fnb: 'BOH & FOH Recruiting', hotel: 'Seasonal Hiring', retail: 'Volume Recruiting', prof: 'Talent Acquisition', beauty: 'Talent Sourcing' },
    { core: 'LEARN',   desc: 'Generic Learning Management System (LMS)', fnb: 'Menu & Safety Training', hotel: 'Service Standards', retail: 'Product & Sales Training', prof: 'Certifications & CLE', beauty: 'Technique Training' },
    { core: 'POS',     desc: 'Generic Point of Sale / Sales', fnb: 'POS & Menu Ordering', hotel: 'PMS & Folio', retail: 'Omni-Channel POS', prof: 'Client Proposals & Invoicing', beauty: 'Booking & POS' },
    { core: 'BOOK',    desc: 'Generic Booking & Capacity', fnb: 'Table Reservations', hotel: 'Room & Block Booking', retail: 'Appointment & Stylings', prof: 'Client Consultations', beauty: 'Salon / Spa Appointments' },
    { core: 'CRM',     desc: 'Generic CRM & Client Data', fnb: 'Diner Profiles', hotel: 'Guest Intelligence', retail: 'Customer 360', prof: 'Client Relations', beauty: 'Client Preferences' },
    { core: 'MARKET',  desc: 'Generic Marketing & Loyalty', fnb: 'Loyalty & Promos', hotel: 'Loyalty & Rewards', retail: 'Loyalty Programs', prof: 'Brand & Outreach', beauty: 'Client Retention' },
    { core: 'STOCK',   desc: 'Generic Inventory & Assets', fnb: 'Ingredient & Prep', hotel: 'Amenities & Linens', retail: 'Warehouse & Floor Stock', prof: 'Resource & Asset Mgmt', beauty: 'Retail & Pro Products' },
    { core: 'SOURCE',  desc: 'Generic Procurement', fnb: 'Supplier Management', hotel: 'Vendor Management', retail: 'Sourcing & Suppliers', prof: 'Contractor Management', beauty: 'Supplier Management' },
    { core: 'LEDGER',  desc: 'Generic Accounting & Ledger', fnb: 'Daily Financials & Tips', hotel: 'Night Audit', retail: 'Daily Sales & Ledger', prof: 'Financial Accounting', beauty: 'Daily Close & Cash' },
    { core: 'DATA',    desc: 'Generic Analytics & BI', fnb: 'Menu Engineering', hotel: 'RevPAR Analytics', retail: 'Sales & Margin BI', prof: 'Utilization Analytics', beauty: 'Service Utilization' },
    { core: 'OPS',     desc: 'Generic Inside Operations', fnb: 'Kitchen Display (KDS)', hotel: 'Front Desk / Concierge', retail: 'Fulfillment Center', prof: 'Case / Project Mgmt', beauty: 'Floor Management' },
    { core: 'FIELD',   desc: 'Generic Field Operations', fnb: 'Delivery & Dispatch', hotel: 'Valet & Transport', retail: 'Last-Mile Delivery', prof: 'Field Service Mgmt', beauty: 'Mobile / Event Services' },
    { core: 'FACILITY',desc: 'Generic Facilities Maintenance', fnb: 'Appliance Maintenance', hotel: 'Property Management', retail: 'Store Maintenance', prof: 'Office Management', beauty: 'Equipment Maintenance' },
    { core: 'TALK',    desc: 'Generic Internal Comms', fnb: 'Shift Notes & Logs', hotel: 'Shift Huddles', retail: 'Store Communications', prof: 'Practice Communications', beauty: 'Daily Briefings' },
    { core: 'REVIEW',  desc: 'Generic Performance Mgmt', fnb: 'Staff Evaluations', hotel: 'Staff Appraisals', retail: 'Associate Reviews', prof: 'Partner Evaluations', beauty: 'Stylist Evaluations' },
    { core: 'SUPPORT', desc: 'Generic Customer Support', fnb: 'Diner Feedback', hotel: 'Guest Services', retail: 'Customer Support', prof: 'Client Support', beauty: 'Client Support' },
    { core: 'COMPLY',  desc: 'Generic Legal & Compliance', fnb: 'Food Safety & Health', hotel: 'Health & Safety', retail: 'Loss Prevention', prof: 'Risk Management', beauty: 'Licensure & Sanitations' }
];

async function main() {
    console.log(`[SEED] Purging existing system modules and localizations...`);
    await prisma.module_localizations.deleteMany();
    await prisma.system_modules.deleteMany();

    console.log(`[SEED] Seeding ${MODULES.length} Core System Modules...`);
    let created = 0;

    for (const mod of MODULES) {
        // Create the core module
        const systemModule = await prisma.system_modules.create({
            data: {
                core_identifier: mod.core,
                description: mod.desc,
                status: 'active',
            }
        });

        // Insert localizations for all 5 sectors (English audience: tenant)
        await prisma.module_localizations.createMany({
            data: [
                { module_id: systemModule.id, industry_sector: 'FOOD_AND_BEVERAGE', locale: 'en', audience_type: 'tenant', display_label: mod.fnb },
                { module_id: systemModule.id, industry_sector: 'HOSPITALITY', locale: 'en', audience_type: 'tenant', display_label: mod.hotel },
                { module_id: systemModule.id, industry_sector: 'COMMERCE', locale: 'en', audience_type: 'tenant', display_label: mod.retail },
                { module_id: systemModule.id, industry_sector: 'PROFESSIONAL_SERVICES', locale: 'en', audience_type: 'tenant', display_label: mod.prof },
                { module_id: systemModule.id, industry_sector: 'BEAUTY_AND_WELLNESS', locale: 'en', audience_type: 'tenant', display_label: mod.beauty },
            ]
        });

        created++;
        process.stdout.write(`  ✓ ${mod.core}\n`);
    }

    console.log(`\n[SEED COMPLETE] ${created} core modules and 95 localizations successfully primed.`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
