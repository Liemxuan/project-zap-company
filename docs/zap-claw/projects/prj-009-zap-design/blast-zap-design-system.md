# BLAST-009: ZAP Design System architecture

**Status**: Planning
**Author**: Antigravity
**Last Updated**: 2026-02-24

## 1. Executive Summary

This document defines the architectural structure and integration strategy for **ZAP Design** (`zap-design`). ZAP Design will serve as the single, centralized UI foundation and design language for the entire ecosystem, including the OLYMPUS administration platform and all merchant-facing default templates/themes.

By isolating the design system into its own distinct module, we enable independent development cycles (e.g., frontend teams can iterate on UI independently) while ensuring 100% visual and functional consistency across all connected projects.

## 2. Core Technology Stack
To ensure high performance, developer consistency, and strict alignment with modern standards (specifically adhering to Google and Gemini protocol ecosystems), ZAP Design is constructed on the following stack:

*   **Language**: **TypeScript**. Enforces strict typing for design tokens, component props, and API interfaces, ensuring massive scalability and enterprise-grade stability across teams.
*   **Styling Engine**: **Tailwind CSS**. A utility-first CSS framework that allows for rapid UI development while maintaining localized scope and mapping seamlessly to ZAP Design tokens.
*   **Typography**: **Google Fonts**. Standardized, highly-optimized, and globally cached font delivery (e.g., Montserrat, Inter) meeting Google's core web vitals.
*   **Iconography**: **Google Material Symbols**. We explicitly adopt Google's standard variable icon font. It provides highly legible, customizable (fill, weight, grade, optical size) icons that align perfectly with the broader Google/Gemini UX protocols, ensuring standard parity with Google defaults.

## 3. Core Philosophy: Atomic Design
ZAP Design is structured around the Atomic Design methodology. This ensures that every piece of the UI is highly modular, reusable, and testable.

### 3.1 The Hierarchy
*   **Design Tokens (The Physics)**: 
    *   Foundational variables: Colors, Typography, Spacing, Shadows, Border Radii, Z-indexes.
    *   These tokens sync directly with the `SYS_OS_brand_guidelines` schema. 
*   **Atoms**: The basic building blocks (e.g., `<Button />`, `<Input />`, `<MaterialSymbol />`).
*   **Molecules**: Combinations of atoms (e.g., a `<SearchBox />`).
*   **Organisms**: Complex UI sections (e.g., `<HeaderNavigation />`, `<DataGrid />`).
*   **templates**: Page-level wireframes/skeletons.
*   **Pages**: Specific instances of templates filled with real data.

## 4. Structural Module Organization & Microservices
To support massive scale (up to 1,000,000+ user merchants) and independent development teams, the environment must be decoupled into independent workstations (microservices).

### 4.1 Separate Workstations (Repositories)
Each major module should exist in its own separate repository or highly isolated monorepo workspace to prevent entanglement:
*   `zap-claw` (OLYMPUS Core Backend & Bot Logic)
*   `zap-design` (UI Design System & Assets)
*   `zap-merchant-gateway` (Storefront Rendering Engine)

### 4.2 Docker Containerization
*   Every module must have its own standalone `Dockerfile`.
*   A centralized `docker-compose.yml` (for local dev) and Kubernetes Helm charts (for production) will map the service topologies.
*   Services communicate securely over defined internal APIs via an API Gateway or Service Mesh (e.g., Omni-Router).

### 4.3 Proposed Directory Structure for ZAP Design (`/zap-design`)

```text
/zap-design/
├── /tokens/             # Design variables (Tailwind mappings, fonts.ts, spacing.ts)
├── /components/         # React/Web Components (TypeScript)
├── /templates/          # Layout foundations
├── Dockerfile           # To serve Storybook/Documentation
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Module definition
└── index.ts             # Public API exports
```

## 5. Scalable Database Strategy (MongoDB Atlas)
To support 10,000 to 1,000,000+ merchants without bottlenecking, we must abandon single-instance databases and utilize MongoDB Atlas features.

### 5.1 Multi-Tenant architecture
Instead of storing all merchants in a single massive collection, we will adopt a hybrid approach:
*   **SYS_OS_Collections (Global Routing)**: Core routing tables and configurations (like `SYS_OS_brand_guidelines`) remain global.
*   **Tenant Partitioning**: Critical operational data for each merchant (products, orders, logs) will be partitioned.
    *   *Mid-Scale (1k - 10k)*: Database per Tenant approach (e.g., `ZVN_orders`, `CUST99_orders`).
    *   *Massive-Scale (100k+)*: Sharded clusters based on a composite hash of the `tenantId`, ensuring even distribution across physical database nodes.

### 5.2 Connection Pooling
Each microservice will maintain its own distinct connection pool to MongoDB Atlas, limiting max connections to prevent connection string exhaustion during traffic spikes.

## 6. Integration Strategy

The true power of ZAP Design lies in how it is consumed by the rest of the ecosystem.

### 6.1 OLYMPUS (The Core Engine)
OLYMPUS will import from `zap-design` via internal npm packages or submodules to build administrative panels.
*   **Usage**: `import { Button, Input, DataGrid } from '@zap/design/olympus';`

### 6.2 Brand Guidelines Sync (Phase 24)
1. Admin configures "Vibe, Colors, Fonts" in OLYMPUS Brand Guide Hub.
2. The payload is saved to MongoDB (`SYS_OS_brand_guidelines`).
3. When rendering a Merchant page, the Tenant's brand data is dynamically injected into `zap-design`'s Tailwind variables at runtime over the internal API.

## 7. Development Workflow (For Other Staff)
*   **Isolation**: Tent staff and designers run Storybook via Docker (`docker run zap-design`). They build UI components without needing OLYMPUS or Mongo Atlas running locally.
*   **Versioning**: Once perfected, TS components are versioned and published to an internal artifact registry.

## 8. Next Steps for Implementation (When Authorized)
1. Initialize the `zap-design` module (TypeScript + Tailwind CSS).
2. Integrate Google Fonts and Google Material Symbols libraries.
3. Draft the `Dockerfile` for the design workspace.
4. Build the foundational Atoms (Button, Input).
