import ReducerRegistry from './ReducerRegistry';
let registry;

function init(initialState = {}, middleware = []) {
  if(!registry) {
    registry = new ReducerRegistry(initialState, [...middleware]);
  }
  return registry;
}

export default function(settings = {}) {
  return function(target) {
    target.prototype.registry = init(settings.initialState, settings.middleware);
  }
}

export function getStoreFromRegistry(initialState = {}, middleware = []) {
  return init(initialState, middleware).getStore();
}
