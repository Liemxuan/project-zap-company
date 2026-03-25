# BLAST-008: Gemini 3.0 & RED-GREEN TDD Protocol

## Objective

Establish a standardized protocol for deploying the Gemini 3.0 family of models and enforcing the RED-GREEN TDD workflow for the Claude team. This serves as the best practice guide every time we launch code and use team agents.

## 1. Gemini 3.0 Model Capability Matrix

When spawning a Claw Agent or assigning tasks, strictly refer to this matrix to select the optimal model:

| Technical Name | Agentic Name | Primary Usage / Logic Level |
| :--- | :--- | :--- |
| `gemini-3.1-pro` | 3.1 Pro | **Flagship:** Deep reasoning, 1M+ context, and "Vibe Coding." Best for complex architecture and multi-step strategy. |
| `gemini-3-deep-think` | Deep Think | **Specialist:** Extreme reasoning for Science, Math, and R&D. High latency but highest accuracy on "Humanity's Last Exam." |
| `gemini-3-flash` | 3 Flash | **Workhorse:** 3x faster than 2.5 Pro. Default for agentic loops, tool-calling, and high-speed coding tasks (78% on SWE-bench). |
| `gemini-live-2.5-flash`| Gemini Live | **Audio:** Native audio-to-audio reasoning for real-time voice agents. |
| `nano-banana-pro` | Imagen 4 | **Visual:** Pro-grade image generation with high-fidelity text and character consistency. |
| `veo-3.1` | Veo | **Video:** 4K cinematic video generation with natively synced audio. |

## 2. RED-GREEN TDD Protocol for Claude Team

When launching code utilizing the "Claude Team" (e.g., Claude 4.6 Sonnet for coding), the system MUST enforce a strict RED-GREEN Test-Driven Development (TDD) workflow:

- **RED (Failing Test):** A test must be written and observed to fail before implementation begins.
- **GREEN (Passing Test):** Code is implemented specifically to make the test pass.
- **REFACTOR:** After tests pass, code is refactored for performance and clarity while maintaining green tests.
