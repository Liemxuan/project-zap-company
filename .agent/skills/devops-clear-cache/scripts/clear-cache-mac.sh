#!/usr/bin/env bash
# ZAP-OS: Antigravity MacOS Cache Purge Script
# Clears out Electron app caches and Antigravity recordings.

echo "[ZAP-OS] Initiating Antigravity Cache Purge..."

# 1. Clear Antigravity Process Caches (Electron / Chromium)
APP_SUPPORT_DIR="$HOME/Library/Application Support/Antigravity"
if [ -d "$APP_SUPPORT_DIR" ]; then
    echo "-> Sweeping Application Support caches..."
    rm -rf "$APP_SUPPORT_DIR/Cache"
    rm -rf "$APP_SUPPORT_DIR/CachedData"
    rm -rf "$APP_SUPPORT_DIR/Code Cache"
    rm -rf "$APP_SUPPORT_DIR/Session Storage"
    rm -rf "$APP_SUPPORT_DIR/Service Worker"
    rm -rf "$APP_SUPPORT_DIR/GPUCache"
    echo "-> App caches purged."
else
    echo "-> App Support directory not found. Skipping."
fi

# 2. Clear Agent Recordings & Scratch
GEMINI_DIR="$HOME/.gemini/antigravity"
if [ -d "$GEMINI_DIR" ]; then
    echo "-> Sweeping agent background records..."
    rm -rf "$GEMINI_DIR/browser_recordings/"*
    rm -rf "$GEMINI_DIR/tmp/"*
    echo "-> Agent temp files purged."
else
    echo "-> .gemini background directory not found. Skipping."
fi

echo "[ZAP-OS] Cache purge complete. You can now safely boot Antigravity."
