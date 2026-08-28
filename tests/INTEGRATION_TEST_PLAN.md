# Integration Test Plan — Personal Finance OS

This document defines the cross-repository integration test scenarios, criteria, and execution requirements for validating Personal Finance OS release candidates.

---

## 1. Scope & Execution Principles

- **Cross-Component Verification**: Scenarios test the interaction between Backend REST API, Web client (Next.js), and Mobile client (React Native / Expo).
- **Execution Location**: Integration tests are executed locally using the symlink scaffolding documented in [docs/operations/release-and-integration.md](../docs/operations/release-and-integration.md) or in end-to-end testing environments.
- **Recording Results**: Test execution outcomes are not stored in this plan; they are recorded immutably in release manifests under [releases/](../releases/) and summarized in [RELEASES.md](../RELEASES.md).

---

## 2. Core Integration Scenarios

### Scenario 1: Backend API Health & Readiness
- **Objective**: Verify backend HTTP server and database pool readiness (`GET /api/v1/health` &rarr; HTTP 200).
- **Pass Criteria**: Database connection active, migration check passes, server responds within acceptable latency thresholds.

### Scenario 2: Web Client to Backend REST API (BFF Proxy)
- **Objective**: Verify Next.js web application communicates with Backend REST API via BFF proxy using server-side cookies.
- **Pass Criteria**: Web client renders backend-calculated accounts and ledger summaries without direct database connections.

### Scenario 3: Mobile Client to Backend REST API
- **Objective**: Verify mobile application securely communicates with backend API endpoints over HTTPS.
- **Pass Criteria**: Mobile client parses typed JSON responses conforming to OpenAPI 3.1 schema.

### Scenario 4: Authentication & MFA Session Lifecycle
- **Objective**: User login, AAL1 session establishment, TOTP challenge upgrade to AAL2, and secure logout.
- **Pass Criteria**: HttpOnly session cookies issued with correct `SameSite` and `Secure` attributes; token refresh flows succeed.

### Scenario 5: Authorization & Multi-Tenant RLS Isolation
- **Objective**: Requesting tenant data with unauthenticated or mismatched tenant credentials.
- **Pass Criteria**: Backend rejects unauthorized requests with HTTP 401/403; database RLS policies prevent cross-tenant data leakage.

### Scenario 6: Financial Ledger & Invariant Consistency
- **Objective**: Double-entry bookkeeping execution across income, expense, card installment, and inter-account transfer flows.
- **Pass Criteria**: Sum of debits strictly equals sum of credits; zero floating-point rounding errors; balance reconciliation matches calculated ledger totals.

### Scenario 7: Schema Validation & RFC 7807 Error Handling
- **Objective**: Submitting invalid or out-of-range payload parameters (negative amounts, invalid ISO currency codes).
- **Pass Criteria**: Backend responds with HTTP 422 Unprocessable Entity containing RFC 7807 structured Problem Details with specific validation issue paths.

### Scenario 8: Observability & Log Redaction
- **Objective**: Inspecting application and proxy logs during high-volume operations.
- **Pass Criteria**: Passwords, OTP codes, session tokens, and sensitive account details are redacted in all structured log outputs.
