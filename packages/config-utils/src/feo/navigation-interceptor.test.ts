import { DirectNavItem, FrontendCRD, Nav, SegmentRef } from './feo-types';
import navigationInterceptor from './navigation-interceptor';

describe('NavigationInterceptor', () => {
  describe('bundle segments', () => {
    const bundleName = 'testing-bundle';
    const defaultFrontendName = 'testing-frontend';
    const bundleSegmentName = 'testing-bundle-segment';
    const baseNavItem: DirectNavItem = {
      id: 'link-one',
      href: '/link-one',
      title: 'Link one',
    };
    function createLocalCRD({ bundleSegmentRef, frontendRef, ...navItem }: DirectNavItem, frontendName: string): FrontendCRD {
      return {
        objects: [
          {
            metadata: {
              name: frontendName,
            },
            spec: {
              module: {
                manifestLocation: 'http://localhost:3000/manifest.json',
              },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  position: 100,
                  segmentId: bundleSegmentName,
                  navItems: [navItem],
                },
              ],
            },
          },
        ],
      };
    }
    function createRemoteNav(navItem: DirectNavItem): Nav {
      return {
        id: bundleName,
        title: bundleName,
        navItems: [navItem],
      };
    }
    function createExpectedNavItems(navItem: DirectNavItem): DirectNavItem[] {
      return [navItem];
    }
    function crateTestData(
      navItem: DirectNavItem,
      {
        shouldChange,
        isNestedRoute,
        isNestedNav,
        frontendName,
      }: { shouldChange?: boolean; isNestedRoute?: boolean; isNestedNav?: boolean; frontendName?: string } = {}
    ) {
      const internalFrontendName = frontendName ?? defaultFrontendName;
      let internalNavItem: DirectNavItem = { ...navItem };
      internalNavItem.bundleSegmentRef = bundleSegmentName;
      internalNavItem.frontendRef = internalFrontendName;
      if (isNestedRoute) {
        internalNavItem = {
          ...internalNavItem,
          href: undefined,
          expandable: true,
          bundleSegmentRef: bundleSegmentName,
          frontendRef: internalFrontendName,
          routes: [
            {
              id: 'nested-one',
              href: '/nested/one',
              title: 'Nested one',
              bundleSegmentRef: bundleSegmentName,
              frontendRef: internalFrontendName,
            },
          ],
        };
      } else if (isNestedNav) {
        internalNavItem = {
          ...internalNavItem,
          href: undefined,
          bundleSegmentRef: bundleSegmentName,
          frontendRef: internalFrontendName,
          navItems: [
            {
              id: 'nested-one',
              href: '/nested/one',
              title: 'Nested one',
              bundleSegmentRef: bundleSegmentName,
              frontendRef: internalFrontendName,
            },
          ],
        };
      }
      let changedNavItem: DirectNavItem;
      if (shouldChange) {
        if (isNestedRoute) {
          changedNavItem = {
            ...internalNavItem,
            routes: [
              {
                id: 'nested-one',
                href: '/nested/one',
                title: internalNavItem?.routes?.[0]?.title + ' changed',
                bundleSegmentRef: bundleSegmentName,
                frontendRef: internalFrontendName,
              },
            ],
          };
          // @ts-ignore
          internalNavItem?.routes?.[0]?.title = internalNavItem?.routes?.[0]?.title + ' classic';
          // @ts-ignore
          internalNavItem?.routes?.[0]?.bundleSegmentRef = bundleSegmentName;
          // @ts-ignore
          internalNavItem?.routes?.[0]?.frontendRef = internalFrontendName;
        } else if (isNestedNav) {
          changedNavItem = {
            ...internalNavItem,
            navItems: [
              {
                id: 'nested-one',
                href: '/nested/one',
                title: internalNavItem?.navItems?.[0]?.title + ' changed',
                bundleSegmentRef: bundleSegmentName,
                frontendRef: internalFrontendName,
              },
            ],
          };
          // @ts-ignore
          internalNavItem?.navItems?.[0]?.title = internalNavItem?.navItems?.[0]?.title + ' classic';
          // @ts-ignore
          internalNavItem?.navItems?.[0]?.bundleSegmentRef = bundleSegmentName;
          // @ts-ignore
          internalNavItem?.navItems?.[0]?.frontendRef = internalFrontendName;
        } else {
          changedNavItem = {
            ...internalNavItem,
            title: internalNavItem.title + ' changed',
          };
          internalNavItem.title = internalNavItem.title + ' classic';
        }
      } else {
        changedNavItem = internalNavItem;
      }
      return {
        frontendCRD: createLocalCRD(changedNavItem, internalFrontendName),
        remoteNav: createRemoteNav(internalNavItem),
        expectedResult: createExpectedNavItems(changedNavItem),
      };
    }
    it('should substitute top level flat nav item', () => {
      const { frontendCRD, remoteNav, expectedResult } = crateTestData(baseNavItem, { shouldChange: true });

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      expect(result).toEqual(expectedResult);
    });

    it('should substitute nested routes item', () => {
      const { frontendCRD, remoteNav, expectedResult } = crateTestData(baseNavItem, { shouldChange: true, isNestedRoute: true });
      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      expect(result).toEqual(expectedResult);
    });

    it('should substitute nested navItems item', () => {
      const { frontendCRD, remoteNav, expectedResult } = crateTestData(baseNavItem, { shouldChange: true, isNestedNav: true });
      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      expect(result).toEqual(expectedResult);
    });

    it('should ignore navItems with matching id but different frontend ref', () => {
      const frontendName = 'flat-not-matching';
      const { frontendCRD, remoteNav, expectedResult } = crateTestData(baseNavItem, { shouldChange: false, frontendName });
      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('navigation segments', () => {
    const bundleName = 'testing-bundle';
    const defaultFrontendName = 'testing-frontend';
    const bundleSegmentName = 'testing-bundle-segment';
    const navSegmentId = 'testing-nav-segment-id';
    const baseSegmentRef: SegmentRef = {
      frontendName: defaultFrontendName,
      segmentId: navSegmentId,
    };
    const baseNavItem: DirectNavItem = {
      id: 'link-one',
      href: '/link-one',
      title: 'Link one',
    };

    it('should replace top level nav segment data', () => {
      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: {
              name: defaultFrontendName,
            },
            spec: {
              module: {
                manifestLocation: 'http://localhost:3000/manifest.json',
              },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  position: 100,
                  segmentId: bundleSegmentName,
                  navItems: [baseSegmentRef],
                },
              ],
              navigationSegments: [
                {
                  segmentId: navSegmentId,
                  navItems: [{ ...baseNavItem, title: 'Link one changed' }],
                },
              ],
            },
          },
        ],
      };

      const remoteNav: Nav = {
        id: bundleName,
        title: bundleName,
        navItems: [{ ...baseNavItem, segmentRef: baseSegmentRef, frontendRef: defaultFrontendName, bundleSegmentRef: bundleSegmentName }],
      };

      const expectedResult: DirectNavItem[] = [
        {
          ...baseNavItem,
          title: 'Link one changed',
        },
      ];

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      expect(result).toEqual(expectedResult);
    });

    it('should replace one segment ref with multiple navItems', () => {
      const bundleName = 'testing-bundle';
      const defaultFrontendName = 'testing-frontend';
      const bundleSegmentName = 'testing-bundle-segment';
      const navSegmentId = 'testing-nav-segment-id';
      const baseSegmentRef: SegmentRef = {
        frontendName: defaultFrontendName,
        segmentId: navSegmentId,
      };
      const baseNavItems: DirectNavItem[] = [
        {
          id: 'link-one',
          href: '/link-one',
          title: 'Link one',
        },
        {
          id: 'link-two',
          href: '/link-two',
          title: 'Link two',
        },
      ];

      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: {
              name: defaultFrontendName,
            },
            spec: {
              module: {
                manifestLocation: 'http://localhost:3000/manifest.json',
              },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  position: 100,
                  segmentId: bundleSegmentName,
                  navItems: [
                    {
                      title: 'persistent item',
                      href: '/persistent',
                      id: 'persistent',
                    },
                    baseSegmentRef,
                  ],
                },
              ],
              navigationSegments: [
                {
                  segmentId: navSegmentId,
                  navItems: baseNavItems.map(({ title, ...rest }) => ({ ...rest, title: `${title} changed` })),
                },
              ],
            },
          },
        ],
      };

      const remoteNav: Nav = {
        id: bundleName,
        title: bundleName,
        navItems: [
          {
            title: 'persistent item',
            href: '/persistent',
            id: 'persistent',
          },
          ...baseNavItems.map((navItem) => ({
            ...navItem,
            bundleSegmentRef: bundleSegmentName,
            segmentRef: baseSegmentRef,
            frontendRef: defaultFrontendName,
          })),
        ],
      };

      const expectedResult: DirectNavItem[] = [
        {
          title: 'persistent item',
          href: '/persistent',
          id: 'persistent',
        },
        ...baseNavItems.map(({ title, ...navItem }) => ({
          ...navItem,
          title: `${title} changed`,
        })),
      ];

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      expect(result).toEqual(expectedResult);
    });

    it('should replace remote segment with one item with multiple items', () => {
      const bundleName = 'testing-bundle';
      const defaultFrontendName = 'testing-frontend';
      const bundleSegmentName = 'testing-bundle-segment';
      const navSegmentId = 'testing-nav-segment-id';
      const baseSegmentRef: SegmentRef = {
        frontendName: defaultFrontendName,
        segmentId: navSegmentId,
      };
      const baseNavItems: DirectNavItem[] = [
        {
          id: 'link-one',
          href: '/link-one',
          title: 'Link one',
        },
        {
          id: 'link-two',
          href: '/link-two',
          title: 'Link two',
        },
      ];

      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: {
              name: defaultFrontendName,
            },
            spec: {
              module: {
                manifestLocation: 'http://localhost:3000/manifest.json',
              },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  position: 100,
                  segmentId: bundleSegmentName,
                  navItems: [baseSegmentRef],
                },
              ],
              navigationSegments: [
                {
                  segmentId: navSegmentId,
                  navItems: baseNavItems.map(({ title, ...rest }) => ({ ...rest, title: `${title} changed` })),
                },
              ],
            },
          },
        ],
      };

      const remoteNav: Nav = {
        id: bundleName,
        title: bundleName,
        navItems: [{ ...baseNavItems[0], segmentRef: baseSegmentRef, frontendRef: defaultFrontendName, bundleSegmentRef: bundleSegmentName }],
      };

      const expectedResult: DirectNavItem[] = baseNavItems.map(({ title, ...navItem }) => ({
        ...navItem,
        title: `${title} changed`,
      }));

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      expect(result).toEqual(expectedResult);
    });

    it('should replace remote segment with multiple items with one item', () => {
      const bundleName = 'testing-bundle';
      const defaultFrontendName = 'testing-frontend';
      const bundleSegmentName = 'testing-bundle-segment';
      const navSegmentId = 'testing-nav-segment-id';
      const baseSegmentRef: SegmentRef = {
        frontendName: defaultFrontendName,
        segmentId: navSegmentId,
      };
      const baseNavItems: DirectNavItem[] = [
        {
          id: 'link-one',
          href: '/link-one',
          title: 'Link one',
        },
        {
          id: 'link-two',
          href: '/link-two',
          title: 'Link two',
        },
      ];

      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: {
              name: defaultFrontendName,
            },
            spec: {
              module: {
                manifestLocation: 'http://localhost:3000/manifest.json',
              },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  position: 100,
                  segmentId: bundleSegmentName,
                  navItems: [baseSegmentRef],
                },
              ],
              navigationSegments: [
                {
                  segmentId: navSegmentId,
                  navItems: [{ ...baseNavItems[0], title: `${baseNavItems[0].title} changed` }],
                },
              ],
            },
          },
        ],
      };

      const remoteNav: Nav = {
        id: bundleName,
        title: bundleName,
        navItems: baseNavItems.map((navItem) => ({
          ...navItem,
          bundleSegmentRef: bundleSegmentName,
          segmentRef: baseSegmentRef,
          frontendRef: defaultFrontendName,
        })),
      };

      const expectedResult: DirectNavItem[] = [{ ...baseNavItems[0], title: `${baseNavItems[0].title} changed` }];

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('replacement of both navigation and bundle segments', () => {
    it('should handle complex and deeply nested replacements', () => {
      const frontendName = 'test-frontend';
      const bundleId = 'test-bundle-id';
      const bundleSegmentOneId = 'bundle-segment-one-id';
      const segmentOneId = 'segment-one-id';
      const segmentRefOne: SegmentRef = {
        frontendName: frontendName,
        segmentId: segmentOneId,
      };
      const segmentTwoId = 'segment-two-id';
      const segmentRefTwo: SegmentRef = {
        frontendName: frontendName,
        segmentId: segmentTwoId,
      };
      const segmentTreeId = 'segment-tree-id';
      const segmentRefThree: SegmentRef = {
        frontendName: frontendName,
        segmentId: segmentTreeId,
      };
      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: {
              name: frontendName,
            },
            spec: {
              module: {
                manifestLocation: 'http://localhost:3000/manifest.json',
              },
              navigationSegments: [
                {
                  segmentId: segmentOneId,
                  navItems: [
                    {
                      id: 'segment-one-link-one',
                      href: '/segment-one-link-one',
                      title: 'Segment one link one',
                    },
                    {
                      segmentRef: segmentRefTwo,
                    },
                  ],
                },
                {
                  segmentId: segmentTwoId,
                  navItems: [
                    {
                      id: 'segment-two-link-one',
                      href: '/segment-two-link-one',
                      title: 'Segment two link one',
                    },
                    {
                      id: 'segment-two-link-two',
                      href: '/segment-two-link-two',
                      title: 'Segment two link two changed',
                    },
                    {
                      id: 'segment-two-expandable-one',
                      title: 'Segment two expandable one',
                      expandable: true,
                      routes: [
                        {
                          segmentRef: segmentRefThree,
                        },
                      ],
                    },
                  ],
                },
                {
                  segmentId: segmentTreeId,
                  navItems: [
                    {
                      id: 'segment-tree-link-one',
                      href: '/segment-tree-link-one',
                      title: 'Segment tree link one changed',
                    },
                  ],
                },
              ],
              bundleSegments: [
                {
                  bundleId: bundleId,
                  segmentId: bundleSegmentOneId,
                  position: 100,
                  navItems: [
                    {
                      title: 'Link one',
                      href: '/link-one',
                      id: 'link-one',
                    },
                    {
                      title: 'expandable',
                      expandable: true,
                      id: 'expandable',
                      routes: [
                        {
                          segmentRef: segmentRefOne,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      };

      const remoteNav: Nav = {
        id: bundleId,
        title: bundleId,
        navItems: [
          {
            title: 'Link one',
            href: '/link-one',
            id: 'link-one',
            bundleSegmentRef: bundleSegmentOneId,
            frontendRef: frontendName,
          },
          {
            title: 'expandable',
            expandable: true,
            id: 'expandable',
            bundleSegmentRef: bundleSegmentOneId,
            frontendRef: frontendName,
            routes: [
              {
                id: 'segment-one-link-one',
                href: '/segment-one-link-one',
                title: 'Segment one link one',
                segmentRef: segmentRefOne,
                bundleSegmentRef: bundleSegmentOneId,
                frontendRef: frontendName,
              },
              {
                id: 'segment-two-link-one',
                href: '/segment-two-link-one',
                title: 'Segment two link one',
                segmentRef: segmentRefTwo,
                bundleSegmentRef: bundleSegmentOneId,
                frontendRef: frontendName,
              },
              {
                id: 'segment-two-link-two',
                href: '/segment-two-link-two',
                title: 'Segment two link two',
                segmentRef: segmentRefTwo,
                bundleSegmentRef: bundleSegmentOneId,
                frontendRef: frontendName,
              },
            ],
          },
        ],
      };

      const expectedResult: DirectNavItem[] = [
        {
          title: 'Link one',
          href: '/link-one',
          id: 'link-one',
          bundleSegmentRef: bundleSegmentOneId,
          frontendRef: frontendName,
        },
        {
          title: 'expandable',
          expandable: true,
          id: 'expandable',
          bundleSegmentRef: bundleSegmentOneId,
          frontendRef: frontendName,
          routes: [
            {
              id: 'segment-one-link-one',
              href: '/segment-one-link-one',
              title: 'Segment one link one',
            },
            {
              id: 'segment-two-link-one',
              href: '/segment-two-link-one',
              title: 'Segment two link one',
            },
            {
              id: 'segment-two-link-two',
              href: '/segment-two-link-two',
              title: 'Segment two link two changed',
            },
            {
              id: 'segment-two-expandable-one',
              title: 'Segment two expandable one',
              expandable: true,
              routes: [
                {
                  id: 'segment-tree-link-one',
                  href: '/segment-tree-link-one',
                  title: 'Segment tree link one changed',
                },
              ],
            },
          ],
        },
      ];

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleId);
      expect(result).toEqual(expectedResult);
    });
  });
});
