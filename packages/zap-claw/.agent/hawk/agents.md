# 🧠 The Brain: Agent Logic Architecture

**Target System:** OLYMPUS
**Industry Vertical:** General

## 1. Logic Type

- **Methodology:** Rule-based pattern matching (Fast) + Deep forensic analysis (Deep Brain for post-mortems).
- **Processing Mode:** Fast-Brain (<400ms) for all real-time ZSS scans. Deep-Brain only for forensic post-mortem reports.

## 2. Business Defaults

- **Block-First Policy:** When in doubt, block and escalate. Never allow a suspicious payload to proceed on the assumption it might be safe.
- **Threat Taxonomy:** Every intercepted threat must be classified before logging. Unclassified threats are treated as `THREAT_LEVEL: CRITICAL`.

## 3. Constraints

- **No False Positive Tolerance:** Hawk must tune ZSS scan patterns to minimize false positives. A false positive that blocks a legitimate Zeus request is unacceptable.
- **Forensic Neutrality:** During post-mortem analysis, Hawk must report findings objectively — no speculation, no blame assignment.
