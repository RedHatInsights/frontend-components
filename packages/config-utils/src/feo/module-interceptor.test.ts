import jsVarName from '../jsVarName';
import { ChromeModule, ChromeModuleRegistry, FrontendCRD } from './feo-types';
import moduleInterceptor from './module-interceptor';

describe('module-interceptor', () => {
  // Declare mock variables outside beforeEach for shared access
  let moduleName: string;
  let newEntry: ChromeModule;
  let frontendCRD: FrontendCRD;
  let remoteModuleRegistry: ChromeModuleRegistry;

  beforeEach(() => {
    // Clear all mocks to ensure test isolation
    jest.clearAllMocks();
    
    // Initialize/reset test data with default values
    moduleName = 'module-name';
    newEntry = {
      manifestLocation: 'new-location',
      cdnPath: '/',
    };
    frontendCRD = {
      objects: [
        {
          metadata: {
            name: moduleName,
          },
          spec: {
            frontend: {
              paths: ['/'],
            },
            module: newEntry,
          },
        },
      ],
    };
    remoteModuleRegistry = {};
  });

  it('should replace existing entry in moduleRegistry with new entry', () => {
    // Arrange - Setup test data (mock objects already configured in beforeEach)
    remoteModuleRegistry = {
      [jsVarName(moduleName)]: {
        manifestLocation: 'old-location',
      },
    };
    const expectedResult: ChromeModuleRegistry = {
      [jsVarName(moduleName)]: newEntry,
    };

    // Act - Execute the function under test
    const result = moduleInterceptor(remoteModuleRegistry, frontendCRD);

    // Assert - Verify behavior
    expect(result).toEqual(expectedResult);
  });

  it('should add new entry to moduleRegistry', () => {
    // Arrange - Setup test data (mock objects already configured in beforeEach)
    const expectedResult: ChromeModuleRegistry = {
      [jsVarName(moduleName)]: newEntry,
    };

    // Act - Execute the function under test
    const result = moduleInterceptor(remoteModuleRegistry, frontendCRD);

    // Assert - Verify behavior
    expect(result).toEqual(expectedResult);
  });
});
