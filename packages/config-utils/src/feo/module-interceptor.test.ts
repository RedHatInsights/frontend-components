import { ChromeModule, ChromeModuleRegistry, FrontendCRD } from './feo-types';
import moduleInterceptor from './module-interceptor';

describe('module-interceptor', () => {
  it('should replace existing entry in moduleRegistry with new entry', () => {
    const moduleName = 'module-name';
    const newEntry: ChromeModule = {
      manifestLocation: 'new-location',
    };
    const frontendCRD: FrontendCRD = {
      objects: [
        {
          metadata: {
            name: moduleName,
          },
          spec: {
            frontend: {
              paths: ['/'],
            },
            module: newEntry,
          },
        },
      ],
    };
    const remoteModuleRegistry: ChromeModuleRegistry = {
      [moduleName]: {
        manifestLocation: 'old-location',
      },
    };
    const expectedResult: ChromeModuleRegistry = {
      [moduleName]: newEntry,
    };

    const result = moduleInterceptor(remoteModuleRegistry, frontendCRD);
    expect(result).toEqual(expectedResult);
  });

  it('should add new entry to moduleRegistry', () => {
    const moduleName = 'module-name';
    const newEntry: ChromeModule = {
      manifestLocation: 'new-location',
    };
    const frontendCRD: FrontendCRD = {
      objects: [
        {
          metadata: {
            name: moduleName,
          },
          spec: {
            frontend: {
              paths: ['/'],
            },
            module: newEntry,
          },
        },
      ],
    };
    const remoteModuleRegistry: ChromeModuleRegistry = {};

    const expectedResult: ChromeModuleRegistry = {
      [moduleName]: newEntry,
    };

    const result = moduleInterceptor(remoteModuleRegistry, frontendCRD);
    expect(result).toEqual(expectedResult);
  });
});
