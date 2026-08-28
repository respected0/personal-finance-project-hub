# Changelog — Personal Finance OS Project Hub

All notable ecosystem integration changes and Hub repository governance updates are documented in this file.

---

## [Unreleased]

### Added
- Automated manifest schema validation (`scripts/check-manifest.mjs`).
- Automated documentation truth checker (`scripts/check-docs.mjs`).
- Living exhaustive repository map and automated coverage checker (`scripts/check-repo-map.mjs`).
- Automated release consistency checker (`scripts/check-releases.mjs`).
- Fast secret scanner and local pre-push verification hook (`.githooks/pre-push`).
- Lightweight ADR governance framework with foundational architecture decision records.

---

## [v0.1.0-alpha.1] - 2026-08-20

### Added
- Initial Alpha 1 integration milestone across core financial modules.
- Backend RC Hardening verified (RLS security matrix, log redaction, sliding-window rate limiter).
- Web client to Backend REST API Alpha integration verified.
- Cross-repository version manifest and release recording infrastructure established.

---

## [v0.1.0-baseline] - 2026-08-06

### Initial Split
- Four-repository architecture established:
  - `personal-finance-backend` (PRIVATE)
  - `personal-finance-web` (PRIVATE)
  - `personal-finance-mobile` (PRIVATE)
  - `personal-finance-project-hub` (PUBLIC)
