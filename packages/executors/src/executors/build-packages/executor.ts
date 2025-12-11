/**
 * Build Packages Executor
 *
 * Generates nested package.json files and exports field for granular imports in directory-based packages.
 * - Scans src/* directories (e.g., src/Section/, src/Ansible/)
 * - Creates dist/Section/package.json, dist/Ansible/package.json for granular imports
 * - Auto-generates package.json exports field enabling both barrel and granular imports
 */

import { ExecutorContext } from '@nx/devkit';
import { z } from 'zod';
import fse from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { generatePackageFile, ComponentInfo, RunOptions } from './package-generator';
import { generateExportsField } from './exports-generator';

const BuilderExecutorSchema = z.object({
  outputPath: z.string(),
  forceTypes: z.boolean().optional(),
  generateExports: z.boolean().optional().default(true),
});

export type BuilderExecutorSchemaType = z.infer<typeof BuilderExecutorSchema>;

const foldersBlackList = ['__snapshots__', '__mocks__'];

async function copyTypings(files: string[], dest: string) {
  const cmds: Promise<any>[] = [];
  files.forEach((file) => {
    const fileName = file.split('/').pop();
    cmds.push(fse.copyFile(file, `${dest}/${fileName}`));
  });
  return Promise.all(cmds);
}

async function generatePackages(options: RunOptions, packageJsonPath: string) {
  const componentInfos: ComponentInfo[] = [];

  // TODO: Add cleanup task to remove orphaned nested package.json files when components are deleted

  // Generate package files and collect component information
  for (const file of options.files) {
    const componentInfo = await generatePackageFile(file, options);
    if (componentInfo) {
      componentInfos.push(componentInfo);
    }
  }

  // Generate exports field if enabled
  if (options.generateExports) {
    await generateExportsField(componentInfos, packageJsonPath);
  }

  return componentInfos;
}

async function run(options: RunOptions, packageJsonPath: string) {
  try {
    await generatePackages(options, packageJsonPath);
    if (options.indexTypings.length === 1) {
      copyTypings(options.indexTypings, options.outputRoot);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default async function runExecutor(options: BuilderExecutorSchemaType, context: ExecutorContext) {
  let parsedOptions;
  try {
    // Parse options and apply Zod defaults (e.g., generateExports: true)
    parsedOptions = BuilderExecutorSchema.parse(options);
  } catch (error) {
    throw new Error(`Invalid options passed to builder executor: ${error}`);
  }

  const projectName = context.projectName;
  if (!projectName) {
    throw new Error('Project name is required');
  }
  const projectRoot = context.root;
  const currentProjectRoot = context.projectsConfigurations?.projects?.[projectName]?.root;

  if (!currentProjectRoot) {
    throw new Error('Project root is required');
  }
  const forceTypes = parsedOptions.forceTypes;
  const outputDir = (projectRoot + '/' + parsedOptions.outputPath).replace(/\/\//g, '/');

  const files = glob.sync(path.resolve(`${currentProjectRoot}/src/*`)).filter((item) => !foldersBlackList.some((name) => item.includes(name)));
  const indexTypings = glob.sync(`${currentProjectRoot}/src/index.d.ts`);

  // Pass main package.json path for exports generation
  const mainPackageJsonPath = path.resolve(currentProjectRoot, 'package.json');

  await run({
    files,
    forceTypes,
    indexTypings,
    root: currentProjectRoot,
    outputRoot: outputDir,
    generateExports: parsedOptions.generateExports, // Use parsed options to get Zod defaults
  }, mainPackageJsonPath);

  return {
    success: true,
  };
}
