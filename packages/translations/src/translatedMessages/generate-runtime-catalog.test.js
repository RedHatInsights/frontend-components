const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const generateRuntimeCatalog = require('../../generate-runtime-catalog.cjs');

// The generator runs in Node at build time, never in the browser bundle.
describe('runtime catalog generation', () => {
  let directory;
  let outputPath;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'fec-locales-'));
    outputPath = path.join(directory, 'data.json');
    fs.writeFileSync(path.join(directory, 'translations.json'), JSON.stringify({ 'default.save': 'Save' }));
  });

  afterEach(() => fs.rmSync(directory, { recursive: true, force: true }));

  test('builds with only English while target deliveries are pending', () => {
    generateRuntimeCatalog(directory, outputPath);
    expect(JSON.parse(fs.readFileSync(outputPath, 'utf8'))).toEqual({ en: { 'default.save': 'Save' } });
  });

  test('picks up delivered locales and ignores a stale aggregate', () => {
    const chinese = { 'default.save': '保存' };
    fs.writeFileSync(path.join(directory, 'zh-CN.json'), JSON.stringify(chinese));
    fs.writeFileSync(outputPath, JSON.stringify({ obsolete: { 'default.save': 'stale' } }));
    fs.writeFileSync(path.join(directory, 'README.md'), 'not a catalog');

    generateRuntimeCatalog(directory, outputPath);
    expect(JSON.parse(fs.readFileSync(outputPath, 'utf8'))).toEqual({ en: { 'default.save': 'Save' }, 'zh-CN': chinese });
  });

  test('rebuilds deterministically and removes deleted locales', () => {
    const target = path.join(directory, 'fr.json');
    fs.writeFileSync(target, JSON.stringify({ 'default.save': 'Enregistrer' }));
    generateRuntimeCatalog(directory, outputPath);
    const first = fs.readFileSync(outputPath, 'utf8');
    generateRuntimeCatalog(directory, outputPath);
    expect(fs.readFileSync(outputPath, 'utf8')).toBe(first);

    fs.unlinkSync(target);
    generateRuntimeCatalog(directory, outputPath);
    expect(JSON.parse(fs.readFileSync(outputPath, 'utf8'))).toEqual({ en: { 'default.save': 'Save' } });
  });

  test('rejects malformed deliveries rather than silently shipping stale messages', () => {
    fs.writeFileSync(path.join(directory, 'fr.json'), '{');
    expect(() => generateRuntimeCatalog(directory, outputPath)).toThrow(SyntaxError);
  });
});
