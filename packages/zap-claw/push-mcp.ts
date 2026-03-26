import { Client } from '/Users/zap/Workspace/tools/open-pencil/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { SSEClientTransport } from '/Users/zap/Workspace/tools/open-pencil/node_modules/@modelcontextprotocol/sdk/dist/esm/client/sse.js';

const transport = new SSEClientTransport(new URL('http://127.0.0.1:3100/mcp'));
const client = new Client({ name: 'zap-agent', version: '1.0.0' }, { capabilities: {} });

async function main() {
  try {
    console.log('Connecting to OpenPencil MCP Server...');
    await client.connect(transport);
    console.log('Connected!');

    const jsxPayload = `
<Frame name="Typography Foundation" w={1200} h={1000} flex="col" gap={40} p={100} bg="#000000">
  <Text size={64} weight={700} color="#FFFFFF" textAutoResize="width">Typography Tokens</Text>
  
  <Frame name="Headings" flex="col" gap={24} w="fill">
    <Text size={56} weight={900} color="#FFFFFF" name="H1" textAutoResize="width">H1 - Headings Default</Text>
    <Text size={48} weight={800} color="#FFFFFF" name="H2" textAutoResize="width">H2 - Headings Default</Text>
    <Text size={40} weight={800} color="#FFFFFF" name="H3" textAutoResize="width">H3 - Headings Default</Text>
    <Text size={32} weight={700} color="#FFFFFF" name="H4" textAutoResize="width">H4 - Headings Default</Text>
    <Text size={24} weight={700} color="#FFFFFF" name="H5" textAutoResize="width">H5 - Headings Default</Text>
    <Text size={20} weight={700} color="#FFFFFF" name="H6" textAutoResize="width">H6 - Headings Default</Text>
  </Frame>

  <Frame name="Body" flex="col" gap={16} w="fill">
    <Text size={18} weight={400} color="#A1A1AA" name="P1" textAutoResize="width">P1 - Body Default (18px)</Text>
    <Text size={16} weight={400} color="#A1A1AA" name="P2" textAutoResize="width">P2 - Body Secondary (16px)</Text>
    <Text size={14} weight={400} color="#A1A1AA" name="P3" textAutoResize="width">P3 - Body Tertiary (14px)</Text>
  </Frame>

  <Frame name="Utility" flex="row" gap={32} w="fill">
    <Text size={12} weight={600} color="#FFFFFF" name="Label" textAutoResize="width">LABEL</Text>
    <Text size={12} weight={400} color="#71717A" name="Caption" textAutoResize="width">Caption Text</Text>
  </Frame>
</Frame>`;

    console.log('Pushing JSX payload to OpenPencil Desktop via render tool...');

    const result = await client.callTool({
      name: 'render',
      arguments: {
        jsx: jsxPayload
      }
    });

    console.log('Render Result:', JSON.stringify(result, null, 2));

    console.log('✅ Paylod injected successfully via MCP!');
    process.exit(0);
  } catch (error) {
    console.error('Injection failed:', error);
    process.exit(1);
  }
}

main();
