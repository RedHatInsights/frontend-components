import { FrontendCRD } from './feo-types';
import widgetRegistryInterceptor from './widget-registry-interceptor';

describe('Widget registry interceptor', () => {
  // Declare mock variables outside beforeEach for shared access
  let frontendName: string;
  let widgetEntries: any[];
  let frontendCrd: FrontendCRD;

  beforeEach(() => {
    // Clear all mocks to ensure test isolation
    jest.clearAllMocks();
    
    // Initialize/reset test data with default values
    frontendName = 'name';
    widgetEntries = [
      { module: 'module1', scope: 'scope1', frontendRef: frontendName },
      { module: 'module1', scope: 'scope2', frontendRef: frontendName },
      { module: 'module2', scope: 'scope1', frontendRef: 'foo' },
    ];
    frontendCrd = {
      objects: [
        {
          metadata: {
            name: 'name',
          },
          spec: {
            frontend: {
              paths: ['/'],
            },
            module: {
              manifestLocation: 'location',
            },
            widgetRegistry: [{ module: 'module1', scope: 'scope1', frontendRef: frontendName }],
          },
        },
      ],
    };
  });

  it('should replace the widget registry with the one from the server', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const expectedResult = [
      { module: 'module2', scope: 'scope1', frontendRef: 'foo' },
      { module: 'module1', scope: 'scope1', frontendRef: frontendName },
    ];

    // Act - Execute the function under test
    const result = widgetRegistryInterceptor(widgetEntries, frontendCrd);

    // Assert - Verify behavior
    expect(result).toEqual(expectedResult);
  });
});
