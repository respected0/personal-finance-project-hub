# Architecture — Personal Finance OS

High-level system architecture and integration topology. No private domain implementation details are included in this public repository.

---

## 1. Design Principles

### Financial Correctness First
The Personal Finance OS ecosystem treats exact financial correctness as a non-negotiable constraint:
- Monetary calculations use arbitrary-precision arithmetic (`decimal.js`), never IEEE 754 floating-point numbers.
- All canonical calculations (ledger postings, investable amounts, credit card balances) are performed exclusively in the backend domain engine.
- Client applications (web, mobile) display backend-computed results — they do not recalculate financial totals.
- A double-entry ledger ensures that every financial transaction balances debit and credit entries.

### Defense in Depth & Data Isolation
- PostgreSQL Row-Level Security (RLS) enforces multi-tenant user data isolation at the database tier.
- Authentication requires Multi-Factor Authentication (AAL2 MFA / TOTP) for sensitive operations.
- Application-layer encryption (AES-256-GCM) protects high-sensitivity fields before database insertion.
- REST API authorization is verified independently of database-level RLS policies.

### Clean Layer Separation

```text
┌────────────────────────────────────────────────────────────────┐
│  Client Applications (Web / Mobile)                           │
└───────────────────────────────┬────────────────────────────────┘
                                │ REST API Only (BFF / HTTPS)
                                ▼
┌────────────────────────────────────────────────────────────────┐
│  API Gateway & Route Handlers (Next.js App Router API)         │
└───────────────────────────────┬────────────────────────────────┘
                                │ Domain Engine Invocations
                                ▼
┌────────────────────────────────────────────────────────────────┐
│  Domain Layer (decimal.js calculations, invariants, ledger)    │
└───────────────────────────────┬────────────────────────────────┘
                                │ Typed ORM Queries
                                ▼
┌────────────────────────────────────────────────────────────────┐
│  Data Layer (Drizzle ORM, PostgreSQL + RLS, Supabase Auth)     │
└────────────────────────────────────────────────────────────────┘
```

Clients are strictly prohibited from bypassing the API layer or connecting directly to the database.

---

## 2. Four-Repository Topology

The ecosystem is partitioned into four decoupled repositories with distinct boundaries:

| Repository | Visibility | Role & Boundaries |
|---|---|---|
| [`personal-finance-backend`](https://github.com/respected0/personal-finance-backend) | 🔒 PRIVATE | Canonical financial domain engine, Drizzle ORM database access, SQL migrations, RLS security matrix, REST API route handlers, and the canonical OpenAPI 3.1 contract. |
| [`personal-finance-web`](https://github.com/eyupturkoglu/personal-finance-web) | 🔒 PRIVATE | Next.js web application, UI components, HttpOnly cookie session proxy, and browser E2E flows. |
| [`personal-finance-mobile`](https://github.com/Shiize/personal-finance-mobile) | 🔒 PRIVATE | Mobile application screens, local navigation, secure credential storage, and REST API integration. |
| [`personal-finance-project-hub`](https://github.com/respected0/personal-finance-project-hub) | 🌐 PUBLIC | Ecosystem coordination center, canonical repository registry, verified integration manifest (`versions/current.yaml`), and public showcase. Zero domain code. |

For detailed responsibilities, see [docs/architecture/shared-context.md](./architecture/shared-context.md) and [docs/architecture/adr/ADR-001-four-repository-topology.md](./architecture/adr/ADR-001-four-repository-topology.md).

---

## 3. OpenAPI Contract & Version Pinning

- The canonical OpenAPI 3.1 specification resides in `personal-finance-backend` under `packages/contracts/openapi/openapi.yaml`.
- Client applications consume typed client bindings generated directly from this contract.
- Sibling repository commits that have been verified together are pinned in [versions/current.yaml](../versions/current.yaml) and archived in [releases/](../releases/).
