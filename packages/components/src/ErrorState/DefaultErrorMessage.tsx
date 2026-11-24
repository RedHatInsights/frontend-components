import { FormattedMessage } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import messages from '../messages';

const DefaultErrorMessage = () => {
  const redirectLink = 'https://access.redhat.com/support';
  const statusLink = 'https://status.redhat.com';

  return (
    <FormattedMessage
      {...messages.defaultErrorMessageSupport}

      values={{ support: (chunks) => <a href={redirectLink}>{chunks}</a>, status: (chunks) => <a href={statusLink}>{chunks}</a> }}
    />
  );
};

export default DefaultErrorMessage;
