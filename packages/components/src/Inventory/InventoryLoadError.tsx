import { FormattedMessage } from '@redhat-cloud-services/frontend-components-translations/localization';
import React, { useEffect } from 'react';
import messages from '../messages';

export interface InventoryLoadErrorProps {
  component?: string;
}

const InventoryLoadError = ({ component, ...props }: InventoryLoadErrorProps) => {
  useEffect(() => {
    console.error(`Unable to load inventory component. Failed to load ${component}.`, props);
  }, []);
  return (
    <div>
      <h1>
        <FormattedMessage {...messages.inventoryLoadErrorUnableToLoadInventoryComponent} />
      </h1>
      <h2>
        <FormattedMessage {...messages.inventoryLoadErrorFailedToLoad} values={{ component }} />
      </h2>
      <code>
        <FormattedMessage {...messages.inventoryLoadErrorMoreInfoCanBeFoundInBrowserConsoleOutput} />
      </code>
    </div>
  );
};

export default InventoryLoadError;
