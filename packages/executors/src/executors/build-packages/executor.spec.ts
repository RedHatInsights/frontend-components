import { BuilderExecutorSchema } from './schema';
import executor from './executor';
import { ExecutorContext } from '@nx/devkit';

jest.mock('fs', () => ({
  __esModule: true,
  stat: (_path, cb) => cb(),
}));

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (_command, cb) => cb(),
  execSync: () => undefined,
}));

const options: BuilderExecutorSchema = {
  assets: [],
  cjsTsConfig: 'cjsTsConfig',
  esmTsConfig: 'esmTsConfig',
  outputPath: 'outputPath',
};

describe('Builder Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {} as ExecutorContext);
    expect(output.success).toBe(true);
  });
});
