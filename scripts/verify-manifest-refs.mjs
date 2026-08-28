#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import YAML from 'yaml';

export function verifyManifestCommitRefs(manifestPath = 'versions/current.yaml', rootDir = process.cwd()) {
  const fullPath = path.resolve(rootDir, manifestPath);
  if (!fs.existsSync(fullPath)) {
    return { success: false, results: [{ status: 'ERROR', message: `Manifest not found: ${manifestPath}` }] };
  }

  const manifest = YAML.parse(fs.readFileSync(fullPath, 'utf-8'));
  const results = [];
  let hasFailures = false;

  const siblingDirs = {
    backend: path.resolve(rootDir, '../personal-finance-backend'),
    web: path.resolve(rootDir, '../personal-finance-web'),
    mobile: path.resolve(rootDir, '../personal-finance-mobile')
  };

  for (const [compKey, comp] of Object.entries(manifest.components || {})) {
    const sha = comp.commit;
    const localDir = siblingDirs[compKey];

    if (fs.existsSync(localDir) && fs.existsSync(path.join(localDir, '.git'))) {
      try {
        execSync(`git -C "${localDir}" cat-file -e ${sha}^{commit}`, { stdio: 'pipe' });
        results.push({
          component: compKey,
          sha,
          status: 'VERIFIED_LOCAL',
          message: `Commit ${sha} verified in local ${compKey} clone.`
        });
      } catch {
        hasFailures = true;
        results.push({
          component: compKey,
          sha,
          status: 'MISSING_COMMIT',
          message: `Commit ${sha} NOT FOUND in local ${compKey} clone (${localDir})!`
        });
      }
    } else {
      results.push({
        component: compKey,
        sha,
        status: 'NOT_VERIFIABLE_IN_THIS_ENVIRONMENT',
        message: `Local clone not found at ${localDir}. Remote ref check requires credentials or network.`
      });
    }
  }

  return {
    success: !hasFailures,
    results
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔍 Verifying manifest commit references in local sibling repositories...');
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
    console.error('❌ Manifest reference verification failed: Some pinned commits do not exist in local clones.');
    process.exit(1);
  } else {
    console.log('✅ Manifest reference verification finished.');
  }
}
