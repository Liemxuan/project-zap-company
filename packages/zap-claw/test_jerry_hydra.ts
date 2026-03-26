import { handler } from "./src/tools/hydra_handoff.js";

async function testJerry() {
    console.log("🚀 Simulating Jerry checking the Hydra Loop...");
    const result = await handler({
        taskBlueprint: "Build a generic <Button> component that meets ZAP Neo-Brutalist standards. It needs variants for primary and outline, and 'data-testid' for testing."
    }, 1, "Jerry");

    console.log("\n[JERRY'S TERMINAL LOG]");
    console.log(result);
}

testJerry();
