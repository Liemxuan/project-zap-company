#!/bin/bash
set -e

NOTEBOOK_NAME="Olympus Core SOPs"

# Direct bridge to the newly vetted Vault UUID
notebooklm use "160f1193-3f47-4967-ae38-56759328238c"

# Staging holding zone for Normalization Engine
STAGE_DIR="/tmp/olympus_sync"
mkdir -p "$STAGE_DIR"

DIRS=(
  "/Users/zap/Workspace/olympus/docs/sops"
  "/Users/zap/Workspace/olympus/docs/zap-claw/sops"
  "/Users/zap/Workspace/olympus/.agent/skills"
)

echo "🔍 Sweeping directories for SOPs..."
FILES=("/Users/zap/Workspace/olympus/learn.md")

for dir in "${DIRS[@]}"; do
  if [ -d "$dir" ]; then
    while IFS= read -r file; do
      FILES+=("$file")
    done < <(find "$dir" -type f \( -name "*.md" -o -name "*.mdx" \))
  fi
done

TOTAL=${#FILES[@]}
echo "📦 Found $TOTAL total objects. Initiating deduplication matrix..."

count=0
for file in "${FILES[@]}"; do
  count=$((count+1))
  basename=$(basename "$file")
  parent_dir=$(basename "$(dirname "$file")")
  target_file="$file"
  normalized_title="$basename"
  
  # Check for generic basenames that corrupt the RAG namespace
  if [[ "$basename" == "skill.md" || "$basename" == "SKILL.md" || "$basename" == "README.md" || "$basename" == "readme.md" ]]; then
    normalized_title="${parent_dir}-${basename}"
    target_file="$STAGE_DIR/$normalized_title"
    cp "$file" "$target_file"
  fi

  echo ">>> [${count}/${TOTAL}] Processing: $normalized_title"
  
  # Garbage Collection Engine: Delete existing source to ensure latest timestamp wins (Zero Duplicates)
  echo "    ↳ (Garbage Collection) Purging older iterations of $normalized_title..."
  notebooklm source delete-by-title "$normalized_title" -y >/dev/null 2>&1 || true

  # Injection Pass
  if notebooklm source add "$target_file"; then
    echo "    ✅ Successfully version-locked: $normalized_title"
  else
    echo "    ❌ FAILED injection on: $normalized_title"
  fi
  
  # Protect the Google API throttle limits
  sleep 2
done

# Clean the staging runway
rm -rf "$STAGE_DIR"
echo "🔗 Deduplication and Versioning Pass Complete."
