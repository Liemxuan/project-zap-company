# Location Module - Metro Standard Archival (v1-metro)

**Snapshot Date**: 2026-04-07
**Version**: 1.0.0 (Metro Standardization)

## Overview
This directory contains a complete functional snapshot of the Location administrative module after its first major standardization against the Metro (Assembly/M3) design system.

## Standardized Features Included:
- **Action Bar**: Right-aligned search (Enter-trigger), Filter dropdown, and "Add Location" button.
- **Table Layout**: Dropdown row actions (ellipsis), `location_code` ID column, and dynamic Status pills.
- **Service Layer**: Production-ready POST `/locations/list` integration with complex filter support.
- **High-Fidelity Detail**: Sliding inspection panel for location details.

## Why this exists?
This is a "Known Good" reference of the Metro-compliant Location module. If future refactors break the interface or logic, this folder serves as the source of truth for the standardized design.

**Note**: This folder is NOT imported by the main application. It is strictly for backup and reference.
