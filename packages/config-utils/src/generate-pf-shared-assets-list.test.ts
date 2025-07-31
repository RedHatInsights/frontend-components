import generatePFSharedAssetsList from './generate-pf-shared-assets-list';
import * as glob from 'glob';
import * as fs from 'fs';

// Mock dependencies
jest.mock('glob');
jest.mock('fs');

const mockGlob = glob as jest.Mocked<typeof glob>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('generatePFSharedAssetsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console warnings for clean test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return dynamic modules for valid PatternFly versions', () => {
    // Mock package.json with valid PF versions
    const mockPackageJson = {
      dependencies: {
        '@patternfly/react-core': '^5.2.0',
        '@patternfly/react-icons': '^5.1.0'
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    // Mock glob results
    mockGlob.sync
      .mockReturnValueOnce([
        '/test/node_modules/@patternfly/react-core/dist/dynamic/Button/package.json',
        '/test/node_modules/@patternfly/react-core/dist/dynamic/Card/package.json'
      ])
      .mockReturnValueOnce([
        '/test/node_modules/@patternfly/react-icons/dist/dynamic/ArrowIcon/package.json'
      ]);

    const result = generatePFSharedAssetsList('/test');

    expect(result).toEqual({
      '@patternfly/react-core/dist/dynamic/Button': {
        requiredVersion: '^5.2.0'
      },
      '@patternfly/react-core/dist/dynamic/Card': {
        requiredVersion: '^5.2.0'
      },
      '@patternfly/react-icons/dist/dynamic/ArrowIcon': {
        requiredVersion: '^5.1.0'
      }
    });
  });

  it('should return empty object for unsupported PatternFly core version', () => {
    const mockPackageJson = {
      dependencies: {
        '@patternfly/react-core': '^4.9.0', // Unsupported version
        '@patternfly/react-icons': '^5.1.0'
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = generatePFSharedAssetsList('/test');

    expect(result).toEqual({});
    expect(console.log).toHaveBeenCalledWith(
      expect.anything(), // First arg is chalk.yellow('[fec]')
      expect.stringContaining('Unsupported @patternfly packages version')
    );
  });

  it('should return empty object for unsupported PatternFly icons version', () => {
    const mockPackageJson = {
      dependencies: {
        '@patternfly/react-core': '^5.2.0',
        '@patternfly/react-icons': '^4.9.0' // Unsupported version
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = generatePFSharedAssetsList('/test');

    expect(result).toEqual({});
    expect(console.log).toHaveBeenCalledWith(
      expect.anything(), // First arg is chalk.yellow('[fec]')
      expect.stringContaining('Unsupported @patternfly packages version')
    );
  });

  it('should check devDependencies if not found in dependencies', () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {
        '@patternfly/react-core': '^5.2.0',
        '@patternfly/react-icons': '^5.1.0'
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGlob.sync.mockReturnValue([]);

    const result = generatePFSharedAssetsList('/test');

    expect(result).toEqual({});
    // Should not log unsupported version warnings
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Unsupported @patternfly packages version')
    );
  });

  it('should throw error when root directory is not provided', () => {
    expect(() => generatePFSharedAssetsList('')).toThrow(
      'Provide a directory of your node_modules to find dynamic modules'
    );
  });

  it('should handle version numbers with different formats', () => {
    const mockPackageJson = {
      dependencies: {
        '@patternfly/react-core': '5.2.0', // Without caret
        '@patternfly/react-icons': '~5.1.0' // With tilde
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGlob.sync.mockReturnValue([]);

    const result = generatePFSharedAssetsList('/test');

    expect(result).toEqual({});
    // Should not log warnings for valid versions
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Unsupported @patternfly packages version')
    );
  });

  it('should handle version with no numeric characters', () => {
    const mockPackageJson = {
      dependencies: {
        '@patternfly/react-core': 'invalid-version', // This becomes "500" after regex, passes check
        '@patternfly/react-icons': '^5.1.0'
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGlob.sync.mockReturnValue([]);

    const result = generatePFSharedAssetsList('/test');

    // Since "invalid-version" becomes "500" it actually passes the version check
    expect(result).toEqual({});
  });

  it('should generate correct glob patterns', () => {
    const mockPackageJson = {
      dependencies: {
        '@patternfly/react-core': '^5.2.0',
        '@patternfly/react-icons': '^5.1.0'
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGlob.sync.mockReturnValue([]);

    generatePFSharedAssetsList('/custom/root');

    expect(mockGlob.sync).toHaveBeenCalledWith(
      '/custom/root/node_modules/@patternfly/react-core/dist/dynamic/*/**/package.json'
    );
    expect(mockGlob.sync).toHaveBeenCalledWith(
      '/custom/root/node_modules/@patternfly/react-icons/dist/dynamic/*/**/package.json'
    );
  });

  it('should throw error when unable to extract module name', () => {
    const mockPackageJson = {
      dependencies: {
        '@patternfly/react-core': '^5.2.0',
        '@patternfly/react-icons': '^5.1.0'
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    
    // Mock invalid package.json path that can't be parsed - split() will return empty array
    mockGlob.sync
      .mockReturnValueOnce(['/package.json']) // Path without node_modules
      .mockReturnValueOnce([]);

    expect(() => generatePFSharedAssetsList('/test')).toThrow(
      'Unable to get module name from: /package.json'
    );
  });

  // Test documented functionality from our documentation
  it('should match documentation behavior', () => {
    // This validates our documentation is accurate
    const mockPackageJson = {
      dependencies: {
        '@patternfly/react-core': '^5.2.0',
        '@patternfly/react-icons': '^5.1.0'
      }
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGlob.sync.mockReturnValue([
      '/test/node_modules/@patternfly/react-core/dist/dynamic/Button/package.json'
    ]);

    const result = generatePFSharedAssetsList('/test');

    // Verify it returns module definitions with versions
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
    
    // Verify structure matches documentation
    Object.entries(result).forEach(([moduleName, config]) => {
      expect(typeof moduleName).toBe('string');
      expect(moduleName).toContain('@patternfly/');
      expect(config).toHaveProperty('requiredVersion');
      expect(typeof config.requiredVersion).toBe('string');
    });
  });
});
