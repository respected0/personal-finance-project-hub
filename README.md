# Personal Finance OS — Project Hub

Public project visibility center for the Personal Finance OS.

> ⚠️ **This repository does not contain source code.**
> Backend, web, and mobile source code are maintained in private repositories.
> This hub contains only public-safe project metadata, architecture overview, and integration versioning.

---

## What Is This?

The Personal Finance OS is a personal financial management system built with financial correctness as the primary design constraint.

This hub serves as the **public project showcase** and **integration coordination center**:
- High-level architecture documentation
- Versioned release coordination between private repositories
- Integration policy and validation process
- Technology summary (non-sensitive)

---

## Repositories

| Repository | Visibility | Description |
|---|---|---|
| `respected0/personal-finance-backend` | 🔒 Private | Backend API, domain engine, database |
| `respected0/personal-finance-web` | 🔒 Private | Web frontend, UI components |
| `respected0/personal-finance-mobile` | 🔒 Private | Mobile application (framework TBD) |
| `respected0/personal-finance-project-hub` | 🌐 Public | This repository |

---

## Architecture Overview

The system is split into three independent layers:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Personal Finance OS                              │
│                                                                      │
│  ┌──────────────┐                   ┌──────────────────────────────┐ │
│  │  Web Client  │◄──── REST API ───►│  Backend API                 │ │
│  │  (Next.js)   │                   │  (Next.js Route Handlers)    │ │
│  └──────────────┘                   │                              │ │
│                                     │  ┌────────────────────────┐  │ │
│  ┌──────────────┐                   │  │ Domain Engine          │  │ │
│  │    Mobile    │◄──── REST API ───►│  │ (decimal.js, Zod)      │  │ │
│  │  (TBD)       │                   │  ├────────────────────────┤  │ │
│  └──────────────┘                   │  │ Database Layer         │  │ │
│                                     │  │ (Drizzle ORM, RLS)     │  │ │
│                                     │  ├────────────────────────┤  │ │
│                                     │  │ Supabase / PostgreSQL  │  │ │
│                                     │  └────────────────────────┘  │ │
│                                     └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Financial Correctness Principles

The system is designed with strict financial correctness guarantees:

1. **No JavaScript `number` for money** — All canonical calculations use `decimal.js`
2. **Ledger-based double-entry accounting** — Every transaction results in balanced postings
3. **Canonical calculations in backend only** — Net worth, investable amounts, report totals are never recalculated on clients
4. **RLS-enforced data isolation** — Row-Level Security ensures user data isolation at the database level
5. **Idempotent writes** — Transaction creation is idempotent to prevent duplicate entries
6. **Revision and reversal** — Financial corrections use proper ledger revision/reversal patterns (no deletes of posted entries)
7. **Offline drafts clearly marked** — Mobile offline records are labeled as drafts until backend confirms

---

## Technology Summary (Non-Sensitive)

| Component | Technology |
|---|---|
| Backend API | Next.js 16 (Route Handlers, API-only) |
| Domain engine | TypeScript, decimal.js |
| Database ORM | Drizzle ORM |
| Database | Supabase (PostgreSQL with RLS) |
| Auth | Supabase Auth (MFA/AAL2 supported) |
| API contracts | OpenAPI 3.1, Zod |
| Web frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Package manager | pnpm 11 (workspaces) |
| Runtime | Node.js 24 |
| Mobile | To be decided |

---

## Current Status

**PRE-RC — Repository Split Phase**

Source baseline: `personal-finance-os@66868ec39695b1a78d5cfe9937e801392b37ccd4`

The monorepo has been split into four separate repositories. Initial commits are in place.
Integration validation and RC preparation are pending.

See `versions/current.yaml` for per-repository version pins.

---

## What Is NOT in This Repository

The following are **not** and **will never be** published here:

- Backend, web, or mobile source code
- Database schema details or migration files
- Private OpenAPI specification (full contract)
- Environment variables, secrets, tokens, or credentials
- Production endpoints or infrastructure configuration
- Private test fixtures or real financial data
- Detailed security implementation details

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
