import { useReducer, useRef } from 'react';

const useCallbackReducer = (reducer, initialState, initFn) => {
    const stateRef = useRef(initialState);

    const enhancedReducer = (...args) => {
        const newState = reducer(...args);

        stateRef.current = newState;

        return newState;
    };

    const [ state, originalDispatch ] = useReducer(enhancedReducer, initialState, initFn);

    const enhancedDispatch = async (args, callback) => {
        originalDispatch(args);
        callback && await callback(stateRef.current);
    };

    return [ state, enhancedDispatch ];
};

export default useCallbackReducer;
