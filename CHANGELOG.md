# Changelog — Personal Finance OS Project Hub

All notable changes to the integration hub and project structure will be documented in this file.

---

## [v0.1.0-alpha.1] - 2026-08-20

### Added
- Pinned verified backend commit `92b3064a3ebfa930bd6d37d771483d88fea5ee64` (RC Hardening completed).
- Pinned verified web commit `3382755cd84e0bebd108e3a74b0594ebb0b721e0` (Alpha integration verified).
- Executed master E2E integration verification across all 12 core financial modules (100% PASS).
- Updated `versions/current.yaml` and `RELEASES.md` status to `VERIFIED / PASS`.

### Backend Enhancements Verified
- Structured JSON logging with automated financial and PII redaction scanner (0 violations).
- 40-table multi-tenant RLS matrix security test runner.
- Destructive migration policy scanner and monotonic migration ordering verification.
- Edge sliding-window rate limiting middleware with RFC 7807 problem details.
- Cron-ready deleted account data lifecycle purging routine.
- Canonical OpenAPI TypeScript client type generation.

---

## [v0.1.0-baseline] - 2026-08-06

### Summary
- Monorepo `personal-finance-os@66868ec39695b1a78d5cfe9937e801392b37ccd4` split into four independent repositories:
  - `personal-finance-backend` (PRIVATE)
  - `personal-finance-web` (PRIVATE)
  - `personal-finance-mobile` (PRIVATE)
  - `personal-finance-project-hub` (PUBLIC)
