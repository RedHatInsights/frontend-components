import fse from 'fs-extra';
import { ComponentInfo } from './package-generator';

/**
 * Generates exports field for the workspace package.json to enable granular imports during development
 *
 * This creates modern exports field entries that enable granular imports like:
 * import { Section } from '@redhat-cloud-services/frontend-components/Section'
 *
 * The exports field is only added to the workspace package.json (not published to dist)
 * and provides import resolution for workspace symlink scenarios during development.
 * Barrel imports continue to work via index.ts re-exports in both contexts.
 *
 * @param componentInfos - Array of component information from generatePackageFile calls
 * @param packageJsonPath - Path to the workspace package.json file (not dist)
 * @returns Promise that resolves when exports field is written to workspace package.json
 */
export async function generateExportsField(componentInfos: ComponentInfo[], packageJsonPath: string): Promise<void> {
  // Initialize with main entry point
  const exports: Record<string, any> = {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/esm/index.js",
      "require": "./dist/index.js"
    }
  };

  // Add exports for each valid component
  for (const componentInfo of componentInfos) {
    if (componentInfo.hasValidJS) {
      exports[`./${componentInfo.componentName}`] = {
        "types": `./dist/${componentInfo.componentName}/index.d.ts`,
        "import": `./dist/esm/${componentInfo.componentName}/index.js`,
        "require": `./dist/${componentInfo.componentName}/index.js`
      };
    }
  }

  // Add catch-all exports for compatibility
  exports["./dist/*"] = "./dist/*";
  exports["./package.json"] = "./package.json";

  // Update main package.json with exports field
  const packageJson = await fse.readJson(packageJsonPath);
  packageJson.exports = exports;
  await fse.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  console.log(`Generated exports field with ${Object.keys(exports).length - 2} component exports`);
}