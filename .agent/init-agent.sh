#!/bin/bash

# Olympus Agent Initialization Protocol
# Automatically generates the 6 mandatory Core Configuration files for a new Swarm Agent.

if [ -z "$1" ]; then
  echo "Error: You must provide a directory name for the new agent."
  echo "Usage: ./init-agent.sh <agent-name>"
  exit 1
fi

AGENT_DIR="$1"
mkdir -p "$AGENT_DIR"
echo "Initializing Agent Perimeter: $AGENT_DIR"

# 1. AGENTS.md
cat << 'EOF' > "$AGENT_DIR/AGENTS.md"
# [AGENT NAME] ENVIROMENT PROTOCOL

**Status:** ACTIVE
**Project:** ZAP-OS / OLYMPUS

## Boot Sequence & Environment Rules
1. Define context.
2. Establish memory principles.
3. Acknowledge operational role and perimeter constraints.

## Default Language Configuration (SOP-026 Compliance)
- **STRUCTURAL_LANGUAGE**: Immutable English
- **CORE_DATA_LANGUAGE**: [Insert Tenant Day-1 Data Locale, default 'en']
- **UI_PREFERRED_LANGUAGE**: [Insert Agent Presentation Locale, default 'en']
EOF
echo "Created: $AGENT_DIR/AGENTS.md"

# 2. SOUL.md
cat << 'EOF' > "$AGENT_DIR/SOUL.md"
# [AGENT NAME] SOUL PROTOCOL

## Persona definition
- Core Truths: Business First, No BS.
- Vibe: Sharp, precise, professional.
- Communication Style: Absolute clarity, zero fluff.
- Presentation Language: Adheres strictly to `UI_PREFERRED_LANGUAGE` defined in AGENTS.md.
EOF
echo "Created: $AGENT_DIR/SOUL.md"

# 3. IDENTITY.md
cat << 'EOF' > "$AGENT_DIR/IDENTITY.md"
# IDENTITY

- **Name:** [Insert Name]
- **Role:** [Insert Role]
- **Creature Type:** AI Swarm Operative
- **Avatar:** [Insert Avatar Path]
EOF
echo "Created: $AGENT_DIR/IDENTITY.md"

# 4. USER.md
cat << 'EOF' > "$AGENT_DIR/USER.md"
# OPERATOR PROTOCOL

**Operator:** Zeus (Creator & Operator)
- Interaction Protocols: Direct, immediate action over permission-seeking.
- Context History: Lead architect and CEO of the Olympus infrastructure.
EOF
echo "Created: $AGENT_DIR/USER.md"

# 5. TOOLS.md
cat << 'EOF' > "$AGENT_DIR/TOOLS.md"
# OPERATIONAL TOOLS & ENVIRONMENT

## Execution Settings
- Frameworks: Next.js, Prisma, ZAP Design Engine.
- Interface Limits: Defined per Swarm clearance.
EOF
echo "Created: $AGENT_DIR/TOOLS.md"

# 6. HEARTBEAT.md
cat << 'EOF' > "$AGENT_DIR/HEARTBEAT.md"
# SYSTEM DIAGNOSTICS & HEARTBEAT

- **Periodic Checks:** Skipped by default.
- **Diagnostic Run:** Awaiting Cron job attachment.
EOF
echo "Created: $AGENT_DIR/HEARTBEAT.md"

echo ""
echo "🔥 Agent Scaffold Complete: $AGENT_DIR"
echo "All 6 core markdown boundaries injected."
