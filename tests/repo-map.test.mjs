import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRepoMapContent } from '../scripts/check-repo-map.mjs';

test('Repo Map Parser - parses table format correctly', () => {
  const markdown = `
| File | Role |
|---|---|
| \`README.md\` | Public overview |
| \`scripts/check-manifest.mjs\` | Manifest validator |
| \`versions/current.yaml\` | Canonical manifest |
`;
  const result = parseRepoMapContent(markdown);
  assert.equal(result.mappedPaths.length, 3);
  assert.ok(result.mappedPaths.includes('README.md'));
  assert.ok(result.mappedPaths.includes('scripts/check-manifest.mjs'));
  assert.ok(result.mappedPaths.includes('versions/current.yaml'));
  assert.equal(result.duplicates.length, 0);
});

test('Repo Map Parser - detects duplicate paths', () => {
  const markdown = `
| File | Role |
|---|---|
| \`README.md\` | Public overview |
| \`README.md\` | Duplicate entry |
`;
  const result = parseRepoMapContent(markdown);
  assert.equal(result.duplicates.length, 1);
  assert.equal(result.duplicates[0], 'README.md');
});
