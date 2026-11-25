import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import messages from '../messages';

export default ({ onChange, value, intl: providedIntl, ...props } = { onChange: () => undefined }) => {
  const intl = getIntlWithFallback(providedIntl);
  return {
    ...props,
    label: intl.formatMessage(messages.filtersDescriptionLabel),
    value: 'description',
    filterValues: {
      'aria-label': intl.formatMessage(messages.filtersDescriptionInput),
      value,
      onChange,
    },
  };
};
