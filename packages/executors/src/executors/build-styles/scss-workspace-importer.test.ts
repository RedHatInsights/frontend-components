import { createScssWorkspaceImporter, createScssImporter } from './scss-workspace-importer';
import fs from 'fs';
import path from 'path';

// Mock fs module to control file system behavior
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock path module for controlled path operations
jest.mock('path');
const mockPath = path as jest.Mocked<typeof path>;

describe('createScssWorkspaceImporter', () => {
  // Declare mock variables outside beforeEach for shared access
  let mockFsExists: jest.MockedFunction<typeof fs.existsSync>;
  let mockFsLstat: jest.MockedFunction<typeof fs.lstatSync>;

  beforeEach(() => {
    // Clear all mocks to ensure test isolation
    jest.clearAllMocks();

    // Initialize/reset mock objects and dependencies
    mockFsExists = mockFs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    mockFsLstat = mockFs.lstatSync as jest.MockedFunction<typeof fs.lstatSync>;

    // Setup default path mocking behavior
    mockPath.join.mockImplementation((...args: string[]) => args.join('/'));
    mockPath.dirname.mockImplementation((p: string) => {
      const parts = p.split('/');
      if (parts.length === 1 && parts[0] === '/') return '/';
      return parts.slice(0, -1).join('/') || '/';
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('URL parsing and validation', () => {
    it('should return null for non-@redhat-cloud-services URLs', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/test/path');

      // Act - Execute the function under test
      const result = importer.findFileUrl('~some-other-package/styles/file');

      // Assert - Verify behavior
      expect(result).toBeNull();
      expect(mockFsLstat).not.toHaveBeenCalled();
      expect(mockFsExists).not.toHaveBeenCalled();
    });

    it('should return null for URLs without tilde prefix', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/test/path');

      // Act - Execute the function under test
      const result = importer.findFileUrl('@redhat-cloud-services/frontend-components/styles/file');

      // Assert - Verify behavior
      expect(result).toBeNull();
      expect(mockFsLstat).not.toHaveBeenCalled();
      expect(mockFsExists).not.toHaveBeenCalled();
    });

    it('should return null for malformed @redhat-cloud-services URLs', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/test/path');

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/');

      // Assert - Verify behavior
      expect(result).toBeNull();
    });

    it('should parse valid @redhat-cloud-services URLs correctly', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/test/path');
      mockFsLstat.mockImplementation(() => {
        throw new Error('Not found');
      });
      mockFsExists.mockReturnValue(false);

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      // Should attempt to check for workspace symlinks
      expect(mockFsLstat).toHaveBeenCalledWith(
        '/test/path/node_modules/@redhat-cloud-services/frontend-components-utilities',
        { throwIfNoEntry: false }
      );
      expect(result).toBeNull(); // Should gracefully fail
    });
  });

  describe('workspace symlink resolution strategy', () => {
    it('should resolve workspace symlinks with /dist path appending', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/workspace/root');

      // Mock symlink detection
      const mockSymlinkStat = {
        isSymbolicLink: jest.fn().mockReturnValue(true)
      };
      mockFsLstat.mockReturnValue(mockSymlinkStat as any);

      // Mock file existence
      mockFsExists.mockImplementation((filePath) => {
        return String(filePath) === '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss';
      });

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      expect(mockFsLstat).toHaveBeenCalledWith(
        '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities',
        { throwIfNoEntry: false }
      );
      expect(mockSymlinkStat.isSymbolicLink).toHaveBeenCalled();
      expect(mockFsExists).toHaveBeenCalledWith(
        '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss'
      );
      expect(result).toEqual(
        new URL('file:///workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss')
      );
    });

    it('should try adding .scss extension for workspace symlinks', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/workspace/root');

      // Mock symlink detection
      const mockSymlinkStat = {
        isSymbolicLink: jest.fn().mockReturnValue(true)
      };
      mockFsLstat.mockReturnValue(mockSymlinkStat as any);

      // Mock file existence - first call fails, second succeeds with .scss
      mockFsExists.mockImplementation((filePath) => {
        return String(filePath) === '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss';
      });

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      expect(mockFsExists).toHaveBeenCalledWith(
        '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss'
      );
      expect(result).toEqual(
        new URL('file:///workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss')
      );
    });

    it('should walk up directories to find workspace root', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/deep/nested/path');

      // Mock directory walking
      mockPath.dirname.mockImplementation((p: string) => {
        if (p === '/deep/nested/path') return '/deep/nested';
        if (p === '/deep/nested') return '/deep';
        if (p === '/deep') return '/';
        return '/';
      });

      // Mock symlink detection - only found at /deep level
      mockFsLstat.mockImplementation((filePath) => {
        if (String(filePath) === '/deep/node_modules/@redhat-cloud-services/frontend-components-utilities') {
          return { isSymbolicLink: () => true } as any;
        }
        throw new Error('Not found');
      });

      mockFsExists.mockImplementation((filePath) => {
        return String(filePath) === '/deep/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss';
      });

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      expect(mockFsLstat).toHaveBeenCalledWith(
        '/deep/nested/path/node_modules/@redhat-cloud-services/frontend-components-utilities',
        { throwIfNoEntry: false }
      );
      expect(mockFsLstat).toHaveBeenCalledWith(
        '/deep/nested/node_modules/@redhat-cloud-services/frontend-components-utilities',
        { throwIfNoEntry: false }
      );
      expect(mockFsLstat).toHaveBeenCalledWith(
        '/deep/node_modules/@redhat-cloud-services/frontend-components-utilities',
        { throwIfNoEntry: false }
      );
      expect(result).toEqual(
        new URL('file:///deep/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss')
      );
    });

    it('should handle lstat errors gracefully during workspace detection', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/workspace/root');

      // Mock lstat to throw errors
      mockFsLstat.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      // Mock published package resolution
      mockFsExists.mockImplementation((filePath) => {
        return String(filePath) === '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss';
      });

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      // Should fall back to published package resolution
      expect(mockFsExists).toHaveBeenCalledWith(
        '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss'
      );
      expect(result).toEqual(
        new URL('file:///workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss')
      );
    });
  });

  describe('published package resolution strategy', () => {
    it('should resolve published packages without /dist path', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/app/root');

      // Mock no symlink (published package)
      const mockRegularStat = {
        isSymbolicLink: jest.fn().mockReturnValue(false)
      };
      mockFsLstat.mockReturnValue(mockRegularStat as any);

      // Mock published package file existence
      mockFsExists.mockImplementation((filePath) => {
        return String(filePath) === '/app/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss';
      });

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      expect(mockFsExists).toHaveBeenCalledWith(
        '/app/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss'
      );
      expect(result).toEqual(
        new URL('file:///app/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss')
      );
    });

    it('should try adding .scss extension for published packages', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/app/root');

      // Mock no symlink
      const mockRegularStat = {
        isSymbolicLink: jest.fn().mockReturnValue(false)
      };
      mockFsLstat.mockReturnValue(mockRegularStat as any);

      // Mock file existence - file found with .scss extension
      mockFsExists.mockImplementation((filePath) => {
        return String(filePath) === '/app/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss';
      });

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      expect(mockFsExists).toHaveBeenCalledWith(
        '/app/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss'
      );
      expect(result).toEqual(
        new URL('file:///app/root/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss')
      );
    });

    it('should walk up directories for published package resolution', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/deep/nested/app');

      // Mock directory walking
      mockPath.dirname.mockImplementation((p: string) => {
        if (p === '/deep/nested/app') return '/deep/nested';
        if (p === '/deep/nested') return '/deep';
        if (p === '/deep') return '/';
        return '/';
      });

      // Mock no symlinks found during workspace resolution
      mockFsLstat.mockImplementation(() => {
        throw new Error('Not found');
      });

      // Mock published package found at /deep level
      mockFsExists.mockImplementation((filePath) => {
        return String(filePath) === '/deep/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss';
      });

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      expect(mockFsExists).toHaveBeenCalledWith(
        '/deep/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss'
      );
      expect(result).toEqual(
        new URL('file:///deep/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss')
      );
    });
  });

  describe('graceful failure scenarios', () => {
    it('should return null when no resolution strategy succeeds', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/test/path');

      // Mock all resolution attempts to fail
      mockFsLstat.mockImplementation(() => {
        throw new Error('Not found');
      });
      mockFsExists.mockReturnValue(false);

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/non-existent-package/styles/file');

      // Assert - Verify behavior
      expect(result).toBeNull();
      expect(mockFsLstat).toHaveBeenCalled();
      expect(mockFsExists).toHaveBeenCalled();
    });

    it('should return null when reaching filesystem root without finding files', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/');

      // Mock filesystem operations to fail
      mockFsLstat.mockImplementation(() => {
        throw new Error('Not found');
      });
      mockFsExists.mockReturnValue(false);

      // Act - Execute the function under test
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

      // Assert - Verify behavior
      expect(result).toBeNull();
    });

    it('should handle file paths with existing .scss extension correctly', () => {
      // Arrange - Setup test data
      const importer = createScssWorkspaceImporter('/workspace/root');

      // Mock symlink detection
      const mockSymlinkStat = {
        isSymbolicLink: jest.fn().mockReturnValue(true)
      };
      mockFsLstat.mockReturnValue(mockSymlinkStat as any);

      // Mock file existence
      mockFsExists.mockImplementation((filePath) => {
        return String(filePath) === '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss';
      });

      // Act - Execute the function under test (URL already has .scss extension)
      const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss');

      // Assert - Verify behavior
      expect(mockFsExists).toHaveBeenCalledWith(
        '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss'
      );
      expect(result).toEqual(
        new URL('file:///workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss')
      );
    });
  });

  describe('complex path scenarios', () => {
    const testCases = [
      {
        input: '~@redhat-cloud-services/frontend-components-utilities/styles/_mixins',
        packageName: 'frontend-components-utilities',
        filePath: 'styles/_mixins',
        description: 'should parse standard utilities package path'
      },
      {
        input: '~@redhat-cloud-services/frontend-components/ConditionalFilter/conditional-filter',
        packageName: 'frontend-components',
        filePath: 'ConditionalFilter/conditional-filter',
        description: 'should parse component-specific path'
      },
      {
        input: '~@redhat-cloud-services/frontend-components-utilities/styles/base/_variables.scss',
        packageName: 'frontend-components-utilities',
        filePath: 'styles/base/_variables.scss',
        description: 'should handle nested paths with .scss extension'
      }
    ];

    testCases.forEach(({ input, packageName, filePath, description }) => {
      it(`${description}: "${input}"`, () => {
        // Arrange - Setup test data
        const importer = createScssWorkspaceImporter('/test/root');

        // Mock symlink detection
        const mockSymlinkStat = {
          isSymbolicLink: jest.fn().mockReturnValue(true)
        };
        mockFsLstat.mockReturnValue(mockSymlinkStat as any);

        // Mock file existence
        const expectedPath = `/test/root/node_modules/@redhat-cloud-services/${packageName}/dist/${filePath}${filePath.endsWith('.scss') ? '' : '.scss'}`;
        mockFsExists.mockImplementation((testPath) => String(testPath) === expectedPath);

        // Act - Execute the function under test
        const result = importer.findFileUrl(input);

        // Assert - Verify behavior
        expect(mockFsLstat).toHaveBeenCalledWith(
          `/test/root/node_modules/@redhat-cloud-services/${packageName}`,
          { throwIfNoEntry: false }
        );
        expect(result).toEqual(new URL(`file://${expectedPath}`));
      });
    });
  });
});

describe('createScssImporter (legacy function)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be a wrapper around createScssWorkspaceImporter', () => {
    // Arrange - Setup test data
    const projectRoot = '/legacy/project/root';
    const currentProjectRoot = '/legacy/current/root';

    // Mock fs operations
    mockFs.existsSync.mockReturnValue(false);
    mockFs.lstatSync.mockImplementation(() => {
      throw new Error('Not found');
    });

    // Act - Execute the function under test
    const legacyImporter = createScssImporter(projectRoot, currentProjectRoot);
    const modernImporter = createScssWorkspaceImporter(projectRoot);

    // Assert - Verify behavior
    // Both should return null for non-@redhat-cloud-services URLs
    expect(legacyImporter.findFileUrl('~other-package/file')).toBeNull();
    expect(modernImporter.findFileUrl('~other-package/file')).toBeNull();

    // Both should attempt resolution for @redhat-cloud-services URLs
    expect(legacyImporter.findFileUrl('~@redhat-cloud-services/test-package/file')).toBeNull();
    expect(modernImporter.findFileUrl('~@redhat-cloud-services/test-package/file')).toBeNull();
  });

  it('should maintain backward compatibility with existing usage', () => {
    // Arrange - Setup test data
    const projectRoot = '/legacy/root';
    const currentProjectRoot = '/legacy/current';

    // Mock symlink detection
    const mockSymlinkStat = {
      isSymbolicLink: jest.fn().mockReturnValue(true)
    };
    mockFs.lstatSync.mockReturnValue(mockSymlinkStat as any);
    mockFs.existsSync.mockImplementation((filePath) => {
      return filePath === '/legacy/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss';
    });

    // Act - Execute the function under test
    const importer = createScssImporter(projectRoot, currentProjectRoot);
    const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

    // Assert - Verify behavior
    expect(result).toEqual(
      new URL('file:///legacy/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss')
    );
  });
});

describe('integration and documentation validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match documentation examples for workspace resolution', () => {
    // Arrange - Setup test data
    // This validates our documentation is accurate
    const importer = createScssWorkspaceImporter('/workspace/frontend-components');

    // Mock workspace symlink scenario
    const mockSymlinkStat = {
      isSymbolicLink: jest.fn().mockReturnValue(true)
    };
    mockFs.lstatSync.mockReturnValue(mockSymlinkStat as any);
    mockFs.existsSync.mockImplementation((filePath) => {
      return filePath === '/workspace/frontend-components/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss';
    });

    // Act - Execute the function under test
    const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

    // Assert - Verify behavior
    expect(result).not.toBeNull();
    expect(result!.protocol).toBe('file:');
    expect(result!.pathname).toContain('frontend-components-utilities/dist/styles/_mixins.scss');
  });

  it('should match documentation examples for published package resolution', () => {
    // Arrange - Setup test data
    const importer = createScssWorkspaceImporter('/third-party-app');

    // Mock published package scenario (no symlinks)
    mockFs.lstatSync.mockImplementation(() => {
      throw new Error('Not found');
    });
    mockFs.existsSync.mockImplementation((filePath) => {
      return filePath === '/third-party-app/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss';
    });

    // Act - Execute the function under test
    const result = importer.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

    // Assert - Verify behavior
    expect(result).not.toBeNull();
    expect(result!.protocol).toBe('file:');
    expect(result!.pathname).toContain('frontend-components-utilities/styles/_mixins.scss');
    expect(result!.pathname).not.toContain('/dist/'); // Published packages don't have /dist
  });

  it('should demonstrate universal compatibility across contexts', () => {
    // Arrange - Setup test data for different contexts
    const workspaceImporter = createScssWorkspaceImporter('/workspace/root');
    const thirdPartyImporter = createScssWorkspaceImporter('/third-party/app');
    const standaloneImporter = createScssWorkspaceImporter('/standalone/app');

    // Mock different scenarios
    mockFs.lstatSync
      .mockImplementationOnce(() => ({ isSymbolicLink: () => true } as any)) // Workspace
      .mockImplementationOnce(() => { throw new Error('Not found'); }) // Third-party (no symlinks)
      .mockImplementationOnce(() => { throw new Error('Not found'); }); // Standalone (no symlinks)

    mockFs.existsSync.mockImplementation((filePath) => {
      if (filePath === '/workspace/root/node_modules/@redhat-cloud-services/frontend-components-utilities/dist/styles/_mixins.scss') {
        return true; // Workspace with /dist
      }
      if (filePath === '/third-party/app/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss') {
        return true; // Published package without /dist
      }
      if (filePath === '/standalone/app/node_modules/@redhat-cloud-services/frontend-components-utilities/styles/_mixins.scss') {
        return true; // Published package without /dist
      }
      return false;
    });

    // Act - Execute the function under test
    const workspaceResult = workspaceImporter.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');
    const thirdPartyResult = thirdPartyImporter.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');
    const standaloneResult = standaloneImporter.findFileUrl('~@redhat-cloud-services/frontend-components-utilities/styles/_mixins');

    // Assert - Verify behavior
    // All should resolve successfully but to different paths
    expect(workspaceResult).not.toBeNull();
    expect(thirdPartyResult).not.toBeNull();
    expect(standaloneResult).not.toBeNull();

    expect(workspaceResult!.pathname).toContain('/dist/');
    expect(thirdPartyResult!.pathname).not.toContain('/dist/');
    expect(standaloneResult!.pathname).not.toContain('/dist/');
  });
});