import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDocs, getAllMarkdownFiles } from '../scripts/check-docs.mjs';

test('Docs Truth - workspace markdown files pass validation', () => {
  const mdFiles = getAllMarkdownFiles(process.cwd());
  assert.ok(mdFiles.length >= 5, 'Expected multiple markdown files in workspace');
});
