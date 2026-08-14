/**
 * useOptionalSearchParams Hook
 *
 * Provides URL search params functionality that gracefully handles
 * being used outside of a Router context.
 *
 * Uses useInRouterContext() to check for Router, then either uses
 * real useSearchParams or a local state fallback.
 */

import { useCallback, useState } from 'react';
import { useInRouterContext, useSearchParams } from 'react-router-dom';

type SetSearchParams = (fn: (prev: URLSearchParams) => URLSearchParams) => void;

export interface UseOptionalSearchParamsReturn {
  searchParams: URLSearchParams;
  setSearchParams: SetSearchParams;
  isRouterAvailable: boolean;
}

/**
 * Hook for components that ARE inside Router context.
 * Uses react-router-dom's useSearchParams directly.
 */
function useRouterParams(): UseOptionalSearchParamsReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const wrappedSetParams = useCallback<SetSearchParams>(
    (fn) => {
      setSearchParams((prev) => fn(prev));
    },
    [setSearchParams],
  );

  return {
    searchParams,
    setSearchParams: wrappedSetParams,
    isRouterAvailable: true,
  };
}

/**
 * Hook for components that don't want to use the URL.
 * Uses local state - changes are NOT persisted to URL.
 */
function useLocalParams(): UseOptionalSearchParamsReturn {
  const [searchParams, setLocalParams] = useState(() => new URLSearchParams());

  const setSearchParams = useCallback<SetSearchParams>((fn) => {
    setLocalParams((prev) => fn(prev));
  }, []);

  return {
    searchParams,
    setSearchParams,
    isRouterAvailable: false,
  };
}

/**
 * Safe version of useSearchParams that works outside Router context.
 *
 * **Behavior:**
 * - Inside Router: Uses real useSearchParams, syncs with URL
 * - Outside Router: Uses local state, does not sync with URL
 *
 * **Note:** This hook uses conditional hook calls based on router context.
 * This is safe because `useInRouterContext()` returns a stable value
 * (you can't move a component in/out of Router during its lifetime).
 *
 * @example
 * ```tsx
 * // Works anywhere - inside or outside Router
 * const { searchParams, setSearchParams } = useOptionalSearchParams();
 * ```
 */
export function useOptionalSearchParams(): UseOptionalSearchParamsReturn {
  const inRouter = useInRouterContext();

  // This conditional is safe because inRouter is stable for the component's lifetime.
  // A component can't move between router/non-router context without unmounting.
  return inRouter ? useRouterParams() : useLocalParams();
}
