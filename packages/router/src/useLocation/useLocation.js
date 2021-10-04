import { useContext } from 'react';
import { useLocation as routerUseLocation } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext';

const useLocation = () => {
    const { removePathPrefix } = useContext(chromeRouterContext);
    const internalLocation = routerUseLocation();
    let internalRemovePathPrefix = typeof removePathPrefix === 'function' ? removePathPrefix : path => path;

    let location = {
        ...internalLocation,
        pathname: internalRemovePathPrefix(internalLocation.pathname)
    };

    return location;
};

export default useLocation;
