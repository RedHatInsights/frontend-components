import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect as RouterRedirect } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext/chromeRouterContext';

const Redirect = ({ to, from, ...props }) => {
  const { prependTo, prependPath } = useContext(chromeRouterContext);
  /**
   * If the Redirect is used outside of chrome context, or the context is broken, re-use the path from props
   */
  const internalPrependTo = typeof prependTo === 'function' ? prependTo : (to) => to;
  const internalPrependPath = typeof prependPath === 'function' ? prependTo : (from) => from;

  const internalFrom = typeof from === 'string' ? internalPrependPath(from) : undefined;

  return <RouterRedirect from={internalFrom} to={internalPrependTo(to)} {...props} />;
};

Redirect.propTypes = {
  to: PropTypes.any.isRequired,
  from: PropTypes.string,
};

export default Redirect;
