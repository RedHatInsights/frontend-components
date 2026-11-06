// Keep imports dynamic: missing deliveries fall back to English without creating
// placeholder translations. Individual catalog files are copied into npm builds.
const loadCatalog = (locale) => import(/* webpackChunkName: "messages-[request]" */ `./locales/${locale}.json`, { with: { type: 'json' } });

export const messageCatalogs = {
  en: () => loadCatalog('translations'),
  fr: () => loadCatalog('fr'),
  ko: () => loadCatalog('ko'),
  ja: () => loadCatalog('ja'),
  'zh-CN': () => loadCatalog('zh-CN'),
};
