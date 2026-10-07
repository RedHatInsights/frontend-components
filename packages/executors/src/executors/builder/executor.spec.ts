import { ExecutorContext, runExecutor } from '@nx/devkit';
import { copyAssets } from '@nx/js';
import { existsSync } from 'fs';
import runBuilder, { BuilderExecutorSchemaType } from './executor';

jest.mock('@nx/devkit', () => ({ runExecutor: jest.fn() }));
jest.mock('@nx/js', () => ({ copyAssets: jest.fn() }));
jest.mock('fs', () => ({ ...jest.requireActual('fs'), existsSync: jest.fn() }));

const context: ExecutorContext = {
  root: '.',
  cwd: '.',
  isVerbose: false,
  projectName: 'example',
  projectsConfigurations: { version: 2, projects: { example: { root: 'packages/example' } } },
  nxJsonConfiguration: {},
  projectGraph: { nodes: {}, dependencies: {} },
};

const options: BuilderExecutorSchemaType = {
  main: 'packages/example/src/index.ts',
  outputPath: 'dist/example',
  cjsTsConfig: 'packages/example/tsconfig.cjs.json',
  esmTsConfig: 'packages/example/tsconfig.esm.json',
};

async function* successfulCompilation() {
  yield { success: true };
}

describe('Builder Executor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(runExecutor).mockImplementation(async () => successfulCompilation());
    jest.mocked(copyAssets).mockResolvedValue({ success: true });
    jest.mocked(existsSync).mockReturnValue(false);
  });

  it.each([
    ['defaults to false', {}, false],
    ['preserves an explicit false value', { clean: false }, false],
    ['preserves an explicit true value', { clean: true }, true],
  ] as const)('%s for both compilations', async (_description, overrides, clean) => {
    expect(await runBuilder({ ...options, ...overrides }, context)).toEqual({ success: true });
    expect(runExecutor).toHaveBeenCalledTimes(2);
    expect(runExecutor).toHaveBeenNthCalledWith(
      1,
      { project: 'example', target: 'build:bundles:tsc' },
      expect.objectContaining({ clean, tsConfig: options.cjsTsConfig, outputPath: options.outputPath }),
      context,
    );
    expect(runExecutor).toHaveBeenNthCalledWith(
      2,
      { project: 'example', target: 'build:bundles:tsc' },
      expect.objectContaining({ clean, tsConfig: options.esmTsConfig, outputPath: `${options.outputPath}/esm` }),
      context,
    );
  });
});
