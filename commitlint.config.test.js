/**
 * Tests for the custom commitlint scope-full-name-for-versioning rule.
 *
 * @commitlint/lint v19+ is ESM-only, so we use dynamic import().
 * Run with: NODE_OPTIONS="--experimental-vm-modules" npx jest --config '{}' .commitlintrc.test.js
 */

const config = require('./commitlint.config');

/**
 * The default @commitlint/lint parser does not support the conventional
 * commits `!` breaking-change marker (e.g. `fix(scope)!: msg`). Without
 * explicit parserOpts the scope is mis-parsed on `!` messages.
 *
 * Provide the full header pattern so tests exercise the `!` code paths
 * correctly — this matches what @commitlint/config-conventional provides
 * at runtime via @commitlint/load.
 */
const parserOpts = {
  headerPattern: /^(\w*)(?:\(([^)]*)\))?!?: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
};

let lint;
beforeAll(async () => {
  const mod = await import('@commitlint/lint');
  lint = mod.default;
});

const lintMessage = (message) =>
  lint(message, config.rules, { plugins: config.plugins, parserOpts });

describe('commitlint scope-full-name-for-versioning', () => {
  // ── Should PASS ──────────────────────────────────────────────────────
  describe('valid commits', () => {
    it('feat with full project name', async () => {
      const result = await lintMessage(
        'feat(@redhat-cloud-services/frontend-components): add component'
      );
      expect(result.valid).toBe(true);
    });

    it('fix with full project name', async () => {
      const result = await lintMessage(
        'fix(@redhat-cloud-services/frontend-components-utilities): handle error'
      );
      expect(result.valid).toBe(true);
    });

    it('breaking with full project name', async () => {
      const result = await lintMessage(
        'feat(@redhat-cloud-services/chrome)!: remove v1'
      );
      expect(result.valid).toBe(true);
    });

    it('multiple scopes comma-separated', async () => {
      const result = await lintMessage(
        'feat(@redhat-cloud-services/frontend-components,@redhat-cloud-services/types): shared change'
      );
      expect(result.valid).toBe(true);
    });

    it('chore with short scope (no version impact)', async () => {
      const result = await lintMessage('chore(utils): update docs');
      expect(result.valid).toBe(true);
    });

    it('docs with short scope (no version impact)', async () => {
      const result = await lintMessage('docs(readme): add examples');
      expect(result.valid).toBe(true);
    });

    it('BREAKING CHANGE footer with full project name', async () => {
      const result = await lintMessage(
        'chore(@redhat-cloud-services/frontend-components): change\n\nBREAKING CHANGE: removed API'
      );
      expect(result.valid).toBe(true);
    });

    it('refactor with no scope (non-versioning)', async () => {
      const result = await lintMessage('refactor: rewrite internals');
      expect(result.valid).toBe(true);
    });

    it('chore with no scope (non-versioning)', async () => {
      const result = await lintMessage('chore: rewrite internals');
      expect(result.valid).toBe(true);
    });

    it('tests with no scope (non-versioning)', async () => {
      const result = await lintMessage('tests: rewrite internals');
      expect(result.valid).toBe(true);
    });


    it('ci with short scope', async () => {
      const result = await lintMessage('ci(lint): update config');
      expect(result.valid).toBe(true);
    });

    it('refactor with short scope', async () => {
      const result = await lintMessage('refactor(components): clean up');
      expect(result.valid).toBe(true);
    });

  });

  // ── Should FAIL ──────────────────────────────────────────────────────
  describe('invalid commits', () => {

    it('feat with area scope (deps)', async () => {
      const result = await lintMessage('feat(deps): upgrade PatternFly');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain(
        'must be a full Nx project name'
      );
    });

    it('fix with area scope (ci)', async () => {
      const result = await lintMessage('fix(ci): update workflow');
      expect(result.valid).toBe(false);
    });

    it('feat with short scope', async () => {
      const result = await lintMessage('feat(utils): add endpoint');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain(
        'must be a full Nx project name'
      );
      expect(result.errors[0].message).toContain('Use full project name like');
    });

    it('fix with short scope', async () => {
      const result = await lintMessage('fix(components): handle error');
      expect(result.valid).toBe(false);
    });

    it('breaking chore with short scope', async () => {
      const result = await lintMessage('chore(utils)!: breaking change');
      expect(result.valid).toBe(false);
    });

    it('breaking fix! with short scope', async () => {
      const result = await lintMessage('fix(chrome)!: breaking fix');
      expect(result.valid).toBe(false);
    });

    it('feat with made-up scope (short)', async () => {
      const result = await lintMessage('feat(my-package): something');
      expect(result.valid).toBe(false);
    });

    it('feat with made-up scope (full name)', async () => {
      const result = await lintMessage(
        'feat(@redhat-cloud-services/nonexistent): something'
      );
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('not found');
    });

    it('feat with no scope', async () => {
      const result = await lintMessage('feat: global change');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Scope required');
    });

    it('BREAKING CHANGE footer with no scope', async () => {
      const result = await lintMessage(
        'refactor: rewrite\n\nBREAKING CHANGE: new API'
      );
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Scope required');
    });

    it('BREAKING CHANGE footer with short scope', async () => {
      const result = await lintMessage(
        'chore(utils): change\n\nBREAKING CHANGE: removed old API'
      );
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain(
        'must be a full Nx project name'
      );
    });
  });
});
