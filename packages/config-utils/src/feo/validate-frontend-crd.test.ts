import { FrontendCRD } from './feo-types';
import validateFrontEndCrd from './validate-frontend-crd';
import cloneDeep from 'lodash/cloneDeep';
import { load } from 'js-yaml';

// Copied from tests/fixtures/localization/frontend.yaml in RedHatInsights/frontend-operator,
// the Frontend that the operator CRD accepts for the same locales feature. `module.moduleID` is
// omitted: the operator CRD has it but this package's schema does not (unrelated to locales).
const operatorFrontendFixture = `
apiVersion: cloud.redhat.com/v1alpha1
kind: Frontend
metadata:
  name: rbac
  namespace: console
spec:
  envName: stage
  title: RBAC
  deploymentRepo: https://github.com/RedHatInsights/insights-rbac-ui
  feoConfigEnabled: true
  frontend:
    paths:
      - /apps/rbac
  module:
    manifestLocation: /apps/rbac/fed-mods.json
    defaultDocumentTitle: User Access
  bundleSegments:
    - bundleId: iam
      segmentId: user-access
      position: 100
      navItems:
        - id: users
          title: Users
          href: /iam/user-access/users
        - id: access
          title: User Access
          expandable: true
          routes:
            - id: groups
              title: Groups
              href: /iam/user-access/groups
            - id: roles
              title: Roles
              product: Red Hat Access
              href: /iam/user-access/roles
        - id: settings
          title: Settings
          groupId: settings
          navItems:
            - id: preferences
              title: Preferences
              href: /iam/user-access/preferences
  searchEntries:
    - id: users
      title: Users
      description: Manage users in your account
      href: /iam/user-access/users
      alt_title:
        - People
        - Accounts
  serviceTiles:
    - section: security
      group: access
      id: user-access
      title: User Access
      description: Manage who can do what
      href: /iam/user-access
      icon: Ansible
  locales:
    fr:
      module.defaultDocumentTitle: Accès utilisateur
      searchEntries.users.title: Utilisateurs
      searchEntries.users.description: Gérer les utilisateurs de votre compte
      searchEntries.users.alt_title.people: Personnes
      searchEntries.users.alt_title.accounts: Comptes
      bundleSegments.iam.user-access.navItems.users.title: Utilisateurs
      bundleSegments.iam.user-access.navItems.access.title: Accès utilisateur
      bundleSegments.iam.user-access.navItems.access.routes.groups.title: Groupes
      bundleSegments.iam.user-access.navItems.access.routes.roles.title: Rôles
      bundleSegments.iam.user-access.navItems.access.routes.roles.product: Accès Red Hat
      serviceTiles.security.access.user-access.title: Accès utilisateur
      serviceTiles.security.access.user-access.description: Gérer qui peut faire quoi
`;

// The operator CRD (api/v1alpha1/locale_types.go) is the source of truth for the locales rules.
const repeat = (char: string, count: number) => char.repeat(count);
const numberedKeys = (count: number, prefix = 'key') =>
  Object.fromEntries(Array.from({ length: count }, (_value, index) => [`${prefix}${index}`, 'v']));

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
      `Frontend CRD validation failed! must NOT have additional properties, must NOT have additional properties, must match exactly one schema in oneOf`,
    );
  });

  test('should accept analytics with only required APIKey', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const crd = cloneDeep(crdBase) as FrontendCRD;
    (crd as any).objects[0].spec.module.analytics = {
      APIKey: 'test-key',
    };

    // Act & Assert - Execute the function under test and verify behavior
    expect(() => validateFrontEndCrd(crd)).not.toThrow();
  });

  test('should accept analytics with all optional key fields', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const crd = cloneDeep(crdBase) as FrontendCRD;
    (crd as any).objects[0].spec.module.analytics = {
      APIKey: 'test-key',
      APIKeyDev: 'test-key-dev',
      autocaptureAPIKey: 'autocapture-key',
      autocaptureAPIKeyDev: 'autocapture-key-dev',
    };

    // Act & Assert - Execute the function under test and verify behavior
    expect(() => validateFrontEndCrd(crd)).not.toThrow();
  });

  test('should reject analytics with unknown properties', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const crd = cloneDeep(crdBase) as FrontendCRD;
    (crd as any).objects[0].spec.module.analytics = {
      APIKey: 'test-key',
      unknownField: 'bad-value',
    };

    // Act & Assert - Execute the function under test and verify error behavior
    expect(() => validateFrontEndCrd(crd)).toThrowError('must NOT have additional properties');
  });

  test('accepts optional locale message maps, including zh-CN', () => {
    const crd = cloneDeep(crdBase) as FrontendCRD;
    crd.objects[0].spec.locales = {
      'zh-CN': {
        'searchEntries.rbac-roles.title': '角色',
        'bundleSegments.iam.module-rbac-ui.navItems.overview.title': '概览',
      },
      fr: { 'search.roles.title': 'Rôles' },
    };

    expect(() => validateFrontEndCrd(crdBase)).not.toThrow();
    expect(() => validateFrontEndCrd(crd)).not.toThrow();
  });

  const setLocales = (locales: unknown) => {
    const crd = cloneDeep(crdBase) as FrontendCRD;
    Object.assign(crd.objects[0].spec, { locales });
    return crd;
  };

  test('accepts the Frontend fixture used by the operator', () => {
    const fixtureSpec = (load(operatorFrontendFixture) as { spec: Record<string, unknown> }).spec;
    const crd = cloneDeep(crdBase) as FrontendCRD;
    // The template parameters replace the fixture's concrete env and image
    Object.assign(crd.objects[0].spec, fixtureSpec, { envName: '${ENV_NAME}', image: '${IMAGE}:${IMAGE_TAG}' });

    expect(() => validateFrontEndCrd(crd)).not.toThrow();
  });

  test.each(['fr', 'ko', 'ja', 'zh-CN', 'zh-Hant-TW', 'es-419', 'fil', 'sr-Latn'])('accepts canonical locale id %s', (locale) => {
    expect(() => validateFrontEndCrd(setLocales({ [locale]: { 'search.roles.title': 'x' } }))).not.toThrow();
  });

  test('accepts keys with dots, dashes and underscores', () => {
    const keys = ['a', 'A1', 'searchEntries.rbac-roles.title', 'a_b.c-d.e', '0.1'];
    expect(() => validateFrontEndCrd(setLocales({ fr: Object.fromEntries(keys.map((key) => [key, 'x'])) }))).not.toThrow();
  });

  test.each([
    ['array instead of locale map', ['角色'], 'must be object'],
    ['string instead of message map', { 'zh-CN': '角色' }, 'must be object'],
    [
      'number instead of translation',
      { 'zh-CN': { 'searchEntries.roles.title': 42 } },
      '/objects/0/spec/locales/zh-CN/searchEntries.roles.title: message values must be strings',
    ],
    [
      'underscore locale tag',
      { zh_CN: { 'searchEntries.roles.title': '角色' } },
      '/objects/0/spec/locales: locale "zh_CN": locale identifiers must use canonical BCP 47 casing, e.g. fr, ko, ja, zh-CN, zh-Hant-TW',
    ],
    [
      'numeric locale subtag',
      { 'fr-12': { 'search.roles.title': 'Rôles' } },
      '/objects/0/spec/locales: locale "fr-12": locale identifiers must use canonical BCP 47 casing',
    ],
    [
      'lowercase region (zh-cn)',
      { 'zh-cn': { 'search.roles.title': '角色' } },
      '/objects/0/spec/locales: locale "zh-cn": locale identifiers must use canonical BCP 47 casing',
    ],
    [
      'lowercase region (fr-fr)',
      { 'fr-fr': { 'search.roles.title': 'Rôles' } },
      '/objects/0/spec/locales: locale "fr-fr": locale identifiers must use canonical BCP 47 casing',
    ],
    [
      'uppercase language',
      { FR: { 'search.roles.title': 'Rôles' } },
      '/objects/0/spec/locales: locale "FR": locale identifiers must use canonical BCP 47 casing',
    ],
    [
      'Unicode extension',
      { 'en-US-u-nu-latn': { 'search.roles.title': 'Roles' } },
      '/objects/0/spec/locales: locale "en-US-u-nu-latn": locale identifiers must use canonical BCP 47 casing',
    ],
    [
      'underscore region (operator kuttl fr_CA)',
      { fr_CA: { 'a.b': 'Bonjour' } },
      '/objects/0/spec/locales: locale "fr_CA": locale identifiers must use canonical BCP 47 casing',
    ],
    [
      'English as a translation',
      { en: { 'a.b': 'Hello' } },
      '/objects/0/spec/locales: locale "en": English is the source language and must not be listed as a translation',
    ],
    [
      'double dot in message key (operator kuttl)',
      { fr: { 'a..b': 'Bonjour' } },
      "/objects/0/spec/locales/fr: message key \"a..b\": message keys must be dot-separated paths of letters, digits, '_' and '-' (e.g. searchEntries.rbac-roles.title)",
    ],
    [
      'malformed message key (operator kuttl)',
      { fr: { 'bad key!': 'Bonjour' } },
      "/objects/0/spec/locales/fr: message key \"bad key!\": message keys must be dot-separated paths of letters, digits, '_' and '-'",
    ],
    ['message key with leading dot', { fr: { '.a': 'x' } }, 'message key ".a": message keys must be dot-separated paths'],
    ['message key with trailing dot', { fr: { 'a.': 'x' } }, 'message key "a.": message keys must be dot-separated paths'],
    ['message key with leading dash', { fr: { '-a': 'x' } }, 'message key "-a": message keys must be dot-separated paths'],
    ['empty message key', { fr: { '': 'x' } }, 'message key "": message keys must be dot-separated paths'],
  ])('rejects %s', (_name, locales, reason) => {
    expect(() => validateFrontEndCrd(setLocales(locales))).toThrowError(reason);
  });

  describe('locales limits', () => {
    // 32 distinct canonical locale ids: aa..ag style two-letter codes
    const localeIds = (count: number) =>
      Array.from(
        { length: count },
        (_value, index) => `${String.fromCharCode(97 + Math.floor(index / 26))}${String.fromCharCode(97 + (index % 26))}`,
      );
    const catalogs = (count: number) => Object.fromEntries(localeIds(count).map((id) => [id, { 'a.b': 'x' }]));

    test('accepts exactly 32 locales', () => {
      expect(() => validateFrontEndCrd(setLocales(catalogs(32)))).not.toThrow();
    });

    test('rejects 33 locales', () => {
      expect(() => validateFrontEndCrd(setLocales(catalogs(33)))).toThrowError('/objects/0/spec/locales: at most 32 locales may be listed');
    });

    test('accepts exactly 2048 keys in a locale', () => {
      expect(() => validateFrontEndCrd(setLocales({ fr: numberedKeys(2048) }))).not.toThrow();
    });

    test('rejects 2049 keys in a locale', () => {
      expect(() => validateFrontEndCrd(setLocales({ fr: numberedKeys(2049) }))).toThrowError(
        '/objects/0/spec/locales/fr: at most 2048 message keys may be listed per locale',
      );
    });

    test('accepts a 256 character key', () => {
      expect(() => validateFrontEndCrd(setLocales({ fr: { [repeat('k', 256)]: 'x' } }))).not.toThrow();
    });

    test('rejects a 257 character key', () => {
      expect(() => validateFrontEndCrd(setLocales({ fr: { [repeat('k', 257)]: 'x' } }))).toThrowError('message keys must be at most 256 characters');
    });

    test('accepts a 4096 character value', () => {
      expect(() => validateFrontEndCrd(setLocales({ fr: { 'a.b': repeat('é', 4096) } }))).not.toThrow();
    });

    test('rejects a 4097 character value', () => {
      expect(() => validateFrontEndCrd(setLocales({ fr: { 'a.b': repeat('é', 4097) } }))).toThrowError(
        '/objects/0/spec/locales/fr/a.b: message values must be at most 4096 characters',
      );
    });
  });

  test('should reject unknown Frontend spec fields', () => {
    const crd = cloneDeep(crdBase) as FrontendCRD;
    Object.assign(crd.objects[0].spec, { unknownField: true });

    expect(() => validateFrontEndCrd(crd)).toThrowError('must NOT have additional properties');
  });

  test('should only allow one frontend.paths entry', () => {
    // Arrange - Setup test data (mocks already configured in beforeEach)
    const crd = cloneDeep(crdBase) as FrontendCRD;
    crd.objects[0].spec.frontend.paths = ['/foo/bar', '/baz'];

    // Act & Assert - Execute the function under test and verify error behavior
    expect(() => validateFrontEndCrd(crd)).toThrowError(`must NOT have more than 1 items`);
  });
});
