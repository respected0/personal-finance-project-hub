#!/usr/bin/env node
import { execSync } from 'node:child_process';
import path from 'node:path';

// For a lightweight repository where verify:quick takes < 1-2 seconds,
// running the full quick verification ensures zero drift with negligible overhead.
console.log('⚡ verify:changed delegating to fast local verification suite...');
try {
  execSync('node scripts/verify-quick.mjs', { stdio: 'inherit' });
} catch (err) {
  process.exit(1);
}
