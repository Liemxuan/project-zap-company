---
title: "SOP-026: Localization, Industry Naming, and Data Structure Immutability"
date: "2026-03-17"
description: "Standard operating procedure for handling multi-language labels, asymmetric audience preferences, and enforcing immutable English-based core data structures."
---

# SOP-026: Localization, Naming & Data Immutability

## 1. Objective
This SOP establishes the strict protocols for how the Olympus architecture handles multi-language rendering, industry-specific naming, and core database structural integrity. These rules ensure that the application can scale globally while preventing database fragmentation.

## 2. Industry Standard Naming
UI labels, navigation items, and AI Persona dialogue MUST inherently adapt to the target industry sector (e.g., Food & Beverage, Hospitality).
- **Hardcoding is Forbidden:** Agents and UI components must never hardcode generic SaaS terms (e.g., "HR", "CRM") if an industry-specific term applies.
- **Reference Taxonomy:** Always use the definitive industry matrices established in the GStack Taxonomy.

## 3. Asymmetric Audience Localization
Language preferences are highly contextual and must be managed dynamically at the presentation layer without altering the underlying data framework.

### 3.1 Country & Regional Representation
When mapping languages, the architectural relationship must support multi-tier fallbacks based on region (e.g., Vietnam: primary Vietnamese, secondary English; USA: primary English, secondary Spanish).

### 3.2 Viewpoint Separation
The system must maintain decoupled language preferences for distinct audiences:
- **Customer / Buyer View:** The end-user interacting with the storefront or mobile app has absolute control over their UI language preference (e.g., selecting Spanish first, English second). 
- **Admin / Merchant View:** The tenant operator can hold an entirely different UI language preference for their dashboard.
- *Rule:* A buyer viewing the system in Spanish does not alter the merchant's English admin dashboard, nor does it alter the raw data.

## 4. Core Data Structure Immutability
**This is an absolute mandate to prevent catastrophic data corruption and query failure.**

### 4.1 Structural Language is English
The core data structure—including database table names, column headers, JSON keys, API parameters, and underlying relationship mapping—MUST be strictly English-based from Day 1.
- *The database schema does NOT switch languages.*

### 4.2 Dataset Language Declarations
If a tenant requires their raw *data payload* (e.g., product descriptions, manual text entries) to be primarily in a language other than English, this must be declared on Day 1 of provisioning.
- *Rule:* The dataset base language is established at inception. The structural casing containing that data remains immutable English.

## 5. Implementation Summary
1. The Database (`schema.prisma`) represents the **English Immutable Truth**.
2. The `module_localizations` (or similar mapping tables) act as the **Translation Lens**.
3. The UI components query the Translation Lens based on the **Current Viewer's Session Preferences** (Admin vs. Customer).
