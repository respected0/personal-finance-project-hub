#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const FORBIDDEN_PATH_PREFIXES = [
  'apps/',
  'packages/domain/',
  'packages/db/',
  'packages/contracts/',
  'supabase/migrations/',
  'src/api/',
  'src/domain/',
  'src/components/',
  'src/app/'
];

export function getWorkingTreeFiles(rootDir = process.cwd()) {
  try {
    const tracked = execSync('git ls-files', { cwd: rootDir, encoding: 'utf-8' })
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const untracked = execSync('git ls-files --others --exclude-standard', { cwd: rootDir, encoding: 'utf-8' })
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    return Array.from(new Set([...tracked, ...untracked]));
  } catch {
    return [];
  }
}

export function validateFilePathBoundaries(filePath) {
  const normalized = filePath.replace(/\\/g, '/');

  // Allow test fixtures designed to test this validator
  if (normalized.startsWith('tests/fixtures/')) {
    return { valid: true };
  }

  for (const prefix of FORBIDDEN_PATH_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      return {
        valid: false,
        error: `File "${filePath}" violates Hub Zero Domain Code boundary (lives in forbidden domain folder "${prefix}")`
      };
    }
  }

  // Reject SQL migration files anywhere in Hub outside test fixtures
  if (normalized.endsWith('.sql') && !normalized.includes('tests/')) {
    return {
      valid: false,
      error: `File "${filePath}" violates Hub Zero Domain Code boundary (SQL migrations are forbidden in Hub)`
    };
  }

  return { valid: true };
}

export function validateHubBoundaries(rootDir = process.cwd()) {
  const files = getWorkingTreeFiles(rootDir);
  const errors = [];

  for (const file of files) {
    const res = validateFilePathBoundaries(file);
    if (!res.valid) {
      errors.push(res.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    filesChecked: files.length
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🛡️ Checking Hub Zero Domain Code architectural boundaries...');
  const result = validateHubBoundaries();

  if (!result.valid) {
    console.error('❌ Hub boundary validation failed: Domain code detected in Hub repository:');
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    console.error('⚠️ Policy: Application source code, API routes, and SQL migrations must live exclusively in private sibling repositories.');
    process.exit(1);
  }

  console.log(`✅ Hub boundary check passed! (${result.filesChecked} files verified, 0 domain code violations)`);
}
