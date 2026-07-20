import { ExecutorContext } from '@nx/devkit';
import { z } from 'zod';
import { sync } from 'glob';
import path from 'path';
import madge from 'madge';

const BuilderExecutorSchema = z.object({
  sourceDir: z.string(),
});

export type BuilderExecutorSchemaType = z.infer<typeof BuilderExecutorSchema>;

function printCircularImports(projectName: string, circular: string[][]) {
  console.error('Circular imports found in project:', projectName, '!');
  console.group('Circular imports:');
  circular.forEach((c) => {
    console.info(c.join(' -> '));
  });
  console.groupEnd();
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

  const sourceDir = path.join(projectRoot, options.sourceDir);
  const files = sync(`${sourceDir}/**/*.{ts,tsx,js,jsx}`).filter((file) => !file.match(/(spec|test)\.(tsx|jsx|js|ts)$/));
  const res = await Promise.all(files.map((file) => madge(file).then((res) => ({ file, madge: res }))));
  const circular = res
    .filter((r) => r.madge.circular().length > 0)
    .map(({ file, madge }) => ({ file, circular: madge.circular() }))
    .flatMap(({ file, circular }) => circular.map((c) => [file, ...c]));

  if (circular.length > 0) {
    printCircularImports(projectName, circular);
    return {
      success: false,
    };
  }
  return {
    success: true,
  };
}
