import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { ruleStatusFormatters } from './messages';
import { ruleStatus } from '../RuleTable/constants';
import messages from '../messages';

export default (
  { onChange, value, intl: providedIntl, ...props } = {
    onChange: () => undefined,
  },
) => {
  const intl = getIntlWithFallback(providedIntl);
  return {
    ...props,
    label: intl.formatMessage(messages.filtersRuleStatusLabel),
    value: 'rule_status',
    type: 'radio',
    filterValues: {
      value,
      onChange,
      items: Object.entries(ruleStatus).map(([key]) => ({
        label: ruleStatusFormatters[key](intl),
        textual: ruleStatusFormatters[key](intl),
        value: key,
      })),
    },
  };
};
