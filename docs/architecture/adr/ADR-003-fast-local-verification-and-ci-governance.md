# ADR-003: Fast Local Verification & GitHub CI Quality Gate Governance

- **Status**: `Accepted`
- **Date**: 2026-08-28
- **Authors**: Personal Finance OS Architecture Team

---

## Context

Without automated quality gates, documentation, manifest YAMLs, and repository paths drift over time. Relying on manual human memory to update file inventories, verify URLs, and scan for accidental secret leakage leads to corrupted manifests and broken links.

---

## Decision

1. **Lightweight Tooling Runner**:
   - Introduce minimal Node.js tooling scripts in `scripts/` using modern ES modules.
   - Keep `package.json` private and restricted to verification runners without application framework dependencies.
2. **Two-Tier Verification Gate**:
   - **Fast Local Gate (`pnpm verify:quick` / `.githooks/pre-push`)**: Deterministic, offline, and executes in < 2 seconds. Validates manifest schema, release SemVer, documentation truth, 100% repository map path coverage, secret patterns, and checker regression tests.
   - **CI Quality Gate (`.github/workflows/ci.yml` & `security.yml`)**: Mandated GitHub Actions authority validating full PRs, pushes, Gitleaks history scanning, and dependency security.
3. **Living Repository Map (`docs/REPOSITORY_MAP.md`)**:
   - Machine-enforce 100% path coverage for all tracked and non-ignored working tree files.

---

## Consequences

- **Positive**: Complete automated protection against manifest corruption, broken links, secret leaks, and unmapped files.
- **Negative**: Adds a small local development dependency on Node.js / pnpm for tooling execution.
