import { messageCatalogs } from './messageCatalogs';

// Exercise the real dynamic import, not the provider's mocked loading seam.
describe('per-locale imports', () => {
  test('registers supported locales without requiring pending target deliveries', () => {
    expect(Object.keys(messageCatalogs).sort()).toEqual(['en', 'fr', 'ja', 'ko', 'zh-CN']);
    for (const loader of Object.values(messageCatalogs)) expect(typeof loader).toBe('function');
  });

  test('loads the actual English catalog as an import namespace', async () => {
    const catalog = await messageCatalogs.en();
    expect(catalog.default).toEqual(require('./locales/translations.json'));
    expect(catalog.default['default.save']).toBeDefined();
  });
});
