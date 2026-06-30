import { resolve } from 'path';

export const resolveSharedImportPath = (root: string, moduleName: string): string | null => {
  try {
    return require.resolve(moduleName, { paths: [resolve(root)] });
  } catch {
    return null;
  }
};
