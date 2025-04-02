import { FrontendCRD } from './feo-types';
import widgetRegistryInterceptor from './widget-registry-interceptor';

describe('Widget registry interceptor', () => {
  it('should replace the widget registry with the one from the server', () => {
    const frontendName = 'name';
    const widgetEntries = [
      { module: 'module1', scope: 'scope1', frontendRef: frontendName },
      { module: 'module1', scope: 'scope2', frontendRef: frontendName },
      { module: 'module2', scope: 'scope1', frontendRef: 'foo' },
    ];
    const frontendCrd: FrontendCRD = {
      objects: [
        {
          metadata: {
            name: 'name',
          },
          spec: {
            frontend: {
              paths: ['/'],
            },
            module: {
              manifestLocation: 'location',
            },
            widgetRegistry: [{ module: 'module1', scope: 'scope1', frontendRef: frontendName }],
          },
        },
      ],
    };

    const result = widgetRegistryInterceptor(widgetEntries, frontendCrd);

    expect(result).toEqual([
      { module: 'module2', scope: 'scope1', frontendRef: 'foo' },
      { module: 'module1', scope: 'scope1', frontendRef: frontendName },
    ]);
  });
});
