import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Reducer } from 'redux';

import Routes from './Routes';
import './App.scss';

import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

type Unregister = (() => void) | undefined;

const App = () => {
  const history = useHistory();
  const chrome = useChrome();

  useEffect(() => {
    let unregister: Unregister;
    if (chrome) {
      const registry = getRegistry();
      registry.register({ notifications: notificationsReducer as Reducer });
      const { on } = chrome.init();

      unregister = on('APP_NAVIGATION', (event) => history.push(`/${event.navId}`));
    }
    return () => {
      unregister?.();
    };
  }, [chrome]);

  return (
    <Fragment>
      <NotificationsPortal />
      <Routes />
    </Fragment>
  );
};

export default App;
