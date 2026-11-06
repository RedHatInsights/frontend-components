const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const yaml = require(require.resolve('yaml', { paths: [require.resolve('nx/package.json')] }));

jest.setTimeout(60000);

const titleWorkflow = yaml.parse(fs.readFileSync('.github/workflows/pr-title.yaml', 'utf8'));
const mainWorkflow = yaml.parse(fs.readFileSync('.github/workflows/ci.yaml', 'utf8'));
const titleStep = titleWorkflow.jobs['pr-title-lint'].steps.find((step) => step.env?.PR_TITLE);

function validate(title) {
  // Execute the actual workflow script and installed commitlint/configuration.
  // PR input stays in the environment, never interpolated into shell code.
  return spawnSync('bash', ['-c', titleStep.run], {
    encoding: 'utf8',
    env: { ...process.env, PR_TITLE: title, NX_DAEMON: 'false' },
    timeout: 30000,
  });
}

describe('stacked PR CI', () => {
  test('both PR bases are checked without enabling feature-branch releases', () => {
    expect(mainWorkflow.on.pull_request.branches).toEqual(['master', 'localization-runtime']);
    expect(titleWorkflow.on.pull_request.branches).toEqual(['master', 'localization-runtime']);
    expect(mainWorkflow.on.push.branches).toEqual(['master']);
    expect(mainWorkflow.jobs.release.if).toContain('refs/heads/master');
  });

  test.each([
    'fix: preserve conventional titles',
    '[RHCLOUD-53057] fix: prepare localization',
    '[RHCLOUD-53057] [RHCLOUD-53058] feat(@redhat-cloud-services/frontend-components-translations): prepare localization',
  ])('accepts %s', (title) => {
    const result = validate(title);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
  });

  test.each([
    '[RHCLOUD-53057] not a conventional title',
    '[RHCLOUD-53057] feat(utils): reject short scopes',
    '[RHCLOUD-53057] feat: reject missing scopes',
    '[RHCLOUD-53057] fix: Reject uppercase subjects',
    '[RHCLOUD-53057] fix:',
    '[not-a-ticket] fix: reject malformed metadata',
  ])('still rejects %s', (title) => {
    const result = validate(title);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
  });

  test('does not execute shell substitutions supplied in a title', () => {
    const result = validate('[RHCLOUD-53057] fix: keep $(printf tampered) literal');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('keep $(printf tampered) literal');
  });
});
