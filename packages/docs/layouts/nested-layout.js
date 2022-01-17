import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import ChromeLayout from './chrome';

/**
 * We could do some lazy loading magic but I don't really think its worth it
 * We are dealing with modules with a few lines of code
 */
const layoutMapper = {
  chrome: ChromeLayout,
};

const NestedLayout = ({ children }) => {
  const { pathname } = useRouter();
  const section = pathname.split('/')[1];
  const Component = layoutMapper[section] || Fragment;

  return <Component>{children}</Component>;
};

NestedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NestedLayout;
