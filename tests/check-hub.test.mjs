import { test } from 'node:test';
import assert from 'node:assert/strict';
import { violation, checkHub } from '../scripts/check-hub.mjs';

test('allows showcase files', () => {
  for (const f of ['README.md', 'screenshots/web-ozet.png', '.github/workflows/quality.yml', 'scripts/check-hub.mjs']) {
    assert.equal(violation(f), null, f);
  }
});

test('rejects app code, SQL and secret files', () => {
  for (const f of ['apps/web/page.tsx', 'packages/db/schema.ts', 'migrations/001.sql', '.env', 'config/.env.local', 'certs/a.pem', 'src/x.ts', 'apps' + String.fromCharCode(92) + 'a.ts']) {
    assert.ok(violation(f), f);
  }
});

test('allows .env.example', () => assert.equal(violation('.env.example'), null));

test('current working tree is clean', () => assert.deepEqual(checkHub(), []));
