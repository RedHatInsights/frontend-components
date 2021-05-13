import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import entitiesReducer, { defaultState as entitiesDefault } from './entities';
import entityDetailsReducer, { defaultState as entityDefault } from './entityDetails';

export { entitiesReducer, entityDetailsReducer };

export function mergeWithEntities(additionalReducers = (state) => state, defaultState = {}) {
    return ({
        entities: (state, payload) => ({
            ...additionalReducers({
                ...applyReducerHash({
                    ...entitiesReducer
                }, { ...entitiesDefault, ...defaultState })(state, payload)
            }, payload)
        })
    });
}

export function mergeWithDetail(additionalReducers = (state) => state, defaultState = {}) {
    return ({
        entityDetails: (state, payload) => ({
            ...additionalReducers({
                ...applyReducerHash({
                    ...entityDetailsReducer
                }, { ...entityDefault, ...defaultState })(state, payload)
            }, payload)
        })
    });
}
