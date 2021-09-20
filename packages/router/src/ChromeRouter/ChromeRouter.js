import React from 'react';
import PropTypes from 'prop-types';
import { ChromeRouterProvider } from '../chromeRouterContext/chromeRouterContext';

function prependPath(prefix = '', path = '') {
    return `${prefix.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

const ChromeRouter = ({ basename = '/', children }) => (
    <ChromeRouterProvider value={{ basename, prependPath }}>
        {children}
    </ChromeRouterProvider>
);

ChromeRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.node
};

export default ChromeRouter;
