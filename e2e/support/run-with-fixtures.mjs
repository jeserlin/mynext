import { spawn } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const [mode, ...args] = process.argv.slice(2);
if (mode !== 'dev' && mode !== 'build') throw new Error('Expected dev or build');
const preload = new URL('./mock-notion.mjs', import.meta.url).href;
const child = spawn(process.execPath, [fileURLToPath(new URL('../../node_modules/next/dist/bin/next', import.meta.url)), mode, ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${preload}`.trim(),
    MYNEXT_E2E_NOTION: '1',
    NOTION_TOKEN: 'e2e-test-token',
    NOTION_DATABASE_ID: 'e2e-recipes',
    NOTION_BOOKS_DATABASE_ID: 'e2e-books',
    ADMIN_SECRET: 'e2e-test-secret',
  },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', (error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
