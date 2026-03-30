import { syncApiKeysToRedis } from "../runtime/engine/omni_router.js";
syncApiKeysToRedis().then(() => {
  console.log("Sync complete!");
  process.exit(0);
}).catch(console.error);
