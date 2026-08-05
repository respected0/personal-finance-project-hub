# Architecture — Personal Finance OS

High-level system architecture. No private implementation details are included here.

Source baseline: `personal-finance-os@66868ec39695b1a78d5cfe9937e801392b37ccd4`

---

## Design Principles

### Financial Correctness First

The system treats financial correctness as a non-negotiable constraint:
- Monetary values use arbitrary-precision arithmetic (`decimal.js`), never IEEE 754 floating point
- All canonical financial calculations are performed exclusively in the backend domain engine
- Client applications (web, mobile) display backend results — they do not recalculate
- Double-entry ledger ensures every financial event balances

### Defense in Depth

- Row-Level Security (RLS) enforces user data isolation at the database level
- Authentication requires MFA (AAL2) for sensitive operations
- Step-up verification (fresh TOTP) for destructive or high-value operations
- API authorization checked independently of database RLS

### Clean Layer Separation

```
Client Layer (Web / Mobile)
  ↓ REST API only
API Layer (Backend Route Handlers)
  ↓ Internal calls
Domain Layer (Business rules, invariants, calculations)
  ↓ Queries only
Data Layer (Drizzle ORM, PostgreSQL, RLS)
```

No layer may bypass layers below it directly from clients.

---

## Repository Split

### Backend (`personal-finance-backend`) — Private

Contains:
- REST API endpoints (Next.js Route Handlers, transitional)
- Domain engine: ledger, postings, investable amounts, recommendations
- Database access layer (Drizzle ORM with RLS)
- Database migrations (Supabase / PostgreSQL)
- OpenAPI contract (canonical source of truth)
- Auth enforcement (AAL1/AAL2, step-up)
- Backend integration tests and RLS test harness

### Web (`personal-finance-web`) — Private

Contains:
- Next.js UI pages and layouts
- React components
- Thin BFF layer: session cookies, auth proxy
- Browser and E2E tests

Does **not** contain:
- Direct database access
- Domain engine or financial calculation logic
- Canonical OpenAPI contract

### Mobile (`personal-finance-mobile`) — Private

Contains:
- Mobile UI (framework to be decided)
- API client consuming backend REST API

Does **not** contain:
- Direct database access
- Domain engine or financial calculation logic
- Canonical OpenAPI contract copy

### Project Hub (`personal-finance-project-hub`) — Public (this repository)

Contains:
- Project documentation and architecture overview
- Versioned cross-repository release metadata
- Integration policy

Does **not** contain:
- Any source code
- Private implementation details
- Credentials or sensitive data

---

## API Contract

The canonical OpenAPI 3.1 specification lives in `personal-finance-backend`.
It is the source of truth for the REST API contract between:
- Backend and Web
- Backend and Mobile

The contract is versioned with the backend and breaking changes are tracked via diff tooling.

---

## Data Classification

Data is classified into sensitivity tiers. High-sensitivity data (account names, transaction parties)
is encrypted at the application layer in addition to database-level RLS isolation.

Authentication credentials and session tokens are never stored in application logs.
Log redaction is enforced at the observability layer.
