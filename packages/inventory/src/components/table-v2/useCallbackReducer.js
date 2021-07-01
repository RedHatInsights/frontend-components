import { useReducer, useRef } from 'react';
import cloneDeep from 'lodash/cloneDeep';

const useCallbackReducer = (reducer, initialState, initFn) => {
    const stateRef = useRef(initialState);

    const enhancedReducer = (...args) => {
        const newState = reducer(...args);

        stateRef.current = newState;

        return newState;
    };

    const [ state, originalDispatch ] = useReducer(enhancedReducer, initialState, initFn);

    const enhancedDispatch = async (args, callback) => {
        if (callback) {
            await originalDispatch(args);
            await callback(cloneDeep(stateRef.current));
        } else {
            originalDispatch(args);
        }
    };

    return [ state, enhancedDispatch ];
};

export default useCallbackReducer;
