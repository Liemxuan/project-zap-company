import asyncio
import aiohttp
import time
import json
import sys
import os

# Configuration
# Assuming Zap-Claw API runs locally during dev on port 3000
API_URL = os.getenv("ZAP_CLAW_API_URL", "http://localhost:3000/api/memory/extract")
CONCURRENT_REQUESTS = 50
TOTAL_REQUESTS = 500
TIMEOUT_SECONDS = 30

async def trigger_extraction(session, payload, req_id):
    """Fires a single extraction request against the gateway."""
    start_time = time.time()
    try:
        async with session.post(API_URL, json=payload, timeout=TIMEOUT_SECONDS) as response:
            latency = (time.time() - start_time) * 1000
            
            # Read response body carefully
            resp_text = await response.text()
            
            try:
                data = json.loads(resp_text)
            except:
                data = {"raw": resp_text}
                
            return {
                "req_id": req_id,
                "status": response.status,
                "latency_ms": latency,
                "data": data,
                "error": None
            }
            
    except Exception as e:
        latency = (time.time() - start_time) * 1000
        return {
            "req_id": req_id,
            "status": None,
            "latency_ms": latency,
            "data": None,
            "error": str(e)
        }

async def run_credit_squeeze():
    """
    Simulates 'The Credit Squeeze'
    Saturates the endpoint with simultaneous extraction requests to intentionally 
    hit 429 (Too Many Requests) on the primary provider (Google Pro).
    We then audit the responses to ensure the Gateway Arbitrage matrix 
    successfully falls back to Local/Ollama or Google Ultra without returning 502s.
    """
    print(f"🚀 Starting 'The Credit Squeeze' Rate Limit Test")
    print(f"🎯 Target endpoint: {API_URL}")
    print(f"📈 Firing {TOTAL_REQUESTS} requests with concurrency of {CONCURRENT_REQUESTS}...")
    
    # Example payload matching the Ralph Loop extraction structure
    payload = {
        "text": "The user mentioned they want to use Gemini Pro for fast tagging and DeepSeek for logic.",
        "config": {
            "tier": "Tier1-Budget",
            "force_strategy": "Google_Pro_Primary" 
        }
    }

    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(TOTAL_REQUESTS):
            tasks.append(trigger_extraction(session, payload, i))
            
            # Batch execution to control concurrency
            if len(tasks) >= CONCURRENT_REQUESTS:
                results = await asyncio.gather(*tasks)
                analyze_batch(results)
                tasks = []
                
        # Run remaining
        if tasks:
            results = await asyncio.gather(*tasks)
            analyze_batch(results)

def analyze_batch(results):
    """Analyzes a batch of results in real-time."""
    success_count = sum(1 for r in results if r["status"] == 200)
    rate_limited = sum(1 for r in results if r["status"] == 429)
    errors = sum(1 for r in results if r["status"] not in [200, 429] and r["status"] is not None)
    exceptions = sum(1 for r in results if r["error"] is not None)
    
    avg_latency = sum(r["latency_ms"] for r in results) / len(results) if results else 0
    
    print(f"Batch Result -> 🟢 Success: {success_count} | 🔴 429 Rate Limited: {rate_limited} | ❌ Errors: {errors} | ⚠️ Exceptions: {exceptions} | ⏱️ Avg Latency: {avg_latency:.2f}ms")
    
    # Detailed analysis to see if fallback worked
    # If we get 429s from our own API, the fallback FAILED.
    # The expected behavior is that our API catches the 429 from Google and routes to Ollama,
    # thereby STILL returning a 200 Success to this script.
    if rate_limited > 0:
        print(f"   [!] WARNING: Received {rate_limited} literal 429 responses from the Gateway.")
        print(f"   [!] This implies the Fallback Matrix FAILED to route to a secondary provider.")
        
if __name__ == "__main__":
    try:
        asyncio.run(run_credit_squeeze())
    except KeyboardInterrupt:
        print("\nTest interrupted by user.")
        sys.exit(0)
