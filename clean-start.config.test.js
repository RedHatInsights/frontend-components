const { execFileSync } = require('node:child_process');

const consumers = ['components', 'advisor-components', 'notifications', 'remediations', 'rule-components', 'utils'];

// Exercise the installed TypeScript resolver and Nx task scheduler, not regexes
// over configuration. Model CI's independent jobs: no package build artifacts.
const probe = `
const path = require('node:path');
const ts = require('typescript');
const { createProjectGraphAsync } = require('@nx/devkit');
const nxRoot = path.dirname(require.resolve('nx/package.json'));
const { createTaskGraph } = require(path.join(nxRoot, 'dist/src/tasks-runner/create-task-graph'));
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
(async () => {
  const project = '@redhat-cloud-services/frontend-components';
  const generator = '@redhat-cloud-services/frontend-components-translations:generate:locales';
  const graph = await createProjectGraphAsync();
  const defaults = Object.fromEntries(Object.entries(require('./nx.json').targetDefaults).map(([name, config]) => [name, config.dependsOn || []]));
  const targets = {};
  for (const target of ['storybook', 'build-storybook', 'test:storybook', 'test:component']) {
    const tasks = createTaskGraph(graph, defaults, [project], [target], undefined, {});
    const pending = [...(tasks.dependencies[project + ':' + target] || [])];
    const visited = new Set();
    while (pending.length) {
      const id = pending.pop();
      if (visited.has(id)) continue;
      visited.add(id);
      pending.push(...(tasks.dependencies[id] || []));
    }
    targets[target] = visited.has(generator);
  }
  process.stdout.write(JSON.stringify({ modules, targets }), () => process.exit(0));
})().catch(error => { console.error(error); process.exit(1); });
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

  it.each(['storybook', 'build-storybook', 'test:storybook', 'test:component'])(
    '%s generates locale data before consuming provider source',
    (target) => {
      expect(result.targets[target]).toBe(true);
    },
  );
});
