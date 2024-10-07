import { ExecutorContext } from '@nx/devkit';
import { z } from 'zod';
import fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import util from 'util';
import sass, { NodePackageImporter } from 'sass'

const asyncWriteFile = util.promisify(fs.writeFile);
const asyncCopyFile = util.promisify(fs.copyFile);

const BuilderExecutorSchema = z.object({
  outputPath: z.string(),
  sourceDir: z.string(),
});

export type BuilderExecutorSchemaType = z.infer<typeof BuilderExecutorSchema>;

async function buildStyle(file: string, outputDir: string, currentProjectRoot: string) {
  const lastFragment = file.split('/src/').pop()
  if (!lastFragment) {
    throw new Error(`Invalid file path: ${file}`);
  }

  const filePartial = file.split(currentProjectRoot).pop()?.split('/src/').pop();
  if (!filePartial) {
    throw new Error(`Invalid file path: ${file}`);
  }
  const outFiles = [path.join(outputDir, filePartial.replace(/scss$/, 'css')), path.join(outputDir, 'esm', filePartial.replace(/scss$/, 'css'))];
  const promises = outFiles.map((outFile) => {
    let targetDirs = outFile.split(outputDir);

    if(!targetDirs.length){
      throw new Error(`Invalid target directory: ${outFile}, ${targetDirs}`);
    }

    let targetPartial = targetDirs.pop()?.split('/');
    if(!targetPartial?.length){
      throw new Error(`Invalid target partial: ${outFile}, ${targetPartial}`);
    }
    
    targetPartial.pop();
    const targetDir = targetPartial.join('/')

    if (!fs.existsSync(path.join(outputDir, targetDir))) {
      fs.mkdirSync(path.join(outputDir, targetDir));
    }

    const render = sass.compileAsync(file,
      {
        importers: [new NodePackageImporter()],
      }
    ).then(({ css }) => {
      return asyncWriteFile(outFile, css, 'utf8');
    });
    const copy = asyncCopyFile(file, outFile.replace(/css$/, 'scss'));
    return Promise.all([render, copy]);
  });
  return Promise.all(promises);
}

async function buildStyles(files: string[], outputDir: string, currentProjectRoot: string) {
  const cmds = files.map(file => buildStyle(file, outputDir, currentProjectRoot));
  return Promise.all(cmds);
}

async function run(files: string[] = [], outputDir: string, currentProjectRoot: string) {
  try {
    await buildStyles(files, outputDir, currentProjectRoot);
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
  if(!projectName){ 
    throw new Error('Project name is required');
  }
  const projectRoot = context.root;
  const currentProjectRoot = context.projectsConfigurations?.projects?.[projectName]?.root;

  if (!currentProjectRoot) {
    throw new Error('Project root is required');
  }
  const outputDir = (projectRoot + "/" + options.outputPath).replace(/\/\//g, '/');

const files = glob.sync(path.resolve(`${currentProjectRoot}/src/**/*.scss`));
  await run(files, outputDir, currentProjectRoot);
  return {
    success: true,
  };
}
