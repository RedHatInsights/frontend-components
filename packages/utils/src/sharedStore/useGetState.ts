import { useEffect, useReducer } from "react";
import { createSharedStore } from "./createSharedStore";
import { ensureImmutability } from "./ensureImmutability";

export function useGetState<S>(store: ReturnType<typeof createSharedStore<S, []>>) {
  const [value, dispatch] = useReducer(() => {
    const v = store.getState();
    return ensureImmutability(v);
  }, store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribeAll(dispatch);
    return () => {
      unsubscribe();
    }
  }, [store.subscribeAll])

  return value
}
