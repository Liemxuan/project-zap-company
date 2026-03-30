# ZAP Swarm Command Center: Master Route Audit (Port 3500)

This extensive table catalogs all individual React page components and API routes found within the `apps/zap-swarm/src/app` directory. 

Each route is tagged by its operational status to ensure we differentiate between **Primary** fleet management interfaces and **Backend** API endpoints.

| Route Path | Type Tag | Component Function / Dashboard Detail |
|------------|----------|----------------------------------------|
| `/agents/[id]/page.tsx` | **🟢 Primary Sub-page** | **Main Heading:**                Configuring:               {resolvedParams.id}                                                                    {isActive ? 'ONLINE NODE' : 'OFFLINE'} |
| `/agents/new/page.tsx` | **🟢 Primary Sub-page** | **Main Heading:** Deploy Subagent |
| `/agents/page.tsx` | **🟢 Primary Sub-page** | **Main Heading:** Deerflow 2.0 |
| `/api/fleet/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/swarm/agent/identity/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/swarm/docker/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/swarm/jobs/route.ts` | **🔵 Backend API** | API Route Controller supporting GET, POST |
| `/api/swarm/logs/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/api/swarm/zss/route.ts` | **🔵 Backend API** | API Route Controller supporting GET |
| `/chats/[id]/page.tsx` | **🟢 Primary Sub-page** | Core Application Page |
| `/fleet/page.tsx` | **🟢 Primary Sub-page** | **Main Heading:**             API Fleet Command |
| `/page.tsx` | **🟢 Primary Dashboard** | **Main Heading:**              ZAP Swarm Command Center |
