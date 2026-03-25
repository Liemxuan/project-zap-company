# adr-001: The Redis Mandate vs .NET In-Memory Cache

**Date:** March 1, 2026
**Topic:** Directing Vuong on the 100,000 User Minimum Baseline
**Status:** APPROVED & MANDATED

## 1. The Directive

Vuong advocated for leveraging .NET 9's built-in `MemoryCache` and `OutputCache` to avoid the infrastructure cost of Redis. For a monolith running on a single server, he is correct.

For the **OLYMPUS Foundation** running across dynamic Kubernetes pods (VN/EU) serving 100,000 users, **relying purely on primitive in-memory caching is a fatal economic and architectural flaw.**

We will implement a dual-tier caching strategy via **.NET 9 HybridCache**, utilizing Redis as the distributed Session/State backbone.

## 2. The Mathematical Proof (Why In-Memory Fails at Scale)

At 100,000 active users, An will distribute traffic via K8s load balancers across multiple .NET 9 API pods (e.g., 20 pods) to prevent CPU throttling.

**The "Memory Duplication" Tax:**
If our active product catalog and session state is roughly 1GB of data:

* **Redis Model:** We pay $30/month for a 2GB managed Redis cluster. All 20 API pods read off this single cluster. The .NET pods require only ~256MB of RAM each.
* **In-Memory Model:** Because K8s pods cannot share RAM, every single one of the 20 pods must independently fetch from Postgres and cache that 1GB of data. We are now paying for 20GB of RAM across the cluster, forcing us onto much more expensive, heavy node instances.

**The Database Assassination:**
In-Memory caches die when a pod spins down. In a Kubernetes environment, pods scale up and down constantly based on traffic.

* Every time K8s scales up 5 new pods for a traffic spike, those 5 pods boot with **empty caches**.
* They immediately slam the Postgres primary database with thousands of identical queries to build their local caches, triggering a database connection limit fault (the "Thundering Herd" problem).

**The Invalidation Nightmare:**
If a merchant updates a price, clearing `MemoryCache` on the pod that received the PUT request does nothing for the other 19 pods. Users hitting different pods will see different prices, causing massive support queues and financial desyncs. Redis provides Pub/Sub invalidation out of the box.

## 3. The Execution Plan (Vuong's Implementation)

Vuong, do not rip out the .NET caching. Instead, wire it into the modern `HybridCache` architecture.

1. **L1 (Local K8s Pod RAM):** Use `MemoryCache` exclusively for ultra-small, static data that rarely changes (e.g., Global Tax Rates, Application Configs, JWT validation keys).
2. **L2 (Redis Cluster):** Use Distributed Redis for the heavy lifting: User Sessions, the full Product Catalog, and Rate Limiting.
3. **Fallback:** If Redis blips, `HybridCache` falls back to the local memory layer automatically.

**Conclusion:**
We eat the $30/month Redis cost to keep the K8s pods stateless, cheap, and disposable. We protect the Postgres database from the Thundering Herd. This is non-negotiable for 100k scale.
