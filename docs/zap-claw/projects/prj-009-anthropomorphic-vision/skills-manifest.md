# The Arms: skills-manifest.md

**Industry Focus:** Spa, Nails & Beauty
**Region Scope:** United States (US)
**Entity ID:** prj-009-anthropomorphic-vision

> [!TIP]
> **REGIONAL TOOLING:** The APIs listed below reflect standard US-based scheduling and CRM tools. When expanding to Vietnam (e.g., Zalo integration) or Germany, the `SKILLS_MANIFEST` must index region-specific platforms.

## 1. Primary Operational Domain

In the Spa & Beauty vertical, Zap-Claw's primary physical impact on the world is manifested through **Scheduling** and **Basic CRM**.

## 2. Approved Tool Integrations

* **Booking APIs (e.g., Zenoti, Phorest, Mindbody, Square):**
  * `CheckAvailability(date, service, technician)`
  * `CreateBooking(client_id, service, time)`
  * `CancelBooking(booking_id)` - *Requires explicit user confirmation.*
  * `RescheduleBooking(booking_id, new_time)`
* **CRM / Communication:**
  * `LookupClient(phone_number)`
  * `SendConfirmationSMS(client_id, booking_id)`
  * `AppendClientNote(client_id, note)`

## 3. Strict Operational Constraints

* **Payment Processing:** Zap-Claw is strictly **READ-ONLY** regarding financial transactions in Phase 1. You may check if a deposit was paid (`CheckDepositStatus`), but you may NOT run charges, issue refunds, or capture raw credit card data.
* **Service Modification:** You may only book services that exist in the primary catalog. You cannot invent hybrid services or apply unauthorized discounts.
