import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { impactFormatters } from './messages';
import { impact } from '../RuleTable/constants';
import messages from '../messages';

export default (
  { onChange, value, intl: providedIntl, ...props } = {
    onChange: () => undefined,
  },
) => {
  const intl = getIntlWithFallback(providedIntl);
  return {
    ...props,
    label: intl.formatMessage(messages.filtersLikelihoodLabel),
    value: 'likelihood',
    type: 'checkbox',
    filterValues: {
      value,
      onChange,
      items: Object.entries(impact).map(([key]) => ({
        label: impactFormatters[key](intl),
        textual: impactFormatters[key](intl),
        value: key,
      })),
    },
  };
};
