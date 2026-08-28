#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

// Strict SemVer without leading 'v'
const STRICT_SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

// Filename SemVer with required leading 'v'
const RELEASE_FILENAME_REGEX = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?\.md$/;

export function parseReleasePins(content) {
  const pins = {};
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line.includes('|')) continue;
    const parts = line.split('|').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      const compName = parts[0].replace(/\*\*/g, '').toLowerCase();
      const commitCandidate = parts[2].replace(/`/g, '').trim();
      if (/^[0-9a-f]{40}$/.test(commitCandidate)) {
        if (compName.includes('backend')) pins.backend = commitCandidate;
        if (compName.includes('web')) pins.web = commitCandidate;
        if (compName.includes('mobil')) pins.mobile = commitCandidate;
      }
    }
  }
  return pins;
}

export function validateReleases(rootDir = process.cwd()) {
  const errors = [];
  const releasesDir = path.resolve(rootDir, 'releases');
  const manifestPath = path.resolve(rootDir, 'versions/current.yaml');
  const releasesIndexPath = path.resolve(rootDir, 'RELEASES.md');

  let currentManifest = null;

  // 1. Check current manifest version
  if (fs.existsSync(manifestPath)) {
    try {
      currentManifest = YAML.parse(fs.readFileSync(manifestPath, 'utf-8'));
      if (!currentManifest.release || !currentManifest.release.target_version) {
        errors.push('versions/current.yaml missing release.target_version');
      } else if (!STRICT_SEMVER_REGEX.test(currentManifest.release.target_version)) {
        errors.push(`versions/current.yaml target_version "${currentManifest.release.target_version}" is not valid strict SemVer (remove leading "v" if present)`);
      }
    } catch (err) {
      errors.push(`Failed to parse versions/current.yaml: ${err.message}`);
    }
  } else {
    errors.push('versions/current.yaml not found');
  }

  // 2. Check releases directory files and parse historical pins
  const releaseRecords = new Map(); // version -> { filename, pins, content }

  if (fs.existsSync(releasesDir)) {
    const entries = fs.readdirSync(releasesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        if (!RELEASE_FILENAME_REGEX.test(entry.name)) {
          errors.push(`Release record filename "${entry.name}" does not match required pattern "v<semver>.md" (e.g., v0.1.0-alpha.1.md)`);
        }

        const versionStr = entry.name.replace(/^v/, '').replace(/\.md$/, '');
        const content = fs.readFileSync(path.join(releasesDir, entry.name), 'utf-8');
        const pins = parseReleasePins(content);

        releaseRecords.set(versionStr, {
          filename: entry.name,
          version: versionStr,
          pins,
          content
        });

        if (!content.includes(versionStr)) {
          errors.push(`Release record "${entry.name}" content does not reference its version "${versionStr}"`);
        }
      }
    }
  } else {
    errors.push('releases/ directory not found');
  }

  // 3. Check RELEASES.md index
  if (fs.existsSync(releasesIndexPath)) {
    const indexContent = fs.readFileSync(releasesIndexPath, 'utf-8');
    for (const [, rec] of releaseRecords) {
      const relPath = `releases/${rec.filename}`;
      if (!indexContent.includes(relPath) && !indexContent.includes(rec.filename)) {
        errors.push(`RELEASES.md does not index release record: ${relPath}`);
      }
    }
  } else {
    errors.push('RELEASES.md not found');
  }

  // 4. Enforce Release Identity Invariant
  // If current manifest claims verified_pass / released for a version, its pins must exactly match the immutable release snapshot
  if (currentManifest && currentManifest.release && currentManifest.components) {
    const currentVersion = currentManifest.release.target_version;
    const currentStatus = currentManifest.release.status;
    const matchingRelease = releaseRecords.get(currentVersion);

    if (currentStatus === 'verified_pass' || currentStatus === 'released') {
      if (!matchingRelease) {
        errors.push(`Current manifest is "${currentStatus}" for version ${currentVersion}, but no immutable release snapshot "releases/v${currentVersion}.md" exists!`);
      } else {
        // Pins must match exactly
        const currentPins = {
          backend: currentManifest.components.backend?.commit,
          web: currentManifest.components.web?.commit,
          mobile: currentManifest.components.mobile?.commit
        };
        const recordedPins = matchingRelease.pins;

        const mismatches = [];
        if (currentPins.backend && recordedPins.backend && currentPins.backend !== recordedPins.backend) {
          mismatches.push(`backend (current: ${currentPins.backend.slice(0, 7)} != release: ${recordedPins.backend.slice(0, 7)})`);
        }
        if (currentPins.web && recordedPins.web && currentPins.web !== recordedPins.web) {
          mismatches.push(`web (current: ${currentPins.web.slice(0, 7)} != release: ${recordedPins.web.slice(0, 7)})`);
        }
        if (currentPins.mobile && recordedPins.mobile && currentPins.mobile !== recordedPins.mobile) {
          mismatches.push(`mobile (current: ${currentPins.mobile.slice(0, 7)} != release: ${recordedPins.mobile.slice(0, 7)})`);
        }

        if (mismatches.length > 0) {
          errors.push(`Release version ${currentVersion} cannot represent multiple immutable pin sets. Mismatches: ${mismatches.join(', ')}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    releaseCount: releaseRecords.size
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔍 Checking release versions, SemVer strictness, and pin identity invariant...');
  const result = validateReleases();

  if (!result.valid) {
    console.error('❌ Release validation failed:');
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`✅ Release validation passed! (${result.releaseCount} release records validated, pin identity invariant satisfied)`);
}
