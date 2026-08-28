# ADR-002: Canonical Integration Manifest & Immutable Release Snapshots

- **Status**: `Accepted`
- **Date**: 2026-08-20
- **Authors**: Personal Finance OS Architecture Team

---

## Context

With four independent repositories evolving concurrently, identifying which combinations of backend, web, and mobile commits have been verified together requires explicit, versioned, and machine-readable metadata.

Relying on repository HEAD branches causes uncoordinated drift where an unverified commit in one repository breaks another.

---

## Decision

1. **Canonical Manifest (`versions/current.yaml`)**:
   - Acts as the single source of truth for the currently selected and actively verified integration set across all repositories.
   - Pinned entries must specify exact 40-character Git commit SHAs, canonical repository URLs, and status.
   - Sibling HEAD commits do not automatically trigger manifest updates; updates are intentional integration events.
2. **Immutable Release Snapshots (`releases/vX.Y.Z[-prerelease].md`)**:
   - When an ecosystem release is validated, an immutable release snapshot document is recorded under `releases/`.
   - Release snapshots preserve historical verification truth and are not updated when subsequent development commits occur.
3. **Release Index (`RELEASES.md`)**:
   - Provides a concise tabular index linking to historical release snapshots without duplicating volatile commit SHAs.

---

## Consequences

- **Positive**: Eliminates version drift, establishes reproducible ecosystem releases, and provides clear historical audit trails.
- **Negative**: Requires machine validation scripts to ensure pinned commit SHAs exist and adhere to strict schemas.
