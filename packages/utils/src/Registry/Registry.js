import ReducerRegistry from '../ReducerRegistry';
export let registry;

function init(initialState = {}, middleware = [], composeEnhancersDefault) {
  if (!registry) {
    registry = new ReducerRegistry(initialState, [...middleware], composeEnhancersDefault);
  }

  registry.register({
    routerData: (state, { type, payload }) => {
      return {
        ...state,
        ...(type === '@@INSIGHTS-CORE/NAVIGATION' ? payload : {}),
      };
    },
  });
  return registry;
}

export function registryDecorator() {
  return function (target) {
    target.prototype.getRegistry = () => registry;
  };
}

export function getRegistry(initialState = {}, middleware = [], composeEnhancersDefault) {
  return init(initialState, middleware, composeEnhancersDefault);
}

export default registryDecorator;
