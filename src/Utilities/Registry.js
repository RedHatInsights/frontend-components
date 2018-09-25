import ReducerRegistry from './ReducerRegistry';
export let registry;

function init(initialState = {}, middleware = []) {
    if (!registry) {
        registry = new ReducerRegistry(initialState, [ ...middleware ]);
    }

    return registry;
}

export default function() {
    return function(target) {
      target.prototype.getRegistry = () => registry;
    }
}

export function getRegistry(initialState = {}, middleware = []) {
    return init(initialState, middleware);
}
