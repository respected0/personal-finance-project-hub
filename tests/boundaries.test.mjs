import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFilePathBoundaries } from '../scripts/check-hub-boundaries.mjs';

test('Hub Boundary - legitimate Hub files pass', () => {
  const allowed = [
    'scripts/check-manifest.mjs',
    'tests/manifest.test.mjs',
    'docs/architecture.md',
    'versions/current.yaml',
    'releases/v0.1.0-alpha.1.md',
    '.github/workflows/quality.yml',
    'package.json',
    'README.md'
  ];
  for (const file of allowed) {
    const res = validateFilePathBoundaries(file);
    assert.equal(res.valid, true, `File ${file} should be valid in Hub`);
  }
});

test('Hub Boundary - apps/web path fails', () => {
  const res = validateFilePathBoundaries('apps/web/src/app/page.tsx');
  assert.equal(res.valid, false);
  assert.match(res.error, /violates Hub Zero Domain Code boundary/);
});

test('Hub Boundary - packages/domain path fails', () => {
  const res = validateFilePathBoundaries('packages/domain/src/ledger.ts');
  assert.equal(res.valid, false);
  assert.match(res.error, /violates Hub Zero Domain Code boundary/);
});

test('Hub Boundary - packages/db path fails', () => {
  const res = validateFilePathBoundaries('packages/db/src/schema.ts');
  assert.equal(res.valid, false);
  assert.match(res.error, /violates Hub Zero Domain Code boundary/);
});

test('Hub Boundary - supabase/migrations SQL file fails', () => {
  const res = validateFilePathBoundaries('supabase/migrations/001_initial_schema.sql');
  assert.equal(res.valid, false);
  assert.match(res.error, /violates Hub Zero Domain Code boundary/);
});

test('Hub Boundary - root or nested SQL migration fails', () => {
  const res = validateFilePathBoundaries('migrations/002_add_accounts.sql');
  assert.equal(res.valid, false);
  assert.match(res.error, /SQL migrations are forbidden in Hub/);
});
