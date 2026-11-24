import getLocaleMessages from './getLocaleMessages';

const ast = [{ type: 0, value: 'Français' }];

describe('caller message catalogs', () => {
  test.each([
    ['exact locale', { fr: { label: 'base' }, 'fr-CA': { label: 'exact' } }, 'fr-CA', { label: 'exact' }],
    ['base language', { fr: { label: 'base' } }, 'fr-CA', { label: 'base' }],
    ['case and separator', { zh_CN: { label: '中文' } }, 'zh-cn', { label: '中文' }],
    ['compiled catalog', { fr: { label: ast } }, 'fr', { label: ast }],
    ['empty exact catalog', { fr: { label: 'base' }, 'fr-CA': {} }, 'fr-CA', {}],
    ['unmatched catalog', { en: { label: 'Hello' } }, 'fr', undefined],
    ['unmatched compiled catalog', { en: { label: ast } }, 'fr', undefined],
    ['unmatched empty catalog', { en: {} }, 'fr', undefined],
    ['flat strings', { label: 'caller' }, 'fr', { label: 'caller' }],
    ['flat locale-like ID', { fr: 'Français', label: 'caller' }, 'fr', { fr: 'Français', label: 'caller' }],
    ['flat compiled locale-like ID', { fr: ast, label: ast }, 'fr', { fr: ast, label: ast }],
    ['empty map', {}, 'fr', {}],
    ['no messages', undefined, 'fr', undefined],
  ])('%s', (_name, messages, locale, expected) => {
    expect(getLocaleMessages(messages, locale)).toEqual(expected);
  });
});
