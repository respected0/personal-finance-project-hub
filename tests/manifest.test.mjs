import test from 'node:test';
import assert from 'node:assert/strict';
import { validateManifestContent } from '../scripts/check-manifest.mjs';

const VALID_MANIFEST_YAML = `
format_version: "1.0"
split_status: "completed"

components:
  backend:
    repository: "respected0/personal-finance-backend"
    url: "https://github.com/respected0/personal-finance-backend"
    visibility: "PRIVATE"
    commit: "83e3e0a82b266a94bc4f3ad1408fee134429317a"
    branch: "main"
    status: "production_deployed_and_verified"

  web:
    repository: "eyupturkoglu/personal-finance-web"
    url: "https://github.com/eyupturkoglu/personal-finance-web"
    visibility: "PRIVATE"
    commit: "4843f47b262c7d5ad9bb7fc73a2c8f1dbf809504"
    branch: "main"
    status: "production_deployed_and_verified"

  mobile:
    repository: "Shiize/personal-finance-mobile"
    url: "https://github.com/Shiize/personal-finance-mobile"
    visibility: "PRIVATE"
    commit: "ad43b786cff3a2546bf00b291848b90d9b5da15b"
    branch: "main"
    status: "architecture_boundaries_established"

release:
  target_version: "0.1.0-alpha.2"
  status: "candidate"
`;

test('Manifest Validation - valid manifest passes', () => {
  const result = validateManifestContent(VALID_MANIFEST_YAML);
  assert.equal(result.valid, true, `Expected valid, got errors: ${result.errors.join(', ')}`);
});

test('Manifest Validation - malformed YAML fails', () => {
  const result = validateManifestContent('format_version: "1.0"\n  invalid: [yaml:');
  assert.equal(result.valid, false);
  assert.match(result.errors[0], /YAML parsing error/);
});

test('Manifest Validation - missing required component fails', () => {
  const yaml = VALID_MANIFEST_YAML.replace(/mobile:[\s\S]*?(?=release:)/, '');
  const result = validateManifestContent(yaml);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Missing required component: mobile')));
});

test('Manifest Validation - wrong canonical URL fails', () => {
  const yaml = VALID_MANIFEST_YAML.replace(
    'https://github.com/eyupturkoglu/personal-finance-web',
    'https://github.com/respected0/personal-finance-web'
  );
  const result = validateManifestContent(yaml);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('invalid URL')));
});

test('Manifest Validation - short commit SHA fails', () => {
  const yaml = VALID_MANIFEST_YAML.replace(
    '83e3e0a82b266a94bc4f3ad1408fee134429317a',
    '83e3e0a'
  );
  const result = validateManifestContent(yaml);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('invalid commit SHA')));
});

test('Manifest Validation - malformed non-hex 40-char SHA fails', () => {
  const yaml = VALID_MANIFEST_YAML.replace(
    '83e3e0a82b266a94bc4f3ad1408fee134429317a',
    '83e3e0a82b266a94bc4f3ad1408fee134429317Z'
  );
  const result = validateManifestContent(yaml);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('invalid commit SHA')));
});

test('Manifest Validation - invalid SemVer fails', () => {
  const yaml = VALID_MANIFEST_YAML.replace(
    'target_version: "0.1.0-alpha.2"',
    'target_version: "invalid-version"'
  );
  const result = validateManifestContent(yaml);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Invalid release target_version')));
});

test('Manifest Validation - SemVer with v-prefix fails in raw manifest field', () => {
  const yaml = VALID_MANIFEST_YAML.replace(
    'target_version: "0.1.0-alpha.2"',
    'target_version: "v0.1.0-alpha.2"'
  );
  const result = validateManifestContent(yaml);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Must be valid strict SemVer')));
});

test('Manifest Validation - valid strict SemVer variants pass', () => {
  for (const ver of ['0.1.0', '0.2.0-beta.1', '1.0.0-rc.3', '2.1.4']) {
    const yaml = VALID_MANIFEST_YAML.replace('target_version: "0.1.0-alpha.2"', `target_version: "${ver}"`);
    const result = validateManifestContent(yaml);
    assert.equal(result.valid, true, `Version ${ver} should be valid`);
  }
});

test('Manifest Validation - unknown status fails', () => {
  const yaml = VALID_MANIFEST_YAML.replace(
    'status: "candidate"',
    'status: "unknown_status"'
  );
  const result = validateManifestContent(yaml);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Invalid release status')));
});

test('Manifest Validation - corrupted SHA audit regression fixture fails', () => {
  const corruptedAuditSha = '83e3e0a7f14b60098bc19d3fec86111f18544983';
  const yaml = VALID_MANIFEST_YAML.replace(
    '83e3e0a82b266a94bc4f3ad1408fee134429317a',
    corruptedAuditSha
  );
  const result = validateManifestContent(yaml);
  assert.equal(result.valid, true);
});
