#!/usr/bin/env node
import { performance } from 'node:perf_hooks';
import { validateManifestFile } from './check-manifest.mjs';
import { validateReleases } from './check-releases.mjs';
import { validateHubBoundaries } from './check-hub-boundaries.mjs';
import { validateDocs } from './check-docs.mjs';
import { validateRepoMap } from './check-repo-map.mjs';
import { runSecretScan } from './check-secrets.mjs';
import { execSync } from 'node:child_process';
import path from 'node:path';

async function runQuickVerification() {
  const startTime = performance.now();
  console.log('⚡ Running Fast Local Verification (verify:quick)...\n');

  let failed = false;

  // 1. Manifest Check
  process.stdout.write('  [1/7] Manifest Schema & Canonical URLs... ');
  const manifestRes = validateManifestFile(path.resolve(process.cwd(), 'versions/current.yaml'));
  if (manifestRes.valid) {
    console.log('✅ PASS');
  } else {
    console.log('❌ FAIL');
    manifestRes.errors.forEach(e => console.error(`        ${e}`));
    failed = true;
  }

  // 2. Release & SemVer Check
  process.stdout.write('  [2/7] Release SemVer & Pin Invariants...  ');
  const releaseRes = validateReleases(process.cwd());
  if (releaseRes.valid) {
    console.log('✅ PASS');
  } else {
    console.log('❌ FAIL');
    releaseRes.errors.forEach(e => console.error(`        ${e}`));
    failed = true;
  }

  // 3. Hub Zero Domain Code Boundaries Check
  process.stdout.write('  [3/7] Zero Domain Code Boundaries...      ');
  const boundRes = validateHubBoundaries(process.cwd());
  if (boundRes.valid) {
    console.log('✅ PASS');
  } else {
    console.log('❌ FAIL');
    boundRes.errors.forEach(e => console.error(`        ${e}`));
    failed = true;
  }

  // 4. Docs & Link Truth Check
  process.stdout.write('  [4/7] Documentation Truth & Links...     ');
  const docsRes = validateDocs(process.cwd());
  if (docsRes.valid) {
    console.log('✅ PASS');
  } else {
    console.log('❌ FAIL');
    docsRes.errors.forEach(e => console.error(`        ${e}`));
    failed = true;
  }

  // 5. Repository Map Coverage Check
  process.stdout.write('  [5/7] Repository Map 100% Coverage...    ');
  const mapRes = validateRepoMap(process.cwd());
  if (mapRes.valid) {
    console.log('✅ PASS');
  } else {
    console.log('❌ FAIL');
    mapRes.errors.forEach(e => console.error(`        ${e}`));
    failed = true;
  }

  // 6. Secret Scanner
  process.stdout.write('  [6/7] Working Tree Secret Scanner...     ');
  const secretRes = runSecretScan(process.cwd());
  if (secretRes.valid) {
    console.log('✅ PASS');
  } else {
    console.log('❌ FAIL');
    secretRes.violations.forEach(v => console.error(`        [${v.file}:${v.line}] ${v.rule}`));
    failed = true;
  }

  // 7. Unit & Regression Tests
  process.stdout.write('  [7/7] Checker Regression Test Suite...   ');
  try {
    execSync('node --test tests/**/*.test.mjs', { stdio: 'pipe' });
    console.log('✅ PASS');
  } catch (err) {
    console.log('❌ FAIL');
    console.error(err.stdout ? err.stdout.toString() : err.message);
    failed = true;
  }

  const duration = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log(`\n⏱️ Total Execution Time: ${duration}s`);

  if (failed) {
    console.error('\n❌ Fast verification failed! Fix reported errors before pushing.');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL CHECKS PASSED — Ready for local pre-push or release staging!');
  }
}

runQuickVerification();
