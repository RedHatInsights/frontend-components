import { AnyAction, Middleware, compose } from 'redux';

import ReducerRegistry from '../ReducerRegistry';

export let registry: ReducerRegistry<any>;

function init<T extends Record<string, unknown>>(initialState: T = {} as T, middleware: Middleware[] = [], composeEnhancersDefault?: typeof compose) {
  if (!registry) {
    registry = new ReducerRegistry(initialState, [...middleware], composeEnhancersDefault);
  }

  registry.register({
    routerData: (state: T, { type, payload }: AnyAction) => {
      return {
        ...state,
        ...(type === '@@INSIGHTS-CORE/NAVIGATION' ? payload : {}),
      };
    },
  });
  return registry;
}

export function registryDecorator() {
  return function (target: React.ComponentClass) {
    target.prototype.getRegistry = () => registry;
  };
}

export function getRegistry<T extends Record<string, unknown>>(
  initialState: T = {} as T,
  middleware: Middleware[] = [],
  composeEnhancersDefault?: typeof compose
) {
  return init(initialState, middleware, composeEnhancersDefault);
}

export default registryDecorator;
