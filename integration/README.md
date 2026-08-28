# Integration Guidelines — Personal Finance OS

This directory documents the integration workflow and local test environment setup for the Personal Finance OS ecosystem.

---

## Core Principles

1. **Domains Verified in Home Repositories**: Backend, Web, and Mobile teams develop and verify changes within their respective repositories.
2. **Hub Uses Explicit Commit Pins**: Hub integration tracking is anchored on explicit 40-character commit SHAs recorded in [versions/current.yaml](../versions/current.yaml).
3. **Zero Domain Code in Hub**: Any defect identified during integration testing is reported with commit SHA evidence to the responsible repository. Never patched in Hub.
4. **Controlled Release Workflow**: Complete workflows for local sibling symlinks and release verification gates are documented in [docs/operations/release-and-integration.md](../docs/operations/release-and-integration.md).
