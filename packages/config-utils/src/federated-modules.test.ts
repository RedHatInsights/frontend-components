import { createIncludes, createSharedDeps, applyImpliedDeps, mergeSharedDeps, default as federatedModules } from './federated-modules';
import { DynamicRemotePlugin, WebpackSharedConfig } from '@openshift/dynamic-plugin-sdk-webpack';

jest.mock('@openshift/dynamic-plugin-sdk-webpack', () => ({
  DynamicRemotePlugin: jest.fn(),
}));

const getSharedModules = () =>
  (DynamicRemotePlugin as jest.Mock).mock.calls[0][0].sharedModules;

describe('createIncludes', () => {
  describe('chromeProvided', () => {
    it('includes react as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['react']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes react-dom as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['react-dom']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes react/jsx-runtime as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['react/jsx-runtime']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes react/jsx-dev-runtime as a singleton without import: false', () => {
      expect(createIncludes().chromeProvided['react/jsx-dev-runtime']).toEqual({ singleton: true, eager: false });
    });

    it('includes react-intl as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['react-intl']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes react-router-dom as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['react-router-dom']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes @openshift/dynamic-plugin-sdk as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['@openshift/dynamic-plugin-sdk']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes @patternfly/quickstarts as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['@patternfly/quickstarts']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes @redhat-cloud-services/chrome as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['@redhat-cloud-services/chrome']).toEqual({ singleton: true, import: false });
    });

    it('includes @scalprum/core as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['@scalprum/core']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes @scalprum/react-core as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['@scalprum/react-core']).toEqual({ singleton: true, eager: false, import: false });
    });

    it('includes @unleash/proxy-client-react as a singleton with import: false', () => {
      expect(createIncludes().chromeProvided['@unleash/proxy-client-react']).toEqual({ singleton: true, eager: false, import: false });
    });
  });

  describe('defaultShared', () => {
    it('includes axios with default sharing config', () => {
      expect(createIncludes().defaultShared['axios']).toEqual({});
    });

    it('includes lodash with default sharing config', () => {
      expect(createIncludes().defaultShared['lodash']).toEqual({});
    });
  });

  describe('impliedDeps', () => {
    it('maps @redhat-cloud-services/frontend-components to both scalprum packages', () => {
      const { impliedDeps } = createIncludes();
      expect(impliedDeps['@redhat-cloud-services/frontend-components']).toEqual(['@scalprum/core', '@scalprum/react-core']);
    });

    it('only references modules that exist in chromeProvided', () => {
      const { impliedDeps, chromeProvided } = createIncludes();
      for (const targets of Object.values(impliedDeps)) {
        for (const target of targets) {
          expect(chromeProvided).toHaveProperty(target);
        }
      }
    });
  });

  it('chromeProvided and defaultShared do not share any keys', () => {
    const { chromeProvided, defaultShared } = createIncludes();
    const overlap = Object.keys(chromeProvided).filter((key) => key in defaultShared);
    expect(overlap).toEqual([]);
  });
});

describe('federatedModules', () => {
  const root = '/fake/root';
  const moduleName = 'testApp';

  beforeEach(() => {
    (DynamicRemotePlugin as jest.Mock).mockClear();
  });

  it('includes react as a shared dep with requiredVersion from dependencies', () => {
    federatedModules({ root, moduleName, dependencies: { react: '^18.3.1' } });
    expect(getSharedModules()).toMatchObject({ react: { requiredVersion: '^18.3.1', singleton: true } });
  });

  it('includes react/jsx-runtime with requiredVersion resolved from react in dependencies', () => {
    federatedModules({ root, moduleName, dependencies: { react: '^18.3.1' } });
    expect(getSharedModules()).toMatchObject({ 'react/jsx-runtime': { requiredVersion: '^18.3.1', singleton: true, import: false } });
  });

  it('includes react/jsx-dev-runtime with requiredVersion resolved from react in dependencies', () => {
    federatedModules({ root, moduleName, dependencies: { react: '^18.3.1' } });
    expect(getSharedModules()).toMatchObject({ 'react/jsx-dev-runtime': { requiredVersion: '^18.3.1', singleton: true } });
  });

  it('excludes packages not present in dependencies', () => {
    federatedModules({ root, moduleName, dependencies: { react: '^18.3.1' } });
    expect(getSharedModules()['react-dom']).toBeUndefined();
  });

  it('excludes packages listed in exclude', () => {
    federatedModules({ root, moduleName, dependencies: { react: '^18.3.1', lodash: '^4.17.21' }, exclude: ['lodash'] });
    expect(getSharedModules()['lodash']).toBeUndefined();
  });

  it('cannot exclude chrome-provided modules', () => {
    federatedModules({ root, moduleName, dependencies: { react: '^18.3.1' }, exclude: ['react'] });
    expect(getSharedModules()['react']).toMatchObject({ singleton: true, import: false });
  });

  it('merges tenant shared entries on top of defaults', () => {
    federatedModules({ root, moduleName, dependencies: { react: '^18.3.1' }, shared: [{ 'my-lib': { singleton: true, version: '^1.0.0' } }] });
    expect(getSharedModules()['my-lib']).toMatchObject({ singleton: true, version: '^1.0.0' });
  });

  it('ignores chrome-provided modules in shared[] and keeps auto-generated config', () => {
    federatedModules({ root, moduleName, dependencies: { react: '^18.3.1' }, shared: [{ react: { version: '^19.0.0', singleton: false, eager: true } }] });
    expect(getSharedModules()['react']).toMatchObject({ singleton: true, eager: false, import: false, requiredVersion: '^18.3.1' });
  });

  it('throws when a tenant shared entry is missing version', () => {
    expect(() =>
      federatedModules({ root, moduleName, dependencies: { react: '^18.3.1' }, shared: [{ 'my-lib': { singleton: true } }] })
    ).toThrow('Some of your shared dependencies do not have version specified');
  });

  it('adds @scalprum/react-core and @scalprum/core implicitly when @redhat-cloud-services/frontend-components is in deps', () => {
    federatedModules({ root, moduleName, dependencies: { '@redhat-cloud-services/frontend-components': '^5.0.0' } });
    expect(getSharedModules()['@scalprum/react-core']).toMatchObject({ singleton: true, requiredVersion: '*' });
    expect(getSharedModules()['@scalprum/core']).toMatchObject({ singleton: true, requiredVersion: '*' });
  });

  it('includes @scalprum/react-core but not @scalprum/core when only react-core is in deps', () => {
    federatedModules({ root, moduleName, dependencies: { '@scalprum/react-core': '^1.0.0' } });
    expect(getSharedModules()['@scalprum/react-core']).toMatchObject({ singleton: true, requiredVersion: '^1.0.0' });
    expect(getSharedModules()['@scalprum/core']).toBeUndefined();
  });

  it('adds @unleash/proxy-client-react implicitly when present in deps', () => {
    federatedModules({ root, moduleName, dependencies: { '@unleash/proxy-client-react': '^1.0.0' } });
    expect(getSharedModules()['@unleash/proxy-client-react']).toMatchObject({ singleton: true, requiredVersion: '^1.0.0' });
  });

  it('ignores @unleash/proxy-client-react in shared[] since it is chrome-provided, uses auto-generated config', () => {
    federatedModules({
      root,
      moduleName,
      dependencies: { '@unleash/proxy-client-react': '^1.0.0' },
      shared: [{ '@unleash/proxy-client-react': { singleton: true, version: '^2.0.0' } }],
    });
    expect(getSharedModules()['@unleash/proxy-client-react']).toMatchObject({ singleton: true, requiredVersion: '^1.0.0' });
  });
});

describe('mergeSharedDeps', () => {
  const { chromeProvided } = createIncludes();
  const base: Record<string, WebpackSharedConfig> = {
    react: { singleton: true, eager: false, import: false, requiredVersion: '^18.3.1' },
  };

  it('merges tenant shared entries on top of defaults', () => {
    const result = mergeSharedDeps(base, [{ 'my-lib': { singleton: true, version: '^1.0.0' } }], chromeProvided);
    expect(result['my-lib']).toMatchObject({ singleton: true, version: '^1.0.0' });
    expect(result['react']).toBeDefined();
  });

  it('allows tenant entries to override tenant-controlled keys', () => {
    const baseWithAxios: Record<string, WebpackSharedConfig> = {
      ...base,
      axios: { requiredVersion: '^1.0.0' },
    };
    const result = mergeSharedDeps(baseWithAxios, [{ axios: { version: '^2.0.0', singleton: true } }], chromeProvided);
    expect(result['axios']).toMatchObject({ singleton: true, version: '^2.0.0' });
  });

  it('throws when a tenant shared entry is missing version', () => {
    expect(() =>
      mergeSharedDeps(base, [{ 'my-lib': { singleton: true } }], chromeProvided)
    ).toThrow('Some of your shared dependencies do not have version specified');
  });

  it('throws when a tenant shared entry has requiredVersion but not version', () => {
    expect(() =>
      mergeSharedDeps(base, [{ 'my-lib': { singleton: true, requiredVersion: '^1.0.0' } }], chromeProvided)
    ).toThrow('Some of your shared dependencies do not have version specified');
  });

  it('accepts tenant shared entry when version is set', () => {
    const result = mergeSharedDeps(base, [{ 'my-lib': { singleton: true, version: '^1.0.0' } }], chromeProvided);
    expect(result['my-lib']).toMatchObject({ singleton: true, version: '^1.0.0' });
  });

  it('includes the names of offending modules in the error message', () => {
    expect(() =>
      mergeSharedDeps(base, [{ 'my-lib': { singleton: true }, 'other-lib': { singleton: true } }], chromeProvided)
    ).toThrow('my-lib');
  });

  it('returns base unchanged when shared array is empty', () => {
    const result = mergeSharedDeps(base, [], chromeProvided);
    expect(result).toEqual(base);
  });

  it('does not mutate the base sharedDeps argument', () => {
    const frozen = Object.freeze({ react: { singleton: true, requiredVersion: '^18.3.1' } }) as Record<string, WebpackSharedConfig>;
    expect(() => mergeSharedDeps(frozen, [{ 'my-lib': { singleton: true, version: '^1.0.0' } }], chromeProvided)).not.toThrow();
    expect(frozen['react']).toEqual({ singleton: true, requiredVersion: '^18.3.1' });
  });

  it('ignores chrome-provided modules in shared[] entirely, preserving auto-generated config', () => {
    const result = mergeSharedDeps(
      base,
      [{ react: { version: '^19.0.0', singleton: false, eager: true } }],
      chromeProvided
    );
    expect(result['react']).toEqual(base['react']);
  });

  it('warns when a chrome-provided module is found in shared[]', () => {
    const logger = jest.fn();
    mergeSharedDeps(base, [{ react: { version: '^19.0.0' } }], chromeProvided, logger);
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('"react"'));
  });

  it('only ignores chrome-provided entries, merges non-chrome entries in the same dep object', () => {
    const logger = jest.fn();
    const result = mergeSharedDeps(
      base,
      [{ react: { version: '^19.0.0' }, zustand: { singleton: true, version: '^4.0.0' } }],
      chromeProvided,
      logger
    );
    expect(result['react']).toEqual(base['react']);
    expect(result['zustand']).toMatchObject({ singleton: true, version: '^4.0.0' });
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('"react"'));
  });
});

describe('createSharedDeps', () => {
  const { chromeProvided, defaultShared } = createIncludes();
  const allIncludes = () => ({ ...chromeProvided, ...defaultShared });

  it('includes packages present in dependencies with requiredVersion from dependencies', () => {
    const result = createSharedDeps(allIncludes(), { react: '^18.3.1', 'react-dom': '^18.3.1', lodash: '^4.17.21' }, []);
    expect(result['react']).toEqual({ singleton: true, eager: false, import: false, requiredVersion: '^18.3.1' });
    expect(result['react-dom']).toEqual({ singleton: true, eager: false, import: false, requiredVersion: '^18.3.1' });
    expect(result['lodash']).toEqual({ requiredVersion: '^4.17.21' });
  });

  it('excludes packages absent from dependencies', () => {
    const result = createSharedDeps(allIncludes(), { react: '^18.3.1' }, []);
    expect(result['react-dom']).toBeUndefined();
    expect(result['lodash']).toBeUndefined();
  });

  it('excludes packages listed in exclude even if present in dependencies', () => {
    const result = createSharedDeps(allIncludes(), { react: '^18.3.1', lodash: '^4.17.21' }, ['lodash']);
    expect(result['lodash']).toBeUndefined();
    expect(result['react']).toBeDefined();
  });

  it('resolves requiredVersion for unscoped subpath packages from root package in dependencies', () => {
    const result = createSharedDeps(allIncludes(), { react: '^18.3.1' }, []);
    expect(result['react/jsx-runtime']).toEqual({ singleton: true, eager: false, import: false, requiredVersion: '^18.3.1' });
    expect(result['react/jsx-dev-runtime']).toEqual({ singleton: true, eager: false, requiredVersion: '^18.3.1' });
  });

  it('excludes subpath packages when their root package is absent from dependencies', () => {
    const result = createSharedDeps(allIncludes(), { lodash: '^4.17.21' }, []);
    expect(result['react/jsx-runtime']).toBeUndefined();
    expect(result['react/jsx-dev-runtime']).toBeUndefined();
  });

  it('does not mutate the include argument', () => {
    const include = allIncludes();
    createSharedDeps(include, { react: '^18.3.1' }, []);
    expect(include['react']).toEqual({ singleton: true, eager: false, import: false });
  });
});

describe('applyImpliedDeps', () => {
  const { chromeProvided, defaultShared, impliedDeps } = createIncludes();
  const include = { ...chromeProvided, ...defaultShared };

  it('adds implied deps with requiredVersion * when trigger package is in dependencies', () => {
    const sharedDeps = createSharedDeps(include, { '@redhat-cloud-services/frontend-components': '^5.0.0' }, []);
    const result = applyImpliedDeps(sharedDeps, include, { '@redhat-cloud-services/frontend-components': '^5.0.0' }, impliedDeps);
    expect(result['@scalprum/core']).toEqual({ singleton: true, eager: false, import: false, requiredVersion: '*' });
    expect(result['@scalprum/react-core']).toEqual({ singleton: true, eager: false, import: false, requiredVersion: '*' });
  });

  it('does not add implied deps when trigger package is absent from dependencies', () => {
    const sharedDeps = createSharedDeps(include, { react: '^18.3.1' }, []);
    const result = applyImpliedDeps(sharedDeps, include, { react: '^18.3.1' }, impliedDeps);
    expect(result['@scalprum/core']).toBeUndefined();
    expect(result['@scalprum/react-core']).toBeUndefined();
  });

  it('uses direct dep version over implied wildcard when both trigger and target are in dependencies', () => {
    const deps = { '@redhat-cloud-services/frontend-components': '^5.0.0', '@scalprum/core': '^2.0.0' };
    const sharedDeps = createSharedDeps(include, deps, []);
    const result = applyImpliedDeps(sharedDeps, include, deps, impliedDeps);
    expect(result['@scalprum/core']).toMatchObject({ requiredVersion: '^2.0.0' });
  });

  it('does not mutate the sharedDeps argument', () => {
    const sharedDeps = Object.freeze(createSharedDeps(include, { react: '^18.3.1' }, [])) as Record<string, WebpackSharedConfig>;
    const deps = { react: '^18.3.1', '@redhat-cloud-services/frontend-components': '^5.0.0' };
    expect(() => applyImpliedDeps(sharedDeps, include, deps, impliedDeps)).not.toThrow();
  });
});
