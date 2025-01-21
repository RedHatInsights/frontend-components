import { FrontendCRD } from './feo-types';
import validateFrontEndCrd from './validate-frontend-crd';
import cloneDeep from 'lodash/cloneDeep';

describe('Validate FrontEnd CRD', () => {
  const crdBase: FrontendCRD = {
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
  test('verify bundle segment position', () => {
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
    expect(() => validateFrontEndCrd(crd)).toThrowError(`must have required property 'position'`);
  });

  test('Should prevent mixing direct nav items and segment references', () => {
    const mixedNavItem = {
      title: 'A mixed nav item',
      href: '/foo/bar',
      segmentRef: {
        segmentId: 'test-segment',
        frontendName: 'test-frontend',
      },
    };
    const validDirectNavItem = {
      title: 'A valid nav item',
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
    expect(() => validateFrontEndCrd(validCrd)).not.toThrow();
    const invalidCrd = cloneDeep(crdBase) as FrontendCRD;
    invalidCrd.objects[0].spec.bundleSegments = [invalidBundleSegment];
    expect(() => validateFrontEndCrd(invalidCrd)).toThrowError(
      `Frontend CRD validation failed! must NOT have additional properties, must NOT have additional properties, must match exactly one schema in oneOf`
    );
  });
});
