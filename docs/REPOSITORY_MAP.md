# Repository Architecture Map — personal-finance-project-hub

Living, machine-enforced architecture and file map of `personal-finance-project-hub`.

Every tracked and non-ignored untracked file in this repository is cataloged below with its architectural role. This file is continuously verified by `pnpm repo-map:check` to enforce 100% path coverage.

---

## 1. Root Governance & Documentation

| File Path | Role | Description |
|---|---|---|
| `AGENTS.md` | AI Constitution | Repository-wide permanent constitution, boundary rules, and mandatory 7-dimension task impact lifecycle. |
| `CHANGELOG.md` | Ecosystem Changelog | Human-readable ecosystem release notes and Hub repository governance updates. |
| `package.json` | Tooling Package Config | Minimal private Node.js package configuration for executing local verification scripts. |
| `pnpm-lock.yaml` | Lockfile | Pinned dependency lockfile ensuring reproducible verification tool installation. |
| `README.md` | Public Showcase | Entry point, canonical repository registry, ecosystem architecture overview, and verification guides. |
| `RELEASES.md` | Release Index | Tabular index of all validated ecosystem integration releases linking to immutable records. |
| `.gitignore` | Git Ignore Config | Hardened ignore rules for `node_modules`, secret keys, certificates, and local symlinks. |

---

## 2. CI/CD & Git Automation

| File Path | Role | Description |
|---|---|---|
| `.github/workflows/quality.yml` | CI Quality Gate | GitHub Actions workflow enforcing manifest schema, docs truth, boundaries, repo-map coverage, and regression tests. |
| `.github/workflows/security.yml` | CI Security Scanner | GitHub Actions workflow executing full-history Gitleaks secret scanning. |
| `.githooks/pre-push` | Git Pre-Push Hook | Executable pre-push hook running fast deterministic local verification before every `git push`. |

---

## 3. Architecture & Ecosystem Documentation (`docs/`)

| File Path | Role | Description |
|---|---|---|
| `docs/REPOSITORY_MAP.md` | Living Repo Map | Exhaustive file inventory and architecture map enforcing 100% working-tree path coverage. |
| `docs/architecture.md` | High-Level Architecture | High-level system architecture, 4-repository split, and OpenAPI contract boundaries. |
| `docs/security-and-privacy.md` | Security Posture | Public-safe security and privacy boundaries, secret scanning policies, and data classification. |
| `docs/architecture/shared-context.md` | Shared Context | Cross-repository team roles, boundaries, decimal calculation rules, and API principles. |
| `docs/architecture/adr/README.md` | ADR Index | Canonical taxonomy and index of Architecture Decision Records for the ecosystem. |
| `docs/architecture/adr/ADR-001-four-repository-topology.md` | Architecture Decision | ADR-001: Four-Repository Topology & Hub Zero-Domain-Code Boundary. |
| `docs/architecture/adr/ADR-002-canonical-manifest-and-release-snapshots.md` | Architecture Decision | ADR-002: Canonical Integration Manifest & Immutable Release Snapshots. |
| `docs/architecture/adr/ADR-003-fast-local-verification-and-ci-governance.md` | Architecture Decision | ADR-003: Fast Local Verification & GitHub CI Quality Gate Governance. |
| `docs/operations/github-branch-protection.md` | Operations Guide | Branch protection requirements and status check definitions for GitHub repository settings. |
| `docs/operations/release-and-integration.md` | Operations Guide | Standard operating procedures for testing sibling integrations and staging verified releases. |

---

## 4. Manifests & Releases (`versions/` & `releases/`)

| File Path | Role | Description |
|---|---|---|
| `versions/current.schema.json` | JSON Schema | Machine-readable schema validating `versions/current.yaml` structure, URLs, and 40-char SHAs. |
| `versions/current.yaml` | Canonical Manifest | Single source of truth for the currently selected and verified ecosystem integration set. |
| `releases/v0.1.0-alpha.1.md` | Release Snapshot | Immutable historical integration snapshot for `v0.1.0-alpha.1` with verified component commit pins. |

---

## 5. Verification & Automation Scripts (`scripts/`)

| File Path | Role | Description |
|---|---|---|
| `scripts/check-docs.mjs` | Docs Truth Checker | Automated validator for internal markdown links, canonical URLs, and absence of dead references. |
| `scripts/check-hub-boundaries.mjs` | Zero Domain Guard | Automated checker enforcing that no domain code, API routes, or SQL migrations enter Hub. |
| `scripts/check-manifest.mjs` | Manifest Validator | Deterministic offline validator for YAML parsing, schema compliance, canonical URLs, and 40-char SHAs. |
| `scripts/check-releases.mjs` | Release Checker | Validator for strict SemVer, release record filenames, release pin identity, and `RELEASES.md` index consistency. |
| `scripts/check-repo-map.mjs` | Repo Map Checker | Enforces 100% working-tree path coverage in `REPOSITORY_MAP.md` (detects missing, ghost, duplicate files). |
| `scripts/check-secrets.mjs` | Secret Scanner | Fast regex scanner detecting private keys, API tokens, PATs, JWTs, and forbidden `.env` files. |
| `scripts/release-verify.mjs` | Release Gate Runner | Release verification runner executing quick checks plus local sibling commit object existence checks. |
| `scripts/verify-changed.mjs` | Changed Checker | Changed-file-aware fast verification runner. |
| `scripts/verify-doctor.mjs` | Health Doctor | Environment diagnostics checking Node runtime, Git configuration, and sibling repository presence. |
| `scripts/verify-manifest-refs.mjs` | Sibling Ref Verifier | Verifies pinned commit SHAs against local sibling repository Git object databases. |
| `scripts/verify-quick.mjs` | Fast Local Gate | Master fast local pre-push verification runner executing all checkers in < 2 seconds. |

---

## 6. Tests & Scenarios (`tests/`)

| File Path | Role | Description |
|---|---|---|
| `tests/INTEGRATION_TEST_PLAN.md` | Integration Test Plan | Cross-module integration test scenario definitions, acceptance criteria, and invariant rules. |
| `tests/boundaries.test.mjs` | Regression Test | Unit tests for Hub Zero Domain Code boundary enforcement logic. |
| `tests/docs.test.mjs` | Regression Test | Unit tests for documentation truth and link validation logic. |
| `tests/manifest.test.mjs` | Regression Test | Comprehensive regression tests for manifest schema, URL, and commit SHA validation. |
| `tests/releases.test.mjs` | Regression Test | Unit tests for strict SemVer, release records, and the Release Pin Identity Invariant. |
| `tests/repo-map.test.mjs` | Regression Test | Unit tests for repository map markdown parsing and coverage validation. |
| `tests/secrets.test.mjs` | Regression Test | Unit tests for secret scanner pattern detection and sentinel token verification. |

---

## 7. AI & Agent Tools (`.agents/` & `integration/`)

| File Path | Role | Description |
|---|---|---|
| `.agents/skills/integration/SKILL.md` | Antigravity Skill | Integration test and release coordination workflow skill for AI assistants and developers. |
| `integration/README.md` | Integration Guide | Local integration directory layout and symlink guidelines. |

---

## 8. Ignored & Local Runtime Paths (Architectural Scaffolding)

The following paths are intentionally ignored via `.gitignore` and are not tracked in Git:
- `node_modules/`: Local dependencies installed for tooling scripts.
- `integration/backend-web/`: Local symlinks to `personal-finance-backend` and `personal-finance-web`.
- `integration/backend-mobile/` (and `integration/backend-mobil/`): Local symlinks to `personal-finance-backend` and `personal-finance-mobile`.
- `integration/pull-all.sh`: Local convenience script for pulling all sibling repositories.
- `*.log`, `pnpm-debug.log*`: Local build and debugging logs.
- `.env`, `.env.*`, `*.pem`, `*.key`: Local secrets and credential material.
