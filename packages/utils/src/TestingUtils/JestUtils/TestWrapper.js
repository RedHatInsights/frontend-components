import React from 'react';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

const mockStore = configureStore();

const TestWrapper = ({ children, routerProps = { initialEntries: ['/'] }, componentPath, store = mockStore() }) => (
  <IntlProvider locale="en">
    <Provider store={store}>
      <MemoryRouter {...routerProps}>
        {componentPath ? (
          <Routes>
            <Route path={componentPath || '/'}>{children}</Route>
          </Routes>
        ) : (
          children
        )}
      </MemoryRouter>
    </Provider>
  </IntlProvider>
);

TestWrapper.propTypes = {
  children: PropTypes.element,
  routerProps: PropTypes.shape({
    initialEntries: PropTypes.array,
  }),
  componentPath: PropTypes.string,
  store: PropTypes.object,
};

export default TestWrapper;
