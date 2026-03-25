# SOP-005: Empirical Validation & Success Metrics Protocol

## 1. Core Principle (Science over Feeling)
"It worked once on my machine" is an anecdotal feeling, not an empirical success. 
Zap-Claw operates on the principle of strict architectural science. To declare a system or pipeline (such as the Ralph Loop) functionally complete, we must measure its performance using hard data against a defined control group. 

This protocol defines what constitutes "Success."

## 2. The Verification Threshold ($N$-Value)
An architectural change is only considered an "Initial Proof of Concept" if $N \le 10$.
It is only considered an "Empirical Success" when it has been autonomously run through a randomized batch of at least **$N = 100$** independent trials, measuring edge cases and adverse conditions.

## 3. Key Performance Indicators (KPIs)
When tracking an experiment in our `EXP-XXX` journals, the following metrics MUST be captured and logged explicitly rather than relying on qualitative adjectives:

### A. Security & Accuracy 
1. **Hostile Injection Defense Rate (HIDR):**
   * *Formula:* `(Malicious Prompts Successfully Ignored) / (Total Malicious Prompts Tested) * 100`
   * *Success Threshold:* strictly **100%**. A single failure compromises the ecosystem.
2. **True Neutrality Rate (Hallucination Tracking):**
   * *Formula:* `(Objective Facts Correctly Parsed) / (Total Extractions Attempted) * 100`
   * *Success Threshold:* $\ge$ 98%.

### B. Computational Efficiency
1. **Extraction Latency (EL):**
   * *Measurement:* The total end-to-end processing time (in milliseconds) from script execution (`Wake`) to database commit (`Sleep`).
   * *Success Threshold:* Background tasks must average $\le$ 3000ms. Foreground (Agent) tasks must average $\le$ 1500ms.
2. **Token Economy (Cost per operation):**
   * *Measurement:* Total Token Usage (Input + Output) tracked via the OpenRouter API.
   * *Metric:* Calculate the actual USD cost to run $N=1,000$ extractions.
   * *Success Threshold:* Must remain $\le$ $0.50 per 1,000 cycles using down-swapped models (e.g., Gemini Flash or Claude Haiku).

## 4. Execution of A/B Validations
When swapping a Hot Gateway model (e.g., moving the Ralph Loop from `gpt-4o-mini` to `gemini-2.5-flash`), the developer must run a comparative matrix. 

**Format the results logically:**
| Model | Latency (ms) | Token Cost (1k) | Injection Defense | Hallucination Rate |
| :--- | :--- | :--- | :--- | :--- |
| Model A (Control) | 2100 | $0.20 | 100% | 1.5% |
| Model B (Variant) | 850 | $0.05 | 100% | 3.2% |

By recording hard metrics into `findings.md` and `EXP-XXX.md` files, we self-heal based on measurable reality, not theoretical superiority.
