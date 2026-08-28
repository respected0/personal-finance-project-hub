#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { verifyManifestCommitRefs } from './verify-manifest-refs.mjs';

console.log('🚀 Running Comprehensive Ecosystem Release Verification Gate (release:verify)...\n');

try {
  // 1. Run Quick Verification Suite
  console.log('=== Step 1: Fast Verification Suite ===');
  execSync('node scripts/verify-quick.mjs', { stdio: 'inherit' });

  // 2. Run Manifest Sibling Object Reference Verification
  console.log('\n=== Step 2: Sibling Commit Object Verification ===');
  const { success, results } = verifyManifestCommitRefs();
  for (const res of results) {
    if (res.status === 'VERIFIED_LOCAL') {
      console.log(`  ✅ [${res.component}] ${res.message}`);
    } else if (res.status === 'NOT_VERIFIABLE_IN_THIS_ENVIRONMENT') {
      console.log(`  ⚠️ [${res.component}] ${res.message}`);
    } else {
      console.error(`  ❌ [${res.component}] ${res.message}`);
    }
  }

  if (!success) {
    console.error('\n❌ Release verification failed: Pinned commits missing in local repositories.');
    process.exit(1);
  }

  console.log('\n🌟 RELEASE VERIFICATION GATE PASSED — Integration set is ready for release tagging!');
} catch (err) {
  console.error('\n❌ Release verification gate failed.');
  process.exit(1);
}
