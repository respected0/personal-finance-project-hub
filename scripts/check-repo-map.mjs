#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

export function getProjectWorkingTreeFiles(rootDir = process.cwd()) {
  try {
    const tracked = execSync('git ls-files', { cwd: rootDir, encoding: 'utf-8' })
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const untracked = execSync('git ls-files --others --exclude-standard', { cwd: rootDir, encoding: 'utf-8' })
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    return Array.from(new Set([...tracked, ...untracked])).sort();
  } catch (err) {
    throw new Error(`Failed to get git working tree files: ${err.message}`);
  }
}

export function parseRepoMapContent(mapContent) {
  const mappedPaths = new Set();
  const duplicates = [];

  const lines = mapContent.split('\n');
  let inIgnoredSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip ignored/runtime section (Section 8)
    if (trimmed.startsWith('## 8.') || trimmed.includes('Ignored & Local Runtime Paths')) {
      inIgnoredSection = true;
      continue;
    }
    if (inIgnoredSection && trimmed.startsWith('## ')) {
      inIgnoredSection = false;
    }
    if (inIgnoredSection) continue;

    // We only extract paths from table rows: | `path/to/file` | Role | Description |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const columns = trimmed
        .split('|')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (columns.length >= 2) {
        const firstCol = columns[0];
        // Match `path/to/file` in the first column
        const match = /^`([a-zA-Z0-9_.\-/@]+(?:\/[a-zA-Z0-9_.\-/@]+)*)`$/.exec(firstCol);
        if (match) {
          const filePath = match[1].trim();
          if (mappedPaths.has(filePath)) {
            duplicates.push(filePath);
          } else {
            mappedPaths.add(filePath);
          }
        }
      }
    }
  }

  return {
    mappedPaths: Array.from(mappedPaths),
    duplicates
  };
}

export function validateRepoMap(rootDir = process.cwd(), mapRelativePath = 'docs/REPOSITORY_MAP.md') {
  const mapPath = path.resolve(rootDir, mapRelativePath);
  const errors = [];

  if (!fs.existsSync(mapPath)) {
    return {
      valid: false,
      errors: [`Repository map file not found: ${mapRelativePath}`],
      missing: [],
      ghosts: [],
      duplicates: []
    };
  }

  const mapContent = fs.readFileSync(mapPath, 'utf-8');
  const { mappedPaths, duplicates } = parseRepoMapContent(mapContent);
  const workingTreeFiles = getProjectWorkingTreeFiles(rootDir);

  const mappedSet = new Set(mappedPaths);
  const workingTreeSet = new Set(workingTreeFiles);

  const missing = workingTreeFiles.filter(f => !mappedSet.has(f));
  const ghosts = mappedPaths.filter(f => !workingTreeSet.has(f));

  if (missing.length > 0) {
    errors.push(`Missing files in ${mapRelativePath} (${missing.length} unmapped):\n    ` + missing.join('\n    '));
  }

  if (ghosts.length > 0) {
    errors.push(`Ghost files in ${mapRelativePath} (not in working tree):\n    ` + ghosts.join('\n    '));
  }

  if (duplicates.length > 0) {
    errors.push(`Duplicate path definitions in ${mapRelativePath}:\n    ` + duplicates.join('\n    '));
  }

  return {
    valid: errors.length === 0,
    errors,
    missing,
    ghosts,
    duplicates,
    totalWorkingTree: workingTreeFiles.length,
    totalMapped: mappedPaths.length
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔍 Checking Repository Map coverage against working tree...');
  const result = validateRepoMap();

  if (!result.valid) {
    console.error('❌ Repository Map check failed:');
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`✅ Repository Map check passed! (100% path coverage: ${result.totalWorkingTree}/${result.totalWorkingTree} files verified)`);
}
