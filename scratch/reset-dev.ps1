# Reset Development Environment Script for Windows PowerShell
Write-Host "🔄 ZAP Design Engine: Resetting Development Environment..." -ForegroundColor Cyan

# 1. Kill Node Processes
Write-Host "Checking for stuck Node.js processes..."
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node processes. Terminating..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Node processes terminated." -ForegroundColor Green
} else {
    Write-Host "✅ No Node processes found." -ForegroundColor Green
}

# 2. Check Ports (3000-3005)
$ports = 3000..3005
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            Write-Host "⚠️ Port $port is still in use by PID $($conn.OwningProcess)!" -ForegroundColor Red
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "💀 Force killed PID $($conn.OwningProcess) on port $port." -ForegroundColor Red
        }
    }
}

# 3. Clear Next.js Cache
if (Test-Path ".next") {
    Write-Host "🧹 Clearing .next cache..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "✅ Cache cleared." -ForegroundColor Green
}

# 4. Clear pnpm cache (optional but helpful)
if (Test-Path "node_modules/.cache") {
    Write-Host "🧹 Clearing node_modules/.cache..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules/.cache" -Recurse -Force
    Write-Host "✅ Cache cleared." -ForegroundColor Green
}

Write-Host "🚀 Environment Reset Complete. Ready to start server." -ForegroundColor Cyan
Write-Host "Run 'pnpm run dev' to start." -ForegroundColor Gray
