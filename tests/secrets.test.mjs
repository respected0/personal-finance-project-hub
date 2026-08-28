import test from 'node:test';
import assert from 'node:assert/strict';
import { scanFileForSecrets } from '../scripts/check-secrets.mjs';

test('Secrets Scanner - clean text passes', () => {
  const content = 'const port = 3000;\nconsole.log("Server listening");\n';
  const violations = scanFileForSecrets('src/clean.js', content);
  assert.equal(violations.length, 0);
});

test('Secrets Scanner - private key block fails', () => {
  const content = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...\n-----END RSA PRIVATE KEY-----';
  const violations = scanFileForSecrets('src/key.js', content);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].rule, 'Private Key Block');
});

test('Secrets Scanner - GitHub PAT pattern fails', () => {
  const fakePat = 'ghp_' + 'a'.repeat(36);
  const content = `const token = "${fakePat}";`;
  const violations = scanFileForSecrets('src/auth.js', content);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].rule, 'GitHub Personal Access Token');
});

test('Secrets Scanner - forbidden .env file fails', () => {
  const violations = scanFileForSecrets('.env.local', 'PORT=3000');
  assert.equal(violations.length, 1);
  assert.equal(violations[0].rule, 'Forbidden tracked .env file');
});
