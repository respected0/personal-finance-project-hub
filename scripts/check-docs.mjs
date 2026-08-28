#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const FORBIDDEN_STRINGS = [
  'github.com/respected0/personal-finance-web',
  'github.com/respected0/personal-finance-mobile',
  'CURRENT_STATE.md',
  'BACKEND_SKILL.md',
  'WEB_FRONTEND_SKILL.md',
  'MOBILE_SKILL.md',
  'AI_COMMON_RULES.md',
  'AI_START_PROMPT_HUB.md',
  'INTEGRATION_RELEASE_SKILL.md',
  'personal-finance-os@66868ec'
];

export function getAllMarkdownFiles(rootDir = process.cwd()) {
  const mdFiles = [];
  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        mdFiles.push(fullPath);
      }
    }
  }
  scan(rootDir);
  return mdFiles;
}

export function validateDocs(rootDir = process.cwd()) {
  const errors = [];
  const mdFiles = getAllMarkdownFiles(rootDir);

  for (const filePath of mdFiles) {
    const relPath = path.relative(rootDir, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 1. Check for forbidden obsolete/dead references
    for (const forbidden of FORBIDDEN_STRINGS) {
      if (content.includes(forbidden)) {
        errors.push(`[${relPath}] Contains forbidden dead/obsolete reference: "${forbidden}"`);
      }
    }

    // 2. Check internal markdown links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[2].trim();
      // Skip external links, mailto, anchor-only links
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('#')) {
        continue;
      }

      // Handle file:/// links
      let cleanHref = href;
      if (cleanHref.startsWith('file:///')) {
        cleanHref = cleanHref.replace('file://', '');
      }

      // Remove anchor part
      const [targetFilePath] = cleanHref.split('#');
      if (!targetFilePath) continue;

      let resolvedTarget;
      if (path.isAbsolute(targetFilePath)) {
        resolvedTarget = targetFilePath;
      } else {
        resolvedTarget = path.resolve(path.dirname(filePath), targetFilePath);
      }

      if (!fs.existsSync(resolvedTarget)) {
        errors.push(`[${relPath}] Broken markdown link: "${href}" -> Target not found: "${path.relative(rootDir, resolvedTarget)}"`);
      }
    }
  }

  // 3. Check ADR Index consistency
  const adrDir = path.resolve(rootDir, 'docs/architecture/adr');
  const adrIndexFile = path.resolve(adrDir, 'README.md');
  if (fs.existsSync(adrDir) && fs.existsSync(adrIndexFile)) {
    const adrIndexContent = fs.readFileSync(adrIndexFile, 'utf-8');
    const adrFiles = fs.readdirSync(adrDir).filter(f => f.startsWith('ADR-') && f.endsWith('.md'));
    for (const adrFile of adrFiles) {
      if (!adrIndexContent.includes(adrFile)) {
        errors.push(`[docs/architecture/adr/README.md] ADR file "${adrFile}" is not indexed in ADR table`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    fileCount: mdFiles.length
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔍 Checking documentation truth, links, and canonical references...');
  const result = validateDocs();

  if (!result.valid) {
    console.error('❌ Documentation check failed:');
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`✅ Documentation check passed! (${result.fileCount} markdown files verified, 0 dead references, 0 broken links)`);
}
