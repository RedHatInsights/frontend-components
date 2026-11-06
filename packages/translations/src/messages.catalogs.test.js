const { execFileSync } = require('node:child_process');
const path = require('node:path');
const catalog = require('../../../i18n/translation-template.json');

const packages = [
  ['components', 'components', 'ts'],
  ['advisor-components', 'advisorComponents', 'ts'],
  ['notifications', 'notifications', 'ts'],
  ['remediations', 'remediations', 'ts'],
  ['rule-components', 'ruleComponents', 'js'],
  ['utils', 'utils', 'ts'],
];

// Load descriptor modules and their shared helper from actual source with the
// installed compiler. No built artifacts or Jest alias may supply stale code.
const load = `
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
function loadSource(file) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file.replace(/\\.js$/, '.jsx'),
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const compiled = new Module(file, module);
  compiled.filename = file;
  compiled.paths = Module._nodeModulePaths(path.dirname(file));
  const manifest = JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), '../package.json'), 'utf8'));
  compiled.require = name => {
    const dependency = name.startsWith('@') ? name.split('/').slice(0, 2).join('/') : name.split('/')[0];
    if (!['dependencies', 'peerDependencies', 'optionalDependencies'].some(field => manifest[field]?.[dependency])) {
      throw new Error(manifest.name + ' imports undeclared runtime dependency ' + dependency);
    }
    return name === '@redhat-cloud-services/frontend-components-translations/localization'
      ? loadSource(path.resolve('packages/translations/src/localization.js'))
      : Module.prototype.require.call(compiled, name);
  };
  compiled._compile(code, file);
  return compiled.exports;
}
process.stdout.write(JSON.stringify(Object.values(loadSource(path.resolve(process.argv[1])).default)));
`;

describe('package message descriptors', () => {
  test.each(packages)('%s retains exact catalog IDs and English descriptors', (folder, prefix, extension) => {
    const root = path.resolve(__dirname, '../../..');
    const descriptors = JSON.parse(
      execFileSync(process.execPath, ['-e', load, `packages/${folder}/src/messages.${extension}`], {
        cwd: root,
        encoding: 'utf8',
        timeout: 30000,
      }),
    );
    descriptors.forEach(({ description }) => {
      expect(description).toEqual(expect.stringMatching(/\S/));
    });
    // FormatJS extraction collapses whitespace; retain original runtime spacing
    // (including nonbreaking spaces) in descriptors instead of changing UI copy.
    const actual = Object.fromEntries(
      descriptors.map(({ id, ...descriptor }) => [id, { ...descriptor, defaultMessage: descriptor.defaultMessage.replace(/\s+/g, ' ').trim() }]),
    );
    const expected = Object.fromEntries(Object.entries(catalog).filter(([id]) => id.startsWith(`${prefix}.`)));
    expect(descriptors.length).toBeGreaterThan(0);
    expect(Object.keys(actual)).toHaveLength(descriptors.length);
    expect(actual).toEqual(expected);
  });
});
