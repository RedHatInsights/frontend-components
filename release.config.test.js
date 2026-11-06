const { execFileSync } = require('node:child_process');
const path = require('node:path');
const nxRoot = path.dirname(require.resolve('nx/package.json'));
const { satisfies } = require(require.resolve('semver', { paths: [nxRoot] }));

const consumers = ['components', 'advisor-components', 'notifications', 'remediations', 'rule-components', 'utils'];
const dependency = '@redhat-cloud-services/frontend-components-translations';
const preservedCollections = ['devDependencies', 'peerDependencies', 'optionalDependencies'];

// Run the installed Nx implementation in native Node, without Jest module mocks,
// path aliases, a build, registry access, or a live release. FsTree writes stay in memory.
const probe = `
const path = require('node:path');
const { readJson, writeJson } = require('@nx/devkit');
const nxRoot = path.dirname(require.resolve('nx/package.json'));
const { inc } = require(require.resolve('semver', { paths: [nxRoot] }));
const jsRoot = path.dirname(require.resolve('@nx/js/package.json'));
const { FsTree } = require(path.join(nxRoot, 'dist/src/generators/tree'));
const { ReleaseGraph } = require(path.join(nxRoot, 'dist/src/command-line/release/utils/release-graph'));
const JsVersionActions = require(path.join(jsRoot, 'dist/src/release/version-actions')).default;
const consumers = ${JSON.stringify(consumers)};
const dependency = ${JSON.stringify(dependency)};
const collections = ['dependencies', ...${JSON.stringify(preservedCollections)}];
const currentVersion = require('./packages/translations/package.json').version;
const nextVersion = inc(currentVersion, 'minor');
const group = { version: require('./nx.json').release.version };
const graph = { nodes: {}, dependencies: {} };
for (const folder of [...consumers, 'translations', 'chrome']) {
  const config = require('./packages/' + folder + '/project.json');
  graph.nodes[config.name] = {
    name: config.name,
    type: 'lib',
    data: { ...config, root: 'packages/' + folder, metadata: { js: { packageName: config.name } } },
  };
  graph.dependencies[config.name] = [];
}
async function simulate(folder, incompatiblePeer = false) {
  const root = 'packages/' + folder;
  const manifest = require('./' + root + '/package.json');
  const node = graph.nodes[manifest.name];
  const tree = new FsTree(process.cwd(), false);
  const paths = [root + '/package.json', 'dist/' + manifest.name + '/package.json'];
  const fixture = { name: manifest.name, version: manifest.version };
  for (const collection of collections) fixture[collection] = { [dependency]: '^' + currentVersion };
  if (consumers.includes(folder)) {
    if (!manifest.dependencies?.[dependency]) throw new Error(folder + ' must declare its runtime helper dependency');
    fixture.dependencies[dependency] = manifest.dependencies[dependency];
  }
  if (incompatiblePeer) fixture.peerDependencies[dependency] = '~' + currentVersion;
  paths.forEach(file => writeJson(tree, file, fixture));
  const before = paths.map(file => tree.read(file).toString());
  const config = ReleaseGraph.resolveFinalConfigForProject(group, node, false);
  const actions = new JsVersionActions(group, node, config);
  await actions.init(tree);
  let error;
  try {
    await actions.updateProjectDependencies(tree, graph, { [dependency]: '^' + nextVersion });
  } catch (failure) {
    error = failure.message;
  }
  return {
    folder,
    error,
    preserved: config.preserveMatchingDependencyRanges,
    manifests: paths.map(file => readJson(tree, file)),
    unchanged: paths.every((file, index) => tree.read(file).toString() === before[index]),
  };
}
(async () => {
  const results = [];
  for (const folder of consumers) {
    results.push({ normal: await simulate(folder), incompatible: await simulate(folder, true) });
  }
  process.stdout.write(JSON.stringify({ currentVersion, nextVersion, results, control: await simulate('chrome') }));
})().catch(error => { console.error(error); process.exitCode = 1; });
`;

describe('localization runtime dependency release minimums', () => {
  let result;
  beforeAll(() => {
    result = JSON.parse(execFileSync(process.execPath, ['-e', probe], { cwd: __dirname, encoding: 'utf8', timeout: 30000 }));
  }, 35000);

  const consumerResult = (folder) => result.results.find(({ normal }) => normal.folder === folder);

  it.each(consumers)('refreshes %s runtime minimum in both source and published manifests', (folder) => {
    const { normal } = consumerResult(folder);
    expect(normal.error).toBeUndefined();
    normal.manifests.forEach((manifest) => {
      const range = manifest.dependencies[dependency];
      expect(range).toBe(`^${result.nextVersion}`);
      expect(satisfies(result.currentVersion, range)).toBe(false);
      expect(satisfies(result.nextVersion, range)).toBe(true);
    });
  });

  it.each(consumers)('preserves %s matching dev, peer and optional ranges', (folder) => {
    const { normal } = consumerResult(folder);
    expect(normal.error).toBeUndefined();
    normal.manifests.forEach((manifest) => {
      preservedCollections.forEach((collection) => expect(manifest[collection][dependency]).toBe(`^${result.currentVersion}`));
    });
  });

  it.each(consumers)('still rejects %s incompatible peers without partial manifest writes', (folder) => {
    const { incompatible } = consumerResult(folder);
    expect(incompatible.error).toMatch(/preserveMatchingDependencyRanges.*peerDependencies/);
    expect(incompatible.error).toContain('outside the current range');
    expect(incompatible.unchanged).toBe(true);
  });

  it('keeps default range preservation outside the six changed projects', () => {
    expect(result.control.error).toBeUndefined();
    expect(result.control.preserved).toBe(true);
    expect(result.control.unchanged).toBe(true);
  });
});
