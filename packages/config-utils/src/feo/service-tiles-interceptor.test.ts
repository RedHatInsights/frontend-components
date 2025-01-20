import { FrontendCRD, ServicesTilesResponseEntry } from './feo-types';
import serviceTilesInterceptor from './service-tiles-interceptor';

describe('Service tiles interceptor', () => {
  it('should replace service tiles with the ones from the frontendCRD', () => {
    const frontendName = 'frontendName';
    const frontendCrd: FrontendCRD = {
      objects: [
        {
          metadata: {
            name: frontendName,
          },
          spec: {
            module: {
              manifestLocation: 'location',
            },
            serviceTiles: [
              {
                section: 'section-1',
                group: 'group-1',
                id: 'id-1',
                frontendRef: frontendName,
              },
              {
                section: 'section-1',
                group: 'group-1',
                id: 'id-2',
                frontendRef: frontendName,
              },
              {
                section: 'section-2',
                group: 'group-1',
                id: 'id-3',
                frontendRef: frontendName,
              },
            ],
          },
        },
      ],
    };
    const remoteServiceTiles: ServicesTilesResponseEntry[] = [
      {
        id: 'section-1',
        description: 'section 1',
        icon: 'icon',
        links: [
          {
            id: 'group-1',
            title: 'Group 1',
            links: [
              {
                section: 'section-1',
                group: 'group-1',
                id: 'otherFrontend',
                frontendRef: 'otherFrontend',
              },
              {
                section: 'section-1',
                group: 'group-1',
                id: 'id-2',
                frontendRef: frontendName,
              },
            ],
          },
        ],
      },
      {
        id: 'section-2',
        description: 'section 2',
        icon: 'icon',
        links: [
          {
            id: 'group-1',
            title: 'Group 1',
            links: [
              {
                section: 'section-2',
                group: 'group-1',
                id: 'otherFrontend',
                frontendRef: 'otherFrontend',
              },
            ],
          },
        ],
      },
    ];
    const expectedServiceTiles: ServicesTilesResponseEntry[] = [
      {
        id: 'section-1',
        description: 'section 1',
        icon: 'icon',
        links: [
          {
            title: 'Group 1',
            id: 'group-1',
            links: [
              remoteServiceTiles[0].links[0].links[0],
              {
                section: 'section-1',
                group: 'group-1',
                id: 'id-1',
                frontendRef: frontendName,
              },
              {
                section: 'section-1',
                group: 'group-1',
                id: 'id-2',
                frontendRef: frontendName,
              },
            ],
          },
        ],
      },
      {
        id: 'section-2',
        description: 'section 2',
        icon: 'icon',
        links: [
          {
            title: 'Group 1',
            id: 'group-1',
            links: [
              remoteServiceTiles[1].links[0].links[0],
              {
                section: 'section-2',
                group: 'group-1',
                id: 'id-3',
                frontendRef: frontendName,
              },
            ],
          },
        ],
      },
    ];

    const result = serviceTilesInterceptor(remoteServiceTiles, frontendCrd);
    expect(result).toEqual(expectedServiceTiles);
  });
});
