/**
 * Builder Executor
 *
 * Builds TypeScript packages with dual CJS/ESM output and transforms package.json for publishing.
 * - Compiles TypeScript to both CommonJS (dist/) and ES Modules (dist/esm/)
 * - Automatically strips "dist/" prefixes from package.json entry points for npm publishing
 */

import { ExecutorContext } from '@nx/devkit';
import { tscExecutor } from '@nx/js/src/executors/tsc/tsc.impl';
import { copyAssets } from '@nx/js';
import { ExecutorOptions as TscExecutorOptions } from '@nx/js/src/utils/schema';
import { existsSync, unlink, readFileSync, writeFileSync } from 'fs';
import { z } from 'zod';
import { promisify } from 'util';
import path from 'path';

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

/**
  * Strip "dist/" prefixes from entry points defined in published package.json
  */
export function transformPackageJsonForPublishing(packageJson: any): any {

  const transformed = { ...packageJson };

  const distPrefixRegex = /^.?\/?dist/;

  // main field
  if (transformed.main && distPrefixRegex.test(transformed.main)) {
    transformed.main = transformed.main.replace(/dist\//, '');
    if( ! transformed.main.startsWith('./') ) {
      transformed.main = `./${transformed.main}`;
    }
  }

  // browser field
  if (transformed.browser && distPrefixRegex.test(transformed.browser)) {
    transformed.browser = transformed.browser.replace(/dist\//, '');
    if( ! transformed.browser.startsWith('./') ) {
      transformed.browser = `./${transformed.browser}`;
    }
  }

  // module field
  if (transformed.module && distPrefixRegex.test(transformed.module)) {
    transformed.module = transformed.module.replace(/dist\//, '');
    if( ! transformed.module.startsWith('./') ) {
      transformed.module = `./${transformed.module}`;
    }
  }

  // types field
  if (transformed.types && distPrefixRegex.test(transformed.types)) {
    transformed.types = transformed.types.replace(/dist\//, '');
    if( ! transformed.types.startsWith('./') ) {
      transformed.types = `./${transformed.types}`;
    }
  }

  // typings field
  if (transformed.typings && distPrefixRegex.test(transformed.typings)) {
    transformed.typings = transformed.typings.replace(/dist\//, '');
    if( ! transformed.typings.startsWith('./') ) {
      transformed.typings = `./${transformed.typings}`;
    }
  }

  return transformed;
}

async function copyPackageJsonWithTransform(sourcePath: string, outputPath: string) {
  try {
    const sourcePackageJson = JSON.parse(readFileSync(sourcePath, 'utf-8'));
    const transformedPackageJson = transformPackageJsonForPublishing(sourcePackageJson);
    const destinationPath = path.join(outputPath, 'package.json');
    writeFileSync(destinationPath, JSON.stringify(transformedPackageJson, null, 2));
  } catch (error) {
    throw new Error(`Failed to copy and transform package.json: ${error}`);
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
  const cjsTscOptions: TscExecutorOptions = { clean: false, ...tscOptions, tsConfig: cjsTsConfig };
  const esmTscOptions: TscExecutorOptions = { clean: false, ...tscOptions, outputPath: esmOutputDir, tsConfig: esmTsConfig };
  let executionResult = { success: false };
  const results = await Promise.all([tscExecutor(cjsTscOptions, context as any), tscExecutor(esmTscOptions, context as any)]);
  executionResult = await resolveExecutors(...results);
  if (!executionResult.success) {
    return executionResult;
  }
  await removeEsmPackageJson(esmOutputDir);

  // Copy and transform main package.json with stripped dist/ prefixes for publishing
  // Note: This only affects the main package.json - nested package.json files for granular imports
  // are handled separately by build-packages executor and already have correct entry points
  await copyPackageJsonWithTransform(`${currentProjectRoot}/package.json`, options.outputPath);

  // Copy other assets normally (excluding package.json since we handled it above)
  if (options.assets && options.assets.length > 0) {
    await copyAssets({ outputPath: options.outputPath, assets: options.assets }, context as any);
  }

  return executionResult;
}
