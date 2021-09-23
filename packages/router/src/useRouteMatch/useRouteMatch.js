import { useContext } from 'react';
import { useRouteMatch as routerUseRouteMatch } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext';

const useRouteMatch = (path = '/') => {
    const { prependPath } = useContext(chromeRouterContext);
    const internalPrependPath = typeof prependPath === 'function' ? prependPath : path => path;
    return routerUseRouteMatch(
        typeof path === 'string'
            ? internalPrependPath(path)
            : {
                ...path,
                path: internalPrependPath(path)
            }
    );

};

export default useRouteMatch;
