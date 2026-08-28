#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const CANONICAL_REPOS = {
  backend: 'https://github.com/respected0/personal-finance-backend',
  web: 'https://github.com/eyupturkoglu/personal-finance-web',
  mobile: 'https://github.com/Shiize/personal-finance-mobile'
};

const ALLOWED_STATUSES = [
  'planned',
  'in_progress',
  'candidate',
  'verified_pass',
  'verified_fail',
  'released'
];

// Strict SemVer 2.0 without leading 'v' prefix
const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const SHA_REGEX = /^[0-9a-f]{40}$/;

export function validateManifestContent(yamlContent) {
  const errors = [];
  let parsed;

  try {
    parsed = YAML.parse(yamlContent);
  } catch (err) {
    return { valid: false, errors: [`YAML parsing error: ${err.message}`] };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, errors: ['Manifest root must be an object'] };
  }

  if (!parsed.format_version || typeof parsed.format_version !== 'string') {
    errors.push('Missing or invalid format_version');
  }

  if (!parsed.components || typeof parsed.components !== 'object') {
    errors.push('Missing or invalid components section');
  } else {
    const requiredComponents = ['backend', 'web', 'mobile'];
    const actualComponents = Object.keys(parsed.components);

    for (const req of requiredComponents) {
      if (!parsed.components[req]) {
        errors.push(`Missing required component: ${req}`);
      }
    }

    for (const [key, comp] of Object.entries(parsed.components)) {
      if (!requiredComponents.includes(key)) {
        errors.push(`Unexpected component in manifest: ${key}`);
        continue;
      }
      if (!comp || typeof comp !== 'object') {
        errors.push(`Component ${key} must be an object`);
        continue;
      }

      // Check Canonical URL
      const expectedUrl = CANONICAL_REPOS[key];
      if (comp.url !== expectedUrl) {
        errors.push(`Component ${key} has invalid URL: "${comp.url}". Expected: "${expectedUrl}"`);
      }

      // Check SHA
      if (!comp.commit) {
        errors.push(`Component ${key} missing commit SHA`);
      } else if (!SHA_REGEX.test(comp.commit)) {
        errors.push(`Component ${key} has invalid commit SHA: "${comp.commit}". Must be exactly 40 lowercase hex characters.`);
      }

      // Check branch and status
      if (!comp.branch || typeof comp.branch !== 'string') {
        errors.push(`Component ${key} missing branch`);
      }
      if (!comp.status || typeof comp.status !== 'string') {
        errors.push(`Component ${key} missing status`);
      }
    }
  }

  if (!parsed.release || typeof parsed.release !== 'object') {
    errors.push('Missing or invalid release section');
  } else {
    if (!parsed.release.target_version || !SEMVER_REGEX.test(parsed.release.target_version)) {
      errors.push(`Invalid release target_version: "${parsed.release.target_version}". Must be valid strict SemVer (e.g. "0.1.0-alpha.2", without "v" prefix).`);
    }
    if (!parsed.release.status || !ALLOWED_STATUSES.includes(parsed.release.status)) {
      errors.push(`Invalid release status: "${parsed.release.status}". Allowed: ${ALLOWED_STATUSES.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: parsed
  };
}

export function validateManifestFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: [`Manifest file not found: ${filePath}`] };
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return validateManifestContent(content);
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetPath = process.argv[2] || path.resolve(process.cwd(), 'versions/current.yaml');
  console.log(`🔍 Checking manifest: ${path.relative(process.cwd(), targetPath)}...`);
  
  const result = validateManifestFile(targetPath);
  if (!result.valid) {
    console.error('❌ Manifest validation failed:');
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }
  console.log('✅ Manifest validation passed! (Schema, Canonical URLs, 40-char SHAs, Strict SemVer)');
}
