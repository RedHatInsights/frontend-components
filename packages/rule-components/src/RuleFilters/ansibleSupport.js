import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { ansibleSupportFormatters } from './messages';
import { ansibleSupport } from '../RuleTable/constants';
import messages from '../messages';

export default (
  { onChange, value, intl: providedIntl, ...props } = {
    onChange: () => undefined,
  },
) => {
  const intl = getIntlWithFallback(providedIntl);
  return {
    ...props,
    label: intl.formatMessage(messages.filtersAnsibleSupportLabel),
    value: 'ansible_support',
    type: 'checkbox',
    filterValues: {
      value,
      onChange,
      items: Object.entries(ansibleSupport).map(([key]) => ({
        label: ansibleSupportFormatters[key](intl),
        textual: ansibleSupportFormatters[key](intl),
        value: key,
      })),
    },
  };
};
