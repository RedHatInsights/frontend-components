const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const webpack = require('webpack');

const root = path.resolve(__dirname, '../..');
const dist = path.join(root, 'dist/@redhat-cloud-services/frontend-components-translations');
const tempRoot = path.join(root, 'tmp');
fs.mkdirSync(tempRoot, { recursive: true });
const scratch = fs.mkdtempSync(path.join(tempRoot, 'translations-package-'));
const marker = '__PACKED_LAZY_FRENCH__';

function pack(input, label, delivered) {
  const output = path.join(scratch, label);
  fs.mkdirSync(output);
  const report = JSON.parse(
    execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', output], { cwd: input, encoding: 'utf8' }),
  );
  const packed = Object.values(report)[0];
  const files = packed.files.map(({ path }) => path);
  for (const prefix of ['', 'esm/']) {
    for (const file of ['loadMessages.js', 'loadMessages.d.ts', 'localization.js', 'locales/README.md', ...(delivered ? ['locales/fr.json'] : [])]) {
      assert(files.includes(prefix + file), `npm archive missing ${prefix}${file}`);
    }
  }
  assert(!files.some((file) => /(^|\/)(generated|translatedMessages)(\/|$)|locales\/translations\.json$/.test(file)), 'legacy aggregate shipped');
  assert(!files.some((file) => /\.(test|spec)\./.test(file)), 'test files shipped');
  execFileSync('tar', ['-xzf', path.join(output, packed.filename), '-C', output]);
  return path.join(output, 'package');
}

async function checkBundle(pkg, format, label, delivered) {
  const out = path.join(scratch, `${label}-${format}`);
  const compiler = webpack({
    mode: 'production',
    target: 'node22',
    entry: path.join(pkg, format === 'esm' ? 'esm/loadMessages.js' : 'loadMessages.js'),
    output: { path: out, filename: 'index.cjs', chunkFilename: '[name].cjs', library: { type: 'commonjs2' } },
    optimization: { minimize: false },
  });
  const stats = await new Promise((resolve, reject) =>
    compiler.run((error, stats) =>
      compiler.close((closeError) => {
        if (error || closeError) reject(error || closeError);
        else resolve(stats);
      }),
    ),
  );
  const info = stats.toJson({ all: false, errors: true, warnings: true, chunks: true });
  assert(!stats.hasErrors() && !stats.hasWarnings(), JSON.stringify(info));
  assert(!fs.readFileSync(path.join(out, 'index.cjs'), 'utf8').includes(marker), `${format} eagerly bundled French`);
  if (delivered) {
    assert(
      info.chunks.some((chunk) => !chunk.initial && chunk.files.some((file) => fs.readFileSync(path.join(out, file), 'utf8').includes(marker))),
      `${format} missing lazy French chunk`,
    );
  }
  const load = require(path.join(out, 'index.cjs')).loadMessages;
  assert.deepEqual(await load('fr-CA'), delivered ? { 'test.package': marker } : undefined);
  assert.equal(await load('en'), undefined);
  assert.equal(await load('zz-ZZ'), undefined);
  console.log(`PASS ${label} packed ${format} Webpack build and runtime fallback`);
}

async function main() {
  // Verify the actual build before modifying anything: bundlers need these directories
  // even while no target-language catalogs have been delivered.
  const pristine = pack(dist, 'pristine', false);
  for (const format of ['cjs', 'esm']) await checkBundle(pristine, format, 'pristine', false);

  const input = path.join(scratch, 'input');
  fs.cpSync(dist, input, { recursive: true });
  // Model future Phrase delivery only in this disposable package. Never repair a
  // missing build asset directory: the pristine archive check above must reject it.
  for (const prefix of ['', 'esm']) {
    fs.writeFileSync(path.join(input, prefix, 'locales/fr.json'), JSON.stringify({ 'test.package': marker }));
  }
  const pkg = pack(input, 'delivered', true);
  const native = require(path.join(pkg, 'loadMessages.js')).loadMessages;
  assert.deepEqual(await native('fr-CA'), { 'test.package': marker });
  assert.equal(await native('en-US'), undefined);
  assert.equal(await native('zz-ZZ'), undefined);
  console.log('PASS actual npm archive and native CJS locale loading/fallback');
  for (const format of ['cjs', 'esm']) await checkBundle(pkg, format, 'delivered', true);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => fs.rmSync(scratch, { recursive: true, force: true }));
