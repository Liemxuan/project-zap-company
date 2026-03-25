#!/bin/bash

# Reset Development Environment Script
# Usage: ./reset-dev.sh

echo -e "\033[1;36m🔄 ZAP Design Engine: Resetting Development Environment...\033[0m"

# 1. Kill Node Processes
echo "Checking for stuck Node.js processes..."
NODE_PIDS=$(pgrep node)

if [ -n "$NODE_PIDS" ]; then
    NUM_PROCS=$(echo "$NODE_PIDS" | wc -l | tr -d ' ')
    echo -e "\033[1;33mFound $NUM_PROCS Node processes. Terminating...\033[0m"
    pkill -9 node
    echo -e "\033[1;32m✅ Node processes terminated.\033[0m"
else
    echo -e "\033[1;32m✅ No Node processes found.\033[0m"
fi

# 2. Check Ports (Double Check for 3000, 3001, 3002)
PORTS=(3000 3001 3002)
for PORT in "${PORTS[@]}"; do
    LISTENING_PID=$(lsof -ti tcp:$PORT)
    if [ -n "$LISTENING_PID" ]; then
        echo -e "\033[1;31m⚠️ Port $PORT is still in use by PID $LISTENING_PID!\033[0m"
        kill -9 $LISTENING_PID
        echo -e "\033[1;31m💀 Force killed PID $LISTENING_PID on port $PORT.\033[0m"
    fi
done

# 3. Clear Next.js Cache
if [ -d ".next" ]; then
    echo -e "\033[1;33m🧹 Clearing .next cache...\033[0m"
    rm -rf .next
    echo -e "\033[1;32m✅ Cache cleared.\033[0m"
fi

echo -e "\033[1;36m🚀 Environment Reset Complete. Ready to start server.\033[0m"
echo -e "\033[1;37mRun 'npm run dev' to start.\033[0m"
