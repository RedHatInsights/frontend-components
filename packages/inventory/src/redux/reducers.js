import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import entitiesReducer, { defaultState as entitiesDefault } from './entities';
import entityDetailsReducer, { defaultState as entityDefault } from './entityDetails';

export { entitiesReducer, entityDetailsReducer };

export function mergeWithEntities(additionalReducers = (state) => state) {
    return ({
        entities: (state, payload) => ({
            ...additionalReducers({
                ...applyReducerHash({
                    ...entitiesReducer
                }, entitiesDefault)(state, payload)
            }, payload)
        })
    });
}

export function mergeWithDetail(additionalReducers = (state) => state) {
    return ({
        entityDetails: (state, payload) => ({
            ...additionalReducers({
                ...applyReducerHash({
                    ...entityDetailsReducer
                }, entityDefault)(state, payload)
            }, payload)
        })
    });
}
