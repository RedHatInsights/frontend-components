import { doesHavePermissions, getRBAC, hasAllPermissions } from './RBAC';

describe('RBAC utilities', () => {
  describe('does have permissions', () => {
    const requiredPermissions = ['cost-management:rate:write', 'cost-management:*:*'];
    it('returns false permissions is null or undefined', () => {
      expect(doesHavePermissions(null, requiredPermissions)).toBe(false);
      expect(doesHavePermissions(undefined, requiredPermissions)).toBe(false);
    });
    it('returns false if permissions do not exist', () => {
      expect(doesHavePermissions([], requiredPermissions)).toBe(false);
      expect(doesHavePermissions(['cost-management:rate:read', 'cost-management:cluster:write'], requiredPermissions)).toBe(false);
    });
    it('returns true and at least one required permissions exists', () => {
      expect(doesHavePermissions(['cost-management:rate:write', 'cost-management:cluster:write'], requiredPermissions)).toBe(true);
    });
    it('return true for permission object', () => {
      expect(doesHavePermissions([{ permission: 'cost-management:rate:write' }, 'cost-management:cluster:write'], requiredPermissions)).toBe(true);
    });

    describe('can omit resource definitions check', () => {
      let requiredPermissions = [];
      let userPermissions = [];

      it('returns true even when resource definition is too narrow', () => {
        requiredPermissions = ['inventory:hosts:write', 'inventory:hosts:read'];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, false)).toBe(true);
      });

      it('returns true even when resource definition do not match', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '456',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, false)).toBe(true);
      });
    });

    describe('with resource definitions', () => {
      let requiredPermissions = [];
      let userPermissions = [];

      it('returns true with empty user resource definition, in operation', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with empty user resource definition, equals operation', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with matching resource definition, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with matching resource definition, 2', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with matching resource definition, 3', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456,789',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns false with not matching resource definitions, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with not matching resource definitions, 2', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,789',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with not matching resource definitions, 3', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '456,789',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with not matching resource definitions, 4', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '456',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with empty resource definitions required, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with empty resource definitions required, 2', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns true with user having wildcard permissions, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:*',
            resourceDefinitions: [],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with user having wildcard permissions, 2', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:*:read',
            resourceDefinitions: [],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with user having wildcard permissions, 3', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: '*:*:read',
            resourceDefinitions: [],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true if at least one of many permissions is fulfilled, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:groups:read',
            resourceDefinitions: [],
          },
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns false if none of more permissions is fulfilled', () => {
        requiredPermissions = [
          {
            permission: 'inventory:groups:read',
            resourceDefinitions: [],
          },
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(doesHavePermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });
    });
  });
  describe('has all permissions', () => {
    const requiredPermissions = ['cost-management:rate:write', 'some-app:*:*'];
    it('returns false permissions is null or undefined', () => {
      expect(hasAllPermissions(null, requiredPermissions)).toBe(false);
      expect(hasAllPermissions(undefined, requiredPermissions)).toBe(false);
    });
    it('returns false if permissions do not exist', () => {
      expect(hasAllPermissions([], requiredPermissions)).toBe(false);
      expect(hasAllPermissions(['cost-management:rate:read', 'cost-management:cluster:write'], requiredPermissions)).toBe(false);
    });
    it('returns true for all permissions', () => {
      expect(hasAllPermissions(['cost-management:rate:write', 'some-app:*:*'], requiredPermissions)).toBe(true);
    });
    it('return true for permission object', () => {
      expect(hasAllPermissions([{ permission: 'cost-management:rate:write' }, { permission: 'some-app:*:*' }], requiredPermissions)).toBe(true);
    });
    it('returns true for star permissions', () => {
      expect(
        hasAllPermissions(['cost-management:rate:*', 'cost-management:*:write', '*:*:*', '*:*:write', 'some-app:*:*'], requiredPermissions)
      ).toBe(true);
    });
    it('returns false for missing permissions', () => {
      expect(hasAllPermissions(['cost-management:*:read', 'some-app:*:*'], requiredPermissions)).toBe(false);
    });

    describe('can omit resource definitions check', () => {
      let requiredPermissions = [];
      let userPermissions = [];

      it('returns true even when resource definition is too narrow', () => {
        requiredPermissions = ['inventory:hosts:write', 'inventory:hosts:read'];
        userPermissions = [
          'inventory:hosts:write',
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, false)).toBe(true);
      });

      it('returns true even when resource definition do not match', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:write',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:write',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '456',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, false)).toBe(true);
      });

      it('returns false when there not all permissions match', () => {
        requiredPermissions = ['inventory:hosts:write', 'inventory:hosts:read'];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, false)).toBe(false);
      });
    });

    describe('with resource definitions', () => {
      let requiredPermissions = [];
      let userPermissions = [];

      it('returns true with empty user resource definition, in operation', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with empty user resource definition, equals operation', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with matching resource definition, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with matching resource definition, 2', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with matching resource definition, 3', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456,789',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns false with not matching resource definitions, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with not matching resource definitions, 2', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,789',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with not matching resource definitions, 3', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '456,789',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with not matching resource definitions, 4', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '456',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with empty resource definitions required, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns false with empty resource definitions required, 2', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });

      it('returns true with user having wildcard permissions, 1', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:*',
            resourceDefinitions: [],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with user having wildcard permissions, 2', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:*:read',
            resourceDefinitions: [],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true with user having wildcard permissions, 3', () => {
        requiredPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
          {
            permission: 'inventory:groups:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
          {
            permission: 'smth-else-app:smth-else:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = ['*:*:read'];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns true if all permissions are fulfilled', () => {
        requiredPermissions = [
          {
            permission: 'inventory:groups:read',
            resourceDefinitions: [],
          },
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [],
          },
          'inventory:groups:*',
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(true);
      });

      it('returns false if not all of the permissions are fulfilled', () => {
        requiredPermissions = [
          {
            permission: 'inventory:groups:read',
            resourceDefinitions: [],
          },
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'equal',
                  value: '123',
                },
              },
            ],
          },
        ];
        userPermissions = [
          {
            permission: 'inventory:hosts:read',
            resourceDefinitions: [
              {
                attributeFilter: {
                  key: 'system-id',
                  operation: 'in',
                  value: '123,456',
                },
              },
            ],
          },
        ];
        expect(hasAllPermissions(userPermissions, requiredPermissions, true)).toBe(false);
      });
    });
  });

  describe('ger RBAC', () => {
    it('returns permission list and is org admin', async () => {
      const resp = await getRBAC('app-name');
      expect(resp).toEqual({ isOrgAdmin: true, permissions: [] });
    });
  });
});
