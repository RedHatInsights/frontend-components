import { FrontendCRD } from './feo-types';
import validateFrontEndCrd from './validate-frontend-crd';
import cloneDeep from 'lodash/cloneDeep';

describe('Validate FrontEnd CRD', () => {
  // Declare mock variables outside beforeEach for shared access
  let crdBase: FrontendCRD;

  beforeEach(() => {
    // Clear all mocks to ensure test isolation
    jest.clearAllMocks();
    
    // Initialize/reset test data with default values
    crdBase = {
    apiVersion: 'v1',
    kind: 'Template',
    metadata: {
      name: 'test',
    },
    parameters: [],
    objects: [
      {
        apiVersion: 'cloud.redhat.com/v1alpha1',
        kind: 'Frontend',
        metadata: {
          name: 'test',
        },
        spec: {
          envName: '${ENV_NAME}',
          deploymentRepo: 'test',
          title: 'Test CRD',
          image: '${IMAGE}:${IMAGE_TAG}',
          frontend: {
            paths: ['/foo/bar'],
          },
          module: {
            manifestLocation: 'test',
          },
          bundleSegments: [] as any[],
        },
      },
    ],
  } as any;
  });

  test('verify bundle segment position', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const validBundleSegment = {
      segmentId: 'test-segment',
      bundleId: 'test-bundle',
      position: 100,
      navItems: [],
    };
    const invalidBundleSegment = {
      segmentId: 'invalid-segment',
      bundleId: 'test-bundle',
      navItems: [],
    };
    const crd = cloneDeep(crdBase) as FrontendCRD;
    // @ts-expect-error
    crd.objects[0].spec.bundleSegments = [validBundleSegment, invalidBundleSegment];
    
    // Act & Assert - Execute the function under test and verify error behavior
    expect(() => validateFrontEndCrd(crd)).toThrowError(`must have required property 'position'`);
  });

  test('Should prevent mixing direct nav items and segment references', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const mixedNavItem = {
      title: 'A mixed nav item',
      href: '/foo/bar',
      id: 'test-id',
      segmentRef: {
        segmentId: 'test-segment',
        frontendName: 'test-frontend',
      },
    };
    const validDirectNavItem = {
      title: 'A valid nav item',
      id: 'valid-id',
      href: '/foo/bar',
    };
    const validNavSegment = {
      segmentRef: {
        segmentId: 'test-segment',
        frontendName: 'test-frontend',
      },
    };
    const invalidBundleSegment = {
      segmentId: 'bundle-segment',
      bundleId: 'test-bundle',
      position: 100,
      navItems: [mixedNavItem],
    };
    const validBundleSegment = {
      segmentId: 'bundle-segment',
      bundleId: 'test-bundle',
      position: 100,
      navItems: [validNavSegment, validDirectNavItem],
    };
    const validCrd = cloneDeep(crdBase) as FrontendCRD;
    validCrd.objects[0].spec.bundleSegments = [validBundleSegment];
    const invalidCrd = cloneDeep(crdBase) as FrontendCRD;
    invalidCrd.objects[0].spec.bundleSegments = [invalidBundleSegment];
    
    // Act & Assert - Execute the function under test and verify behavior
    expect(() => validateFrontEndCrd(validCrd)).not.toThrow();
    expect(() => validateFrontEndCrd(invalidCrd)).toThrowError(
      `Frontend CRD validation failed! must NOT have additional properties, must NOT have additional properties, must match exactly one schema in oneOf`
    );
  });

  test('should only allow one frontend.paths entry', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const crd = cloneDeep(crdBase) as FrontendCRD;
    crd.objects[0].spec.frontend.paths = ['/foo/bar', '/baz'];
    
    // Act & Assert - Execute the function under test and verify error behavior
    expect(() => validateFrontEndCrd(crd)).toThrowError(`must NOT have more than 1 items`);
  });
});
