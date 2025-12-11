import { transformPackageJsonForPublishing } from './executor';

describe('Builder Executor', () => {
  describe('transformPackageJsonForPublishing', () => {
    it('should strip "dist/" prefix from entry points', () => {
      const input = {
        name: 'test-package',
        main: 'dist/index.js',
        module: 'dist/esm/index.js',
        types: 'dist/index.d.ts',
        typings: 'dist/typings.d.ts'
      };

      const result = transformPackageJsonForPublishing(input);

      expect(result).toEqual({
        name: 'test-package',
        main: './index.js',
        module: './esm/index.js',
        types: './index.d.ts',
        typings: './typings.d.ts'
      });
    });

    it('should strip "./dist/" prefix from entry points', () => {
      const input = {
        name: 'test-package',
        main: './dist/index.js',
        module: './dist/esm/index.js',
        types: './dist/index.d.ts',
        typings: './dist/typings.d.ts'
      };

      const result = transformPackageJsonForPublishing(input);

      expect(result).toEqual({
        name: 'test-package',
        main: './index.js',
        module: './esm/index.js',
        types: './index.d.ts',
        typings: './typings.d.ts'
      });
    });

    it('should preserve other fields unchanged', () => {
      const input = {
        name: 'test-package',
        version: '1.0.0',
        main: './dist/index.js',
        description: 'test package',
        scripts: { build: 'tsc' },
        dependencies: { react: '^18.0.0' }
      };

      const result = transformPackageJsonForPublishing(input);

      expect(result).toEqual({
        name: 'test-package',
        version: '1.0.0',
        main: './index.js',
        description: 'test package',
        scripts: { build: 'tsc' },
        dependencies: { react: '^18.0.0' }
      });
    });

    it('should handle missing entry point fields', () => {
      const input = {
        name: 'test-package',
        version: '1.0.0'
      };

      const result = transformPackageJsonForPublishing(input);

      expect(result).toEqual({
        name: 'test-package',
        version: '1.0.0'
      });
    });

    it('should not modify non-dist paths', () => {
      const input = {
        name: 'test-package',
        main: './index.js',
        module: './lib/index.js',
        types: './types/index.d.ts'
      };

      const result = transformPackageJsonForPublishing(input);

      expect(result).toEqual({
        name: 'test-package',
        main: './index.js',
        module: './lib/index.js',
        types: './types/index.d.ts'
      });
    });
  });

  it('can run', async () => {
    expect(true).toBe(true);
  });
});
