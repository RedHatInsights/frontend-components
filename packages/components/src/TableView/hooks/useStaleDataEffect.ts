/**
 * useStaleDataEffect Hook
 *
 * Handles debounced notifications when data needs to be refetched.
 * Calls immediately on mount, debounces subsequent calls.
 */

import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';

/**
 * Hook to handle debounced stale data notifications.
 *
 * IMPORTANT: Uses a ref to stabilize the callback reference, preventing
 * infinite re-render loops when consumers pass inline functions to onStaleData.
 *
 * @param params - Current API parameters
 * @param onStaleData - Callback to invoke when data is stale
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 */
export function useStaleDataEffect<TParams>(params: TParams, onStaleData?: (params: TParams) => void, debounceMs: number = 300): void {
  // Stabilize callback reference to prevent infinite loops from inline functions
  const callbackRef = useRef(onStaleData);
  callbackRef.current = onStaleData;

  // Create debounced version that always calls the latest callback
  // Only recreate if debounceMs changes - the callback is accessed via ref
  const debounced = useMemo(() => {
    return debounce((p: TParams) => callbackRef.current?.(p), debounceMs);
  }, [debounceMs]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!callbackRef.current) return;

    if (isInitialMount.current) {
      // Call immediately on mount (no debounce for initial load)
      isInitialMount.current = false;
      callbackRef.current(params);
    } else if (debounced) {
      // Debounce subsequent calls
      debounced(params);
    }

    return () => {
      debounced?.cancel?.();
    };
  }, [params, debounced]); // Note: no onStaleData in deps - we use callbackRef instead
}
