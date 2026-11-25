import descriptors from '../../../../i18n/translation-template.json';

// Deliberate test markers, not translations or a production/Phrase catalog.
// Keeping ICU and rich-text syntax exercises the real message contracts.
export const syntheticCatalog = (locale: string) =>
  Object.fromEntries(Object.entries(descriptors).map(([id, message]) => [id, `[${locale}:${id}] ${message.defaultMessage}`]));
