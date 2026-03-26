import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const tickets = await p.extractionTicket.findMany({ select: { urlPath: true, l5Organisms: true, l4Molecules: true, l3Atoms: true, dependencies: true } });

const registry = { organisms: {}, molecules: {}, atoms: {} };

for (const t of tickets) {
    const orgs = JSON.parse(t.l5Organisms || '[]');
    const mols = JSON.parse(t.l4Molecules || '[]');
    const atoms = JSON.parse(t.l3Atoms || '[]');
    
    orgs.forEach(o => {
        const key = o.split(' ')[0].split('(')[0];
        if (!registry.organisms[key]) registry.organisms[key] = { count: 0, pages: [] };
        registry.organisms[key].count++;
        registry.organisms[key].pages.push(t.urlPath);
    });
    mols.forEach(m => {
        const key = m.split(' ')[0].split('(')[0];
        if (!registry.molecules[key]) registry.molecules[key] = { count: 0, pages: [] };
        registry.molecules[key].count++;
        registry.molecules[key].pages.push(t.urlPath);
    });
    atoms.forEach(a => {
        const key = a.split(' ')[0].split('(')[0];
        if (!registry.atoms[key]) registry.atoms[key] = { count: 0, pages: [] };
        registry.atoms[key].count++;
        registry.atoms[key].pages.push(t.urlPath);
    });
}

console.log('═══ MASTER COMPONENT REGISTRY ═══\n');
console.log(`L5 ORGANISMS (${Object.keys(registry.organisms).length} unique):`);
Object.entries(registry.organisms).sort((a,b) => b[1].count - a[1].count).forEach(([k,v]) => {
    console.log(`  ${String(v.count).padStart(3)}x  ${k}`);
});

console.log(`\nL4 MOLECULES (${Object.keys(registry.molecules).length} unique):`);
Object.entries(registry.molecules).sort((a,b) => b[1].count - a[1].count).forEach(([k,v]) => {
    console.log(`  ${String(v.count).padStart(3)}x  ${k}`);
});

console.log(`\nL3 ATOMS (${Object.keys(registry.atoms).length} unique):`);
Object.entries(registry.atoms).sort((a,b) => b[1].count - a[1].count).forEach(([k,v]) => {
    console.log(`  ${String(v.count).padStart(3)}x  ${k}`);
});

const total = Object.keys(registry.organisms).length + Object.keys(registry.molecules).length + Object.keys(registry.atoms).length;
console.log(`\n═══ TOTAL UNIQUE COMPONENTS: ${total} ═══`);

await p.$disconnect();
