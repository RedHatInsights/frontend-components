import searchIgnoredStyles from './search-ignored-styles';
import * as glob from 'glob';
import path from 'path';

// Mock glob to control file system behavior
jest.mock('glob');
const mockGlob = glob as jest.Mocked<typeof glob>;

describe('searchIgnoredStyles', () => {
  // Declare mock variables outside beforeEach for shared access
  let mockConsoleLog: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks to ensure test isolation
    jest.clearAllMocks();
    
    // Initialize/reset mock objects and dependencies
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return webpack alias object for found CSS files', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    mockGlob.sync.mockReturnValue([
      '/test/node_modules/@patternfly/react-styles/css/components/Button/button.css',
      '/test/node_modules/@patternfly/react-styles/css/utilities/Spacing/spacing.css'
    ]);

    // Act - Execute the function under test
    const result = searchIgnoredStyles('/test');

    // Assert - Verify behavior
    expect(result).toEqual({
      '/test/node_modules/@patternfly/react-styles/css/components/Button/button.css': false,
      '/test/node_modules/@patternfly/react-styles/css/utilities/Spacing/spacing.css': false
    });
  });

  it('should search in default and additional paths', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    mockGlob.sync.mockReturnValue([]);

    // Act - Execute the function under test
    searchIgnoredStyles('/test', '/additional/path1', '/additional/path2');

    // Assert - Verify behavior
    // Verify glob.sync was called for default and additional paths
    expect(mockGlob.sync).toHaveBeenCalledTimes(3);
    expect(mockGlob.sync).toHaveBeenCalledWith('/test/node_modules/@patternfly/react-styles/**/*.css');
    expect(mockGlob.sync).toHaveBeenCalledWith('/additional/path1/@patternfly/react-styles/**/*.css');
    expect(mockGlob.sync).toHaveBeenCalledWith('/additional/path2/@patternfly/react-styles/**/*.css');
  });

  it('should return empty object when no CSS files found', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    mockGlob.sync.mockReturnValue([]);

    // Act - Execute the function under test
    const result = searchIgnoredStyles('/test');

    // Assert - Verify behavior
    expect(result).toEqual({});
  });

  it('should log warning when no CSS files found', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    mockGlob.sync.mockReturnValue([]);

    // Act - Execute the function under test
    searchIgnoredStyles('/test');

    // Assert - Verify behavior
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('No PF CSS assets found!')
    );
  });

  it('should handle multiple CSS files from different paths', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    mockGlob.sync
      .mockReturnValueOnce(['/test/node_modules/@patternfly/react-styles/css/button.css'])
      .mockReturnValueOnce(['/path1/@patternfly/react-styles/css/form.css'])
      .mockReturnValueOnce(['/path2/@patternfly/react-styles/css/table.css']);

    // Act - Execute the function under test
    const result = searchIgnoredStyles('/test', '/path1', '/path2');

    // Assert - Verify behavior
    expect(result).toEqual({
      '/test/node_modules/@patternfly/react-styles/css/button.css': false,
      '/path1/@patternfly/react-styles/css/form.css': false,
      '/path2/@patternfly/react-styles/css/table.css': false
    });
  });

  it('should handle empty additional paths array', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    mockGlob.sync.mockReturnValue([]);

    // Act - Execute the function under test
    const result = searchIgnoredStyles('/test');

    // Assert - Verify behavior
    expect(mockGlob.sync).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  it('should create correct glob patterns', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    mockGlob.sync.mockReturnValue([]);

    // Act - Execute the function under test
    searchIgnoredStyles('/root', '/custom/modules', '/another/modules');

    // Assert - Verify behavior
    // Verify the exact glob patterns generated
    expect(mockGlob.sync).toHaveBeenCalledWith('/root/node_modules/@patternfly/react-styles/**/*.css');
    expect(mockGlob.sync).toHaveBeenCalledWith('/custom/modules/@patternfly/react-styles/**/*.css');
    expect(mockGlob.sync).toHaveBeenCalledWith('/another/modules/@patternfly/react-styles/**/*.css');
  });

  // Test documented functionality from our documentation
  it('should match documentation behavior', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    // This validates our documentation is accurate
    mockGlob.sync.mockReturnValue([
      '/test/node_modules/@patternfly/react-styles/css/components/Button/button.css'
    ]);

    // Act - Execute the function under test
    const result = searchIgnoredStyles('/test');

    // Assert - Verify behavior
    // Verify it returns a webpack alias object
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
    
    // Verify CSS files are mapped to false (ignored)
    Object.values(result).forEach(value => {
      expect(value).toBe(false);
    });

    // Verify paths contain PatternFly styles
    Object.keys(result).forEach(key => {
      expect(key).toContain('@patternfly/react-styles');
      expect(key).toContain('.css');
    });
  });
});
