import { ExecutorContext } from '@nx/devkit';
import { z } from 'zod';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import util from 'util';
import sass from 'sass';
import { createScssWorkspaceImporter } from '@redhat-cloud-services/frontend-components-config-utilities';

const asyncWriteFile = util.promisify(fs.writeFile);
const asyncCopyFile = util.promisify(fs.copyFile);

const BuilderExecutorSchema = z.object({
  outputPath: z.string(),
  sourceDir: z.string(),
});

export type BuilderExecutorSchemaType = z.infer<typeof BuilderExecutorSchema>;

function importVariants(url: string) {
  const parsedUrl = path.parse(url);
  let variants = [url];
  if (parsedUrl.dir && !parsedUrl.ext) {
    const moduleName = url.split('/').pop();
    variants = [`${url.replace(new RegExp(`${moduleName}$`), `_${moduleName}`)}.scss`, `${url}.scss`];
  }

  return variants;
}

async function buildStyle(file: string, outputDir: string, currentProjectRoot: string, projectRoot: string) {
  const lastFragment = file.split('/src/').pop();
  if (!lastFragment) {
    throw new Error(`Invalid file path: ${file}`);
  }

  const filePartial = file.split(currentProjectRoot).pop()?.split('/src/').pop();
  if (!filePartial) {
    throw new Error(`Invalid file path: ${file}`);
  }
  const outFiles = [path.join(outputDir, filePartial.replace(/scss$/, 'css')), path.join(outputDir, 'esm', filePartial.replace(/scss$/, 'css'))];
  const promises = outFiles.map((outFile) => {
    const targetDirs = outFile.split(outputDir);

    if (!targetDirs.length) {
      throw new Error(`Invalid target directory: ${outFile}, ${targetDirs}`);
    }

    const targetPartial = targetDirs.pop()?.split('/');
    if (!targetPartial?.length) {
      throw new Error(`Invalid target partial: ${outFile}, ${targetPartial}`);
    }

    targetPartial.pop();
    const targetDir = targetPartial.join('/');

    if (!fs.existsSync(path.join(outputDir, targetDir))) {
      fs.mkdirSync(path.join(outputDir, targetDir));
    }

    const render = sass
      .compileAsync(file, {
        importers: [
          {
            findFileUrl: (url) => {
              if (url.startsWith('~')) {
                if (url.startsWith('~@redhat-cloud-services')) {
                  // Use shared workspace resolver for @redhat-cloud-services packages
                  const workspaceImporter = createScssWorkspaceImporter(projectRoot);
                  return workspaceImporter.findFileUrl(url);
                }
                // from node_modules
                const repoPackage = url.split('~').pop();
                if (!repoPackage) {
                  throw new Error(`Invalid package: ${url}`);
                }
                // project node_modules
                const projectModulesRoot = path.join(projectRoot, '/', currentProjectRoot, '/', 'node_modules', repoPackage);
                let variants = importVariants(projectModulesRoot);
                let sassPath = variants.find((v) => fs.existsSync(v));
                if (sassPath) {
                  return new URL(`file://${sassPath}`);
                }
                // root node_modules
                const modulesRoot = path.join(projectRoot, 'node_modules', repoPackage);
                variants = importVariants(modulesRoot);
                sassPath = variants.find((v) => fs.existsSync(v));
                if (sassPath) {
                  return new URL(`file://${sassPath}`);
                }
                throw new Error('Unable to find valid SCSS package');
              }
              return new URL(url);
            },
          },
        ],
      })
      .then(({ css }) => {
        // console.log({ css })
        return asyncWriteFile(outFile, css, 'utf8');
      });
    const copy = asyncCopyFile(file, outFile.replace(/css$/, 'scss'));
    return Promise.all([render, copy]);
  });
  return Promise.all(promises);
}

async function buildStyles(files: string[], outputDir: string, currentProjectRoot: string, projectRoot: string) {
  const cmds = files.map((file) => buildStyle(file, outputDir, currentProjectRoot, projectRoot));
  return Promise.all(cmds);
}

async function run(files: string[] = [], outputDir: string, currentProjectRoot: string, projectRoot: string) {
  try {
    await buildStyles(files, outputDir, currentProjectRoot, projectRoot);
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
  const outputDir = (projectRoot + '/' + options.outputPath).replace(/\/\//g, '/');

  const files = glob.sync(path.resolve(`${currentProjectRoot}/src/**/*.scss`));
  await run(files, outputDir, currentProjectRoot, projectRoot);
  return {
    success: true,
  };
}
