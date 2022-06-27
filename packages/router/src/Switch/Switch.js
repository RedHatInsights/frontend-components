import React, { useContext } from 'react';
import { Switch as RouterSwitch, matchPath, useLocation, useRouteMatch } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext/chromeRouterContext';

const Switch = ({ children, location: propsLocation }) => {
  const { prependPath } = useContext(chromeRouterContext);
  const location = useLocation();
  const contextMatch = useRouteMatch();
  const internalLocation = propsLocation || location;
  /**
   * If the route is used outside of chrome context, or the context is broken, re-use the path from props
   */
  let internalPrependPath = typeof prependPath === 'function' ? prependPath : (path) => path;

  let match;
  let element;
  /**
   * We have to recreate the whole switch component in order to properly access the child routes
   * The Switch scans trough its children, which in this case don't have the "true" path assigned in props
   * The switch would have to go a level deeper in orde to get the correct value.
   * We could potentially use clone element magic in the Route component, but is simpler.
   */
  React.Children.forEach(children, (child) => {
    if (!match && React.isValidElement(child)) {
      element = child;

      let path = child.props.path || child.props.from;
      if (typeof path === 'string') {
        path = internalPrependPath(path);
      } else if (Array.isArray(child.path)) {
        path = child.path.map((path) => internalPrependPath(path));
      }

      match = path ? matchPath(internalLocation.pathname, { ...child.props, path }) : contextMatch;
    }
  });

  return match ? React.cloneElement(element, { location, computedMatch: match }) : null;
};

Switch.propTypes = RouterSwitch.propTypes;

export default Switch;
