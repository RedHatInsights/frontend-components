import path from 'path';
import * as glob from 'glob';

const MODULES_ROOT = process.env.MODULES_ROOT;

const PACKAGES_ROOT = path.resolve(process.cwd(), 'packages');

export const CORE_DIRECTORIES = [
  glob.sync(`${process.cwd()}/node_modules/@patternfly/react-core`),
  glob.sync(`${PACKAGES_ROOT}/*/node_modules/@patternfly/react-core`),
].flat();

export const ICONS_DIRECTORIES = [
  glob.sync(`${process.cwd()}/node_modules/@patternfly/react-icons`),
  glob.sync(`${PACKAGES_ROOT}/*/node_modules/@patternfly/react-icons`),
].flat();

if (MODULES_ROOT) {
  // comma separated list of roots
  MODULES_ROOT.split(',').forEach((root) => {
    CORE_DIRECTORIES.push(...glob.sync(`${path.resolve(__dirname, root)}/node_modules/@patternfly/react-core`.replace(/\/\//, '/')));
    ICONS_DIRECTORIES.push(...glob.sync(`${path.resolve(__dirname, root)}/node_modules/@patternfly/react-icons`.replace(/\/\//, '/')));
  });
}

export function findFirstGlob(roots: string[], suffix: string, filter?: (path: string) => boolean): string | undefined {
  const adjustedSuffix = suffix.startsWith('/') ? suffix.substring(1) : suffix;

  return roots.flatMap((root) => {
    const found = glob.sync(`${root}/${adjustedSuffix}`);
    return filter !== undefined ? found.filter(filter) : found;
  })[0];
}
