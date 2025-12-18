import { generateExportsField } from './exports-generator';
import { ComponentInfo } from './package-generator';
import fse from 'fs-extra';

// Mock fs-extra
jest.mock('fs-extra');
const mockFse = fse as jest.Mocked<typeof fse>;

describe('exports-generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateExportsField', () => {
    it('should generate exports field with main entry point and component exports', async () => {
      const componentInfos: ComponentInfo[] = [
        {
          file: '/path/to/src/Section',
          componentName: 'Section',
          packageJsonPath: '/path/to/dist/Section/package.json',
          hasValidJS: true,
        },
        {
          file: '/path/to/src/Ansible',
          componentName: 'Ansible',
          packageJsonPath: '/path/to/dist/Ansible/package.json',
          hasValidJS: true,
        },
      ];

      const mockPackageJson = { name: 'test-package', version: '1.0.0' };
      mockFse.readJson.mockResolvedValue(mockPackageJson);

      await generateExportsField(componentInfos, '/path/to/package.json');

      expect(mockFse.readJson).toHaveBeenCalledWith('/path/to/package.json');
      expect(mockFse.writeJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        {
          ...mockPackageJson,
          exports: {
            ".": {
              "types": "./dist/index.d.ts",
              "import": "./dist/esm/index.js",
              "require": "./dist/index.js"
            },
            "./Section": {
              "types": "./dist/Section/index.d.ts",
              "import": "./dist/esm/Section/index.js",
              "require": "./dist/Section/index.js"
            },
            "./Ansible": {
              "types": "./dist/Ansible/index.d.ts",
              "import": "./dist/esm/Ansible/index.js",
              "require": "./dist/Ansible/index.js"
            },
            "./dist/*": "./dist/*",
            "./package.json": "./package.json"
          }
        },
        { spaces: 2 }
      );
    });

    it('should skip components without valid JS files', async () => {
      const componentInfos: ComponentInfo[] = [
        {
          file: '/path/to/src/Section',
          componentName: 'Section',
          packageJsonPath: '/path/to/dist/Section/package.json',
          hasValidJS: true,
        },
        {
          file: '/path/to/src/InvalidComponent',
          componentName: 'InvalidComponent',
          packageJsonPath: '/path/to/dist/InvalidComponent/package.json',
          hasValidJS: false,
        },
      ];

      const mockPackageJson = { name: 'test-package' };
      mockFse.readJson.mockResolvedValue(mockPackageJson);

      await generateExportsField(componentInfos, '/path/to/package.json');

      const expectedExports = {
        ".": {
          "types": "./dist/index.d.ts",
          "import": "./dist/esm/index.js",
          "require": "./dist/index.js"
        },
        "./Section": {
          "types": "./dist/Section/index.d.ts",
          "import": "./dist/esm/Section/index.js",
          "require": "./dist/Section/index.js"
        },
        "./dist/*": "./dist/*",
        "./package.json": "./package.json"
      };

      expect(mockFse.writeJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        { ...mockPackageJson, exports: expectedExports },
        { spaces: 2 }
      );

      // Should not include InvalidComponent
      const writtenExports = (mockFse.writeJson as jest.Mock).mock.calls[0][1].exports;
      expect(writtenExports).not.toHaveProperty('./InvalidComponent');
    });

    it('should handle empty component list', async () => {
      const mockPackageJson = { name: 'test-package' };
      mockFse.readJson.mockResolvedValue(mockPackageJson);

      await generateExportsField([], '/path/to/package.json');

      const expectedExports = {
        ".": {
          "types": "./dist/index.d.ts",
          "import": "./dist/esm/index.js",
          "require": "./dist/index.js"
        },
        "./dist/*": "./dist/*",
        "./package.json": "./package.json"
      };

      expect(mockFse.writeJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        { ...mockPackageJson, exports: expectedExports },
        { spaces: 2 }
      );
    });
  });
});