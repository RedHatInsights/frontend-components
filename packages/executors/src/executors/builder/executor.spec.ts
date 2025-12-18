import { transformPackageJsonForPublishing, validatePackageJsonConfiguration } from './executor';

describe('Builder Executor', () => {
  describe('transformPackageJsonForPublishing', () => {

    it('should strip "dist/" prefix from entry points', () => {
      const input = {
        name: 'test-package',
        main: 'dist/index.js',
        module: 'dist/esm/index.js',
        types: 'dist/index.d.ts',
        typings: 'dist/typings.d.ts',
      };

      const result = transformPackageJsonForPublishing(input);

      expect(result).toEqual({
        name: 'test-package',
        main: './index.js',
        module: './esm/index.js',
        types: './index.d.ts',
        typings: './typings.d.ts',
      });
    });

    it('should strip "./dist/" prefix from entry points', () => {
      const input = {
        name: 'test-package',
        main: './dist/index.js',
        module: './dist/esm/index.js',
        types: './dist/index.d.ts',
        typings: './dist/typings.d.ts',
      };

      const result = transformPackageJsonForPublishing(input);

      expect(result).toEqual({
        name: 'test-package',
        main: './index.js',
        module: './esm/index.js',
        types: './index.d.ts',
        typings: './typings.d.ts',
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

    describe('bin field transformation', () => {
      it('should strip "dist/" prefix from string bin field', () => {
        const input = {
          name: 'test-package',
          main: 'dist/index.js',
          bin: 'dist/bin/cli.js'
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js',
          bin: './bin/cli.js'
        });
      });

      it('should strip "./dist/" prefix from string bin field', () => {
        const input = {
          name: 'test-package',
          main: './dist/index.js',
          bin: './dist/bin/cli.js'
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js',
          bin: './bin/cli.js'
        });
      });

      it('should strip "dist/" prefix from object bin field', () => {
        const input = {
          name: 'test-package',
          main: 'dist/index.js',
          bin: {
            fec: 'dist/bin/fec.js',
            'build-tool': 'dist/bin/build.js'
          }
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js',
          bin: {
            fec: './bin/fec.js',
            'build-tool': './bin/build.js'
          }
        });
      });

      it('should strip "./dist/" prefix from object bin field', () => {
        const input = {
          name: 'test-package',
          main: './dist/index.js',
          bin: {
            fec: './dist/bin/fec.js',
            'build-tool': './dist/bin/build.js'
          }
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js',
          bin: {
            fec: './bin/fec.js',
            'build-tool': './bin/build.js'
          }
        });
      });

      it('should not modify bin fields without dist/ prefix', () => {
        const input = {
          name: 'test-package',
          main: './dist/index.js',
          bin: {
            fec: './bin/fec.js',
            tool: 'scripts/tool.js'
          }
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js',
          bin: {
            fec: './bin/fec.js',
            tool: 'scripts/tool.js'
          }
        });
      });

      it('should handle mixed object bin field (some with dist/, some without)', () => {
        const input = {
          name: 'test-package',
          main: 'dist/index.js',
          bin: {
            fec: 'dist/bin/fec.js',
            tool: './scripts/tool.js',
            'build-cmd': './dist/bin/build.js'
          }
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js',
          bin: {
            fec: './bin/fec.js',
            tool: './scripts/tool.js',
            'build-cmd': './bin/build.js'
          }
        });
      });

      it('should handle missing bin field', () => {
        const input = {
          name: 'test-package',
          main: 'dist/index.js'
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js'
        });
      });

      it('should handle empty object bin field', () => {
        const input = {
          name: 'test-package',
          main: 'dist/index.js',
          bin: {}
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js',
          bin: {}
        });
      });

      it('should handle bin field with non-string values (edge case)', () => {
        const input = {
          name: 'test-package',
          main: 'dist/index.js',
          bin: {
            fec: 'dist/bin/fec.js',
            invalid: null as any,
            another: 'dist/bin/another.js'
          }
        };

        const result = transformPackageJsonForPublishing(input);

        expect(result).toEqual({
          name: 'test-package',
          main: './index.js',
          bin: {
            fec: './bin/fec.js',
            invalid: null,
            another: './bin/another.js'
          }
        });
      });
    });
  });

  describe('validatePackageJsonConfiguration', () => {
    describe('Dual build validation (hasEsmBuild = true)', () => {
      it('should pass for valid dual build configuration', () => {
        const validPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          module: 'dist/esm/index.js',
          types: 'dist/index.d.ts'
        };

        expect(() => validatePackageJsonConfiguration(validPackageJson, true)).not.toThrow();
      });

      it('should throw error if missing main field', () => {
        const invalidPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          module: 'dist/esm/index.js'
        };

        expect(() => validatePackageJsonConfiguration(invalidPackageJson, true))
          .toThrow(/No.*main.*field found.*CJS entry point/);
      });

      it('should throw error if missing module field', () => {
        const invalidPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js'
        };

        expect(() => validatePackageJsonConfiguration(invalidPackageJson, true))
          .toThrow(/ESM build requested.*no.*module.*field.*ESM entry point/);
      });

      it('should throw error if type is set to "module"', () => {
        const invalidPackageJson = {
          name: 'test-package',
          type: 'module',
          main: 'dist/index.js',
          module: 'dist/esm/index.js'
        };

        expect(() => validatePackageJsonConfiguration(invalidPackageJson, true))
          .toThrow(/Dual packages should not use.*type.*module.*commonjs/);
      });

      it('should pass if type is "commonjs"', () => {
        const validPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          module: 'dist/esm/index.js'
        };

        expect(() => validatePackageJsonConfiguration(validPackageJson, true)).not.toThrow();
      });

      it('should throw error if type field is undefined', () => {
        const invalidPackageJson = {
          name: 'test-package',
          main: 'dist/index.js',
          module: 'dist/esm/index.js'
        };

        expect(() => validatePackageJsonConfiguration(invalidPackageJson, true))
          .toThrow(/Missing required.*type.*field/);
      });
    });

    describe('CJS-only build validation (hasEsmBuild = false)', () => {
      it('should pass for valid CJS-only configuration', () => {
        const validPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          types: 'dist/index.d.ts'
        };

        expect(() => validatePackageJsonConfiguration(validPackageJson, false)).not.toThrow();
      });

      it('should throw error if missing main field', () => {
        const invalidPackageJson = {
          name: 'test-package',
          type: 'commonjs'
        };

        expect(() => validatePackageJsonConfiguration(invalidPackageJson, false))
          .toThrow(/No.*main.*field found.*entry point/);
      });

      it('should throw error if module field is present', () => {
        const invalidPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          module: 'dist/esm/index.js'
        };

        expect(() => validatePackageJsonConfiguration(invalidPackageJson, false))
          .toThrow(/module.*field found.*CJS-only package.*esmTsConfig/);
      });

      it('should pass with type "commonjs"', () => {
        const validPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js'
        };

        expect(() => validatePackageJsonConfiguration(validPackageJson, false)).not.toThrow();
      });
    });

    describe('CLI package validation', () => {
      it('should throw error if CLI package has type "module"', () => {
        const invalidPackageJson = {
          name: 'test-package',
          type: 'module',
          main: 'dist/index.js',
          bin: {
            fec: 'dist/bin/fec.js'
          }
        };

        expect(() => validatePackageJsonConfiguration(invalidPackageJson, false))
          .toThrow(/CLI packages should use.*type.*commonjs.*compatibility/);
      });

      it('should pass if CLI package has type "commonjs"', () => {
        const validPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          bin: {
            fec: 'dist/bin/fec.js'
          }
        };

        expect(() => validatePackageJsonConfiguration(validPackageJson, false)).not.toThrow();
      });

      it('should throw error if CLI package has no type field', () => {
        const invalidPackageJson = {
          name: 'test-package',
          main: 'dist/index.js',
          bin: {
            fec: 'dist/bin/fec.js'
          }
        };

        expect(() => validatePackageJsonConfiguration(invalidPackageJson, false))
          .toThrow(/Missing required.*type.*field/);
      });

      it('should handle string bin field', () => {
        const validPackageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          bin: 'dist/bin/cli.js'
        };

        expect(() => validatePackageJsonConfiguration(validPackageJson, false)).not.toThrow();
      });
    });

    describe('Type field validation', () => {
      it('should throw error for missing type field', () => {
        const packageJson = {
          name: 'test-package',
          main: 'dist/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, false))
          .toThrow(/Missing required.*type.*field/);
      });

      it('should throw error for invalid type field value', () => {
        const packageJson = {
          name: 'test-package',
          type: 'invalid',
          main: 'dist/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, false))
          .toThrow(/"type" field must be.*module.*commonjs/);
      });

      it('should throw error for numeric type field value', () => {
        const packageJson = {
          name: 'test-package',
          type: 123 as any,
          main: 'dist/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, false))
          .toThrow(/"type" field must be.*module.*commonjs/);
      });

      it('should pass for valid "commonjs" type', () => {
        const packageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, false)).not.toThrow();
      });

      it('should pass for valid "module" type (CJS-only build)', () => {
        const packageJson = {
          name: 'test-package',
          type: 'module',
          main: 'dist/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, false)).not.toThrow();
      });

      it('should work with dual builds when type is "commonjs"', () => {
        const packageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          module: 'dist/esm/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, true)).not.toThrow();
      });
    });

    describe('Browser field validation', () => {
      it('should throw error with migration guidance when browser field is used without main field', () => {
        const packageJson = {
          name: 'test-package',
          type: 'commonjs',
          browser: 'dist/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, false))
          .toThrow(/Found.*browser.*field.*without.*main.*field.*Options/);
      });

      it('should pass when browser field is used with main field', () => {
        const packageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          browser: 'dist/browser.js',
          module: 'dist/esm/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, true)).not.toThrow();
      });

      it('should pass when browser field is not present', () => {
        const packageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: 'dist/index.js',
          module: 'dist/esm/index.js'
        };

        expect(() => validatePackageJsonConfiguration(packageJson, true)).not.toThrow();
      });
    });

    describe('Edge cases', () => {
      it('should handle empty package.json', () => {
        expect(() => validatePackageJsonConfiguration({}, false))
          .toThrow(/Missing required.*type.*field/);
      });

      it('should handle package.json with null values', () => {
        const packageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: null,
          module: null
        };

        expect(() => validatePackageJsonConfiguration(packageJson, false))
          .toThrow(/No.*main.*field found/);
      });

      it('should handle package.json with empty string values', () => {
        const packageJson = {
          name: 'test-package',
          type: 'commonjs',
          main: '',
          module: ''
        };

        expect(() => validatePackageJsonConfiguration(packageJson, false))
          .toThrow(/No.*main.*field found/);
      });
    });
  });

  it('can run', async () => {
    expect(true).toBe(true);
  });
});
