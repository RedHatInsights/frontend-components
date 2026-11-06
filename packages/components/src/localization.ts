import type { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import messages from './messages';

type LibraryIntl = ReturnType<typeof getIntlWithFallback>;

export const severityFormatters = {
  Critical: (intl: LibraryIntl) => intl.formatMessage(messages.severityCritical),
  High: (intl: LibraryIntl) => intl.formatMessage(messages.severityHigh),
  Important: (intl: LibraryIntl) => intl.formatMessage(messages.severityImportant),
  Medium: (intl: LibraryIntl) => intl.formatMessage(messages.severityMedium),
  Moderate: (intl: LibraryIntl) => intl.formatMessage(messages.severityModerate),
  Low: (intl: LibraryIntl) => intl.formatMessage(messages.severityLow),
  Unknown: (intl: LibraryIntl) => intl.formatMessage(messages.severityUnknown),
};
const shieldFormatters = {
  critical: (intl: LibraryIntl) => intl.formatMessage(messages.shieldCriticalDescription),
  important: (intl: LibraryIntl) => intl.formatMessage(messages.shieldImportantDescription),
  moderate: (intl: LibraryIntl) => intl.formatMessage(messages.shieldModerateDescription),
  low: (intl: LibraryIntl) => intl.formatMessage(messages.shieldLowDescription),
  unknown: (intl: LibraryIntl) => intl.formatMessage(messages.shieldUnknownDescription),
};
export const impactFormatters = {
  Critical: shieldFormatters.critical,
  4: shieldFormatters.critical,
  High: shieldFormatters.important,
  Important: shieldFormatters.important,
  3: shieldFormatters.important,
  Medium: shieldFormatters.moderate,
  Moderate: shieldFormatters.moderate,
  2: shieldFormatters.moderate,
  Low: shieldFormatters.low,
  1: shieldFormatters.low,
  Unknown: shieldFormatters.unknown,
};
