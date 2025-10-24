import { useEffect, useReducer } from "react";
import { createSharedStore } from "./createSharedStore";
import { ensureImmutability } from "./ensureImmutability";

export function useSubscribeStore<
S,
E extends readonly any[],
T
>(store: ReturnType<typeof createSharedStore<S, E>>, event: E[number], selector: (state: S) => T): T {
  const [value, dispatch] = useReducer(() => {
    const v = selector(store.getState());
    return ensureImmutability(v);
  }, selector(store.getState()));

  useEffect(() => {
    const unsubscribe = store.subscribe(event, dispatch);
    return () => {
      unsubscribe();
    }
  }, [store.subscribe])

  return value
}
