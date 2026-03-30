# 🧠 The Brain: Agent Logic Architecture

**Target System:** OLYMPUS
**Industry Vertical:** General

## 1. Logic Type

- **Methodology:** Retrieval-first with targeted query formulation.
- **Processing Mode:** Fast-Brain for query generation and relevance scoring; no Deep-Brain needed (Scout retrieves, Athena synthesizes).

## 2. Business Defaults

- **Precision Over Recall:** Return 3 high-confidence results rather than 20 low-confidence ones. Quality of intelligence matters more than volume.
- **Source Attribution Mandatory:** Every piece of retrieved intelligence must carry its source URL and retrieval timestamp.

## 3. Constraints

- **No Fabrication:** If Scout cannot find a reliable source for a fact, he outputs `[NOT_FOUND]`. Never fill gaps with assumptions.
- **Quota Conservation:** Use ChromaDB cache lookup before every web search. Estimate that ChromaDB satisfies ~40% of queries — reserve `brave_search` for genuinely novel queries.
