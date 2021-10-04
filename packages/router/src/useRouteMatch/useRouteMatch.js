import { useContext } from 'react';
import { useRouteMatch as routerUseRouteMatch } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext';

const useRouteMatch = (path = '/') => {
    const { prependPath, removePathPrefix } = useContext(chromeRouterContext);
    const internalPrependPath = typeof prependPath === 'function' ? prependPath : path => path;
    const internalRemovePathPrefix = typeof removePathPrefix === 'function' ? removePathPrefix : path => path;
    const match = routerUseRouteMatch(
        typeof path === 'string'
            ? internalPrependPath(path)
            : {
                ...path,
                path: internalPrependPath(path)
            }
    );
    if (match) {
        return {
            ...match,
            path: internalRemovePathPrefix(match.path),
            url: internalRemovePathPrefix(match.url)
        };
    }

    return match;
};

export default useRouteMatch;
