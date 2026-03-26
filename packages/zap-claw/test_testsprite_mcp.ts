import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

async function testTestSpriteMcp() {
  console.log("🚀 Testing TestSprite MCP Initialization (Dry Run)...");
  
  try {
    // We run the mcp server with the --help flag just to ensure it downloads, installs, and executes
    // without crashing, effectively validating the NPM package is functional on this machine.
    const { stdout, stderr } = await execPromise('npx -y @testsprite/testsprite-mcp@latest --help');
    
    console.log("✅ MCP Executable successfully invoked.");
    if (stdout) console.log(`[STDOUT]\n${stdout.substring(0, 300)}...`);
    
    // Check if the output contains typical MCP or TestSprite signatures
    if (stdout.toLowerCase().includes('testsprite') || stdout.toLowerCase().includes('mcp')) {
        console.log("\n✅ TestSprite MCP package downloaded and verified.");
    } else {
        console.warn("\n⚠️ Executable ran, but didn't output expected TestSprite identifiers in help menu. It may need to run in a proper MCP host environment.");
    }

  } catch (error: any) {
    console.error("❌ Failed to invoke TestSprite MCP.");
    console.error("Error Details:", error.message);
    if (error.stderr) {
        console.error("STDERR:", error.stderr);
    }
  }
}

testTestSpriteMcp();
