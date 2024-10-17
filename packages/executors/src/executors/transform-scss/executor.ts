import { ExecutorContext } from '@nx/devkit';
import { z } from 'zod';
import fs from 'fs';
import { glob } from 'glob';
import util from 'util';
import ts from 'typescript';

const asyncWriteFile = util.promisify(fs.writeFile);

const BuilderExecutorSchema = z.object({
  outputPath: z.string(),
});

export type BuilderExecutorSchemaType = z.infer<typeof BuilderExecutorSchema>;

// async function transformSassImport(sourceFile: ts.SourceFile) {
//   sourceFile.
// }

async function run(files: string[]) {
  const cmds: Promise<any>[] = [];

  files.forEach((file) => {
    const sourceFile = ts.createSourceFile(file, ts.sys.readFile(file) || '', ts.ScriptTarget.ESNext);
    if (sourceFile.text.includes('.scss')) {
      let content = sourceFile.getText();
      const isEsm = file.includes('/esm/');
      if (isEsm) {
        /**
         * For ESM module, tranform the CSS asset paht co CJS variant.
         * Referencing CSS in esm directories causes webpack to tree shake the assets leading to missing CSS rules in build output.
         */
        const prefix = file.split('/esm/').pop()?.split('/').shift();
        if (!prefix) {
          throw new Error('Invalid prefix');
        }
        content = content.replaceAll(/(?<=^import )'\.\/(?=.*\.scss)/gm, `'../${prefix}/`);
      }
      content = content.replace(/\.scss(?=('))/, '.css');
      content = content.replace(/\.scss(?=("\)))/, '.css');
      cmds.push(asyncWriteFile(file, content));
    }
  });

  return Promise.all(cmds);
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
  const files = glob.sync(`${outputDir}/**/*.js`);
  await run(files);
  return {
    success: true,
  };
}
