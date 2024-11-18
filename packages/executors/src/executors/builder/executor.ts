import { ExecutorContext } from '@nx/devkit';
import { tscExecutor } from '@nx/js/src/executors/tsc/tsc.impl';
import { copyAssets } from '@nx/js';
import { ExecutorOptions as TscExecutorOptions } from '@nx/js/src/utils/schema';
import { existsSync, unlink } from 'fs';
import { z } from 'zod';
import { promisify } from 'util';

const asyncUnlink = promisify(unlink);

const BuilderExecutorSchema = z.object({
  esmTsConfig: z.string(),
  cjsTsConfig: z.string(),
  outputPath: z.string(),
});

export type BuilderExecutorSchemaType = Omit<TscExecutorOptions, 'tsConfig'> & z.infer<typeof BuilderExecutorSchema>;

async function removeEsmPackageJson(esmOutputPath: string) {
  const esmPackageJsonPath = `${esmOutputPath}/package.json`;
  if (existsSync(esmPackageJsonPath)) {
    return asyncUnlink(esmPackageJsonPath);
  }
}

export default async function runExecutor(options: BuilderExecutorSchemaType, context: ExecutorContext) {
  try {
    BuilderExecutorSchema.parse(options);
  } catch (error) {
    throw new Error(`Invalid options passed to builder executor: ${error}`);
  }

  const projectName = context.projectName;
  if (!projectName) {
    throw new Error('Project name is required');
  }

  const currentProjectRoot = context.projectsConfigurations?.projects[projectName]?.root;
  if (!currentProjectRoot) {
    throw new Error('Project root is required');
  }

  async function resolveExecutors(...executorResults: ReturnType<typeof tscExecutor>[]) {
    for await (const executor of executorResults) {
      for await (const result of executor) {
        if (!result.success) {
          return { success: false };
        }
      }
    }
    return { success: true };
  }

  const { cjsTsConfig, esmTsConfig, ...tscOptions } = options;
  const esmOutputDir = options.outputPath + '/esm';
  const cjsTscOptions = { ...tscOptions, tsConfig: cjsTsConfig };
  const esmTscOptions = { ...tscOptions, outputPath: esmOutputDir, tsConfig: esmTsConfig };
  let executionResult = { success: false };
  const results = await Promise.all([tscExecutor(cjsTscOptions, context as any), tscExecutor(esmTscOptions, context as any)]);
  executionResult = await resolveExecutors(...results);
  if (!executionResult.success) {
    return executionResult;
  }
  await removeEsmPackageJson(esmOutputDir);
  await copyAssets({ outputPath: options.outputPath, assets: [`${currentProjectRoot}/package.json`, ...(options.assets ?? [])] }, context as any);

  return executionResult;
}
