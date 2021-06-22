import { useScalprum } from '@scalprum/react-core';

const useChrome = (selector) => {
    const state = useScalprum();
    let chrome = state.api?.chrome || {};
    chrome = {
        ...chrome,
        initialized: state.initialized
    };
    if (typeof selector === 'function') {
        return selector(chrome);
    }

    return chrome;
};

export default useChrome;
