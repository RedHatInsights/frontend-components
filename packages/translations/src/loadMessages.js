// Phrase delivers translations as locales/<locale>.json. English is not a catalog:
// it renders from each descriptor's defaultMessage, so English locales load nothing.
// The template path lets bundlers split one chunk per delivered file without a list
// of supported locales; a locale with no file rejects and falls back to English.
const importCatalog = (locale) => import(/* webpackChunkName: "messages-[request]" */ `./locales/${locale}.json`, { with: { type: 'json' } });

/**
 * Load the delivered catalog for a locale, trying the exact tag before its base language.
 * @param {string} locale BCP 47 tag, e.g. `fr-CA` or `zh-CN`
 * @returns {Promise<Record<string, string> | undefined>} `undefined` means render English defaults
 */
export const loadMessages = async (locale) => {
  let canonical;
  try {
    // Rejects malformed tags (including path segments) and matches file-name casing: zh-cn -> zh-CN.
    [canonical] = Intl.getCanonicalLocales(locale);
  } catch {
    return undefined;
  }
  if (!canonical) return undefined;
  const [language] = canonical.split('-');
  if (language === 'en') return undefined;
  for (const candidate of canonical === language ? [language] : [canonical, language]) {
    try {
      return (await importCatalog(candidate)).default;
    } catch {
      // Not delivered (or failed to load): try the base language, then English.
    }
  }
  return undefined;
};
