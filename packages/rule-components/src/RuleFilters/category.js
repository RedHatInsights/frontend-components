import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { categoryFormatters } from './messages';
import { category } from '../RuleTable/constants';
import messages from '../messages';

export default (
  { onChange, value, intl: providedIntl, ...props } = {
    onChange: () => undefined,
  },
) => {
  const intl = getIntlWithFallback(providedIntl);
  return {
    ...props,
    label: intl.formatMessage(messages.filtersCategoryLabel),
    value: 'category',
    type: 'checkbox',
    filterValues: {
      value,
      onChange,
      items: Object.entries(category).map(([key]) => ({
        label: categoryFormatters[key](intl),
        textual: categoryFormatters[key](intl),
        value: key,
      })),
    },
  };
};
