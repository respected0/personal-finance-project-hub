#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

console.log('🩺 Running Environment & Repository Health Doctor...\n');

let issues = 0;

// 1. Node.js Version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
if (majorVersion >= 18) {
  console.log(`  ✅ Node.js Runtime: ${nodeVersion} (Supported)`);
} else {
  console.log(`  ❌ Node.js Runtime: ${nodeVersion} (Node >= 18 required)`);
  issues++;
}

// 2. Git Configuration & Remote
try {
  const remote = execSync('git remote get-url origin', { stdio: 'pipe' }).toString().trim();
  console.log(`  ✅ Git Remote (origin): ${remote}`);
} catch {
  console.log('  ⚠️ Git Remote: origin not configured');
  issues++;
}

// 3. Git Hooks Path
try {
  const hooksPath = execSync('git config core.hooksPath', { stdio: 'pipe' }).toString().trim();
  if (hooksPath === '.githooks') {
    console.log(`  ✅ Git Hooks: configured to ${hooksPath}`);
  } else {
    console.log(`  ⚠️ Git Hooks: core.hooksPath is "${hooksPath}" (expected ".githooks")`);
  }
} catch {
  console.log('  ⚠️ Git Hooks: core.hooksPath not set (run `pnpm prepare`)');
}

// 4. Sibling Clones Detection
const siblingRepos = ['personal-finance-backend', 'personal-finance-web', 'personal-finance-mobile'];
console.log('\n  Sibling Repository Clones:');
for (const repo of siblingRepos) {
  const siblingPath = path.resolve(process.cwd(), `../${repo}`);
  if (fs.existsSync(siblingPath) && fs.existsSync(path.join(siblingPath, '.git'))) {
    console.log(`    ✅ ${repo}: detected at ${siblingPath}`);
  } else {
    console.log(`    ℹ️ ${repo}: not detected locally (Remote/CI mode)`);
  }
}

console.log(`\n🩺 Doctor finished with ${issues} issue(s).`);
if (issues > 0) {
  process.exit(1);
}
