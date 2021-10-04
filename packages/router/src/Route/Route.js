import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route as RouterRoute } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext/chromeRouterContext';

const Route = ({ path, ...props }) => {
    const { prependPath } = useContext(chromeRouterContext);
    /**
     * If the route is used outside of chrome context, or the context is broken, re-use the path from props
     */
    let internalPrependPath = typeof prependPath === 'function' ? prependPath : (path => path);
    let internalPath;
    if (typeof path === 'string') {
        internalPath = internalPrependPath(path);
    } else if (Array.isArray(path)) {
        internalPath = path.map((path) => internalPrependPath(path));
    }

    return <RouterRoute path={internalPath} {...props} />;
};

Route.propTypes = {
    path: PropTypes.oneOfType([ PropTypes.string, PropTypes.arrayOf(PropTypes.string) ])
};

export default Route;
