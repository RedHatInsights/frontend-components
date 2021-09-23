import React from 'react';
import PropTypes from 'prop-types';
import { ChromeRouterProvider } from '../chromeRouterContext/chromeRouterContext';

function prependPath(prefix = '', path = '') {
    return `${prefix.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function prependTo(prefix = '', to = '') {
    let internalTo = to;
    if (typeof to === 'string') {
        return prependPath(prefix, to).replace(/\/$/, '');
    }

    if (typeof to === 'object' && typeof to.pathname === 'string') {
        return {
            ...to,
            pathname: prependPath(prefix, to.pathname).replace(/\/$/, '')
        };
    }

    return internalTo;
}

function removePathPrefix(prefix = '', path = '') {
    return path.replace(new RegExp(`^${prefix}/?`), '/');
}

const ChromeRouter = ({ basename = '/', children }) => (
    <ChromeRouterProvider
        value={{
            basename,
            prependPath: (...args) => prependPath(basename, ...args),
            prependTo: (...args) => prependTo(basename, ...args),
            removePathPrefix: (...args) => removePathPrefix(basename, ...args)
        }}
    >
        {children}
    </ChromeRouterProvider>
);

ChromeRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.node
};

export default ChromeRouter;
