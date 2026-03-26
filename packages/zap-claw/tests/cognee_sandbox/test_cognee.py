import os
import asyncio
from pprint import pprint
import time

import cognee

async def main():
    # Provide a dummy API key to bypass immediate validation failures if openrouter requires it
    # We will use openrouter as the base url if openai package is used under the hood
    os.environ["LLM_API_KEY"] = os.environ.get("OPENROUTER_API_KEY", "dummy-key")
    # Tell OpenAI client to point to OpenRouter
    os.environ["OPENAI_BASE_URL"] = "https://openrouter.ai/api/v1"

    print("--- [Cognee Test Sandbox] ---")
    print("Testing Graph Extraction Engine...\n")

    start_time = time.time()
    
    try:
        # Step 1: Add raw text document
        print("1. Adding document...")
        raw_text = "The user explicitly hates the color green. They prefer red for all UI elements."
        await cognee.add(raw_text)

        # Step 2: Cognify (Extract graph)
        print("2. Cognifying (Extracing Knowledge Graph)...")
        await cognee.cognify()

        # Step 3: Query the Graph
        print("3. Querying Graph...")
        results = await cognee.search("What color does the user hate?")
        
        print("\n--- [Results] ---")
        for result in results:
            pprint(result)
            
    except Exception as e:
        print(f"\n[Error] execution failed: {e}")
        
    end_time = time.time()
    
    print(f"\n--- [Metrics] ---")
    print(f"Total Execution Time: {end_time - start_time:.2f} seconds")

if __name__ == '__main__':
    # Fix for any event loop issues
    asyncio.run(main())
