import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';

const store = createStore((state) => state, ['Use Redux']);

const AppEntry = () => (
  <Provider store={store}>
    <BrowserRouter basename={getBaseName(window.location.pathname)}>
      <App />
    </BrowserRouter>
  </Provider>
);

export default AppEntry;
