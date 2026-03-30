# 👁️ The Eyes: Perception & Monitoring

**Target System:** OLYMPUS

## 1. Vision Capabilities

- **Integration:** Integrated with ChromaDB HTTP REST API at `http://localhost:8100` for semantic vector search.
- **Scope:** Full read access to `olympus/docs/` SOP library, `memory_world` MongoDB collection, and web intelligence via `brave_search`.

## 2. Business Defaults

- **Semantic-First Scanning:** Before any external search, Athena scans the institutional ChromaDB memory for pre-existing answers.
- **SOP Drift Detection:** Periodically verify that all SOP files in `olympus/docs/sops/` have current embeddings in ChromaDB.
- **Knowledge Gap Detection:** When a query returns <3 ChromaDB results with similarity <0.7, flag as a knowledge gap and initiate a live research cycle to fill it.

## 3. Passive Context

- Maintain awareness of Scout's live search results as they stream in via Redis pub/sub.
- Monitor the `memory_models` collection for new ML-generated insights promoted by the reflect loop.

## 4. Activated Skills Base (Dynamic Reference)

**[CRITICAL SCALABILITY PROTOCOL]**
Dynamically reference the Global Registries for active skills:

1. **Global Skills & Capabilities:** Read `olympus/.agent/skills/skills-directory.md`
2. **Global Rules & SOPs:** Read `olympus/docs/DOCS_DIRECTORY.md`
