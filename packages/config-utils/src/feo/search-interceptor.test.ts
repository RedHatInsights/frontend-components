import { ChromeStaticSearchEntry, FrontendCRD } from './feo-types';
import searchInterceptor from './search-interceptor';

describe('SearchInterceptor', () => {
  // Declare mock variables outside beforeEach for shared access
  let frontendName: string;
  let frontendCRD: FrontendCRD;
  let remoteSearchEntries: ChromeStaticSearchEntry[];

  beforeEach(() => {
    // Clear all mocks to ensure test isolation
    jest.clearAllMocks();
    
    // Initialize/reset test data with default values
    frontendName = 'frontendName';
    frontendCRD = {
      objects: [
        {
          metadata: {
            name: frontendName,
          },
          spec: {
            frontend: {
              paths: ['/'],
            },
            module: {
              manifestLocation: 'location',
            },
            searchEntries: [
              {
                frontendRef: frontendName,
                id: 'id-1',
                href: 'href-1',
                title: 'title-1',
                description: 'description-1',
              },
              {
                frontendRef: frontendName,
                id: 'id-1',
                href: 'href-1',
                title: 'title-1',
                description: 'description-1',
              },
            ],
          },
        },
      ],
    };
    remoteSearchEntries = [
      {
        frontendRef: 'otherFrontend',
        id: 'otherFrontend',
        href: 'otherFrontend',
        title: 'otherFrontend',
        description: 'otherFrontend',
      },
      {
        frontendRef: frontendName,
        id: frontendName,
        href: frontendName,
        title: frontendName,
        description: frontendName,
      },
    ];
  });

  it('should replace search entries with the ones from the frontendCRD', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const expectedSearchEntries: ChromeStaticSearchEntry[] = [remoteSearchEntries[0], ...(frontendCRD.objects[0].spec.searchEntries ?? [])];
    
    // Act - Execute the function under test
    const result = searchInterceptor(remoteSearchEntries, frontendCRD);
    
    // Assert - Verify behavior
    expect(result).toEqual(expectedSearchEntries);
  });
});
