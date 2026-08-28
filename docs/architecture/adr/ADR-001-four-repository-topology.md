# ADR-001: Four-Repository Topology & Hub Zero-Domain-Code Boundary

- **Status**: `Accepted`
- **Date**: 2026-08-06
- **Authors**: Personal Finance OS Architecture Team

---

## Context

The Personal Finance OS is composed of multiple independent domains:
- Backend financial ledger, database layer, and canonical OpenAPI contracts.
- Web client (Next.js) with session proxy.
- Mobile client.
- Public showcase and cross-repository release coordination.

Maintaining these in a single monolithic repository or mixing domain source code into the public coordination repository risks secret leakage, cross-domain coupling, and confusion over canonical authorities.

---

## Decision

1. The ecosystem is split into four distinct repositories:
   - `personal-finance-backend` (PRIVATE): Canonical domain engine, database, and OpenAPI contracts.
   - `personal-finance-web` (PRIVATE): Next.js web application.
   - `personal-finance-mobile` (PRIVATE): Mobile client.
   - `personal-finance-project-hub` (PUBLIC): Coordination, manifests, and public showcase.
2. The Hub repository strictly enforces a **Zero Domain Code** policy:
   - No application source code, UI components, database queries, or SQL migrations reside in Hub.
   - Domain bugs discovered during integration must be reported with commit SHAs and fixed in their respective repositories. Never patched in Hub.

---

## Consequences

- **Positive**: Clean separation of concerns, zero accidental leakage of private business logic or database structure, and independent deployment lifecycles for backend, web, and mobile.
- **Negative**: Requires explicit cross-repository commit pinning and validation tooling in Hub.
