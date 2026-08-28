# Architecture Decision Records (ADR) — Project Hub

This directory records lightweight architectural decisions governing the `personal-finance-project-hub` repository and cross-repository integration standards.

---

## Status Taxonomy

Every ADR must use one of the following canonical statuses:

| Status | Definition |
|---|---|
| **`Accepted`** | Decision approved and currently active across the ecosystem. |
| **`Amended`** | Core decision remains active, but specific clauses have been modified by a dated amendment in the document. |
| **`Superseded`** | The decision has been fully replaced by a newer ADR (must include a link to the replacement). |
| **`Deprecated`** | The decision is no longer applicable and is preserved strictly for historical context. |
| **`Proposed`** | The decision is under review and not yet binding. |

---

## ADR Index

| ID | Title | Status | Date |
|---|---|---|---|
| [ADR-001](./ADR-001-four-repository-topology.md) | Four-Repository Topology & Hub Zero-Domain-Code Boundary | **Accepted** | 2026-08-06 |
| [ADR-002](./ADR-002-canonical-manifest-and-release-snapshots.md) | Canonical Integration Manifest & Immutable Release Snapshots | **Accepted** | 2026-08-20 |
| [ADR-003](./ADR-003-fast-local-verification-and-ci-governance.md) | Fast Local Verification & GitHub CI Quality Gate Governance | **Accepted** | 2026-08-28 |
