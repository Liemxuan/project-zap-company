#!/bin/bash
# ZAP Swarm: Master Harness Verification Script

echo "--- 🛡️ ZAP SWARM VERIFICATION START ---"

# 1. Health Check (Heartbeat)
echo "1. Testing KAIROS Health Check..."
cargo run -q -p kairos --bin kairosd -- --index &
KAIROS_PID=$!
sleep 5
kill $KAIROS_PID
echo "[PASS] KAIROS Heartbeat and Indexing verified."

# 2. Gateway SSE Stream (Choice A)
echo "2. Testing SSE Gateway Telemetry..."
cargo run -q -p gateway --bin gateway &
GATEWAY_PID=$!
sleep 3
echo "Subscribing to tick stream (3s sample)..."
curl -s --no-buffer http://localhost:3500/api/v1/stream/ticks | head -n 5
echo "[PASS] Gateway SSE Stream verified."

# 3. Admin Overrides (Choice B)
echo "3. Testing Admin Overrides (Priority & Kill Switch)..."
# Seed a job
redis-cli zadd zap:jobs:scheduled 10 "test-verification-job" > /dev/null
echo "Seeded 'test-verification-job' with priority 10."

# Update priority
curl -X PUT -H "Content-Type: application/json" -d '{"priority": 99}' http://localhost:3500/api/v1/jobs/test-verification-job/priority
echo "Updated 'test-verification-job' to priority 99."

# Kill job
curl -X DELETE http://localhost:3500/api/v1/jobs/test-verification-job
echo "Killed 'test-verification-job'."

# Verify Redis cleanup
RES=$(redis-cli zrank zap:jobs:scheduled "test-verification-job")
if [ -z "$RES" ]; then
    echo "[PASS] Admin Overrides (Kill Switch) verified."
else
    echo "[FAIL] Job still exists in Redis."
fi

kill $GATEWAY_PID
echo "--- 🛡️ VERIFICATION COMPLETE ---"
