import { DirectNavItem, FrontendCRD, Nav, SegmentRef } from './feo-types';
import navigationInterceptor from './navigation-interceptor';

import costNav from './test-nav-cost.json';

describe('NavigationInterceptor', () => {
  describe('bundle segments', () => {
    // Declare shared variables outside beforeEach for shared access
    let bundleName: string;
    let defaultFrontendName: string;
    let bundleSegmentName: string;
    let baseNavItem: DirectNavItem;

    beforeEach(() => {
      // Clear all mocks to ensure test isolation
      jest.clearAllMocks();
      
      // Initialize/reset test data with default values
      bundleName = 'testing-bundle';
      defaultFrontendName = 'testing-frontend';
      bundleSegmentName = 'testing-bundle-segment';
      baseNavItem = {
        id: 'link-one',
        href: '/link-one',
        title: 'Link one',
      };
    });
    function createLocalCRD({ bundleSegmentRef, frontendRef, ...navItem }: DirectNavItem, frontendName: string): FrontendCRD {
      return {
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
          position: 100,
          routes: [
            {
              id: 'nested-one',
              href: '/nested/one',
              title: 'Nested one',
              bundleSegmentRef: bundleSegmentName,
              position: 100,
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
          position: 100,
          navItems: [
            {
              id: 'nested-one',
              href: '/nested/one',
              title: 'Nested one',
              position: 100,
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
            position: 100,
            routes: [
              {
                id: 'nested-one',
                href: '/nested/one',
                title: internalNavItem?.routes?.[0]?.title + ' changed',
                position: 100,
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
            position: 100,
            navItems: [
              {
                id: 'nested-one',
                href: '/nested/one',
                title: internalNavItem?.navItems?.[0]?.title + ' changed',
                position: 100,
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
            position: 100,
            title: internalNavItem.title + ' changed',
          };
          internalNavItem.title = internalNavItem.title + ' classic';
        }
      } else {
        changedNavItem = { ...internalNavItem, position: 100 };
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
    // Declare shared variables outside beforeEach for shared access
    let bundleName: string;
    let defaultFrontendName: string;
    let bundleSegmentName: string;
    let navSegmentId: string;
    let baseSegmentRef: SegmentRef;
    let baseNavItem: DirectNavItem;

    beforeEach(() => {
      // Clear all mocks to ensure test isolation
      jest.clearAllMocks();
      
      // Initialize/reset test data with default values
      bundleName = 'testing-bundle';
      defaultFrontendName = 'testing-frontend';
      bundleSegmentName = 'testing-bundle-segment';
      navSegmentId = 'testing-nav-segment-id';
      baseSegmentRef = {
        frontendName: defaultFrontendName,
        segmentId: navSegmentId,
      };
      baseNavItem = {
        id: 'link-one',
        href: '/link-one',
        title: 'Link one',
      };
    });

    it('should replace top level nav segment data', () => {
      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: {
              name: defaultFrontendName,
            },
            spec: {
              frontend: {
                paths: ['/'],
              },
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
      // Arrange - Setup test data (base data already configured in beforeEach)
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
              frontend: {
                paths: ['/'],
              },
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

      // Act - Execute the function under test
      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      
      // Assert - Verify behavior
      expect(result).toEqual(expectedResult);
    });

    it('should replace remote segment with one item with multiple items', () => {
      // Arrange - Setup test data (base data already configured in beforeEach)
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
              frontend: {
                paths: ['/'],
              },
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

      // Act - Execute the function under test
      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      
      // Assert - Verify behavior
      expect(result).toEqual(expectedResult);
    });

    it('should replace remote segment with multiple items with one item', () => {
      // Arrange - Setup test data (base data already configured in beforeEach)
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
              frontend: {
                paths: ['/'],
              },
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

      // Act - Execute the function under test
      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      
      // Assert - Verify behavior
      expect(result).toEqual(expectedResult);
    });
  });

  describe('replacement of both navigation and bundle segments', () => {
    // Declare shared variables outside beforeEach for shared access
    let frontendName: string;
    let bundleId: string;

    beforeEach(() => {
      // Clear all mocks to ensure test isolation
      jest.clearAllMocks();
      
      // Initialize/reset test data with default values
      frontendName = 'test-frontend';
      bundleId = 'test-bundle-id';
    });

    it('should handle complex and deeply nested replacements', () => {
      // Arrange - Setup test data (base data already configured in beforeEach)
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
              frontend: {
                paths: ['/'],
              },
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
          position: 100,
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
          position: 100,
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

      // Act - Execute the function under test
      const result = navigationInterceptor(frontendCRD, remoteNav, bundleId);
      
      // Assert - Verify behavior
      expect(result).toEqual(expectedResult);
    });

    it('should replace navigation segments', () => {
      const frontendName = 'cost-management';
      const frontendCRD: FrontendCRD = {
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
                manifestLocation: 'http://localhost:3000/manifest.json',
              },
              navigationSegments: [
                {
                  "segmentId": "cost-management",
                  "navItems": [
                      {
                          "id": "cost-management.nav",
                          "title": "Cost Management changed",
                          "expandable": true,
                          "routes": [
                              {
                                  "id": "cost-management.overview",
                                  "title": "Overview changed",
                                  "href": "/openshift/cost-management",
                              },
                              {
                                  "id": "cost-management.systems",
                                  "title": "Systems",
                                  "href": "/openshift/cost-management/systems",
                              },
                          ]
                      }
                  ]
                }
              ],
            },
          },
        ],
      };

      const remoteNav: Nav = costNav;
      const result = navigationInterceptor(frontendCRD, remoteNav, bundleId);
      const rootData = result[0].navItems?.find((item) => item.id === 'cost-management.nav');
      expect(rootData).toBeDefined();
      expect(rootData?.title).toEqual('Cost Management changed');
      const rootRoutes = rootData?.routes;
      expect(rootRoutes).toBeDefined();
      expect(rootRoutes?.[0].title).toEqual('Overview changed');
    });
  });

  describe('Adding new nested items', () => {
    it('should add new items to bundle segment navItems routes', () => {
      const bundleName = 'iam';
      const frontendName = 'rbac';

      // This simulates the user's actual RBAC frontend.yaml configuration
      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: {
              name: frontendName,
            },
            spec: {
              frontend: {
                paths: ['/apps/rbac'],
              },
              module: {
                manifestLocation: 'http://localhost:3000/manifest.json',
              },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  segmentId: 'module-rbac-ui',
                  position: 100,
                  navItems: [
                    {
                      id: 'access-management',
                      title: 'Access Management',
                      expandable: true,
                      routes: [
                        {
                          id: 'users-and-groups',
                          title: 'Users and GroupsXZ', // Modified existing item
                          href: '/iam/access-management/users-and-groups',
                          permissions: [{ method: 'isOrgAdmin' }],
                        },
                        {
                          id: 'foobar', // NEW item that should appear but doesn't
                          title: 'AAA',
                          href: '/iam/access-management/users-and-groups',
                          permissions: [{ method: 'isOrgAdmin' }],
                        },
                        {
                          id: 'roles',
                          title: 'Roles',
                          href: '/iam/access-management/roles',
                          permissions: [{ method: 'isOrgAdmin' }],
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

      // This simulates the remote navigation response
      const remoteNav: Nav = {
        id: bundleName,
        title: 'IAM Bundle',
        navItems: [
          {
            id: 'access-management',
            title: 'Access Management',
            expandable: true,
            bundleSegmentRef: 'module-rbac-ui',
            frontendRef: frontendName,
            routes: [
              {
                id: 'users-and-groups',
                title: 'Users and Groups', // Original title
                href: '/iam/access-management/users-and-groups',
                permissions: [{ method: 'isOrgAdmin' }],
              },
              {
                id: 'roles',
                title: 'Roles',
                href: '/iam/access-management/roles',
                permissions: [{ method: 'isOrgAdmin' }],
              },
              // Note: 'foobar' item is NOT in the remote response
            ],
          },
        ],
      };

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);

      // The bundle segment should match and modify the access-management item
      const accessMgmt = result.find(item => item.id === 'access-management');
      expect(accessMgmt).toBeDefined();
      expect(accessMgmt?.title).toBe('Access Management');

      // The modified title should work
      const usersAndGroups = accessMgmt?.routes?.find(route => route.id === 'users-and-groups');
      expect(usersAndGroups).toBeDefined();
      expect(usersAndGroups?.title).toBe('Users and GroupsXZ'); // Modified title should work

      // The new item should now appear (fix working!)
      const foobarItem = accessMgmt?.routes?.find(route => route.id === 'foobar');
      expect(foobarItem).toBeDefined(); // NEW item now appears
      expect(foobarItem?.title).toBe('AAA');
      expect(foobarItem?.href).toBe('/iam/access-management/users-and-groups');
      expect(foobarItem?.permissions).toEqual([{ method: 'isOrgAdmin' }]);

      // The existing roles item should still be there
      const rolesItem = accessMgmt?.routes?.find(route => route.id === 'roles');
      expect(rolesItem).toBeDefined();
      expect(rolesItem?.title).toBe('Roles');

      // All items should be present: modified item, new item, and existing items
      expect(accessMgmt?.routes).toHaveLength(3); // Should include all 3 items
    });

    it('should handle pure addition when remote item has no routes', () => {
      const bundleName = 'iam';
      const frontendName = 'rbac';

      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: { name: frontendName },
            spec: {
              frontend: { paths: ['/apps/rbac'] },
              module: { manifestLocation: '/apps/rbac/fed-mods.json' },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  segmentId: 'test-segment',
                  position: 100,
                  navItems: [
                    {
                      id: 'empty-container',
                      title: 'Empty Container',
                      expandable: true,
                      routes: [
                        { id: 'new-item1', title: 'New Item 1', href: '/new1' },
                        { id: 'new-item2', title: 'New Item 2', href: '/new2' },
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
        id: bundleName,
        title: 'Test Bundle',
        navItems: [
          {
            id: 'empty-container',
            title: 'Empty Container',
            expandable: true,
            bundleSegmentRef: 'test-segment',
            frontendRef: frontendName,
            // No routes in remote - pure addition scenario
          },
        ],
      };

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      const container = result.find(item => item.id === 'empty-container');

      expect(container).toBeDefined();
      expect(container?.routes).toHaveLength(2);
      expect(container?.routes?.find(r => r.id === 'new-item1')).toBeDefined();
      expect(container?.routes?.find(r => r.id === 'new-item2')).toBeDefined();
    });

    it('should handle pure passthrough when local segment has no routes', () => {
      const bundleName = 'iam';
      const frontendName = 'rbac';

      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: { name: frontendName },
            spec: {
              frontend: { paths: ['/apps/rbac'] },
              module: { manifestLocation: '/apps/rbac/fed-mods.json' },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  segmentId: 'test-segment',
                  position: 100,
                  navItems: [
                    {
                      id: 'passthrough-container',
                      title: 'Modified Title', // Only title change, no routes
                      expandable: true,
                    },
                  ],
                },
              ],
            },
          },
        ],
      };

      const remoteNav: Nav = {
        id: bundleName,
        title: 'Test Bundle',
        navItems: [
          {
            id: 'passthrough-container',
            title: 'Original Title',
            expandable: true,
            bundleSegmentRef: 'test-segment',
            frontendRef: frontendName,
            routes: [
              { id: 'remote-item1', title: 'Remote Item 1', href: '/remote1' },
              { id: 'remote-item2', title: 'Remote Item 2', href: '/remote2' },
            ],
          },
        ],
      };

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      const container = result.find(item => item.id === 'passthrough-container');

      expect(container).toBeDefined();
      expect(container?.title).toBe('Modified Title'); // Local title wins
      expect(container?.routes).toHaveLength(2); // Remote routes preserved
      expect(container?.routes?.find(r => r.id === 'remote-item1')).toBeDefined();
      expect(container?.routes?.find(r => r.id === 'remote-item2')).toBeDefined();
    });

    it('should handle conflict resolution - local properties win over remote', () => {
      const bundleName = 'iam';
      const frontendName = 'rbac';

      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: { name: frontendName },
            spec: {
              frontend: { paths: ['/apps/rbac'] },
              module: { manifestLocation: '/apps/rbac/fed-mods.json' },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  segmentId: 'test-segment',
                  position: 100,
                  navItems: [
                    {
                      id: 'conflict-container',
                      title: 'Container',
                      expandable: true,
                      routes: [
                        {
                          id: 'conflicting-item',
                          title: 'Local Title',
                          href: '/local-href',
                          description: 'Local description',
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
        id: bundleName,
        title: 'Test Bundle',
        navItems: [
          {
            id: 'conflict-container',
            title: 'Container',
            expandable: true,
            bundleSegmentRef: 'test-segment',
            frontendRef: frontendName,
            routes: [
              {
                id: 'conflicting-item',
                title: 'Remote Title',
                href: '/remote-href',
                icon: 'remote-icon',
              },
            ],
          },
        ],
      };

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      const container = result.find(item => item.id === 'conflict-container');
      const conflictingItem = container?.routes?.find(r => r.id === 'conflicting-item');

      expect(conflictingItem).toBeDefined();
      expect(conflictingItem?.title).toBe('Local Title'); // Local wins
      expect(conflictingItem?.href).toBe('/local-href'); // Local wins
      expect(conflictingItem?.description).toBe('Local description'); // Local only
      expect(conflictingItem?.icon).toBe('remote-icon'); // Remote preserved when not in local
    });

    it('should maintain ordering with mixed new and existing items', () => {
      const bundleName = 'iam';
      const frontendName = 'rbac';

      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: { name: frontendName },
            spec: {
              frontend: { paths: ['/apps/rbac'] },
              module: { manifestLocation: '/apps/rbac/fed-mods.json' },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  segmentId: 'test-segment',
                  position: 100,
                  navItems: [
                    {
                      id: 'ordered-container',
                      title: 'Container',
                      expandable: true,
                      routes: [
                        { id: 'local-first', title: 'Local First', href: '/first' },
                        { id: 'existing-middle', title: 'Modified Middle', href: '/middle' }, // Modify existing
                        { id: 'local-last', title: 'Local Last', href: '/last' },
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
        id: bundleName,
        title: 'Test Bundle',
        navItems: [
          {
            id: 'ordered-container',
            title: 'Container',
            expandable: true,
            bundleSegmentRef: 'test-segment',
            frontendRef: frontendName,
            routes: [
              { id: 'existing-middle', title: 'Original Middle', href: '/middle' },
              { id: 'remote-extra', title: 'Remote Extra', href: '/extra' },
            ],
          },
        ],
      };

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      const container = result.find(item => item.id === 'ordered-container');

      expect(container?.routes).toHaveLength(4);

      // Check that local ordering is preserved and remote items are added at the end
      const routes = container?.routes || [];
      expect(routes[0].id).toBe('local-first');
      expect(routes[1].id).toBe('existing-middle');
      expect(routes[1].title).toBe('Modified Middle'); // Local modification
      expect(routes[2].id).toBe('local-last');
      expect(routes[3].id).toBe('remote-extra');
    });

    it('should preserve remote items not present in local (not removal)', () => {
      const bundleName = 'iam';
      const frontendName = 'rbac';

      const frontendCRD: FrontendCRD = {
        objects: [
          {
            metadata: { name: frontendName },
            spec: {
              frontend: { paths: ['/apps/rbac'] },
              module: { manifestLocation: '/apps/rbac/fed-mods.json' },
              bundleSegments: [
                {
                  bundleId: bundleName,
                  segmentId: 'test-segment',
                  position: 100,
                  navItems: [
                    {
                      id: 'partial-container',
                      title: 'Container',
                      expandable: true,
                      routes: [
                        { id: 'local-item', title: 'Local Item', href: '/local' },
                        // Note: 'remote-only-item' is NOT defined here
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
        id: bundleName,
        title: 'Test Bundle',
        navItems: [
          {
            id: 'partial-container',
            title: 'Container',
            expandable: true,
            bundleSegmentRef: 'test-segment',
            frontendRef: frontendName,
            routes: [
              { id: 'remote-only-item', title: 'Remote Only', href: '/remote-only' },
              { id: 'another-remote', title: 'Another Remote', href: '/another' },
            ],
          },
        ],
      };

      const result = navigationInterceptor(frontendCRD, remoteNav, bundleName);
      const container = result.find(item => item.id === 'partial-container');

      expect(container?.routes).toHaveLength(3);
      expect(container?.routes?.find(r => r.id === 'local-item')).toBeDefined(); // Local added
      expect(container?.routes?.find(r => r.id === 'remote-only-item')).toBeDefined(); // Remote preserved
      expect(container?.routes?.find(r => r.id === 'another-remote')).toBeDefined(); // Remote preserved
    });
  });
});
