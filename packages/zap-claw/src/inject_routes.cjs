const fs = require('fs');
const path = require('path');

const serverFile = '/Users/zap/Workspace/olympus/packages/zap-claw/src/server.ts';
let content = fs.readFileSync(serverFile, 'utf8');

if (!content.includes('/api/admin/heartbeat')) {
    const patch = `
// ==========================================
// OLY-SWARM-002: Swarm Telemetry & HUD Endpoints
// ==========================================
app.get('/api/admin/heartbeat', async (req, res) => {
    try {
        const { execSync } = require('child_process');
        let dockerStatus = [];
        let daemonAlive = false;
        try {
            // Attempt to poll docker using the full path
            const dockerPath = '/Applications/Docker.app/Contents/Resources/bin/docker';
            const raw = execSync(\`\${dockerPath} ps -a --format "{{json .}}"\`, {stdio: 'pipe'}).toString();
            dockerStatus = raw.split('\\n').filter(Boolean).map(JSON.parse);
            daemonAlive = true;
        } catch (e) {
            console.error("[Docker Poll] Daemon is off or path is incorrect.");
        }
        res.json({ status: 'ok', timestamp: new Date().toISOString(), agents: dockerStatus, daemonAlive });
    } catch (error) {
        res.status(500).json({ error: 'Heartbeat failed', details: error.message });
    }
});

app.get('/api/admin/swarm', async (req, res) => {
    // Anthropic Swarm Telemetry
    res.json({
        status: 'ok',
        registry: {
            active_jobs: 0,
            tpm_burn_rate: 0,
            last_claude_uplink: new Date().toISOString()
        }
    });
});
`;

    content = content.replace('const httpServer = app.listen', patch + '\nconst httpServer = app.listen');
    fs.writeFileSync(serverFile, content);
    console.log("Injected routes successfully.");
} else {
    console.log("Routes already exist.");
}
