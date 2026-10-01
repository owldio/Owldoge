import { cp, mkdir, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { build } from 'esbuild';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const buildRoot = join(root, '.cloudflare-build');
const stage = join(buildRoot, 'staging');
const output = join(buildRoot, 'site');

// Only these generated directories may be replaced; never clean the source checkout.
async function resetGeneratedDirectory(path) {
  if (![stage, output].includes(resolve(path)) || !resolve(path).startsWith(`${buildRoot}${sep}`)) {
    throw new Error(`Refusing to clean outside the generated build directories: ${path}`);
  }
  await rm(path, { recursive: true, force: true });
  await mkdir(path, { recursive: true });
}

async function runNode(script, args = []) {
  const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' };
  delete env.GOOGLE_SCRIPT_URL;
  await new Promise((accept, reject) => {
    const child = spawn(process.execPath, [join(root, 'node_modules', script), ...args], {
      cwd: stage, env, stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? accept() : reject(new Error(`${script} exited ${code}`)));
  });
}

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

await resetGeneratedDirectory(stage);
await resetGeneratedDirectory(output);
await cp(join(root, 'src'), join(stage, 'src'), {
  recursive: true,
  filter: (source) => source !== join(root, 'src', 'app', 'api'),
});
await cp(join(root, 'public'), join(stage, 'public'), { recursive: true });
for (const name of ['package.json', 'pnpm-lock.yaml', 'tsconfig.json', 'postcss.config.mjs',
  'tailwind.config.ts', 'eslint.config.mjs', 'next-sitemap.config.js']) {
  await cp(join(root, name), join(stage, name));
}
await symlink(join(root, 'node_modules'), join(stage, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');

const loaderBuild = await build({
  entryPoints: [join(root, 'src/lib/static-image-loader.ts')], bundle: true,
  format: 'esm', platform: 'node', write: false,
});
const { staticImageWidths, staticImageQuality } = await import(
  `data:text/javascript;base64,${Buffer.from(loaderBuild.outputFiles[0].text).toString('base64')}`
);
await writeFile(join(stage, 'next.config.mjs'), `export default ${JSON.stringify({
  output: 'export',
  images: {
    loader: 'custom', loaderFile: './src/lib/static-image-loader.ts',
    deviceSizes: staticImageWidths.filter((width) => width >= 640),
    imageSizes: staticImageWidths.filter((width) => width < 640),
    qualities: [70, 75, 78, 80],
  },
  turbopack: { root },
}, null, 2)};\n`);
// These GET routes read only checked-in content; export their responses at build time.
for (const name of ['llms.txt', 'pricing.md']) {
  const path = join(stage, 'src/app', name, 'route.ts');
  await writeFile(path, `export const dynamic = 'force-static';\n${await readFile(path, 'utf8')}`);
}

const images = (await filesUnder(join(stage, 'public'))).filter((path) => /\.(jpe?g|png|webp|avif)$/i.test(path));
let sourceBytes = 0;
let largestOptimizedBytes = 0;
for (const source of images) {
  sourceBytes += (await stat(source)).size;
  for (const width of staticImageWidths) {
    const target = join(stage, 'public', '_images', `${relative(join(stage, 'public'), source)}.w${width}.webp`);
    await mkdir(dirname(target), { recursive: true });
    await sharp(source).rotate().resize({ width, withoutEnlargement: true })
      .webp({ quality: staticImageQuality }).toFile(target);
    largestOptimizedBytes = Math.max(largestOptimizedBytes, (await stat(target)).size);
  }
}
console.log(`Prepared ${images.length * staticImageWidths.length} WebP variants from ${images.length} source images.`);
// Next 15's Windows Turbopack build does not reliably apply loaderFile.
await runNode('next/dist/bin/next', ['build']);
await runNode('next-sitemap/bin/next-sitemap.mjs');
await cp(join(stage, 'out'), output, { recursive: true });
// next-sitemap writes to public after Next's export has copied that directory.
for (const name of ['robots.txt', 'sitemap.xml', 'sitemap-0.xml']) {
  await cp(join(stage, 'public', name), join(output, name));
}
await build({
  entryPoints: [join(root, 'tooling/cloudflare/worker.ts')],
  outfile: join(output, '_worker.js'), bundle: true, format: 'esm',
  platform: 'browser', target: 'es2022', tsconfig: join(root, 'tsconfig.json'),
});
for (const name of ['_routes.json', '_headers']) {
  await cp(join(root, 'tooling/cloudflare', name), join(output, name));
}
const outputFiles = await filesUnder(output);
for (const path of outputFiles) {
  if ((await stat(path)).size > 25 * 1024 * 1024) throw new Error(`Pages asset exceeds 25 MiB: ${path}`);
}
if (outputFiles.length > 20000) throw new Error(`Pages Free file limit exceeded: ${outputFiles.length}`);
const report = {
  architecture: 'Next.js static export + API-only Pages Function',
  generatedAt: new Date().toISOString(),
  images: { sourceCount: images.length, sourceBytes, variants: images.length * staticImageWidths.length,
    quality: staticImageQuality, largestOptimizedBytes },
  assetCount: outputFiles.length,
  verification: 'Local build only; no cloud deployment, CPU measurement or real form delivery verified.',
};
await writeFile(join(buildRoot, 'build-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Cloudflare candidate built at ${output}; ${outputFiles.length} files. No deployment performed.`);
