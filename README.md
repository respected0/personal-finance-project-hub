# Personal Finance OS — Project Hub

Public project showcase, canonical repository registry, and verified integration manifest authority for the Personal Finance OS ecosystem.

- **Visibility**: 🌐 PUBLIC
- **Canonical Manifest**: [versions/current.yaml](./versions/current.yaml)
- **Release Index**: [RELEASES.md](./RELEASES.md)
- **Repository Map**: [docs/REPOSITORY_MAP.md](./docs/REPOSITORY_MAP.md)

> ⚠️ **Strict Boundary Notice**: This repository does not contain application source code, API route handlers, SQL migrations, database schemas, or secrets. All domain implementation logic lives exclusively in private sibling repositories.

---

## 1. Canonical Repository Registry

The Personal Finance OS ecosystem is structured across four decoupled repositories:

| Repository | Visibility | Canonical URL | Role & Responsibilities |
|---|---|---|---|
| **Backend** | 🔒 PRIVATE | [`respected0/personal-finance-backend`](https://github.com/respected0/personal-finance-backend) | Canonical financial domain engine (`decimal.js`), Drizzle ORM, PostgreSQL database & RLS security matrix, REST API route handlers, and OpenAPI 3.1 contract. |
| **Web** | 🔒 PRIVATE | [`eyupturkoglu/personal-finance-web`](https://github.com/eyupturkoglu/personal-finance-web) | Next.js web application, React UI components, HttpOnly cookie session proxy, and client state. |
| **Mobile** | 🔒 PRIVATE | [`Shiize/personal-finance-mobile`](https://github.com/Shiize/personal-finance-mobile) | Mobile client application screens, local secure session storage, and REST API integration. |
| **Project Hub** | 🌐 PUBLIC | [`respected0/personal-finance-project-hub`](https://github.com/respected0/personal-finance-project-hub) | Public showcase, canonical repository registry, verified integration manifest authority, and release governance. |

---

## 2. System Architecture

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                           Personal Finance OS                            │
│                                                                          │
│  ┌──────────────────────┐                      ┌──────────────────────┐  │
│  │   Web Application    │◄───── REST API ─────►│     Backend API      │  │
│  │  (Next.js App Router)│                      │(Next.js Route Handler│  │
│  └──────────────────────┘                      └──────────┬───────────┘  │
│                                                           │              │
│  ┌──────────────────────┐                      ┌──────────▼───────────┐  │
│  │  Mobile Application  │◄───── REST API ─────►│    Domain Engine     │  │
│  │ (React Native / Expo)│                      │(decimal.js, ledger)  │  │
│  └──────────────────────┘                      └──────────┬───────────┘  │
│                                                           │              │
│  (Direct DB Access Strictly                    ┌──────────▼───────────┐  │
│   Prohibited for Clients)                      │ PostgreSQL DB + RLS  │  │
│                                                └──────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

For complete architectural breakdowns and decision records, see:
- [High-Level Architecture](docs/architecture.md)
- [Shared Project Context & Boundaries](docs/architecture/shared-context.md)
- [Architecture Decision Records (ADR)](docs/architecture/adr/README.md)
- [Security & Privacy Posture](docs/security-and-privacy.md)

---

## 3. Integration & Release Governance

- **Manifest Authority**: The active integration set is tracked in [versions/current.yaml](./versions/current.yaml).
- **Immutable Release History**: Historical release snapshots are archived under [releases/](./releases/) and indexed in [RELEASES.md](./RELEASES.md).
- **Zero Sibling Auto-Chasing**: Sibling development commits do not automatically mutate Hub manifests; pins advance only through explicit integration cycles.
- **Workflow Guide**: See [docs/operations/release-and-integration.md](docs/operations/release-and-integration.md) for local symlink setup and release verification procedures.

---

## 4. Local Development & Verification Commands

| Command | Purpose | Target Execution Time |
|---|---|---|
| `pnpm verify:quick` | Fast local pre-push gate (manifest, releases, docs, repo-map, secrets, unit tests) | < 2 seconds |
| `pnpm verify:changed` | Changed-file-aware fast verification | < 2 seconds |
| `pnpm manifest:check` | Deterministic offline manifest schema and SHA format validation | < 200 ms |
| `pnpm manifest:verify-refs` | Verify pinned commit SHAs against local sibling clones | < 500 ms |
| `pnpm docs:check` | Validate markdown links, canonical URLs, and documentation truth | < 500 ms |
| `pnpm repo-map:check` | Ensure 100% path coverage of working tree in REPOSITORY_MAP.md | < 200 ms |
| `pnpm release:check` | Validate SemVer formatting and release index consistency | < 200 ms |
| `pnpm security:secret-scan` | Fast regex-based credential and secret scanner | < 300 ms |
| `pnpm test:unit` | Run checker regression test suite | < 500 ms |
| `pnpm release:verify` | Comprehensive release gate including sibling object verification | < 3 seconds |
