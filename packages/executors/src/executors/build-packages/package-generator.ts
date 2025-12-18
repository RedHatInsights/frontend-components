import fse from 'fs-extra';
import { glob } from 'glob';
import path from 'path';

export type ComponentInfo = {
  file: string;
  componentName: string;
  packageJsonPath: string;
  hasValidJS: boolean;
};

export type RunOptions = {
  files: string[];
  forceTypes?: boolean;
  indexTypings: string[];
  root: string;
  outputRoot: string;
  generateExports?: boolean;
};

export type PackageJsonContent = {
  main: string;
  module?: string;
  typings?: string;
};

async function copyTypings(files: string[], dest: string) {
  const cmds: Promise<any>[] = [];
  files.forEach((file) => {
    const fileName = file.split('/').pop();
    cmds.push(fse.copyFile(file, `${dest}/${fileName}`));
  });
  return Promise.all(cmds);
}

/**
 * Generates a single nested package.json file for a component in the dist folder
 *
 * These nested package.json files enable granular imports for published packages.
 * They are created in dist/ComponentName/package.json and get published to npm,
 * allowing external consumers to import specific components directly.
 *
 * Example: dist/Section/package.json → npm: @redhat-cloud-services/frontend-components/Section/package.json
 * Enables: import { Section } from '@redhat-cloud-services/frontend-components/Section'
 *
 * @param file - The source file path (e.g., "/path/to/src/Section")
 * @param options - Build options containing output paths and configuration
 * @returns Promise that resolves to ComponentInfo or null if no valid JS files
 */
export async function generatePackageFile(file: string, options: RunOptions): Promise<ComponentInfo | null> {
  const fileName = file.split('/').pop();
  if (!fileName) {
    throw new Error('Invalid file path');
  }

  let cjsSource = glob.sync(`${options.outputRoot}/${fileName}/**/index.js`)[0];
  let esmSource = glob.sync(`${options.outputRoot}/esm/${fileName}/**/index.js`)[0];

  /**
   * Prevent creating package.json for directories with no JS files (like CSS directories)
   * Check for CJS first, then ESM as fallback
   */
  if (!cjsSource && !esmSource) {
    return null;
  }

  if (esmSource) {
    esmSource = esmSource.replace(/\/index\.js$/, '');
  }
  if (cjsSource) {
    cjsSource = cjsSource.replace(/\/index\.js$/, '');
  }

  const packagePath = file.split('/src/').pop();
  if (!packagePath) {
    throw new Error('Invalid package path');
  }

  const destFile = `${path.resolve(options.outputRoot, packagePath)}/package.json`;

  const content: PackageJsonContent = {
    main: 'index.js',
  };

  // Only add module field if ESM build exists
  if (esmSource && cjsSource) {
    const esmRelative = path.relative(cjsSource, esmSource) + '/index.js';
    content.module = esmRelative;
  }

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

  await Promise.all(cmds);

  const componentInfo: ComponentInfo = {
    file,
    componentName: fileName,
    packageJsonPath: destFile,
    hasValidJS: true,
  };

  return componentInfo;
}

/**
 * Utility function to check if a component has valid JS files
 * @param file - The source file path
 * @param outputRoot - The output directory
 * @returns boolean indicating if JS files exist
 */
export function hasValidJSFiles(file: string, outputRoot: string): boolean {
  const fileName = file.split('/').pop();
  if (!fileName) {
    return false;
  }

  const esmSource = glob.sync(`${outputRoot}/esm/${fileName}/**/index.js`)[0];
  return !!esmSource;
}