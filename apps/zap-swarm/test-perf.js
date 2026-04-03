const http = require('http');

const pages = [
  { path: '/', name: 'Swarm Dashboard', features: ['Core Telemetry', 'Docker Agents', 'ZSS Intercepts', 'Heartbeat', 'Recent Execution Traces'] },
  { path: '/agents', name: 'Agents (Fleet)', features: ['Active Agents Registry', 'Resource Metrics', 'Role Tags', 'Live Status', 'Titan Memory Hooks'] },
  { path: '/channels', name: 'Channels', features: ['OmniRouter Channels', 'Sub-Agent Routing', 'Matrix Connectivity'] },
  { path: '/sessions', name: 'Active Sessions', features: ['Session Registry', 'Conversational State Tracker', 'Artifact Pipeline'] },
  { path: '/cost', name: 'Cost Intelligence', features: ['Fleet-tier Spend Filtering', 'Prompt/Completion Token Analytics', 'Model Pricing Logs'] },
  { path: '/history', name: 'Execution Traces', features: ['Historical Log Search', 'Trace Output', 'Artifact Diff Viewer'] },
  { path: '/security', name: 'Security & Ops', features: ['ZSS Protocols', 'Intercept Toggles', 'Payload Auditing'] },
  { path: '/skills', name: 'Skills & Deerflow', features: ['MCP Tools Matrix', 'Available Tool Endpoints', 'Sandbox Configs'] }
];

async function measureSpeed(page) {
  return new Promise((resolve) => {
    const start = performance.now();
    http.get(`http://localhost:3500${page.path}`, (res) => {
      res.on('data', () => {}); // Consume stream
      res.on('end', () => {
        const time = performance.now() - start;
        console.log(`| **${page.name}** | ${page.features.join(', ')} | ${time.toFixed(2)} ms |`);
        resolve(time);
      });
    }).on('error', (err) => {
      console.log(`| **${page.name}** | ERROR: ${err.message} | N/A |`);
      resolve(0);
    });
  });
}

async function run() {
  console.log('| Name of the Page | Features | Speed load to be completely loaded |');
  console.log('| :--- | :--- | :--- |');
  // Send sequential requests
  for (const page of pages) {
    await measureSpeed(page);
  }
}
run();
