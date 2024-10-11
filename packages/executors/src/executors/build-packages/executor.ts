import { ExecutorContext } from '@nx/devkit';
import { z } from 'zod';
import fse from 'fs-extra';
import { glob } from 'glob';
import path from 'path';

const BuilderExecutorSchema = z.object({
  outputPath: z.string(),
  forceTypes: z.boolean().optional(),
});

export type BuilderExecutorSchemaType = z.infer<typeof BuilderExecutorSchema>;

type RunOptions = {
  files: string[];
  forceTypes?: boolean;
  indexTypings: string[];
  root: string;
  outputRoot: string;
};

const foldersBlackList = ['__snapshots__', '__mocks__'];

async function copyTypings(files: string[], dest: string) {
  const cmds: Promise<any>[] = [];
  files.forEach((file) => {
    const fileName = file.split('/').pop();
    cmds.push(fse.copyFile(file, `${dest}/${fileName}`));
  });
  return Promise.all(cmds);
}

async function createPackage(file: string, options: RunOptions) {
  const fileName = file.split('/').pop();
  const esmSource = glob.sync(`${options.outputRoot}/esm/${fileName}/**/index.js`)[0];
  /**
   * Prevent creating package.json for directories with no JS files (like CSS directories)
   */
  if (!esmSource) {
    return;
  }

  const packagePath = file.split('/src/').pop();
  if (!packagePath) {
    throw new Error('Invalid package path');
  }

  const destFile = `${path.resolve(options.outputRoot, packagePath)}/package.json`;

  const esmRelative = path.relative(file.replace('/src', '').replace('/packages', '/dist'), esmSource);
  const content: {
    main: string;
    module: string;
    typings?: string;
  } = {
    main: 'index.js',
    module: esmRelative,
  };
  const typings = glob.sync(`${options.root}/src/${fileName}/*.d.ts`);
  const cmds = [];
  if (options.forceTypes) {
    content.typings = 'index.d.ts';
  } else if (typings.length > 0) {
    const hasIndex = glob.sync(`${options.root}/src/${fileName}/index.d.ts`).length > 0;
    if (hasIndex) {
      content.typings = 'index.d.ts';
    }

    cmds.push(copyTypings(typings, `${options.outputRoot}/${fileName}`));
  }

  cmds.push(fse.writeJSON(destFile, content));

  return Promise.all(cmds);
}

async function generatePackages(options: RunOptions) {
  const cmds = options.files.map((file) => createPackage(file, options));
  return Promise.all(cmds);
}

async function run(options: RunOptions) {
  try {
    await generatePackages(options);
    if (options.indexTypings.length === 1) {
      copyTypings(options.indexTypings, options.outputRoot);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
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
  const projectRoot = context.root;
  const currentProjectRoot = context.projectsConfigurations?.projects?.[projectName]?.root;

  if (!currentProjectRoot) {
    throw new Error('Project root is required');
  }
  const forceTypes = options.forceTypes;
  const outputDir = (projectRoot + '/' + options.outputPath).replace(/\/\//g, '/');

  const files = glob.sync(path.resolve(`${currentProjectRoot}/src/*`)).filter((item) => !foldersBlackList.some((name) => item.includes(name)));
  const indexTypings = glob.sync(`${currentProjectRoot}/src/index.d.ts`);
  await run({
    files,
    forceTypes,
    indexTypings,
    root: currentProjectRoot,
    outputRoot: outputDir,
  });
  return {
    success: true,
  };
}
