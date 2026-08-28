# Release and Integration Guide — Personal Finance OS

This document outlines the standard operating procedures for testing cross-repository integrations, pinning verified commits, and recording releases in `personal-finance-project-hub`.

---

## 1. Local Sibling Repository Layout

For side-by-side local integration testing, sibling repositories are cloned adjacent to the Hub directory:

```text
workspace/
├── personal-finance-backend/     (PRIVATE repo clone)
├── personal-finance-web/         (PRIVATE repo clone)
├── personal-finance-mobile/      (PRIVATE repo clone)
└── personal-finance-project-hub/ (This repository)
    └── integration/
        ├── backend-web/
        │   ├── backend → symlink → ../../../personal-finance-backend
        │   └── web     → symlink → ../../../personal-finance-web
        └── backend-mobile/
            ├── backend → symlink → ../../../personal-finance-backend
            └── mobile  → symlink → ../../../personal-finance-mobile
```

*Note: Symlink directories are ignored by Git (`.gitignore`) to prevent accidental commits.*

---

## 2. Integration Testing Workflow

1. **Synchronize Sibling Clones**:
   Ensure local sibling repositories are on the intended integration candidate commits.
2. **Execute Cross-Repo Validation**:
   Start Backend API and Web/Mobile clients. Run the test scenarios defined in [tests/INTEGRATION_TEST_PLAN.md](../../tests/INTEGRATION_TEST_PLAN.md).
3. **Stage New Manifest Pins**:
   Update commit SHAs in [versions/current.yaml](../../versions/current.yaml) with the verified 40-character commit hashes.
4. **Validate Locally**:
   ```bash
   pnpm manifest:check
   pnpm manifest:verify-refs
   pnpm verify:quick
   ```

---

## 3. Release Lifecycle & Governance

```
alpha.1 → alpha.2 → ... → beta.1 → ... → rc.1 → stable
```

### Staging an Integration Release
1. **Create Immutable Release Record**:
   Add `releases/v<version>.md` containing the exact commit pins, date, scope summary, and verification evidence.
2. **Update Release Index**:
   Add an entry to the table in [RELEASES.md](../../RELEASES.md).
3. **Update Manifest**:
   Update `release.target_version` and `release.status` in [versions/current.yaml](../../versions/current.yaml).
4. **Run Full Release Verification Gate**:
   ```bash
   pnpm release:verify
   ```
5. **Tagging (Authorized Release Event Only)**:
   Git tags (e.g. `v0.1.0-alpha.1`) are created only when an integration release is explicitly authorized and finalized.
