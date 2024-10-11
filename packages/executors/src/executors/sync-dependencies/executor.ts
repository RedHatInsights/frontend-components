import { ExecutorContext, createProjectGraphAsync } from '@nx/devkit';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import * as semver from 'semver';
import { execSync } from 'child_process';
export interface SyncDependenciesExecutorOptions {
  baseBranch?: string;
  remote?: string;
}

const RANGE_REGEX = /^\D/;

function shouldBumpDependency(metadata: DependencyMetadata, currentRange: string) {
  if (!semver.valid(metadata.version)) {
    return false;
  }

  if (!semver.satisfies(metadata.version, currentRange)) {
    return false;
  }
  return true;
}

type DependencyMetadata = {
  source: string;
  target: string;
  type: string;
  path: string;
  version: string;
};

function commitToPrevious(baseBranch: string, remote: string) {
  const diffCommand = `git diff HEAD`;
  const addCommand = `git add .`;
  const commitToPreviousCommand = `git commit --no-edit -m "chore: [skip ci] sync dependencies"`;
  const pushCommand = `git push ${remote} ${baseBranch}`;
  // check if there are any changes to be committed
  const isDiff = execSync(diffCommand).toString().length > 0;
  if (isDiff) {
    execSync(addCommand);
    execSync(commitToPreviousCommand);
    execSync(pushCommand);
  }
}

export default async function syncDependencies(options: SyncDependenciesExecutorOptions, context: ExecutorContext): Promise<{ success: boolean }> {
  console.info(`Executing "sync dependencies"...`, options);
  const baseBranch = options.baseBranch || 'main';
  const remote = options.remote || 'origin';
  try {
    const projectName = context.projectName;
    if (!projectName) {
      throw new Error('Project name is required');
    }
    const currentProjectRoot = context.projectsConfigurations?.projects?.[projectName]?.root;
    if (!currentProjectRoot) {
      throw new Error('Project root is required');
    }
    const root = context.root;
    const dependencyGraph = await createProjectGraphAsync();
    const projectPackageJsonPath = join(root, currentProjectRoot, 'package.json');
    const initialProjectPackageJson = JSON.parse(readFileSync(projectPackageJsonPath).toString());
    const projectPackageJson = JSON.parse(readFileSync(projectPackageJsonPath).toString());
    const projectDependencies = dependencyGraph.dependencies[projectName]?.filter((d) => !d.target.startsWith('npm:'));
    const dependenciesMetadata = projectDependencies.reduce<DependencyMetadata[]>((acc, d) => {
      const packageRoot = context.projectsConfigurations?.projects?.[d.target]?.root;
      if (packageRoot) {
        const packageJson = JSON.parse(readFileSync(join(root, packageRoot, 'package.json')).toString());
        acc.push({
          ...d,
          path: join(root, packageRoot),
          version: packageJson.version,
        });
      }
      return acc;
    }, []);

    dependenciesMetadata.forEach((d) => {
      const currentRange = projectPackageJson.dependencies[d.target];
      const shouldBump = shouldBumpDependency(d, currentRange);
      if (shouldBump) {
        const maxVersion = semver.maxSatisfying([d.version, currentRange], currentRange);
        const prefix = currentRange.match(RANGE_REGEX)?.[0] || '';
        const newVersion = `${prefix}${maxVersion}`;
        projectPackageJson.dependencies[d.target] = newVersion;
      }
    });

    if (JSON.stringify(initialProjectPackageJson) !== JSON.stringify(projectPackageJson)) {
      writeFileSync(projectPackageJsonPath, JSON.stringify(projectPackageJson, null, 2).concat('\n'), { encoding: 'utf-8' });
      commitToPrevious(baseBranch, remote);
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
