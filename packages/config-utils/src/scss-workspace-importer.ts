import fs from 'fs';
import path from 'path';

/**
 * Creates a universal SASS importer that handles @redhat-cloud-services package resolution
 * across different contexts: workspace symlinks, published packages, and standalone apps.
 *
 * After the package-level dist migration, SCSS files are located in package-specific dist/ folders.
 * This importer automatically detects the context and tries multiple resolution strategies:
 * 1. Workspace symlink detection - append /dist to reach files in workspace packages
 * 2. Published package structure - direct path resolution for npm-installed packages
 * 3. Graceful fallback - return null to let sass handle resolution normally
 *
 * @param startPath - Starting directory for workspace detection (can be any directory)
 * @returns A SASS importer object with findFileUrl function
 */
export function createScssWorkspaceImporter(startPath: string) {
  return {
    findFileUrl: (url: string) => {
      // Only handle @redhat-cloud-services packages
      if (!url.startsWith('~@redhat-cloud-services')) {
        return null; // Let sass handle other imports
      }

      const fullPath = url.split('~@redhat-cloud-services/').pop();
      if (!fullPath) return null;

      const pathParts = fullPath.split('/');
      const packageName = pathParts[0];
      const filePath = pathParts.slice(1).join('/');

      // Strategy 1: Try workspace symlink + /dist
      const workspaceResult = tryWorkspaceResolution(startPath, packageName, filePath);
      if (workspaceResult) return workspaceResult;

      // Strategy 2: Try published package structure
      const publishedResult = tryPublishedResolution(startPath, packageName, filePath);
      if (publishedResult) return publishedResult;

      // Strategy 3: Graceful failure
      return null;
    }
  };
}

function tryWorkspaceResolution(startPath: string, packageName: string, filePath: string): URL | null {
  // Walk up directories to find node_modules with @redhat-cloud-services
  let currentPath = startPath;
  while (currentPath !== path.dirname(currentPath)) {
    const nodeModulesPath = path.join(currentPath, 'node_modules', '@redhat-cloud-services', packageName);

    try {
      const symlinkStat = fs.lstatSync(nodeModulesPath, { throwIfNoEntry: false });
      if (symlinkStat?.isSymbolicLink()) {
        // Workspace detected - try /dist path
        const distPath = path.join(nodeModulesPath, 'dist', filePath);
        if (fs.existsSync(distPath)) {
          return new URL(`file://${distPath}`);
        }

        // Try with .scss extension
        if (!distPath.endsWith('.scss')) {
          const scssPath = `${distPath}.scss`;
          if (fs.existsSync(scssPath)) {
            return new URL(`file://${scssPath}`);
          }
        }
      }
    } catch (error) {
      // Continue searching
    }

    currentPath = path.dirname(currentPath);
  }

  return null;
}

function tryPublishedResolution(startPath: string, packageName: string, filePath: string): URL | null {
  // Try published package structure (no /dist needed)
  let currentPath = startPath;
  while (currentPath !== path.dirname(currentPath)) {
    const publishedPath = path.join(currentPath, 'node_modules', '@redhat-cloud-services', packageName, filePath);

    if (fs.existsSync(publishedPath)) {
      return new URL(`file://${publishedPath}`);
    }

    // Try with .scss extension
    if (!publishedPath.endsWith('.scss')) {
      const scssPath = `${publishedPath}.scss`;
      if (fs.existsSync(scssPath)) {
        return new URL(`file://${scssPath}`);
      }
    }

    currentPath = path.dirname(currentPath);
  }

  return null;
}

/**
 * Legacy function for backward compatibility - used by build-styles executor
 * @deprecated Use createScssWorkspaceImporter instead
 */
export function createScssImporter(projectRoot: string, currentProjectRoot: string) {
  // For now, just use the new function with projectRoot
  // The currentProjectRoot parameter was used for some edge cases but the main logic uses projectRoot
  return createScssWorkspaceImporter(projectRoot);
}