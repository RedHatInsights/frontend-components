import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { riskOfChangeFormatters } from './messages';
import React from 'react';
import { Shield } from '@redhat-cloud-services/frontend-components/Shield';
import { riskOfChange } from '../RuleTable/constants';
import messages from '../messages';

export default (
  { onChange, value, intl: providedIntl, ...props } = {
    onChange: () => undefined,
  },
) => {
  const intl = getIntlWithFallback(providedIntl);
  return {
    ...props,
    label: intl.formatMessage(messages.filtersRiskOfChangeLabel),
    value: 'risk_of_change',
    type: 'checkbox',
    filterValues: {
      value,
      onChange,
      items: Object.entries(riskOfChange)
        .map(([key], index) => ({
          label: (
            <span>
              <Shield impact={index + 1} hasTooltip={false} size="sm" />
              {riskOfChangeFormatters[key](intl)}
            </span>
          ),
          textual: riskOfChangeFormatters[key](intl),
          value: key,
        }))
        .reverse(),
    },
  };
};
