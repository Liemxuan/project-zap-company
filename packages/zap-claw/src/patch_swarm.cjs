const fs = require('fs');
const serverFile = '/Users/zap/Workspace/olympus/packages/zap-claw/src/server.ts';
let content = fs.readFileSync(serverFile, 'utf8');

const oldSwarmEndpoint = `app.get('/api/admin/swarm', async (req, res) => {
    // Anthropic Swarm Telemetry
    res.json({
        status: 'ok',
        registry: {
            active_jobs: 0,
            tpm_burn_rate: 0,
            last_claude_uplink: new Date().toISOString()
        }
    });
});`;

const newSwarmEndpoint = `app.get('/api/admin/swarm', async (req, res) => {
    try {
        const { execSync } = require('child_process');
        let psOutput = '';
        try {
            psOutput = execSync('ps aux | grep node', { encoding: 'utf8' }).toString();
        } catch(e) {}
        
        const nativeAgents = [
            {
                id: 'agent-jerry',
                name: 'Antigravity',
                role: 'Runtime Builder',
                port: 0,
                status: psOutput.includes('jerry_server') ? 'online' : 'offline'
            },
            {
                id: 'agent-spike',
                name: 'Spike',
                role: 'Audit Engine',
                port: 0,
                status: psOutput.includes('spike_server') ? 'online' : 'offline'
            },
            {
                id: 'agent-athena',
                name: 'Athena',
                role: 'Data Logic',
                port: 0,
                status: psOutput.includes('athena_server') ? 'online' : 'offline'
            }
        ];

        res.json({
            status: 'ok',
            registry: {
                active_jobs: psOutput.includes('jerry_server') ? 1 : 0,
                tpm_burn_rate: 0,
                last_claude_uplink: new Date().toISOString()
            },
            nativeAgents
        });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});`;

content = content.replace(oldSwarmEndpoint, newSwarmEndpoint);
fs.writeFileSync(serverFile, content);
console.log("Swarm endpoint patched successfully.");
