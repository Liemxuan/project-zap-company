# ZAP Design Engine: Master Route Audit (Port 3000)

This extensive table catalogs all 120+ individual React page components and API routes found within the `packages/zap-design/src/app` directory. 

Each route is strictly tagged by its operational status to ensure we differentiate between **Primary** L1-L7 architectural components, **Experimental** labs, **Backend** API telemetry, and potentially **Legacy** logic.

| Route Path | Type Tag | Component Function / Sandbox Detail |
|------------|----------|--------------------------------------|
| `/admin/tracker/page.tsx` | **🏢 Tenant / Legacy Ops** | **Main Heading:** Olympus Mission Control |
| `/api/admin/infrastructure/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/assets/lock/route.ts` | **🔵 Backend API** | API Route Controller supporting unknown verbs |
| `/api/assets/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/audit/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/border_radius/publish/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST |
| `/api/colors/publish/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST |
| `/api/elevation/publish/route.ts` | **🔵 Backend API** | API Route Controller supporting POST |
| `/api/elevation/settings/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/geometry/publish/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST |
| `/api/heartbeat/route.ts` | **🔵 Backend API** | API Route Controller supporting GET | *Doc:* * GET /api/heartbeat * * Agent heartbeat endpoint. Returns agent status, uptime, * and memory system... |
| `/api/image/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/memory/recall/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST | *Doc:* * POST /api/memory/recall * * Recall memories from the Olympus Memory System. * * Body: RecallOption... |
| `/api/memory/reflect/route.ts` | **🔵 Backend API** | API Route Controller supporting POST | *Doc:* * POST /api/memory/reflect * * Karpathy-inspired: evaluate recent experiences, promote repeated * su... |
| `/api/memory/retain/route.ts` | **🔵 Backend API** | API Route Controller supporting POST | *Doc:* * POST /api/memory/retain * * Retain a world fact or experience in the Olympus Memory System. * * Bo... |
| `/api/memory/stats/route.ts` | **🔵 Backend API** | API Route Controller supporting GET | *Doc:* * GET /api/memory/stats * * Memory system health and statistics. |
| `/api/spacing/publish/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST |
| `/api/swarm/registry/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/swarm/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/tcp-ping/route.ts` | **🔵 Backend API** | API Route Controller supporting GET | *Doc:* * GET /api/tcp-ping * * Server-side raw TCP port ping to verify if a local or remote network service... |
| `/api/telemetry/keys/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/theme/publish/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST | *Doc:* * API: Publish Theme * * Writes the adjusted variables back to the specific theme CSS file * (defaul... |
| `/api/theme/settings/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST | *Doc:* * ═══════════════════════════════════════════════════════════════════ * API: /api/theme/settings * U... |
| `/api/typography/publish/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST |
| `/api/zap-pages/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/auth/metro/user-management/page.tsx` | **🟢 Primary System** | Core Application Page |
| `/design/[theme]/atoms/[atom]/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/[theme]/foundations/[foundation]/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/[theme]/labs/[lab]/page.tsx` | **🧪 Experimental Lab** | Core Application Page |
| `/design/[theme]/merchant-workspace/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Merchant Workspace Sandbox (WORKSPACE INTEGRATION) |
| `/design/[theme]/mission-control/agents/[name]/page.tsx` | **🛡️ Admin / Mission Control** | **Main Heading:**                                                                   {agentName} Agent |
| `/design/[theme]/mission-control/gateway/page.tsx` | **🛡️ Admin / Mission Control** | **Main Heading:**                                                                   Gateway Matrix |
| `/design/[theme]/mission-control/page.tsx` | **🛡️ Admin / Mission Control** | **Main Heading:**                          Mission Control |
| `/design/[theme]/mission-control/swarm/execution/page.tsx` | **🛡️ Admin / Mission Control** | **Main Heading:** Execution Tracker |
| `/design/[theme]/mission-control/swarm/page.tsx` | **🛡️ Admin / Mission Control** | Core Application Page |
| `/design/[theme]/mission-control/swarm/registry/page.tsx` | **🛡️ Admin / Mission Control** | **Main Heading:** Genesis Registry |
| `/design/[theme]/mission-control/topology/page.tsx` | **🛡️ Admin / Mission Control** | **Main Heading:**                                                                   Topology Viewer |
| `/design/[theme]/molecules/[molecule]/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/[theme]/organisms/[organism]/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/[theme]/organisms/inspector/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Inspector Architecture (L4/L5 TEMPLATE) |
| `/design/[theme]/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page | *Doc:* * Dynamic Theme Home Page * * Renders at /design/[theme]/ — shows an overview of the theme * with qu... |
| `/design/[theme]/signin/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/audit/page.tsx` | **🟢 Primary System** | **Sandbox:** Design Audit Dashboard (L7) |
| `/design/zap/atoms/accordion/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** AccordionItem (L3 ATOM) |
| `/design/zap/atoms/avatar/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Avatar (L3 ATOM) |
| `/design/zap/atoms/badge/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Badge (L3 ATOM) |
| `/design/zap/atoms/breadcrumb-pill/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** BreadcrumbPill (L3 ATOM) |
| `/design/zap/atoms/button/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Button (L3 ATOM) |
| `/design/zap/atoms/canvas/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Canvas (L3 ATOM) |
| `/design/zap/atoms/card/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Cards & Containers (L4 MOLECULE) |
| `/design/zap/atoms/checkbox/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Checkbox (L3 ATOM) |
| `/design/zap/atoms/colors/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/zap/atoms/formatters/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Formatters (L3 ATOM) |
| `/design/zap/atoms/icons/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/zap/atoms/indicator/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** StatusDot (L3 ATOM) |
| `/design/zap/atoms/input/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Input (L3 ATOM) |
| `/design/zap/atoms/interactive/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/zap/atoms/label/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Label (L3 ATOM) |
| `/design/zap/atoms/layout/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/zap/atoms/layout-layers/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/zap/atoms/live-blinker/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** LiveBlinker (L3 ATOM) |
| `/design/zap/atoms/navlink/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** NavLink (L3 ATOM) |
| `/design/zap/atoms/panel/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Panel (L3 ATOM) |
| `/design/zap/atoms/pill/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Pill (L3 ATOM) |
| `/design/zap/atoms/property-box/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** PropertyBox (L3 ATOM) |
| `/design/zap/atoms/radio/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Radio (L3 ATOM) |
| `/design/zap/atoms/scroll-area/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Scroll Area (L3 ATOM) |
| `/design/zap/atoms/select/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Select (L3 ATOM) |
| `/design/zap/atoms/separator/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Separator (L3 ATOM) |
| `/design/zap/atoms/skeleton/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Skeleton (L3 ATOM) |
| `/design/zap/atoms/slider/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Slider (L3 ATOM) |
| `/design/zap/atoms/status/page.tsx` | **🟢 Primary System (L1-L7)** | Core Application Page |
| `/design/zap/atoms/surface/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Surface (L3 ATOM) |
| `/design/zap/atoms/switch/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Switch (L3 ATOM) |
| `/design/zap/atoms/table/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Table (L3 ATOM) |
| `/design/zap/atoms/tabs/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Tabs (L3 ATOM) |
| `/design/zap/atoms/textarea/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Textarea (L3 ATOM) |
| `/design/zap/atoms/toggle/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Toggle (L3 ATOM) |
| `/design/zap/atoms/typography/page.tsx` | **🟢 Primary System (L1-L7)** | **Main Heading:**                          {activeTab === 'preview' && activeTemplate === 'fun' ? 'FUN MODE' : null}                         {activeTab === 'preview' && activeTemplate !== 'fun' ? 'WILD MODE' : null}                         {activeTab === 'details' && 'TYPOGRAPHY'}                         {activeTab === 'playground' && 'PLAYGROUND'} |
| `/design/zap/labs/agents/page.tsx` | **🧪 Experimental Lab** | **Main Heading:** Olympus Agent Wikidocs |
| `/design/zap/labs/stitch-brand-test/page.tsx` | **🧪 Experimental Lab** | **Main Heading:**                                          Build Consistent Experiences |
| `/design/zap/labs/stitch-dropzone/page.tsx` | **🧪 Experimental Lab** | **Main Heading:**                          Stitch Dropzone |
| `/design/zap/labs/stitch-playful-test/page.tsx` | **🧪 Experimental Lab** | **Main Heading:**                                              Hi, I&apos;m Alex! |
| `/design/zap/labs/stitch-test/page.tsx` | **🧪 Experimental Lab** | **Main Heading:**                          Stitch Magic Test                         (Actual Stitch Layout Validation) |
| `/design/zap/labs/theme-remix/page.tsx` | **🧪 Experimental Lab** | **Main Heading:** Theme Remix Engine Test (4-State) |
| `/design/zap/labs/theme-wix/page.tsx` | **🧪 Experimental Lab** | **Main Heading:**                          Create a website                          without limits |
| `/design/zap/m3-preview/page.tsx` | **🟢 Primary System** | **Main Heading:** ZAP M3 Engine Preview |
| `/design/zap/molecules/alert/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Alert (L4 MOLECULE) |
| `/design/zap/molecules/breadcrumb/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Breadcrumbs (L4 MOLECULE) |
| `/design/zap/molecules/canvas-body/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** CanvasBody (L4 MOLECULE) |
| `/design/zap/molecules/cards/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Cards (L4 MOLECULE) |
| `/design/zap/molecules/config-bar/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Config Bar (L4 MOLECULE) |
| `/design/zap/molecules/data-readout/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** DataReadout (L4 MOLECULE) |
| `/design/zap/molecules/dialog/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Dialog (L4 MOLECULE) |
| `/design/zap/molecules/dialogs/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Dialogs (L4 MOLECULE) |
| `/design/zap/molecules/dropdown-menu/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Dropdown Menu (L4 MOLECULE) |
| `/design/zap/molecules/dropzone/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** File Dropzone (L4 MOLECULE) |
| `/design/zap/molecules/form/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Form (L4 MOLECULE) |
| `/design/zap/molecules/forms/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Form Architecture (L4 MOLECULE) |
| `/design/zap/molecules/horizontal-navigation/page.tsx` | **🔴 Legacy (Deprecated)** | **Sandbox:** Horizontal Navigation (L4 MOLECULE) |
| `/design/zap/molecules/inputs/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Input Modules (L4 MOLECULE) |
| `/design/zap/molecules/inspector-accordion/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** InspectorAccordion (L4 MOLECULE) |
| `/design/zap/molecules/layout/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** ThemeHeader (L4 MOLECULE) |
| `/design/zap/molecules/pagination/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Pagination (L4 MOLECULE) |
| `/design/zap/molecules/profile-switcher/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Profile Switcher (Molecules) |
| `/design/zap/molecules/progress/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Progress (L4 MOLECULE) |
| `/design/zap/molecules/quick-navigate/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Quick Navigate (L4 MOLECULE) |
| `/design/zap/molecules/rating/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Rating (L4 MOLECULE) |
| `/design/zap/molecules/remember-me-checkbox/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Remember Me Checkbox (L4 MOLECULE) |
| `/design/zap/molecules/social-login-buttons/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Social Login Buttons (L4 MOLECULE) |
| `/design/zap/molecules/steppers/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Quantity Stepper (L4 MOLECULE) |
| `/design/zap/molecules/tabs/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Tabs (L4 MOLECULE) |
| `/design/zap/molecules/theme-header/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** ThemeHeader (L4 MOLECULE) |
| `/design/zap/molecules/theme-publisher/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Theme Publisher (Dev Tooling (L1)) |
| `/design/zap/molecules/tooltip/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Tooltip (L4 MOLECULE) |
| `/design/zap/molecules/user-session/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** User Session (L4 MOLECULE) |
| `/design/zap/organisms/auth-scaffold/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Authentication Scaffolds (L5: Organisms) |
| `/design/zap/organisms/data-grid/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Data Grid (L5 ORGANISM) |
| `/design/zap/organisms/inspector/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** MockComponent (L5 ORGANISM) |
| `/design/zap/organisms/interactive-gallery/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Interactive Elements Gallery (L5: Organisms) |
| `/design/zap/organisms/kanban-board/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Kanban Board (L5 ORGANISM) |
| `/design/zap/organisms/navigation-menu/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** Navigation Menu (L5 ORGANISM) |
| `/design/zap/organisms/user-profile-header/page.tsx` | **🟢 Primary System (L1-L7)** | **Sandbox:** User Profile Header (L5: Organisms) |
| `/design/zap/templates/sign-in/page.tsx` | **🟢 Primary System** | **Sandbox:** SignInTemplate (L7 PAGE) |
| `/page.tsx` | **🟢 Primary System** | **Main Heading:**                      ZAP SYSTEM |
| `/tenant/apps/page.tsx` | **🏢 Tenant / Legacy Ops** | **Main Heading:** Workspace Applications |
| `/tenant/onboarding/page.tsx` | **🏢 Tenant / Legacy Ops** | **Main Heading:**            Tenant Onboarding |
