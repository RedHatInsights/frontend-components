import { applyReducerHash } from '../../Utilities/ReducerRegistry';
import entitiesReducer, { defaultState as entitiesDefault } from './inventory/entities';
import entityDetailsReducer, { defaultState as entityDefault } from './inventory/entityDetails';

export { entitiesReducer, entityDetailsReducer };

export function mergeWithEntities(additionalReducers = Function.prototype) {
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

export function mergeWithDetail(additionalReducers = Function.prototype) {
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
