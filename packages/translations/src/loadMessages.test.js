import { loadMessages } from './loadMessages';

// Exercise the real dynamic import against stand-in deliveries; production
// catalogs arrive from Phrase and are not committed as fixtures.
jest.mock('./locales/fr.json', () => ({ 'default.save': 'Enregistrer' }), { virtual: true });
jest.mock('./locales/pt.json', () => ({ 'default.save': 'Salvar (pt)' }), { virtual: true });
jest.mock('./locales/pt-BR.json', () => ({ 'default.save': 'Salvar (pt-BR)' }), { virtual: true });
jest.mock('./locales/zh-CN.json', () => ({ 'default.save': '保存' }), { virtual: true });
jest.mock('./locales/en.json', () => ({ 'default.save': 'must not load' }), { virtual: true });
jest.mock('./locales/en-US.json', () => ({ 'default.save': 'must not load' }), { virtual: true });

describe('loadMessages', () => {
  test('loads a delivered locale file', async () => {
    await expect(loadMessages('fr')).resolves.toEqual({ 'default.save': 'Enregistrer' });
  });

  test.each(['zh-CN', 'zh-cn'])('canonicalizes %s to the delivered file name', async (locale) => {
    await expect(loadMessages(locale)).resolves.toEqual({ 'default.save': '保存' });
  });

  test('prefers the exact regional file over the base language', async () => {
    await expect(loadMessages('pt-BR')).resolves.toEqual({ 'default.save': 'Salvar (pt-BR)' });
  });

  test.each([
    ['fr-CA', 'Enregistrer'],
    ['pt-PT', 'Salvar (pt)'],
  ])('falls back from %s to its base language', async (locale, expected) => {
    await expect(loadMessages(locale)).resolves.toEqual({ 'default.save': expected });
  });

  test.each(['en', 'en-US', 'EN-gb'])('loads nothing for English variant %s', async (locale) => {
    await expect(loadMessages(locale)).resolves.toBeUndefined();
  });

  test.each(['de', 'zh-TW'])('resolves undefined for undelivered %s', async (locale) => {
    await expect(loadMessages(locale)).resolves.toBeUndefined();
  });

  test.each(['', '../package', 'not a locale'])('rejects malformed tag %j without importing', async (locale) => {
    await expect(loadMessages(locale)).resolves.toBeUndefined();
  });
});
