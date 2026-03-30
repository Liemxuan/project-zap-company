# Olympus Route Registry (L1-L7 UI & Swarm AI Agents)

Generated on 2026-03-28. This document maps the two primary environments of the Olympus Architecture to align human (Zeus) and AI (Jerry/Antigravity) operational context.

## 1. ZAP Design Engine (Port 3000)
Main L1-L7 UI Component Library and Application Shell Architecture.

**Foundations & Atoms (L1-L2)**
- `/design/[theme]/foundations/[foundation]` (e.g. `/design/metro/foundations/colors`)
- `/design/[theme]/atoms/[atom]`
- `/design/zap/atoms/...` (Accordion, Avatar, Badge, Breadcrumb, Button, Canvas, Card, Checkbox, Colors, Formatters, Icons, Indicator, Input, Interactive, Label, Layout, Live Blinker, Navlink, Panel, Pill, Property Box, Radio, Scroll Area, Select, Separator, Skeleton, Slider, Status, Surface, Switch, Table, Tabs, Textarea, Toggle, Typography)

**Molecules (L3-L4)**
- `/design/[theme]/molecules/[molecule]`
- `/design/zap/molecules/...` (Alert, Breadcrumb, Canvas Body, Cards, Config Bar, Data Readout, Dialog, Dialogs, Dropdown Menu, Dropzone, Form, Forms, Horizontal Navigation, Inputs, Inspector Accordion, Layout, Pagination, Profile Switcher, Progress, Quick Navigate, Rating, Remember Me Checkbox, Social Login Buttons, Steppers, Tabs, Theme Header, Theme Publisher, Tooltip, User Session)

**Organisms & Templates (L5-L7)**
- `/design/[theme]/organisms/[organism]`
- `/design/zap/organisms/...` (Auth Scaffold, Data Grid, Inspector, Interactive Gallery, Kanban Board, Navigation Menu, User Profile Header)
- `/design/zap/templates/sign-in`
- `/design/[theme]/signin`
- `/design/[theme]/merchant-workspace`

**Mission Control (ZAP CLI / Fleet Management Mockups)**
- `/design/[theme]/mission-control`
- `/design/[theme]/mission-control/agents/[name]`
- `/design/[theme]/mission-control/gateway`
- `/design/[theme]/mission-control/topology`
- `/design/[theme]/mission-control/swarm`
- `/design/[theme]/mission-control/swarm/execution` (Execution Tracker)
- `/design/[theme]/mission-control/swarm/registry` (Fleet Genesis Registry)

**Labs & Internal Tests**
- `/design/[theme]/labs/[lab]`
- `/design/zap/labs/...` (Agents, Stitch Brand Test, Stitch Dropzone, Stitch Playful Test, Stitch Test, Theme Remix, Theme Wix)
- `/design/audit`
- `/auth/metro/user-management`
- `/admin/tracker`

---

## 2. ZAP Swarm Command Center (Port 3500)
The Live AI Agent Environment & Telemetry API.

**UI Dashboards (/app/...)**
- `/` (Main Swarm Dashboard)
- `/agents` (Agents Overview)
- `/agents/new` (Agent Creation)
- `/agents/[id]` (Specific Agent Settings/Info)
- `/chats/[id]` (Active Agent Chat/Stream)
- `/fleet` (Global Fleet Logistics)

**API Endpoints (/api/swarm/...)**
- `/api/swarm/jobs` (MongoDB SIS_OS_dead_letters Query/Dispatch)
- `/api/swarm/docker` (Local Docker Container Query)
- `/api/swarm/zss` (Zap Swarm Security intercepts)
- `/api/swarm/agent/identity` (Agent Profile/Identity Resolution)
- `/api/swarm/logs` (Fleet Log Aggregation)
- `/api/fleet` (Fleet Routing/Topology)
