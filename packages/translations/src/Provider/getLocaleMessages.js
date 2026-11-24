const isCatalog = (value) => value && typeof value === 'object' && !Array.isArray(value);

/** Resolve locale-keyed caller catalogs without treating their keys as message IDs. */
const getLocaleMessages = (messages, locale) => {
  if (!messages) return undefined;
  const normalizedLocale = locale.replace(/_/g, '-').toLowerCase();
  const keys = Object.keys(messages);
  const key =
    keys.find((candidate) => candidate.replace(/_/g, '-').toLowerCase() === normalizedLocale) ||
    keys.find((candidate) => candidate.toLowerCase() === normalizedLocale.split('-')[0]);
  if (key && isCatalog(messages[key])) return messages[key];
  // Flat React Intl messages are strings or compiled AST arrays, never catalog objects.
  return Object.values(messages).some(isCatalog) ? undefined : messages;
};

export default getLocaleMessages;
