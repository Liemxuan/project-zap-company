import { appendMessage } from "./packages/zap-claw/src/history";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  console.log("Submitting code artifact...");
  await appendMessage("TEST_SESSION", "assistant", `
Here is your component!

\`\`\`tsx
import React from "react";
export const MyComponent = () => <div>Hello Swarm</div>;
\`\`\`
`, "ZVN");
  setTimeout(() => process.exit(0), 3000);
}
run();
