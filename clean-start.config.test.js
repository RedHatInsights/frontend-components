const { execFileSync } = require('node:child_process');

const consumers = ['components', 'advisor-components', 'notifications', 'remediations', 'rule-components', 'utils'];

// Exercise the installed TypeScript resolver, not regexes over configuration.
// Model CI's independent jobs: no package build artifacts.
const probe = `
const path = require('node:path');
const ts = require('typescript');
const root = process.cwd();
const dist = path.join(root, 'dist') + path.sep;
const host = { ...ts.sys, fileExists: file => !path.resolve(file).startsWith(dist) && ts.sys.fileExists(file) };
const entry = path.join(root, 'packages/utils/src/parseCvssScore/parseCvssScore.tsx');
const imports = [
  '@redhat-cloud-services/frontend-components-translations',
  '@redhat-cloud-services/frontend-components-translations/localization',
];
const modules = Object.fromEntries(${JSON.stringify(consumers)}.map(folder => {
  const configFile = path.join(root, 'packages', folder, 'tsconfig.spec.json');
  const config = ts.readConfigFile(configFile, ts.sys.readFile);
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\\n'));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configFile));
  return [folder, imports.map(name => {
    const resolved = ts.resolveModuleName(name, entry, parsed.options, host).resolvedModule;
    return resolved ? path.relative(root, resolved.resolvedFileName).replaceAll(path.sep, '/') : null;
  })];
}));
const fs = require('node:fs');
const loader = path.join(root, 'packages/translations/src/loadMessages.js');
const nativeImports = Object.fromEntries(['cjs', 'esm'].map(format => {
  const configFile = path.join(root, 'packages/translations', 'tsconfig.' + format + '.json');
  const config = ts.readConfigFile(configFile, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configFile));
  const emitted = ts.transpileModule(fs.readFileSync(loader, 'utf8'), { fileName: loader, compilerOptions: parsed.options });
  const source = ts.createSourceFile('loadMessages.js', emitted.outputText, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  let count = 0;
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) count++;
    ts.forEachChild(node, visit);
  }
  visit(source);
  return [format, count];
}));
const nxRoot = path.dirname(require.resolve('nx/package.json'));
const { getTargetInputs } = require(path.join(nxRoot, 'dist/src/hasher/task-hasher'));
const componentInputs = getTargetInputs(require('./nx.json'), { data: require('./packages/components/project.json') }, 'test:component');
process.stdout.write(JSON.stringify({ modules, nativeImports, componentInputs }));
`;

describe('localization consumers from a clean checkout', () => {
  let result;
  beforeAll(() => {
    result = JSON.parse(
      execFileSync(process.execPath, ['-e', probe], {
        cwd: __dirname,
        env: { ...process.env, NX_DAEMON: 'false' },
        encoding: 'utf8',
        timeout: 30000,
      }),
    );
  }, 35000);

  it.each(
    consumers.flatMap((folder) => [
      [folder, 0, 'index.js'],
      [folder, 1, 'localization.js'],
    ]),
  )('resolves %s test import %i into current source without dist', (folder, index, file) => {
    expect(result.modules[folder][index]).toBe(`packages/translations/src/${file}`);
  });

  it.each(['cjs', 'esm'])('preserves native lazy imports in the %s build instead of synchronous require contexts', (format) => {
    expect(result.nativeImports[format]).toBe(1);
  });

  it('hashes locale deliveries and dependency source directly without a generation task', () => {
    expect(result.componentInputs.selfInputs).toContain('{workspaceRoot}/locales/*.json');
    expect(result.componentInputs.dependencyInputs).toContain('{projectRoot}/**/*');
  });
});
