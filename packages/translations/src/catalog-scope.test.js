import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { globSync } from 'glob';

const root = resolve(__dirname, '../../..');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const validation = readJson('i18n/catalog-validation.json');

// Exercise the actual npm extractor in a disposable repository layout, not a
// second implementation of its globs. Synthetic messages never enter catalogs.
describe('repository-wide catalog extraction', () => {
  let fixture;
  const write = (path, source) => {
    const target = join(fixture, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, source);
  };
  const descriptor = (id) => `import { defineMessages } from 'react-intl';
    export default defineMessages({ label: { id: '${id}', defaultMessage: 'Fixture label' } });`;

  beforeEach(() => {
    fixture = mkdtempSync(join(tmpdir(), 'frontend-components-extraction-'));
    write('package.json', JSON.stringify({ private: true, workspaces: ['packages/translations'] }));
    write('packages/translations/package.json', JSON.stringify(readJson('packages/translations/package.json')));
  });

  afterEach(() => rmSync(fixture, { recursive: true, force: true }));

  test('finds all four production extensions, other runtime packages, and future packages; excludes test-only sources', () => {
    const production = [
      'packages/components/src/Example.js',
      'packages/advisor-components/src/Example.jsx',
      'packages/chrome/src/Example.ts',
      'packages/notifications/src/Example.tsx',
      'packages/new-runtime-package/src/nested/Example.tsx',
    ];
    const excluded = [
      'packages/components/src/Example.test.js',
      'packages/advisor-components/src/Example.spec.jsx',
      'packages/components/src/Example.stories.tsx',
      'packages/translations/src/test-setup.ts',
      'packages/chrome/src/ChromeProvider/__mocks__/Example.tsx',
      'packages/components/src/nested/__tests__/Example.jsx',
      'packages/components/src/nested/__fixtures__/Example.js',
      'packages/components/src/nested/fixtures/Example.ts',
      'packages/utils/src/TestingUtils/Example.tsx',
    ];
    production.forEach((path, i) => write(path, descriptor(`fixture.production${i}`)));
    excluded.forEach((path, i) => write(path, descriptor(`fixture.excluded${i}`)));
    write('packages/components/src/Example.d.ts', 'Deliberately invalid declaration source; extraction must ignore it.');
    const output = join(fixture, 'messages.json');
    const result = spawnSync(
      'npm',
      ['run', 'extract', '--workspace=@redhat-cloud-services/frontend-components-translations', '--', '--out-file', output],
      { cwd: fixture, encoding: 'utf8', env: { ...process.env, PATH: `${join(root, 'node_modules/.bin')}:${process.env.PATH}` } },
    );
    if (result.status !== 0) throw new Error(`Extraction failed: ${result.stdout}\n${result.stderr}`);
    expect(Object.keys(JSON.parse(readFileSync(output, 'utf8')))).toEqual(production.map((_, i) => `fixture.production${i}`));
    const lintFiles = globSync(validation.sourceLint.files, { cwd: fixture });
    production.forEach((path) => expect(lintFiles).toContain(path));
    excluded.slice(0, 4).forEach((path) => expect(lintFiles).not.toContain(path));
  }, 30000);

  test.each([
    'advisorComponents.reportDetails.showSteps',
    'components.reboot.text',
    'components.tableViewEmptyState.defaultEmptyStateNoResultsBody',
    'components.dateFormat.justNow',
    'components.tagFilter.applicableToItems',
    'notifications.notificationPagination.clearAll',
    'remediations.remediationLoadError.failedToLoad',
    'ruleComponents.filters.category.security',
    'utils.parseCvssScore.unavailableTooltip',
    'default.save',
  ])('includes runtime message %s in the source catalog', (id) => {
    expect(readJson('i18n/translation-template.json')[id].defaultMessage).toEqual(expect.any(String));
  });
});
