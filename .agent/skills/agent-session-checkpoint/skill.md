---
name: session-checkpoint
description: Generates a serialized B.L.A.S.T. State Summary, saves it to the Olympus MongoDB cluster via CLI, retains experiences to the Memory v2.1 system, and returns a BLAST-SPLIT ID. Use when the user requests a 'State Summary', 'Checkpoint', or 'Save Session'.
---

# Session Checkpoint & State Serialization

This skill handles creating a robust, serialized state summary of the active session and persisting it to MongoDB **via CLI** (not MCP — MCP drops EOF connections). This ensures the AI's context can be perfectly reconstructed in a new conversation using a `BLAST-SPLIT` payload.

## 1. Gather Context

Synthesize the current session into the following Markdown template:

```markdown
# STATE SUMMARY: [Descriptive Title]

## 1. Current Objective
[What is the overarching goal right now? What were we doing right before the break?]

## 2. Architecture & Tech Stack Status
[Crucial decisions, tools, file paths, and current state of the architecture]

## 3. Fleet Status
* **Athena (Research):** [Current focus]
* **Jerry (Watchdog):** [Current focus]
* **Spike (Builder):** [Current focus]
* **Thomas (OpenClaw):** [Current focus]
* Other agents as relevant

## 4. Recent Achievements
* [Completed task 1]
* [Completed task 2]

## 5. Current Constraints & Known Issues
* [Blocker 1]
* [Limitation 2]

## 6. Next Immediate Action
[Exactly what the AI should do the moment the session resumes]
```

## 2. Persist to MongoDB (CLI — NOT MCP)

**IMPORTANT:** Do NOT use `mcp_mongodb-mcp-server_insert-many`. It drops EOF connections. Use `mongosh` CLI instead.

### Method A: mongosh CLI (preferred)

```bash
mongosh "mongodb+srv://tomtranzap_db_user:8wGYUhjtcR8z3TOv@zapcluster0.jog3w9m.mongodb.net/olympus" --quiet --eval '
db.session_states.insertOne({
  title: "TITLE_HERE",
  timestamp: new Date().toISOString(),
  summary: "MARKDOWN_SUMMARY_HERE"
})
'
```

### Method B: Memory v2.1 API (curl)

If `mongosh` is unavailable, use the Memory v2.1 API:

```bash
curl -s -X POST http://localhost:3002/api/memory/retain \
  -H "Content-Type: application/json" \
  -d '{
    "type": "experience",
    "data": {
      "agent": "antigravity",
      "action": "SESSION_TITLE_HERE",
      "outcome": "success",
      "lesson": "CONDENSED_SUMMARY_HERE",
      "tags": ["checkpoint", "session-end"]
    }
  }'
```

### Method C: mongosh via npx (fallback)

```bash
npx --cache /tmp/npx-cache -y mongosh "mongodb+srv://tomtranzap_db_user:8wGYUhjtcR8z3TOv@zapcluster0.jog3w9m.mongodb.net/olympus" --quiet --eval '
db.session_states.insertOne({
  title: "TITLE_HERE",
  timestamp: new Date().toISOString(),
  summary: "MARKDOWN_SUMMARY_HERE"
})
'
```

## 2b. Retain to Memory v2.1 (MANDATORY — SOP-035)

After persisting to `session_states`, also fire a retain call to the Memory v2.1 system via `curl`:

```bash
curl -s -X POST http://localhost:3002/api/memory/retain \
  -H "Content-Type: application/json" \
  -d '{
    "type": "experience",
    "data": {
      "agent": "antigravity",
      "action": "ACTION_SUMMARY",
      "outcome": "success",
      "lesson": "KEY_LESSONS_AND_DECISIONS",
      "tags": ["checkpoint", "session-end", "relevant-tags"]
    }
  }'
```

If new rules were discovered, also retain them as world facts:

```bash
curl -s -X POST http://localhost:3002/api/memory/retain \
  -H "Content-Type: application/json" \
  -d '{
    "type": "world",
    "data": {
      "category": "fact",
      "domain": "DOMAIN_HERE",
      "content": "DISCOVERED_RULE_OR_FACT",
      "tags": ["rule", "relevant-tags"],
      "confidence": 0.9
    }
  }'
```

## 3. Retrieve the State ID

When using mongosh, the `insertOne` response returns `insertedId`. When using curl/Memory API, the response includes `id`. Extract this ID for the BLAST-SPLIT payload.

## 4. Output the Checkpoint Snippet

Present the user with a concise BLAST-SPLIT handoff snippet. **Do not print the entire markdown summary to the console**. Ensure it is extremely easy to copy and paste.

```text
**Protocol Checkpoint Saved.**

[START COPY PAYLOAD]

**SESSION RESTORE:** `BLAST-SPLIT-[Insert ObjectId Here]-[SHORT_TOPIC]`

**CONTEXT:** [Provide a 2-3 sentence extremely condensed summary of the state so the next agent has immediate situational awareness even before pulling the DB record.]

**PENDING CONSTRAINTS / NEXT WORK:**
* [Constraint 1]
* [Constraint 2]

[END COPY PAYLOAD]
```

## 5. How to Resume (When the user provides a BLAST-SPLIT ID)

If a user starts a session with "SESSION RESTORE: BLAST-SPLIT-[ObjectId]-...":

1. Extract the `[ObjectId]` from the string.
2. Use `mongosh` CLI (preferred) or `curl` to retrieve the record:

### mongosh:
```bash
mongosh "mongodb+srv://tomtranzap_db_user:8wGYUhjtcR8z3TOv@zapcluster0.jog3w9m.mongodb.net/olympus" --quiet --eval '
JSON.stringify(db.session_states.findOne({_id: ObjectId("OBJECT_ID_HERE")}))
'
```

### curl (Memory v2.1):
```bash
curl -s -X POST http://localhost:3002/api/memory/recall \
  -H "Content-Type: application/json" \
  -d '{"type": "experience", "filter": {"tags": "checkpoint"}, "limit": 5}'
```

3. Parse the returned `summary` markdown and adopt it as your absolute current context and truth.
4. Immediately declare "Session Context Restored", list out the "Pending Constraints" so we know exactly what is left to build, and propose the "Next Immediate Action" listed in the summary.
