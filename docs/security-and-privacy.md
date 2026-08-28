# Security and Privacy — Personal Finance OS

Public security posture and privacy overview. No sensitive implementation details or attack surface data are included in this public repository.

---

## 1. Public Repository Security Boundaries

The `personal-finance-project-hub` repository operates under strict public data isolation rules:
- **Zero Real Financial Data**: No live financial figures, bank statements, or user data are stored.
- **Zero Application Secrets**: No `.env` files, production API tokens, database connection strings, JWTs, or private certificates exist in this repository.
- **Zero Private Domain Code**: All business logic, database migrations, and proprietary algorithms reside exclusively in private sibling repositories. Machine-enforced via `pnpm boundaries:check`.

---

## 2. Security Controls in Hub

| Control | Mechanism | Enforcement Gate |
|---|---|---|
| **Local Pre-Push Secret Scanning** | Regex-based scanner for API keys, private keys, PATs, and bearer tokens (`scripts/check-secrets.mjs`) | `.githooks/pre-push` |
| **CI Full-History Secret Scanning** | Gitleaks scanning every commit across the entire Git history (`fetch-depth: 0`) | GitHub Actions CI (`.github/workflows/security.yml`) |
| **Manifest & Release Integrity** | Strict SemVer schema validation and SHA format enforcement (`scripts/check-manifest.mjs`, `scripts/check-releases.mjs`) | Local pre-push & GitHub CI |
| **Zero Domain Code Guard** | Path and migration scanner preventing domain implementation leakage (`scripts/check-hub-boundaries.mjs`) | Local pre-push & GitHub CI |
| **Documentation Truth Verification** | Automated scanner verifying canonical URLs, internal links, and absence of dead references (`scripts/check-docs.mjs`) | Local pre-push & GitHub CI |

---

## 3. Ecosystem-Wide Security Architecture (High-Level)

Across the private Personal Finance OS backend and client applications:
- **Authentication**: Powered by Supabase Auth with mandatory Multi-Factor Authentication (AAL2 TOTP) on sensitive actions.
- **Authorization**: Row-Level Security (RLS) policies at the PostgreSQL database layer prevent cross-tenant data access.
- **Data Encryption**: Application-layer AES-256-GCM encryption secures high-sensitivity fields before database persistence.
- **Observability Redaction**: High-level log redaction filters PII, auth headers, and financial tokens prior to telemetry ingestion.

---

## 4. Responsible Disclosure

If you discover a potential security vulnerability in any Personal Finance OS repository, please report it directly to the maintainers rather than opening a public issue.
