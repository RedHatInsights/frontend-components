import { ChromeStaticSearchEntry, FrontendCRD } from './feo-types';
import searchInterceptor from './search-interceptor';

describe('SearchInterceptor', () => {
  it('should replace search entries with the ones from the frontendCRD', () => {
    const frontendName = 'frontendName';
    const frontendCRD: FrontendCRD = {
      objects: [
        {
          metadata: {
            name: frontendName,
          },
          spec: {
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
    const remoteSearchEntries: ChromeStaticSearchEntry[] = [
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

    const expectedSearchEntries: ChromeStaticSearchEntry[] = [remoteSearchEntries[0], ...(frontendCRD.objects[0].spec.searchEntries ?? [])];
    const result = searchInterceptor(remoteSearchEntries, frontendCRD);
    expect(result).toEqual(expectedSearchEntries);
  });
});
