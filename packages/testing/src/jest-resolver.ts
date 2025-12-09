/**
 * Custom Jest resolver that removes exports field from workspace packages
 * This allows Jest to fall back to moduleNameMapper for workspace packages
 * Based on solution from: https://github.com/facebook/jest/issues/9771#issuecomment-841624042
 */

import * as fs from 'fs';
import * as path from 'path';

// Cache for workspace package names to avoid repeated file reads
let workspacePackageNames: string[] | null = null;

interface PackageJson {
  name?: string;
  workspaces?: string[];
  exports?: any;
}

interface ResolverOptions {
  defaultResolver: (request: string, options: ResolverOptions) => string;
  packageFilter?: (pkg: PackageJson) => PackageJson;
}

function getWorkspacePackageNames(): string[] {
  if (workspacePackageNames !== null) {
    return workspacePackageNames;
  }

  try {
    // Read root package.json to get workspace configuration
    // Updated path since we're now in packages/testing/src/
    const rootPackageJson: PackageJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf8')
    );
    const workspaces = rootPackageJson.workspaces || [];

    // Get actual package names from each workspace package.json
    workspacePackageNames = workspaces
      .map((workspace) => {
        try {
          const packageJsonPath = path.resolve(__dirname, '../../../', workspace, 'package.json');
          const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          return packageJson.name;
        } catch (error) {
          // If package.json doesn't exist or can't be read, skip this workspace
          return null;
        }
      })
      .filter((name): name is string => name !== null);

    return workspacePackageNames;
  } catch (error) {
    return [];
  }
}

const resolver = (request: string, options: ResolverOptions) => {
  const workspacePackages = getWorkspacePackageNames();

  return options.defaultResolver(request, {
    ...options,
    packageFilter: (pkg: PackageJson) => {
      // Only apply to workspace packages, not local files
      if (pkg.name && workspacePackages.includes(pkg.name)) {
        delete pkg.exports;
      }
      return pkg;
    },
  });
};

// Use CommonJS export for Jest compatibility
module.exports = resolver;