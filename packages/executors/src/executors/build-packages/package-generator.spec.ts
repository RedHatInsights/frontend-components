import { generatePackageFile, hasValidJSFiles, RunOptions } from './package-generator';
import { glob } from 'glob';
import fse from 'fs-extra';

// Mock dependencies
jest.mock('glob');
jest.mock('fs-extra');

const mockGlob = glob as jest.Mocked<typeof glob>;
const mockFse = fse as jest.Mocked<typeof fse>;

describe('package-generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock common fs operations
    mockFse.writeJSON.mockImplementation(() => Promise.resolve());
    mockFse.copyFile.mockImplementation(() => Promise.resolve());
  });

  describe('generatePackageFile', () => {
    const mockOptions: RunOptions = {
      files: ['/path/to/src/Section'],
      root: '/path/to/src',
      outputRoot: '/path/to/dist',
      indexTypings: [],
    };

    it('should generate package.json for component with valid JS files', async () => {
      // Mock glob to return valid JS files
      mockGlob.sync
        .mockReturnValueOnce(['/path/to/dist/Section/index.js']) // CJS
        .mockReturnValueOnce(['/path/to/dist/esm/Section/index.js']) // ESM
        .mockReturnValueOnce(['/path/to/src/Section/index.d.ts']) // TypeScript files
        .mockReturnValueOnce(['/path/to/src/Section/index.d.ts']); // hasIndex check

      const result = await generatePackageFile('/path/to/src/Section', mockOptions);

      expect(result).toEqual({
        file: '/path/to/src/Section',
        componentName: 'Section',
        packageJsonPath: '/path/to/dist/Section/package.json',
        hasValidJS: true,
      });

      expect(mockFse.writeJSON).toHaveBeenCalledWith(
        '/path/to/dist/Section/package.json',
        {
          main: 'index.js',
          module: '../esm/Section/index.js',
          typings: 'index.d.ts',
        }
      );
    });

    it('should return null for component without JS files', async () => {
      // Mock glob to return no ESM files
      mockGlob.sync
        .mockReturnValueOnce([]) // CJS
        .mockReturnValueOnce([]); // ESM

      const result = await generatePackageFile('/path/to/src/CSSOnly', mockOptions);

      expect(result).toBeNull();
      expect(mockFse.writeJSON).not.toHaveBeenCalled();
    });

    it('should handle component without TypeScript files', async () => {
      mockGlob.sync
        .mockReturnValueOnce(['/path/to/dist/Section/index.js'])
        .mockReturnValueOnce(['/path/to/dist/esm/Section/index.js'])
        .mockReturnValueOnce([]); // No TypeScript files

      const result = await generatePackageFile('/path/to/src/Section', mockOptions);

      expect(result).toEqual({
        file: '/path/to/src/Section',
        componentName: 'Section',
        packageJsonPath: '/path/to/dist/Section/package.json',
        hasValidJS: true,
      });

      expect(mockFse.writeJSON).toHaveBeenCalledWith(
        '/path/to/dist/Section/package.json',
        {
          main: 'index.js',
          module: '../esm/Section/index.js',
          // No typings field when no TypeScript files
        }
      );
    });

    it('should force types when forceTypes option is true', async () => {
      const optionsWithForceTypes = { ...mockOptions, forceTypes: true };

      mockGlob.sync
        .mockReturnValueOnce(['/path/to/dist/Section/index.js'])
        .mockReturnValueOnce(['/path/to/dist/esm/Section/index.js'])
        .mockReturnValueOnce([]); // No TypeScript files

      mockFse.writeJSON.mockResolvedValue();

      await generatePackageFile('/path/to/src/Section', optionsWithForceTypes);

      expect(mockFse.writeJSON).toHaveBeenCalledWith(
        '/path/to/dist/Section/package.json',
        {
          main: 'index.js',
          module: '../esm/Section/index.js',
          typings: 'index.d.ts', // Forced even without TypeScript files
        }
      );
    });

    it('should throw error for invalid file path', async () => {
      await expect(generatePackageFile('', mockOptions)).rejects.toThrow('Invalid file path');
    });
  });

  describe('hasValidJSFiles', () => {
    it('should return true when ESM files exist', () => {
      mockGlob.sync.mockReturnValue(['/path/to/dist/esm/Section/index.js']);

      const result = hasValidJSFiles('/path/to/src/Section', '/path/to/dist');

      expect(result).toBe(true);
      expect(mockGlob.sync).toHaveBeenCalledWith('/path/to/dist/esm/Section/**/index.js');
    });

    it('should return false when no ESM files exist', () => {
      mockGlob.sync.mockReturnValue([]);

      const result = hasValidJSFiles('/path/to/src/Section', '/path/to/dist');

      expect(result).toBe(false);
    });

    it('should return false for invalid file path', () => {
      const result = hasValidJSFiles('', '/path/to/dist');

      expect(result).toBe(false);
    });
  });
});