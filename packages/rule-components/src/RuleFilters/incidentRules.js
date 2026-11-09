import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { incidentRulesFormatters } from './messages';
import { incidentRules } from '../RuleTable/constants';
import messages from '../messages';

export default (
  { onChange, value, intl: providedIntl, ...props } = {
    onChange: () => undefined,
  },
) => {
  const intl = getIntlWithFallback(providedIntl);
  return {
    ...props,
    label: intl.formatMessage(messages.filtersIncidentRulesLabel),
    value: 'incident_rules',
    type: 'checkbox',
    filterValues: {
      value,
      onChange,
      items: Object.entries(incidentRules).map(([key]) => ({
        label: incidentRulesFormatters[key](intl),
        textual: incidentRulesFormatters[key](intl),
        value: key,
      })),
    },
  };
};
