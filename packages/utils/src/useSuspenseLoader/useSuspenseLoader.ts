import { useRef, useState } from 'react';
type LoaderCache<R> = {
  resolved: boolean;
  rejected: boolean;
  error?: unknown;
  promise?: Promise<R>;
  result?: R;
};
// This cache is super simple, might be problematic in some cases
function getCacheKey(...args: unknown[]): string {
  try {
    return JSON.stringify(args);
  } catch (error) {
    return 'undefined';
  }
}
const baseCacheValue = {
  resolved: false,
  rejected: false,
  error: undefined,
  promise: undefined,
  result: undefined,
};
/**
 * This is an experimental hook that allows you to use React suspense with a async loader function.
 * Be advised that not all use cases are covered and this is a very simple implementation.
 * The implementation is being tested in Chrome and Learning resources.
 *
 * @example
 *
 * const fetchData = async (id: string) => {...}
 *
 * const DisplayComponent = ({ loader }: {loader: UnwrappedLoader<fetchData>}) => {
 *   const data = loader('id');
 *   return <div>{JSON.stringify(data)}</div>;
 * }
 * const CacheLayer = () => {
 *  const { loader, purgeCache } = useSuspenseLoader(fetchData);
 *
 *  return (
 *    <Suspense fallback="Loading">
 *      <button onClick={purgeCache}>Purge Cache</button>
 *      <ErrorBoundaryPF headerTitle="Expected error">
 *        <DisplayComponent loader={loader} />
 *      </ErrorBoundaryPF>
 *    </Suspense>
 *  )
 * }
 *
 */
function useSuspenseLoader<R, T extends Array<unknown>>(
  asyncMethod: (...args: T) => Promise<R>,
  afterResolve?: (result: R) => void,
  afterReject?: (error: unknown) => void
) {
  const storage = useRef(new Map<string, LoaderCache<R>>());
  const [, setRender] = useState(0);
  function forceRender() {
    setRender((p) => p + 1);
  }
  return {
    loader: (...args: Parameters<typeof asyncMethod>) => {
      const cacheKey = getCacheKey(...args);
      let loaderCache = storage.current.get(cacheKey);

      if (loaderCache?.rejected) {
        throw loaderCache.error;
      }
      // desult will always have a type here
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (loaderCache?.resolved) return loaderCache.result!;
      if (loaderCache?.promise) {
        throw loaderCache.promise;
      }
      if (!storage.current.get(cacheKey)) {
        // this has to be copied because of the reference
        // if not copied, subsequent calls will override previous cache values
        storage.current.set(cacheKey, { ...baseCacheValue });
      }
      // cache will always exist here because it was created in the previous step
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      loaderCache = storage.current.get(cacheKey)!;
      loaderCache.promise = asyncMethod(...args)
        .then((res) => {
          const loaderCache = storage.current.get(cacheKey);
          if (!loaderCache) {
            throw 'No loader cache';
          }
          loaderCache.promise = undefined;
          loaderCache.resolved = true;
          loaderCache.result = res;
          afterResolve?.(res);
          forceRender();
          return res;
        })
        .catch((error) => {
          const loaderCache = storage.current.get(cacheKey);
          if (!loaderCache) {
            throw 'No loader cache';
          }
          loaderCache.promise = undefined;
          loaderCache.rejected = true;
          loaderCache.error = error;
          afterReject?.(error);
          forceRender();
          return error;
        });
      throw loaderCache.promise;
    },
    purgeCache: () => {
      // to restart the fetching after a mutation is done,
      // it has to be triggered manually
      storage.current.clear();
      forceRender();
    },
  };
}

export type UnwrappedLoader<F extends (...args: any[]) => Promise<unknown>> = (...arhs: Parameters<F>) => Awaited<ReturnType<F>>;

export default useSuspenseLoader;
