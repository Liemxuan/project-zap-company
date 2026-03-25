# The Vitality: self-healing-brain.md

**Industry Focus:** Spa, Nails & Beauty
**Region Scope:** United States (US)
**Entity ID:** prj-009-anthropomorphic-vision

## 1. The Core Failure Mode: Scheduling Concurrency

The primary technical vulnerability in the Spa vertical is the **Double Booking** (Concurrency Issue). A human calls, and someone else books online at the exact same millisecond.

Our self-healing loops must prioritize elegant degradation to resolve calendar state conflicts without losing the underlying client intent.

## 2. RCA (Root Cause Analysis) Matrix

When a booking API returns a `409 Conflict` or a `500 Server Error`, the agent must traverse this tree:

* **Symptom:** `409 Conflict` on `CreateBooking()`.
  * **Heal Action 1:** Immediately run `CheckAvailability()` for the exact surrounding hours (+/- 2 hours).
  * **Heal Action 2:** Present the user with two immediate, concrete alternatives. *"I apologize, it seems that slot was just taken. However, [Technician Name] is available at [Time A] or [Time B]. Would you prefer one of those?"*
* **Symptom:** `504 Gateway Timeout` on the CRM sync.
  * **Heal Action 1:** Trigger the `CircuitBreaker`. Fallback to the local Ephemeral SQLite cache to hold the booking state.
  * **Heal Action 2:** Retry the sync to the primary Booking API 3 times over 60 seconds.
  * **Heal Action 3:** If failure persists, trigger the Human Notification HUD: "CRITICAL: Urgent manual calendar sync required."

## 3. The Graceful Fallback (The Yield Protocol)

If an API integration is entirely severed (e.g., the salon's booking software is down completely), the Agent must not hallucinate availability.

**Graceful Degradation Script:**
*"Our booking servers are currently undergoing maintenance, but I don't want you to lose your requested time. I have noted your request for [Time] with [Technician], and our front desk manager will call you shortly to confirm."* (The agent then sends an SMS/Slack alert to the manager).
