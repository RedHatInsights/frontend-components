import { FormattedMessage } from '@redhat-cloud-services/frontend-components-translations/localization';
import React, { useEffect } from 'react';
import messages from '../messages';

export interface RemediationLoadErrorProps {
  component?: string;
}

const RemediationLoadError = ({ component, ...props }: RemediationLoadErrorProps) => {
  useEffect(() => {
    console.error(`Unable to load remediations component. Failed to load ${component}.`, props);
  }, [component, props]);
  return (
    <div>
      <h1>
        <FormattedMessage {...messages.remediationLoadErrorUnableToLoadRemediationsComponent} />
      </h1>
      <h2>
        <FormattedMessage {...messages.remediationLoadErrorFailedToLoad} values={{ component }} />
      </h2>
      <code>
        <FormattedMessage {...messages.remediationLoadErrorMoreInfoCanBeFoundInBrowserConsoleOutput} />
      </code>
    </div>
  );
};

export default RemediationLoadError;
