import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { validateReleases } from '../scripts/check-releases.mjs';

test('Release Validation - current workspace releases pass', () => {
  const result = validateReleases(process.cwd());
  assert.equal(result.valid, true, `Expected valid, got errors: ${result.errors.join(', ')}`);
  assert.ok(result.releaseCount >= 1);
});

test('Release Identity Invariant - same version with conflicting pins FAILS', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-release-test-'));
  fs.mkdirSync(path.join(tmpDir, 'releases'));
  fs.mkdirSync(path.join(tmpDir, 'versions'));

  // Historical release record for 0.1.0-alpha.1 with pins A/B/C
  const releaseContent = `
# Release Manifest — v0.1.0-alpha.1
- **Target Version**: 0.1.0-alpha.1

| Component | Repository | Commit SHA | Verified Status |
|---|---|---|---|
| **Backend** | \`https://github.com/respected0/personal-finance-backend\` | \`92b3064a3ebfa930bd6d37d771483d88fea5ee64\` | PASS |
| **Web** | \`https://github.com/eyupturkoglu/personal-finance-web\` | \`3382755cd84e0bebd108e3a74b0594ebb0b721e0\` | PASS |
| **Mobile** | \`https://github.com/Shiize/personal-finance-mobile\` | \`493c27bbf58746975a46fb0f7836f890187e4e87\` | PASS |
`;
  fs.writeFileSync(path.join(tmpDir, 'releases/v0.1.0-alpha.1.md'), releaseContent);

  // RELEASES.md index
  fs.writeFileSync(
    path.join(tmpDir, 'RELEASES.md'),
    '| `v0.1.0-alpha.1` | [releases/v0.1.0-alpha.1.md](./releases/v0.1.0-alpha.1.md) |'
  );

  // Current manifest attempting to reuse same version 0.1.0-alpha.1 with DIFFERENT pins D/E/F
  const manifestYaml = `
format_version: "1.0"
components:
  backend:
    repository: "respected0/personal-finance-backend"
    url: "https://github.com/respected0/personal-finance-backend"
    commit: "83e3e0a82b266a94bc4f3ad1408fee134429317a"
    branch: "main"
    status: "verified"
  web:
    repository: "eyupturkoglu/personal-finance-web"
    url: "https://github.com/eyupturkoglu/personal-finance-web"
    commit: "4843f47b262c7d5ad9bb7fc73a2c8f1dbf809504"
    branch: "main"
    status: "verified"
  mobile:
    repository: "Shiize/personal-finance-mobile"
    url: "https://github.com/Shiize/personal-finance-mobile"
    commit: "ad43b786cff3a2546bf00b291848b90d9b5da15b"
    branch: "main"
    status: "verified"
release:
  target_version: "0.1.0-alpha.1"
  status: "verified_pass"
`;
  fs.writeFileSync(path.join(tmpDir, 'versions/current.yaml'), manifestYaml);

  const result = validateReleases(tmpDir);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some(e => e.includes('Release version 0.1.0-alpha.1 cannot represent multiple immutable pin sets.')),
    `Expected multiple pin sets error, got: ${result.errors.join(', ')}`
  );

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('Release Identity Invariant - next prerelease (0.1.0-alpha.2) with new pins PASSES', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-release-test-'));
  fs.mkdirSync(path.join(tmpDir, 'releases'));
  fs.mkdirSync(path.join(tmpDir, 'versions'));

  // Historical release record for 0.1.0-alpha.1
  const releaseContent = `
# Release Manifest — v0.1.0-alpha.1
- **Target Version**: 0.1.0-alpha.1

| Component | Repository | Commit SHA | Verified Status |
|---|---|---|---|
| **Backend** | \`https://github.com/respected0/personal-finance-backend\` | \`92b3064a3ebfa930bd6d37d771483d88fea5ee64\` | PASS |
| **Web** | \`https://github.com/eyupturkoglu/personal-finance-web\` | \`3382755cd84e0bebd108e3a74b0594ebb0b721e0\` | PASS |
| **Mobile** | \`https://github.com/Shiize/personal-finance-mobile\` | \`493c27bbf58746975a46fb0f7836f890187e4e87\` | PASS |
`;
  fs.writeFileSync(path.join(tmpDir, 'releases/v0.1.0-alpha.1.md'), releaseContent);

  // RELEASES.md index
  fs.writeFileSync(
    path.join(tmpDir, 'RELEASES.md'),
    '| `v0.1.0-alpha.1` | [releases/v0.1.0-alpha.1.md](./releases/v0.1.0-alpha.1.md) |'
  );

  // Current manifest advancing to 0.1.0-alpha.2 as candidate with new pins
  const manifestYaml = `
format_version: "1.0"
components:
  backend:
    repository: "respected0/personal-finance-backend"
    url: "https://github.com/respected0/personal-finance-backend"
    commit: "83e3e0a82b266a94bc4f3ad1408fee134429317a"
    branch: "main"
    status: "verified"
  web:
    repository: "eyupturkoglu/personal-finance-web"
    url: "https://github.com/eyupturkoglu/personal-finance-web"
    commit: "4843f47b262c7d5ad9bb7fc73a2c8f1dbf809504"
    branch: "main"
    status: "verified"
  mobile:
    repository: "Shiize/personal-finance-mobile"
    url: "https://github.com/Shiize/personal-finance-mobile"
    commit: "ad43b786cff3a2546bf00b291848b90d9b5da15b"
    branch: "main"
    status: "verified"
release:
  target_version: "0.1.0-alpha.2"
  status: "candidate"
`;
  fs.writeFileSync(path.join(tmpDir, 'versions/current.yaml'), manifestYaml);

  const result = validateReleases(tmpDir);
  assert.equal(result.valid, true, `Expected valid, got errors: ${result.errors.join(', ')}`);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});
