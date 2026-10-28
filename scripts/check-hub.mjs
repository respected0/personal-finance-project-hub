// Hub guard: this public showcase repo must hold no app code, SQL or secret-bearing files.
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const FORBIDDEN_DIRS = ['apps/', 'packages/', 'supabase/', 'src/'];
const FORBIDDEN_FILE = /(^|\/)\.env(\.|$)|\.(pem|key|p12|pfx|sql)$/;

export function violation(file) {
  const f = file.replaceAll(String.fromCharCode(92), '/');
  if (FORBIDDEN_DIRS.some((d) => f.startsWith(d))) return `${file}: application code folder is not allowed in the hub`;
  if (FORBIDDEN_FILE.test(f) && !f.endsWith('.env.example')) return `${file}: secret or SQL file is not allowed in the hub`;
  return null;
}

export function checkHub(cwd = process.cwd()) {
  const out = (cmd) => execSync(cmd, { cwd, encoding: 'utf8' }).split('\n').filter(Boolean);
  const files = new Set([...out('git ls-files'), ...out('git ls-files --others --exclude-standard')]);
  return [...files].map(violation).filter(Boolean);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = checkHub();
  if (errors.length) {
    errors.forEach((e) => console.error(`x ${e}`));
    process.exit(1);
  }
  console.log('ok: hub holds no application code, SQL or secret files');
}
