# Changelog — Personal Finance OS Project Hub

All notable changes to the integration hub and project structure will be documented in this file.

---

## [Unreleased]

### Added
- Working foundations for backend, web, mobile, and hub repositories.
- Canonical version manifest `versions/current.yaml` pinned with initial baseline SHAs.
- Cross-repository integration test plan (`tests/INTEGRATION_TEST_PLAN.md`).
- Alpha release manifest `releases/v0.1.0-alpha.1.md` (Status: PLANNED / NOT TESTED).

---

## [v0.1.0-baseline] - 2026-08-06

### Summary
- Monorepo `personal-finance-os@66868ec39695b1a78d5cfe9937e801392b37ccd4` split into four independent repositories:
  - `personal-finance-backend` (PRIVATE)
  - `personal-finance-web` (PRIVATE)
  - `personal-finance-mobile` (PRIVATE)
  - `personal-finance-project-hub` (PUBLIC)
