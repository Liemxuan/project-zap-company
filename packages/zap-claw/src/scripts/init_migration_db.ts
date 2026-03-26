import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../migration_tracking.db');
const db = new Database(dbPath, { verbose: console.log });

db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_path TEXT UNIQUE NOT NULL,
        final_path TEXT,
        category TEXT,
        applied_fonts BOOLEAN DEFAULT 0,
        applied_colors BOOLEAN DEFAULT 0,
        applied_icons BOOLEAN DEFAULT 0,
        applied_elevation BOOLEAN DEFAULT 0,
        applied_spacing BOOLEAN DEFAULT 0,
        applied_containment BOOLEAN DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

const insertPage = db.prepare(`
    INSERT INTO pages (
        original_path, final_path, category, 
        applied_fonts, applied_colors, applied_icons, 
        applied_elevation, applied_spacing, applied_containment
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(original_path) DO UPDATE SET
        updated_at = CURRENT_TIMESTAMP
`);

const initialPages = [
    // METRO Gateway (The target structure)
    { original_path: 'src/app/debug/metro/page.tsx', final_path: 'src/app/debug/metro/page.tsx', category: 'Gateway', fonts: 1, colors: 1, icons: 0, elevation: 0, spacing: 0, containment: 1 },
    { original_path: 'src/app/debug/metro/colors/page.tsx', final_path: 'src/app/debug/metro/colors/page.tsx', category: 'Tokens', fonts: 1, colors: 1, icons: 0, elevation: 0, spacing: 0, containment: 1 },
    { original_path: 'src/app/debug/metro/typography/page.tsx', final_path: 'src/app/debug/metro/typography/page.tsx', category: 'Tokens', fonts: 1, colors: 1, icons: 0, elevation: 0, spacing: 0, containment: 1 },
    { original_path: 'src/app/debug/metro/icons/page.tsx', final_path: 'src/app/debug/metro/icons/page.tsx', category: 'Primitives', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 1 },
    { original_path: 'src/app/debug/metro/login/page.tsx', final_path: 'src/app/debug/metro/login/page.tsx', category: 'Auth', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/metro/lab/assets/page.tsx', final_path: 'src/app/debug/metro/lab/assets/page.tsx', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/metro/lab/swarm/page.tsx', final_path: 'src/app/debug/metro/lab/swarm/page.tsx', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },

    // ZAP Main System (Legacy)
    { original_path: 'src/app/debug/zap/atoms/colors/page.tsx', final_path: 'src/app/debug/metro/colors/page.tsx', category: 'Tokens (Legacy)', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/atoms/typography/page.tsx', final_path: 'src/app/debug/metro/typography/page.tsx', category: 'Tokens (Legacy)', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/atoms/icons/page.tsx', final_path: 'src/app/debug/metro/icons/page.tsx', category: 'Primitives (Legacy)', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/atoms/interactive/page.tsx', final_path: 'src/app/debug/metro/interactive/page.tsx', category: 'Primitives', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/atoms/layout/page.tsx', final_path: 'src/app/debug/metro/layout/page.tsx', category: 'Primitives', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/atoms/layout-layers/page.tsx', final_path: 'src/app/debug/metro/layout-layers/page.tsx', category: 'Primitives', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/atoms/status/page.tsx', final_path: 'src/app/debug/metro/status/page.tsx', category: 'Primitives', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },

    { original_path: 'src/app/debug/zap/molecules/email/page.tsx', final_path: 'src/app/debug/metro/email/page.tsx', category: 'Molecules', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/molecules/inputs/page.tsx', final_path: 'src/app/debug/metro/inputs/page.tsx', category: 'Molecules', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/molecules/navigation/page.tsx', final_path: 'src/app/debug/metro/navigation/page.tsx', category: 'Molecules', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },

    { original_path: 'src/app/debug/zap/m3-preview/page.tsx', final_path: 'src/app/debug/metro/m3-preview/page.tsx', category: 'Preview', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/mission-control/page.tsx', final_path: 'src/app/debug/metro/mission-control/page.tsx', category: 'Hub', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/swarm/page.tsx', final_path: 'src/app/debug/metro/swarm/page.tsx', category: 'Tools', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },

    // ZAP Labs / Experiemental
    { original_path: 'src/app/debug/zap/labs/agents/page.tsx', final_path: '', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/labs/stitch-brand-test/page.tsx', final_path: '', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/labs/stitch-dropzone/page.tsx', final_path: '', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/labs/stitch-playful-test/page.tsx', final_path: '', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/labs/stitch-test/page.tsx', final_path: '', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/labs/theme-remix/page.tsx', final_path: '', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/zap/labs/theme-wix/page.tsx', final_path: '', category: 'Lab', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },
    { original_path: 'src/app/debug/assets/page.tsx', final_path: 'src/app/debug/metro/assets/page.tsx', category: 'Assets', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 },

    // Root
    { original_path: 'src/app/page.tsx', final_path: 'src/app/page.tsx', category: 'Root', fonts: 0, colors: 0, icons: 0, elevation: 0, spacing: 0, containment: 0 }
];

db.transaction(() => {
    for (const page of initialPages) {
        insertPage.run(
            page.original_path,
            page.final_path,
            page.category,
            page.fonts ? 1 : 0,
            page.colors ? 1 : 0,
            page.icons ? 1 : 0,
            page.elevation ? 1 : 0,
            page.spacing ? 1 : 0,
            page.containment ? 1 : 0
        );
    }
})();

console.log('Successfully initialized migration_tracking.db and populated it with 28 tracked pages.');
