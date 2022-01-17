import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext/chromeRouterContext';

const Link = ({ to, ...props }) => {
  const { prependTo } = useContext(chromeRouterContext);
  /**
   * If the Link is used outside of chrome context, or the context is broken, re-use the path from props
   */
  const internalPrependTo = typeof prependTo === 'function' ? prependTo : (to) => to;

  return <RouterLink to={internalPrependTo(to)} {...props} />;
};

Link.propTypes = RouterLink.propTypes;

export default Link;
