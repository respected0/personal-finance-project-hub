# Hub & Integration Constitution — personal-finance-project-hub

This document defines the permanent rules, responsibilities, architectural boundaries, and task execution lifecycle for all AI assistants and developers working in `personal-finance-project-hub`.

---

## 1. Hub Role & Core Responsibilities

The Project Hub repository is the **public coordination center, canonical repository registry, verified integration manifest authority, and public showcase** for the Personal Finance OS ecosystem.

### Core Duties
1. **Canonical Repository Registry**: Maintain the single authoritative machine-readable registry of ecosystem repositories in `versions/current.yaml`.
2. **Integration Pinning**: Record and pin verified commit SHAs across Backend, Web, and Mobile repositories.
3. **Release Governance**: Record immutable historical release snapshots under `releases/` and maintain the release index in `RELEASES.md`.
4. **Public Documentation & Showcase**: Maintain high-level public architecture, security posture, and integration guides without exposing private domain code, SQL migrations, internal fixtures, or secrets.
5. **Quality & Verification Gates**: Enforce 100% repository map coverage, manifest schema validity, documentation truth, and secret scanning via fast local verification and GitHub CI.

---

## 2. Strict Architectural Boundaries (Prohibitions)

- **Zero Domain Code in Hub**: No application source code, API handlers, database queries, or UI components belong in Hub.
- **Zero In-Hub Domain Patching**: If a bug is found in backend, web, or mobile logic during integration testing, it must be reported with commit SHA evidence to the responsible repository. Never patch domain code here.
- **Zero Private Artifacts**: Never commit full OpenAPI specifications, internal database migration files, private test fixtures, or backend seed data to this public repository.
- **Zero Secrets & Credentials**: Never commit `.env` files, API keys, database connection strings, JWTs, or real financial data.
- **No Sibling HEAD Auto-Chasing**: `versions/current.yaml` represents the intentionally selected and verified integration set, not an automatic mirror of sibling repositories' latest development HEAD commits.
- **No Unproven Status Claims**: Never mark a test plan, manifest, or release record as `PASS` or `VERIFIED` without actual, reproducible verification evidence.

---

## 3. Mandatory Task Impact Lifecycle

For every task executed in this repository, the developer or AI assistant MUST automatically evaluate and apply the following impact dimensions in the same task:

### 1. Code / Tooling Impact
Assess whether scripts in `scripts/`, configs, or package runners require updates.

### 2. Integration Impact
Classify the integration scope of the change:
- `NONE`: Documentation tweaks, internal tooling enhancements, or minor comment updates.
- `REPOSITORY REGISTRY`: Changes to canonical repository URLs, owners, or repository topology.
- `MANIFEST`: Updating integration candidate commit pins in `versions/current.yaml`.
- `RELEASE CANDIDATE`: Staging a pre-release validation cycle (`alpha.N`, `beta.N`, `rc.N`).
- `VERIFIED RELEASE`: Finalizing an integration release with verified test records.
- `COMPATIBILITY`: Documenting cross-repository contract compatibility matrices.

### 3. Test Impact
If validator logic in `scripts/` changes, corresponding regression tests in `tests/` must be added or updated.

### 4. Documentation Impact
Every change must maintain Documentation Truth: zero dead links, zero references to nonexistent files, zero obsolete repository URLs, and zero contradictory status claims across markdown documents.

### 5. Security Impact
Ensure no sensitive data or credentials are introduced. Run fast local secret scanning before completing any change.

### 6. Version / Release Impact
Evaluate whether the task impacts the ecosystem release version:
- `NONE`: Tooling, documentation, CI, or repository maintenance (default for Hub-internal work).
- `PATCH`: Backward-compatible ecosystem integration fix.
- `MINOR`: New backward-compatible ecosystem feature module integrated.
- `MAJOR`: Breaking cross-repository API or protocol change.
- `PRE-RELEASE ADVANCE`: Progressing through `alpha.N` → `beta.N` → `rc.N`.

### 7. Repository Map Impact
If any file is created, moved, or deleted, update [docs/REPOSITORY_MAP.md](file:///home/furkan/projects/kisisel-finans-os-bootstrap/personal-finance-project-hub/docs/REPOSITORY_MAP.md) in the exact same task and verify with `pnpm repo-map:check`.

---

## 4. Canonical Verification Commands

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
| `pnpm release:verify` | Comprehensive release gate including sibling object verification | < 3 seconds |

---

## 5. Local Integration Scaffolding

- `integration/backend-web/` and `integration/backend-mobile/` contain local symlinks to sibling repositories for side-by-side integration testing.
- These folders are listed in `.gitignore` and must never be committed.
- See [docs/operations/release-and-integration.md](file:///home/furkan/projects/kisisel-finans-os-bootstrap/personal-finance-project-hub/docs/operations/release-and-integration.md) for complete workflows.
