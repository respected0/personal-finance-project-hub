# Changelog — Personal Finance OS

All notable changes to the project are documented here.

---

## [Unreleased] — PRE-RC Repository Split

### 2026-08-06

- Repository split from monorepo `personal-finance-os@66868ec`
- Four repositories initialized:
  - `respected0/personal-finance-backend` (private)
  - `respected0/personal-finance-web` (private)
  - `respected0/personal-finance-mobile` (private)
  - `respected0/personal-finance-project-hub` (public, this repository)
- Backend contains: domain engine, database layer, API handlers, migrations, OpenAPI contract
- Web contains: UI pages, components, thin BFF auth layer
- Mobile contains: framework-neutral boundaries (framework decision pending)
- Hub contains: public project metadata and integration versioning

### PRE-RC Baseline Features (from monorepo)

The PRE-RC baseline includes the following implemented features:

- Ledger kernel with double-entry posting engine (p0-a0)
- Daily core: accounts, transactions, categories, counterparties (p0-a1)
- Card flows and subscriptions (p0-a2)
- Sharing and receivables (p0-a2)
- Reconciliation and reversal (p0-a3)
- Monthly reports and versioning (p0-a3)
- Data lifecycle (p0-a3)
- Budget and goals (p0-b1)
- Expected payments and investable amounts (p0-b1)
- Instrument prices (p0-b2)
- Investment trades and lots (p0-b2)
- Recommendations engine (p0-b3)
- Monthly reviews (p0-b3)
- Auth with MFA/AAL2 and step-up verification
- RLS-enforced data isolation
- OpenAPI 3.1 contract
