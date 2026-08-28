#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SECRET_PATTERNS = [
  { name: 'Private Key Block', regex: /-----BEGIN (?:[A-Z0-9_-]+ )?PRIVATE KEY-----/ },
  { name: 'GitHub Personal Access Token', regex: /ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82}/ },
  { name: 'AWS Access Key ID', regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
  { name: 'Slack Token', regex: /xox[baprs]-[0-9a-zA-Z]{10,48}/ },
  { name: 'Generic Hardcoded Secret/Password', regex: /(?:api[_-]?key|secret[_-]?key|auth[_-]?token|password|bearer)\s*[:=]\s*["'][a-zA-Z0-9_\-+/=]{20,}["']/i }
];

export function getFilesToScan(rootDir = process.cwd()) {
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

export function scanFileForSecrets(filePath, content) {
  const violations = [];

  // Exclude test fixtures or test files designed to test the scanner
  if (filePath.includes('tests/fixtures/') || filePath.includes('tests/secrets.test.mjs')) {
    return violations;
  }

  // Check forbidden .env files
  const baseName = path.basename(filePath);
  if (baseName.startsWith('.env') && baseName !== '.env.example') {
    violations.push({
      file: filePath,
      line: 1,
      rule: 'Forbidden tracked .env file'
    });
    return violations;
  }

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comments that describe rules or test assertions
    if (line.includes('SECRET_SCANNER_IGNORE') || line.includes('sentinel-test-token')) {
      continue;
    }

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(line)) {
        violations.push({
          file: filePath,
          line: i + 1,
          rule: pattern.name
        });
      }
    }
  }

  return violations;
}

export function runSecretScan(rootDir = process.cwd()) {
  const files = getFilesToScan(rootDir);
  const violations = [];

  for (const relFile of files) {
    const fullPath = path.resolve(rootDir, relFile);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      continue;
    }

    // Skip binary files
    try {
      const buffer = fs.readFileSync(fullPath);
      const isBinary = buffer.includes(0);
      if (isBinary) continue;

      const content = buffer.toString('utf-8');
      const fileViolations = scanFileForSecrets(relFile, content);
      violations.push(...fileViolations);
    } catch {
      // Skip unreadable files
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    filesScanned: files.length
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔒 Scanning workspace files for secrets and credentials...');
  const result = runSecretScan();

  if (!result.valid) {
    console.error('❌ Secret scan detected potential credentials:');
    for (const v of result.violations) {
      console.error(`  - [${v.file}:${v.line}] Rule violation: ${v.rule}`);
    }
    console.error('⚠️ Remediation: Remove secrets immediately and purge from git history if committed.');
    process.exit(1);
  }

  console.log(`✅ Secret scan passed! (${result.filesScanned} files scanned, 0 secrets detected)`);
}
