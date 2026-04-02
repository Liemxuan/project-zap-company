import pg from 'pg';
const { Client } = pg;

const configs = [
    { host: '136.118.121.105', port: 5432, user: 'postgres', password: 'Pg@Secret2026!', database: 'catalog' },
    { host: '136.118.121.105', port: 5432, user: 'postgres', password: 'Pg@Secret2026!', database: 'postgres' }
];

async function run() {
    for (const config of configs) {
        console.log(`\nAttempting connection to database: ${config.database}...`);
        const client = new Client(config);
        try {
            await client.connect();
            console.log(`✅ Connected to ${config.database}`);

            // List tables with 'cate'
            const resTables = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name ILIKE '%cate%'
            `);
            console.log(`\nCategory tables found:`);
            console.table(resTables.rows);

            // Extract columns for 'product'
            const resCols = await client.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'product'
                ORDER BY ordinal_position
            `);
            console.log(`\n'product' table columns:`);
            console.table(resCols.rows);

            await client.end();
            return; // Stop after first successful connection
        } catch (err) {
            console.error(`❌ Failed to connect to ${config.database}: ${err.message}`);
        }
    }
}

run();
