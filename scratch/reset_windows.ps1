
echo "🔄 Resetting Development Environment (Windows)..."

# 1. Kill Node Processes
echo "Checking for stuck Node.js processes..."
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    echo "Found $($nodeProcesses.Count) Node processes. Terminating..."
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    echo "✅ Node processes terminated."
} else {
    echo "✅ No Node processes found."
}

# 2. Check Ports (3000, 3001, 3002)
$ports = 3000, 3001, 3002
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            echo "⚠️ Port $port is still in use by PID $($conn.OwningProcess)!"
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            echo "💀 Force killed PID $($conn.OwningProcess) on port $port."
        }
    }
}

# 3. Clear Next.js Cache
$nextDirs = Get-ChildItem -Path . -Filter .next -Recurse -Directory
foreach ($dir in $nextDirs) {
    echo "🧹 Clearing $($dir.FullName)..."
    Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction SilentlyContinue
    echo "✅ Cache cleared."
}

echo "🚀 Environment Reset Complete. Ready to start server."
