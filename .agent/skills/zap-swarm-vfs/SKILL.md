---
name: Zap Swarm Virtual File System (VFS)
description: Standard operating procedure for inter-agent data operations and persistent storage via the ZAP Virtual File System (tmp:// and shared://). Eliminates context collapse and API hallucinations.
---

# Zap Swarm Virtual File System (VFS) Protocol

## The Core Mandate
Autonomous agents operating within the ZAP ecosystem (Olympus) **must never** directly query databases using specific SDKs (like Prisma, MongoDB, or Redis) during task execution. All data persistence, state handoffs, and long-term memory operations MUST route through the Virtual File System using three universal POSIX primitives: `vfs_read`, `vfs_write`, and `vfs_list`.

## 1. Context Conservation & State Handoffs (`tmp://`)
When an agent is performing high-token operations (e.g., deep research, sweeping codebase context, or building complex multidimensional arrays):
- **DO NOT** return the raw payload in the `OmniQueue` payload or chat response. This guarantees context window exhaustion and prompt collapse for the receiving agent.
- **DO** write the intermediate results to the ephemeral VFS zone (e.g., `vfs_write({ path: "tmp://task-123/research_state.json", content: "..." })`).
- Hand off the URI string to the next agent in the queue. The next agent uses `vfs_read` to ingest the exact state.

## 2. Persistent Memory & Decoupling (`shared://`)
When saving long-term user preferences, cross-session learnings, or master structural schema:
- Route it to the `shared://` zone. 
- **DO NOT** attempt to understand the backend architecture. The translation layer (`vfs_router`) automatically maps `shared://` URIs to the correct MongoDB cluster, S3 bucket, or Postgres instance.

## 3. Zero Hallucination Surface
By restricting I/O to simple file paths, we eliminate the hallucination vector associated with complex NoSQL queries or relational joins. Treat the swarm like a UNIX pipeline: *everything is a file.*

## 4. Path Boundaries
- Paths must be properly normalized via the VFS adapter layer.
- Never attempt directory traversal (e.g., `../`). The VFS boundary adapter will reject it and throw a security violation.
