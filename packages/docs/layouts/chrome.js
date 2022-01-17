import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { H1 } from '../components/layout/mdx-provider-components';

const ChromeLayout = ({ children }) => (
  <Fragment>
    <H1>Chrome</H1>
    {children}
  </Fragment>
);

ChromeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChromeLayout;
