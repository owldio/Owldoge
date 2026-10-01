import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const buildRoot = join(root, '.cloudflare-build');
await mkdir(buildRoot, { recursive: true });
// A dedicated file prevents Wrangler from importing the checkout's real .env.local.
try {
  await writeFile(join(buildRoot, '.dev.vars'), '# Local preview only. Use a disposable test upstream.\n', { flag: 'wx' });
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
}
const child = spawn(process.execPath, [join(root, 'node_modules/wrangler/bin/wrangler.js'),
  'pages', 'dev', 'site', '--ip', '127.0.0.1', '--port', '8091',
  '--compatibility-date', '2026-10-01'], {
  cwd: buildRoot, stdio: 'inherit', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
});
child.once('error', (error) => { console.error(error); process.exitCode = 1; });
child.once('exit', (code) => { process.exitCode = code ?? 1; });
