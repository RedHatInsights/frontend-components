import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterNavLink } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext/chromeRouterContext';

const NavLink = ({ to, ...props }) => {
  const { prependTo } = useContext(chromeRouterContext);
  /**
   * If the NavLink is used outside of chrome context, or the context is broken, re-use the path from props
   */
  const internalPrependTo = typeof prependTo === 'function' ? prependTo : (to) => to;

  return <RouterNavLink to={internalPrependTo(to)} {...props} />;
};

NavLink.propTypes = {
  to: PropTypes.any.isRequired,
};

export default NavLink;
