$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message, [string]$Color = "Cyan")
    Write-Host "[Clear-Cache] $Message" -ForegroundColor $Color
}

$antigravityPath = "$env:APPDATA\Antigravity"
$cacheFolders = @(
    "Cache",
    "CachedData",
    "Code Cache",
    "Session Storage",
    "Service Worker",
    "GPUCache"
)

Write-Log "Starting Antigravity cache cleanup..." "Yellow"

# Warn user if they should close Antigravity (strictly this script usually runs FROM Antigravity, so full closure might kill the agent too if running locally, but for external usage this is valid)
# Write-Log "ensure Antigravity is largely idle or closed for best results." "Magenta"

foreach ($folder in $cacheFolders) {
    $targetPath = Join-Path -Path $antigravityPath -ChildPath $folder
    
    if (Test-Path $targetPath) {
        try {
            Remove-Item -Path $targetPath -Recurse -Force -ErrorAction SilentlyContinue
            Write-Log "Cleared: $folder" "Green"
        }
        catch {
            Write-Log "Failed to clear $folder. It might be in use." "Red"
        }
    } else {
        Write-Log "Skipped: $folder (Not found)" "Gray"
    }
}

Write-Log "Cache cleanup complete!" "Green"
