import { ExecutorContext, runExecutor } from '@nx/devkit';
import { copyAssets } from '@nx/js';
import { existsSync, unlink } from 'fs';
import { z } from 'zod';
import { promisify } from 'util';

const asyncUnlink = promisify(unlink);

const BuilderExecutorSchema = z.object({
  esmTsConfig: z.string(),
  cjsTsConfig: z.string(),
  outputPath: z.string(),
});

type BundleAssets = Parameters<typeof copyAssets>[0]['assets'];

export interface BuilderExecutorSchemaType extends z.infer<typeof BuilderExecutorSchema> {
  main: string;
  rootDir?: string;
  assets?: BundleAssets;
  clean?: boolean;
}

async function removeEsmPackageJson(esmOutputPath: string) {
  const esmPackageJsonPath = `${esmOutputPath}/package.json`;
  if (existsSync(esmPackageJsonPath)) {
    return asyncUnlink(esmPackageJsonPath);
  }
}

async function compileBundle(
  options: BuilderExecutorSchemaType,
  context: ExecutorContext,
  projectName: string,
  tsConfig: string,
  outputPath: string,
) {
  const { cjsTsConfig, esmTsConfig, ...tscOptions } = options;
  const target = { project: projectName, target: 'build:bundles:tsc' };
  const results = await runExecutor(target, { ...tscOptions, clean: tscOptions.clean ?? false, tsConfig, outputPath }, context);
  for await (const result of results) {
    if (!result.success) {
      return false;
    }
  }
  return true;
}

function getProjectRoot(context: ExecutorContext, projectName: string) {
  const projectRoot = context.projectsConfigurations?.projects[projectName]?.root;
  if (!projectRoot) {
    throw new Error('Project root is required');
  }
  return projectRoot;
}

async function finalizeBundle(options: BuilderExecutorSchemaType, context: ExecutorContext, projectRoot: string) {
  await removeEsmPackageJson(`${options.outputPath}/esm`);
  await copyAssets({ outputPath: options.outputPath, assets: [`${projectRoot}/package.json`, ...(options.assets ?? [])] }, context);
}

export default async function runBuilder(options: BuilderExecutorSchemaType, context: ExecutorContext) {
  BuilderExecutorSchema.parse(options);
  const projectName = context.projectName;
  if (!projectName) {
    throw new Error('Project name is required');
  }
  const projectRoot = getProjectRoot(context, projectName);
  const cjsCompiled = await compileBundle(options, context, projectName, options.cjsTsConfig, options.outputPath);
  const esmCompiled = cjsCompiled && (await compileBundle(options, context, projectName, options.esmTsConfig, `${options.outputPath}/esm`));
  if (esmCompiled) {
    await finalizeBundle(options, context, projectRoot);
  }
  return { success: esmCompiled };
}
