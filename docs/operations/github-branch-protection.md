# GitHub Branch Protection Policy — Project Hub

This document defines the required GitHub branch protection settings for `personal-finance-project-hub`.

---

## 1. Branch Protection Requirements

For the `main` branch, the following settings must be configured in GitHub repository settings:

### Pull Request Rules
- **Require a pull request before merging**: Enabled.
- **Require approvals**: Minimum 1 approval.
- **Dismiss stale pull request approvals when new commits are pushed**: Enabled.

### Status Checks (Mandatory CI Authority)
Require status checks to pass before merging:
- **`Verify Manifest, Docs, Repo Map, Boundaries & Unit Tests`** (Workflow: `Quality Checks`, Job: `verify`): Validates manifest schema, release SemVer, zero domain code boundaries, documentation truth, 100% repository map path coverage, secret patterns, and checker regression tests.
- **`Full History Gitleaks Secret Scan`** (Workflow: `Security`, Job: `gitleaks`): Full-history Gitleaks secret scanning across all commits.

### Administrative Controls
- **Require branches to be up to date before merging**: Enabled.
- **Do not allow bypassing the above settings**: Enabled for all contributors and administrators.

---

## 2. Configuration Note

*Note: GitHub repository branch protection settings cannot be fully verified from the local repository filesystem and must be configured directly in GitHub repository administration (`Settings > Branches`).*
