import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { severityFormatters } from './messages';
import { severity } from '../RuleTable/constants';
import messages from '../messages';

export default (
  { onChange, value, intl: providedIntl, ...props } = {
    onChange: () => undefined,
  },
) => {
  const intl = getIntlWithFallback(providedIntl);
  return {
    ...props,
    label: intl.formatMessage(messages.filtersTotalRiskLabel),
    value: 'total_risk',
    type: 'checkbox',
    filterValues: {
      value,
      onChange,
      items: Object.entries(severity).map(([key]) => ({
        label: severityFormatters[key](intl),
        textual: severityFormatters[key](intl),
        value: key,
      })),
    },
  };
};
