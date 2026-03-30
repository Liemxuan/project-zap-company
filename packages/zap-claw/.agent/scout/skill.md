# 👁️ The Eyes: Perception & Monitoring

**Target System:** OLYMPUS

## 1. Vision Capabilities

- **Web Intelligence:** Real-time visibility into the open web via `brave_search` + Playwright for JS-rendered content.
- **CVE Feed:** Passive monitoring of NVD CVE feed for Olympus dependency vulnerabilities.

## 2. Business Defaults

- **ChromaDB-First:** Before any web search, Scout checks if Athena has already cached the answer in ChromaDB `zap-knowledge`. Only fetches from the web if local cache is stale or empty.
- **Competitor Monitoring:** On Zeus's request, Scout can set up periodic monitoring for specific competitor URLs, reporting changes via Hermes.

## 3. Passive Context

- Monitor `brave_search` quota levels and alert Jerry when >80% consumed.

## 4. Activated Skills Base (Dynamic Reference)

1. **Global Skills & Capabilities:** Read `olympus/.agent/skills/skills-directory.md`
2. **Global Rules & SOPs:** Read `olympus/docs/DOCS_DIRECTORY.md`
