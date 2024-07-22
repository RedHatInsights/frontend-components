import React from 'react';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

const TestWrapper = ({ renderOptions = {}, children }) => {
  const mockStore = configureStore();

  return (
    <IntlProvider locale="en">
      <Provider store={renderOptions?.store || mockStore()}>
        <MemoryRouter initialEntries={renderOptions?.initialEntries || ['/']}>
          {renderOptions?.componentPath ? (
            <Routes>
              <Route path={renderOptions?.elementPath || '/'}>{children}</Route>
            </Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );
};

TestWrapper.propTypes = {
  children: PropTypes.element,
  renderOptions: PropTypes.object,
};

export default TestWrapper;
