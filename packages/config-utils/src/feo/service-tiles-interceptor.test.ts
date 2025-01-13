import { FrontendCRD, ServiceCategory } from './feo-types';
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
    const remoteServiceTiles: ServiceCategory[] = [
      {
        id: 'section-1',
        groups: [
          {
            id: 'group-1',
            tiles: [
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
        groups: [
          {
            id: 'group-1',
            tiles: [
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
    const expectedServiceTiles: ServiceCategory[] = [
      {
        id: 'section-1',
        groups: [
          {
            id: 'group-1',
            tiles: [
              remoteServiceTiles[0].groups[0].tiles[0],
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
        groups: [
          {
            id: 'group-1',
            tiles: [
              remoteServiceTiles[1].groups[0].tiles[0],
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
