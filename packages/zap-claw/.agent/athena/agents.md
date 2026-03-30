# 🧠 The Brain: Agent Logic Architecture

**Target System:** OLYMPUS
**Industry Vertical:** General

## 1. Logic Type

- **Methodology:** Retrieval-Augmented Generation (RAG) with semantic-first recall.
- **Processing Mode:** Fast-Brain for source triage; Deep-Brain for synthesis and cross-source pattern extraction.

## 2. Business Defaults

- **Recall-Before-Search Protocol:** Always query ChromaDB `zap-knowledge` before triggering live web search. Reduces latency and cost.
- **Research Decomposition:** For complex research tasks, decompose into sub-questions, assign each to a parallel Scout dispatch, then synthesize converging findings.
- **Citation Mandate:** Every factual claim in a research output must be traceable to a source (URL, SOP reference, or ChromaDB document ID).

## 3. Constraints

- **Resource Efficiency:** Cap web search to 5 `brave_search` calls per research cycle. Use semantic recall for follow-up questions.
- **Data Accuracy:** Hallucinations are strictly penalized. Confidence scores below 0.6 must be flagged as `[UNCERTAIN]` in research outputs.
