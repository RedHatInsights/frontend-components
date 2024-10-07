import { ExecutorContext } from '@nx/devkit';
import { z } from 'zod';
import { stat } from 'fs';
import { promisify } from 'util';
import { exec, execSync } from 'child_process';

const asyncStat = promisify(stat);
const asyncExec = promisify(exec);

const BuilderExecutorSchema = z.object({
  esmTsConfig: z.string(),
  cjsTsConfig: z.string(),
  outputPath: z.string(),
  assets: z.array(z.string()).optional(),
});

export type BuilderExecutorSchemaType = z.infer<typeof BuilderExecutorSchema>;

async function validateExistingFile(path: string) {
  return asyncStat(path);
}

async function runTSC(tsConfigPath: string, outputDir: string) {
  try {
    execSync(`tsc -p ${tsConfigPath} --outDir ${outputDir}`, { stdio: 'inherit' });
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to run tsc for ${tsConfigPath}`);
  }
}

async function copyAssets(assets: string[], outputDir: string) {
  return Promise.all(assets.map((asset) => asyncExec(`cp -r ${asset} ${outputDir}`)));
}

export default async function runExecutor(options: BuilderExecutorSchemaType, context: ExecutorContext) {
  try {
    BuilderExecutorSchema.parse(options);
  } catch (error) {
    throw new Error(`Invalid options passed to builder executor: ${error}`);
  }

  const projectName = context.projectName;
  if(!projectName){ 
    throw new Error('Project name is required');
  }
  const projectRoot = context.root;
  const currentProjectRoot = context.projectsConfigurations?.projects?.[projectName]?.root;
  const projectPackageJsonPath = `${currentProjectRoot}/package.json`;
  const outputDir = `${projectRoot}/${options.outputPath}`;

  const assets = [...(options.assets ?? []), projectPackageJsonPath];

  await Promise.all([
    validateExistingFile(options.esmTsConfig),
    validateExistingFile(options.cjsTsConfig),
    validateExistingFile(projectPackageJsonPath),
  ]);
  await Promise.all([runTSC(options.esmTsConfig, `${outputDir}/esm`), runTSC(options.cjsTsConfig, outputDir)]);
  await copyAssets(assets, outputDir);
  return {
    success: true,
  };
}
