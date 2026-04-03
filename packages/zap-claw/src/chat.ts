import * as readline from 'readline';
import { receiveMessage } from './gateway/intercept.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("==========================================");
console.log(" ZAP CLAW - LOCAL CLI INTERFACE");
console.log("==========================================");
console.log("Type 'exit' or 'quit' to terminate.\n");

// Default identity for local development testing
const SENDER_NAME = "Tom";
const TENANT_ID = "ZVN";

console.log(`[Logged in as: ${SENDER_NAME} (${TENANT_ID})]`);
console.log("Waiting for input...\n");

function prompt() {
    rl.question('You: ', async (input) => {
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            console.log("Closing local interface.");
            rl.close();
            process.exit(0);
        }

        if (input.trim() === '') {
            prompt();
            return;
        }

        try {
            const reply = await receiveMessage({
                channel: "CLI",
                tenantId: TENANT_ID,
                sender: { id: "local_cli", username: SENDER_NAME },
                message: { text: input, hasMention: true },
                route: { threadId: "cli_thread", isDirectMessage: true, timestamp: Date.now() }
            });

            if (reply) {
                console.log(`\n================================`);
                console.log(`Agent: ${reply}`);
                console.log(`================================\n`);
            }
        } catch (error) {
            console.error(`\n[CLI Error]`, error);
        }

        // Loop the prompt
        prompt();
    });
}

prompt();
